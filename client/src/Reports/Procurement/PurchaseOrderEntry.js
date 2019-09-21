// getCookie("userName")

import { getCookie } from "../../utils/algaehApiCall";
import { ReportHeader } from "../ReportHeader";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import "../report-style.scss";

export function printReport(data) {
  return `<div class="cashReciptStyles">
  <div class="print-body">
  <header> ${ReportHeader(data, "Purchase Order")} </header> 
  <section>
  <div class="row receipt-header-mid">
    <div class="table-responsive table-report">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>Purchase No.:</td>
            <td>${data.purchase_number}</td>
            <td class="col"></td>
            <td>Purchase Date:</td>
            <td >${data.po_date}</td>
            
          </tr>
          <tr>
            <td>Purchase For:</td>
            <td >${data.po_from}</td>
            <td class="col"></td>
            <td>Vendor Name:</td>
            <td >${data.vendor_name}</td>
            <td>TRN:</td>
            <td >${data.vendor_trn}</td>
            
          
          <tr>
          
            <td>From Requisition:</td>
            <td >${data.requisition_number}</td>
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
              <th>Quantity</th>              
              <th>Unit Price</th>      
              <th>Discount</th>      
              <th>Amount</th>      
              <th>Vat</th>      
            </tr>
          </thead>

          <tbody data-list="po_detail">
          ${data.po_detail
            .map(
              (item, index) => `
            <tr>
              <td class="co-4"> ${index + 1}</td>              
              <td class="co-4"> ${item.item_code}</td>
              <td class="co-4"> ${item.item_description}</td>    
              <td class="co-4"> ${item.uom_description}</td>          
              <td class="co-4"> ${item.order_quantity}</td>
              <td class="co-4"> ${item.unit_price}</td>
              <td class="co-4"> ${getAmountFormart(item.sub_discount_amount, {
                appendSymbol: false
              })}</td>
              <td class="co-4"> ${getAmountFormart(item.net_extended_cost, {
                appendSymbol: false
              })}</td>
              <td class="co-4"> ${getAmountFormart(item.tax_amount, {
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
  <div class="row reportFooterDetails">
    <div class="col"></div>
      <div class="col-2">
        <label> Total Amount</label>
  
          <h6>${getAmountFormart(data.net_payable)} </h6>
          </div>          
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
