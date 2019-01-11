import { revenueHeader } from "./revenueHeader";
import moment from "moment";

export function printReport(data) {
  return `
  <div class="print-body">
    <header> ${revenueHeader(data)} </header> 
    <section>
    <h2><span>Hospital Details</span></h2>
    <table class="tableForLabel" cell-padding="0">
        <tr>
            <td><label> Hospital Name</label></td>
            <td>: <span>Royal Bangalore Hospital - HRBR</span></td>
            <td><label>  Type</label></td>
            <td>: <span> Income</span></td>
        </tr>
        <tr>
            <td colspan="4" style="background:#f2f2f2;height:0px;"></td>
        </tr>


    </table>


</section>
<section>
    <h2><span>Report Details</span></h2>
    <table class="tableForData" cell-padding="0">
        <thead>
            <tr>
                <th>HANDOVER DATE</th>
                <th>EXPECTED TOTAL</th>
                <th>COLLECTED TOTAL</th>
                <th>DIFFERENCE</th>
                <th>STATUS</th>
            </tr>
        </thead>
        <tbody>
        
  ${data
    .map(
      list =>
        `
    <tr>
    <td>${moment(list.daily_handover_date).format("DD-MMM-YYYY")}</td>
    <td>${list.expected_total} </td>
    <td>${list.collected_total} </td>
    <td>${Math.abs(list.expected_total - list.collected_total)} </td>
    <td>${
      list.expected_total - list.collected_total < 0
        ? `        <span class="badge badge-warning">Excess</span>`
        : list.expected_total - list.collected_total > 0
        ? `<span class="badge badge-danger">Shortage</span>`
        : list.expected_total - list.collected_total === 0
        ? `<span class="badge badge-success>Tallied</span>`
        : "------"
    } </td>
    `
    )
    .join("")} 
        </tbody>
    </table>
</section>

  `;
}
