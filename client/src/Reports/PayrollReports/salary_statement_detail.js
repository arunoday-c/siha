import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import "../report-style.css";
import _ from "lodash";
import moment from "moment";
import {
  getAmountFormart,
  getAmountWithOutCurrencyFormart
} from "../../utils/GlobalFunctions";

export function printReport(result) {
  debugger;

  if (result === undefined) return null;
  const header_data = result.components;
  const detail_data = result.employees;
  if (detail_data === undefined) return null;

  let earning_component = _.filter(header_data, f => {
    return f.component_category === "E";
  });
  let deduction_component = _.filter(header_data, f => {
    return f.component_category === "D";
  });

  return `
  <div class="print-body">
  <header> ${payrollHeader(
    detail_data,
    "Salary Statement Detail Report"
  )} </header> 
   
<section>
    <h2><span>Salary Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Date of Join</th>
                <th>Days Present</th>
                <th>OT Hours</th>
                ${
                  earning_component.length > 0
                    ? earning_component
                        .map(
                          list =>
                            `<th>${list.earning_deduction_description}</th>`
                        )
                        .join("")
                    : ""
                }
                <th>Total Earnings</th>
                ${
                  deduction_component.length > 0
                    ? deduction_component
                        .map(
                          list =>
                            `<th>${list.earning_deduction_description}</th>`
                        )
                        .join("")
                    : ""
                }
                <th>Total Deduction</th>
                <th>Net Salary</th>
                <th>Day of Payment</th>
                <th>Mode of Payment</th>
                
            </tr>
        </thead></table></div><div class="tbl-content" style="max-height:26vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${detail_data
    .map(
      list =>
        `
    <tr>
    <td>${list.employee_code}</td>
    <td>${list.full_name}</td>
    <td>${list.designation}</td>
    <td>${moment(list.date_of_joining).format("DD-MM-YYYY")}</td>
    <td>${list.present_days} </td>
    <td>${list.complete_ot} </td>
    ${
      earning_component.length > 0
        ? list.employee_earning.length > 0
          ? list.employee_earning
              .map(
                earn =>
                  `<td>${getAmountWithOutCurrencyFormart(earn.amount)}</td>`
              )
              .join("")
          : ""
        : ""
    }
    <td>${getAmountWithOutCurrencyFormart(list.total_earnings)} </td>
    ${
      deduction_component.length > 0
        ? list.employee_deduction.length > 0
          ? list.employee_deduction
              .map(
                deduct =>
                  `<td>${getAmountWithOutCurrencyFormart(deduct.amount)}</td>`
              )
              .join("")
          : ""
        : ""
    }
    <td>${getAmountWithOutCurrencyFormart(list.total_deductions)}</td>
    <td>${getAmountWithOutCurrencyFormart(list.net_salary)} </td>
    <td>${moment(list.salary_date).format("DD-MM-YYYY")} </td>
    <td>${
      list.mode_of_payment === "CS"
        ? "Cash"
        : list.mode_of_payment === "CH"
        ? "Cheque"
        : list.mode_of_payment === "TRF"
        ? "Transfer"
        : list.mode_of_payment === "WPS"
        ? "Wages and Proctection System"
        : ""
    } </td>

  
</tr>
    `
    )
    .join("")}
  
    
    </tbody></table></div>
    <div class="row">
    <div class="col"></div>
      <div class="col-2">
        <label>Total Basic</label>
        <h6>${getAmountFormart(result.total_basic)}</h6>
      </div>
      <div class="col-2">
        <label>Total Earnings</label>
        <h6>${getAmountFormart(result.total_earnings)}</h6>
      </div>
      <div class="col-2">
        <label>Total Deductions</label>

        <h6>${getAmountFormart(result.total_deductions)}</h6>
      </div>
      <div class="col-2">
        <label>Total Net Salary</label>
        <h6>${getAmountFormart(result.total_net_salary)}</h6>
      </div>
        
    </div>
  </div>
</section>
  `;
}
