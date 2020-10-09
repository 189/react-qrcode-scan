/// <reference types="node" />
import { EventEmitter } from "events";
declare class ScanProvider {
    _active: boolean;
    scanPeriod: number;
    captureImage: boolean;
    refractoryPeriod: number;
    _emitter: Scanner;
    _frameCount: number;
    _analyzer: Analyzer;
    _lastResult: any;
    refractoryTimeout: NodeJS.Timeout;
    constructor(emitter: Scanner, analyzer: Analyzer, captureImage: boolean, scanPeriod: number, refractoryPeriod: number);
    start(): void;
    stop(): void;
    scan(): {
        content: string;
        image?: string;
    };
    _analyze(skipDups: boolean): {
        content: string;
        image?: string;
    } | null;
    _scan(): void;
}
declare class Analyzer {
    video: HTMLVideoElement;
    sensorLeft: number;
    sensorTop: number;
    sensorWidth: number;
    sensorHeight: number;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    decodeCallback: any;
    imageBuffer: any;
    constructor(video: HTMLVideoElement);
    analyze(): {
        result: string;
        canvas: HTMLCanvasElement;
    };
}
export interface ScanOptions {
    video?: HTMLVideoElement;
    continuous?: boolean;
    mirror?: boolean;
    captureImage?: boolean;
    backgroundScan?: boolean;
    refractoryPeriod?: number;
    scanPeriod?: number;
}
export default class Scanner extends EventEmitter {
    video: HTMLVideoElement;
    backgroundScan: boolean;
    _continuous: boolean;
    _analyzer: Analyzer;
    _camera: any;
    _scanner: ScanProvider;
    _fsm: any;
    _mirror: any;
    constructor(opts: ScanOptions);
    scan(): {
        content: string;
        image?: string;
    };
    start(camera?: any): Promise<any>;
    stop(): Promise<void>;
    set captureImage(capture: boolean);
    get captureImage(): boolean;
    set scanPeriod(period: number);
    get scanPeriod(): number;
    set refractoryPeriod(period: number);
    get refractoryPeriod(): number;
    set continuous(continuous: boolean);
    get continuous(): boolean;
    set mirror(mirror: any);
    get mirror(): any;
    _enableScan(camera: any): Promise<void>;
    _disableScan(): void;
    _configureVideo(opts: {
        video?: HTMLVideoElement;
    }): HTMLVideoElement;
    _createStateMachine(): any;
}
export {};
