"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cryptr = require("cryptr");

var _cryptr2 = _interopRequireDefault(_cryptr);

var _prod = require("../keys/prod");

var _prod2 = _interopRequireDefault(_prod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encryption = function encryption(data) {
  var stringData = JSON.stringify(_extends({}, require("../utils/cryptoData.json"), {
    algaeh_d_app_user_id: data["algaeh_d_app_user_id"],
    employee_id: data["employee_id"],
    sub_department_id: data["sub_department_id"],
    role_id: data["app_d_app_roles_id"],
    role_type: data["role_type"],
    app_group_id: data["app_group_id"],
    group_type: data["group_type"],
    username: data["username"],
    user_type: data["user_type"],
    loan_authorize_privilege: data["loan_authorize_privilege"],
    leave_authorize_privilege: data["leave_authorize_privilege"]
  }));
  return new _cryptr2.default(_prod2.default.SECRETKey).encrypt(stringData);
};

var decryption = function decryption(data) {
  var stringData = new _cryptr2.default(_prod2.default.SECRETKey).decrypt(data);
  return JSON.parse(stringData);
};

module.exports = {
  encryption: encryption,
  decryption: decryption
};
//# sourceMappingURL=cryptography.js.map