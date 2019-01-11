import Enumerable from "linq";
import { header } from "./header";
import { signature_footer } from "./signature_footer";

export function printReport(data) {
  const serviceGroup = Enumerable.from(data.services)
    .groupBy("$.service_type", null, (key, group) => {
      return {
        service_type: key,
        list: group.getSource()
      };
    })
    .toArray();

  return `
    <div class="print-body">
      <header> ${header(data)} </header> 
      <section>
      <h2><span>Patient Details</span></h2>
      <table class="tableForLabel" cell-padding="0">
          <tr>
              <td><label>رقم التسجيل الضريبي / TRN</label></td>
              <td>: <span>301270966900003</span></td>
              <td><label>النوع / Type</label></td>
              <td>: <span>ائتمان/ Cash</span></td>
          </tr>
          <tr>
              <td colspan="4" style="background:#f2f2f2;height:0px;"></td>
          </tr>
          <tr>
              <td><label>رقم الملف الطبي / Patient Code</label></td>
              <td>: <span>${data.patient_code}</span></td>
              <td><label>رقم الفاتورة / Invoice No</label></td>
              <td>: <span>${data.invoice_number}</span></td>
          </tr>
  
          <tr>
              <td><label>اسم المريض / Patient Name</label></td>
              <td>: <span>${data.full_name}</span></td>
              <td><label>اريخ الفاتورة / Invoice Date</label></td>
              <td>: <span>${data.receipt_date}</span></td>
          </tr>
  
          <tr>
              <td><label>اسم الطبيب / Doctor</label></td>
              <td>: <span>${data.doctor_name}</span></td>
              <td><label>Department / القسم</label></td>
              <td>: <span>General Practioner(G.P)</span></td>
          </tr>
  
      </table>
  
  
  </section>
  <section>
      <h2><span>Bill Details</span></h2>
      <table class="tableForData" cell-padding="0">
          <thead>
              <tr>
                  <th>SERVICE DESCRIPTION</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>DISCOUNT</th>
                  <th>NET AMOUNT</th>
                  <th>VAT AMOUNT</th>
                  <th>PATIENT SHARE</th>
              </tr>
          </thead>
          <tbody>
          ${serviceGroup
            .map(
              item =>
                ` <tr>
            <td colspan="7" class="tableSubHdg">${item.service_type}</td>
        </tr>
    ${item.list
      .map(
        list =>
          `
      <tr>
      <td>${list.service_name}</td>
      <td>${list.quantity} </td>
      <td>${list.gross_amount} </td>
      <td>${list.discount_amout} </td>
      <td>${list.net_amout} </td>
      <td>${list.patient_tax} </td>
      <td>${list.patient_resp} </td>
  </tr>
      `
      )
      .join("")}
    
        `
            )
            .join("")}   
         
            
          <tr>
          <td colspan="5"></td>
          <td>SAR( المبلغ الصافي / Net Amount</td>
          <td><span>76.00</span></td>
      </tr>
          </tbody>
      </table>
      <table class="tableForData" style="
      float: right;
      width: 25%;
      margin-top: 4px;
  "><tbody>
      <tr><td>مبالغ لم تسدد  / Previous Due</td><td><span>0.00</span></td></tr>
      <tr><td>مجموع / Total</td><td><span>${data.total_amount}</span></td></tr>
      <tr><td>المبلغ المدفوع / Paid Amount</td><td><span>0.00</span></td></tr>
      <tr><td>المبلغ المتبقي / Balance Due</td><td><span>0.00</span></td></tr>
      </tbody>
  </table>
  </section>
      <footer> ${signature_footer(data)}</footer>
  
    `;
}
