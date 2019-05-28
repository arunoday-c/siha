import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
module.exports = {
  //created by:irfan
  getVisitWiseBillDetailS: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      //   let input = req.query;

      _mysql
        .executeQuery({
          query:
            "select hims_f_billing_header_id, patient_id, visit_id from hims_f_billing_header\
           where record_status='A' and invoice_generated='N' and visit_id=?",
          values: [req.query.visit_id],

          printQuery: false
        })
        .then(result => {
          if (result.length > 0) {
            let bill_header_ids = new LINQ(result)
              .Select(s => s.hims_f_billing_header_id)
              .ToArray();

            _mysql
              .executeQuery({
                query:
                  "select 'OP' as trans_from, hims_f_billing_details_id, hims_f_billing_header_id, BD.service_type_id ,ST.service_type, services_id,S.service_name, S.cpt_code, quantity,\
          unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
          copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
            patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
            sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
            sec_copay_amount, pre_approval, commission_given from hims_f_billing_details BD,hims_d_service_type ST,hims_d_services S\
            where BD.record_status='A' and ST.record_status='A' and S.record_status='A' and \
            BD.service_type_id=ST.hims_d_service_type_id and BD.services_id=S.hims_d_services_id\
            and hims_f_billing_header_id in (?);\
            select 'POS' as trans_from, hims_f_pharmacy_pos_header_id,patient_id, visit_id,\
            hims_f_pharmacy_pos_detail_id,PD.pharmacy_pos_header_id,12 as service_type_id,'Pharmacy' as service_type,\
            PD.service_id as services_id, S.service_name, S.cpt_code, PD.quantity,\
            PD.insurance_yesno,PD.tax_inclusive,PD.unit_cost,PD.extended_cost as gross_amount,\
            PD.discount_amount as discount_amout,PD.net_extended_cost as net_amout,PD.copay_percent as copay_percentage,\
            PD.copay_amount ,PD.patient_responsibility as patient_resp,\
            PD.patient_tax ,PD.patient_payable,PD.company_responsibility as comapany_resp,PD.company_tax,\
            PD.company_payable as company_payble,\
            PD.sec_copay_percent as sec_copay_percntage,PD.sec_copay_amount,PD.sec_company_responsibility as sec_company_res,PD.sec_company_tax,\
            PD.sec_company_payable as sec_company_paybale,PD.return_quantity,PD.return_done,PD.return_extended_cost,PD.return_discount_amt,\
            PD.return_net_extended_cost,PD.return_pat_responsibility,PD.return_company_responsibility,\
            PD.return_sec_company_responsibility from hims_f_pharmacy_pos_header PH inner join hims_f_pharmacy_pos_detail PD\
            on PH.hims_f_pharmacy_pos_header_id=PD.pharmacy_pos_header_id inner join \
            hims_d_services S on PD.service_id=S.hims_d_services_id and \
            PH.visit_id=? and PH.record_status='A' and PH.record_status='A';",
                values: [bill_header_ids, req.query.visit_id],

                printQuery: false
              })
              .then(detailResult => {
                _mysql.releaseConnection();

                let outputArray = [];
                outputArray.push(...detailResult[0], ...detailResult[1]);

                req.records = outputArray;
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by:irfan
  addInvoiceGeneration: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;

      _mysql
        .generateRunningNumber({
          modules: ["INV_NUM"]
        })
        .then(invoce_no => {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_invoice_header` (invoice_number,invoice_date,patient_id,visit_id,gross_amount,\
            discount_amount,net_amount, patient_resp,patient_tax, patient_payable, company_resp, company_tax, \
            company_payable, sec_company_resp, sec_company_tax, sec_company_payable,insurance_provider_id, \
            sub_insurance_id, network_id, network_office_id, card_number,policy_number,card_holder_name, \
            card_holder_age, card_holder_gender, card_class, created_date, created_by, updated_date, updated_by,hospital_id) \
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                invoce_no[0],
                new Date(input.invoice_date),
                input.patient_id,
                input.visit_id,
                input.gross_amount,
                input.discount_amount,
                input.net_amount,
                input.patient_resp,
                input.patient_tax,
                input.patient_payable,
                input.company_resp,
                input.company_tax,
                input.company_payable,
                input.sec_company_resp,
                input.sec_company_tax,
                input.sec_company_payable,

                input.insurance_provider_id,
                input.sub_insurance_id,
                input.network_id,
                input.network_office_id,
                input.card_number,
                input.policy_number,
                input.card_holder_name,
                input.card_holder_age,
                input.card_holder_gender,
                input.card_class,

                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],

              printQuery: false
            })
            .then(headerResult => {
              //   _mysql.releaseConnection();
              //   req.records = result;

              //   next();

              if (headerResult.length > 0) {
                const insertColumns = [
                  "bill_header_id",
                  "bill_detail_id",
                  "service_type_id",
                  "service_id",
                  "cpt_code",
                  "unit_cost",
                  "quantity",
                  "gross_amount",
                  "discount_amount",
                  "net_amount",
                  "patient_resp",
                  "patient_tax",
                  "patient_payable",
                  "company_resp",
                  "company_tax",
                  "company_payable",
                  "sec_company_resp",
                  "sec_company_tax",
                  "sec_company_payable"
                ];
                _mysql
                  .executeQueryWithTransaction({
                    query: "insert into hims_f_invoice_details values ?",

                    values: input.Invoice_Detail,
                    includeValues: insertColumns,
                    extraValues: {
                      invoice_header_id: headerResult.insertId,
                      created_date: new Date(),
                      updated_date: new Date(),
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_by: req.userIdentity.algaeh_d_app_user_id
                    },
                    bulkInsertOrUpdate: true
                  })
                  .then(detailResult => {
                    let _tempBillHeaderIds = new LINQ(req.body.Invoice_Detail)
                      .Select(s => s.hims_f_billing_header_id)
                      .ToArray();

                    let billHeaderIds = _tempBillHeaderIds.filter(
                      (item, pos) => {
                        return _tempBillHeaderIds.indexOf(item) == pos;
                      }
                    );

                    if (detailResult.affectedRows > 0) {
                      _mysql
                        .executeQuery({
                          query:
                            "UPDATE hims_f_billing_header SET invoice_generated = 'Y' ,updated_date=?, updated_by=?\
                      WHERE record_status='A' and  hims_f_billing_header_id in (?);\
                      UPDATE hims_f_patient_visit SET invoice_generated='Y',visit_status='C',updated_date=?, updated_by=?\
                       WHERE record_status='A' and hims_f_patient_visit_id = ?; ",
                          values: [
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            billHeaderIds,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            input.visit_id
                          ],
                          printQuery: false
                        })
                        .then(result => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result;
                            next();
                          });
                        })
                        .catch(e => {
                          mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    } else {
                      _mysql.rollBackTransaction(() => {
                        req.records = {
                          invalid_data: true,
                          message: "please send correct  data"
                        };
                        next();
                        return;
                      });
                    }
                  })
                  .catch(e => {
                    mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                _mysql.rollBackTransaction(() => {
                  req.records = {
                    invalid_data: true,
                    message: "please send correct  data"
                  };
                  next();
                  return;
                });
              }
            })
            .catch(e => {
              mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  },

  //created by:irfan
  getInvoiceGeneration: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      //   let input = req.query;

      _mysql
        .executeQuery({
          query:
            "SELECT IH.`hims_f_invoice_header_id`, IH.`invoice_number`, IH.`invoice_date`, \
          IH.`invoice_type`, IH.`patient_id`, IH.`visit_id`, IH.`policy_number`, IH.`insurance_provider_id`,\
          IH.`sub_insurance_id`, IH.`network_id`, IH.`network_office_id`, IH.`card_number`, IH.`gross_amount`,\
          IH.`discount_amount`, IH.`net_amount`, IH.`patient_resp`, IH.`patient_tax`, IH.`patient_payable`,\
          IH.`company_resp`, IH.`company_tax`, IH.`company_payable`, IH.`sec_company_resp`, IH.`sec_company_tax`,\
          IH.`sec_company_payable`, IH.`submission_date`, IH.`submission_ammount`, IH.`remittance_date`,\
          IH.`remittance_ammount`, IH.`denial_ammount`, IH.`claim_validated`, IH.`card_holder_name`,\
          IH.`card_holder_age`, IH.`card_holder_gender`, IH.`card_class`, IH.`created_by`, IH.`created_date`,\
          IH.`updated_by`, IH.`updated_date`, IH.`hospital_id`, PV.visit_code, P.patient_code, P.full_name\
          from  hims_f_invoice_header IH, hims_f_patient_visit PV, hims_f_patient P\
          where IH.visit_id = PV.hims_f_patient_visit_id and IH.patient_id = P.hims_d_patient_id and invoice_number=?",
          values: [req.query.invoice_number],

          printQuery: false
        })
        .then(headerResult => {
          if (headerResult.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_invoice_details where invoice_header_id=?",
                values: [headerResult[0].hims_f_invoice_header_id],

                printQuery: false
              })
              .then(Invoice_Detail => {
                _mysql.releaseConnection();

                req.records = {
                  ...headerResult[0],
                  ...{ Invoice_Detail }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by:irfan
  getInvoicesForClaims: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;

      if (
        input.patient_id > 0 ||
        (input.from_date != "null" && input.to_date != "null") ||
        input.sub_insurance_id > 0 ||
        input.insurance_provider_id > 0
      ) {
        let _qryStr = "";
        let _values = [];

        if (input.patient_id > 0) {
          _qryStr += " and IH.patient_id=?";
          _values.push(input.patient_id);
        }
        if (input.insurance_provider_id > 0) {
          _qryStr += " and IH.insurance_provider_id=?";
          _values.push(input.insurance_provider_id);
        }
        if (input.sub_insurance_id > 0) {
          _qryStr += " and IH.sub_insurance_id=?";
          _values.push(input.sub_insurance_id);
        }

        if (
          input.from_date != "null" &&
          input.to_date != "null" &&
          input.from_date != undefined &&
          input.to_date != undefined
        ) {
          _qryStr = "and  date(invoice_date) between date(?) and date(?) ";
          _values.push(input.from_date, input.to_date);
        }

        _mysql
          .executeQuery({
            query:
              "SELECT 0 chkselect, hims_f_invoice_header_id, invoice_number, invoice_date, IH.patient_id, visit_id,\
          IH.insurance_provider_id, IH.sub_insurance_id, IH.network_id, IH.network_office_id, IH.card_number, gross_amount,\
          discount_amount, patient_resp, patient_tax, patient_payable, company_resp, company_tax, \
          company_payable, sec_company_resp, sec_company_tax, sec_company_payable, submission_date,\
          submission_ammount, remittance_date, remittance_ammount, denial_ammount,claim_validated,\
          P.patient_code,P.full_name as patient_name,P.arabic_name as arabic_patient_name,P.contact_number ,\
          V.visit_code,V.episode_id,V.doctor_id,E.full_name as doctor_name,E.employee_code,insurance_provider_name,\
          arabic_provider_name as arabic_insurance_provider_name ,\
          insurance_sub_code as sub_insurance_provider_code,insurance_sub_name as sub_insurance_provider,\
          arabic_sub_name as arabic_sub_insurance_provider, network_type,arabic_network_type,\
          NET_OF.price_from,NET_OF.employer,NET_OF.policy_number,SD.chart_type\
         from  hims_f_invoice_header IH  inner join hims_f_patient P on IH.patient_id=P.hims_d_patient_id \
          inner join hims_f_patient_visit V on IH.visit_id=V.hims_f_patient_visit_id \
         inner join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id \
         inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id \
         left join hims_d_insurance_provider IP on IH.insurance_provider_id=IP.hims_d_insurance_provider_id\
          left join hims_d_insurance_sub SI on IH.sub_insurance_id=SI.hims_d_insurance_sub_id\
          left join hims_d_insurance_network NET on IH.network_id=NET.hims_d_insurance_network_id\
          left join hims_d_insurance_network_office NET_OF on IH.network_office_id=NET_OF.hims_d_insurance_network_office_id\
          where P.record_status='A' and  V.record_status='A' and V.record_status='A' and E.record_status='A'\
          and IP.record_status='A' and SI.record_status='A' and  NET.record_status='A' and NET_OF.record_status='A' " +
              _qryStr +
              "; \
          	SELECT hims_f_invoice_details_id, invoice_header_id, bill_header_id, bill_detail_id,\
              service_id, quantity, ID.gross_amount, ID.discount_amount, ID.patient_resp, ID.patient_tax,ID.patient_payable,\
             ID.company_resp, ID.company_tax, ID.company_payable, ID.sec_company_resp, ID.sec_company_tax, ID.sec_company_payable,\
              ID.service_type_id,ST.service_type_code, ST.service_type, ST. arabic_service_type,\
              S.service_code,S.service_name,ID.cpt_code,C.cpt_desc,C.prefLabel  \
              from  hims_f_invoice_header IH inner join hims_f_invoice_details ID  \
              on IH.hims_f_invoice_header_id =ID.invoice_header_id inner join hims_d_service_type ST on \
               ID.service_type_id=ST.hims_d_service_type_id inner join hims_d_services S on \
               ID.service_id=S.hims_d_services_id left join hims_d_cpt_code C on ID.cpt_code=C.cpt_code where \
              ST.record_status='A'  and S.record_status='A' " +
              _qryStr +
              "; select hims_f_invoice_icd_id, invoice_header_id from  hims_f_invoice_header IH\
              INNER JOIN hims_f_invoice_icd  ICD on IH.hims_f_invoice_header_id=ICD.invoice_header_id \
             where ICD.record_status='A' " +
              _qryStr,
            values: [_values, _values, _values],
            printQuery: false
          })
          .then(result => {
            let header_arr = result[0];
            let detail_arr = result[1];
            let invoce_icd_arr = result[2];

            if (header_arr.length > 0) {
              let all_patient_id = new LINQ(header_arr)
                .Select(s => s.patient_id)
                .ToArray();

              let all_episode_id = new LINQ(header_arr)
                .Select(s => s.episode_id)
                .ToArray();

              _mysql
                .executeQuery({
                  query:
                    "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id, diagnosis_type, final_daignosis\
              from hims_f_patient_diagnosis where record_status='A' and patient_id in (?) or episode_id in (?)",
                  values: [all_patient_id, all_episode_id],

                  printQuery: false
                })
                .then(diagnosis_result => {
                  //=-----------

                  let outputArray = [];
                  let insertArray = [];

                  for (let i = 0; i < header_arr.length; i++) {
                    let invoiceDetails = new LINQ(detail_arr)
                      .Where(
                        w =>
                          (w.invoice_header_id =
                            header_arr[i]["hims_f_invoice_header_id"])
                      )
                      .Select(s => s)
                      .ToArray();

                    let icd_present = invoce_icd_arr.filter(
                      item =>
                        item.invoice_header_id ==
                        header_arr[i]["hims_f_invoice_header_id"]
                    ).length;

                    if (icd_present > 0) {
                      outputArray.push({
                        ...header_arr[i],
                        invoiceDetails
                      });
                    } else {
                      let patientDiagnosys = diagnosis_result.filter(item => {
                        if (
                          item.patient_id == header_arr[i]["patient_id"] &&
                          item.episode_id == header_arr[i]["episode_id"]
                        ) {
                          return {
                            ...item,
                            hims_f_invoice_header_id:
                              header_arr[i]["hims_f_invoice_header_id"]
                          };
                        }
                      });

                      insertArray.push(...patientDiagnosys);
                    }
                  }

                  // _mysql.releaseConnection();
                  // req.records = outputArray;
                  // next();

                  if (insertArray.length > 0) {
                    const insertColumns = [
                      "patient_id",
                      "episode_id",
                      "daignosis_id",
                      "diagnosis_type",
                      "final_daignosis",

                      "invoice_header_id"
                    ];
                    _mysql
                      .executeQuery({
                        query: "insert into hims_f_invoice_icd values ?",

                        values: insertArray,
                        includeValues: insertColumns,
                        extraValues: {
                          created_date: new Date(),
                          updated_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        },
                        bulkInsertOrUpdate: true
                      })
                      .then(finalResult => {
                        _mysql.releaseConnection();

                        req.records = outputArray;
                        next();
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
                  } else {
                    _mysql.releaseConnection();

                    req.records = outputArray;
                    next();
                  }
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  next(error);
                });
            } else {
              _mysql.releaseConnection();
              req.records = header_arr;
              next();
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "Please provide valid input"
        };
        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },

  //created by:irfan
  getPatientIcdForInvoice: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      //   let input = req.query;
      if (req.query.invoice_header_id > 0) {
        _mysql
          .executeQuery({
            query:
              " select hims_f_invoice_icd_id, invoice_header_id, patient_id, episode_id,\
          daignosis_id, diagnosis_type, final_daignosis,ICD.icd_code,ICD.icd_description,\
          ICD.icd_level,ICD.icd_type from hims_f_invoice_icd INV,hims_d_icd ICD \
          where INV.record_status='A' and ICD.record_status='A' and  INV.daignosis_id=ICD.hims_d_icd_id and \
          invoice_header_id=?",
            values: [req.query.invoice_header_id],

            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "please provie valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan
  deleteInvoiceIcd: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      //   let input = req.query;
      if (req.body.hims_f_invoice_icd_id > 0) {
        _mysql
          .executeQuery({
            query:
              " DELETE FROM hims_f_invoice_icd WHERE hims_f_invoice_icd_id = ?; ",
            values: [req.body.hims_f_invoice_icd_id],

            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "please provie valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan
  addInvoiceIcd: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;
      if (input.invoice_header_id > 0 && input.daignosis_id > 0) {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_invoice_icd` (invoice_header_id, patient_id, episode_id, daignosis_id,\
                diagnosis_type, final_daignosis,\
               created_date, created_by, updated_date, updated_by,hospital_id ) \
             VALUE(?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.invoice_header_id,
              input.patient_id,
              input.episode_id,
              input.daignosis_id,
              input.diagnosis_type,
              input.final_daignosis,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.hospital_id
            ],

            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "please provie valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan
  updateClaimValidatedStatus: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;
      if (
        input.hims_f_invoice_header_id != "null" &&
        input.hims_f_invoice_header_id != undefined &&
        (input.claim_validated == "V" ||
          input.claim_validated == "E" ||
          input.claim_validated == "X" ||
          input.claim_validated == "P")
      ) {
        _mysql
          .executeQuery({
            query:
              "UPDATE hims_f_invoice_header SET claim_validated = ?, updated_date=?, updated_by=?  WHERE hims_f_invoice_header_id = ?",

            values: [
              input.claim_validated,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_invoice_header_id
            ],

            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "please provie valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan
  updateInvoiceDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;
      if (
        input.hims_f_invoice_details_id > 0 &&
        input.cpt_code != "null" &&
        input.cpt_code != undefined
      ) {
        _mysql
          .executeQuery({
            query:
              "UPDATE hims_f_invoice_details SET cpt_code = ?, updated_date=?, updated_by=?\
              WHERE hims_f_invoice_details_id = ?",

            values: [
              input.cpt_code,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_invoice_details_id
            ],

            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "please provie valid input"
              };
              next();
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "please provie valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  }
};
