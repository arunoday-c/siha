import { newAlgaehApi } from "../../../hooks";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export async function getInvoicesForCustomer(child_id, is_opening_bal) {
  try {
    const result = await newAlgaehApi({
      uri: "/finance_customer/getCustomerInvoiceDetails",
      method: "GET",
      module: "finance",
      data: { child_id, is_opening_bal },
    });
    return result;
  } catch (e) {
    throw new Error(e.message || e.response.data.message);
  }
}

export function VerifyAuthorization({ invoice_no }) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/voucher/verifyInvoicePenForAuth",
        method: "POST",
        data: { invoice_no },
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
