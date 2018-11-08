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
    BMICalculation(options.WEIGHT, options.HEIGHT, Window.global["BMI"]);
  }
};
const BMICalculation = (weight, height, calculation) => {
  let BMI = 0;
  eval(calculation);
  return BMI;
};

export { getVitalHistory, getFormula };
