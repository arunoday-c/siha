import path from "path";
import fs from "fs";
import algaehMysql from "algaeh-mysql";
import "core-js/stable";
import "regenerator-runtime/runtime";
export async function getPercentiles(req, res, next) {
  try {
    debugger;
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
