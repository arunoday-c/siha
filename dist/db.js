"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mysql = require("mysql");

var _mysql2 = _interopRequireDefault(_mysql);

var _keys = require("./keys/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
  var db = _mysql2.default.createPool(_keys2.default.mysqlDb);
  callback(db);
};
//# sourceMappingURL=db.js.map