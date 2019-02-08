import _ from "lodash";
export default function patientDashboard() {
  return {
    patientDetails: data => {
      return _.maxBy(data, m => new Date(m.Encounter_Date));
    }
  };
}
