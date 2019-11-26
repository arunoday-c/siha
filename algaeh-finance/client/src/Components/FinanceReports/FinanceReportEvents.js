import { algaehApiCall } from "../../utils/algaehApiCall";

export function getBalanceSheet(input) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance/getStandardfinanceReport",
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
