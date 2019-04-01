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
  <header> ${payrollHeader(data)} </header> 
   
<section>
    <h2><span>Salary Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Nationality</th>
                <th>Total Earnings</th>
                <th>Total Deductions</th>
                <th>Total Contributions</th>
                <th>Net Salary</th>
                <th>Advance Due</th>
                <th>Loan Due Amount</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="max-height:26vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.employee_code}</td>
    <td>${list.employee_name}</td>
    <td>${list.sub_department_name}</td>
    <td>${list.nationality}</td>
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
  
    
    </tbody></table></div>
    <div class="row">
    <div class="col-3">
    <label> Total Earnings</label>

      <h6>${getAmountFormart(total_earnings)} </h6>
      </div>

   <div class="col-3">
    <label> Total Dedections</label>

      <h6>${getAmountFormart(total_deductions)} </h6>
      </div>
      <div class="col-3">
    <label> Total Contribution</label>

      <h6>${getAmountFormart(total_contributions)} </h6>
      </div>
    <div class="col-3">
    <label> Total Salary</label>

      <h6>${getAmountFormart(net_salary)} </h6>
      </div>
      
    </div>
</section>
  `;
}
