import { newAlgaehApi } from "../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";
export async function getServiceTypeDropDown() {
  const { data } = await newAlgaehApi({
    uri: "/serviceType/getServiceTypeDropDown",
    module: "masterSettings",
    method: "GET",
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}
export async function getSubInsuranceGrid(key) {
  const { data } = await newAlgaehApi({
    uri: "/insurance/getSubInsuranceGrid",
    module: "insurance",
    method: "GET",
    // data: inputobj,
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}
export async function getPortalExists(key) {
  const { data } = await newAlgaehApi({
    uri: "/insurance/getPortalExists",
    module: "insurance",
    method: "GET",
    // data: inputobj,
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}

export async function addOrUpdatePortalSetup(data, refetch) {
  await newAlgaehApi({
    uri: "/insurance/addOrUpdatePortalSetup",
    module: "insurance",
    data: data,
    method: "POST",
  }).catch((err) => {
    throw new Error(err.message);
  });
}
export function updatePortal(data, setIsDirty) {
  newAlgaehApi({
    uri: "/insurance/updatePortalExists",
    module: "insurance",
    data: { portal_exists: data.portal_exists },
    method: "PUT",
  })
    .then((response) => {
      AlgaehMessagePop({
        display: "Data updated Successfully...",
        type: "success",
      });
      // setIsDirty(false);
      // set
    })
    .catch((err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    });
}

export async function syncServicesToPortal() {
  const result = await newAlgaehApi({
    uri: "/insurance/syncServicesToPortal",
    module: "insurance",
    method: "POST",
  }).catch((err) => {
    throw new Error(err.message);
  });
  return result.data;
}
