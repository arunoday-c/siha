import { algaehApiCall } from "../../utils/algaehApiCall";

export function getHeaders(input) {
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

export function updateFinanceAccountsMaping(input) {
  console.log("input", input);
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance/updateFinanceAccountsMaping",
        data: input,
        method: "POST",
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
export function getFinanceAccountsMaping() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance/getFinanceAccountsMaping",
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
