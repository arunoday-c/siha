import hims_app_logo from "../assets/images/hospital_logo_reports.webp";
import moment from "moment";

export function revenueHeader(data) {
  return `
    <div class="hospitalLogo"><img src=${hims_app_logo} /></div>
            <div class="otherInfo">
                <p>Report Generated on: </br><b>${moment(new Date()).format(
                  "DD-MMM-YYYY"
                )}<b></p>
            </div>
            <div class="hospitalAddress">
                <h4>Staff Cash Collection Report</h4>
                <p>From: <b>12/01/2019</b>, To: <b>12/01/2019</b> | Category: <b>Pharmacy</b></p>
            </div>
    `;
}
