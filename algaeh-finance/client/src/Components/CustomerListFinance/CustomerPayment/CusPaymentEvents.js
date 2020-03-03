import { newAlgaehApi } from "../../../hooks";

export async function getInvoicesForCustomer(child_id) {
  try {
    const result = await newAlgaehApi({
      uri: "/finance_customer/getCustomerInvoiceDetails",
      method: "GET",
      module: "finance",
      data: { child_id }
    });
    return result;
  } catch (e) {
    throw new Error(e.message || e.response.data.message);
  }
}
