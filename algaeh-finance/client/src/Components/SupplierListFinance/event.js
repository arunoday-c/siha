import { algaehApiCall } from "../../utils/algaehApiCall";

export function LoadSupplierPayable() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/finance_supplier/getSupplierPayables",
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
