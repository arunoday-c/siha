import { payrollHeader } from "./payrollHeader";
import _ from "lodash";
import "../report-style.css";
import math from "mathjs";
export function printReport(result) {
  if (result === undefined) return null;
  const data = result;
  if (data === undefined) return null;
  debugger;
  let total_worked_hours = _.sumBy(data, s => parseFloat(s.total_hours));
  let ot_work_hours = _.sumBy(data, s => parseFloat(s.ot_work_hours));
  let shortage_hours = _.sumBy(data, s => parseFloat(s.shortage_hours));
  let ot_weekoff_hours = _.sumBy(data, s => parseFloat(s.ot_weekoff_hours));
  let ot_holiday_hours = _.sumBy(data, s => parseFloat(s.ot_holiday_hours));

  // document
  //   .getElementById("reportFixedTable")
  //   .addEventListener("scroll", function(e) {
  //     alert("Hello");
  //     console.log("Im Here");
  //   });

  // $("#tbl-content").scroll(function() {
  //   $("#tbl-header").scrollTop($(this).scrollTop());
  // });

  return `

  <div class="print-body">
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Attendence Details</span></h2><div class="tbl-header">
    <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Total Days</th>
                <th>Total Work Days</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Paid Leaves</th>
                <th>Unpaid Leaves</th>
                <th>Total Paid Days</th>
                <th>Total Holidays</th>
                <th>Total Week Off Days</th>
                <th>Total Working Hours</th>
                <th>Total Worked Hours</th>
                <th>OT Hours</th>
                <th>Shortage Hours</th>
                <th>Week Off OT</th>
                <th>Holiday OT</th>                
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 22vh" algaeh-report-table="true" >
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.employee_code}</td>
    <td>${list.employee_name}</td>    
    <td>${list.total_days} </td>
    <td>${list.total_work_days} </td>
    <td>${list.present_days}</td>
    <td>${list.absent_days}</td>    
    <td>${list.paid_leave} </td>
    <td>${list.unpaid_leave} </td>
    <td>${list.total_paid_days}</td>
    <td>${list.total_holidays}</td>    
    <td>${list.total_weekoff_days} </td>
    <td>${
      list.total_working_hours ? list.total_working_hours + " Hrs" : "00:00 Hrs"
    } </td>
    <td>${list.total_hours ? list.total_hours + " Hrs" : "00:00 Hrs"} </td>
    <td>${list.ot_work_hours ? list.ot_work_hours + " Hrs" : "00:00 Hrs"} </td>
    <td>${
      list.shortage_hours ? list.shortage_hours + " Hrs" : "00:00 Hrs"
    } </td>

    <td>${
      list.ot_weekoff_hours ? list.ot_weekoff_hours + " Hrs" : "00:00 Hrs"
    } </td>
    <td>${
      list.ot_holiday_hours ? list.ot_holiday_hours + " Hrs" : "00:00 Hrs"
    } </td>
   
</tr>
    `
    )
    .join("")}
  
 
    </thead></table></div> 
    
    <div class="row">
    <div class="col"></div>
      <div class="col-2">
        <label>Total Worked Hours</label>
        <h6>${total_worked_hours ? total_worked_hours : "00:00"} Hrs</h6>
      </div>
      <div class="col-2">
        <label>Total OT Hours</label>
        <h6>${ot_work_hours ? ot_work_hours : "00:00"} Hrs</h6>
      </div>
      <div class="col-2">
        <label>Total Shortage Hours</label>

        <h6>${shortage_hours ? shortage_hours : "00:00"} Hrs</h6>
      </div>
      <div class="col-2">
        <label>Total Weekoff OT</label>
        <h6>${
          ot_weekoff_hours ? math.round(ot_weekoff_hours, 2) : "00:00"
        } Hrs</h6>
      </div>
      <div class="col-2">
        <label>Total Holiday Ot</label>
        <h6>${ot_holiday_hours ? ot_holiday_hours : "00:00"} Hrs</h6>
      </div>    
    </div>
  </div>

</section>
  `;
}
