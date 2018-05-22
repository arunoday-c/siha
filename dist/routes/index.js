"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _middleware = require("../middleware");

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _account = require("../controller/account");

var _account2 = _interopRequireDefault(_account);

var _employee = require("../controller/employee");

var _employee2 = _interopRequireDefault(_employee);

var _department = require("../controller/department");

var _department2 = _interopRequireDefault(_department);

var _identity = require("../controller/identity");

var _identity2 = _interopRequireDefault(_identity);

var _visitType = require("../controller/visitType");

var _visitType2 = _interopRequireDefault(_visitType);

var _patientRegistration = require("../controller/patientRegistration");

var _patientRegistration2 = _interopRequireDefault(_patientRegistration);

var _frontDesk = require("../controller/frontDesk");

var _frontDesk2 = _interopRequireDefault(_frontDesk);

var _masters = require("../controller/masters");

var _masters2 = _interopRequireDefault(_masters);

var _updateMasters = require("../controller/updateMasters");

var _updateMasters2 = _interopRequireDefault(_updateMasters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

//connect to DB
(0, _db2.default)(function (db) {
  //internal middleware
  router.use((0, _middleware2.default)({ config: _keys2.default, db: db }));
  //api router v1
  router.use("/apiAuth", (0, _account2.default)({ config: _keys2.default, db: db }));
  router.use("/employee", (0, _employee2.default)({ config: _keys2.default, db: db }));
  router.use("/department", (0, _department2.default)({ config: _keys2.default, db: db }));
  router.use("/identity", (0, _identity2.default)({ config: _keys2.default, db: db }));
  router.use("/visitType", (0, _visitType2.default)({ config: _keys2.default, db: db }));
  router.use("/patient", (0, _patientRegistration2.default)({ config: _keys2.default, db: db }));
  router.use("/frontDesk", (0, _frontDesk2.default)({ config: _keys2.default, db: db }));
  router.use("/masters/get", (0, _masters2.default)());
  router.use("/masters/set", (0, _updateMasters2.default)());
});

exports.default = router;
//# sourceMappingURL=index.js.map