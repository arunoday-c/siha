import { incomeHeader } from "./incomeHeader";
import moment from "moment";
import "../report-style.scss";

export function printReport(data) {
  return `
  <div class="print-body">
    <header> ${incomeHeader(data)} </header> 
    <section>
      <h2><span>Hospital Details</span></h2>
      <table class="tableForLabel" cell-padding="0">
          <tr>
              <td><label> Hospital Name</label></td>
              <td><span>Royal Bangalore Hospital - HRBR</span></td>
              <td><label>  Type</label></td>
              <td><span> Income</span></td>
          </tr>
      </table>
    </section>
<section>
    <h2><span>Collection Report</span></h2><div class="tbl-header">
    <table class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <thead >
            <tr>
            <th>SL NO.</th>
            <th>HANDOVER DATE</th>
            <th>EXPECTED TOTAL</th>
            <th>COLLECTED TOTAL</th>
            <th>DIFFERENCE</th>
            <th>STATUS</th>
            </tr>
        </thead></table></div><div class="tbl-content" style="height: 30vh">
        <table  class="reportFixedTable" cellpadding="0" cellspacing="0" border="0"> 
        <tbody>
   
        
  ${data
    .map(
      (list, index) =>
        `
        
    <tr>
      <td  style="text-align:right">${index + 1} </td>
      <td style="text-align:center">${moment(list.daily_handover_date).format(
        "DD-MMM-YYYY"
      )}</td>
      
      <td  style="text-align:right">${list.expected_total} </td>
      <td  style="text-align:right">${list.collected_total} </td>
      <td  style="text-align:right">${Math.abs(
        list.expected_total - list.collected_total
      )} </td>
      <td style="text-align:center">${
        list.expected_total - list.collected_total < 0
          ? `        <span class="badge badge-warning">Excess</span>`
          : list.expected_total - list.collected_total > 0
          ? `<span class="badge badge-danger">Shortage</span>`
          : list.expected_total - list.collected_total === 0
          ? `<span class="badge badge-success">Tallied</span>`
          : "------"
      } </td>
    `
    )
    .join("")} 
    </thead></table></div>
</section></div>

  `;
}
