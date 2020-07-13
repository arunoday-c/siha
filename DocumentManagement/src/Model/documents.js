import stream from "stream";
import EmployeeDocModel from "./employeeDoc";
import PatientDocModel from "./patientDoc";
import CompanyDocModel from "./company";
import DepartmentImageModel from "./departmentImages";
import EmailConfig from "./emailConfig";

//import { logger, debugLog } from "../Utils/logging";
export default (db) => {
  return {
    saveDocument: (req, res, next) => {
      let buffer = "";
      req.on("data", (chunk) => {
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
              destinationName: _headerFile.destinationName,
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date(),
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error,
                });
                return;
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
                records: "Success",
              });
            }
          );
        } else if (_headerFile.fileType == "Patients") {
          PatientDocModel.findOneAndUpdate(
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date(),
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error,
                });
                return;
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
                records: "Success",
              });
            }
          );
        } else if (_headerFile.fileType == "Company") {
          CompanyDocModel.findOneAndUpdate(
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date(),
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error,
                });
              } else {
                if (result == null) {
                  let _CompanyDocModel = new CompanyDocModel();
                  _CompanyDocModel.pageName = _headerFile.pageName;
                  _CompanyDocModel.destinationName =
                    _headerFile.destinationName;
                  _CompanyDocModel.clientID = _clientID;
                  _CompanyDocModel.image = _utf;
                  _CompanyDocModel.fileExtention = _headerFile.fileExtention;
                  _CompanyDocModel.updatedDate = new Date();
                  _CompanyDocModel.save();
                }
              }
              res.status(200).json({
                success: true,
                records: "Success",
              });
            }
          );
        } else if (_headerFile.fileType == "DepartmentImages") {
          DepartmentImageModel.findOneAndUpdate(
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
            },
            {
              pageName: _headerFile.pageName,
              destinationName: _headerFile.destinationName,
              clientID: _clientID,
              image: _utf,
              fileExtention: _headerFile.fileExtention,
              updatedDate: new Date(),
            },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error,
                });
                return;
              } else {
                if (result == null) {
                  let _DepartmentImageModel = new DepartmentImageModel();
                  _DepartmentImageModel.pageName = _headerFile.pageName;
                  _DepartmentImageModel.destinationName =
                    _headerFile.destinationName;
                  _DepartmentImageModel.clientID = _clientID;
                  _DepartmentImageModel.image = _utf;
                  _DepartmentImageModel.fileExtention =
                    _headerFile.fileExtention;
                  _DepartmentImageModel.updatedDate = new Date();
                  _DepartmentImageModel.save();
                }
              }

              res.status(200).json({
                success: true,
                records: "Success",
              });
            }
          );
        }
      });
    },
    getDocument: (req, res, next) => {
      try {
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
                  records: error,
                });
                return;
              } else {
                if (result != null) {
                  res.setHeader("content-type", result.fileExtention);
                  res.status(200);

                  let bufferStream = new stream.PassThrough();
                  bufferStream.end(result.image, "base64");
                  bufferStream.pipe(res);
                } else {
                  res.status(204).json({
                    success: false,
                    message: "file not found",
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
                  records: error,
                });
                return;
              } else {
                if (result != null) {
                  res.setHeader("content-type", result.fileExtention);
                  res.status(200);

                  let bufferStream = new stream.PassThrough();
                  bufferStream.end(result.image, "base64");
                  bufferStream.pipe(res);
                } else {
                  res.status(204).json({
                    success: false,
                    message: "file not found",
                  });
                }
              }
            }
          );
        } else if (_headerFile.fileType == "DepartmentImages") {
          DepartmentImageModel.findOne(
            { destinationName: _headerFile.destinationName },
            (error, result) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  records: error,
                });
                return;
              } else {
                if (result != null) {
                  res.setHeader("content-type", result.fileExtention);
                  res.status(200);

                  let bufferStream = new stream.PassThrough();
                  bufferStream.end(result.image, "base64");
                  bufferStream.pipe(res);
                } else {
                  res.status(204).json({
                    success: false,
                    message: "file not found",
                  });
                }
              }
            }
          );
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    },
    deleteDocument: (req, res) => {
      try {
        const _headerFile = req.body;

        if (_headerFile.fileType == "DepartmentImages") {
          DepartmentImageModel.deleteOne(
            { destinationName: _headerFile.unique },
            (error) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  message: error,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Successfully Deleted",
                });
              }
            }
          );
        } else if (_headerFile.fileType == "EmployeeDocuments") {
          EmployeeDocModel.deleteOne(
            { destinationName: _headerFile.unique },
            (error) => {
              if (error) {
                res.status(400).json({
                  success: false,
                  message: error,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Successfully Deleted",
                });
              }
            }
          );
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    },

    getEmailConfig: (req, res) => {
      EmailConfig.find()
        .then((conf) => {
          console.log(conf, "config");
          res.status(200).json({
            success: true,
            data: conf,
          });
        })
        .catch((e) => {
          res.status(400).json({
            success: false,
            message: e.message,
          });
        });
    },
    setEmailConfig: (req, res) => {
      console.log(req.body);
      const input = req.body;
      EmailConfig.deleteMany({})
        .then(() => {
          const doc = new EmailConfig({
            ...input,
          });
          doc.save().then(() => {
            res.status(200).json({
              success: true,
              message: "Updated successfully!",
            });
          });
        })
        .catch((e) => {
          res.status(400).json({
            success: false,
            message: "Failed to Update Configuration",
          });
        });
    },
  };
};
