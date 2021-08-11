// import {swalMessage} from "../../../utils/algaehApiCall";
// import moment from "moment";
import { newAlgaehApi } from "../../../../hooks";

export async function loadEncounterData(data1) {
  debugger;
  const { data } = await newAlgaehApi({
    uri: "/frontdesk/loadEncounterData",
    module: "frontDesk",
    method: "GET",
    data: { ...data1 },
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}
export async function getProviderDetails() {
  const { data } = await newAlgaehApi({
    uri: "/frontDesk/getDoctorAndDepartment",
    module: "frontDesk",
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
export async function getDeptAndSubDept() {
  const { data } = await newAlgaehApi({
    uri: "/department/getAllClinicalSubDept",
    method: "GET",
    module: "masterSettings",
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}

export async function getOrganizationByUser() {
  const { data } = await newAlgaehApi({
    uri: "/organization/getOrganizationByUser",
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

export async function getDoctorSchedule(queryName, args) {
  const { sub_dept_id, schedule_date, provider_id } = args;
  if (sub_dept_id && schedule_date) {
    const { data } = await newAlgaehApi({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: {
        sub_dept_id,
        schedule_date: schedule_date,
        provider_id,
      },
    }).catch((error) => {
      throw error;
    });
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      return data.records;
    }
  } else {
    return [];
  }
}

export async function confirmAppointmentSMS(input) {
  const result = await newAlgaehApi({
    uri: "/frontDesk/confirmAppointmentSMS",
    module: "frontDesk",
    method: "POST",
    data: input,
  }).catch((error) => {
    throw error;
  });

  return result.data;
}
