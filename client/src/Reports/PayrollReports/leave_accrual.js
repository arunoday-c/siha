// import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import "../report-style.scss";
import _ from "lodash";
import { getAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  // let leave_days = _.sumBy(data, s => parseFloat(s.leave_days));
  let leave_salary = _.sumBy(data, s => parseFloat(s.leave_salary));
  let airfare_amount = _.sumBy(data, s => parseFloat(s.airfare_amount));

  return `
  <div class="print-body">
  <header> ${payrollHeader(data, "Leave Provision Statement")} </header> 
   
<section>
   
    <div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th style="width:250px">Employee Name</th>
                <th>Department</th>
                <th>Leave Days</th>
                <th>Leave Salary</th>
                <th>Airfare Amount</th>
                
            </tr>
        </thead></table></div><div class="tbl-content" style="max-height:26vh" algaeh-report-table="true" >
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
     <td class="center" >${list.employee_code}</td>
     <td class="left"   style="width:250px">${list.full_name}</td>
     <td class="center" >${list.sub_department_name}</td>
     
     <td class="right" >${list.leave_days} </td>
     <td class="right" >${getAmountFormart(list.leave_salary, {
       appendSymbol: false
     })} </td>
     <td class="right" >${getAmountFormart(list.airfare_amount, {
       appendSymbol: false
     })} </td>
     

  
</tr>
    `
    )
    .join("")}
  
    
    </tbody></table></div>
    <div class="row reportFooterDetails">
    <div class="col"></div>


   <div class="col-2">
    <label> Total Leave Amount</label>

      <h6>${getAmountFormart(leave_salary)} </h6>
      </div>
      <div class="col-2">
    <label> Total Airfare</label>

      <h6>${getAmountFormart(airfare_amount)} </h6>
      </div>
   
      
    </div>
</section>
  `;
}
