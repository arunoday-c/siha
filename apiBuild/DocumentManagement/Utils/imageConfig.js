"use strict";

var _sharp = require("sharp");

var _sharp2 = _interopRequireDefault(_sharp);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  resizeImage: function resizeImage(file, format, width, height) {
    var readStream = _fs2.default.createReadStream(_filepath);
    var transform = sharp();
    var _format = "";
    if (format === undefined || format === null || format === "") {
      _format = path.extname(file);
    } else {
      _format = format;
    }
    _format = _format.replace(".", "");
    transform = transform.toFormat(_format);
    if (width || height) {
      transform = transform.resize(width, height, {
        fit: sharp.fit.fill
      });
    }
    return readStream.pipe(transform);
  }
};
//# sourceMappingURL=imageConfig.js.map