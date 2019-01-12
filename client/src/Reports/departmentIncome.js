import { revenueHeader } from "./revenueHeader";
import moment from "moment";
import Enumerable from "linq";

export function printReport(data) {
  let AllTotal = Enumerable.from(data).sum(s => s.total_amount);

  return `
    <header> ${revenueHeader(data)} </header> 
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
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>DEPARTMENT CODE</th>
                <th>DEPARTMENT NAME</th>
                <th>AMOUNT</th>
            </tr>
        </thead>
        <tbody>
        
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.sub_department_code}</td>
    <td>${list.sub_department_name} </td>
    <td style="text-align:right" >${list.total_amount} </td>
  </tr>
    `
    )
    .join("")} 
<tr>
    <td colspan="1"></td>
    <td> <b>Total Amount<b></td>
    <td style="text-align:right" ><b>${AllTotal}</b></td>
</tr>
        </tbody>
    </table>
</section>

  `;
}
