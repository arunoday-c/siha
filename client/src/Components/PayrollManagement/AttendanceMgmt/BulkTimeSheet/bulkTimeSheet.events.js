import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";
export function downloadExcel(data, callBack) {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/attendance/getBulkManualTimeSheet",
    method: "GET",
    data: data,
    headers: {
      Accept: "blob"
    },
    module: "hrManagement",
    others: { responseType: "blob" },
    onSuccess: res => {
      callBack();
      let blob = new Blob([res.data], {
        type: "application/octet-stream"
      });
      const fileName = `ManualTimeSheet-${moment(data.from_date).format(
        "DD-MM-YYYY"
      )}-${moment(data.to_date).format("DD-MM-YYYY")}.xlsx`;
      var objectUrl = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", objectUrl);
      link.setAttribute("download", fileName);
      link.click();
      AlgaehLoader({ show: false });
    },
    onCatch: error => {
      var reader = new FileReader();
      reader.onload = function() {
        AlgaehLoader({ show: false });
        const parse = JSON.parse(reader.result);
        swalMessage({
          type: "error",
          title: parse !== undefined ? parse.result.message : parse
        });
      };
      reader.readAsText(error.response.data);
    }
  });
}
export function processDetails(data, error, result) {
  algaehApiCall({
    uri: "/attendance/postBulkTimeSheetMonthWise",
    method: "GET",
    data: data,
    module: "hrManagement",
    onSuccess: res => {
      if (res.data.success) {
        result();
      } else {
        error(res.data.result.message);
      }
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
