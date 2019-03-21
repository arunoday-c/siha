import { projectPayrol } from "./ProjectPayrollHeader";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import _ from "lodash";
import "../report-style.css";
export function printReport(result) {
  if (result === undefined) return null;
  const data = result.project_wise_payroll;
  if (data === undefined) return null;
  return `
  <div class="print-body">
  <header> ${projectPayrol(data)} </header> 
   
<section>
    <h2><span>Salary Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Project Name</th>
                <th>Employee Name</th>
                <th>Employee Designation</th>
                <th>Total Worked Hr</th>
                <th>Project Cost</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.project_desc}</td>
    <td>${_.startCase(_.toLower(list.full_name))}</td>
    <td>${list.designation} </td>
    <td>${list.complete_hours} </td>
    <td>${getAmountFormart(list.project_cost)} </td>  
</tr>
    `
    )
    .join("")}
  
 
    </thead></table></div>
    <div class="row">
    <div class="col"></div>
    <div class="col-2">
    <label>No. of Empoyees</label>
      <h6>${result.noEmployees} Nos</h6>
    </div>
    <div class="col-2">
  
    <label>Total Worked Hours</label>
      <h6>${result.total_worked_hours} Hr</h6>
    </div>
    <div class="col-2">
    <label>Project Total Cost</label>

      <h6>${getAmountFormart(result.total_cost)} </h6>
    </div>
  </div>

</section>
  `;
}
