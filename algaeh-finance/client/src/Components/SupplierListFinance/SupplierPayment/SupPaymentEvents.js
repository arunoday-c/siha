import { newAlgaehApi } from "../../../hooks";

export async function getInvoicesForSupplier(child_id) {
  try {
    const result = await newAlgaehApi({
      uri: "/finance_supplier/getSupplierInvoiceDetails",
      method: "GET",
      module: "finance",
      data: { child_id }
    });
    return result;
  } catch (e) {
    throw new Error(e.message || e.response.data.message);
  }
}
