import Excel from "exceljs/modern.browser";
import _ from "lodash";
import algaehMysql from "algaeh-mysql";
import path from "path";
import moment from "moment";
export function generateExcelDilyTrans(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    console.log("req.query", req.query);
    const { date } = req.query;

    _mysql
      .executeQuery({
        query: `select P.hims_d_patient_id ,P.patient_code,CONCAT(T.title,". ",P.full_name) pat_name ,CONCAT(T.arabic_title ,". ",P.arabic_name) pat_arabic_name,
        BH.bill_date,BH.bill_number,E.hims_d_employee_id ,BH.hims_f_billing_header_id ,CONCAT(T.title,". ",E.full_name)  as emp_name ,
       CONCAT(T.arabic_title,". ",E.arabic_name)  as emp_arabic_name ,
        E.employee_code ,BH.bill_number as bill_invoice,V.insured,BH.hims_f_billing_header_id,BD.service_type_id,ST.service_type ,ST.arabic_service_type,
        S.arabic_service_name,S.service_name,if(S.procedure_type ='GN','General','Dental') as procedure_type,
        BD.hims_f_billing_details_id ,BD.quantity,BD.net_amout ,BD.company_payble,BD.patient_payable,BD.discount_amout,IP.insurance_provider_name,
        IP.arabic_provider_name
        from hims_f_patient as P inner join hims_f_patient_visit as V on P.hims_d_patient_id = V.patient_id
        inner join hims_f_billing_header as BH on V.hims_f_patient_visit_id  = BH.visit_id  and V.patient_id = BH.patient_id
        and BH.cancelled ='N'
        inner join hims_f_billing_details as BD on BH.hims_f_billing_header_id = BD.hims_f_billing_header_id
        left join hims_d_employee as E on V.doctor_id  = E.hims_d_employee_id
        left join hims_d_title as T  on P.title_id =T.his_d_title_id  or E.title_id = T.title
        left join hims_d_service_type as ST on ST.hims_d_service_type_id  = BD.service_type_id
        left join hims_d_services as S on S.hims_d_services_id  = BD.services_id
        left join hims_m_patient_insurance_mapping as PIM on V.patient_id  = PIM.patient_id  and V.hims_f_patient_visit_id =PIM.patient_visit_id 
        left join hims_d_insurance_provider as IP on PIM.primary_insurance_provider_id  = IP.hims_d_insurance_provider_id 
        where
         date(BH.bill_date)=date(?);select hims_d_service_type_id,service_type from hims_d_service_type where record_status='A';`,
        values: [date],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        const dailyResult = result[0];
        const servceTypes = result[1];
        const dailyCollect = _.chain(dailyResult)
          .groupBy((g) => g.hims_d_employee_id)
          .map((doctors) => {
            const { employee_code, emp_name, emp_arabic_name } = _.first(
              doctors
            );
            const patientDetails = _.chain(doctors)
              .groupBy((g) => g.hims_d_patient_id)
              .map((patients, dKeys) => {
                const { patient_code, pat_name, pat_arabic_name } = _.first(
                  patients
                );
                return {
                  patient_code,
                  pat_name,
                  pat_arabic_name,
                  details: patients,
                };
              })
              .value();
            return {
              employee_code,
              emp_name,
              emp_arabic_name,
              patients: patientDetails,
            };
          })
          .value();
        let workbook = new Excel.Workbook();
        workbook.creator = "Algaeh technologies private limited";
        workbook.created = new Date();
        workbook.modified = new Date();
        var worksheet = workbook.addWorksheet("Daily Transaction", {
          properties: { tabColor: { argb: "FFC0000" } },
        });
        let generalColumns = [
          { header: "SlNo.", key: "slno" },
          { header: "Patient Code", key: "patient_code" },
          { header: "Patient Name", key: "pat_name" },
          { header: "Invoice Time", key: "bill_time" },
          { header: "Cash Invoice No.", key: "csh_bill_invoice" },
          { header: "Credit Invoice No.", key: "crd_bill_invoice" },
          { header: "Amount", key: "net_amout" },
        ];

        for (let i = 0; i < servceTypes.length; i++) {
          generalColumns.push(
            {
              header: servceTypes[i]["service_type"],
              key: servceTypes[i]["hims_d_service_type_id"] + "_amount",
            },
            {
              header: servceTypes[i]["service_type"] + " Discount",
              key: servceTypes[i]["hims_d_service_type_id"] + "_desc_amount",
            }
          );
        }
        worksheet.columns = generalColumns;
        let counter = 1;
        for (let e = 0; e < dailyCollect.length; e++) {
          const { employee_code, emp_name, patients } = dailyCollect[e];
          worksheet.addRow({ slno: `${emp_name}/${employee_code}` });

          for (let p = 0; p < patients.length; p++) {
            const { patient_code, pat_name, insured, details } = patients[p];
            _.chain(details)
              .groupBy((g) => g.hims_f_billing_header_id)
              .forEach((billGroup) => {
                const { bill_invoice, bill_date } = _.head(billGroup);
                let serviceObject = {};
                _.chain(billGroup)
                  .groupBy((g) => g.service_type_id)
                  .forEach((services, sKey) => {
                    serviceObject = {
                      [sKey + "_amount"]: _.sumBy(services, (s) =>
                        parseFloat(s.net_amout)
                      ),
                      [sKey + "_desc_amount"]: _.sumBy(services, (s) =>
                        parseFloat(s.discount_amout)
                      ),
                    };
                  })
                  .value();

                worksheet.addRow({
                  slno: counter,
                  patient_code,
                  pat_name,
                  [insured === "Y"
                    ? "crd_bill_invoice"
                    : "csh_bill_invoice"]: bill_invoice,
                  bill_time: moment(bill_date).format("hh:mm:ss"),
                  net_amout: _.sumBy(billGroup, (s) => {
                    return insured === "Y"
                      ? parseFloat(s.company_payble)
                      : parseFloat(s.patient_payable);
                  }),
                  ...serviceObject,
                });
                counter++;
              })
              .value();
          }
        }

        // const excelpath = path.join(process.cwd(), "sample.xlsx");
        // console.log("excelpath", excelpath);
        // workbook.xlsx.writeFile(excelpath);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + "DailyTransaction.xlsx"
        );
        workbook.xlsx.write(res).then(function (data) {
          res.end();
          console.log("File write done........");
        });
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
