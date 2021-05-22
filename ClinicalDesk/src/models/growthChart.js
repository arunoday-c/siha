import path from "path";
import fs from "fs";
import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import "core-js/stable";
import "regenerator-runtime/runtime";
export async function getPercentiles_OLD(req, res, next) {
  try {
    const { graphType, gender, hims_d_patient_id } = req.query;

    let fileName = "";
    let percentiles = {};
    let querySelector = "";
    switch (graphType) {
      case "length":
        fileName = "lenageinf.csv";
        percentiles = {
          title: `Height per age,${
            gender === "1" ? "boy" : "girl"
          },from 0 - 3 years`,
          sex: `${gender === "1" ? "Male" : "Female"}`,
          unitX: "month",
          unitY: "cm",
          titleX: "Months",
          titleY: "Length (cm)",
          dataType: graphType,
        };
        querySelector = "HEIGHT";
        break;
      case "weight":
        fileName = "wtageinf.csv";
        percentiles = {
          title: `Weight per age,${
            gender === "1" ? "boy" : "girl"
          },from 0 - 3 years`,
          sex: `${gender === "1" ? "Male" : "Female"}`,
          unitX: "month",
          unitY: "kg",
          titleX: "Months",
          titleY: "Weight (kg)",
          dataType: graphType,
        };
        querySelector = "WEIGHT";
        break;
      case "bmi":
        fileName = "bmiagerev.csv";
        percentiles = {
          title: `BMI per age,${
            gender === "1" ? "boy" : "girl"
          },from 0 - 3 years`,
          sex: `${gender === "1" ? "Male" : "Female"}`,
          unitX: "month",
          unitY: "kg",
          titleX: "Months",
          titleY: "Weight (kg)",
          dataType: graphType,
        };
        querySelector = "BMI";
        break;
      case "headCircumference":
        fileName = "hcageinf.csv";
        percentiles = {
          title: `Head Circumference per age,${
            gender === "1" ? "boy" : "girl"
          },from 0 - 3 years`,
          sex: `${gender === "1" ? "Male" : "Female"}`,
          unitX: "month",
          unitY: "cm2",
          titleX: "Months",
          titleY: "Head Circumference (cm2)",
          dataType: graphType,
        };
        querySelector = "HEAD CIRCUMFERENCE";
        break;
    }
    const whoStandard = path.join(process.cwd(), "templates", "who", fileName);
    const _gender = gender;
    if (fs.existsSync(whoStandard)) {
      const rawData = fs.readFileSync(whoStandard, { encoding: "utf-8" });
      const rows = rawData.split("\n");
      let data = [];
      for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].split(",");
        let details = [];
        for (let c = 0; c <= 4; c++) {
          if (columns[0] === _gender) {
            if (c >= 1) details.push(parseFloat(columns[c]));
            if (c === 4) {
              data.push(details);
            }
          } else {
            break;
          }
        }
      }

      const _mysql = new algaehMysql();
      const result = await _mysql.executeQuery({
        query: `select PV.visit_date as date,PV.vital_value as ${graphType} from hims_f_patient_vitals  as PV left join
          hims_d_vitals_header as VH on VH.hims_d_vitals_header_id = PV.vital_id
          where  UPPER(VH.vitals_name) =?
          and PV.patient_id =?
           order by visit_date asc;`,
        values: [querySelector, hims_d_patient_id],
      });

      req["records"] = {
        percentiles: { ...percentiles, data },
        result: result.map((item) => {
          return { ...item, [graphType]: parseFloat(item[graphType]) };
        }),
      };
      next();
    } else {
      next(new Error("No standard percentile exist"));
    }
  } catch (e) {
    next(e);
  }
}
function normsinv(p) {
  // An algorithm with a relative error less than 1.15*10-9 in the entire region.
  // Coefficients in rational approximations
  var a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];

  var b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];

  var c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];

  var d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];

  // Define break-points.
  var plow = 0.02425;
  var phigh = 1 - plow;
  var q;

  // Rational approximation for lower region:
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  // Rational approximation for upper region:
  if (phigh < p) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  // Rational approximation for central region:
  q = p - 0.5;
  var r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}
