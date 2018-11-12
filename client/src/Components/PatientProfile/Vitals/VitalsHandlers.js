import { setGlobal } from "../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import config from "../../../utils/config.json";
const getVitalHistory = $this => {
  $this.props.getVitalHistory({
    uri: "/doctorsWorkBench/getPatientVitals",
    method: "GET",
    data: {
      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"]
    },
    cancelRequestId: "getPatientVitals",
    redux: {
      type: "PATIENT_VITALS",
      mappingName: "patient_vitals"
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

const getFormula = options => {
  if (options === undefined) return;

  if (Window.global["BMI"] === undefined) {
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
const BMICalculation = (weight, height, calculation) => {
  if (height === "") return "";
  let BMI = 0;
  weight = typeof weight === "string" ? parseFloat(weight) : weight;
  height = typeof height === "string" ? parseFloat(height) : height;
  eval(calculation);
  return (BMI = typeof BMI === "number" ? BMI.toFixed(3) : BMI);
};
const temperatureConvertion = (temprature, tofarenheat = true) => {
  if (temprature === "") {
    return "";
  }
  if (tofarenheat) return (temprature * 9) / 5 + 32;
  else return (temprature - 32) * (5 / 9);
};

export {
  getVitalHistory,
  getFormula,
  temperatureConvertion,
  getDepartmentVitals
};
