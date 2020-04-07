import Enumerable from "linq";
import moment from "moment";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

export default function SubjectiveHandler() {
  return {
    dataLevelUpdate: ($this, e) => {
      e = e.name === undefined ? e.currentTarget : e;
      let name = e.name || e.target.name;
      let value = "";
      // row[name] = value;
      if (name === "duration") {
        value = parseFloat(e.value);
        if (value < 0) {
          return;
        }
        const _duration_Date_Interval =
          $this.state.interval !== null
            ? durationToDateAndInterval(value, $this.state.interval)
            : { onset_date: null, interval: null };
        $this.setState({
          onset_date: _duration_Date_Interval.onset_date,
          interval: _duration_Date_Interval.interval,
          [name]: value
        });
      } else if (name === "interval") {
        value = e.value || e.target.value;
        const _dur_date_inter = durationToDateAndInterval(
          $this.state.duration,
          value
        );

        $this.setState({
          onset_date: _dur_date_inter.onset_date,
          [name]: value
        });
      }
    },
    ChangeEventHandler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    datehandle: ($this, ctrl, e) => {
      const _durat_interval = dateDurationAndInterval(ctrl);

      $this.setState({
        duration: _durat_interval.duration,
        interval: _durat_interval.interval,
        onset_date: moment(ctrl)._d
      });
    },
    addChiefComplainToPatient: $this => {
      if ($this.state.chief_complaint === null) {
        swalMessage({
          title: "Please Enter Chief Complaint . .",
          type: "warning"
        });
        return;
      }
      let patChiefComp = [];
      patChiefComp.push({
        comment: $this.state.chief_complaint,
        duration: $this.state.duration,
        episode_id: $this.state.episode_id,
        interval: $this.state.interval,
        onset_date: $this.state.onset_date,
        pain: $this.state.pain,
        score: 0,
        severity: $this.state.severity,
        patient_id: $this.state.patient_id,
        recordState: "insert",
        chronic: $this.state.chronic,
        complaint_inactive: "N",
        complaint_inactive_date: null,
        complaint_type: $this.state.complaint_type,
        lmp_days: $this.state.lmp_days
      });
      algaehApiCall({
        uri: "/doctorsWorkBench/addPatientChiefComplaints",
        data: patChiefComp,
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Chief Complaint added successfully . .",
              type: "success"
            });
          }
        }
      });
    }
  };
}

function durationToDateAndInterval(duration, interval) {
  const _interval = Enumerable.from(GlobalVariables.PAIN_DURATION)
    .where(w => w.value === interval)
    .firstOrDefault().name;
  const _date = moment().add(-duration, _interval.toLowerCase());
  return { interval, onset_date: _date._d };
}

function dateDurationAndInterval(selectedDate) {
  let duration = 0;
  let interval = "D";
  if (moment().diff(selectedDate, "days") < 31) {
    duration = moment().diff(selectedDate, "days");
    interval = "D";
  } else if (moment().diff(selectedDate, "months") < 12) {
    duration = moment().diff(selectedDate, "months");
    interval = "M";
  } else if (moment().diff(selectedDate, "years")) {
    duration = moment().diff(selectedDate, "years");
    interval = "Y";
  }

  return { duration, interval };
}
