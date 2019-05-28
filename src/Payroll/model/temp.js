//created by irfan:
let getInvoicesForClaims = (req, res, next) => {
  let selectWhere = {
    sub_insurance_id: "ALL"
  };

  if (
    req.query.patient_id != "null" ||
    (req.query.from_date != "null" && req.query.to_date != "null") ||
    req.query.sub_insurance_id != "null" ||
    req.query.insurance_provider_id != "null"
  ) {
    if (req.query.patient_id != "null" && req.query.patient_id != undefined) {
      req.query["IH.patient_id"] = req.query.patient_id;
    }
    delete req.query.patient_id;

    if (
      req.query.insurance_provider_id != "null" &&
      req.query.insurance_provider_id != undefined
    ) {
      req.query["IH.insurance_provider_id"] = req.query.insurance_provider_id;
    }
    delete req.query.insurance_provider_id;

    let invoice_date = "";

    if (
      req.query.from_date != "null" &&
      req.query.to_date != "null" &&
      req.query.from_date != undefined &&
      req.query.to_date != undefined
    ) {
      invoice_date = ` date(invoice_date) between date('${
        req.query.from_date
      }') and date('${req.query.to_date}') and `;
    }
    delete req.query.from_date;
    delete req.query.to_date;
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }

      let db = req.db;

      let where = whereCondition(extend(selectWhere, req.query));

      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
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
           from  hims_f_invoice_header IH  inner join hims_f_patient P on IH.patient_id=P.hims_d_patient_id and\
           P.record_status='A'  inner join hims_f_patient_visit V on IH.visit_id=V.hims_f_patient_visit_id and\
           V.record_status='A' inner join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id and\
           V.record_status='A'\
           inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id and E.record_status='A'         \
           left join hims_d_insurance_provider IP on IH.insurance_provider_id=IP.hims_d_insurance_provider_id\
           and IP.record_status='A' left join hims_d_insurance_sub SI on IH.sub_insurance_id=SI.hims_d_insurance_sub_id\
           and SI.record_status='A' left join hims_d_insurance_network NET on IH.network_id=NET.hims_d_insurance_network_id\
           and NET.record_status='A' left join hims_d_insurance_network_office NET_OF on IH.network_office_id=NET_OF.hims_d_insurance_network_office_id\
           and NET_OF.record_status='A' where " +
              invoice_date +
              where.condition,
            where.values,

            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              let outputArray = [];
              if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                  connection.query(
                    "SELECT hims_f_invoice_details_id, invoice_header_id, bill_header_id, bill_detail_id,\
                    service_id, quantity, gross_amount, discount_amount, patient_resp, patient_tax, patient_payable,\
                    company_resp, company_tax, company_payable, sec_company_resp, sec_company_tax, sec_company_payable,\
                    ID.service_type_id,ST.service_type_code, ST.service_type, ST. arabic_service_type,\
                    S.service_code,S.service_name,ID.cpt_code,C.cpt_desc,C.prefLabel  \
                    from hims_f_invoice_details ID  inner join hims_d_service_type ST on \
                     ID.service_type_id=ST.hims_d_service_type_id and ST.record_status='A'\
                     inner join hims_d_services S on ID.service_id=S.hims_d_services_id and\
                     S.record_status='A' left join hims_d_cpt_code C on ID.cpt_code=C.cpt_code where invoice_header_id=?",
                    [result[i].hims_f_invoice_header_id],

                    (error, invoiceDetails) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      connection.query(
                        "select hims_f_invoice_icd_id, invoice_header_id from hims_f_invoice_icd \
                        where record_status='A' and invoice_header_id=?",
                        [result[i].hims_f_invoice_header_id],

                        (error, invoiceICD) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                          if (invoiceICD.length > 0) {
                            // go ahead next
                            // and commit
                            debugLog("invoiceICD:", invoiceICD);

                            outputArray.push({ ...result[i], invoiceDetails });

                            if (i == result.length - 1) {
                              connection.commit(error => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                releaseDBConnection(db, connection);
                                req.records = outputArray;
                                next();
                              });
                            }
                          } else {
                            connection.query(
                              "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id, diagnosis_type, final_daignosis\
                             from hims_f_patient_diagnosis where record_status='A' and episode_id=? and patient_id=?",
                              [result[i].episode_id, result[i].patient_id],

                              (error, patientDiagnosys) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                debugLog("patientDiagnosys:", patientDiagnosys);
                                if (patientDiagnosys.length > 0) {
                                  debugLog("asfetr");
                                  const insurtColumns = [
                                    "patient_id",
                                    "episode_id",
                                    "daignosis_id",
                                    "diagnosis_type",
                                    "final_daignosis",

                                    
                                    "created_by",
                                    "updated_by"
                                  ];

                                  connection.query(
                                    "INSERT INTO hims_f_invoice_icd(" +
                                      insurtColumns.join(",") +
                                      ",invoice_header_id,created_date,updated_date) VALUES ?",
                                    [
                                      jsonArrayToObject({
                                        sampleInputObject: insurtColumns,
                                        arrayObj: patientDiagnosys,
                                        newFieldToInsert: [
                                          result[i].hims_f_invoice_header_id,
                                          new Date(),
                                          new Date()
                                        ],
                                        req: req
                                      })
                                    ],
                                    (error, addDiagnosys) => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }
                                      //----------------- commit
                                      debugLog("addDiagnosys:", addDiagnosys);
                                      outputArray.push({
                                        ...result[i],
                                        invoiceDetails
                                      });

                                      if (i == result.length - 1) {
                                        connection.commit(error => {
                                          if (error) {
                                            connection.rollback(() => {
                                              releaseDBConnection(
                                                db,
                                                connection
                                              );
                                              next(error);
                                            });
                                          }

                                          releaseDBConnection(db, connection);
                                          req.records = outputArray;
                                          next();
                                        });
                                      }
                                    }
                                  );
                                } else {
                                  outputArray.push({
                                    ...result[i],
                                    invoiceDetails
                                  });

                                  if (i == result.length - 1) {
                                    connection.commit(error => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }

                                      releaseDBConnection(db, connection);
                                      req.records = outputArray;
                                      next();
                                    });
                                  }
                                }
                              }
                            );
                          }
                        }
                      );
                      ///============================================

                      //----------------------------------------------------
                    }
                  );
                }
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              }
            }
          );
        });
      });
    } catch (e) {
      next(e);
    }
  } else {
    req.records = { invalid_input: true };
    next();
  }
};
