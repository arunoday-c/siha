"use strict";

var _logging = require("../utils/logging");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path2 = require("path");

var _path3 = _interopRequireDefault(_path2);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _nodeLinq = require("node-linq");

var _sharp = require("sharp");

var _sharp2 = _interopRequireDefault(_sharp);

var _lite = require("mime/lite");

var _lite2 = _interopRequireDefault(_lite);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logDirectory = _path3.default.join(__dirname, "../../Documents");
if (!_fs2.default.existsSync(logDirectory)) {
  _fs2.default.mkdirSync(logDirectory);
}
var downloadImage = function downloadImage(dataString, folderName, imageName) {
  if (!_fs2.default.existsSync(logDirectory + "/" + folderName)) {
    _fs2.default.mkdirSync(logDirectory + "/" + folderName);
  }

  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");
  // return response;
  _fs2.default.writeFile(logDirectory + "/" + folderName + "/" + imageName + ".webp", response.data, function (err) {
    if (err) {
      (0, _logging.debugLog)("Image error for image " + imageName, err);
    }
  });
};
function readFileToBase64(folderName, imageName) {
  var filePath = logDirectory + "/" + folderName + "/" + imageName + ".webp";
  if (!_fs2.default.existsSync(filePath)) {
    return null;
  }
  var bitmap = _fs2.default.readFileSync(filePath);
  var bufferFile = new Buffer(bitmap).toString("base64");
  //PAT-A-0000377 convert binary data to base64 encoded string
  return bufferFile;
}

var saveImageInTemp = function saveImageInTemp(req, res, next) {
  var storage = _multer2.default.diskStorage({
    destination: function destination(req, file, next) {
      (0, _logging.debugLog)("Inside destination");
      var _ip = req.headers["x-client-ip"];
      if (_ip != null && _ip != "") {
        var _fileDetails = JSON.parse(req.headers["x-file-details"]);

        if (!_keys2.default.fileStorageInDB) {
          var _filePath = "../../Documents";

          if (_fileDetails.saveDirectly) {
            _filePath += "/" + _fileDetails.fileType + "/" + _fileDetails.destinationName;
          } else {
            _filePath += "/TempStore/" + _ip;
          }

          var _path = _path3.default.join(__dirname, _filePath);
          (0, _mkdirp2.default)(_path, function (error) {
            if (error) throw error;else {
              next(null, _path);
            }
          });
        } else {
          next(null);
        }
      } else {
        throw "Unknow client IP not recorded";
      }
    },
    filename: function filename(req, file, next) {
      (0, _logging.debugLog)("Inside filename");
      var _fileDetails = JSON.parse(req.headers["x-file-details"]);
      var _fileExtention = _path3.default.extname(file.originalname);
      var _fileName = _fileDetails.saveDirectly ? _fileDetails.tempFileName + _fileExtention : _fileDetails.pageName + "_" + _fileDetails.tempFileName + _fileExtention;

      next(null, _fileName);
    }
  });
  var upload = (0, _multer2.default)({ storage: storage });
  var Fupload = upload.fields([{ name: "file", maxCount: 12 }]);
  Fupload(req, res, function (err) {
    if (err) {
      (0, _logging.debugLog)("An error occurred when uploading", err);
      next(_httpStatus2.default.generateError(_httpStatus2.default.internalServer, err));
    } else {
      (0, _logging.debugLog)("Success In Image");
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: "Successfully uploaded image"
      });
    }
  });
};
var showFile = function showFile(req, res, next) {
  var _body = req.query;
  (0, _logging.debugLog)("Print Body ", _body);
  var _path = logDirectory + "/" + _body.fileType + "/" + _body.destinationName;

  var _folders = _fs2.default.readdirSync(_path);

  if (_folders) {
    var _fileSelection = new _nodeLinq.LINQ(_folders).Where(function (w) {
      return w.includes(_body.fileName);
    }).FirstOrDefault();
    if (_fileSelection != null) {
      var _fileLocation = _path + "/" + _fileSelection;
      if (_fs2.default.existsSync(_fileLocation)) {
        var _resizeFormat = JSON.parse(_body.resize);
        res.setHeader("content-type", _lite2.default.getType(_path3.default.extname(_fileLocation).replace(".", "")));
        if (_resizeFormat != null && _resizeFormat.width != null && _resizeFormat.height != null) {
          resizeImage(_fileLocation, _resizeFormat.format, _resizeFormat.width, _resizeFormat.height).pipe(res);
        } else {
          _fs2.default.createReadStream(_fileLocation).pipe(res);
        }
      } else {
        next(_httpStatus2.default.generateError(_httpStatus2.default.forbidden, "File not exits"));
      }
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.forbidden, "File not exits"));
    }
  } else {
    next(_httpStatus2.default.generateError(_httpStatus2.default.forbidden, "File not exits"));
  }
};
var resizeImage = function resizeImage(_filepath, format, width, height) {
  var readStream = _fs2.default.createReadStream(_filepath);
  var transform = (0, _sharp2.default)();
  var _format = "";
  if (format === undefined || format === null || format === "") {
    _format = _path3.default.extname(_filepath);
  } else {
    _format = format;
  }
  _format = _format.replace(".", "");
  transform = transform.toFormat(_format);
  if (width || height) {
    transform = transform.resize(width, height, {
      fit: _sharp2.default.fit.fill
    });
  }
  return readStream.pipe(transform);
};
module.exports = {
  downloadImage: downloadImage,
  readFileToBase64: readFileToBase64,
  showFile: showFile,
  saveImageInTemp: saveImageInTemp
};
//# sourceMappingURL=images.js.map