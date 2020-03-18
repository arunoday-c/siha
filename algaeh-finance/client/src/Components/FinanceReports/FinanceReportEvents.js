import { algaehApiCall } from "../../utils/algaehApiCall";
import moment from "moment";
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
  input["inputParam"] = { ...input["inputParam"], excel: true };
  switch (selected) {
    case "BS":
      input["url"] = "getBalanceSheet";
      result = getBalanceSheet(input);
      break;
    case "TB":
      input["url"] = "getTrialBalance";
      result = getBalanceSheet(input);
      break;
    case "AP":
      input["url"] = "getAccountPayableAging";
      result = getBalanceSheet(input);
      break;
    case "AR":
      input["url"] = "getAccountReceivableAging";
      result = getBalanceSheet(input);
      break;
    case "total":
      input["url"] = "getProfitAndLoss";
      result = getBalanceSheet(input);
      break;
    case "by_center":
      input["url"] = "getProfitAndLossCostCenterWise";
      result = getBalanceSheet(input);
      break;
    case "by_year":
      input["url"] = "getProfitAndLossMonthWise";
      result = getBalanceSheet(input);
      break;
  }
  return result;
}

export function handleFile(data, selected) {
  let blob = new Blob([data], {
    type: "application/octet-stream"
  });
  const fileName = `${selected}-${moment().format("DD-MM-YYYY-HH-MM-ss")}.xlsx`;
  var objectUrl = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.setAttribute("href", objectUrl);
  link.setAttribute("download", fileName);
  link.click();
}
