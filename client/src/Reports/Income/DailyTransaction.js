import { incomeHeader } from "./incomeHeader";
import { getAmountFormart } from "../../utils/GlobalFunctions";
// import _ from "lodash";
import "../report-style.scss";
export function printReport(result) {
  if (result === undefined) return null;
  const data = result.project_wise_payroll;
  if (data === undefined) return null;
  return `
  <div class="print-body">
  <header> ${incomeHeader(data)} </header> 
   
<section>
    <h2><span>Transaction Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Bill No.</th>
                <th>Bill Date</th>
                <th>Patient Code</th>
                <th>Patient Name</th>
                <th>Department  Name</th>
                <th>Doctor Name</th>
                <th>Patient Payable</th>
                <th>Company Payable</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td>  
    <td>${getAmountFormart(list.project_cost)} </td> 
</tr>
    `
    )
    .join("")}
  
 
    </thead></table></div>
   

</section></div>
  `;
}
