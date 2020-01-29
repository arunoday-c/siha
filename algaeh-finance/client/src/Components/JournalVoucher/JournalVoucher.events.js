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
        onSuccess: response => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) { }
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
        onSuccess: response => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) {
      reject(e);
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
        onSuccess: response => {
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function addJurnorLedger(input) {
  return new Promise((resolve, reject) => {
    try {
      debugger
      algaehApiCall({
        uri: "/voucher/addVoucher",
        data: input,
        method: "POST",
        module: "finance",
        onSuccess: response => {
          if (response.data.success === true) {
            resolve(response.data.result);
          } else {
            reject(response.data.message);
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
