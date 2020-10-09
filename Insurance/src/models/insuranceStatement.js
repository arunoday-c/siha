import fs from "fs";
import algaehMysql from "algaeh-mysql";
import path from "path";
import _, { includes } from "lodash";
import moment from "moment";
import "regenerator-runtime/runtime";
import Excel from "exceljs/dist/es5";
import metaData from "../../insurance_templates/metadata.json";
export async function generateInsuranceStatement(req, res, next) {
  const { insurance_statement_id } = req.query;
  const _mysql = new algaehMysql();
  try {
    // const {hospital_address,hospital_name,arabic_hospital_name,tax_number,business_registration_number}
    const identity = req.userIdentity;
    const { common, ...rest } = metaData;
    const filesList = fs
      .readdirSync(path.join(process.cwd(), "insurance_templates"))
      .filter((f) => f.includes(".xl"));
    _mysql
      .executeQuery({
        query: `  select p.patient_code,p.full_name,ih.invoice_number,micd.icd_description,st.service_type,MAX(isb.insurance_sub_name)as file_name,
        SUM(id.net_amount) as net_amount,SUM(id.gross_amount) as gross_amount,SUM(id.company_payable) as company_payable,MAX(ins.updated_date)as update_date
        from hims_f_invoice_header as ih inner join hims_f_invoice_details as id 
        on ih.hims_f_invoice_header_id  = id.invoice_header_id 
        left join hims_f_invoice_icd as icd on icd.invoice_header_id  = ih.hims_f_invoice_header_id left join hims_d_icd as micd 
        on micd.hims_d_icd_id = icd.daignosis_id inner join hims_d_service_type as st  on
        st.hims_d_service_type_id  = id.service_type_id
        inner join hims_d_insurance_sub as isb on isb.hims_d_insurance_sub_id = ih.sub_insurance_id 
        and ih.insurance_provider_id  =isb.insurance_provider_id 
        inner join hims_f_patient as p on p.hims_d_patient_id = ih.patient_id 
        inner join hims_f_insurance_statement as ins on ins.insurance_provider_id  =ih.insurance_provider_id 
         where (ih.insurance_statement_id =? or ih.insurance_statement_id_2=? or ih.insurance_statement_id_3=?)
        group by p.patient_code,p.full_name,ih.invoice_number,micd.icd_description,st.service_type;`,
        values: [
          insurance_statement_id,
          insurance_statement_id,
          insurance_statement_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        let insurance = [];
        let slno = 1;
        const fileName = result.length > 0 ? result[0]["file_name"] : "";
        const update_date = result.length > 0 ? result[0]["update_date"] : "";
        _.chain(result)
          .groupBy((g) => g.patient_code)
          .forEach((patients, idx) => {
            _.chain(patients)
              .groupBy((g) => g.icd_description)
              .forEach((items, key) => {
                const { full_name, invoice_number } = _.head(items);
                let patObj = {
                  patient_code: idx,
                  sl_no: slno,
                  icd_description: key === "null" ? undefined : key,
                  full_name: full_name,
                  invoice_number,
                  net_amount: _.sumBy(items, (s) => parseFloat(s.net_amount)),
                  gross_amount: _.sumBy(items, (s) =>
                    parseFloat(s.gross_amount)
                  ),
                };
                _.chain(items)
                  .groupBy((g) => g.service_type)
                  .forEach((service, sKey) => {
                    patObj[sKey.toLowerCase()] = _.sumBy(service, (s) =>
                      parseFloat(s.company_payable)
                    );
                  })
                  .value();
                slno = slno + 1;
                insurance.push(patObj);
              })
              .value();
          })
          .value();

        const requireMetaData = rest[fileName.toLowerCase()];
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
            const workbook = new Excel.Workbook();
            (async () => {
              await workbook.xlsx.readFile(completeXlsPath);
              const worksheet = workbook.getWorksheet("Sheet1");
              let _lastRow = 0;
              const clinincNameMapping =
                identity[common["#CLINICNAME"]["mapping"]];
              const date_format = common["#FDATE"]["format"]
                ? common["#FDATE"]["format"]
                : "DD-MM-YYYY";
              const currentFDate = common["#FDATE"]
                ? moment(update_date).format(date_format)
                : "";
              const currentTDate = common["#TDATE"]
                ? moment(update_date).format(date_format)
                : "";
              worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                row.eachCell((cell) => {
                  if (typeof cell.value === "string") {
                    cell.value = String(cell.value)
                      .replace("#CLINICNAME", clinincNameMapping)
                      .replace("#FDATE", currentFDate)
                      .replace("#TDATE", currentTDate);
                  }
                });

                _lastRow = rowNumber;
              });

              const columns = requireMetaData["columns"];
              const columnStart = requireMetaData["column_starts"]
                ? requireMetaData["column_starts"]
                : 0;

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
              });

              res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              );
              res.setHeader(
                "Content-Disposition",
                `attachment; filename=${fileName}${update_date}-${update_date}.xlsx`
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
