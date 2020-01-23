// getCookie("userName")

import { getCookie } from "../../utils/algaehApiCall";
import { ReportHeader } from "../ReportHeader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  return `<div class="cashReciptStyles">
  <div class="print-body">
  <header> ${ReportHeader(data, "Delivery Note")} </header> 
  <section>
  <div class="row receipt-header-mid">
    <div class="table-responsive table-report">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>Purchase No.:</td>
            <td>${data.delivery_note_number}</td>
            <td class="col"></td>
            <td>Purchase Date:</td>
            <td >${data.dn_date}</td>
            
          </tr>
          <tr>
            <td>Purchase For:</td>
            <td >${data.dn_from}</td>
            <td class="col"></td>
            <td>Vendor Name:</td>
            <td >${data.vendor_name}</td>
            <td>TRN:</td>
            <td >${data.vendor_trn}</td>
          
          <tr>
          
            <td>From PO:</td>
            <td >${data.purchase_number}</td>
            <td></td>
            <td>From Location:</td>
            <td >${data.from_location}</td>
            <td></td>
                     
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
              <th>PO Quantity</th>
              <th>Unit Price</th>
              <th>Delivery Note Quantity</th>
              <th>Quantity Outstanding</th>
              <th>Quantity Recived Todate</th>              
              <th>Discount</th>
              <th>Amount</th>
              <th>Vat</th>
              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody data-list="dn_detail">
          ${data.dn_detail
            .map(
              (item, index) => `
            <tr>
              <td class="co-4"> ${index + 1}</td>              
              <td class="co-4"> ${item.item_code}</td>
              <td class="co-4"> ${item.item_description}</td>    
              <td class="co-4"> ${
                item.uom_description
              }</td>                       
              <td class="co-4"> ${item.po_quantity}</td>
              <td class="co-4"> ${item.unit_cost}</td>
              <td class="co-4"> ${item.dn_quantity}</td>
              <td class="co-4"> ${item.quantity_outstanding}</td>
              <td class="co-4"> ${item.quantity_recieved_todate}</td>

              
              
              
              <td class="co-4"> ${GetAmountFormart(item.discount_amount, {
                appendSymbol: false
              })}</td>
              <td class="co-4"> ${GetAmountFormart(item.net_extended_cost, {
                appendSymbol: false
              })}</td>
              <td class="co-4"> ${GetAmountFormart(item.tax_amount, {
                appendSymbol: false
              })}</td>
              <td class="co-4"> ${GetAmountFormart(item.total_amount, {
                appendSymbol: false
              })}</td>

            </tr>`
            )
            .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class=" receipt-header-mid">
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
