import moment from "moment";
import { algaehApiCall } from "../../../../../utils/algaehApiCall";

function getInputDates(inputs) {
  let yearMonth = inputs.year + "-" + inputs.month + "-01";

  const fromDate = moment(yearMonth).startOf("month").format("YYYY-MM-DD");
  const toDate = moment(yearMonth).endOf("month").format("YYYY-MM-DD");
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
        group_id,
        hospitals,
      } = inputs;
      const { fromDate, toDate } = getInputDates(inputs);
      let inputObj = {};

      if (hospital_id === -1) {
        const all_branches = hospitals.map((item) => {
          return item.hims_d_hospital_id;
        });
        inputObj = {
          select_all: true,
          hospital_id: all_branches,
          show_all_status: true,
          hims_d_employee_id: hims_d_employee_id,
          sub_department_id: sub_department_id,
          department_id: department_id,
          fromDate: fromDate,
          toDate: toDate,
          designation_id: designation_id,
          employee_group_id: group_id,
        };
      } else {
        inputObj = {
          hims_d_employee_id: hims_d_employee_id,
          hospital_id: hospital_id,
          sub_department_id: sub_department_id,
          department_id: department_id,
          fromDate: fromDate,
          toDate: toDate,
          designation_id: designation_id,
          employee_group_id: group_id,
          show_all_status: true,
        };
      }
      algaehApiCall({
        uri: "/projectjobcosting/getEmployeesForProjectRoster",
        method: "GET",
        module: "hrManagement",
        data: inputObj,
        onSuccess: (res) => {
          const { success, records } = res.data;
          if (success === true) {
            resolve({ records, fromDate, toDate });
          } else {
            reject(new Error(records.message));
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getProjects(hospital_id) {
  return new Promise((resolve, reject) => {
    try {
      algaehApiCall({
        uri: "/projectjobcosting/getDivisionProject",
        module: "hrManagement",
        method: "GET",
        // data: { division_id: hospital_id },
        onSuccess: (response) => {
          const { success, records, message } = response.data;

          if (success === true) {
            resolve(records);
          } else {
            reject(new Error(message));
          }
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
export function generateReport($this) {
  algaehApiCall({
    uri: "/excelReport",
    // uri: "/excelReport",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        // reportName: "pharmItemMomentEnquiryReport",
        pageOrentation: "landscape",
        // excelTabName: ,
        excelHeader: false,
        reportParams: [inputObj],
        // outputFileType: "EXCEL", //"EXCEL", //"PDF",
      },
    },
    onSuccess: (res) => {
      // if ($this.state.exportAsPdf === "Y") {
      //   const urlBlob = URL.createObjectURL(res.data);
      //   const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Inventory Item Master`;
      //   window.open(origin);
      // } else {
      //   const urlBlob = URL.createObjectURL(res.data);
      //   const a = document.createElement("a");
      //   a.href = urlBlob;
      //   a.download = `Inventory Item Master.${"xlsx"}`;
      //   a.click();
      // }
    },
  });
}
export function createReport(input, options) {
  return new Promise((resolve, reject) => {
    try {
      // const settings = { header: undefined, footer: undefined, ...options };
      algaehApiCall({
        uri: "/printReportRaw",
        skipParse: true,
        data: Buffer.from(input, "utf8"),
        module: "reports",
        method: "POST",
        header: {
          Accept: "blob",
        },
        others: {
          responseType: "blob",
        },
        onSuccess: (response) => {
          const url = URL.createObjectURL(response.data);
          const a = document.createElement("a");
          a.href = url;
          a.download = `newReport${moment().format()}.pdf`;
          a.click();
          resolve();
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
