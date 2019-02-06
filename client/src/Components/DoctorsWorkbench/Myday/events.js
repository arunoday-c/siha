import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
export default function MyDayEvents() {
  return {
    loadPatientsList: data => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/clinicalDesk/getMyDay",
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
          case "W":
          case "C":
          case "CA":
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
    visitBy: [
      {
        text: "Appointment & Walking",
        value: "AW"
      },
      {
        text: "Visit Created",
        value: "V"
      },
      {
        text: "Work in progress",
        value: "W"
      },
      {
        text: "Closed",
        value: "C"
      },
      {
        text: "Cancelled",
        value: "CA"
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
