import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
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

export function getEmpGroups(callback) {
  algaehApiCall({
    uri: "/hrsettings/getEmployeeGroups",
    method: "GET",
    module: "hrManagement",
    data: { record_status: "A" },
    onSuccess: res => {
      if (res.data.success) {
        callback(res.data.records);
      }
    }
  });
}

export function UploadTimesheet(files, props) {
  AlgaehLoader({ show: true });
  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = e => {
    const data = e.target.result.split(",")[1];
    algaehApiCall({
      uri: "/attendance/excelManualTimeSheetRead",
      data:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
        data,
      method: "post",
      module: "hrManagement",
      onSuccess: response => {
        AlgaehLoader({ show: false });
        if (response.data.success === true) {
          props.uploadExcel(response.data.result);
        } else {
          props.uploadErrors(response.data.result.message);
        }
      }
    });
  };
}
export function getPreview(data, props) {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/attendance/previewBulkTimeSheet",
    data: data,
    method: "get",
    module: "hrManagement",
    onSuccess: response => {
      AlgaehLoader({ show: false });
      if (response.data.success === true) {
        props.preview(response.data.result);
      } else {
        swalMessage({
          type: "error",
          title: response.data.result.message
        });
      }
    }
  });
}
