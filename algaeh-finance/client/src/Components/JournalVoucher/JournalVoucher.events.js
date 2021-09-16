import _ from "lodash";
import { algaehApiCall } from "../../utils/algaehApiCall";
export function getVoucherNumber(input) {
  input = input || {};
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/getVoucherNo",
        method: "GET",
        module: "finance",
        data: input,
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {}
  });
}
export function getHeaders(input) {
  input = input || {};
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance/getAccountHeadsForDropdown",
        data: input,
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function customerReceivables() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getInvoiceDetail(input) {
  input = input || {};
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/getUnSettledInvoices",
        data: input,
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            console.log("response.data.result=====>", response.data.result);
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function addJurnorLedger(input) {
  const { merdgeRecords, ...rest } = input;
  if (input.finance_voucher_header_id > 0) {
    return addVoucher(rest, "/voucher/updateVoucher");
  } else {
    if (merdgeRecords.length > 0) {
      input["receipt_type"] = "M";
      const sumAmount = _.sumBy(input.details, (s) => parseFloat(s.amount));
      const totalAmount = _.sumBy(merdgeRecords, (s) =>
        parseFloat(s.balance_amount)
      );
      const pending_amount = sumAmount / 2;
      if (totalAmount !== pending_amount) {
        input["partial_amount"] = pending_amount;
      }

      return addVoucher(input, "/voucher/addVoucher");
    } else {
      return addVoucher(rest, "/voucher/addVoucher");
    }
  }
}
function addVoucher(input, url) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: url,
        data: input,
        method: "POST",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          } else {
            reject(response.data.message);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getCostCentersForVoucher(input) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_masters/getCostCentersForVoucher",
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getCustomerListReceivable() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
export function getCustomerReceivableDetails(options) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerInvoiceDetails",
        data: {
          child_id: options.child_id,
          is_opening_bal: options.is_opening_bal,
        },
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getSupplierPayable() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_supplier/getSupplierPayables",

        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getSupplierInvoiceDetails(options) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_supplier/getSupplierInvoiceDetails",
        data: {
          child_id: options.child_id,
        },
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getSupplierDebitNotes(options) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_supplier/getAllDebitNotes",
        data: {
          child_id: options.child_id,
        },
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            resolve(response.data);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
export function getCustomerDebitNotes(options) {
  return new Promise((resolve, reject) => {
    try {
      let url = "/finance_customer/getAllCreditNotes";
      let input = {
        child_id: options.child_id,
      };
      if (options.voucherType === "credit_note") {
        url = "/finance_customer/getCustomerInvoiceDetails";
        input["is_opening_bal"] = "Y";
      }
      algaehApiCall({
        uri: url, //"/finance_customer/getAllCreditNotes",
        data: input,
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          if (response.data.success === true) {
            if (options.voucherType === "credit_note") {
              resolve(response.data.result);
            } else resolve(response.data);
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
