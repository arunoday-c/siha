import { algaehApiCall } from "../../utils/algaehApiCall";

export function getBalanceSheet(input) {
  const { url, inputParam } = input;
  const { excel } = inputParam;
  let extraHeaders = {};
  if (excel === true) {
    extraHeaders = {
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" }
    };
  }
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: `/financeReports/${url}`,
        data: inputParam,
        method: "GET",
        module: "finance",
        ...extraHeaders,
        onSuccess: response => {
          if (excel === true) {
            resolve(response);
          } else {
            if (response.data.success === true) {
              resolve(response.data.result);
            }
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
export function downloadExcel(input) {
  const { selected } = input;
  let result = undefined;
  switch (selected) {
    case "BS":
      input["url"] = "getBalanceSheet";
      input["inputParam"] = { ...input["inputParam"], excel: true };
      result = getBalanceSheet(input);
      break;
  }
  return result;
}
