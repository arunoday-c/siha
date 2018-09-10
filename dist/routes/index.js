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

var _languageTranslator = require("../controller/languageTranslator");

var _languageTranslator2 = _interopRequireDefault(_languageTranslator);

var _visit = require("../controller/visit");

var _visit2 = _interopRequireDefault(_visit);

var _serviceType = require("../controller/serviceType");

var _serviceType2 = _interopRequireDefault(_serviceType);

var _billing = require("../controller/billing");

var _billing2 = _interopRequireDefault(_billing);

var _patientType = require("../controller/patientType");

var _patientType2 = _interopRequireDefault(_patientType);

var _globalSearch = require("../controller/globalSearch");

var _globalSearch2 = _interopRequireDefault(_globalSearch);

var _insurance = require("../controller/insurance");

var _insurance2 = _interopRequireDefault(_insurance);

var _opBilling = require("../controller/opBilling");

var _opBilling2 = _interopRequireDefault(_opBilling);

var _userPreferences = require("../controller/userPreferences");

var _userPreferences2 = _interopRequireDefault(_userPreferences);

var _doctorsWorkBench = require("../EHR/controller/doctorsWorkBench");

var _doctorsWorkBench2 = _interopRequireDefault(_doctorsWorkBench);

var _hpi = require("../EHR/controller/hpi");

var _hpi2 = _interopRequireDefault(_hpi);

var _orderAndPreApproval = require("../controller/orderAndPreApproval");

var _orderAndPreApproval2 = _interopRequireDefault(_orderAndPreApproval);

var _laboratory = require("../controller/laboratory");

var _laboratory2 = _interopRequireDefault(_laboratory);

var _labmasters = require("../controller/labmasters");

var _labmasters2 = _interopRequireDefault(_labmasters);

var _investigation = require("../controller/investigation");

var _investigation2 = _interopRequireDefault(_investigation);

var _icdcptcodes = require("../controller/icdcptcodes");

var _icdcptcodes2 = _interopRequireDefault(_icdcptcodes);

var _radiology = require("../controller/radiology");

var _radiology2 = _interopRequireDefault(_radiology);

var _algaehappuser = require("../controller/algaehappuser");

var _algaehappuser2 = _interopRequireDefault(_algaehappuser);

var _dietmaster = require("../controller/dietmaster");

var _dietmaster2 = _interopRequireDefault(_dietmaster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

//connect to DB
//function(db)
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
  router.use("/translator", (0, _languageTranslator2.default)());
  router.use("/visit", (0, _visit2.default)({ config: _keys2.default, db: db }));
  router.use("/serviceType", (0, _serviceType2.default)({ config: _keys2.default, db: db }));
  router.use("/billing", (0, _billing2.default)({ config: _keys2.default, db: db }));
  router.use("/patientType", (0, _patientType2.default)({ config: _keys2.default, db: db }));
  router.use("/insurance", (0, _insurance2.default)({ config: _keys2.default, db: db }));
  router.use("/gloabelSearch", (0, _globalSearch2.default)());
  router.use("/opBilling", (0, _opBilling2.default)({ config: _keys2.default, db: db }));
  router.use("/userPreferences", (0, _userPreferences2.default)());
  router.use("/doctorsWorkBench", (0, _doctorsWorkBench2.default)({ config: _keys2.default, db: db }));
  router.use("/hpi", (0, _hpi2.default)({ config: _keys2.default, db: db }));
  router.use("/orderAndPreApproval", (0, _orderAndPreApproval2.default)({ config: _keys2.default, db: db }));
  router.use("/laboratory", (0, _laboratory2.default)({ config: _keys2.default, db: db }));
  router.use("/labmasters", (0, _labmasters2.default)({ config: _keys2.default, db: db }));
  router.use("/investigation", (0, _investigation2.default)({ config: _keys2.default, db: db }));
  router.use("/icdcptcodes", (0, _icdcptcodes2.default)({ config: _keys2.default, db: db }));
  router.use("/radiology", (0, _radiology2.default)({ config: _keys2.default, db: db }));
  router.use("/algaehappuser", (0, _algaehappuser2.default)({ config: _keys2.default, db: db }));
  router.use("/dietmaster", (0, _dietmaster2.default)({ config: _keys2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map