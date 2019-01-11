import Enumerable from "linq";
import { signature_footer } from "./signature_footer";
import { revenueHeader } from "./revenueHeader";

export function printReport(data) {
  debugger;
  const serviceGroup = [];
  //   const serviceGroup = Enumerable.from(data.services)
  //     .groupBy("$.service_type", null, (key, group) => {
  //       return {
  //         service_type: key,
  //         list: group.getSource()
  //       };
  //     })
  //     .toArray();

  let AllTotal = Enumerable.from(data).sum(s => s.total_amount);

  return `
  <div class="print-body">
    <header> ${revenueHeader(data)} </header> 
    <section>
    <h2><span>Patient Details</span></h2>
    <table class="tableForLabel" cell-padding="0">
        <tr>
            <td><label> Hospital Name</label></td>
            <td>: <span>Royal Bangalore Hospital - HRBR</span></td>
            <td><label>  Type</label></td>
            <td>: <span> Income</span></td>
        </tr>
        <tr>
            <td colspan="4" style="background:#f2f2f2;height:0px;"></td>
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

<<<<<<< HEAD
</section>
<section>
    <h2><span>Bill Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>SERVICE TYPE CODE</th>
                <th>SERVICE TYPE</th>
                <th>AMOUNT</th>
                
            </tr>
        </thead>
        <tbody>
        
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.service_type_code}</td>
    <td>${list.service_type} </td>
    <td>${list.total_amount} </td>
    </tr>
    `
    )
    .join("")} 
       
          
        <tr>
        <td colspan="3"></td>
        <td> Total Amount</td>
        <td><span>${AllTotal}</span></td>
    </tr>
        </tbody>
    </table>
</section>
    <footer> ${signature_footer(data)}</footer>
=======
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
>>>>>>> 2d6ee5af893ceb14bb1376e84d2b83c7825d6f7a

    `;
}
