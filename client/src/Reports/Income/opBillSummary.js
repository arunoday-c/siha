import Enumerable from "linq";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import { incomeHeader } from "./incomeHeader";
import "../report-style.scss";
export function printReport(data) {
  let AllTotal = Enumerable.from(data).sum(s => parseFloat(s.total_amount));

  return `
  <div class="print-body">
    <header> ${incomeHeader(data)} </header> 
    <section>
    <h2><span>Patient Details</span></h2>
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
    <td style="text-align:right">${GetAmountFormart(list.total_amount)} </td>
    `
    )
    .join("")} 
       
          
        <tr style="background: #f2f2f2;">
        <td colspan="1"></td>
        <td><b> Total Amount</b></td>
        <td style="text-align:right"><b>${GetAmountFormart(AllTotal)}</b></td>
    </tr>
     </tbody>
    </table>
    </div>
</section>

</div>
  `;
}
