"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var ZXing = require("./zxing")();
var Visibility = require("visibilityjs");
var StateMachine = require("fsm-as-promised");
var ScanProvider = (function () {
    function ScanProvider(emitter, analyzer, captureImage, scanPeriod, refractoryPeriod) {
        this.scanPeriod = scanPeriod;
        this.captureImage = captureImage;
        this.refractoryPeriod = refractoryPeriod;
        this._emitter = emitter;
        this._frameCount = 0;
        this._analyzer = analyzer;
        this._lastResult = null;
        this._active = false;
    }
    ScanProvider.prototype.start = function () {
        var _this = this;
        this._active = true;
        requestAnimationFrame(function () { return _this._scan(); });
    };
    ScanProvider.prototype.stop = function () {
        this._active = false;
    };
    ScanProvider.prototype.scan = function () {
        return this._analyze(false);
    };
    ScanProvider.prototype._analyze = function (skipDups) {
        var _this = this;
        var analysis = this._analyzer.analyze();
        if (!analysis) {
            return null;
        }
        var result = analysis.result, canvas = analysis.canvas;
        if (!result) {
            return null;
        }
        if (skipDups && result === this._lastResult) {
            return null;
        }
        clearTimeout(this.refractoryTimeout);
        this.refractoryTimeout = setTimeout(function () {
            _this._lastResult = null;
        }, this.refractoryPeriod);
        var image = this.captureImage ? canvas.toDataURL("image/webp", 0.8) : null;
        this._lastResult = result;
        var payload = { content: result };
        if (image) {
            payload.image = image;
        }
        return payload;
    };
    ScanProvider.prototype._scan = function () {
        var _this = this;
        if (!this._active) {
            return;
        }
        requestAnimationFrame(function () { return _this._scan(); });
        if (++this._frameCount !== this.scanPeriod) {
            return;
        }
        else {
            this._frameCount = 0;
        }
        var result = this._analyze(true);
        if (result) {
            setTimeout(function () {
                _this._emitter.emit("scan", result === null || result === void 0 ? void 0 : result.content, (result === null || result === void 0 ? void 0 : result.image) || null);
            }, 0);
        }
    };
    return ScanProvider;
}());
var Analyzer = (function () {
    function Analyzer(video) {
        this.video = video;
        this.imageBuffer = null;
        this.canvas = document.createElement("canvas");
        this.canvas.style.display = "none";
        this.decodeCallback = ZXing.Runtime.addFunction(function (ptr, len, resultIndex) {
            var result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len);
            var str = String.fromCharCode.apply(null, result);
            if (resultIndex === 0) {
                window.zxDecodeResult = "";
            }
            window.zxDecodeResult += str;
        });
    }
    Analyzer.prototype.analyze = function () {
        if (!this.video.videoWidth) {
            return null;
        }
        if (!this.imageBuffer) {
            var videoWidth = this.video.videoWidth;
            var videoHeight = this.video.videoHeight;
            this.sensorWidth = videoWidth;
            this.sensorHeight = videoHeight;
            this.sensorLeft = Math.floor((videoWidth / 2) - (this.sensorWidth / 2));
            this.sensorTop = Math.floor((videoHeight / 2) - (this.sensorHeight / 2));
            this.canvas.width = this.sensorWidth;
            this.canvas.height = this.sensorHeight;
            this.canvasContext = this.canvas.getContext("2d");
            this.imageBuffer = ZXing._resize(this.sensorWidth, this.sensorHeight);
            return null;
        }
        this.canvasContext.drawImage(this.video, this.sensorLeft, this.sensorTop, this.sensorWidth, this.sensorHeight);
        var data = this.canvasContext.getImageData(0, 0, this.sensorWidth, this.sensorHeight).data;
        for (var i = 0, j = 0; i < data.length; i += 4, j++) {
            var _a = [data[i], data[i + 1], data[i + 2]], r = _a[0], g = _a[1], b = _a[2];
            ZXing.HEAPU8[this.imageBuffer + j] = Math.trunc((r + g + b) / 3);
        }
        var err = ZXing._decode_qr(this.decodeCallback);
        if (err) {
            return null;
        }
        var result = window.zxDecodeResult;
        if (result != null) {
            return { result: result, canvas: this.canvas };
        }
        return null;
    };
    return Analyzer;
}());
var Scanner = (function (_super) {
    __extends(Scanner, _super);
    function Scanner(opts) {
        var _this = _super.call(this) || this;
        _this.video = _this._configureVideo(opts);
        _this.mirror = (opts.mirror !== false);
        _this.backgroundScan = (opts.backgroundScan !== false);
        _this._continuous = (opts.continuous !== false);
        _this._analyzer = new Analyzer(_this.video);
        _this._camera = null;
        var captureImage = opts.captureImage || false;
        var scanPeriod = opts.scanPeriod || 1;
        var refractoryPeriod = opts.refractoryPeriod || (5 * 1000);
        _this._scanner = new ScanProvider(_this, _this._analyzer, captureImage, scanPeriod, refractoryPeriod);
        _this._fsm = _this._createStateMachine();
        Visibility.change(function (_, state) {
            if (state === "visible") {
                setTimeout(function () {
                    if (_this._fsm.can("activate")) {
                        _this._fsm.activate();
                    }
                }, 0);
            }
            else {
                if (!_this.backgroundScan && _this._fsm.can("deactivate")) {
                    _this._fsm.deactivate();
                }
            }
        });
        _this.addListener("active", function () {
            _this.video.classList.remove("inactive");
            _this.video.classList.add("active");
        });
        _this.addListener("inactive", function () {
            _this.video.classList.remove("active");
            _this.video.classList.add("inactive");
        });
        _this.emit("inactive");
        return _this;
    }
    Scanner.prototype.scan = function () {
        return this._scanner.scan();
    };
    Scanner.prototype.start = function (camera) {
        if (camera === void 0) { camera = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._fsm.can("start")) return [3, 2];
                        return [4, this._fsm.start(camera)];
                    case 1:
                        _a.sent();
                        return [3, 5];
                    case 2: return [4, this._fsm.stop()];
                    case 3:
                        _a.sent();
                        return [4, this._fsm.start(camera)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    Scanner.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._fsm.can("stop")) return [3, 2];
                        return [4, this._fsm.stop()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    Object.defineProperty(Scanner.prototype, "captureImage", {
        get: function () {
            return this._scanner.captureImage;
        },
        set: function (capture) {
            this._scanner.captureImage = capture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "scanPeriod", {
        get: function () {
            return this._scanner.scanPeriod;
        },
        set: function (period) {
            this._scanner.scanPeriod = period;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "refractoryPeriod", {
        get: function () {
            return this._scanner.refractoryPeriod;
        },
        set: function (period) {
            this._scanner.refractoryPeriod = period;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "continuous", {
        get: function () {
            return this._continuous;
        },
        set: function (continuous) {
            this._continuous = continuous;
            if (continuous && this._fsm.current === "active") {
                this._scanner.start();
            }
            else {
                this._scanner.stop();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "mirror", {
        get: function () {
            return this._mirror;
        },
        set: function (mirror) {
            this._mirror = mirror;
            if (mirror) {
                this.video.style.filter = "FlipH";
                this.video.style.transform = "scaleX(-1)";
            }
            else {
                this.video.style.filter = "";
                this.video.style.transform = "";
            }
        },
        enumerable: false,
        configurable: true
    });
    Scanner.prototype._enableScan = function (camera) {
        return __awaiter(this, void 0, void 0, function () {
            var stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._camera = camera || this._camera;
                        if (!this._camera) {
                            throw new Error("Camera is not defined.");
                        }
                        return [4, this._camera.start()];
                    case 1:
                        stream = _a.sent();
                        this.video.srcObject = stream;
                        if (this._continuous) {
                            this._scanner.start();
                        }
                        return [2];
                }
            });
        });
    };
    Scanner.prototype._disableScan = function () {
        this.video.src = "";
        if (this._scanner) {
            this._scanner.stop();
        }
        if (this._camera) {
            this._camera.stop();
        }
    };
    Scanner.prototype._configureVideo = function (opts) {
        if (opts.video) {
            if (opts.video.tagName !== "VIDEO") {
                throw new Error("Video must be a <video> element.");
            }
        }
        var video = opts.video || document.createElement("video");
        video.setAttribute("autoplay", "autoplay");
        return video;
    };
    Scanner.prototype._createStateMachine = function () {
        var _this = this;
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
                    condition: function () {
                        if (Visibility.state() === "visible" || _this.backgroundScan) {
                            return "active";
                        }
                        else {
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
                onenteractive: function (options) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, this._enableScan(options.args[0])];
                            case 1:
                                _a.sent();
                                this.emit("active");
                                return [2];
                        }
                    });
                }); },
                onleaveactive: function () {
                    _this._disableScan();
                    _this.emit("inactive");
                },
                onenteredstarted: function (options) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, this._fsm.activate(options.args[0])];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                }); }
            }
        });
    };
    return Scanner;
}(events_1.EventEmitter));
exports.default = Scanner;
