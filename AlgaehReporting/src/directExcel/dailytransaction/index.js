import Excel from "exceljs/modern.browser";
import _ from "lodash";
import algaehMysql from "algaeh-mysql";
import path from "path";
import moment from "moment";
export function generateExcelDilyTrans(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    // console.log("req.query", req.query);
    const { date } = req.query;

    _mysql
      .executeQuery({
        query: `select P.hims_d_patient_id ,P.patient_code,CONCAT(T.title,". ",P.full_name) pat_name ,CONCAT(T.arabic_title ,". ",P.arabic_name) pat_arabic_name,
        BH.bill_date,BH.bill_number,E.hims_d_employee_id ,BH.hims_f_billing_header_id ,CONCAT(T.title,". ",E.full_name)  as emp_name ,
       CONCAT(T.arabic_title,". ",E.arabic_name)  as emp_arabic_name ,
        E.employee_code ,BH.bill_number as bill_invoice,V.insured,BH.hims_f_billing_header_id,BD.service_type_id,ST.service_type ,ST.arabic_service_type,
        S.arabic_service_name,S.service_name,if(S.procedure_type ='GN','General','Dental') as procedure_type,
        BD.hims_f_billing_details_id ,BD.quantity,BD.net_amout ,BD.company_payble,BD.patient_payable,BD.discount_amout,IP.insurance_provider_name,
        IP.arabic_provider_name,COALESCE(BH.advance_amount,0)as advance_amount,COALESCE(BH.advance_adjust,0) as advance_adjust,case BD.service_type_id when 1 then 'Y' else 'N'  end new_visit_patient,
        RD.amount as receipt_amount,RD.pay_type
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
        left join hims_f_receipt_header as RH on BH.receipt_header_id  = RH.hims_f_receipt_header_id left join hims_f_receipt_details as RD 
        on RH.hims_f_receipt_header_id  = RD.hims_f_receipt_header_id 
        where
         date(BH.bill_date)=date(?);select hims_d_service_type_id,service_type from hims_d_service_type where record_status='A' and hims_d_service_type_id not in(3,6,8,9,10,12,13);`,
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
          { header: "SlNo.", key: "slno", width: 7, bold: true },
          {
            header: "Patient Code",
            key: "patient_code",
            width: 20,
            bold: true,
          },
          { header: "Patient Name", key: "pat_name", width: 30, bold: true },
          {
            header: "Billing Type",
            key: "billing_type",
            width: 20,
            bold: true,
          },
          { header: "Invoice Time", key: "bill_time", width: 15, bold: true },
          {
            header: "Cash Invoice No.",
            key: "csh_bill_invoice",
            width: 20,
            bold: true,
          },
          {
            header: "Credit Invoice No.",
            key: "crd_bill_invoice",
            width: 20,
            bold: true,
          },
          {
            header: "Patient Amount",
            key: "patient_amount",
            width: 15,
            bold: true,
          },
          {
            header: "Insurance Amount",
            key: "insurance_amount",
            width: 15,
            bold: true,
          },
          {
            header: "Cash Amount",
            key: "cash_amount",
            width: 15,
            bold: true,
          },
          {
            header: "Card Amount",
            key: "card_amount",
            width: 15,
            bold: true,
          },
          // {
          //   header: "Cheque Amount",
          //   key: "cheque_amount",
          //   width: 15,
          //   bold: true,
          // },
        ];

        for (let i = 0; i < servceTypes.length; i++) {
          generalColumns.push(
            {
              header: servceTypes[i]["service_type"],
              key: servceTypes[i]["hims_d_service_type_id"] + "_amount",
              bold: true,
              width: 18,
            },
            {
              header: servceTypes[i]["service_type"] + " Discount",
              key: servceTypes[i]["hims_d_service_type_id"] + "_desc_amount",
              bold: true,
              width: 18,
            }
          );
        }
        generalColumns.push({
          header: "Advance",
          key: "advance_amount",
          width: 18,
        });
        generalColumns.push({
          header: "Advance Adjust",
          key: "advance_adjust",
          bold: true,
          width: 18,
        });
        generalColumns.push({
          header: "New Visit",
          key: "new_visit",
          bold: true,
          width: 18,
        });
        generalColumns.push({
          header: "Follow Up Visit",
          key: "followup_visit",
          bold: true,
          width: 18,
        });
        worksheet.columns = generalColumns;
        let lastRow = worksheet.rowCount;
        //console.log("lastRow", lastRow);

        let counter = 1;
        for (let e = 0; e < dailyCollect.length; e++) {
          const { employee_code, emp_name, patients } = dailyCollect[e];
          worksheet.addRow({ slno: `${emp_name}/${employee_code}` });
          lastRow = worksheet.rowCount;
          const DocRow = worksheet.getRow(lastRow);
          DocRow.fill = {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "000000" },
            fgColor: { argb: "808080" },
          };
          DocRow.font = {
            name: "calibri",
            family: 4,
            size: 12,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          //   const merge = `A${e+1}:${generalColumns.length}`;
          //   console.log("lastRow", lastRow);
          //   worksheet.mergeCells(merge);
          for (let p = 0; p < patients.length; p++) {
            const { patient_code, pat_name, details } = patients[p];
            _.chain(details)
              .groupBy((g) => g.hims_f_billing_header_id)
              .forEach((billGroup, billKey) => {
                const {
                  bill_invoice,
                  insured,
                  bill_date,
                  new_visit_patient,
                  insurance_provider_name,
                } = _.head(billGroup);

                let serviceObject = {
                  [insured === "Y"
                    ? "crd_bill_invoice"
                    : "csh_bill_invoice"]: bill_invoice,
                };

                _.chain(billGroup)
                  .groupBy((g) => g.service_type_id)
                  .forEach((services, sKey) => {
                    let billing_type = {};
                    _.chain(services)
                      .groupBy((ig) => ig.pay_type)
                      .forEach((bill, bKey) => {
                        const billH = _.head(bill);
                        billing_type = {
                          ...billing_type,
                          [bKey === "CA"
                            ? "cash_amount"
                            : bKey === "CD"
                            ? "card_amount"
                            : "cheque_amount"]: billH.receipt_amount,
                        };
                      })
                      .value();
                    let dualPayType = 0;
                    const recordsDtl = _.chain(billGroup)
                      .groupBy((sg) => sg.pay_type)
                      .map((hItem) => {
                        const { patient_payable } = _.head(hItem);
                        dualPayType = patient_payable;
                        return hItem;
                      })
                      .value();
                    serviceObject = {
                      ...serviceObject,
                      ...billing_type,
                      [sKey + "_amount"]:
                        recordsDtl.length === 1
                          ? _.sumBy(services, (s) =>
                              parseFloat(s.patient_payable)
                            )
                          : dualPayType,
                      [sKey + "_desc_amount"]: _.sumBy(services, (s) =>
                        parseFloat(s.discount_amout)
                      ),
                      advance_amount: _.sumBy(services, (s) =>
                        parseFloat(s.advance_amount)
                      ),
                      advance_adjust: _.sumBy(services, (s) =>
                        parseFloat(s.advance_adjust)
                      ),
                    };
                  })
                  .value();
                let dualPayType = 0;
                const recordsDtl = _.chain(billGroup)
                  .groupBy((sg) => sg.pay_type)
                  .map((hItem) => {
                    const { patient_payable } = _.head(hItem);
                    dualPayType = patient_payable;
                    return hItem;
                  })
                  .value();
                worksheet.addRow({
                  slno: counter,
                  patient_code,
                  pat_name,
                  bill_time: moment(bill_date).format("hh:mm:ss"),
                  // net_amout: _.sumBy(billGroup, (s) => {
                  //   return insured === "Y"
                  //     ? parseFloat(s.company_payble)
                  //     : parseFloat(s.patient_payable);
                  // }),
                  patient_amount:
                    recordsDtl.length === 1
                      ? _.sumBy(billGroup, (s) => parseFloat(s.patient_payable))
                      : dualPayType,
                  // patient_amount: _.sumBy(billGroup, (s) =>
                  //   parseFloat(s.patient_payable)
                  // ),
                  insurance_amount: _.sumBy(billGroup, (s) =>
                    parseFloat(s.company_payble)
                  ),
                  billing_type:
                    insured === "N" ? "Cash" : insurance_provider_name,
                  ...serviceObject,
                  new_visit: new_visit_patient === "Y" ? 1 : 0,
                  followup_visit: new_visit_patient !== "Y" ? 1 : 0,
                });
                counter++;
              })
              .value();
          }
        }

        worksheet.eachRow((row) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        });
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
