import {
  algaehApiCall,
  swalMessage,
  getCookie,
} from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import swal from "sweetalert2";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { setGlobal } from "../../../utils/GlobalFunctions";
import _ from "lodash";
import { Validations } from "./Validation";

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
          [name]: value,
        });
      } else if (name === "interval") {
        value = e.value || e.target.value;
        const _dur_date_inter = durationToDateAndInterval(
          $this.state.duration,
          value
        );

        $this.setState({
          onset_date: _dur_date_inter.onset_date,
          [name]: value,
        });
      }
    },
    ChangeEventHandler: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
      });
    },
    datehandle: ($this, ctrl, e) => {
      const _durat_interval = dateDurationAndInterval(ctrl);

      $this.setState({
        duration: _durat_interval.duration,
        interval: _durat_interval.interval,
        onset_date: moment(ctrl)._d,
      });
    },

    IcdsSearch: ($this, diagType) => {
      const err = Validations($this);
      if (!err) {
        AlgaehSearch({
          searchGrid: {
            columns: spotlightSearch.Diagnosis.IcdCodes,
          },
          searchName: "IcdCodes",
          uri: "/gloabelSearch/get",
          onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
          },
          onRowSelect: (row) => {
            debugger;
            if (diagType === "Final") {
              const existingComplaints =
                $this.props.patient_diagnosis === undefined
                  ? []
                  : $this.props.patient_diagnosis;
              const isFind = _.find(
                existingComplaints,
                (f) => f.daignosis_id === row.hims_d_icd_id
              );
              if (isFind === undefined) {
                insertFinalICDS($this, row);
              } else {
                swalMessage({
                  title:
                    "Selected diagnosis already added. Please choose different.",
                  type: "info",
                });
              }
            } else if (diagType === "Intial") {
              // insertInitialICDS($this, row);
            }
          },
        });
      }
    },
    onchangegridcol: ($this, row, from, e) => {
      if (e.selected.value === "P" && row.diagnosis_type !== "P") {
        const primaryExists = _.find(
          $this.props.patient_diagnosis,
          (f) => f.diagnosis_type === "P"
        );
        if (primaryExists !== undefined) {
          swalMessage({
            title: "Primary diagnosis already exists",
            type: "info",
          });
          return;
        }
      }

      if (from === "Intial" && row.final_daignosis === "Y") {
        swalMessage({
          title:
            "Already selected as final diagnosis. If changes required change in final diagnosis",
          type: "info",
        });
      } else {
        let name = e.name || e.target.name;
        let value = e.value || e.target.value;

        if (from === "Intial") {
          row[name] = value;
          row.update();
        } else if (from === "Final") {
          row[name] = value;
          row.update();
        }
      }
    },
    deleteFinalDiagnosis: ($this, row, from) => {
      showconfirmDialog($this, row);
    },

    updateDiagnosis: ($this, row) => {
      let data = {
        hims_f_patient_diagnosis_id: row.hims_f_patient_diagnosis_id,
        diagnosis_type: row.diagnosis_type,
        final_daignosis: row.final_daignosis,
        record_status: "A",

        patient_identity: $this.props.pat_profile.primary_id_no,
        visit_code: $this.props.pat_profile.visit_code,
        daignosis_name: row.icd_description,
      };

      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientDiagnosis",
        data: data,
        method: "PUT",
        onSuccess: (response) => {
          if (response.data.success) {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success",
            });
            getPatientDiagnosis($this);
          }
        },
      });
    },

    addChiefComplainToPatient: ($this, forceSave) => {
      const { current_patient, episode_id } = Window.global;
      let _screenName = getCookie("ScreenName").replace("/", "");
      if (_screenName === "Login") {
        return;
      }
      let patChiefComp = [];
      patChiefComp.push({
        comment: $this.state.chief_complaint,
        duration: $this.state.duration,
        episode_id: episode_id, // Window.global["episode_id"],
        interval: $this.state.interval,
        onset_date: $this.state.onset_date,
        pain: $this.state.pain,
        score: 0,
        severity: $this.state.severity,
        patient_id: current_patient, // Window.global["current_patient"],
        recordState: "insert",
        chronic: $this.state.chronic,
        complaint_inactive: "N",
        complaint_inactive_date: null,
        complaint_type: $this.state.complaint_type,
        lmp_days: $this.state.lmp_days,
      });
      algaehApiCall({
        uri: "/doctorsWorkBench/addPatientChiefComplaints",
        data: patChiefComp,
        onSuccess: (response) => {
          if (response.data.success) {
            getPatientChiefComplaints($this);
            if (forceSave === "forceSave") {
              swalMessage({
                // title: "Saved Successfully",
                html:
                  "Chief Complaint, Significant Signs and Other Comments</br></br> <b>Saved Successfully</b>",
                type: "success",
              });
            }
          }
        },
      });

      if (
        $this.state.significant_signs !== null ||
        $this.state.other_signs !== null
      ) {
        const { encounter_id } = Window.global;
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientEncounter",
          method: "PUT",
          data: {
            other_signs: $this.state.other_signs,
            significant_signs: $this.state.significant_signs,
            encounter_id: encounter_id, // Window.global.encounter_id
            primary_id_no: $this.props.pat_profile.primary_id_no,
            visit_code: $this.props.pat_profile.visit_code,
            visit_date: $this.props.pat_profile.Encounter_Date,
          },
          onSuccess: (response) => {
            if (response.data.success) {
            }
          },
        });
      }
    },

    updatePatientChiefComplaints: ($this, forceSave) => {
      const { current_patient, episode_id } = Window.global;
      let _screenName = getCookie("ScreenName").replace("/", "");
      if (_screenName === "Login") {
        return;
      }
      let patChiefComp = [];
      debugger;
      patChiefComp.push({
        hims_f_episode_chief_complaint_id:
          $this.state.hims_f_episode_chief_complaint_id,
        comment: $this.state.chief_complaint,
        duration: $this.state.duration,
        episode_id: episode_id, //Window.global["episode_id"],
        interval: $this.state.interval,
        onset_date: $this.state.onset_date,
        pain: $this.state.pain,
        severity: $this.state.severity,
        patient_id: current_patient, //Window.global["current_patient"],
        chronic: $this.state.chronic,
        complaint_type: $this.state.complaint_type,
        lmp_days: $this.state.lmp_days,
        primary_id_no: $this.props.pat_profile.primary_id_no,
        visit_code: $this.props.pat_profile.visit_code,
        Encounter_Date: $this.props.pat_profile.Encounter_Date,
        significant_signs: $this.state.significant_signs,
        other_signs: $this.state.other_signs,
      });
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientChiefComplaints",
        method: "PUT",
        data: { chief_complaints: patChiefComp },
        onSuccess: (response) => {
          if (response.data.success) {
            if (forceSave === "forceSave") {
              swalMessage({
                // title: "Updated Successfully",
                html:
                  "Chief Complaint, Significant Signs and Other Comments</br></br> <b>Saved Successfully</b>",
                type: "success",
              });
            }
            getPatientChiefComplaints($this);
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
      if (
        $this.state.significant_signs !== null ||
        $this.state.other_signs !== null
      ) {
        const { encounter_id } = Window.global;
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientEncounter",
          method: "PUT",
          data: {
            other_signs: $this.state.other_signs,
            significant_signs: $this.state.significant_signs,
            encounter_id: encounter_id, //Window.global.encounter_id
            primary_id_no: $this.props.pat_profile.primary_id_no,
            visit_code: $this.props.pat_profile.visit_code,
            visit_date: $this.props.pat_profile.Encounter_Date,
          },
          onSuccess: (response) => {
            if (response.data.success) {
            }
          },
        });
      }
    },

    getPatientChiefComplaints: ($this) => {
      getPatientChiefComplaints($this);
    },
    deletePrecription: ($this, medicine, context) => {
      swal({
        title:
          "Are you sure you want to delete this Item " +
          medicine.item_description +
          " ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then((willDelete) => {
        if (willDelete.value) {
          debugger;
          algaehApiCall({
            uri: "/orderMedication/deletePatientPrescription",
            data: {
              hims_f_prescription_detail_id:
                medicine.hims_f_prescription_detail_id,
              hims_f_chronic_id: medicine.hims_f_chronic_id,
              primary_id_no: $this.props.pat_profile.primary_id_no,
              visit_code: $this.props.pat_profile.visit_code,
              item_description: medicine.item_description,
              delete_data: true,
            },
            method: "DELETE",
            onSuccess: (response) => {
              if (response.data.success) {
                algaehApiCall({
                  uri: "/orderMedication/getPatientMedications",
                  data: { patient_id: Window?.global?.current_patient }, //Window.global["current_patient"] },
                  method: "GET",
                  onSuccess: (response) => {
                    const data = { loadingUnderMedication: false };
                    if (response.data.success) {
                      data["recent_mediction"] =
                        response.data.records.latest_mediction;
                      data["all_mediction"] =
                        response.data.records.all_mediction;
                      data["active_medication"] =
                        response.data.records.active_medication;

                      debugger;
                      if ($this.state.portal_exists === "Y") {
                        uploadPrescriptiontoPortal($this);
                      }
                    }
                    context.updateState({
                      updateChronic: true,
                      // AdvanceOpen: false,
                      // RefundOpen: false
                    });
                    $this.setState({
                      ...data,
                    });
                  },
                  onFailure: (error) => {
                    swalMessage({
                      title: error.message,
                      type: "error",
                    });
                  },
                });
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        }
      });
    },
  };
}

function getPatientChiefComplaints($this) {
  algaehApiCall({
    uri: "/doctorsWorkBench/getPatientBasicChiefComplaints",
    data: {
      patient_id: Window?.global?.current_patient,
      episode_id: Window?.global?.episode_id,
    },
    method: "GET",
    // cancelRequestId: "getPatientBasicChiefComplaints",
    onSuccess: (response) => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({
            hims_f_episode_chief_complaint_id:
              response.data.records[0].hims_f_episode_chief_complaint_id,
            chief_complaint: response.data.records[0].comment,
            duration: response.data.records[0].duration,

            interval: response.data.records[0].interval,
            onset_date: response.data.records[0].onset_date,
            pain: response.data.records[0].pain,

            severity: response.data.records[0].severity,

            chronic: response.data.records[0].chronic,
            complaint_type: response.data.records[0].complaint_type,
          });

          setGlobal({
            chief_complaint: response.data.records[0].comment,
          });
        }
      }
    },
  });
}
function insertFinalICDS($this, row) {
  const { current_patient, episode_id, visit_id } = Window.global;
  const finalICDS = Enumerable.from($this.props.patient_diagnosis)
    .where((w) => w.final_daignosis === "Y")
    .toArray();
  let diagnosis_type = "";
  if (finalICDS.length > 0) {
    diagnosis_type = "S";
  } else {
    diagnosis_type = "P";
  }

  let insertfinalICDS = [];
  insertfinalICDS.push({
    daignosis_id: row.hims_d_icd_id,
    diagnosis_type: diagnosis_type,
    patient_id: current_patient, //Window.global["current_patient"],
    episode_id: episode_id, //Window.global["episode_id"],
    visit_id: visit_id, //Window.global["visit_id"],
    final_daignosis: "Y",

    primary_id_no: $this.props.pat_profile.primary_id_no,
    visit_code: $this.props.pat_profile.visit_code,
    daignosis_name: row.icd_description,
  });

  saveDiagnosis($this, insertfinalICDS);
}

