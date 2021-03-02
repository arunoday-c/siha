import {
  algaehApiCall,
  getCookie,
  swalMessage,
} from "../../../utils/algaehApiCall";
import _ from "lodash";
// import { newAlgaehApi } from "../../../hooks";
export default function examination() {
  return {
    getMaster: (that, props, hims_d_sub_department_id) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/diagram/getSavedSubSpecialityDiagram",
          method: "GET",
          data: {
            sub_department_id: hims_d_sub_department_id,
          },
          onSuccess: (response) => {
            console.log("response", response);
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          },
        });
        // algaehApiCall({
        //   uri: "/examinationDiagram/getMaster",
        //   method: "GET",
        //   onSuccess: (response) => {
        //     console.log("response", response);
        //     if (response.data.success) {
        //       resolve(response.data.records);
        //     } else {
        //       reject(response);
        //     }
        //   },
        // });
      });
    },
    saveFileOnServer: (options) => {
      return new Promise((resolve, reject) => {
        const _pageName = getCookie("ScreenName").replace("/", "");
        const _splitter = options.file.split(",");
        algaehApiCall({
          uri: "/Document/save",
          method: "POST",
          data: _splitter[1],
          module: "documentManagement",
          header: {
            "content-type": "application/octet-stream",
            // "content-type": "multipart/form-data",
            "x-file-details": JSON.stringify({
              pageName: _pageName,
              destinationName: options.uniqueID,
              fileType: options.fileType,
              fileExtention: options.fileExtention,
            }),
          },
          others: {
            onUploadProgress: (progressEvent) => {
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              if (percentCompleted >= 100) {
                if (typeof options.afterSave === "function")
                  options.afterSave();
              } else {
                if (typeof options.showProcess === "function")
                  options.showProcess();
              }
            },
          },
          onSuccess: (result) => {
            if (result.data.success) {
              if (options.showSuccessMessage === undefined) {
                swalMessage({
                  croppingDone: false,
                  title: "File Uploaded Successfully",
                  type: "success",
                });
              } else {
                if (typeof options.showSuccessMessage === "function") {
                  options.showSuccessMessage(result);
                }
              }
            }
            resolve();
          },
          onCatch: (error) => {
            reject(error);
          },
        });
      });
    },
    getExistingHeader: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getExistingDiagramHeader",
          method: "GET",
          data: { patient_id: Window.global["current_patient"] },
          onSuccess: (response) => {
            if (response.data.success) {
              console.log("response.data.records", response.data.records);
              resolve(response.data.records);
            } else {
              reject(response);
            }
          },
        });
      });
    },
    getExistingDetail: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getExistingDiagramDetails",
          method: "GET",
          data: {
            hims_f_examination_diagram_header_id: that,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          },
        });
      });
    },
    saveDiagramHandler: (that, props, data) => {
      return new Promise((resolve, reject) => {
        data.setState({ loading: true });
        let _header_datetime = undefined;

        if (that.saveAsChecked !== "new") {
          const _header = _.find(
            that.existingDiagram,
            (f) =>
              f.hims_f_examination_diagram_header_id ===
              that.hims_f_examination_diagram_header_id
          );
          if (_header !== undefined || _header !== null) {
            _header_datetime = _header.header_datetime;
          }
        } else {
          _header_datetime = new Date();
        }

        const _data = {
          diagram_desc: that.diagram_desc,
          diagram_id: that.diagram_id,
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"],
          hims_f_examination_diagram_header_id:
            that.saveAsChecked !== "new"
              ? that.hims_f_examination_diagram_header_id
              : null,
          episode_id: Window.global["episode_id"],
          encounter_id: Window.global["encounter_id"],
          remarks: that.remarks,
          saveAsNew: that.saveAsChecked,
          header_datetime: _header_datetime,
        };

        algaehApiCall({
          uri: "/examinationDiagram/saveDiagram",
          method: "POST",
          data: _data,
          onSuccess: (response) => {
            if (response.data.success === true) {
              resolve(response.data.records);
            } else {
              reject(response.data.message);
            }
          },
          onFailure: (error) => {
            reject(error);
          },
        });
      });
    },
    deleteDetaiDiagram: (details) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/deleteDiagram",
          method: "DELETE",
          data: {
            examination_diagrams_id: details.examination_diagrams_id,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              algaehApiCall({
                uri: "/Document/delete",
                method: "DELETE",
                module: "documentManagement",
                data: { fileType: "DepartmentImages", unique: details.unique },
                onSuccess: (result) => {
                  resolve("Deleted successfully");
                },
                onFailure: (error) => {
                  reject(error);
                },
              });
            } else {
              reject(response);
            }
          },
        });
      });
    },
  };
}
