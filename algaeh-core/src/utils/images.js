import logUtils from "../utils/logging";
import fs from "fs";
import path from "path";
import multer from "multer";
import httpStatus from "../utils/httpStatus";
import mkdirp from "mkdirp";
import { LINQ } from "node-linq";
//import sharp from "sharp";
import mime from "mime/lite";
import algaehKeys from "algaeh-keys"; //"../keys/keys";
const config = algaehKeys.default;
const { debugLog } = logUtils;
let logDirectory = path.resolve("../", "Documents");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
let downloadImage = (dataString, folderName, imageName) => {
  if (!fs.existsSync(logDirectory + "/" + folderName)) {
    fs.mkdirSync(logDirectory + "/" + folderName);
  }

  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");
  // return response;
  fs.writeFile(
    logDirectory + "/" + folderName + "/" + imageName + ".webp",
    response.data,
    function(err) {
      if (err) {
        debugLog("Image error for image " + imageName, err);
      }
    }
  );
};
function readFileToBase64(folderName, imageName) {
  const filePath = logDirectory + "/" + folderName + "/" + imageName + ".webp";
  if (!fs.existsSync(filePath)) {
    return null;
  }
  var bitmap = fs.readFileSync(filePath);
  let bufferFile = new Buffer(bitmap).toString("base64");
  //PAT-A-0000377 convert binary data to base64 encoded string
  return bufferFile;
}

const saveImageInTemp = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function(req, file, next) {
      debugLog("Inside destination");
      const _ip = req.headers["x-client-ip"];
      if (_ip != null && _ip != "") {
        const _fileDetails = JSON.parse(req.headers["x-file-details"]);

        if (!config.fileStorageInDB) {
          let _filePath = "../../Documents";

          if (_fileDetails.saveDirectly) {
            _filePath +=
              "/" + _fileDetails.fileType + "/" + _fileDetails.destinationName;
          } else {
            _filePath += "/TempStore/" + _ip;
          }

          const _path = path.join(__dirname, _filePath);
          mkdirp(_path, error => {
            if (error) throw error;
            else {
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
    filename: function(req, file, next) {
      debugLog("Inside filename");
      const _fileDetails = JSON.parse(req.headers["x-file-details"]);
      const _fileExtention = path.extname(file.originalname);
      let _fileName = _fileDetails.saveDirectly
        ? _fileDetails.tempFileName + _fileExtention
        : _fileDetails.pageName +
          "_" +
          _fileDetails.tempFileName +
          _fileExtention;

      next(null, _fileName);
    }
  });
  let upload = multer({ storage: storage });
  let Fupload = upload.fields([{ name: "file", maxCount: 12 }]);
  Fupload(req, res, err => {
    if (err) {
      debugLog("An error occurred when uploading", err);
      next(httpStatus.generateError(httpStatus.internalServer, err));
    } else {
      debugLog("Success In Image");
      res.status(httpStatus.ok).json({
        success: true,
        records: "Successfully uploaded image"
      });
    }
  });
};
let showFile = (req, res, next) => {
  const _body = req.query;
  debugLog("Print Body ", _body);
  const _path =
    logDirectory + "/" + _body.fileType + "/" + _body.destinationName;

  const _folders = fs.readdirSync(_path);

  if (_folders) {
    const _fileSelection = new LINQ(_folders)
      .Where(w => w.includes(_body.fileName))
      .FirstOrDefault();
    if (_fileSelection != null) {
      const _fileLocation = _path + "/" + _fileSelection;
      if (fs.existsSync(_fileLocation)) {
        const _resizeFormat = JSON.parse(_body.resize);
        res.setHeader(
          "content-type",
          mime.getType(path.extname(_fileLocation).replace(".", ""))
        );
        if (
          _resizeFormat != null &&
          _resizeFormat.width != null &&
          _resizeFormat.height != null
        ) {
          resizeImage(
            _fileLocation,
            _resizeFormat.format,
            _resizeFormat.width,
            _resizeFormat.height
          ).pipe(res);
        } else {
          fs.createReadStream(_fileLocation).pipe(res);
        }
      } else {
        next(httpStatus.generateError(httpStatus.forbidden, "File not exits"));
      }
    } else {
      next(httpStatus.generateError(httpStatus.forbidden, "File not exits"));
    }
  } else {
    next(httpStatus.generateError(httpStatus.forbidden, "File not exits"));
  }
};
const resizeImage = (_filepath, format, width, height) => {
  const readStream = fs.createReadStream(_filepath);
  //let transform = sharp();
  let _format = "";
  if (format === undefined || format === null || format === "") {
    _format = path.extname(_filepath);
  } else {
    _format = format;
  }
  _format = _format.replace(".", "");
  transform = transform.toFormat(_format);
  if (width || height) {
    transform = transform.resize(width, height, {
      // fit: sharp.fit.fill
    });
  }
  return readStream.pipe(transform);
};
export default {
  downloadImage,
  readFileToBase64,
  showFile,
  saveImageInTemp
};
