import shape from "sharp";
import fs from "fs";
module.exports = {
  resizeImage: (file, format, width, height) => {
    const readStream = fs.createReadStream(_filepath);
    let transform = sharp();
    let _format = "";
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
