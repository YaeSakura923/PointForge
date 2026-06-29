/**
 * DataWorker client API — typed Promise-based wrapper around
 * the file-parsing Web Worker.
 *
 * Usage:
 *   import { createWorkerClient } from './workers';
 *   const client = createWorkerClient();
 *   const result = await client.parseFile('scene.ply', arrayBuffer, {
 *     onProgress: (pct, msg) => console.log(`${pct}%: ${msg}`)
 *   });
 *   client.terminate();
 */

import type { Options } from '@playcanvas/splat-transform';

// ---------------------------------------------------------------------------
// Typed message interfaces
// ---------------------------------------------------------------------------

/** Message sent from the main thread to the worker. */
export interface DataWorkerMessage {
    type: 'parse-file';
    /** Unique request id used to correlate the response. */
    id: number;
    /** Original filename (used for format detection). */
    filename: string;
    /** Raw file bytes — ownership is transferred to the worker. */
    buffer: ArrayBuffer;
    /** Optional splat-transform Options overrides. */
    options?: Partial<Options>;
}

/** Progress update emitted by the worker during parsing. */
export interface DataWorkerProgressResponse {
    type: 'progress';
    id: number;
    /** Value in [0, 1]. */
    progress: number;
    /** Human-readable status message. */
    message: string;
}

/** Serialised per-column data returned by the worker. */
export interface DataWorkerColumnData {
    /** Column name, e.g. 'x', 'f_dc_0', 'opacity'. */
    name: string;
    /** Splat-transform data type string, e.g. 'float32', 'uint8'. */
    dataType: string;
    /** Transferred ArrayBuffer containing the raw column values. */
    buffer: ArrayBuffer;
    /** Bytes per element (e.g. 4 for Float32Array). */
    byteSize: number;
}

/** Successful parse result from the worker. */
export interface DataWorkerResultResponse {
    type: 'result';
    id: number;
    /** One entry per column in the parsed DataTable. */
    columns: DataWorkerColumnData[];
    /** Total number of rows (splats). */
    numRows: number;
    /** Coordinate-system transform embedded in the file. */
    transform: {
        position: [number, number, number];
        rotation: [number, number, number, number];
        scale: [number, number, number];
    };
}

/** Error reported by the worker. */
export interface DataWorkerErrorResponse {
    type: 'error';
    id: number;
    message: string;
}

/** Union of all possible messages the worker can send back. */
export type DataWorkerResponse =
    | DataWorkerProgressResponse
    | DataWorkerResultResponse
    | DataWorkerErrorResponse;

// ---------------------------------------------------------------------------
// Client-facing types
// ---------------------------------------------------------------------------

/** Options passed to {@link DataWorkerClient.parseFile}. */
export interface ParseOptions extends Partial<Options> {
    /**
     * Progress callback invoked by the worker at key milestones.
     *
     * @param progress - Completion fraction in [0, 1].
     * @param message  - Human-readable status, e.g. "Parsing file..."
     */
    onProgress?: (progress: number, message: string) => void;
}

/** Resolved value returned by {@link DataWorkerClient.parseFile}. */
export interface ParseResult {
    columns: DataWorkerColumnData[];
    numRows: number;
    transform: DataWorkerResultResponse['transform'];
}

// ---------------------------------------------------------------------------
// DataWorkerClient
// ---------------------------------------------------------------------------

/**
 * Creates, manages, and communicates with the file-parsing Web Worker.
 *
 * Each instance owns a dedicated Worker thread.  For best performance,
 * reuse a single client across multiple parses rather than creating a
 * new one per file.
 */
export class DataWorkerClient {
    private readonly worker: Worker;
    private readonly pending = new Map<number, {
        resolve: (value: ParseResult) => void;
        reject: (reason: Error) => void;
        onProgress?: (progress: number, message: string) => void;
    }>();
    private nextId = 1;

    constructor() {
        this.worker = new Worker(
            new URL('./data.worker.ts', import.meta.url),
            { type: 'module' }
        );
        this.worker.onmessage = this.handleMessage;
        this.worker.onerror = this.handleWorkerError;
    }

    /**
     * Parse a file from an `ArrayBuffer`.
     *
     * **Important:** the buffer is **transferred** to the worker (zero-copy)
     * and becomes unusable in the main thread after this call returns.
     *
     * @param filename - Original filename (e.g. `"scene.ply"`) used for format detection.
     * @param buffer   - The raw file bytes. Ownership is transferred.
     * @param options  - Optional splat-transform overrides and progress callback.
     * @returns A promise that resolves with the parsed column data and metadata.
     */
    parseFile(filename: string, buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult> {
        const { onProgress, ...splatOptions } = options ?? {};
        const id = this.nextId++;

        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject, onProgress });

            const message: DataWorkerMessage = {
                type: 'parse-file',
                id,
                filename,
                buffer,
                options: splatOptions
            };

            // Transfer buffer ownership for zero-copy
            this.worker.postMessage(message, [buffer]);
        });
    }

    /**
     * Terminate the worker thread and reject all in-flight requests.
     */
    terminate(): void {
        for (const [, pending] of this.pending) {
            pending.reject(new Error('Worker terminated'));
        }
        this.pending.clear();
        this.worker.terminate();
    }

    // ------------------------------------------------------------------
    // Internal handlers
    // ------------------------------------------------------------------

    private handleMessage = (event: MessageEvent<DataWorkerResponse>): void => {
        const response = event.data;
        if (!response || typeof response.id !== 'number') {
            return;
        }

        const pending = this.pending.get(response.id);
        if (!pending) {
            return;
        }

        switch (response.type) {
            case 'progress':
                pending.onProgress?.(response.progress, response.message);
                break;

            case 'result':
                this.pending.delete(response.id);
                pending.resolve({
                    columns: response.columns,
                    numRows: response.numRows,
                    transform: response.transform
                });
                break;

            case 'error':
                this.pending.delete(response.id);
                pending.reject(new Error(response.message));
                break;
        }
    };

    private handleWorkerError = (event: ErrorEvent): void => {
        const message = event.message || 'Unknown worker error';
        for (const [, pending] of this.pending) {
            pending.reject(new Error(message));
        }
        this.pending.clear();
    };
}

/**
 * Convenience factory for {@link DataWorkerClient}.
 *
 * ```ts
 * const client = createWorkerClient();
 * const { columns, numRows } = await client.parseFile('scene.ply', buffer);
 * client.terminate();
 * ```
 */
export function createWorkerClient(): DataWorkerClient {
    return new DataWorkerClient();
}
