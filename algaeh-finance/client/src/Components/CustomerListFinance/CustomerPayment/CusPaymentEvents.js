import { newAlgaehApi } from "../../../hooks";

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
