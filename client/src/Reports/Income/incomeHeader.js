import hims_app_logo from "../../assets/images/hospital_logo_reports.webp";
import moment from "moment";

export function incomeHeader(data) {
  return `
    <div class="hospitalLogo"><img src=${hims_app_logo} /></div>
            <div class="otherInfo">
                <p>Date:${moment(new Date()).format("DD-MMM-YYYY")}</p>
            </div>
            <div class="hospitalAddress">
                <h4>Income Reports</h4>
                <p># 301A, Curzon Square, Lady Curzon Road Opposite State Bank of India Bangalore Karnataka 560001</p>
            </div>
    `;
}
