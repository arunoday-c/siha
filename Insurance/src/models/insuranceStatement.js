import fs from "fs";
import algaehMysql from "algaeh-mysql";
import path from "path";
import _, { includes } from "lodash";
import moment from "moment";
import "regenerator-runtime/runtime";
import Excel from "exceljs/dist/es5";
// import metaData from "../../insurance_templates/metadata.json";
export async function generateInsuranceStatement(req, res, next) {
  let metaData = {};
  const metadataPath = path.join(
    process.cwd(),
    "insurance_templates",
    "metadata.json"
  );
  // console.log("metadataPath==", metadataPath);
  if (!fs.existsSync(metadataPath)) {
    next(new Error("Metadata is not configured"));
    return;
  } else {
    const _metaDataRaw = fs.readFileSync(metadataPath, { encoding: "utf-8" });
    metaData = JSON.parse(_metaDataRaw);
  }
  const { insurance_statement_id } = req.query;
  const _mysql = new algaehMysql();
  try {
    // const {hospital_address,hospital_name,arabic_hospital_name,tax_number,business_registration_number}
    const identity = req.userIdentity;
    const decimal_places = identity.decimal_places;
    const currency_symbol = identity.currency_symbol;
    const { common, ...rest } = metaData;
    //MAX(ins.updated_date)as update_date,
    //inner join hims_f_insurance_statement as ins on ins.insurance_provider_id  =ih.insurance_provider_id
    const filesList = fs
      .readdirSync(path.join(process.cwd(), "insurance_templates"))
      .filter((f) => f.includes(".xl"));
    //p.patient_code,p.full_name,
    _mysql
      .executeQuery({
        query: `  select  MAX(p.patient_code) as patient_code,MAX(p.full_name)as full_name,ih.invoice_number,micd.icd_description,st.service_type,MAX(isb.insurance_sub_name)as file_name,
        SUM(id.net_amount) as net_amount,SUM(id.gross_amount) as gross_amount,
        ih.visit_id,CONCAT(MAX(t.title),". ",MAX(e.full_name)) as doctor_name,MAX(e.license_number) as license_number,
        MAX(ih.card_number) as card_number,MAX(ih.policy_number) as policy_number,
        MAX(DATE(v.visit_date)) as visit_date,
        SUM(ih.company_resp) as company_resp,
        SUM(ih.company_tax) as company_tax_amount,
        ROUND(COALESCE((SUM(ih.company_tax) / SUM(ih.company_resp))*100,0),2) as comp_tax_percent,
         SUM(ih.company_payable) as company_payable,SUM(ih.patient_payable) as patient_payable,
         MAX(ins.to_date) as to_date ,MAX(ins.from_date) as from_date,MAX(isb.ins_template_name) as ins_template_name,
         case when isb.eng_address is NULL then '' else eng_address end as eng_address,ins.insurance_statement_number
        from hims_f_invoice_header as ih inner join hims_f_invoice_details as id
        on ih.hims_f_invoice_header_id  = id.invoice_header_id
        left join hims_f_invoice_icd as icd on icd.invoice_header_id  = ih.hims_f_invoice_header_id
        left join hims_d_icd as micd
        on micd.hims_d_icd_id = icd.daignosis_id   inner join hims_d_service_type as st  on
        st.hims_d_service_type_id  = id.service_type_id
        inner join hims_d_insurance_sub as isb on isb.hims_d_insurance_sub_id = ih.sub_insurance_id
        and ih.insurance_provider_id  =isb.insurance_provider_id
        inner join hims_f_patient as p on p.hims_d_patient_id = ih.patient_id
        inner join hims_f_patient_visit as v on ih.visit_id = v.hims_f_patient_visit_id
        inner join hims_d_employee as e on v.doctor_id = e.hims_d_employee_id
        left join hims_d_title as t on  e.title_id  = t.his_d_title_id
        inner join hims_f_insurance_statement as ins on ins.hims_f_insurance_statement_id = ih.insurance_statement_id  or 
        ins.hims_f_insurance_statement_id = ih.insurance_statement_id_2 or ins.hims_f_insurance_statement_id  = ih.insurance_statement_id_3
        where (ih.insurance_statement_id =? or ih.insurance_statement_id_2=? or ih.insurance_statement_id_3=?)
         and (icd.hims_f_invoice_icd_id is null or icd.diagnosis_type ='p' )
        group by ih.invoice_number,micd.icd_description,st.service_type,ih.visit_id ;`,
        values: [
          insurance_statement_id,
          insurance_statement_id,
          insurance_statement_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        if (result.length === 0) {
          next(new Error("No records founds"));
          return;
        }
        // console.log("result===>", result[0]);
        let insurance = [];
        let slno = 1;
        const ins_template_name =
          result.length > 0 ? result[0]["ins_template_name"] : "";
        // const fileName = result.length > 0 ? result[0]["file_name"] : "";
        const from_date = result.length > 0 ? result[0]["from_date"] : "";
        const to_date = result.length > 0 ? result[0]["to_date"] : "";
        // console.log("ins_template_name====>", rest, ins_template_name);
        const requireMetaData = rest[ins_template_name]; //fileName.toLowerCase().replace(/ /g, "")];
        // console.log("requireMetaData====>", requireMetaData);
        const { combineservices, filename, aggregations } = requireMetaData;
        const fileName = filename;
        const fileName1 = result.length > 0 ? result[0]["file_name"] : "";
        const insurance_statement_number1 =
          result.length > 0 ? result[0]["insurance_statement_number"] : "";
        const eng_address1 = result.length > 0 ? result[0]["eng_address"] : "";
        // const fileName1 = result.length > 0 ? result[0]["file_name"] : "";
        _.chain(result)
          .groupBy((g) => g.visit_id)
          .forEach((patients, idx) => {
            _.chain(patients)
              .groupBy((g) => g.invoice_number) //icd_description
              .forEach((items, key) => {
                //{ full_name, invoice_number, patient_code }
                const firstRecords = _.head(items);

                let patObj = {
                  ...firstRecords,
                  sl_no: slno,
                  icd_description: firstRecords["icd_description"], // key === "null" ? undefined : key,
                  company_resp: _.sumBy(items, (s) =>
                    parseFloat(s.company_resp)
                  ).toFixed(decimal_places),
                  company_tax_amount: _.sumBy(items, (s) =>
                    parseFloat(s.company_tax_amount)
                  ).toFixed(decimal_places),
                  comp_tax_percent: _.sumBy(items, (s) =>
                    parseFloat(s.comp_tax_percent)
                  ).toFixed(decimal_places),
                  company_payable: _.sumBy(items, (s) =>
                    parseFloat(s.company_payable)
                  ).toFixed(decimal_places),
                  net_amount: _.sumBy(items, (s) =>
                    parseFloat(s.net_amount)
                  ).toFixed(decimal_places),
                  gross_amount: _.sumBy(items, (s) =>
                    parseFloat(s.gross_amount)
                  ).toFixed(decimal_places),
                  patient_payable: _.sumBy(items, (s) =>
                    parseFloat(s.patient_payable)
                  ).toFixed(decimal_places),
                };

                _.chain(items)
                  .groupBy((g) => g.service_type)
                  .forEach((service, sKey) => {
                    const amountSum = _.sumBy(service, (s) =>
                      parseFloat(s.company_payable)
                    ).toFixed(decimal_places);

                    if (combineservices) {
                      const appendName = combineservices?.service_type?.name;
                      if (patObj[appendName]) {
                        patObj[appendName] += `${
                          combineservices?.service_type?.delimiter ?? ","
                        }${sKey}`;
                      } else {
                        patObj[appendName] = sKey;
                        // console.log(
                        //   "patObj[appendName]====>",
                        //   patObj[appendName]
                        // );
                      }
                    } else {
                      patObj[sKey.toLowerCase()] = amountSum;
                    }
                  })
                  .value();
                slno = slno + 1;
                insurance.push(patObj);
              })
              .value();
          })
          .value();

        if (requireMetaData) {
          const filePath = filesList.find((f) =>
            f.toLowerCase().includes(fileName.toLowerCase())
          );
          if (filePath) {
            const completeXlsPath = path.join(
              process.cwd(),
              "insurance_templates",
              filePath
            );

            /**  For calculating aggregations */
            let aggregate = undefined;
            if (aggregations) {
              aggregate = {};
              Object.keys(aggregations).forEach((item) => {
                switch (item) {
                  case "SUM":
                    if (Array.isArray(aggregations[item])) {
                      aggregations[item].forEach((agg) => {
                        aggregate["#" + agg] = _.sumBy(insurance, (s) =>
                          parseFloat(s[agg])
                        ).toFixed(decimal_places);
                      });
                    }

                    break;
                }
              });
            }

            const workbook = new Excel.Workbook();

            (async () => {
              await workbook.xlsx.readFile(completeXlsPath);
              let workSheet = 1;
              workbook.eachSheet(function (worksheet, sheetId) {
                workSheet = sheetId;
                return;
              });
              const worksheet = workbook.getWorksheet(workSheet);
              let _lastRow = 0;
              const clinincNameMapping =
                identity[common["#CLINICNAME"]["mapping"]];
              const companyNameMapping = common["#COMPANYNAME"]["mapping"];
              const companyAddressMapping = common["#INSADDRESS"]["mapping"];
              const statementNoMapping = common["#STATEMENTNO"]["mapping"];
              const date_format = common["#FDATE"]["format"]
                ? common["#FDATE"]["format"]
                : "DD-MM-YYYY";
              const currentFDate = common["#FDATE"]
                ? moment(from_date).format(date_format)
                : "";
              const currentTDate = common["#TDATE"]
                ? moment(to_date).format(date_format)
                : "";

              worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                row.eachCell((cell) => {
                  if (typeof cell.value === "string") {
                    cell.value = String(cell.value)
                      .replace("#CLINICNAME", clinincNameMapping)
                      .replace("#COMPANYNAME", fileName1)
                      .replace("#INSADDRESS", eng_address1)
                      .replace("#STATEMENTNO", insurance_statement_number1)
                      .replace("#FDATE", currentFDate)
                      .replace("#TDATE", currentTDate);
                    if (aggregate) {
                      Object.keys(aggregate).forEach((itm) => {
                        cell.value = String(cell.value).replace(
                          itm,
                          aggregate[itm]
                        );
                      });
                    }
                  }
                });

                _lastRow = rowNumber;
              });

              const columns = requireMetaData["columns"];
              const columnStart = requireMetaData["column_starts"]
                ? requireMetaData["column_starts"]
                : 0;
              // console.log("Last row", _lastRow);
              insurance.forEach((row, index) => {
                let cols = [];
                for (let i = 0; i < columnStart; i++) {
                  cols.push(undefined);
                }
                columns.forEach((column) => {
                  const { mapping } = column;

                  cols.push(
                    row[mapping.toLowerCase()] !== null
                      ? row[mapping.toLowerCase()]
                      : ""
                  );
                });
                worksheet.insertRow(_lastRow + index + 1, cols);
                // worksheet.getRow(_lastRow + index + 1).font = { size: 18 };
              });

              res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              );
              res.setHeader(
                "Content-Disposition",
                `attachment; filename=${fileName}${new Date()}-${new Date()}.xlsx`
              );
              await workbook.xlsx.write(res).then(function () {
                res.end();
              });
            })();
          } else {
            next(new Error("No template for " + fileName));
          }
        } else {
          next(new Error("No metadata found for " + fileName.toLowerCase()));
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