function saveDiagnosis($this, data) {
  algaehApiCall({
    uri: "/doctorsWorkBench/addPatientDiagnosis",
    data: data,
    method: "POST",
    onSuccess: (response) => {
      if (response.data.success === true) {
        getPatientDiagnosis($this);

        swalMessage({
          title: "Record Added successfully . .",
          type: "success",
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
}
function showconfirmDialog($this, row) {
  swal({
    title: "Are you sure you want to delete this Diagnosis?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then((willDelete) => {
    if (willDelete.value) {
      debugger;
      let data = {
        hims_f_patient_diagnosis_id: row.hims_f_patient_diagnosis_id,
        diagnosis_type: row.diagnosis_type,
        final_daignosis: row.final_daignosis,
        record_status: "I",
        patient_identity: $this.props.pat_profile.primary_id_no,
        visit_code: $this.props.pat_profile.visit_code,
        daignosis_name: row.icd_description,
        delete_data: true,
      };

      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientDiagnosis",
        data: data,
        method: "PUT",
        onSuccess: (response) => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . .",
              type: "success",
            });

            getPatientDiagnosis($this);
          }
        },
      });
    }
  });
}
function getPatientDiagnosis($this) {
  const { current_patient, episode_id } = Window.global;
  $this.props.getPatientDiagnosis({
    uri: "/doctorsWorkBench/getPatientDiagnosis",
    cancelRequestId: "getPatientDiagnosis",
    data: {
      patient_id: current_patient, // Window.global["current_patient"],
      episode_id: episode_id, //Window.global["episode_id"]
    },
    method: "GET",
    redux: {
      type: "PATIENT_DIAGNOSIS_DATA",
      mappingName: "patient_diagnosis",
    },
    afterSuccess: (data) => {
      $this.setState({
        showInitialDiagnosisLoader: false,
        showFinalDiagnosisLoader: false,
      });
    },
  });
}

