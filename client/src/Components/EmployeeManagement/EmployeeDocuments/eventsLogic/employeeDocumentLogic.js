import { algaehApiCall } from "../../../../utils/algaehApiCall";
import _ from "lodash";
export default function eventsLogEmployeeDocument() {
  return {
    getEmployeeDetails: () => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/employee/get",
          module: "hrManagement",
          method: "GET",
          cancelRequestId: "getEmployees",
          onSuccess: (response) => {
            if (response.data.success) {
              let data = _.map(response.data.records, (item) => {
                return {
                  full_name:
                    _.startCase(_.camelCase(item.full_name)) +
                    " - " +
                    item.employee_code,
                  employee_id: item.hims_d_employee_id,
                };
              });
              resolve(data);
            } else {
              resolve([]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    getEmployeeDependents: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/employeeDependents",
          module: "hrManagement",
          method: "GET",
          data: data,
          cancelRequestId: "employeeDependents",
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;
              data.unshift({
                dependent_name: "Me",
                dependent_type: "Self",
                hims_d_employee_dependents_id: null,
                dependent_identity_type: undefined,
              });
              resolve(data);
            } else {
              resolve([
                {
                  dependent_name: "Me",
                  dependent_type: "Self",
                  hims_d_employee_dependents_id: null,
                  dependent_identity_type: undefined,
                },
              ]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    getCompanyDependents: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/companyDependents",
          module: "hrManagement",
          method: "GET",
          data: data,
          cancelRequestId: "companyDependents",
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;
              resolve(data);
            } else {
              resolve([]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    getDocumentTypes: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/types",
          module: "hrManagement",
          method: "GET",
          data: data,
          cancelRequestId: "types",
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;
              resolve(data);
            } else {
              resolve([]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    saveDocument: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/save",
          module: "hrManagement",
          method: "POST",
          data: data,
          cancelRequestId: "save",
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;
              resolve(data);
            } else {
              resolve([]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    getSaveDocument: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/getdocuments",
          module: "hrManagement",
          method: "GET",
          data: data,
          cancelRequestId: "getdocuments",
          onSuccess: (response) => {
            debugger;
            if (response.data.success) {
              let data = response.data.records;
              resolve(data);
            } else {
              resolve([]);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
  };
}
