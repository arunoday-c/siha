import { incomeHeader } from "./incomeHeader";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import _ from "lodash";
import "../report-style.scss";
import moment from "moment";

export function printReport(result) {
  if (result === undefined) return null;
  const data = result;

  let allAmount = _.chain(data)
    .groupBy("pay_type")
    .map(function(items, key) {
      return {
        key:
          key === "CA"
            ? " Cash amount"
            : key === "CD"
            ? " Card amount"
            : key === "CH"
            ? " Cheque amount"
            : "",
        type: key,
        amount: _.sumBy(items, s => parseFloat(s.amount))
      };
    })
    .value();
  if (allAmount.length < 3) {
    const _temp = [
      { type: "CA", key: " Cash amount", amount: 0 },
      { type: "CD", key: " Card amount", amount: 0 },
      { type: "CH", key: " Cheque amount", amount: 0 }
    ];
    for (let i = 0; i < _temp.length; i++) {
      const _exists = _.find(allAmount, f => f.type === _temp[i].type);
      if (_exists === undefined) {
        allAmount.push(_temp[i]);
      }
    }
  }

  if (data === undefined) return null;
  return `
  <div class="print-body">
  <header> ${incomeHeader(data)} </header> 
   
<section>
    <h2><span>List of Receipt Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Receipt No.</th>
                <th>Receipt Date</th>
                <th>Patient Code</th>
                <th>Patient Name</th>
                <th>Department  Name</th>
                <th>Doctor Name</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Cheque</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 23vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
      <td>${list.receipt_number} </td>  
      <td>${moment(list.receipt_date).format("DD-MMM-YYYY")} </td>  
      <td>${list.patient_id === null ? "" : list.patient_code} </td>  
      <td>${
        list.patient_id === null
          ? list.patient_name === null
            ? ""
            : list.patient_name
          : list.full_name
      } </td>  
      <td>${
        list.sub_department_name === undefined ||
        list.sub_department_name === null
          ? ""
          : list.sub_department_name
      } </td>  
      <td>${
        list.patient_id === null
          ? list.referal_doctor === null
            ? list.referal_doctor
            : ""
          : list.doctor_name === undefined || list.doctor_name === null
          ? ""
          : list.doctor_name === null
          ? ""
          : list.doctor_name
      } </td>  
      
      <td  style="text-align:right">${
        list.pay_type === "CA" ? getAmountFormart(list.amount) : 0
      } </td>  
      <td  style="text-align:right">${
        list.pay_type === "CD" ? getAmountFormart(list.amount) : 0
      } </td>  
      <td  style="text-align:right">${
        list.pay_type === "CH" ? getAmountFormart(list.amount) : 0
      } </td>  
    </tr>
    `
    )
    .join("")}
  
 
    </tbody></table></div>
    <div class="row">
    <div class="col-8"></div>
    
 ${allAmount
   .map(
     amount =>
       `<div class="col" style="text-align:right"><label>${
         amount.key
       }</label><h6>${getAmountFormart(amount.amount)}</h6></div>`
   )
   .join("")}

   

   </div>
</section>
</div>
  `;
}
