"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("webrtc-adapter");
var camera_1 = require("./camera");
var scanner_1 = require("./scanner");
exports.default = {
    Scanner: scanner_1.default,
    Camera: camera_1.default
};
