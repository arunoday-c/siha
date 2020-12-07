import newAlgaehApi from "../../../hooks/newAlgaehApi";

export async function loadData(input) {
  try {
    const result = await newAlgaehApi({
      module: "finance",
      method: "GET",
      data: { ...input },
      uri: "/financeReports/generationLedger",
    });
    return result.data;
  } catch (e) {
    throw e;
  }
}
const filterData = [
  { type: "journal", report: "JVReport_journal" },
  { type: "contra", report: "JVReport_contra" },
  { type: "receipt", report: "JVReport_receipt" },
  { type: "purchase", report: "JVReport_purchase" },
  { type: "payment", report: "JVReport_payment" },
  { type: "credit_note", report: "JVReport_creditNote" },
  { type: "sales", report: "JVReport_sales" },
  { type: "debit_note", report: "JVReport_debitNote" },
];
const reportTypes = {
  sales: {
    reportName: "SalesInvoiceEntry",
    reportParams: [{ name: "invoice_number", value: "voucher_no" }],
  },
  common: {
    reportParams: [
      {
        name: "voucher_header_id",
        value: "finance_voucher_header_id",
      },
      {
        name: "voucher_type",
        value: "voucher_type",
      },
      {
        name: "voucher_no",
        value: "voucher_no",
      },
    ],
  },
};

export async function generateReport(input) {
  try {
    const { voucher_type, voucher_no } = input;
    let _voucherType = "JVReport_expense";
    let _reportParameter = [];
    const hasReportType = reportTypes[voucher_type];
    if (hasReportType) {
      _voucherType = hasReportType["reportName"];
      _reportParameter = hasReportType["reportParams"].map((item) => {
        return {
          name: item.name,
          value: input[item.value],
        };
      });
    } else {
      _reportParameter = reportTypes["common"].reportParams.map((item) => {
        return {
          name: item.name,
          value: input[item.value],
        };
      });
      const _type = filterData.find((f) => f.type === voucher_type);
      if (_type) {
        _voucherType = _type.report;
      }
    }

    const result = await newAlgaehApi({
      uri: "/report",
      method: "GET",
      module: "reports",
      extraHeaders: {
        Accept: "blob",
      },
      options: { responseType: "blob" },
      data: {
        report: {
          reportName: _voucherType,
          reportParams: _reportParameter,
          outputFileType: "PDF",
        },
      },
    });
    const urlBlob = window.URL.createObjectURL(result.data);
    const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Voucher Report - ${voucher_type} (${voucher_no}) `;
    window.open(origin);
  } catch (e) {
    throw e;
  }
}
