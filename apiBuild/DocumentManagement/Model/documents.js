"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _employeeDoc = require("./employeeDoc");

var _employeeDoc2 = _interopRequireDefault(_employeeDoc);

var _patientDoc = require("./patientDoc");

var _patientDoc2 = _interopRequireDefault(_patientDoc);

var _logging = require("../Utils/logging");

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (db) {
  return {
    saveDocument: function saveDocument(req, res, next) {
      var buffer = "";
      req.on("data", function (chunk) {
        buffer += chunk.toString();
      });
      req.on("end", function () {
        var _headerFile = JSON.parse(req.headers["x-file-details"]);

        // const _utf =
        //   _headerFile.needConvertion == true
        //     ? new Buffer.from(buffer, "base64")
        //     : buffer;
        var _utf = buffer;
        var _clientID = req.headers["x-client-ip"];
        if (_headerFile.fileType == "Employees") {
          _employeeDoc2.default.findOneAndUpdate({
            pageName: _headerFile.pageName,
            destinationName: _headerFile.destinationName
          }, {
            pageName: _headerFile.pageName,
            destinationName: _headerFile.destinationName,
            clientID: _clientID,
            image: _utf,
            fileExtention: _headerFile.fileExtention,
            updatedDate: new Date()
          }, function (error, result) {
            if (error) {
              res.status(400).json({
                success: false,
                records: error
              });
            } else {
              if (result == null) {
                var _EmployeeDocModel = new _employeeDoc2.default();
                _EmployeeDocModel.pageName = _headerFile.pageName;
                _EmployeeDocModel.destinationName = _headerFile.destinationName;
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
          });
        } else if (_headerFile.fileType == "Patients") {
          _patientDoc2.default.findOneAndUpdate({
            pageName: _headerFile.pageName,
            destinationName: _headerFile.destinationName
          }, {
            pageName: _headerFile.pageName,
            destinationName: _headerFile.destinationName,
            clientID: _clientID,
            image: _utf,
            fileExtention: _headerFile.fileExtention,
            updatedDate: new Date()
          }, function (error, result) {
            if (error) {
              res.status(400).json({
                success: false,
                records: error
              });
            } else {
              if (result == null) {
                var _PatientDocModel = new _patientDoc2.default();
                _PatientDocModel.pageName = _headerFile.pageName;
                _PatientDocModel.destinationName = _headerFile.destinationName;
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
          });
        }
      });
    },
    getDocument: function getDocument(req, res, next) {
      var _headerFile = req.query;
      var _destination = _headerFile.destinationName;
      try {
        _destination = JSON.parse(_destination);
      } catch (e) {
        _destination = _headerFile.destinationName;
      }

      if (_headerFile.fileType == "Employees") {
        _employeeDoc2.default.findOne({ destinationName: _headerFile.destinationName }, function (error, result) {
          if (error) {
            res.status(400).json({
              success: false,
              records: error
            });
          } else {
            if (result != null) {
              res.setHeader("content-type", result.fileExtention);
              res.status(200);

              var bufferStream = new _stream2.default.PassThrough();
              bufferStream.end(result.image, "base64");
              bufferStream.pipe(res);
            } else {
              res.status(400).json({
                success: false,
                message: "file not found"
              });
            }
          }
        });
      } else if (_headerFile.fileType == "Patients") {
        _patientDoc2.default.findOne({ destinationName: _headerFile.destinationName }, function (error, result) {
          if (error) {
            res.status(400).json({
              success: false,
              records: error
            });
          } else {
            if (result != null) {
              res.setHeader("content-type", result.fileExtention);
              res.status(200);

              var bufferStream = new _stream2.default.PassThrough();
              bufferStream.end(result.image, "base64");
              bufferStream.pipe(res);
            } else {
              res.status(400).json({
                success: false,
                message: "file not found"
              });
            }
          }
        });
      }
    }
  };
};
//# sourceMappingURL=documents.js.map