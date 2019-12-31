import { algaehApiCall } from "../../utils/algaehApiCall";
export function LoadVouchersToAuthorize() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/getVouchersToAuthorize",
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
    } catch (error) {
      reject(error);
    }
  });
}

export function LoadVoucherDetails(input) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/getVouchersDetailsToAuthorize",
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
