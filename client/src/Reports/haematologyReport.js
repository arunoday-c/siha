import { header } from "./labHeader";
import { signature_footer } from "./signature_footer";
import "../../src/index.scss";
import moment from "moment";

export function printReport(data) {
  return `
    <div class="print-body">
    <header> ${header(data)} </header> 
        <section>
            <h2><span>Patient Details</span></h2>
            <table class="tableForLabel" cell-padding="0">
                <tr>
                    <td><label>رقم الملف الطبي / Reg. Number</label></td>
                    <td>: <span>${data.patient_code}</span></td>
                    <td><label>رقم الفاتورة / Report No</label></td>
                    <td>: <span>005685</span></td>
                </tr>

                <tr>
                    <td><label>اسم المريض / Patient Name</label></td>
                    <td>: <span>${data.full_name}</span></td>
                    <td><label>اريخ الفاتورة / Report Date</label></td>
                    <td>: <span>${moment(data.receipt_date).format(
                      "DD-MM-YYYY"
                    )}</span></td>
                </tr>

                <tr>
                    <td><label>اسم الطبيب / Doctor</label></td>
                    <td>: <span>${data.doctor_name}</span></td>
                    <td><label>Investigation Name / اسم التحقيق</label></td>
                    <td>: <span>${data.investigation_name}</span></td>
                </tr>

               
            </table>


        </section>
        <section>
            <h2><span>Bill Details</span></h2>
            <table class="tableForData" cell-padding="0">
                <thead>
                    <tr>
                    <th>Analyte</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Normal Range</th>
                    <th>Critical Range</th>
                    </tr>
                </thead>
                <tbody>
                 ${data.test_analytes
                   .map(
                     list =>
                       `
                         <tr>
                         <td>${list.description}</td>
                         <td>${list.result}</td>
                         <td>${list.result_unit}</td>
                         <td>${list.normal_low + "-" + list.normal_high}</td>
                         <td>${list.critical_low +
                           "-" +
                           list.critical_high}</td>
                     </tr>
                         `
                   )
                   .join("")}
                  
                </tbody>
            </table>
        </section>
        <footer> ${signature_footer(data)}</footer>
    </div>`;
}
