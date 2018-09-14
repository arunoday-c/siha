import { debugLog } from "../utils/logging";
import fs from "fs";
import path from "path";
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

module.exports = {
  downloadImage,
  readFileToBase64
};
