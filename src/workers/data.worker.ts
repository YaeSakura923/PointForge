/**
 * Web Worker for offloading PLY/SPZ/SOG file parsing from the main thread.
 *
 * Implements in-memory file-system adapters so that @playcanvas/splat-transform
 * can parse files directly from ArrayBuffer data transferred by the main thread.
 *
 * Communication protocol (main -> worker):
 *   { type: 'parse-file'; id: number; filename: string; buffer: ArrayBuffer; options?: Partial<Options> }
 *
 * Communication protocol (worker -> main):
 *   { type: 'progress'; id: number; progress: number; message: string }
 *   { type: 'result';   id: number; columns: ColumnData[]; numRows: number; transform: {...} }
 *   { type: 'error';    id: number; message: string }
 */

import {
    BufferedReadStream,
    getInputFormat,
    readFile,
    sortMortonOrder,
    ZipReadFileSystem,
    type Column,
    type DataTable,
    type Options,
    type ReadFileSystem,
    type ReadSource,
    type ReadStream
} from '@playcanvas/splat-transform';

// ---------------------------------------------------------------------------
// In-Memory File-System for Worker Context
// ---------------------------------------------------------------------------

const BLOB_CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

/**
 * A ReadStream backed by a slice of a Uint8Array — no DOM or Node APIs needed.
 */
class BufferReadStream extends ReadStream {
    private readonly buffer: Uint8Array;
    private offset: number;
    private readonly end: number;

    constructor(buffer: Uint8Array, start: number, end: number) {
        super(end - start);
        this.buffer = buffer;
        this.offset = start;
        this.end = end;
    }

    async pull(target: Uint8Array): Promise<number> {
        const remaining = this.end - this.offset;
        if (remaining <= 0) {
            return 0;
        }
        const bytesToRead = Math.min(target.length, remaining);
        target.set(this.buffer.subarray(this.offset, this.offset + bytesToRead));
        this.offset += bytesToRead;
        this.bytesRead += bytesToRead;
        return bytesToRead;
    }
}

/**
 * A ReadSource backed by a single ArrayBuffer.
 */
class BufferReadSource implements ReadSource {
    readonly size: number;
    readonly seekable: boolean = true;

    private readonly buffer: Uint8Array;
    private closed: boolean = false;

    constructor(buffer: ArrayBuffer) {
        this.buffer = new Uint8Array(buffer);
        this.size = buffer.byteLength;
    }

    read(start: number = 0, end: number = this.size): ReadStream {
        if (this.closed) {
            throw new Error('Source has been closed');
        }
        const clampedStart = Math.max(0, Math.min(start, this.size));
        const clampedEnd = Math.max(clampedStart, Math.min(end, this.size));
        const raw = new BufferReadStream(this.buffer, clampedStart, clampedEnd);
        return new BufferedReadStream(raw, BLOB_CHUNK_SIZE);
    }

    close(): void {
        this.closed = true;
    }
}

/**
 * A ReadFileSystem that maps filenames to in-memory ArrayBuffers.
 */
class BufferReadFileSystem implements ReadFileSystem {
    private readonly files = new Map<string, ArrayBuffer>();

    addFile(name: string, buffer: ArrayBuffer): void {
        this.files.set(name.toLowerCase(), buffer);
    }

    async createSource(filename: string): Promise<ReadSource> {
        const buffer = this.files.get(filename.toLowerCase());
        if (!buffer) {
            throw new Error(`File not found in buffer filesystem: ${filename}`);
        }
        return new BufferReadSource(buffer);
    }
}

// ---------------------------------------------------------------------------
// Message Types (worker-internal)
// ---------------------------------------------------------------------------

interface ParseRequest {
    type: 'parse-file';
    id: number;
    filename: string;
    buffer: ArrayBuffer;
    options?: Partial<Options>;
}

interface ProgressResponse {
    type: 'progress';
    id: number;
    progress: number;
    message: string;
}

interface ColumnData {
    name: string;
    dataType: string;
    buffer: ArrayBuffer;
    byteSize: number;
}

interface ResultResponse {
    type: 'result';
    id: number;
    columns: ColumnData[];
    numRows: number;
    transform: {
        position: [number, number, number];
        rotation: [number, number, number, number];
        scale: [number, number, number];
    };
}

