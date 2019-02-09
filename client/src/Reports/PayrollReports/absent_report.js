import { payrollHeader } from "./payrollHeader";
import moment from "moment";

export function printReport(data) {
  return `
  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Employee Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Absent Date</th>
                <th>From Session</th>
                <th>To Session</th>
                <th>Duration</th>
                <th>Cancelled</th>
                
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
    <td>${moment(list.absent_date).format("DD-MM-YYYY")} </td>
    <td>${
      list.from_session === "FH"
        ? "First Half"
        : list.from_session === "SH"
        ? "Second Half"
        : list.from_session === "FD"
        ? "Full Day"
        : null
    } </td>
    <td>${
      list.to_session === "FH"
        ? "First Half"
        : list.to_session === "SH"
        ? "Second Half"
        : list.to_session === "FD"
        ? "Full Day"
        : null
    } </td>
    <td>${list.absent_duration ? list.absent_duration : "------"} </td>
    <td>${list.cancel === "Y" ? "Yes" : "No"} </td>
  
</tr>
    `
    )
    .join("")}
  
 
        </tbody>
    </table>
</section>
  `;
}
