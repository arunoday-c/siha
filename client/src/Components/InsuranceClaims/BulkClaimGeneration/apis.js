import { newAlgaehApi } from "../../../hooks";

export async function getVisits(key, data) {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/getVisitsForGeneration",
    module: "insurance",
    method: "GET",
    data: data,
  });
  return res?.data?.records;
}

export async function getInsuranceProviders() {
  const res = await newAlgaehApi({
    uri: "/insurance/getInsuranceProviders",
    module: "insurance",
    method: "GET",
  });
  return res?.data?.records;
}

export async function getSubInsurance(key, { insurance_provider_id }) {
  const res = await newAlgaehApi({
    uri: "/insurance/getSubInsurance",
    module: "insurance",
    method: "GET",
    data: {
      insurance_provider_id,
    },
  });
  return res?.data?.records;
}

export async function getInvoiceForVisit(key, { visit_id }) {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/getVisitWiseBillDetailS",
    module: "insurance",
    method: "GET",
    data: { visit_id, insurance_yesno: "Y" },
  });
  return res.data?.records;
}

export async function getBillDetails(key, { details = [] }) {
  const res = await newAlgaehApi({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: { billdetails: details },
  });
  return res.data?.records;
}

export async function sendForGeneration(vist_ids) {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/bulkInvoiceGeneration",
    module: "insurance",
    method: "POST",
    data: { vist_ids },
  });
  return res.data?.records;
}
