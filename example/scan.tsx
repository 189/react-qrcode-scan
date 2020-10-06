import * as React from "react";

import Instascan from "../src";

interface RenderProps {
    onScan: (content: string) => void;
    onError: (message: string) => void;
}

interface RenderState {
    loading: boolean;
}

const boxStyles = {
    width: 300,
    height: 300,
    margin: "20px auto"
}
export default class QRScaner extends React.PureComponent<RenderProps, RenderState> {

    scanner: any;
    previewer = React.createRef<HTMLVideoElement>();

    componentDidMount() {
        this.scanner = new Instascan.Scanner({ video: this.previewer.current });
        this.scanner.addListener("scan", (content) => {
            this.props?.onScan?.(content);
        });
        Instascan.Camera.getCameras()
            .then((cameras) => {
                if (cameras.length > 0) {
                    this.scanner.start(cameras[0]);
                } else {
                    this.props.onError("The camera is not recognized and the scan function cannot be used");
                }
            })
            .catch((e) => {
                this.props.onError(e.toString());
            });
    }

    componentWillUnmount() {
        this.scanner?.stop?.();
    }

    render() {
        return (
            <div style={boxStyles} >
                <video height="100%" width="100%" style={{ border: "1px solid #ccc" }} ref={this.previewer} />
            </div>
        );
    }
}
