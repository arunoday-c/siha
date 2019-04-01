import hims_app_logo from "../../assets/images/hospital_logo_reports.webp";
import moment from "moment";

export function PatReportHeader(data, report_name) {
  return `
    <div class="hospitalLogo"><img src=${hims_app_logo} /></div>
            <div class="otherInfo">
                <p>Date:${moment(new Date()).format("DD-MMM-YYYY")}</p>
            </div>
            <div class="hospitalAddress">
                <h4>${report_name}</h4>
                <p># 301A, Curzon Square, Lady Curzon Road Opposite State Bank of India Bangalore Karnataka 560001 IN, Lady Curzon Rd, Shivaji Nagar, Bengaluru, Karnataka 560001</p>
            </div>
    `;
}
