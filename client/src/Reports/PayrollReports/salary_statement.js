import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import "../report-style.css";
import _ from "lodash";
import { getAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  let net_salary = _.sumBy(data, s => parseFloat(s.net_salary));
  let total_earnings = _.sumBy(data, s => parseFloat(s.total_earnings));
  let total_deductions = _.sumBy(data, s => parseFloat(s.total_deductions));
  let total_contributions = _.sumBy(data, s =>
    parseFloat(s.total_contributions)
  );

  return `
  <div class="print-body">
  <header> ${payrollHeader(data, "Salary Statement")} </header> 
   
<section>
    <h2><span>Salary Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th style="width:250px">Employee Name</th>
                <th>Department</th>
                <th>Nationality</th>
                <th>Total Earnings</th>
                <th style="width:135px">Total Deductions</th>
                <th style="width:150px">Total Contributions</th>
                <th>Net Salary</th>
                <th>Advance Due</th>
                <th style="width:135px">Loan Due Amount</th>
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
     <td class="left"   style="width:250px">${list.employee_name}</td>
     <td class="center" >${list.sub_department_name}</td>
     <td class="center" >${list.nationality}</td>
     <td class="right" >${list.total_earnings} </td>
     <td class="right"   style="width:135px">${list.total_deductions} </td>
     <td class="right"  style="width:150px">${list.total_contributions} </td>
     <td class="right" >${list.net_salary} </td>
     <td class="right" >${list.advance_due} </td>
     <td class="right"  style="width:135px">${list.loan_due_amount} </td>

  
</tr>
    `
    )
    .join("")}
  
    
    </tbody></table></div>
    <div class="row reportFooterDetails">
    <div class="col"></div>
    <div class="col-2">
    <label> Total Earnings</label>

      <h6>${getAmountFormart(total_earnings)} </h6>
      </div>

   <div class="col-2">
    <label> Total Dedections</label>

      <h6>${getAmountFormart(total_deductions)} </h6>
      </div>
      <div class="col-2">
    <label> Total Contribution</label>

      <h6>${getAmountFormart(total_contributions)} </h6>
      </div>
    <div class="col-2">
    <label> Total Salary</label>

      <h6>${getAmountFormart(net_salary)} </h6>
      </div>
      
    </div>
</section>
  `;
}
