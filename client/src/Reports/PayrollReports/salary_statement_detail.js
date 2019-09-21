// import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import "../report-style.scss";
import _ from "lodash";
// import moment from "moment";
import {
  getAmountFormart,
  AlgaehOpenContainer
} from "../../utils/GlobalFunctions";

export function printReport(result) {
  if (result === undefined) return null;
  const header_data = result.components || [];
  const detail_data = result.employees || [];
  let earn_array_amount = [];
  let deduct_array_amount = [];
  let contri_array_amount = [];
  if (detail_data === undefined) return null;

  let HospitalDetails = JSON.parse(
    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  );

  let earning_component = _.filter(header_data, f => {
    return f.component_category === "E";
  });
  let deduction_component = _.filter(header_data, f => {
    return f.component_category === "D";
  });

  let contributions_component = _.filter(header_data, f => {
    return f.component_category === "C";
  });

  let data_amount = [];
  let employee_employeer = 0;

  const assignEarningData = (employee_earning, earnings) => {
    data_amount = _.filter(employee_earning, f => {
      return f.earnings_id === earnings.hims_d_earning_deduction_id;
    });
    if (data_amount.length === 0) {
      data_amount.push({ amount: 0 });
    } else {
      earn_array_amount.push({
        earnings_id: data_amount[0].earnings_id,
        amount: data_amount[0].amount
      });
    }

    return data_amount;
  };

  const assignDeductData = (employee_deduction, deduct) => {
    //
    data_amount = _.filter(employee_deduction, f => {
      return f.deductions_id === deduct.hims_d_earning_deduction_id;
    });
    if (data_amount.length === 0) {
      data_amount.push({ amount: 0 });
    }

    if (data_amount.length === 0) {
      data_amount.push({ amount: 0 });
    } else {
      deduct_array_amount.push({
        deductions_id: data_amount[0].deductions_id,
        amount: data_amount[0].amount
      });
    }

    return data_amount;
  };

  const assignContriData = (employee_contributions, contrib) => {
    data_amount = _.filter(employee_contributions, f => {
      return f.contributions_id === contrib.hims_d_earning_deduction_id;
    });
    if (data_amount.length === 0) {
      data_amount.push({ amount: 0 });
    } else {
      contri_array_amount.push({
        contributions_id: data_amount[0].contributions_id,
        amount: data_amount[0].amount
      });
    }

    return data_amount;
  };

  const assignEmployEmployer = employee_data => {
    let final_amount = 0;

    let deduction_amount = _.filter(employee_data.employee_deduction, f => {
      return f.nationality_id === HospitalDetails.default_nationality;
    });
    let contribution_amount = _.filter(
      employee_data.employee_contributions,
      f => {
        return f.nationality_id === HospitalDetails.default_nationality;
      }
    );

    if (deduction_amount.length > 0) {
      final_amount =
        parseFloat(final_amount) + parseFloat(deduction_amount[0].amount);
    }
    if (contribution_amount.length > 0) {
      final_amount =
        parseFloat(final_amount) + parseFloat(contribution_amount[0].amount);
    }

    employee_employeer = employee_employeer + final_amount;
    return [final_amount];
  };

  const earningSumup = earnings => {
    let earn_amount = 0;
    let earn_comp = _.filter(earn_array_amount, f => {
      return f.earnings_id === earnings.hims_d_earning_deduction_id;
    });

    if (earn_comp.length > 0) {
      earn_amount = _.sumBy(earn_comp, s => parseFloat(s.amount));
    } else {
      earn_amount = 0;
    }

    return [earn_amount];
  };

  const decuctSumup = deduct => {
    let decuct_amount = 0;
    let decuct_comp = _.filter(deduct_array_amount, f => {
      return f.deductions_id === deduct.hims_d_earning_deduction_id;
    });

    if (decuct_comp.length > 0) {
      decuct_amount = _.sumBy(decuct_comp, s => parseFloat(s.amount));
    } else {
      decuct_amount = 0;
    }

    return [decuct_amount];
  };

  const contributeSumup = contrib => {
    let contribute_amount = 0;
    let contribute_comp = _.filter(contri_array_amount, f => {
      return f.contributions_id === contrib.hims_d_earning_deduction_id;
    });

    if (contribute_comp.length > 0) {
      contribute_amount = _.sumBy(contribute_comp, s => parseFloat(s.amount));
    } else {
      contribute_amount = 0;
    }

    return [contribute_amount];
  };

  // <td class="center">${moment(list.date_of_joining).format(
  //   "DD-MM-YYYY"
  // )}</td>
  // <td class="right">${list.present_days} </td>
  // <td class="right">${list.complete_ot} </td>

  // <td class="center">${moment(list.salary_date).format("DD-MM-YYYY")} </td>
  //     <td class="center" style="width:150px">${
  //       list.mode_of_payment === "CS"
  //         ? "Cash"
  //         : list.mode_of_payment === "CH"
  //         ? "Cheque"
  //         : list.mode_of_payment === "TRF"
  //         ? "Transfer"
  //         : list.mode_of_payment === "WPS"
  //         ? "Wages and Proctection System"
  //         : ""
  //     } </td>

  //     <td class="right" style="width:150px">${list.leave_days} </td>
  //     <td class="right" style="width:150px">${getAmountFormart(
  //       list.leave_salary,
  //       {
  //         appendSymbol: false
  //       }
  //     )} </td>

  // <th>Date of Join</th>
  //               <th>Days Present</th>
  // <th>OT Hours</th>

  // <th>Day of Payment</th>
  //               <th style="width:150px">Mode of Payment</th>
  //               <th style="width:150px">Leave Days</th>

  return `
  <div class="print-body">
  <header> ${payrollHeader(
    detail_data,
    "Salary Statement Detail Report"
  )} </header> 
   
<section>
<div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th style="width:50px">Sl. No.</th>
                <th>Employee Code</th>
                <th style="width:250px">Employee Name</th>
                <th style="width:200px">Nationality</th>
                <th style="width:200px">Department</th>
                <th style="width:200px">Designation</th>
                <th style="width:150px">Branch</th>                                
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
                <th style="width:135px">Total Earning</th>
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
                <th style="width:135px">Total Deduction</th>
                <th>Net Salary</th>
                ${
                  contributions_component.length > 0
                    ? contributions_component
                        .map(
                          list =>
                            `<th>${list.earning_deduction_description}</th>`
                        )
                        .join("")
                    : ""
                }
                
                <th style="width:200px">Total Pasi Contribution</th>
                
                <th style="width:150px">Leave Provision</th>
                <th style="width:150px">Airfare Amount</th>
                <th style="width:150px">Gratuity Provision</th>
                
                
            </tr>
        </thead></table></div><div class="tbl-content" style="max-height:26vh" algaeh-report-table="true" >
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${detail_data
    .map(
      (list, index) =>
        `
    <tr>
      <td class="center"  style="width:50px">${index + 1}</td>
      <td class="center">${list.employee_code}</td>
      <td class="left" style="width:250px">${list.full_name}</td>
      <td class="left" style="width:200px">${list.nationality}</td>    
      <td class="left" style="width:200px">${list.sub_department_name}</td>
      <td class="left" style="width:200px">${list.designation}</td>
      <td class="left" style="width:150px">${list.hospital_name}</td>     
      
    ${
      earning_component.length > 0
        ? earning_component
            .map(
              earnings =>
                `
          ${
            list.employee_earning.length > 0
              ? assignEarningData(list.employee_earning, earnings).map(
                  data =>
                    `  <td class="right">${getAmountFormart(data.amount, {
                      appendSymbol: false
                    })}</td>`
                )
              : `  <td class="right">${getAmountFormart("0", {
                  appendSymbol: false
                })}</td>`
          }
          `
            )
            .join("")
        : ""
    }
      <td class="right" style="width:135px">${getAmountFormart(
        list.total_earnings,
        {
          appendSymbol: false
        }
      )} </td>

      ${
        deduction_component.length > 0
          ? deduction_component
              .map(
                deduct =>
                  `
            ${
              list.employee_deduction.length > 0
                ? assignDeductData(list.employee_deduction, deduct).map(
                    data =>
                      `  <td class="right" >${getAmountFormart(data.amount, {
                        appendSymbol: false
                      })}</td>`
                  )
                : `  <td class="right">${getAmountFormart("0", {
                    appendSymbol: false
                  })}</td>`
            }
            `
              )
              .join("")
          : ""
      }    
      <td class="right" style="width:135px">${getAmountFormart(
        list.total_deductions,
        {
          appendSymbol: false
        }
      )}</td>

      <td class="right">${getAmountFormart(list.net_salary, {
        appendSymbol: false
      })} </td>
      
      ${
        contributions_component.length > 0
          ? contributions_component
              .map(
                contrib =>
                  `
            ${
              list.employee_contributions.length > 0
                ? assignContriData(list.employee_contributions, contrib).map(
                    data =>
                      `  <td class="right" >${getAmountFormart(data.amount, {
                        appendSymbol: false
                      })}</td>`
                  )
                : `  <td class="right">${getAmountFormart("0", {
                    appendSymbol: false
                  })}</td>`
            }
            `
              )
              .join("")
          : ""
      }    
      
  
      ${assignEmployEmployer(list).map(
        final_amount =>
          `  <td class="right" style="width:200px">${getAmountFormart(
            final_amount,
            {
              appendSymbol: false
            }
          )}</td>`
      )}

      <td class="right" style="width:150px">${getAmountFormart(
        list.leave_salary,
        {
          appendSymbol: false
        }
      )} </td>
      
      <td class="right" style="width:150px">${getAmountFormart(
        list.airfare_amount,
        {
          appendSymbol: false
        }
      )} </td>
      <td class="right" style="width:150px">${getAmountFormart(
        list.gratuity_amount,
        {
          appendSymbol: false
        }
      )} </td>
</tr>
    `
    )
    .join("")}
  
    
    </tbody></table></div>
    <div class="tbl-footer">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody >
            <tr>
                <td  style="width:50px">Total</td>
                <td></td>
                <td style="width:250px"></td>
                <td style="width:200px"></td>
                <td style="width:200px"></td>
                <td style="width:200px"></td>
                <td style="width:150px"></td>                                
                ${
                  earning_component.length > 0
                    ? earning_component
                        .map(
                          earnings =>
                            `
                      ${earningSumup(earnings).map(
                        data =>
                          `  <td class="highlightBorder">${getAmountFormart(
                            data
                          )}</td>`
                      )}
                      `
                        )
                        .join("")
                    : ""
                }
                
                <td style="width:135px" class="highlightBorder">${getAmountFormart(
                  result.total_earnings
                )}</td>
                
                ${
                  deduction_component.length > 0
                    ? deduction_component
                        .map(
                          deduct =>
                            `
                      ${decuctSumup(deduct).map(
                        data =>
                          `  <td class="highlightBorder">${getAmountFormart(
                            data
                          )}</td>`
                      )}
                      `
                        )
                        .join("")
                    : ""
                }
                
                <td style="width:135px" class="highlightBorder">${getAmountFormart(
                  result.total_deductions
                )}</td>
                <td class="highlightBorder">${getAmountFormart(
                  result.total_net_salary
                )}</td>
                ${
                  contributions_component.length > 0
                    ? contributions_component
                        .map(
                          contribute =>
                            `
                      ${contributeSumup(contribute).map(
                        data =>
                          `  <td class="highlightBorder">${getAmountFormart(
                            data
                          )}</td>`
                      )}
                      `
                        )
                        .join("")
                    : ""
                }
                
                <td style="width:200px" class="highlightBorder">${getAmountFormart(
                  employee_employeer
                )}</td>      
                <td style="width:150px" class="highlightBorder">${getAmountFormart(
                  result.sum_leave_salary
                )}</td>
                <td style="width:150px" class="highlightBorder">${getAmountFormart(
                  result.sum_airfare_amount
                )}</td>
                <td style="width:150px" class="highlightBorder">${getAmountFormart(
                  result.sum_gratuity
                )}</td>
                
                
            </tr>
        </tbody></table></div>

  </div>
</section>
  `;
}
