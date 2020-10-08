# react-qrcode-scan

React componnent write by typescript for scan qrcode. Base on instascan.js


#### Usage 

```
yarn add react-qrcode-scan
// or
npm install react-qrcode-scan --save
```

```
import { QRScaner, Camera } from "react-qrcode-scan";

export default class QRReader extends React.Component<RenderProps, RenderState> {
    ...
    render() {
        const { results, camera } = this.state;
        return (
            <Camera onError={this.onError}>
                { cameras => cameras.length > 0 ?
                    <QRScaner onStart={this.onStart} onScan={this.onScan} camera={cameras[0]} onError={this.onError} />
                    : <div> No Camera</div>}
            </Camera>
        );
    }
}
```

> You can get full example code [Here](./example/scan.tsx)   
> Or See [Live example](https://189.github.io/react-qrcode-scan/dist/index.html)

#### API

react-qrcode-scan exports two component:

##### `<Camera />`

`<Camera/>` will fetch for the available cameras on your device, and return the camera device list;


##### `<QRScaner/>`  

Scanner Properties

|      name         |         type      |                     description                   |
|-------------------|-------------------|---------------------------------------------------|
| camera            | object            | Camera object returned by \<Camera \/\>           |
| options           | object            | Same options from [Instascan.Scanner](https://github.com/schmich/instascan#let-scanner--new-instascanscanneropts)|
| stop              | boolean           | If stop is true the camera stops and vice-versa   |
| onScan            | function          | Emitted when a QR code is scanned using the camera in continuous mode |
| onStart           | function          | Called when camera is active and scanning has started |
| onStop            | function          | Called when camera and scanning have stopped |
| onActive          | function          | Emitted when the scanner becomes active as the result of stop becoming false or the tab gaining focus |
| onInactive        | function          | Emitted when the scanner becomes inactive as the result of stop becoming true or the tab losing focus |

For more details check the [Instascan API](https://github.com/schmich/instascan#api)

##### How to run example

```
$ git clone repo
$ yarn run start
$ open http://localhost:8898
```

