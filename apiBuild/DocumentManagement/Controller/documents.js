"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _documents = require("../Model/documents");

var _documents2 = _interopRequireDefault(_documents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (db) {
  var api = (0, _express.Router)();
  api.post("/save", (0, _documents2.default)(db).saveDocument);
  api.get("/get", (0, _documents2.default)(db).getDocument);
  return api;
};
//# sourceMappingURL=documents.js.map