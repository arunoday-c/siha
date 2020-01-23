import { incomeHeader } from "./incomeHeader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import Enumerable from "linq";
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



    <h2><span>Report Details</span></h2>
<div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Department Code</th>
                <th>Department Name</th>
                <th>Amount</th>
            </tr>
        </thead></table></div>
        <div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
        
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.sub_department_code}</td>
    <td>${list.sub_department_name} </td>
    <td style="text-align:right" >${GetAmountFormart(list.total_amount)} </td>
  </tr>
    `
    )
    .join("")} 

        </tbody>
    </table>
    </div>

    <div class="row">
    <div class="col-10"></div>
    <div class="col" style="text-align:right"><label>Total Amount</label><h6>${GetAmountFormart(
      AllTotal
    )}</h6></div>

    </div>

</section>
</div>

  `;
}