function floatVal(x, defaultValue) {
  var out = parseFloat(x);
  if (isNaN(out) || !isFinite(out)) {
    out = defaultValue === undefined ? 0 : floatVal(defaultValue);
  }
  return out;
}
export async function getPercentiles(req, res, next) {
  try {
    /**
     * groupType : "0-3 Months / 0-6 Months / 0-2 Years / 0-20 Years"
     */
    const { graphType, gender, dateOfBirth, hims_d_patient_id } = req.query;

    const groupType = graphType;
    const standard = path.join(
      process.cwd(),
      "templates",
      "standard",
      groupType === "0:13W" ? "who.json" : "percentile.json"
    );
    const util_percentiles = [0.05, 0.15, 0.5, 0.85, 0.95];
    const months = moment().diff(dateOfBirth, "months");
    let chartContains = {};
    if (!fs.existsSync(standard)) {
      next(new Error("There is no standard document exist."));
      return;
    }
    const RAW_CDC = JSON.parse(
      fs.readFileSync(standard, { encoding: "utf-8" })
    );

    const CDC = RAW_CDC["CDC"];
    const sex = gender === "1" ? "male" : "female";
    let LENGTH = [];
    let WEIGHT = [];
    let HEADC = [];
    let BMI = [];
    let querySelector = [];
    function filteringData(data, fromAge, toAge) {
      const _FIRST_DATA = _.head(data);
      if (_FIRST_DATA) {
        const _DATA = _FIRST_DATA["data"];
        const _FILTER_AGE = _DATA.filter((f) => {
          if (
            fromAge <= Math.floor(f["Agemos"]) &&
            toAge >= Math.floor(f["Agemos"])
          ) {
            return true;
          }
          return false;
        });
        return _FILTER_AGE.map((item) => {
          return [item.Agemos, item.L, item.M, item.S];
        });
      }
    }
    let percentiles = {
      height: {},
      weight: {},
      bmi: {},
      "head circumference": {},
    };
    let lengthText = "Height";
    let ageOfMonthsFrom = 0,
      ageOfMonthsTo = 13;
    switch (groupType) {
      case "0:6M":
        ageOfMonthsFrom = 0;
        ageOfMonthsTo = 6;
        lengthText = "Length";
        break;
      case "0:2Y":
        ageOfMonthsFrom = 0;
        ageOfMonthsTo = 24;
        lengthText = "Length";
        break;
      case "2:20Y":
        ageOfMonthsFrom = 24;
        ageOfMonthsTo = 240;
        lengthText = "Height";
        break;
      default:
        ageOfMonthsFrom = 0;
        ageOfMonthsTo = 13;
        lengthText = "Length";
        break;
    }
    function findLMSParameters(dataSetInternal, ageMonths) {
      var data = dataSetInternal,
        len = data.length,
        weight,
        i;
      for (i = 0; i < len; i++) {
        if (ageMonths === data[i].Agemos) {
          // When we have an exact match, return it
          return {
            L: data[i].L,
            M: data[i].M,
            S: data[i].S,
          };
        } else if (
          i < len - 1 &&
          ageMonths > data[i].Agemos &&
          ageMonths <= data[i + 1].Agemos
        ) {
          // If we are inbetween data points, extrapolate LMS parameters
          weight =
            (ageMonths - data[i].Agemos) /
            (data[i + 1].Agemos - data[i].Agemos);
          return {
            L: mean(data[i].L, data[i + 1].L, weight),
            M: mean(data[i].M, data[i + 1].M, weight),
            S: mean(data[i].S, data[i + 1].S, weight),
          };
        }
      }
      return null;
    }
    function findXFromZ(Z, dataSetInternal, ageMonths) {
      debugger;
      let params = findLMSParameters(dataSetInternal, ageMonths),
        L,
        M,
        S;
      if (!params) return undefined;
      else {
        L = params.L;
        M = params.M;
        S = params.S;
      }
      console.log("params====>", params);
      if (L !== 0) return M * Math.pow(1 + L * S * Z, 1 / L);
      else return M * Math.exp(S * Z);
    }
    function findXFromPercentile(dataSetInternal, ageOfMonthsTo) {
      debugger;
      for (let a = 0; a < ageOfMonthsTo; a++) {
        for (let i = 0; i < util_percentiles.length; i++) {
          const Z = normsinv(util_percentiles[i]);
          const xValue = findXFromZ(Z, dataSetInternal, a);
          console.log("xValue====>", xValue);
          LENGTH.push(xValue);
        }
      }
    }

    querySelector.push("HEIGHT");
    querySelector.push("WEIGHT");
    const _LENGTH = CDC["LENGTH"].filter((f) => f["chart-gender"] === sex);
    debugger;
    LENGTH = filteringData(_LENGTH, ageOfMonthsFrom, ageOfMonthsTo);
    // findXFromPercentile(_.head(_LENGTH)["data"], ageOfMonthsTo);

    const _WEIGHT = CDC["WEIGHT"].filter((f) => f["chart-gender"] === sex);

    WEIGHT = filteringData(_WEIGHT, ageOfMonthsFrom, ageOfMonthsTo);
    if (ageOfMonthsTo < 24) {
      const _HEADC = CDC["HEADC"].filter((f) => f["chart-gender"] === sex);
      HEADC = filteringData(_HEADC, ageOfMonthsFrom, ageOfMonthsTo);
      querySelector.push("HEAD CIRCUMFERENCE");
      percentiles = {
        height: {
          standard: {
            title: `${lengthText} per age,${
              gender === "1" ? "boy" : "girl"
            },from ${ageOfMonthsFrom} - ${ageOfMonthsTo}`,
            sex: `${gender === "1" ? "Male" : "Female"}`,
            unitX: groupType === "0:13W" ? "weeks" : "months",
            unitY: "cm",
            titleX: groupType === "0:13W" ? "weeks" : "months",
            titleY: `${lengthText}(cm)`,
            dataType: "length",
            data: LENGTH,
          },
        },

        weight: {
          standard: {
            title: `Weight per age,${
              gender === "1" ? "boy" : "girl"
            },from ${ageOfMonthsFrom} - ${ageOfMonthsTo}`,
            sex: `${gender === "1" ? "Male" : "Female"}`,
            unitX: groupType === "0:13W" ? "weeks" : "months",
            unitY: "kg",
            titleX: groupType === "0:13W" ? "Weeks" : "Months",
            titleY: "Weight (kg)",
            dataType: "weight",
            data: WEIGHT,
          },
        },
        headcircumference: {
          standard: {
            title: `Head Circumference per age,${
              gender === "1" ? "boy" : "girl"
            },from ${ageOfMonthsFrom} - ${ageOfMonthsTo}`,
            sex: `${gender === "1" ? "Male" : "Female"}`,
            unitX: "months", //groupType === "0:13W" ? "weeks" : "month",
            unitY: "cm2",
            titleX: "Months", //groupType === "0:13W" ? "weeks" : "Months",
            titleY: "Head Circumference (cm2)",
            dataType: "headcircumference",
            data: HEADC,
          },
        },
      };
    } else if (ageOfMonthsTo > 24) {
      const _BMI = CDC["BMI"].filter((f) => f["chart-gender"] === sex);
      HEADC = filteringData(_BMI, ageOfMonthsFrom, ageOfMonthsTo);
      querySelector.push("BMI");
    }

    const _mysql = new algaehMysql();
    const result = await _mysql.executeQuery({
      query: `select PV.visit_date as date,PV.vital_value,VH.vitals_name from hims_f_patient_vitals  as PV left join
        hims_d_vitals_header as VH on VH.hims_d_vitals_header_id = PV.vital_id
        where  UPPER(VH.vitals_name) in(?)
        and PV.patient_id =?
         order by visit_date asc;`,
      values: [querySelector, hims_d_patient_id],
      printQuery: true,
    });
    _.chain(result)
      .groupBy((g) => g.vitals_name)
      .forEach((detail, key) => {
        const records = _.orderBy(detail, (o) => o.date, "asc");
        if (percentiles[key.toLowerCase().replace(" ", "")]) {
          percentiles[key.toLowerCase().replace(" ", "")]["data"] = records.map(
            (item) => {
              return {
                date: item.date,
                [key.toLowerCase().replace(" ", "") === "height"
                  ? "length"
                  : key.toLowerCase().replace(" ", "")]: parseFloat(
                  item["vital_value"]
                ),
              };
            }
          );
        }
      })
      .value();
    req["records"] = percentiles;
    next();
  } catch (e) {
    next(e);
  }
}