interface ErrorResponse {
    type: 'error';
    id: number;
    message: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultOptions: Options = {
    iterations: 10,
    lodSelect: [0],
    unbundled: false,
    lodChunkCount: 512,
    lodChunkExtent: 16
};

/**
 * Extract a standalone ArrayBuffer from a TypedArray that may be a view
 * onto a larger buffer. If the view covers the entire buffer we can transfer
 * it directly; otherwise we slice out the relevant bytes.
 */
function extractBuffer(typedArray: { buffer: ArrayBuffer; byteOffset: number; byteLength: number }): ArrayBuffer {
    if (typedArray.byteOffset === 0 && typedArray.byteLength === typedArray.buffer.byteLength) {
        return typedArray.buffer;
    }
    return typedArray.buffer.slice(typedArray.byteOffset, typedArray.byteOffset + typedArray.byteLength);
}

function postProgress(id: number, progress: number, message: string): void {
    const msg: ProgressResponse = { type: 'progress', id, progress, message };
    self.postMessage(msg);
}

function postResult(id: number, dataTable: DataTable): void {
    const columns: ColumnData[] = dataTable.columns.map((col: Column) => ({
        name: col.name,
        dataType: col.dataType ?? 'float32',
        buffer: extractBuffer(col.data),
        byteSize: col.data.BYTES_PER_ELEMENT
    }));

    const result: ResultResponse = {
        type: 'result',
        id,
        columns,
        numRows: dataTable.numRows,
        transform: {
            position: [...dataTable.transform.position] as [number, number, number],
            rotation: [...dataTable.transform.rotation] as [number, number, number, number],
            scale: [...dataTable.transform.scale] as [number, number, number]
        }
    };

    // Transfer column buffers for zero-copy handoff to the main thread
    const transferList = columns.map(c => c.buffer);
    self.postMessage(result, transferList);
}

function postError(id: number, message: string): void {
    const msg: ErrorResponse = { type: 'error', id, message };
    self.postMessage(msg);
}

// ---------------------------------------------------------------------------
// Parse Handler
// ---------------------------------------------------------------------------

async function handleParseFile(request: ParseRequest): Promise<void> {
    const { id, filename, buffer, options } = request;

    try {
        postProgress(id, 0, `Reading ${filename}...`);

        const inputFormat = getInputFormat(filename);
        const mergedOptions: Options = { ...defaultOptions, ...options };
        const fileSystem = new BufferReadFileSystem();

        // Register the transferred buffer under the requested filename so that
        // readFile / ZipReadFileSystem can locate it.
        fileSystem.addFile(filename, buffer);

        // ------------------------------------------------------------------
        // SOG (bundled) format — wrap in ZipReadFileSystem
        // ------------------------------------------------------------------
        if (inputFormat === 'sog' && filename.toLowerCase().endsWith('.sog')) {
            postProgress(id, 0.1, 'Opening SOG archive...');
            const source = await fileSystem.createSource(filename);
            const zipFs = new ZipReadFileSystem(source);
            try {
                postProgress(id, 0.2, 'Parsing SOG metadata...');
                const tables = await readFile({
                    filename: 'meta.json',
                    inputFormat: 'sog',
                    options: mergedOptions,
                    params: [],
                    fileSystem: zipFs
                });
                postProgress(id, 0.9, 'Processing splat data...');
                postResult(id, tables[0]);
            } finally {
                zipFs.close();
            }
            return;
        }

        // ------------------------------------------------------------------
        // All other formats (PLY, SPZ, SPLAT, KSPLAT, compressed PLY, LCC)
        // ------------------------------------------------------------------
        postProgress(id, 0.15, 'Parsing file...');
        const tables = await readFile({
            filename,
            inputFormat,
            options: mergedOptions,
            params: [],
            fileSystem
        });

        const lowerFilename = filename.toLowerCase();

        // Morton-order reordering — improves GPU rendering locality.
        // Skipped for:
        //  - SOG format (already morton-ordered)
        //  - Compressed PLY (already morton-ordered from write-compressed-ply)
        const isCompressedPly = lowerFilename.endsWith('.compressed.ply');
        if (inputFormat !== 'sog' && !isCompressedPly) {
            postProgress(id, 0.7, 'Reordering data (Morton order)...');
            const indices = new Uint32Array(tables[0].numRows);
            for (let i = 0; i < indices.length; i++) {
                indices[i] = i;
            }
            sortMortonOrder(tables[0], indices);
            tables[0].permuteRowsInPlace(indices);
        }

        postProgress(id, 0.95, 'Preparing result...');
        postResult(id, tables[0]);

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        postError(id, message);
    }
}

// ---------------------------------------------------------------------------
// Worker Entry Point
// ---------------------------------------------------------------------------

self.onmessage = (event: MessageEvent<ParseRequest>) => {
    const message = event.data;
    if (message && message.type === 'parse-file') {
        handleParseFile(message);
    }
};
