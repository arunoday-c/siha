import cryptr from "cryptr";
import keys from "../keys/prod";

let encryption = data => {
  const stringData = JSON.stringify({
    ...require("../utils/cryptoData.json"),
    ...{
      algaeh_d_app_user_id: data["algaeh_d_app_user_id"],
      employee_id: data["employee_id"],
      sub_department_id: data["sub_department_id"],
      role_id: data["role_id"],
      app_group_id: data["app_group_id"],
      group_type: data["group_type"]
    }
  });
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
