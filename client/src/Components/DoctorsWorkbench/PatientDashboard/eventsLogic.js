import _ from "lodash";
import { algaehApiCall } from "../../../utils/algaehApiCall";
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
          cancelRequestId: "ehr_vitals",
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
        _.chain(vitals)
          .filter(
            f =>
              moment(new Date(f.visit_date)).format("YYYYMMDD") ===
              moment(new Date(_visitDate.visit_date)).format("YYYYMMDD")
          )
          .value()
          .map(item => {
            const _finder = _.find(
              _mainVitals,
              fd => fd.vital_short_name === item.vital_short_name
            );
            if (typeof _finder === "undefined") {
              _mainVitals.push(item);
            }
          });
      }
      return _mainVitals;
    },
    getSelectedDateVitals: (hims_f_patient_visit_id, vitals, visitsDetail) => {
      let _dateVitals = [];
      let _date = undefined;
      const _objectVisitDtl = _.find(
        visitsDetail,
        f => f.hims_f_patient_visit_id === hims_f_patient_visit_id
      );
      _date = _objectVisitDtl.encounter_date;
      if (vitals !== undefined && vitals.length > 0) {
        if (_objectVisitDtl !== undefined) {
          //Selected date vitals start filter
          _.chain(vitals)
            .filter(
              f =>
                moment(new Date(f.visit_date)).format("YYYYMMDD") ===
                moment(new Date(_date)).format("YYYYMMDD")
            )
            .value()
            .map(item => {
              const _finder = _.find(
                _dateVitals,
                fd => fd.vital_short_name === item.vital_short_name
              );
              if (typeof _finder === "undefined") {
                _dateVitals.push(item);
              }
            });
        }
      }
      return { vitals: _dateVitals, date: _date };
    },
    getSelectDiagnosis: options => {
      return new Promise((resolve, reject) => {
        if (options.patient_id === undefined) return reject([]);

        algaehApiCall({
          uri: "/dashboard/patientDiagnosis",
          data: options,
          method: "GET",
          cancelRequestId: "ehr_patientDiagnosis",
          module: "clicnicalDesk",
          onSuccess: response => {
            resolve(response.data.records);
          },
          onFailure: error => {
            reject(error);
          }
        });
      });
    }
  };
}
