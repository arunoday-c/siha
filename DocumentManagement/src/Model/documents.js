import mongoose from "mongoose";
import EmployeeDocModel from "./employeeDoc";
import PatientDocModel from "./patientDoc";
import { logger, debugLog } from "../Utils/logging";
import stream from "stream";
module.exports = db => {
  return {
    saveDocument: (req, res, next) => {
      let buffer = "";
      req.on("data", chunk => {
        buffer += chunk.toString();
      });
      req.on("end", () => {
        const _headerFile = JSON.parse(req.headers["x-file-details"]);

        // const _utf =
        //   _headerFile.needConvertion == true
        //     ? new Buffer.from(buffer, "base64")
        //     : buffer;
        const _utf = buffer;
        const _clientID = req.headers["x-client-ip"];
        if (_headerFile.fileType == "Employees") {
          EmployeeDocModel.findOneAndUpdate(
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date()
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error
                });
              } else {
                if (result == null) {
                  let _EmployeeDocModel = new EmployeeDocModel();
                  _EmployeeDocModel.pageName = _headerFile.pageName;
                  _EmployeeDocModel.destinationName =
                    _headerFile.destinationName;
                  _EmployeeDocModel.clientID = _clientID;
                  _EmployeeDocModel.image = _utf;
                  _EmployeeDocModel.fileExtention = _headerFile.fileExtention;
                  _EmployeeDocModel.updatedDate = new Date();
                  _EmployeeDocModel.save();
                }
              }
              res.status(200).json({
                success: true,
                records: "Success"
              });
            }
          );
        } else if (_headerFile.fileType == "Patients") {
          PatientDocModel.findOneAndUpdate(
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date()
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error
                });
              } else {
                if (result == null) {
                  let _PatientDocModel = new PatientDocModel();
                  _PatientDocModel.pageName = _headerFile.pageName;
                  _PatientDocModel.destinationName =
                    _headerFile.destinationName;
                  _PatientDocModel.clientID = _clientID;
                  _PatientDocModel.image = _utf;
                  _PatientDocModel.fileExtention = _headerFile.fileExtention;
                  _PatientDocModel.updatedDate = new Date();
                  _PatientDocModel.save();
                }
              }

              res.status(200).json({
                success: true,
                records: "Success"
              });
            }
          );
        }
      });
    },
    getDocument: (req, res, next) => {
      const _headerFile = req.query;
      let _destination = _headerFile.destinationName;
      try {
        _destination = JSON.parse(_destination);
      } catch (e) {
        _destination = _headerFile.destinationName;
      }

      if (_headerFile.fileType == "Employees") {
        EmployeeDocModel.findOne(
          { destinationName: _headerFile.destinationName },
          (error, result) => {
            if (error) {
              res.status(400).json({
                success: false,
                records: error
              });
            } else {
              if (result != null) {
                res.setHeader("content-type", result.fileExtention);
                res.status(200);

                let bufferStream = new stream.PassThrough();
                bufferStream.end(result.image, "base64");
                bufferStream.pipe(res);
              } else {
                res.status(400).json({
                  success: false,
                  message: "file not found"
                });
              }
            }
          }
        );
      } else if (_headerFile.fileType == "Patients") {
        PatientDocModel.findOne(
          { destinationName: _headerFile.destinationName },
          (error, result) => {
            if (error) {
              res.status(400).json({
                success: false,
                records: error
              });
            } else {
              if (result != null) {
                res.setHeader("content-type", result.fileExtention);
                res.status(200);

                let bufferStream = new stream.PassThrough();
                bufferStream.end(result.image, "base64");
                bufferStream.pipe(res);
              } else {
                res.status(400).json({
                  success: false,
                  message: "file not found"
                });
              }
            }
          }
        );
      }
    }
  };
};
