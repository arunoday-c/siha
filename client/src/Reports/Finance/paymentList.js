import { financeHeader } from "./financeHeader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
// import _ from "lodash";
import "../report-style.scss";
export function printReport(result) {
  if (result === undefined) return null;
  const data = result.project_wise_payroll;
  if (data === undefined) return null;
  return `
  <div class="print-body">
  <header> ${financeHeader(data)} </header> 
   
<section>
    <h2><span>List of Payment Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Payment No.</th>
                <th>Payment Date</th>
                <th>Patient Code</th>
                <th>Patient Name</th>
                <th>Department  Name</th>
                <th>Doctor Name</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Cheque</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
    <td>${GetAmountFormart(list.project_cost)} </td>  
</tr>
    `
    )
    .join("")}
  
 
    </thead></table></div>
   

</section></div>
  `;
}
