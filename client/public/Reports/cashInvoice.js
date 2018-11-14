export function printReport(data) {
  return `<div class="cashReciptStyles">
<div class="col-lg-12 popRightDiv">
  <div class="row">
    <div class="col-lg-4">
      <div class="hospitalLogo">Hospital Logo</div>
    </div>
    <div class="col-lg-4"><h3 class="receipt-header">Cash Invoice</h3></div>
    <div class="col-lg-4">
      <p class="hospitalAddress">
        # 301A, Curzon Square, Lady Curzon Road Opposite State Bank of India
        Bangalore Karnataka 560001 IN, Lady Curzon Rd, Shivaji Nagar,
        Bengaluru, Karnataka 560001
      </p>
    </div>
  </div>
  <hr />
  <div class="row receipt-header-mid">
    <div class="table-responsive table-report">
      <table class="table table-sm">
        <tbody>
          <tr>
            <td>Patient Name:</td>
            <td>${data.full_name}</td>
            <td class="col"></td>
            <td>Type:</td>
            <td >${data.payment_type}</td>
          </tr>
          <tr>
            <td>Patient MRN:</td>
            <td>${data.patient_code}</td>
            <td></td>
            <td>Invoice No.</td>
            <td >${data.invoice_number}</td>
          </tr>
          <tr>
            <td>Doctor Name:</td>
            <td >${data.doctor_name}</td>
            <td></td>
            <td>Recepit Date:</td>
            <td >${data.receipt_date}</td>
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
              <th style="width : 1px">Service Type</th>
              <th>Service Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Net Amount</th>
           <th>Vat Amount</th>
           <th>Patient Share</th>
            </tr>
          </thead>

          <tbody data-list="" list-template="patientTable">
           ${data.services
             .map(
               item => `
             <tr>
               <td>${item.service_type}</td>
               <td>${item.service_name} </td>
               <td>${item.quantity} </td>
               <td>${item.gross_amount} </td>
               <td>${item.discount_amout} </td>
               <td>${item.net_amout} </td>
               <td>${item.patient_tax} </td>
               <td>${item.patient_resp} </td>
             
             </tr>
           `
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
            <td>Remarks:</td>
            <td >${data.remarks}</td>
            <td>Previous Due:</td>
            <td>0</td>
          </tr>
          <tr>
            <td class="col"></td>
            <td>Total:</td>
            <td >${data.total_amount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>`;
}
