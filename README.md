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

|      name         |         type      |  required  |                     description                   |
|-------------------|-------------------|------------|---------------------------------------------------|
| camera            | object            |  true      | Camera object returned by \<Camera \/\>           |
| onError           | (err:Error) => volid     |  true   | Emitted when scan got error
| onScan            | (content:string) => volid |  true   | Emitted when a QR code is scanned using the camera in continuous mode |
| stop              | boolean                   |  false      | If stop is true the camera stops and vice-versa   |
| onStart           | (camera) => volid         |  false     | Called when camera is active and scanning has started |
| onStop            | () => volid               |  false      | Called when camera and scanning have stopped |
| onActive          | function                  |  false     | Emitted when the scanner becomes active as the result of stop becoming false or the tab gaining focus |
| onInactive        | () => volid               |  false     | Emitted when the scanner becomes inactive as the result of stop becoming true or the tab losing focus |
| className         | string                    |  false     | classname, will be used for descript video tag |  
| options           | object                    |  false     | Same options from [Instascan.Scanner][scanoption] |
| style             | React.cssProperty         |  false     | inline styles, will be pass to video tag |
| videoAttr         | React.VideoHTMLAttributes<any> | false | video tag attribute


[scanoption]: https://github.com/schmich/instascan#let-scanner--new-instascanscanneropts

For more details check the [Instascan API](https://github.com/schmich/instascan#api)

##### How to run example

```
$ git clone repo
$ yarn run start
$ open http://localhost:8898
```

