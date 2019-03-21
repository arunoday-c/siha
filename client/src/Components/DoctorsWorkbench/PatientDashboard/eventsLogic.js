import _ from "lodash";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
export default function patientDashboard() {
  return {
    patientDetails: data => {
      return _.maxBy(data, m => new Date(m.encounter_date));
    },
    visitsOrder: data => {
      return _.orderBy(data, ["encounter_date"], ["desc"]);
    },
    getPatientVitials: (item, data) => {
      debugger;

      return new Promise((resolve, reject) => {
        if (item.hims_f_patient_visit_id === undefined) {
          resolve([]);
          return;
        }

        let _data = {
          patient_id: item.hims_d_patient_id,
          visit_id: data.map(item => {
            return item.hims_f_patient_visit_id;
          })
        };
        algaehApiCall({
          uri: "/vitals",
          data: _data,
          method: "GET",
          cancelRequestId: "vitals",
          module: "clicnicalDesk",
          onSuccess: response => {
            resolve(response.data.records);
          },
          onFailure: error => {
            reject(error);
          }
        });
      });
    },
    getTopLevelVitals: vitals => {
      let _mainVitals = [];
      if (vitals !== undefined && vitals.length > 0) {
        //To get last updated vital and start filter
        const _visitDate = _.maxBy(vitals, r => new Date(r.visit_date));
        _mainVitals = _.chain(vitals)
          .filter(
            f =>
              moment(new Date(f.visit_date)).format("YYYYMMDD") ===
              moment(new Date(_visitDate.visit_date)).format("YYYYMMDD")
          )
          .value();
      }
      return _mainVitals;
    },
    getSelectedDateVitals: (date, vitals) => {
      let _dateVitals = [];
      if (vitals !== undefined && vitals.length > 0) {
        //Selected date vitals start filter
        _dateVitals = _.chain(vitals).filter(
          f =>
            moment(new Date(f.visit_date)).format("YYYYMMDD") ===
            moment(new Date(date.encounter_date)).format("YYYYMMDD")
        );
      }
      return _dateVitals;
    }
  };
}
