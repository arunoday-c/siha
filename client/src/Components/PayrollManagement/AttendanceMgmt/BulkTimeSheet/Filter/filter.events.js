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
        callBack(res.data.records);
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
