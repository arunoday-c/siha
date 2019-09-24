import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

function getInputDates(inputs) {
  let yearMonth = inputs.year + "-" + inputs.month + "-01";

  const fromDate = moment(yearMonth)
    .startOf("month")
    .format("YYYY-MM-DD");
  const toDate = moment(yearMonth)
    .endOf("month")
    .format("YYYY-MM-DD");
  return { fromDate, toDate };
}

export function getEmployeesForProjectRoster(inputs) {
  return new Promise((resolve, reject) => {
    try {
      const {
        hims_d_employee_id,
        hospital_id,
        sub_department_id,
        department_id,
        designation_id,
        group_id
      } = inputs;
      const { fromDate, toDate } = getInputDates(inputs);
      algaehApiCall({
        uri: "/projectjobcosting/getEmployeesForProjectRoster",
        method: "GET",
        module: "hrManagement",
        data: {
          hims_d_employee_id: hims_d_employee_id,
          hospital_id: hospital_id,
          sub_department_id: sub_department_id,
          department_id: department_id,
          fromDate: fromDate,
          toDate: toDate,
          designation_id: designation_id,
          employee_group_id: group_id
        },
        onSuccess: res => {
          const { success, records, message } = res.data;
          if (success === true) {
            resolve({ records, fromDate, toDate });
          } else {
            reject(new Error(records.message));
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getProjects() {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/projectjobcosting/getDivisionProject",
        module: "hrManagement",
        method: "GET",
        onSuccess: response => {
          const { success, records, message } = response.data;
          if (success === true) {
            resolve(records);
          } else {
            reject(new Error(message));
          }
        },
        onCatch: error => {
          reject(error);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
