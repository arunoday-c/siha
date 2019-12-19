import { algaehApiCall } from "../../utils/algaehApiCall";

export function getBalanceSheet(input) {
  const { url, inputParam } = input;
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: `/financeReports/${url}`,
        data: inputParam,
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
