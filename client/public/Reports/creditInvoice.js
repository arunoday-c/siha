export function printReport(data) {
  return `
  
  <div class="cashReciptStyles">
    <div class="col-lg-12 popRightDiv">
      <div class="row">
        <div class="col-lg-4">
          <div class="hospitalLogo">Hospital Logo</div>
        </div>
        <div class="col-lg-4"><h3 class="receipt-header">Tax Invoice</h3></div>
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
          
		<table id="creditInvoiceReport">
			<tr>
				<td><label>رقم التسجيل الضريبي   /  TRN</label></td>
        <td>: <span>301270966900003</span></td>
        <td colspan="3"></td>
				<td><label>النوع / Type</label></td>
				<td>: <span>ائتمان/ Credit</span></td>
			</tr>
			<!-- <tr>
				<td colspan="4" style="background:#f2f2f2;height:20px;"></td>
			</tr> -->
            <tr>
				<td><label>رقم الملف الطبي / Reg. Number</label></td>
        <td>: <span>301270966900003</span></td>
        <td colspan="2"></td>
				<td><label>رقم الفاتورة / Invoice No</label></td>
				<td>: <span data-parameter="invoice_number"></span></td>
			</tr>
            
            <tr>
				<td><label>اسم المريض / Patient Name</label></td>
        <td>: <span data-parameter="full_name"></span></td>
        <td colspan="2"></td>
				<td><label>اريخ الفاتورة / Invoice Date</label></td>
				<td>: <span>04-11-2018</span></td>
			</tr>
            
            <tr>
				<td><label>اسم الطبيب / Doctor</label></td>
        <td>: <span>Dr. Norman John</span></td>
        <td colspan="2"></td>
				<td><label>Department /  القسم</label></td>
				<td>: <span>General Practioner(G.P)</span></td>
			</tr>
            
            <tr>
				<td><label>شركة التأمين / InsuranceCompany</label></td>
        <td>: <span>BUPA </span></td>
        <td colspan="2"></td>
				<td colspan="2">BUPA ]شركة التأمين الفرعية : ABBOTT SAUDI ARABIA TRADING LLC[ ]رقم التسجيل الضريبي : </td>
			</tr>
            
        <tr>
				<td><label>رقم البطاقة / رقم السياسة  / Card No/ Policy No</label></td>
        <td>: <span>123454323 / 427354001</span></td>
        <td colspan="1"></td>
				<td><label>حامل السياسة / PolicyHolder</label></td>
				<td>: <span>ABBOTT SAUDIARABIA TRADING LLC</span></td>
			</tr>
            
            <tr>
				<td><label>Class / Class</label></td>
				<td colspan="3">: <span>Gold Class</span></td>
			</tr>
		</table>
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
                  <td>${data.payment_type}</td>
                </tr>
                <tr>
                  <td>Patient MRN:</td>
                  <td>${data.patient_code}</td>
                  <td></td>
                  <td>Invoice No.</td>
                  <td>${data.invoice_number}</td>
                </tr>
                <tr>
                  <td>Doctor Name:</td>
                  <td>${data.doctor_name}</td>
                  <td></td>
                  <td>Recepit Date:</td>
                  <td>${data.receipt_date}</td>
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
                    <th style="width : 1px">Quantity</th>
                    <th>Gross Amount</th>
                    <th>Discount</th>
                    <th>Net Amount</th>
                    <th>Patient Responsibility</th>
                    <th> Patient Tax</th>
                    <th>Patient Share</th>
                    <th>Company Responsibility</th>
                    <th> Company Tax</th>
                    <th>Company Share</th>
                  </tr>
                </thead>
  
                <tbody>
                <tr>
                <td >${data.service_type} </td>
                <td > ${data.service_name}</td>
                <td >${data.quantity} </td>
                <td >${data.gross_amount} </td>
                <td > ${data.discount_amount} </td>
                <td >${data.net_amount} </td>
                <td > ${data.patient_resp}</td>
                <td > ${data.patient_tax}</td>
                <td > ${data.patient_payabl}</td>
                <td > ${data.company_resp}</td>
                <td > ${data.company_tax}</td>
                <td > ${data.company_payable}</td>
              </tr>
                
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
                  <td> ${data.remarks}</td>
                  <td class="col"></td>
                  <td>Total:</td>
                  <td>${data.total_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</div>`;
}
