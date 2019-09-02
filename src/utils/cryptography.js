import cryptr from "cryptr";
import algaehKeys from "algaeh-keys"; //"../keys/prod";
import { debugLog } from "../utils/logging";
const keys = algaehKeys.default;
let encryption = data => {
  debugLog("data", data);
  const stringData = JSON.stringify({
    ...require("../utils/cryptoData.json"),
    ...{
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
      leave_authorize_privilege: data["leave_authorize_privilege"],
      decimal_places: data["decimal_places"],
      edit_monthly_attendance: data["edit_monthly_attendance"],
      hospital_id: data["hospital_id"],
      default_currency: data["default_currency"],
      default_nationality: data["default_nationality"],
      unique_id_for_appointmt: data["unique_id_for_appointmt"],
      symbol_position: data["symbol_position"],
      currency_symbol: data["currency_symbol"],
      thousand_separator: data["thousand_separator"],
      decimal_separator: data["decimal_separator"]
    }
  });
  debugLog("stringData", stringData);
  return new cryptr(keys.SECRETKey).encrypt(stringData);
};

let decryption = data => {
  const stringData = new cryptr(keys.SECRETKey).decrypt(data);
  return JSON.parse(stringData);
};

module.exports = {
  encryption,
  decryption
};
