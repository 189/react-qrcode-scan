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
function cameraName(label) {
    var clean = label ? label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, "") : "";
    return clean || label || null;
}
var MediaError = (function (_super) {
    __extends(MediaError, _super);
    function MediaError(type) {
        var _this = _super.call(this, "Cannot access video stream (" + type + ").") || this;
        _this.type = type;
        return _this;
    }
    return MediaError;
}(Error));
var Camera = (function () {
    function Camera(id, name) {
        this.id = id;
        this.name = name;
        this._stream = null;
    }
    Camera.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var constraints, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        constraints = {
                            audio: false,
                            video: {
                                mandatory: {
                                    sourceId: this.id,
                                    minWidth: 600,
                                    maxWidth: 800,
                                    minAspectRatio: 1.6
                                },
                                optional: []
                            }
                        };
                        _a = this;
                        return [4, Camera._wrapErrors(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, navigator.mediaDevices.getUserMedia(constraints)];
                                        case 1: return [2, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a._stream = _b.sent();
                        return [2, this._stream];
                }
            });
        });
    };
    Camera.prototype.stop = function () {
        if (!this._stream) {
            return;
        }
        for (var _i = 0, _a = this._stream.getVideoTracks(); _i < _a.length; _i++) {
            var stream = _a[_i];
            stream.stop();
        }
        this._stream = null;
    };
    Camera.getCameras = function () {
        return __awaiter(this, void 0, void 0, function () {
            var devices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._ensureAccess()];
                    case 1:
                        _a.sent();
                        return [4, navigator.mediaDevices.enumerateDevices()];
                    case 2:
                        devices = _a.sent();
                        devices = devices.filter(function (d) { return d.kind === "videoinput"; });
                        if (devices) {
                            return [2, devices.map(function (d) { return new Camera(d.deviceId, cameraName(d.label)); })];
                        }
                        return [2, []];
                }
            });
        });
    };
    Camera._ensureAccess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._wrapErrors(function () { return __awaiter(_this, void 0, void 0, function () {
                            var access, _i, _a, stream;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4, navigator.mediaDevices.getUserMedia({ video: true })];
                                    case 1:
                                        access = _b.sent();
                                        for (_i = 0, _a = access.getVideoTracks(); _i < _a.length; _i++) {
                                            stream = _a[_i];
                                            stream.stop();
                                        }
                                        return [2];
                                }
                            });
                        }); })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Camera._wrapErrors = function (fn) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, fn()];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1.name) {
                            throw new MediaError(e_1.name);
                        }
                        else {
                            throw e_1;
                        }
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    return Camera;
}());
exports.default = Camera;
