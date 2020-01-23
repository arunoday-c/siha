import { PatReportHeader } from "./PatReportHeader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import _ from "lodash";
import "../report-style.scss";
import moment from "moment";

export function printReport(result) {
  if (result === undefined) return null;
  const data = result;
  if (data === undefined) return null;
  let total_outstanding = _.sumBy(data, s => parseFloat(s.advance_amount));

  return `
  <div class="print-body">
  <header> ${PatReportHeader(data, "Patient Outstanding")} </header> 
   
<section>
    <h2><span>Attendence Details</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
                <th>Patient Code</th>
                <th>Patient Name</th>
                <th>Advance Date</th>
                <th>Advance Amount</th>                       
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${list.patient_code}</td>
    <td>${list.full_name}</td>    
    <td>${moment(list.created_date).format("DD-MM-YYYY")} </td>
    <td>${GetAmountFormart(list.advance_amount)} </td>   
   
</tr>
    `
    )
    .join("")}
  
 
    </thead></table></div> 
    
    <div class="row">
    <div class="col"></div>
      <div class="col-2">
        <label>Total Outstanding</label>
        <h6>${
          total_outstanding
            ? GetAmountFormart(total_outstanding)
            : GetAmountFormart("0")
        } </h6>
      </div>      
    </div>
  </div>

</section>
  `;
}
