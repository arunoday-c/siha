import hims_app_logo from "../assets/images/hospital_logo_reports.webp";
import moment from "moment";
import { AlgaehOpenContainer } from "../utils/GlobalFunctions";

let HospitalDetails = JSON.parse(
  AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
);

export function ReportHeader(data, report_name) {
  return `
    <div class="hospitalLogo"><img src=${hims_app_logo} /></div>
            <div class="otherInfo">
                <p>Date:${moment(new Date()).format("DD-MMM-YYYY")}</p>
            </div>
            <div class="hospitalAddress">
                <h4>${report_name}</h4>
                <p>${HospitalDetails.hospital_address}</p>
                </div>
    `;
}
