"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

var _documents = require("../Controller/documents");

var _documents2 = _interopRequireDefault(_documents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

(0, _db2.default)(function (db) {
  router.use("/Document", (0, _documents2.default)(db));
});
exports.default = router;
//# sourceMappingURL=index.js.map