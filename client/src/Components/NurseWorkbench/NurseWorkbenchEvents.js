import { setGlobal } from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";
import moment from "moment";
import Enumerable from "linq";

const getPatientAllergies = $this => {
  $this.props.getPatientAllergies({
    uri: "/doctorsWorkBench/getPatientAllergies",
    method: "GET",
    data: {
      patient_id: $this.state.patient_id
    },
    cancelRequestId: "getPatientAllergies",
    redux: {
      type: "PATIENT_ALLERGIES",
      mappingName: "patient_allergies"
    },
    afterSuccess: data => {
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
      $this.setState({
        patientAllergies: _allergies,
        allPatientAllergies: data
      });
    }
  });
};

const texthandle = ($this, data, ctrl, e) => {
  debugger;
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let allAllergies = $this.state.allAllergies;
  data[name] = value;
  for (let i = 0; i < allAllergies.length; i++) {
    if (allAllergies[i].severity === data.severity) {
      allAllergies[i] = data;
    }
  }

  $this.setState({
    allAllergies: allAllergies
  });
};

const getAllChiefComplaints = ($this, callBack) => {
  $this.props.getAllChiefComplaints({
    uri: "/doctorsWorkBench/getChiefComplaints",
    method: "GET",
    cancelRequestId: "getChiefComplaints1",
    redux: {
      type: "ALL_CHIEF_COMPLAINTS",
      mappingName: "allchiefcomplaints"
    },
    afterSuccess: data => {
      if (typeof callBack === "function") callBack(data);
    }
  });
};

const getPatientChiefComplaints = $this => {
  $this.props.getPatientChiefComplaints({
    uri: "/nurseWorkBench/getPatientNurseChiefComplaints",
    data: {
      episode_id: $this.state.episode_id
    },
    method: "GET",
    cancelRequestId: "getPatientChiefComplaints1",
    redux: {
      type: "PATIENT_CHIEF_COMPLAINTS",
      mappingName: "patient_chief_complaints"
    }
  });
};

const getDepartmentVitals = $this => {
  $this.props.getDepartmentVitals({
    uri: "/doctorsWorkBench/getVitalsHeaderMaster",
    method: "GET",
    cancelRequestId: "getVitalsHeaderMaster",
    redux: {
      type: "DEPARTMENT_VITALS",
      mappingName: "department_vitals"
    }
  });
};

const temperatureConvertion = (temprature, tofarenheat = "C") => {
  if (temprature === undefined || temprature === "") {
    return "";
  }
  temprature = parseFloat(temprature);
  if (typeof temprature !== "number") {
    return "";
  }
  if (tofarenheat === "C") return (temprature * 9) / 5 + 32;
  else return (temprature - 32) * (5 / 9);
};

const datehandle = ($this, ctrl, e) => {
  if (Date.parse(new Date()) < Date.parse(moment(ctrl)._d)) {
    swalMessage({
      title: "Cannot be grater than Today's Date.",
      type: "warning"
    });
    return;
  }

  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const BMICalculation = (weight, height, calculation) => {
  if (height === "" || height === undefined) return "";
  let BMI = 0;
  weight = typeof weight === "string" ? parseFloat(weight) : weight;
  height = typeof height === "string" ? parseFloat(height) : height;
  calculation =
    calculation === undefined || calculation === ""
      ? "const _heightM = (height*height)/100; BMI=  (weight/_heightM*100)"
      : calculation;
  eval(calculation);
  return (BMI = typeof BMI === "number" ? BMI.toFixed(2) : BMI);
};

const getFormula = options => {
  if (options === undefined) return;

  if (Window.global === undefined) {
    const _input = config.algaeh_d_formulas.BMI;
    algaehApiCall({
      uri: "/masters/algaehFormula",
      method: "get",
      data: _input,
      onSuccess: response => {
        if (response.data.success) {
          const _function = JSON.parse(response.data.records.formula);
          setGlobal({
            BMI: _function["BMI-" + options.WEIGHTAS + "-" + options.HEIGHTAS]
          });

          if (typeof options.onSuccess === "function")
            options.onSuccess(
              BMICalculation(
                options.WEIGHT,
                options.HEIGHT,
                _function["BMI-" + options.WEIGHTAS + "-" + options.HEIGHTAS]
              )
            );
        }
      }
    });
  } else {
    if (typeof options.onSuccess === "function")
      options.onSuccess(
        BMICalculation(options.WEIGHT, options.HEIGHT, Window.global["BMI"])
      );
  }
};

const getAllAllergies = ($this, callBack) => {
  $this.props.getAllAllergies({
    uri: "/doctorsWorkBench/getAllAllergies",
    method: "GET",
    cancelRequestId: "getAllAllergies",
    data: {
      allergy_type: "ALL"
    },
    redux: {
      type: "ALL_ALLERGIES",
      mappingName: "allallergies"
    },
    afterSuccess: data => {
      if (typeof callBack === "function") callBack(data);
    }
  });
};

export {
  getAllChiefComplaints,
  getPatientChiefComplaints,
  getDepartmentVitals,
  temperatureConvertion,
  getFormula,
  BMICalculation,
  datehandle,
  getPatientAllergies,
  texthandle,
  getAllAllergies
};
