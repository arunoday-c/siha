"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _department = require("../model/department");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/add", _department.addDepartment, function (req, res, next) {
    var resultTables = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: resultTables
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updateDepartment", _department.updateDepartment, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.get("/get", _department.selectDepartment, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.get("/get/subdepartment", _department.selectSubDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.post("/add/subdepartment", _department.addSubDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updateSubDepartment", _department.updateSubDepartment, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  //created by:irfan
  api.delete("/deleteSubDepartment", _department.deleteSubDepartment, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  //created by:irfan
  api.put("/makeSubDepartmentInActive", _department.makeSubDepartmentInActive, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  //created by:irfan makeDepartmentInActive
  api.put("/makeDepartmentInActive", _department.makeDepartmentInActive, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  api.delete("/deleteDepartment", _department.deleteDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/get/get_All_Doctors_DepartmentWise", _department.selectdoctors, function (req, res, next) {
    var result = req.records;
    var departmets = result.departments;
    var doctors = result.doctors;
    var dept_Obj = new Array();
    var doc_Obj = new Array();
    var d_keys = Object.keys(departmets);
    d_keys.forEach(function (item, index) {
      var firstItem = new _nodeLinq.LINQ(departmets[item]).FirstOrDefault();
      var subDept = new Object();
      subDept["department_id"] = firstItem.department_id;
      subDept["sub_department_id"] = firstItem.sub_department_id;
      subDept["sub_department_name"] = firstItem.sub_department_name;
      subDept["department_type"] = firstItem.department_type;
      subDept["arabic_sub_department_name"] = firstItem.arabic_sub_department_name;
      subDept["doctors"] = departmets[item];
      dept_Obj.push(subDept);
    });

    var doc_keys = Object.keys(doctors);
    doc_keys.forEach(function (item, index) {
      var firstItem = new _nodeLinq.LINQ(doctors[item]).FirstOrDefault();
      var doc = new Object();
      doc["employee_id"] = firstItem.employee_id;
      doc["full_name"] = firstItem.full_name;
      doc["arabic_name"] = firstItem.arabic_name;
      doc["services_id"] = firstItem.services_id;
      doc["departments"] = doctors[item];
      doc_Obj.push(doc);
    });

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: {
        departmets: dept_Obj,
        doctors: doc_Obj
      }
    });
    next();
  }, _utils.releaseConnection);

  //created by:irfan to get sub departments doctors and clinic
  api.get("/selectDoctorsAndClinic", _department.selectDoctorsAndClinic, function (req, res, next) {
    var result = req.records;
    var departmets = result.departments;
    var doctors = result.doctors;
    var dept_Obj = new Array();
    var doc_Obj = new Array();
    var d_keys = Object.keys(departmets);
    d_keys.forEach(function (item, index) {
      var firstItem = new _nodeLinq.LINQ(departmets[item]).FirstOrDefault();
      var subDept = new Object();
      subDept["department_id"] = firstItem.department_id;
      subDept["sub_dept_id"] = firstItem.sub_dept_id;
      subDept["sub_department_name"] = firstItem.sub_department_name;
      subDept["arabic_sub_department_name"] = firstItem.arabic_sub_department_name;
      subDept["doctors"] = departmets[item];
      dept_Obj.push(subDept);
    });

    var doc_keys = Object.keys(doctors);
    doc_keys.forEach(function (item, index) {
      var firstItem = new _nodeLinq.LINQ(doctors[item]).FirstOrDefault();
      var doc = new Object();
      doc["provider_id"] = firstItem.provider_id;
      doc["full_name"] = firstItem.full_name;
      doc["arabic_name"] = firstItem.arabic_name;
      doc["services_id"] = firstItem.services_id;
      doc["departments"] = doctors[item];
      doc_Obj.push(doc);
    });

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: {
        departmets: dept_Obj,
        doctors: doc_Obj
      }
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=department.js.map