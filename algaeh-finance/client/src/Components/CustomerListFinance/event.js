import { algaehApiCall } from "../../utils/algaehApiCall";
export function LoadVouchersToAuthorize(input) {
  input = input || {};
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
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
    } catch (error) {
      reject(error);
    }
  });
}

export function LoadCustomerReceivables() {
  return new Promise((resolve, reject) => {
    try {
      debugger
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
        method: "GET",
        module: "finance",
        onSuccess: response => {
          debugger
          if (response.data.success === true) {
            resolve(response.data.result);
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
export function ApproveReject(input) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/authorizeVoucher",
        method: "POST",
        data: input,
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
    } catch (error) {
      reject(error);
    }
  });
}
