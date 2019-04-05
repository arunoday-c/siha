import { algaehApiCall } from "../../../utils/algaehApiCall";
import { displayFileFromServer } from "../../../utils/GlobalFunctions";
export default function examination() {
  return {
    getMaster: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getMaster",
          method: "GET",
          onSuccess: response => {
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          }
        });
      });
    },
    getExistingHeader: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getExistingDiagramHeader",
          method: "GET",
          onSuccess: response => {
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          }
        });
      });
    },
    getExistingDetail: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getExistingDiagramDetails",
          method: "GET",
          data: {
            hims_f_examination_diagram_header_id: that
          },
          onSuccess: response => {
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          }
        });
      });
    },
    saveDiagramHandler: (that, props) => {
      return new Promise((resolve, reject) => {
        const _data = {
          diagram_desc: that.diagram_desc,
          diagram_id: that.diagram_id,
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"],
          hims_f_examination_diagram_header_id:
            that.hims_f_examination_diagram_header_id,
          episode_id: Window.global["episode_id"],
          encounter_id: Window.global["encounter_id"],
          remarks: that.remarks
        };
        algaehApiCall({
          uri: "/examinationDiagram/saveDiagram",
          method: "POST",
          data: _data,
          onSuccess: response => {
            if (response.data.success === true) {
              resolve(response.data.records);
            } else {
              reject(response.data.message);
            }
          },
          onFailure: error => {
            debugger;
            reject(error);
          }
        });
      });
    }
  };
}
