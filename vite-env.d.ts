/// <reference types="vite/client" />
/// <reference types="@webgpu/types" />
/// <reference types="wicg-file-system-access" />

interface FileSystemFileHandle {
    remove(): Promise<void>;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.scss' {
    const value: string;
    export default value;
}

declare module '*.css' {
    const value: string;
    export default value;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
