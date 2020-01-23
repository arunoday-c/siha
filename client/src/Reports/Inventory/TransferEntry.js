// getCookie("userName")

import { getCookie } from "../../utils/algaehApiCall";
import { ReportHeader } from "../ReportHeader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";

export function printReport(data) {
  const calculteTotal = details => {
    let final_amount = 0;

    final_amount =
      parseFloat(details.unit_cost) * parseFloat(details.quantity_transferred);
    return [final_amount];
  };

  const assinReqData = details => {
    let final_data = "";

    let display =
      data.inventoryitemuom === undefined
        ? []
        : data.inventoryitemuom.filter(
            f => f.hims_d_inventory_uom_id === details.uom_requested_id
          );
    final_data = details.quantity_requested + " " + display[0].uom_description;
    return [final_data];
  };

  const assinIssData = details => {
    let final_data = "";

    let display =
      data.inventoryitemuom === undefined
        ? []
        : data.inventoryitemuom.filter(
            f => f.hims_d_inventory_uom_id === details.uom_transferred_id
          );

    final_data =
      details.quantity_transferred + " " + display[0].uom_description;
    return [final_data];
  };

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
            <td>Transfer No.:</td>
            <td>${data.transfer_number}</td>
            <td class="col"></td>
            <td>Transfer Date:</td>
            <td >${data.transfer_date}</td>
            
          </tr>
          <tr>
            <td>From Requisition:</td>
            <td >${data.requisition_number}</td>
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
              
              <th style="width:200px">Quantity Requested</th>                            
              <th style="width:200px">Quantity Issued</th>  
              <th>Unit Price</th>  
              <th style="width:200px">Amount</th>  
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
              
              ${assinReqData(item).map(
                final_data =>
                  `  <td class="right" style="width:200px">${final_data}</td>`
              )}
              ${assinIssData(item).map(
                final_data =>
                  `  <td class="right" style="width:200px">${final_data}</td>`
              )}
              <td class="co-4"> ${item.unit_cost}</td>
              ${calculteTotal(item).map(
                final_amount =>
                  `  <td class="right" style="width:200px">${GetAmountFormart(
                    final_amount,
                    {
                      appendSymbol: false
                    }
                  )}</td>`
              )}              
              
              
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
