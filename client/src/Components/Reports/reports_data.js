import {
  LEAVE_STATUS,
  LOAN_STATUS,
  ADV_LOAN_STATUS,
  MONTHS,
  LOCAL_TYPE,
  FORMAT_PAYTYPE,
  EXPIRY_STATUS,
  EMPLOYEE_STATUS,
  COMPARISON,
  EMP_FORMAT_GENDER,
  DATE_OF_JOIN,
  EMPLOYEE_TYPE,
  RECEIPT_TYPE,
  SENDOUT_TYPE,
  FORMAT_PRIORITY,
  FORMAT_YESNO,
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
import Clinical from "./reportBag/clinical";
import Laboratory from "./reportBag/laboratory";
import spotlightSearch from "../../Search/spotlightSearch.json";
let allYears = getYears();

export default function loadActiveReports(
  userToken,
  selectedMenu,
  parameterName
) {
  return new Promise((resolve, reject) => {
    try {
      const {
        hims_d_hospital_id,
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
          result = Income({
            hospital_id: hims_d_hospital_id,
            RECEIPT_TYPE,
            algaehApiCall,
            FORMAT_YESNO,
          });
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
            allYears,
            EXPIRY_STATUS,
          });
          break;
        case "appointment":
          result = Appointment({});
          break;
        case "clinical":
          result = Clinical({});
          break;
        case "laboratory":
          result = Laboratory({ SENDOUT_TYPE, FORMAT_PRIORITY });
          break;
        case "inventory":
          result = Inventory({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            EXPIRY_STATUS,
            moment,
            spotlightSearch,
          });
          break;
        case "patient":
          result = Patient({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            MONTHS,
            COMPARISON,
            EMP_FORMAT_GENDER,
            DATE_OF_JOIN,
            moment,
            allYears,
          });
          break;
        case "payroll":
          result = Payroll({
            hospital_id: hims_d_hospital_id,
            LOCAL_TYPE,
            allYears,
            MONTHS,
            LEAVE_STATUS,
            LOAN_STATUS,
            ADV_LOAN_STATUS,
            algaehApiCall,
            moment,
          });
          break;
        case "pharmacy":
          result = Pharmacy({
            hospital_id: hims_d_hospital_id,
            algaehApiCall,
            FORMAT_PAYTYPE,
            EXPIRY_STATUS,
            moment,
            spotlightSearch,
          });
          break;
        case "project":
          result = Project({
            hospital_id: hims_d_hospital_id,
            LOCAL_TYPE,
            moment,
            allYears,
            MONTHS,
            algaehApiCall,
          });
          break;
        case "vat":
          result = Vat({
            hospital_id: hims_d_hospital_id,
            moment,
            allYears,
            MONTHS,
            algaehApiCall,
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
