"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _employee = require("../model/employee");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post("/addEmployee", _employee.addEmployee, function (req, res, next) {
    var resultBack = req.records;
    if (resultBack.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No record found"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultBack
      });
    }

    next();
  }, _utils.releaseConnection);

  api.post("/addEmployeeGroups", _employee.addEmployeeGroups, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updateEmployee", _employee.updateEmployee, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      message: "Updated successfully",
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.get("/get", _employee.getEmployee, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getEmployeeDetails", _employee.getEmployeeDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getEmployeeCategory", _employee.getEmployeeCategory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getDoctorServiceCommission", _employee.getDoctorServiceCommission, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getDoctorServiceTypeCommission", _employee.getDoctorServiceTypeCommission, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getEmployeeGroups", _employee.getEmployeeGroups, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.put("/updateEmployeeGroup", _employee.updateEmployeeGroup, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.delete("/deleteEmployeeGroup", _employee.deleteEmployeeGroup, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  //Start of Payroll Settings

  // created by irfan
  api.post("/addEarningDeduction", _employee.addEarningDeduction, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  api.get("/getEarningDeduction", _employee.getEarningDeduction, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.put("/updateEarningDeduction", _employee.updateEarningDeduction, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan:
  api.delete("/deleteEarningDeduction", _employee.deleteEarningDeduction, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  //Loan Master created by Adnan

  // created by Adnan
  api.post("/addLoanMaster", _employee.addLoanMaster, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.get("/getLoanMaster", _employee.getLoanMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Adnan
  api.put("/updateLoanMaster", _employee.updateLoanMaster, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.delete("/deleteLoanMaster", _employee.deleteLoanMaster, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  //Loan Master End created by Adnan
  //End of Payroll Settings

  api.post("/addEmployeeMaster", _employee.addEmployeeMaster, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  api.post("/addEmployeeIdentification", _employee.addEmployeeIdentification, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.get("/getEmployeeIdentification", _employee.getEmployeeIdentification, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.put("/updateEmployeeIdentification", _employee.updateEmployeeIdentification, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.delete("/deleteEmployeeIdentification", _employee.deleteEmployeeIdentification, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  api.post("/addEmployeeInfo", _employee.addEmployeeInfo, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  // created by Adnan
  api.get("/getEmployeeWorkExperience", _employee.getEmployeeWorkExperience, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.delete("/deleteEmployeeWorkExperience", _employee.deleteEmployeeWorkExperience, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.post("/addEmployeeWorkExperience", _employee.addEmployeeWorkExperience, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  // created by Adnan
  api.put("/updateEmployeeWorkExperience", _employee.updateEmployeeWorkExperience, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.get("/getEmployeeEducation", _employee.getEmployeeEducation, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.delete("/deleteEmployeeEducation", _employee.deleteEmployeeEducation, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan
  api.post("/addEmployeeEducation", _employee.addEmployeeEducation, function (req, res, next) {
    var resultBack = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultBack
    });
    next();
  }, _utils.releaseConnection);

  // created by Adnan
  api.put("/updateEmployeeEducation", _employee.updateEmployeeEducation, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  return api;
};
//# sourceMappingURL=employee.js.map