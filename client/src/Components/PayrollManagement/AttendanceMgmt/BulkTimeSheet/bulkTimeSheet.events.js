import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
export function downloadExcel(data, callBack) {
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
      //if (res.data.success) {
      // console.log(JSON.stringify(res.data.result));

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
      //}
    }
  });
}
export function processDetails(data, error, result) {
  console.log(data);
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
