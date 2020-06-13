import { algaehApiCall } from "../../../utils/algaehApiCall";
import _ from "lodash";
export default function examination() {
  return {
    getMaster: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getMaster",
          method: "GET",
          onSuccess: (response) => {
            console.log("response", response);
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
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
    saveDiagramHandler: (that, props) => {
      return new Promise((resolve, reject) => {
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
            that.hims_f_examination_diagram_header_id,
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
