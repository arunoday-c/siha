import Enumerable from "linq";
import { revenueHeader } from "./revenueHeader";

export function printReport(data) {
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
    `
    )
    .join("")} 
       
          
        <tr>
        <td colspan="1"></td>
        <td> Total Amount</td>
        <td><span>${AllTotal}</span></td>
    </tr>
        </tbody>
    </table>
</section>

  `;
}