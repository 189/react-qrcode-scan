import * as React from "react";
import * as ReactDOM from "react-dom";

import Scan from "./scan";

function onScan(content: string) {
    console.log(content);
}

function onError(message: string) {
    console.log(message);
}

ReactDOM.render(<Scan onScan={onScan} onError={onError} />, document.getElementById("app"));
