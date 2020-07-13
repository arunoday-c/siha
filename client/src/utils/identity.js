// import React, { useContext } from "react";
// import { MainContext } from "algaeh-react-components";
import { getItem, tokenDecode } from "algaeh-react-components";
export async function GetContextForm(name) {
  if (name === "") return "";
  const token = await getItem("token");

  if (name === "authToken") {
    return token;
  }
  const userToken = tokenDecode(token);
  let detail = null;
  switch (name) {
    case "HospitalId":
      detail = userToken.hims_d_hospital_id;
      break;
    case "userName":
      detail = userToken.full_name;
      break;
    default:
      detail = "";
      break;
  }
  return detail;
}
