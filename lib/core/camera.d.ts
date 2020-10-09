declare class Camera {
    id: string;
    name: string | null;
    _stream: any;
    constructor(id: string, name: string | null);
    start(): Promise<any>;
    stop(): void;
    static getCameras(): Promise<Camera[]>;
    static _ensureAccess(): Promise<void>;
}
export default Camera;
