import Enumerable from "linq";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import { incomeHeader } from "./incomeHeader";
import "../report-style.scss";
export function printReport(data) {
  let AllTotal = Enumerable.from(data).sum(s => parseFloat(s.total_amount));

  return `
  <div class="print-body">
    <header> ${incomeHeader(data)} </header> 
    <section>
    <h2><span>Hospital Details</span></h2>
    <table class="tableForLabel" cell-padding="0">
        <tr>
            <td><label> Hospital Name</label></td>
            <td><span>Royal Bangalore Hospital - HRBR</span></td>
            <td><label>  Type</label></td>
            <td><span> Income</span></td>
        </tr>
    </table>

</section>
<section>
    <h2><span>${data.length > 0 ? data[0].service_type : ""} Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>SERVICE CODE</th>
                <th>SERVICE NAME</th>
                <th>AMOUNT</th>
                
            </tr>
        </thead>
        <tbody>
        <tr style="background: #f2f2f2;">
          <td colspan="3" class="tableSubHdg">${
            data.length > 0 ? data[0].service_type : ""
          }</td>
      </tr>  
  ${data
    .map(
      list =>
        `
      
    <tr>
    <td>${list.service_code}</td>
    <td>${list.service_name} </td>
    <td style="text-align:right">${getAmountFormart(list.total_amount)} </td>
    </tr>
    `
    )
    .join("")} 
       
          
        <tr>
        <td colspan="1"></td>
        <td> <b>Total Amount</b></td>
        <td style="text-align:right"><b>${getAmountFormart(AllTotal)}</b></td>
    </tr>
        </tbody>
    </table>
</section></div>
  `;
}
