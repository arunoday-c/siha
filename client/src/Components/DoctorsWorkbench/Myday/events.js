import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
export default function MyDayEvents() {
  return {
    loadPatientsList: data => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/myDay",
          data: data.inputParam,
          method: "GET",
          cancelRequestId: "getMyDay",
          module: "clicnicalDesk",
          onSuccess: response => {
            resolve(response);
          },
          onFailure: error => {
            reject(error);
          }
        });
      });
    },
    myDayOnSelection: (data, type) => {
      try {
        let _data = undefined;

        switch (type) {
          case "AW":
            _data = _.chain(data)
              .filter(f => f.encounter_id === null)
              .value();
            break;
          case "V":
          case "W":
          case "CO":
            _data = _.chain(data)
              .filter(f => f.status === type)
              .value();
            break;
          default:
            _data = data;
            break;
        }
        return _data;
      } catch (e) {
        swalMessage({
          title: e.message,
          type: "error"
        });
      }
    },
    getPatientDetails: data => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/myDay/patientDetails",
          data: data.inputParam,
          method: "GET",
          cancelRequestId: "update",
          module: "clicnicalDesk",
          onSuccess: response => {
            resolve(response);
          },
          onFailure: error => {
            reject(error);
          }
        });
      });
    },
    visitBy: [
      {
        text: "Appointment & Walking",
        value: "AW"
      },

      {
        text: "In progress",
        value: "W"
      },

      {
        text: "Completed",
        value: "CO"
      },
      {
        text: "All",
        value: "ALL"
      }
    ]
  };
}
