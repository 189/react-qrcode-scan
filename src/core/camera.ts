function cameraName(label: string | null) {
  let clean = label ? label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, "") : "";
  return clean || label || null;
}

class MediaError extends Error {
  type: string;
  constructor(type: string) {
    super(`Cannot access video stream (${type}).`);
    this.type = type;
  }
}

class Camera {
  id: string;
  name: string | null;
  _stream: any;

  constructor(id: string, name: string | null) {
    this.id = id;
    this.name = name;
    this._stream = null;
  }

  async start() {
    let constraints: any = {
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

    this._stream = await Camera._wrapErrors(async () => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    });

    return this._stream;
  }

  stop() {
    if (!this._stream) {
      return;
    }

    for (let stream of this._stream.getVideoTracks()) {
      stream.stop();
    }

    this._stream = null;
  }

  static async getCameras(): Promise<Camera[]> {
    await this._ensureAccess();
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices
    let devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter(d => d.kind === "videoinput");
    if (devices) {
      return devices.map(d => new Camera(d.deviceId, cameraName(d.label)));
    }
    return [];
  }

  // Stop all video stream and prepare recording2
  static async _ensureAccess() {
    return await this._wrapErrors(async () => {
      let access = await navigator.mediaDevices.getUserMedia({ video: true });
      for (let stream of access.getVideoTracks()) {
        stream.stop();
      }
    });
  }

  static async _wrapErrors(fn: any) {
    try {
      return await fn();
    } catch (e) {
      console.log(e);
      if (e.name) {
        throw new MediaError(e.name);
      } else {
        throw e;
      }
    }
  }
}

export default Camera;
