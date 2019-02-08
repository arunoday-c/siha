import { payrollHeader } from "./payrollHeader";

export function printReport(data) {
  return `
  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Salary Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Total Earnings</th>
                <th>Total Deductions</th>
                <th>Total Contributions</th>
                <th>Net Salary</th>
                <th>Advance Due</th>
                <th>Loan Due Amount</th>
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
    <td>${list.total_earnings} </td>
    <td>${list.total_deductions} </td>
    <td>${list.total_contributions} </td>
    <td>${list.net_salary} </td>
    <td>${list.advance_due} </td>
    <td>${list.loan_due_amount} </td>

  
</tr>
    `
    )
    .join("")}
  
 
        </tbody>
    </table>
</section>
  `;
}
