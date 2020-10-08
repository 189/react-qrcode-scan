import * as React from "react";
import "webrtc-adapter";
import plainError from "plainerror";
import CameraCore from "./core/camera";
import Scanner, { ScanOptions } from "./core/scanner";

const noop = (_: any) => { };

export type CameraItem = CameraCore;
export interface CameraProps {
    children: (cameras: CameraItem[]) => React.ReactNode;
    onError: (message) => void;
}

interface CameraState {
    ready: boolean;
}



export class Camera extends React.PureComponent<CameraProps, CameraState> {
    state: CameraState = {
        ready: false
    };
    cameras: CameraCore[];
    async componentDidMount() {
        const [err, cameras] = await plainError(CameraCore.getCameras, CameraCore)();
        if (err) {
            this.props?.onError(err);
            return;
        }
        this.cameras = cameras;
        this.setState({
            ready: true
        });
    }

    render() {
        const { ready } = this.state;
        return ready ? this.props.children(this.cameras) : null;
    }
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
}

export class QRScaner extends React.Component<QRScanerProps> {
    scanner: Scanner;
    previewer = React.createRef<HTMLVideoElement>();

    shouldComponentUpdate({ stop = false, onStop = noop, options = {}, camera }) {
        if (this.scanner) {
            if (stop) {
                this.scanner.stop().then(onStop).catch(onStop);
                return false;
            }
            if (camera && camera.id !== this.props.camera.id) {
                this.initScanner(camera, options);
            }
        }
        return false;
    }

    destroyScanner() {
        this.scanner.removeAllListeners();
        this.scanner?.stop?.();
        this.scanner = null;
    }

    initScanner(camera, options = {}) {
        this.scanner = new Scanner({ ...options, video: this.previewer.current });
        this.scanner.addListener("scan", this.props.onScan);
        this.scanner.addListener("active", this.props.onActive || noop);
        this.scanner.addListener("inActive", this.props.onInActive || noop);
        this.props?.onStart?.(camera);
        this.scanner.start(camera);
    }

    componentDidMount() {
        const { camera, options = {} } = this.props;
        this.initScanner(camera, options);
    }

    componentWillUnmount() {
        this.destroyScanner();
    }

    render() {
        return <video ref={this.previewer} />;
        // return React.cloneElement(child as any, { ref: this.previewer });
    }
}