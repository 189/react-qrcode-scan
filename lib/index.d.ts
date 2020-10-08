import * as React from "react";
import "webrtc-adapter";
import CameraCore from "./core/camera";
import Scanner, { ScanOptions } from "./core/scanner";
export declare type CameraItem = CameraCore;
export interface CameraProps {
    children: (cameras: CameraItem[]) => React.ReactNode;
    onError: (message: any) => void;
}
interface CameraState {
    ready: boolean;
}
export declare class Camera extends React.PureComponent<CameraProps, CameraState> {
    state: CameraState;
    cameras: CameraCore[];
    componentDidMount(): Promise<void>;
    render(): {};
}
export interface QRScanerProps {
    camera: CameraCore;
    stop?: boolean;
    options?: ScanOptions;
    onScan: (content: string) => void;
    onError: (message: string) => void;
    onStart?: (camera: CameraItem) => void;
    onStop?: () => void;
    onActive?: () => void;
    onInActive?: () => void;
    style?: React.CSSProperties;
    className?: string;
    videoAttr?: React.VideoHTMLAttributes<any>;
}
export declare class QRScaner extends React.Component<QRScanerProps> {
    scanner: Scanner;
    previewer: React.RefObject<HTMLVideoElement>;
    shouldComponentUpdate({ stop, onStop, options, camera }: {
        stop?: boolean;
        onStop?: (_: any) => void;
        options?: {};
        camera: any;
    }): boolean;
    destroyScanner(): void;
    initScanner(camera: any, options?: {}): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
