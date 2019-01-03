"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _general_ledger = require("../controllers/general_ledger");

var _general_ledger2 = _interopRequireDefault(_general_ledger);

var _attandance = require("../controllers/attandance");

var _attandance2 = _interopRequireDefault(_attandance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();
router.use("/attendance", (0, _attandance2.default)());
router.use("/testapi", (0, _general_ledger2.default)());
exports.default = router;
//# sourceMappingURL=index.js.map