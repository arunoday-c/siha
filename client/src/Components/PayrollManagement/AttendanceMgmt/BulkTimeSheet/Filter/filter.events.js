import { algaehApiCall } from "../../../../../utils/algaehApiCall";
export function getHospitals(callBack) {
  algaehApiCall({
    uri: "/organization/getOrganization",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        callBack(res.data.records);
      }
    }
  });
}
export function getAttendanceDates(callBack) {
  algaehApiCall({
    uri: "/attendance/getAttendanceDates",
    method: "GET",
    module: "hrManagement",
    onSuccess: res => {
      if (res.data.success) {
        callBack(res.data.result);
      }
    }
  });
}

export function getDivisionProject(data, callBack) {
  algaehApiCall({
    uri: "/projectjobcosting/getDivisionProject",
    method: "GET",
    data: data,
    module: "hrManagement",
    onSuccess: res => {
      if (res.data.success) {
        callBack(res.data.records);
      }
    }
  });
}
export function getBranchWiseDepartments(data, callback) {
  algaehApiCall({
    uri: "/branchMaster/getBranchWiseDepartments",
    method: "GET",
    data: data,
    module: "masterSettings",
    onSuccess: res => {
      if (res.data.success) {
        callback(res.data.records);
      }
    }
  });
}
export function UploadTimesheet(files, props) {
  debugger;
  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = e => {
    const data = e.target.result;
    algaehApiCall({
      uri: "/attendance/excelManualTimeSheetRead",
      data: data,
      method: "post",
      module: "hrManagement",
      onSuccess: response => {
        console.log("Done");
        if (response.success === true) {
          //props.uploadExcel(response.)
        }
      }
    });
  };
}
