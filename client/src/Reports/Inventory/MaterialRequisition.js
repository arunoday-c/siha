// getCookie("userName")

import { getCookie } from "../../utils/algaehApiCall";
import { ReportHeader } from "../ReportHeader";

export function printReport(data) {
  debugger;

  return `<div class="cashReciptStyles">
  <div class="print-body">
  <header> ${ReportHeader(data, "Material Requisition")} </header> 
  <hr />
  <section>
  <div class="row receipt-header-mid">
    <div class="table-responsive table-report">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>Requisition No.:</td>
            <td>${data.requisition_number}</td>
            <td class="col"></td>
            <td>Requisition Date:</td>
            <td >${data.requistion_date}</td>
            
          </tr>
          <tr>
            <td>Requisition Type:</td>
            <td >${data.requistion_type}</td>
            <td class="col"></td>
            <td>Branch:</td>
            <td >${getCookie("HospitalName")}</td>
            
          
          <tr>
            <td>From Location:</td>
            <td >${data.from_location}</td>
            <td></td>
            <td>To Location:</td>
            <td >${data.to_location}</td>           
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Sl No.</th>              
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Unit</th>
              <th>Quantity Requested</th>              
            </tr>
          </thead>

          <tbody
            data-list="inventory_stock_detail"
            list-template="patientTable"
          >
          ${data.inventory_stock_detail
            .map(
              (item, index) => `
            <tr>
              <td class="co-4"> ${index + 1}</td>              
              <td class="co-4"> ${item.item_code}</td>
              <td class="co-4"> ${item.item_description}</td>
              <td class="co-4"> ${item.uom_description}</td>
              <td class="co-4"> ${item.quantity_required}</td>
              
            </tr>`
            )
            .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="row receipt-header-mid">
    <div class="table-responsive table-report">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>Printed By:</td>
            <td>${getCookie("userName")}</td>
            <td class="col"></td>
            <td>Person In-Charge Sign/ Seal:</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
</section>`;
}
