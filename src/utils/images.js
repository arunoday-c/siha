import { debugLog } from "../utils/logging";
import fs from "fs";
import path from "path";
import multer from "multer";
import httpStatus from "../utils/httpStatus";
import mkdirp from "mkdirp";
let logDirectory = path.join(__dirname, "../../Documents");
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
    logDirectory + "/" + folderName + "/" + imageName + ".png",
    response.data,
    function(err) {
      if (err) {
        debugLog("Image error for image " + imageName, err);
      }
    }
  );
};
function readFileToBase64(folderName, imageName) {
  const filePath = logDirectory + "/" + folderName + "/" + imageName + ".png";
  if (!fs.existsSync(filePath)) {
    return null;
  }
  var bitmap = fs.readFileSync(filePath);
  let bufferFile = new Buffer(bitmap).toString("base64");
  //PAT-A-0000377 convert binary data to base64 encoded string
  return bufferFile;
}
const storage = multer.diskStorage({
  destination: function(req, file, next) {
    const _ip = req.headers["x-client-ip"];
    if (_ip != null && _ip != "") {
      const _fileDetails = JSON.parse(req.headers["x-file-details"]);
      let _filePath = "../../Documents";
      if (_fileDetails.saveDirectly) {
        _filePath +=
          "/" + _fileDetails.fileType + "/" + _fileDetails.destinationName;
      } else {
        _filePath += "/TempStore/" + _ip;
      }

      const _path = path.join(__dirname, _filePath);
      // if (!fs.existsSync(_path)) {
      //   fs.mkdirSync(_path);
      // }
      mkdirp(_path, error => {
        if (error) throw error;
        else {
          next(null, _path);
        }
      });
    } else {
      throw "Unknow client IP not recorded";
    }
  },
  filename: function(req, file, next) {
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
const saveImageInTemp = (req, res, next) => {
  Fupload(req, res, err => {
    if (err) {
      debugLog("An error occurred when uploading", err);
      next(httpStatus.generateError(500, err));
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: "Successfully uploaded image"
      });
    }
  });
};
let showFile = (req, res, next) => {
  const _path = path.join(
    __dirname,
    "../../Documents/Employees/EMP00002/EMP00002.png"
  );
  debugLog("Path ", _path);
  if (fs.existsSync(_path)) {
    //  res.sendFile(_path);
    fs.createReadStream(_path).pipe(res);
    // request(_path).pipe(fs.createWriteStream("doodle.png"));
  } else {
    next(httpStatus.generateError(httpStatus.forbidden, "File not exits"));
  }
  // fs.readFile(_path, (err, content) => {
  //   if (err) {
  //     next(err);
  //   }
  //   debugLog("content", content);
  //   res.writeHead(200, { "Content-type": "image/jpg" });
  //   res.end(content);
  // });
};

module.exports = {
  downloadImage,
  readFileToBase64,
  showFile,
  saveImageInTemp
};
