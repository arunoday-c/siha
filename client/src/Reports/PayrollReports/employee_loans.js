import { payrollHeader } from "./payrollHeader";
import moment from "moment";
import { getAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  return `
  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Loan Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Loan Application Date</th>
                <th>Loan Amount</th>
                <th>Approved Amount</th>
                <th>Installment Amount</th>
                <th>Pending Loan</th>
       
                
            </tr>
        </thead>
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.employee_code}</td>
    <td>${list.employee_name}</td>
    <td>${list.sub_department_name} </td>
    <td>${moment(list.loan_application_date).format("DD-MM-YYYY")} </td>
    <td>${getAmountFormart(list.loan_amount)} </td>
    <td>${getAmountFormart(list.approved_amount)} </td>
    <td>${getAmountFormart(list.installment_amount)} </td>
    <td>${getAmountFormart(list.pending_loan)} </td>
  
</tr>
    `
    )
    .join("")}
  
 
        </tbody>
    </table>
</section>
  `;
}
