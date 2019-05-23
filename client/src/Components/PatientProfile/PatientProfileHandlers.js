import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../utils/algaehApiCall";

const getPatientProfile = $this => {
  $this.props.getPatientProfile({
    uri: "/doctorsWorkBench/getPatientProfile",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    cancelRequestId: "getPatientProfile",
    redux: {
      type: "PATIENT_PROFILE",
      mappingName: "patient_profile"
    },
    afterSuccess: data => {
      debugger;
    }
  });
};

const getPatientVitals = $this => {
  $this.props.getPatientVitals({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
    cancelRequestId: "getPatientVitals",
    data: {
      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"]
    },
    redux: {
      type: "PATIENT_VITALS",
      mappingName: "patient_vitals"
    }
  });
};

const getPatientAllergies = ($this, noFunctionCall) => {
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"]
    },
    cancelRequestId: "getPatientAllergies",
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patient_allergies"
    },
    afterSuccess: data => {
      if (noFunctionCall === undefined) {
        let _allergies = Enumerable.from(data)
          .groupBy("$.allergy_type", null, (k, g) => {
            return {
              allergy_type: k,
              allergy_type_desc:
                k === "F"
                  ? "Food"
                  : k === "A"
                  ? "Airborne"
                  : k === "AI"
                  ? "Animal  &  Insect"
                  : k === "C"
                  ? "Chemical & Others"
                  : "",
              allergyList: g.getSource()
            };
          })
          .toArray();
        $this.setState({ patientAllergies: _allergies });
      }
    }
  });
};

const getPatientDiet = $this => {
  $this.props.getPatientDiet({
    uri: "/doctorsWorkBench/getPatientDiet",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    cancelRequestId: "getPatientDiet",
    redux: {
      type: "PATIENT_DIET",
      mappingName: "patient_diet"
    }
  });
};
const getPatientDiagnosis = ($this, isProcess) => {
  $this.props.getPatientDiagnosis({
    uri: "/doctorsWorkBench/getPatientDiagnosis",
    method: "GET",
    cancelRequestId: "getPatientDiagnosis",
    data: {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"]
    },
    redux: {
      type: "PATIENT_DIAGNOSIS",
      mappingName: "patient_diagnosis"
    },
    afterSuccess: data => {
      if (isProcess) {
        // let finalICDS = Enumerable.from(data)
        // .where(w => w.final_daignosis === "Y")
        // .toArray();

        $this.setState({
          // InitialICDS: data,
          // finalICDS: finalICDS,
          showInitialDiagnosisLoader: false,
          showFinalDiagnosisLoader: false
        });
      }
    }
  });
};

const getPatientHistory = $this => {
  $this.props.getPatientHistory({
    uri: "/doctorsWorkBench/getPatientHistory",
    method: "GET",
    cancelRequestId: "getPatientHistory",
    data: {
      patient_id: Window.global["current_patient"]
    },
    redux: {
      type: "PATIENT_HISTORY",
      mappingName: "patient_history"
    }
  });
};

const printPrescription = (that, e) => {
  debugger;
  const _patient = Window.global["current_patient"];
  const _visit = Window.global["visit_id"];
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "prescription",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: _patient
          },
          {
            name: "visit_id",
            value: _visit
          },
          {
            name: "visit_code",
            value: null
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Prescription";
    }
  });
};

export {
  getPatientVitals,
  getPatientProfile,
  getPatientAllergies,
  getPatientDiet,
  getPatientDiagnosis,
  getPatientHistory,
  printPrescription
};
