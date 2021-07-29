import { newAlgaehApi } from "../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";
export async function getServiceTypeDropDown() {
  const { data } = await newAlgaehApi({
    uri: "/serviceType/getServiceTypeDropDown",
    module: "masterSettings",
    method: "GET",
  }).catch((error) => {
    debugger;
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

export function addOrUpdatePortalSetup(data, refetch) {
  const dataArray = data.filteredArray.map((item) => {
    return {
      ...item,
      id: item.id,
      insurance_id: item.insurance_provider_id,
      sub_insurance_id: item.hims_d_insurance_sub_id,
      service_types: JSON.stringify(item.service_type),
      hospital_id: item.hospitalID,
    };
  });

  newAlgaehApi({
    uri: "/insurance/addOrUpdatePortalSetup",
    module: "insurance",
    data: { data: dataArray },
    method: "POST",
  })
    .then((response) => {
      refetch();
      AlgaehMessagePop({
        display: "Data updated Successfully...",
        type: "success",
      });
    })
    .catch((err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    });
  // return result.data?.records;
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
      setIsDirty(false);
    })
    .catch((err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    });
}
