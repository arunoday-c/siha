"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _userPreferences = require("../utils/userPreferences");

exports.default = function () {
  var api = (0, _express.Router)();
  api.get("/get", _userPreferences.getUserPreferences);
  api.post("/save", _userPreferences.saveUserPreferences);
  return api;
};
//# sourceMappingURL=userPreferences.js.map