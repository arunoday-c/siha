import { algaehApiCall } from "./algaehApiCall";
export function getAccountHeads(input = {}) {
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
