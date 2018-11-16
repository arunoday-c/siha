export function printReport(data) {
  return `<div class="cashReciptStyles">
<div class="col-lg-12 popRightDiv">
  <div class="row">
    <div class="col-lg-4"><div class="hospitalLogo">Hospital Logo</div></div>
    <div class="col-lg-4"><h3 class="receipt-header">Cash Receipt</h3></div>
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
            <td>Cash Recepit:</td>
            <td >${data.receipt_number}</td>
          </tr>
          <tr>
            <td>Patient MRN:</td>
            <td >${data.patient_code}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Doctor Name:</td>
            <td >${data.doctor_name}</td>
            <td></td>
            <td>Recepit Date:</td>
            <td >${data.bill_date}</td>
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
              <th>Service</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Deduction</th>
              <th>Tax</th>
              <th>Net Price</th>
            </tr>
          </thead>

          <tbody
            data-list="bill_details"
            list-template="patientTable"
          >
          ${data.bill_details
            .map(
              item => `
            <tr>
              <td class="co-4"> ${item.service_name}</td>
              <td class="co-4"> ${item.quantity}</td>
              <td class="co-4"> ${item.unit_cost}</td>
              <td class="co-4"> ${item.discount_amout}</td>
              <td class="co-4"> ${item.deductable_amount}</td>
              <td class="co-4"> ${item.patient_tax}</td>
              <td class="co-4"> ${item.patient_payable}</td>
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
            <td>Person In-Charge:</td>
            <td>Aboobacker Sihdiqe</td>
            <td class="col"></td>
            <td>Person In-Charge Sign/ Seal:</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>`;
}
