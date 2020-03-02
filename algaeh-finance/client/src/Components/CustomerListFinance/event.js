import { algaehApiCall } from "../../utils/algaehApiCall";

export function LoadCustomerReceivables() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_customer/getCustomerReceivables",
        method: "GET",
        module: "finance",
        onSuccess: response => {
          debugger;
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