function durationToDateAndInterval(duration, interval) {
  const _interval = Enumerable.from(GlobalVariables.PAIN_DURATION)
    .where((w) => w.value === interval)
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

export function IcdCodeForChronic(cb) {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Diagnosis.IcdCodes,
    },
    searchName: "IcdCodes",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      cb(row);
    },
  });
}

export function uploadPrescriptiontoPortal($this) {
  debugger;
  return new Promise((resolve, reject) => {
    let portalParams = {};
    if ($this.state.portal_exists === "Y") {
      portalParams["reportToPortal"] = "true";
      portalParams["rpt_type"] = "PATIENT_RPT_MEDICATION";
    }

    const _patient = Window.global["current_patient"];
    const _visit = Window.global["visit_id"];
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          ...portalParams,
          reportName: "prescription",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: _patient,
            },
            {
              name: "visit_id",
              value: _visit,
            },
            {
              name: "patient_identity",
              value: $this.props.pat_profile.primary_id_no,
            },
            {
              name: "visit_code",
              value: $this.props.pat_profile.visit_code,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        // debugger;
        // const urlBlob = URL.createObjectURL(res.data);
        // const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Prescription`;
        // window.open(origin);
        resolve();
      },
      onCatch: (err) => {
        reject(err);
      },
    });
  });
}
