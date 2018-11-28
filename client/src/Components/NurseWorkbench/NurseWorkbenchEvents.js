import { setGlobal } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";

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
  debugger;
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

const BMICalculation = (weight, height, calculation) => {
  if (height === "") return "";
  let BMI = 0;
  weight = typeof weight === "string" ? parseFloat(weight) : weight;
  height = typeof height === "string" ? parseFloat(height) : height;
  eval(calculation);
  return (BMI = typeof BMI === "number" ? BMI.toFixed(3) : BMI);
};

const getFormula = options => {
  debugger;
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

export {
  getAllChiefComplaints,
  getPatientChiefComplaints,
  getDepartmentVitals,
  temperatureConvertion,
  getFormula,
  BMICalculation
};
