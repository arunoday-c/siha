import {
  algaehApiCall,
  swalMessage,
  // getCookie,
} from "../../../../utils/algaehApiCall";
import _ from "lodash";
import { newAlgaehApi } from "../../../../hooks";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
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
    saveDocumentDetails: (dataFile) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/save",
          module: "hrManagement",
          method: "POST",
          data: dataFile,
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
    getSelectedDocument(row) {
      return new Promise((resolve, reject) => {
        // let contract_no =
        //   row.hims_f_employee_documents_id + row.download_uniq_id;
        newAlgaehApi({
          uri: "/getContractDoc",
          module: "documentManagement",
          method: "GET",
          data: {
            contract_no: row.contract_no,
            row: row,

            // employeeDoc: true,
          },
        })
          .then((res) => {
            if (res.data.success) {
              let data = res.data.data[0];
              resolve(data);
            }
          })
          .catch((e) => {
            reject(e);
            swalMessage({
              title: e.message,
              type: "error",
            });
          });
      });
    },
    updateDocumentNamePhysical: (doc, state, editedRecord) => {
      return new Promise((resolve, reject) => {
        // const gridData = document_grid_copy;
        // const oldNameDoc = gridData.filter(
        //   (f) =>
        //     f.hims_f_employee_documents_id === doc.hims_f_employee_documents_id
        // )[0].document_name;

        newAlgaehApi({
          uri: "/updateDocumentNamePhysical",
          data: {
            doc_number: doc.hims_f_employee_documents_id,
            oldFilePath: `EmployeeDocuments/${state.employee_code}/${
              doc.download_uniq_id
            }/${doc.hims_f_employee_documents_id}/${
              doc.hims_f_employee_documents_id
            }__ALGAEH__${editedRecord[doc.hims_f_employee_documents_id]}`,
            newPath: `EmployeeDocuments/${state.employee_code}/${doc.download_uniq_id}/${doc.hims_f_employee_documents_id}/${doc.hims_f_employee_documents_id}__ALGAEH__${doc.document_name}`,
          },

          method: "GET",
          module: "documentManagement",
        })
          .then((res) => {
            if (res.data.success) {
              resolve(res.data);
            } else {
              resolve([]);
            }
          })
          .catch((error) => reject(error));
      });
    },
    saveDocument: (formData) => {
      return new Promise((resolve, reject) => {
        // const formData = new FormData();

        // formData.append("destinationName", destinationName);
        // // formData.append("contract_id", contract_id);
        // files.forEach((file, index) => {
        //   formData.append(`file_${index}`, file, file.name);
        // });
        // formData.append("forModule", "EmployeeDocModel");
        // formData.append("pageName", getCookie("ScreenName"));
        newAlgaehApi({
          uri: "/uploadEmployeeDoc",
          data: formData,
          extraHeaders: { "Content-Type": "multipart/form-data" },
          method: "POST",
          module: "documentManagement",
        })
          .then((res) => {
            if (res.data.success) {
              resolve(res.data);
            } else {
              resolve([]);
            }
          })
          .catch((error) => reject(error));
      });
    },
    downloadDoc: (doc, isPreview, state) => {
      // if (doc.fromPath === true) {
      console.log("completepath");
      newAlgaehApi({
        uri: "/getUploadedEmployeeFiles",
        module: "documentManagement",
        method: "GET",
        extraHeaders: {
          Accept: "blob",
        },
        others: {
          responseType: "blob",
        },
        data: {
          doc_number: doc.hims_f_employee_documents_id,
          filePath: `EmployeeDocuments/${state.employee_code}/${doc.download_uniq_id}/${doc.hims_f_employee_documents_id}/${doc.hims_f_employee_documents_id}__ALGAEH__${doc.document_name}`,
          nameOfTheFolder: doc.download_uniq_id,
          folderPath: `EmployeeDocuments/${state.employee_code}/${doc.download_uniq_id}/${doc.hims_f_employee_documents_id}/`,
          movedOldFile: doc.unique_id_fromMongo ? false : true,
          unique_id_fromMongo: doc.unique_id_fromMongo,
          filename: doc.document_name,
          employee_code: state.employee_code,
        },
      })
        .then((resp) => {
          if (doc.unique_id_fromMongo) {
            newAlgaehApi({
              uri: "/documents/updateOldRecordDocument",
              module: "hrManagement",
              method: "PUT",
              data: {
                hims_f_employee_documents_id: doc.hims_f_employee_documents_id,
              },
            })
              .then((res) => {})
              .catch((error) => console.log(error));
          }
          const urlBlob = URL.createObjectURL(resp.data);
          if (isPreview) {
            window.open(urlBlob);
          } else {
            const link = document.createElement("a");
            link.download = doc.document_name;
            link.href = urlBlob;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          AlgaehLoader({ show: false });
        })
        .catch((error) => {
          console.log(error);
        });
      // } else {
      //   const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
      //   const link = document.createElement("a");
      //   if (!isPreview) {
      //     link.download = doc.filename;
      //     link.href = fileUrl;
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      //   } else {
      //     fetch(fileUrl)
      //       .then((res) => res.blob())
      //       .then((fblob) => {
      //         const newUrl = URL.createObjectURL(fblob);
      //         window.open(newUrl);
      //       });
      //   }
      // }
    },

    // deleteDoc : (doc) => {
    //   confirm({
    //     title: `Are you sure you want to delete this file?`,
    //     content: `${doc.filename}`,
    //     icon: "",
    //     okText: "Yes",
    //     okType: "danger",
    //     cancelText: "No",
    //     onOk() {
    //       onDelete(doc);
    //     },
    //     onCancel() {
    //       console.log("Cancel");
    //     },
    //   });
    // },

    onDelete: (doc, state) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/deleteEmployeeDocs",
          module: "documentManagement",
          method: "DELETE",
          data: {
            completePath: `EmployeeDocuments/${state.employee_code}/${doc.download_uniq_id}/${doc.hims_f_employee_documents_id}`,
          },
          cancelRequestId: "deleteDocument",
          onSuccess: (response) => {
            if (response.data.success) {
              resolve(response);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
        // newAlgaehApi({
        //   uri: "/deleteContractDoc",
        //   method: "DELETE",
        //   module: "documentManagement",
        //   data: { id: doc.unique_id_fromMongo, forModule: "EmployeeDocModel" },
        // })
        //   .then((res) => {
        //     if (res.data.success) {
        //       resolve(res);
        //     }
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });
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

    deleteSavedDocument: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/documents/deleteDocument",
          module: "hrManagement",
          method: "DELETE",
          data: data,
          cancelRequestId: "deleteDocument",
          onSuccess: (response) => {
            if (response.data.success) {
              resolve();
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    deleteDocument: (data) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/Document/delete",
          module: "documentManagement",
          method: "DELETE",
          data: data,
          cancelRequestId: "deleteDocument",
          onSuccess: (response) => {
            resolve();
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
  };
}
