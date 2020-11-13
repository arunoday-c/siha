import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import "regenerator-runtime/runtime";

export async function bulkInvoiceNumber(req, res, next) {
  const _mysql = new algaehMysql();
  const { vist_ids } = req.body;
  try {
    let all_numgen_codes = [];

    for (let i = 0; i < vist_ids.length; i++) {
      const results = await _mysql.generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["INV_NUM"],
        table_name: "hims_f_app_numgen",
      });
      _mysql.commitTransaction();
      // all_numgen_codes.push({ ...results, [vist_ids[i]]: results["INV_NUM"] });
      all_numgen_codes.push({ ...results, visit_id: vist_ids[i] });
    }
    req.allnumGen = all_numgen_codes;
    next();
    // console.log("all_numgen_codes", all_numgen_codes);
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export function bulkInvoiceGeneration(req, res, next) {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  try {
    const { vist_ids } = req.body;
    const {
      algaeh_d_app_user_id,
      hospital_id,
      decimal_places,
    } = req.userIdentity;
    const conDecimals = parseInt(decimal_places, 10);
    const allVisits = vist_ids.length;
    let counter = 0;

    _mysql
      .executeQuery({
        query: `select V.patient_id, V.hims_f_patient_visit_id as visit_id,V.visit_date, PIM.primary_policy_num as policy_number,
        PIM.primary_insurance_provider_id as insurance_provider_id, PIM.primary_sub_id as sub_insurance_id,V.visit_code,P.patient_code,P.full_name as pat_name,
        PIM.primary_network_id as network_id,PIM.card_holder_name as card_holder_name,
       -- PIM.primary_network_id as network_office_id,
       NET_OFF.hims_d_insurance_network_office_id as network_office_id,
        COALESCE(BH.gross_total,0)  as gross_amount,COALESCE(BH.discount_amount,0) as discount_amount,COALESCE(BH.net_amount,0) as net_amount,
        COALESCE(BH.patient_res,0) as patient_resp,
        COALESCE(BH.patient_tax,0)as patient_tax ,COALESCE(BH.patient_payable,0)as patient_payable ,COALESCE(BH.company_res,0) as company_resp,
        COALESCE(BH.company_tax,0)as company_tax ,COALESCE(BH.company_payable,0) as company_payable,COALESCE(BH.sec_company_payable,0) as sec_company_resp,
        COALESCE(BH.sec_company_tax,0)as sec_company_tax,COALESCE(BH.sec_company_payable,0) as sec_company_payable,
        PIM.primary_card_number as card_number,V.age_in_years as card_holder_age,P.gender as card_holder_gender,I.insurance_type,
        BD.hims_f_billing_details_id,BD.hims_f_billing_header_id,BD.service_type_id,BD.services_id,BD.quantity,BD.unit_cost,BD.gross_amount as dtl_gross_amount,
        BD.discount_amout as dtl_discount_amout,BD.net_amout as dtl_net_amount,BD.patient_resp as dtl_patient_resp,BD.patient_tax as dtl_patient_tax,
        BD.patient_payable as dtl_patient_payable,BD.comapany_resp as dtl_company_resp,BD.company_tax as dtl_company_tax,BD.company_payble as dtl_company_payable,
        BD.sec_company_res as dtl_sec_company_resp,BD.sec_company_tax as dtl_sec_company_tax,BD.sec_company_paybale as dtl_sec_company_payable
        from hims_f_patient_visit as V inner join hims_m_patient_insurance_mapping as PIM on
        PIM.patient_visit_id = V.hims_f_patient_visit_id  and PIM.patient_id = V.patient_id
        inner join hims_f_billing_header as BH on BH.patient_id  = V.patient_id  and BH.visit_id = V.hims_f_patient_visit_id
        inner join hims_f_patient as P on P.hims_d_patient_id = V.patient_id
        inner join hims_f_billing_details as BD on BH.hims_f_billing_header_id = BD.hims_f_billing_header_id
        inner join hims_d_insurance_provider as I on I.hims_d_insurance_provider_id = PIM.primary_insurance_provider_id
        inner join hims_d_insurance_network_office as NET_OFF on PIM.primary_network_id = NET_OFF.network_id
        where V.hims_f_patient_visit_id  in (?);`,
        values: [vist_ids],
        printQuery: true,
      })
      .then((groupped) => {
        _.chain(groupped)
          .groupBy((g) => g.visit_id)
          .forEach(async (patientVist, vKey) => {
            const {
              patient_code,
              visit_code,
              pat_name,
              patient_id,
              visit_date,
              visit_id,
              policy_number,
              insurance_provider_id,
              sub_insurance_id,
              network_id,
              network_office_id,
              card_holder_name,
              card_number,
              card_holder_age,
              card_holder_gender,
              insurance_type,
            } = _.first(patientVist);
            counter++;

            // .then((generatedNumbers) => {
            // console.log("visit_id", visit_id)
            // console.log("allnumGen", req.allnumGen, typeof req.allnumGen)
            const generatedNumbers = req.allnumGen.find(
              (f) => f.visit_id === visit_id
            );
            // console.log("generatedNumbers", generatedNumbers)

            _mysql
              .executeQueryWithTransaction({
                query: `INSERT INTO hims_f_invoice_header(invoice_number,invoice_date,patient_id,
                     visit_id,gross_amount,discount_amount,net_amount, patient_resp,patient_tax,
                     patient_payable, company_resp, company_tax,company_payable, sec_company_resp,
                     sec_company_tax, sec_company_payable,insurance_provider_id,sub_insurance_id, 
                     network_id, network_office_id, card_number,policy_number,card_holder_name,
                     card_holder_age, card_holder_gender, card_class, claim_validated, created_date, created_by,
                      updated_date, updated_by,hospital_id ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,
                          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                values: [
                  generatedNumbers.INV_NUM,
                  visit_date,
                  patient_id,
                  visit_id,
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_gross_amount)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) =>
                      parseFloat(s.dtl_discount_amout)
                    ),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_net_amount)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_patient_resp)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_patient_tax)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) =>
                      parseFloat(s.dtl_patient_payable)
                    ),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_company_resp)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) => parseFloat(s.dtl_company_tax)),
                    conDecimals
                  ),
                  utilities.decimalPoints(
                    _.sumBy(patientVist, (s) =>
                      parseFloat(s.dtl_company_payable)
                    ),
                    conDecimals
                  ),
                  0, //sec_company_resp,
                  0, // sec_company_tax,
                  0, // sec_company_payable,
                  insurance_provider_id,
                  sub_insurance_id,
                  network_id,
                  network_office_id, //network_id,
                  card_number,
                  policy_number,
                  card_holder_name,
                  card_holder_age,
                  card_holder_gender,
                  null,
                  insurance_type === "C" ? "V" : "P",
                  new Date(),
                  algaeh_d_app_user_id,
                  new Date(),
                  algaeh_d_app_user_id,
                  hospital_id,
                ],
                printQuery: true,
              })
              .then((headerResult) => {
                if (headerResult.insertId > 0) {
                  _.chain(patientVist)
                    .groupBy((g) => g.hims_f_billing_header_id)
                    .each((billHeaders, bKey) => {
                      let detailInsert = "";
                      for (let d = 0; d < billHeaders.length; d++) {
                        const {
                          hims_f_billing_details_id,
                          hims_f_billing_header_id,
                          service_type_id,
                          services_id,
                          unit_cost,
                          quantity,
                          dtl_gross_amount,
                          dtl_discount_amout,
                          dtl_net_amount,
                          dtl_patient_resp,
                          dtl_patient_tax,
                          dtl_patient_payable,
                          dtl_company_resp,
                          dtl_company_tax,
                          dtl_company_payable,
                          dtl_sec_company_resp,
                          dtl_sec_company_tax,
                          dtl_sec_company_payable,
                        } = billHeaders[d];
                        detailInsert += _mysql.mysqlQueryFormat(
                          `INSERT INTO hims_f_invoice_details(invoice_header_id,bill_header_id,
                                    bill_detail_id,service_type_id,service_id,unit_cost,quantity,gross_amount,discount_amount,
                                    net_amount,patient_resp,patient_tax,patient_payable,company_resp,company_tax,company_payable,
                                    sec_company_resp,sec_company_tax,sec_company_payable,created_by,created_date,updated_date,updated_by)
                                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                          [
                            headerResult.insertId,
                            hims_f_billing_header_id,
                            hims_f_billing_details_id,
                            service_type_id,
                            services_id,
                            unit_cost,
                            quantity,
                            dtl_gross_amount,
                            dtl_discount_amout,
                            dtl_net_amount,
                            dtl_patient_resp,
                            dtl_patient_tax,
                            dtl_patient_payable,
                            dtl_company_resp,
                            dtl_company_tax,
                            dtl_company_payable,
                            dtl_sec_company_resp,
                            dtl_sec_company_tax,
                            dtl_sec_company_payable,
                            algaeh_d_app_user_id,
                            new Date(),
                            new Date(),
                            algaeh_d_app_user_id,
                          ]
                        );
                      }
                      _mysql
                        .executeQuery({
                          query: detailInsert,
                          printQuery: true,
                        })
                        .then((billDetail) => {
                          _mysql
                            .executeQuery({
                              query: `UPDATE hims_f_billing_header SET invoice_generated = 'Y' ,updated_date=?, updated_by=? 
                                 WHERE record_status='A' and  hims_f_billing_header_id = ?;
                                 UPDATE hims_f_patient_visit SET invoice_generated='Y',visit_status='C',updated_date=?, updated_by=?
                                 WHERE record_status='A' and hims_f_patient_visit_id = ?;`,
                              values: [
                                new Date(),
                                algaeh_d_app_user_id,
                                bKey,
                                new Date(),
                                algaeh_d_app_user_id,
                                vKey,
                              ],
                              printQuery: true,
                            })
                            .then((updateResult) => {
                              if (allVisits === counter) {
                                _mysql.commitTransaction((error) => {
                                  if (error) {
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                    return;
                                  }
                                  next();
                                });
                              } else {
                                _mysql.commitTransaction((error) => {
                                  if (error) {
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                    return;
                                  }
                                });
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                              return;
                            });
                        })
                        .catch((error) => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                          return;
                        });
                    })
                    .value();
                } else {
                  _mysql.rollBackTransaction(() => {
                    next(new Error("please send correct  data"));
                  });
                }
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
                return;
              });
            // })
            // .catch((error) => {
            //   _mysql.rollBackTransaction(() => {
            //     next(error);
            //   });
            //   return;
            // });
          })
          .value();
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
