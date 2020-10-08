// const EventEmitter = require("events");
import { EventEmitter } from "events";
const ZXing = require("./zxing")();
// https://www.npmjs.com/package/visibilityjs
// const Visibility = require("visibilityjs");
import * as Visibility from "visibilityjs";
// https://github.com/jakesgordon/javascript-state-machine
// https://github.com/vstirbu/fsm-as-promised

const StateMachine = require("fsm-as-promised");
class ScanProvider {

  _active: boolean;
  scanPeriod: number;
  captureImage: boolean;
  refractoryPeriod: number;
  _emitter: Scanner;
  _frameCount: number;
  _analyzer: Analyzer;
  _lastResult: any;
  refractoryTimeout: NodeJS.Timeout;

  constructor(emitter: Scanner, analyzer: Analyzer, captureImage: boolean, scanPeriod: number, refractoryPeriod: number) {
    this.scanPeriod = scanPeriod;
    this.captureImage = captureImage;
    this.refractoryPeriod = refractoryPeriod;
    this._emitter = emitter;
    this._frameCount = 0;
    this._analyzer = analyzer;
    this._lastResult = null;
    this._active = false;
  }

  start() {
    this._active = true;
    requestAnimationFrame(() => this._scan());
  }

  stop() {
    this._active = false;
  }

  scan() {
    return this._analyze(false);
  }

  _analyze(skipDups: boolean): { content: string; image?: string } | null {
    let analysis = this._analyzer.analyze();
    if (!analysis) {
      return null;
    }

    let { result, canvas } = analysis;
    if (!result) {
      return null;
    }

    if (skipDups && result === this._lastResult) {
      return null;
    }

    clearTimeout(this.refractoryTimeout);
    this.refractoryTimeout = setTimeout(() => {
      this._lastResult = null;
    }, this.refractoryPeriod);

    let image = this.captureImage ? canvas.toDataURL("image/webp", 0.8) : null;

    this._lastResult = result;

    let payload: { content: string; image?: string } = { content: result };
    if (image) {
      payload.image = image;
    }

    return payload;
  }

  _scan() {
    if (!this._active) {
      return;
    }

    requestAnimationFrame(() => this._scan());

    if (++this._frameCount !== this.scanPeriod) {
      return;
    } else {
      this._frameCount = 0;
    }

    let result = this._analyze(true);
    if (result) {
      setTimeout(() => {
        this._emitter.emit("scan", result?.content, result?.image || null);
      }, 0);
    }
  }
}


class Analyzer {
  video: HTMLVideoElement;
  sensorLeft: number;
  sensorTop: number;
  sensorWidth: number;
  sensorHeight: number;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  decodeCallback: any;
  imageBuffer: any;

  constructor(video: HTMLVideoElement) {
    this.video = video;

    this.imageBuffer = null;

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";

    this.decodeCallback = ZXing.Runtime.addFunction(function (ptr: any, len: number, resultIndex: number) {
      let result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len);
      let str = String.fromCharCode.apply(null, result);
      if (resultIndex === 0) {
        window.zxDecodeResult = "";
      }
      window.zxDecodeResult += str;
    });
  }

  analyze() {
    if (!this.video.videoWidth) {
      return null;
    }

    if (!this.imageBuffer) {
      let videoWidth = this.video.videoWidth;
      let videoHeight = this.video.videoHeight;

      this.sensorWidth = videoWidth;
      this.sensorHeight = videoHeight;
      this.sensorLeft = Math.floor((videoWidth / 2) - (this.sensorWidth / 2));
      this.sensorTop = Math.floor((videoHeight / 2) - (this.sensorHeight / 2));

      this.canvas.width = this.sensorWidth;
      this.canvas.height = this.sensorHeight;

      this.canvasContext = this.canvas.getContext("2d")!;
      this.imageBuffer = ZXing._resize(this.sensorWidth, this.sensorHeight);
      return null;
    }

    this.canvasContext.drawImage(
      this.video,
      this.sensorLeft,
      this.sensorTop,
      this.sensorWidth,
      this.sensorHeight
    );

    let data = this.canvasContext.getImageData(0, 0, this.sensorWidth, this.sensorHeight).data;
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      ZXing.HEAPU8[this.imageBuffer + j] = Math.trunc((r + g + b) / 3);
    }

    let err = ZXing._decode_qr(this.decodeCallback);
    if (err) {
      return null;
    }

    let result = window.zxDecodeResult;
    if (result != null) {
      return { result: result, canvas: this.canvas };
    }

    return null;
  }
}

//         this.scanner = new Instascan.Scanner({ video: this.previewer.current });
//         this.scanner.addListener("scan", (content) => {
//             this.props?.onScan?.(content);
//         });
//         Instascan.Camera.getCameras()
//             .then((cameras) => {
//                 if (cameras.length > 0) {
//                     this.scanner.start(cameras[0]);
//                 } else {
//                     this.props.onError("The camera is not recognized and the scan function cannot be used");
//                 }
//             })
//             .catch((e) => {
//                 this.props.onError(e.toString());
//             });

