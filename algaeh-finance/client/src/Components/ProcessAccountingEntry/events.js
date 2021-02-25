import { algaehApiCall } from "../../utils/algaehApiCall";

export function ProcessAccountingEntrys(inputObj) {
  return new Promise((resolve, reject) => {
    try {
      debugger;
      algaehApiCall({
        uri: "/macro/processAccountingEntry",
        method: "GET",
        data: inputObj,
        module: "finance",
        onSuccess: (response) => {
          resolve();
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}
