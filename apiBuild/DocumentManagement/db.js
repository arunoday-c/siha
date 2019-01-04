"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _keys = require("../../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callBack) {
  var _db = _mongoose2.default.connect(_keys2.default.mongoDb.connectionURI, { useNewUrlParser: true, useFindAndModify: false });
  callBack(_db);
};
//# sourceMappingURL=db.js.map