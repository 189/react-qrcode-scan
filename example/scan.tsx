import * as React from "react";
import { QRScaner, Camera, CameraItem } from "../lib";
import "./style.css";

interface RenderProps { }

interface RenderState {
    results: { date: number, content: string }[];
    camera: CameraItem | null;
}

export default class QRReader extends React.Component<RenderProps, RenderState> {
    state: RenderState = {
        results: [],
        camera: null
    };
    onError = (message) => console.error(message);
    onScan = (content) => {
        const results = this.state.results;
        results.unshift({
            date: Date.now(),
            content
        });
        this.setState({
            results
        });
    }
    onStart = (camera) => {
        this.setState({
            camera
        });
    }
    render() {
        const { results, camera } = this.state;
        return (
            <Camera onError={this.onError}>
                { cameras => cameras.length > 0 ?
                    <div className="qrwrap">
                        <div className="main">
                            <h2>Scan QR Code</h2>
                            <QRScaner onStart={this.onStart} onScan={this.onScan} camera={cameras[0]} onError={this.onError} />
                        </div>
                        <aside>
                            <section>
                                <h3>Camera:</h3>
                                <div>{camera ? camera.name : ""}</div>
                            </section>
                            <section>
                                <h3>Results:</h3>
                                <ul>
                                    {results.map(result => <li key={result.date}>{result.content}</li>)}
                                </ul>
                            </section>
                        </aside>

                    </div>
                    : <div> No Camera</div>}
            </Camera>
        );
    }
}
