import {

  LEAVE_STATUS,
  MONTHS,
  LOCAL_TYPE,
  FORMAT_PAYTYPE,
  EXPIRY_STATUS,
  EMPLOYEE_STATUS,
  COMPARISON,
  EMP_FORMAT_GENDER,
  DATE_OF_JOIN,
  EMPLOYEE_TYPE
} from "../../utils/GlobalVariables.json";
import { getYears } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall";
import moment from "moment";
import Insurance from "./reportBag/insurance";
import Income from "./reportBag/income";
import Hr from "./reportBag/hr";
import Appointment from "./reportBag/appointment";
import Inventory from "./reportBag/inventory";
import Patient from "./reportBag/patient";
import Payroll from "./reportBag/payroll";
import Pharmacy from "./reportBag/pharmacy";
import Project from "./reportBag/projectpayroll";
import Vat from "./reportBag/vat";
let allYears = getYears();

export default function loadActiveReports(
  userToken,
  selectedMenu,
  parameterName
) {
  return new Promise((resolve, reject) => {
    try {
      const {
        hims_d_hospital_id
        //  product_type
      } = userToken;
      // const { screen_code } = selectedMenu;
      // hospital_id = hims_d_hospital_id;
      let result = [];
      switch (parameterName) {
        case "insurance":
          result = Insurance({ algaehApiCall });
          break;
        case "income":
          result = Income({ hospital_id: hims_d_hospital_id, algaehApiCall });
          break;
        case "hr":
          result = Hr({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            MONTHS,
            EMPLOYEE_STATUS,
            EMPLOYEE_TYPE,
            COMPARISON,
            EMP_FORMAT_GENDER,
            DATE_OF_JOIN,
            moment,
            allYears
          });
          break;
        case "appointment":
          result = Appointment({});
          break;
        case "inventory":
          result = Inventory({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            EXPIRY_STATUS,
            moment
          });
          break;
        case "patient":
          result = Patient({});
          break;
        case "payroll":
          result = Payroll({
            hospital_id: hims_d_hospital_id,
            LOCAL_TYPE,
            allYears,
            MONTHS,
            LEAVE_STATUS,
            algaehApiCall,
            moment
          });
          break;
        case "pharmacy":
          result = Pharmacy({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            FORMAT_PAYTYPE,
            EXPIRY_STATUS,
            moment
          });
          break;
        case "project":
          result = Project({
            hospital_id: hims_d_hospital_id,
            LOCAL_TYPE,
            moment,
            allYears,
            MONTHS,
            algaehApiCall
          });
          break;
        case "vat":
          result = Vat({
            hospital_id: hims_d_hospital_id,
            moment,
            allYears,
            MONTHS,
            algaehApiCall
          });
          break;
        default:
          break;
      }
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}
