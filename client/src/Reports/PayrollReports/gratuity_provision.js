// import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import "../report-style.scss";
import _ from "lodash";
import { getAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  let gratuity_amount = _.sumBy(data, s => parseFloat(s.gratuity_amount));

  return `
  <div class="print-body">
  <header> ${payrollHeader(data, "Gratuity Provision Statement")} </header> 
   
<section>
   <div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Employee Code</th>
                <th style="width:250px">Employee Name</th>
                <th>Department</th>
                <th>Gratuity Amount</th>
                
                
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
     
     <td class="right" >${getAmountFormart(list.gratuity_amount, {
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
    <label> Total Gratuity Amount</label>

      <h6>${getAmountFormart(gratuity_amount)} </h6>
      </div>
   
    </div>
</section>
  `;
}
