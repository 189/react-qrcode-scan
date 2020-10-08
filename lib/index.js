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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.QRScaner = exports.Camera = void 0;
var React = require("react");
require("webrtc-adapter");
var plainerror_1 = require("plainerror");
var camera_1 = require("./core/camera");
var scanner_1 = require("./core/scanner");
var noop = function (_) { };
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            ready: false
        };
        return _this;
    }
    Camera.prototype.componentDidMount = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, err, cameras;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, plainerror_1.default(camera_1.default.getCameras, camera_1.default)()];
                    case 1:
                        _b = _c.sent(), err = _b[0], cameras = _b[1];
                        if (err) {
                            (_a = this.props) === null || _a === void 0 ? void 0 : _a.onError(err);
                            return [2];
                        }
                        this.cameras = cameras;
                        this.setState({
                            ready: true
                        });
                        return [2];
                }
            });
        });
    };
    Camera.prototype.render = function () {
        var ready = this.state.ready;
        return ready ? this.props.children(this.cameras) : null;
    };
    return Camera;
}(React.PureComponent));
exports.Camera = Camera;
var QRScaner = (function (_super) {
    __extends(QRScaner, _super);
    function QRScaner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.previewer = React.createRef();
        return _this;
    }
    QRScaner.prototype.shouldComponentUpdate = function (_a) {
        var _b = _a.stop, stop = _b === void 0 ? false : _b, _c = _a.onStop, onStop = _c === void 0 ? noop : _c, _d = _a.options, options = _d === void 0 ? {} : _d, camera = _a.camera;
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
    };
    QRScaner.prototype.destroyScanner = function () {
        var _a, _b;
        this.scanner.removeAllListeners();
        (_b = (_a = this.scanner) === null || _a === void 0 ? void 0 : _a.stop) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.scanner = null;
    };
    QRScaner.prototype.initScanner = function (camera, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        this.scanner = new scanner_1.default(__assign(__assign({}, options), { video: this.previewer.current }));
        this.scanner.addListener("scan", this.props.onScan);
        this.scanner.addListener("active", this.props.onActive || noop);
        this.scanner.addListener("inActive", this.props.onInActive || noop);
        (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.onStart) === null || _b === void 0 ? void 0 : _b.call(_a, camera);
        this.scanner.start(camera);
    };
    QRScaner.prototype.componentDidMount = function () {
        var _a = this.props, camera = _a.camera, _b = _a.options, options = _b === void 0 ? {} : _b;
        this.initScanner(camera, options);
    };
    QRScaner.prototype.componentWillUnmount = function () {
        this.destroyScanner();
    };
    QRScaner.prototype.render = function () {
        return React.createElement("video", { ref: this.previewer });
    };
    return QRScaner;
}(React.Component));
exports.QRScaner = QRScaner;
