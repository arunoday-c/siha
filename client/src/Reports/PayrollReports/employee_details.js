import { payrollHeader } from "./payrollHeader";

export function printReport(data) {
  return `
  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Gender</th>
                <th>Date of Joining</th>
                <th>Department</th>
                <th>Designation</th>
                
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
    <td>${list.sex} </td>
    <td>${list.date_of_joining} </td>
    <td>${list.sub_department_name} </td>
    <td>${list.designation} </td>
  
</tr>
    `
    )
    .join("")}
  
 
        </tbody>
    </table>
</section>
  `;
}
