import hims_app_logo from "../assets/images/hospital_logo_reports.webp";

export function header(data) {
  return `
    <div class="hospitalLogo"><img src=${hims_app_logo} /></div>
            <div class="otherInfo">
                <p>Date:${data.receipt_date}</p>
            </div>
            <div class="hospitalAddress">
                <h4>Cash Invoice</h4>
                <p># 301A, Curzon Square, Lady Curzon Road Opposite State Bank of India Bangalore Karnataka 560001 IN, Lady Curzon Rd, Shivaji Nagar, Bengaluru, Karnataka 560001</p>
            </div>
    `;
}