export interface ScanOptions {
  // The HTML element to use for the camera"s video preview. Must be a <video> element.
  // When the camera is active, this element will have the "active" CSS class, otherwise,
  // it will have the "inactive" class. By default, an invisible element will be created to
  // host the video.
  video?: HTMLVideoElement;
  // Whether to scan continuously for QR codes. If false, use scanner.scan() to manually scan.
  // If true, the scanner emits the "scan" event when a QR code is scanned. Default true.
  continuous?: boolean;
  // Whether to horizontally mirror the video preview. This is helpful when trying to
  // scan a QR code with a user-facing camera. Default true.
  mirror?: boolean;
  // Whether to include the scanned image data as part of the scan result. See the "scan" event
  // for image format details. Default false.
  captureImage?: boolean;
  // Only applies to continuous mode. Whether to actively scan when the tab is not active.
  // When false, this reduces CPU usage when the tab is not active. Default true.
  backgroundScan?: boolean;
  // Only applies to continuous mode. The period, in milliseconds, before the same QR code
  // will be recognized in succession. Default 5000 (5 seconds).
  refractoryPeriod?: number;
  // Only applies to continuous mode. The period, in rendered frames, between scans. A lower scan period
  // increases CPU usage but makes scan response faster. Default 1 (i.e. analyze every frame).
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

  constructor(opts: ScanOptions) {
    super();
    this.video = this._configureVideo(opts);
    this.mirror = (opts.mirror !== false);
    this.backgroundScan = (opts.backgroundScan !== false);
    this._continuous = (opts.continuous !== false);
    this._analyzer = new Analyzer(this.video);
    this._camera = null;

    let captureImage = opts.captureImage || false;
    let scanPeriod = opts.scanPeriod || 1;
    let refractoryPeriod = opts.refractoryPeriod || (5 * 1000);

    this._scanner = new ScanProvider(this, this._analyzer, captureImage, scanPeriod, refractoryPeriod);
    this._fsm = this._createStateMachine();

    Visibility.change((_: Event, state: string) => {
      if (state === "visible") {
        setTimeout(() => {
          if (this._fsm.can("activate")) {
            this._fsm.activate();
          }
        }, 0);
      } else {
        if (!this.backgroundScan && this._fsm.can("deactivate")) {
          this._fsm.deactivate();
        }
      }
    });

    this.addListener("active", () => {
      this.video.classList.remove("inactive");
      this.video.classList.add("active");
    });

    this.addListener("inactive", () => {
      this.video.classList.remove("active");
      this.video.classList.add("inactive");
    });

    this.emit("inactive");
  }

  scan() {
    return this._scanner.scan();
  }

  async start(camera = null) {
    if (this._fsm.can("start")) {
      await this._fsm.start(camera);
    } else {
      await this._fsm.stop();
      await this._fsm.start(camera);
    }
  }

  async stop() {
    if (this._fsm.can("stop")) {
      await this._fsm.stop();
    }
  }

  set captureImage(capture) {
    this._scanner.captureImage = capture;
  }

  get captureImage() {
    return this._scanner.captureImage;
  }

  set scanPeriod(period) {
    this._scanner.scanPeriod = period;
  }

  get scanPeriod() {
    return this._scanner.scanPeriod;
  }

  set refractoryPeriod(period) {
    this._scanner.refractoryPeriod = period;
  }

  get refractoryPeriod() {
    return this._scanner.refractoryPeriod;
  }

  set continuous(continuous) {
    this._continuous = continuous;

    if (continuous && this._fsm.current === "active") {
      this._scanner.start();
    } else {
      this._scanner.stop();
    }
  }

  get continuous() {
    return this._continuous;
  }

  set mirror(mirror) {
    this._mirror = mirror;

    if (mirror) {
      this.video.style.filter = "FlipH";
      this.video.style.transform = "scaleX(-1)";
    } else {
      this.video.style.filter = "";
      this.video.style.transform = "";
    }
  }

  get mirror() {
    return this._mirror;
  }

  async _enableScan(camera: any) {
    this._camera = camera || this._camera;
    if (!this._camera) {
      throw new Error("Camera is not defined.");
    }

    let stream = await this._camera.start();
    this.video.srcObject = stream;

    if (this._continuous) {
      this._scanner.start();
    }
  }

  _disableScan() {
    this.video.src = "";

    if (this._scanner) {
      this._scanner.stop();
    }

    if (this._camera) {
      this._camera.stop();
    }
  }

  _configureVideo(opts: { video?: HTMLVideoElement }) {
    if (opts.video) {
      if (opts.video.tagName !== "VIDEO") {
        throw new Error("Video must be a <video> element.");
      }
    }

    let video = opts.video || document.createElement("video");
    video.setAttribute("autoplay", "autoplay");

    return video;
  }

  _createStateMachine() {
    return StateMachine.create({
      initial: "stopped",
      events: [
        {
          name: "start",
          from: "stopped",
          to: "started"
        },
        {
          name: "stop",
          from: ["started", "active", "inactive"],
          to: "stopped"
        },
        {
          name: "activate",
          from: ["started", "inactive"],
          to: ["active", "inactive"],
          condition: () => {
            if (Visibility.state() === "visible" || this.backgroundScan) {
              return "active";
            } else {
              return "inactive";
            }
          }
        },
        {
          name: "deactivate",
          from: ["started", "active"],
          to: "inactive"
        }
      ],
      callbacks: {
        onenteractive: async (options: any) => {
          await this._enableScan(options.args[0]);
          this.emit("active");
        },
        onleaveactive: () => {
          this._disableScan();
          this.emit("inactive");
        },
        onenteredstarted: async (options: any) => {
          await this._fsm.activate(options.args[0]);
        }
      }
    });
  }
}

