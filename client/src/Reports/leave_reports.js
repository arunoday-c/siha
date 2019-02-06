import Enumerable from "linq";
import { payrollHeader } from "./payrollHeader";

export function printReport(data) {
  const leaveType = Enumerable.from(data)
    .groupBy("$.status", null, (key, group) => {
      return {
        status: key,
        list: group.getSource()
      };
    })
    .toArray();

  return `
  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Leave Report Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>Leave Application Code</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Leave Description</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Days</th>
                
            </tr>
        </thead>
        <tbody>
        ${leaveType
          .map(
            item =>
              ` <tr>
          <td colspan="7" class="tableSubHdg">${
            item.status === "APR"
              ? "Approved"
              : item.status === "PEN"
              ? "Pending"
              : item.status === "REJ"
              ? "Rejected"
              : item.status === "CAN"
              ? "Cancelled"
              : null
          }</td>
      </tr>
  ${item.list
    .map(
      list =>
        `
    <tr>
    <td>${list.leave_application_code}</td>
    <td>${list.employee_code}</td>
    <td>${list.employee_name}</td>
    <td>${list.leave_description} </td>
    <td>${list.from_date} </td>
    <td>${list.to_date} </td>
    <td>${list.total_applied_days} </td>
  
</tr>
    `
    )
    .join("")}
  
      `
          )
          .join("")}   
        </tbody>
    </table>
</section>
  `;
}
