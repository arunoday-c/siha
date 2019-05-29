import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";

module.exports = {
  selectFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = req.query;
      /* Select statemwnt  */

      let inputValues = [];
      let _stringData = "";
      _stringData += " and hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (input.hims_d_patient_id != null) {
        _stringData += " and hims_d_patient_id=?";
        inputValues.push(input.hims_d_patient_id);
      }

      if (input.patient_code != null) {
        _stringData += " and patient_code=?";
        inputValues.push(input.patient_code);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT  `hims_d_patient_id`, `patient_code`\
          , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`,`full_name`, `arabic_name`\
          , `gender`, `religion_id`,`date_of_birth`, `age`, `marital_status`, `address1`\
          , `address2`,`contact_number`, `secondary_contact_number`, `email`\
          , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
          , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`\
          , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`,`vat_applicable`\
          , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount`,`patient_type` , `employee_id` FROM `hims_f_patient` \
           WHERE `record_status`='A'" +
            _stringData,
          values: inputValues,
          printQuery: true
        })
        .then(patient_details => {
          if (patient_details.length > 0) {
            let hims_d_patient_id = patient_details[0]["hims_d_patient_id"];

            // "SELECT 0 radioselect, `hims_f_patient_visit_id`, `patient_id`,`visit_code`,`visit_status`\
            //   , `visit_type`, `visit_date`, `department_id`, `sub_department_id`\
            //   , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
            //   , `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`, `no_free_visit`,\
            //   `visit_expiery_date`,`visit_status`\
            //    FROM `hims_f_patient_visit` WHERE `record_status`='A' AND \
            //    patient_id=? ORDER BY hims_f_patient_visit_id desc ",
            _mysql
              .executeQuery({
                query:
                  "SELECT 0 radioselect,`hims_f_patient_visit_id`, `patient_id`,`visit_code`,`visit_status`\
                , `visit_type`, `visit_date`, hims_f_patient_visit.`department_id`, hims_f_patient_visit.`sub_department_id`\
                , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
                , `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`, `no_free_visit`,\
                `visit_expiery_date`,`visit_status`,`sub_department_name`,`full_name`\
                FROM `hims_f_patient_visit`, hims_d_sub_department SD, hims_d_employee E  WHERE hims_f_patient_visit.`record_status`='A' AND hims_f_patient_visit.sub_department_id = SD.hims_d_sub_department_id AND\
                 doctor_id =E.hims_d_employee_id AND patient_id=?  ORDER BY hims_f_patient_visit_id desc",
                values: [hims_d_patient_id],
                printQuery: true
              })
              .then(visit_detsils => {
                _mysql.releaseConnection();
                let result = {
                  patientRegistration: patient_details[0],
                  visitDetails: visit_detsils
                };
                req.records = result;

                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            next(new Error("Selected patient does not exists"));
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  addFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      req.mySQl = _mysql;
      //Patient
      _mysql
        .generateRunningNumber({
          modules: ["PAT_REGS"], //["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        // .then(generatedNumbers => {
        //   console.log("generatedNumbers", generatedNumbers);
        //   req.connection = {
        //     connection: _mysql.connection,
        //     isTransactionConnection: _mysql.isTransactionConnection,
        //     pool: _mysql.pool
        //   };

        //   //Patient
        //   req.body.patient_code = generatedNumbers[0];
        //   //Visit
        //   req.body.visit_code = generatedNumbers[1];
        //   //Bill
        //   req.body.bill_number = generatedNumbers[2];
        //   //Receipt
        //   req.body.receipt_number = generatedNumbers[3];
        //   next();
        // })

        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          req.body.patient_code = generatedNumbers[0];

          //Visit
          _mysql
            .generateRunningNumber({
              modules: ["PAT_VISIT"],
              tableName: "hims_f_app_numgen",
              identity: {
                algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                hospital_id: req.userIdentity["x-branch"]
              }
            })
            .then(generatedNumbers => {
              req.body.visit_code = generatedNumbers[0];

              //Bill
              _mysql
                .generateRunningNumber({
                  modules: ["PAT_BILL"],
                  tableName: "hims_f_app_numgen",
                  identity: {
                    algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                    hospital_id: req.userIdentity["x-branch"]
                  }
                })
                .then(generatedNumbers => {
                  req.body.bill_number = generatedNumbers[0];

                  //Receipt
                  _mysql
                    .generateRunningNumber({
                      modules: ["RECEIPT"],
                      tableName: "hims_f_app_numgen",
                      identity: {
                        algaeh_d_app_user_id:
                          req.userIdentity.algaeh_d_app_user_id,
                        hospital_id: req.userIdentity["x-branch"]
                      }
                    })
                    .then(generatedNumbers => {
                      req.body.receipt_number = generatedNumbers[0];
                      next();
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
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
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  updateFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      req.mySQl = _mysql;
      //Visit

      // _mysql
      //   .generateRunningNumber({
      //     modules: ["PAT_VISIT", "PAT_BILL", "RECEIPT"],
      //     tableName: "hims_f_app_numgen",
      //     identity: {
      //       algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
      //       hospital_id: req.userIdentity["x-branch"]
      //     },
      //     others: { printQuery: true }
      //   })
      //   .then(generatedNumbers => {
      //     console.log("generatedNumbers", generatedNumbers);
      //     req.connection = {
      //       connection: _mysql.connection,
      //       isTransactionConnection: _mysql.isTransactionConnection,
      //       pool: _mysql.pool
      //     };

      //     //Visit
      //     req.body.visit_code = generatedNumbers[1];
      //     //Bill
      //     req.body.bill_number = generatedNumbers[0];
      //     //Receipt
      //     req.body.receipt_number = generatedNumbers[2];
      //     next();
      //   })
      _mysql
        .generateRunningNumber({
          modules: ["PAT_VISIT"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          req.body.visit_code = generatedNumbers[0];

          //Bill
          _mysql
            .generateRunningNumber({
              modules: ["PAT_BILL"],
              tableName: "hims_f_app_numgen",
              identity: {
                algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                hospital_id: req.userIdentity["x-branch"]
              }
            })
            .then(generatedNumbers => {
              req.body.bill_number = generatedNumbers[0];

              //Receipt
              _mysql
                .generateRunningNumber({
                  modules: ["RECEIPT"],
                  tableName: "hims_f_app_numgen",
                  identity: {
                    algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                    hospital_id: req.userIdentity["x-branch"]
                  }
                })
                .then(generatedNumbers => {
                  req.body.receipt_number = generatedNumbers[0];
                  next();
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
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
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getCashHandoverDetailsBACKUP: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let shift_status = "";

      if (
        req.query.shift_status != "null" &&
        req.query.shift_status != null &&
        req.query.shift_status != undefined
      ) {
        shift_status = `and shift_status='${req.query.shift_status}'`;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
            hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status, open_date,\
            close_date, close_by, expected_cash, actual_cash, difference_cash, cash_status, expected_card,\
            actual_card, difference_card, card_status, expected_cheque, actual_cheque, difference_cheque, \
           cheque_status, remarks, no_of_cheques,EDM.user_id,E.full_name as employee_name,E.arabic_name as employee_arabic_name \
            from hims_f_cash_handover_header CH, hims_f_cash_handover_detail CD ,hims_m_employee_department_mappings EDM,\
            hims_d_employee E where CH.record_status='A' and EDM.record_status='A' and \
            E.record_status='A' and  CH.hims_f_cash_handover_header_id=CD.cash_handover_header_id and \
             EDM.user_id=CD.casher_id and  EDM.employee_id=E.hims_d_employee_id and shift_id=? and \
            date(daily_handover_date)=date(?) " +
            shift_status,
          values: [req.query.shift_id, req.query.daily_handover_date],
          printQuery: true
        })
        .then(cash_handover_header => {
          _mysql.releaseConnection();
          req.records = cash_handover_header;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by :irfan
  getCashHandoverDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: ` select hims_f_cash_handover_header_id,shift_id ,shift_description from\
            hims_f_cash_handover_header  H inner join  hims_d_shift S on H.shift_id=S.hims_d_shift_id\
            where H.hospital_id=? and date(daily_handover_date)=date(?);
            select   H.hims_f_cash_handover_header_id,H.shift_id,H.daily_handover_date,\
            D.hims_f_cash_handover_detail_id,D.cash_handover_header_id,D.casher_id,D.shift_status,\
            D.open_date,D.close_date,D.close_by,D.expected_cash,D.actual_cash,D.difference_cash,\
            D.cash_status,D.expected_card,D.actual_card,D.difference_card,D.card_status,\
            D.expected_cheque,D.actual_cheque,D.difference_cheque,D.cheque_status,D.remarks,D.no_of_cheques,\
            E.full_name as employee_name,E.arabic_name as employee_arabic_name \
            from hims_f_cash_handover_header H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id inner join hims_m_user_employee U on D.casher_id=U.user_id\
            inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id \
            where H.hospital_id=? and date(daily_handover_date)=date(?) ;\
            select hims_f_cash_handover_header_id,shift_id ,shift_description  from \
            hims_f_cash_handover_header  H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id \
            inner join  hims_d_shift S on H.shift_id=S.hims_d_shift_id \
            where H.hospital_id=? and D.shift_status='O'  group by H.hims_f_cash_handover_header_id;\
            select H.hims_f_cash_handover_header_id,H.shift_id,H.daily_handover_date,\
            D.hims_f_cash_handover_detail_id,D.cash_handover_header_id,D.casher_id,D.shift_status,\
            D.open_date,D.close_date,D.close_by,D.expected_cash,D.actual_cash,D.difference_cash,\
            D.cash_status,D.expected_card,D.actual_card,D.difference_card,D.card_status,\
            D.expected_cheque,D.actual_cheque,D.difference_cheque,D.cheque_status,D.remarks,D.no_of_cheques,\
            E.full_name as employee_name,E.arabic_name as employee_arabic_name \
            from hims_f_cash_handover_header H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id inner join hims_m_user_employee U on D.casher_id=U.user_id\
            inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id \
            where H.hospital_id=? and D.shift_status='O';            `,
          values: [
            req.userIdentity.hospital_id,
            req.query.daily_handover_date,
            req.userIdentity.hospital_id,
            req.query.daily_handover_date,
            req.userIdentity.hospital_id,
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          let header = result[0];
          let details = result[1];
          let open_shift_hedr = result[2];
          let open_shift_detail = result[3];

          let cash_collection = [];
          let previous_opend_shift = [];

          for (let i = 0; i < header.length; i++) {
            cash_collection.push({
              ...header[i],

              cashiers: new LINQ(details)
                .Where(
                  w =>
                    w.hims_f_cash_handover_header_id ==
                    header[i]["hims_f_cash_handover_header_id"]
                )
                .Select(S => {
                  return {
                    hims_f_cash_handover_header_id:
                      S.hims_f_cash_handover_header_id,
                    shift_id: S.shift_id,
                    daily_handover_date: S.daily_handover_date,
                    hims_f_cash_handover_detail_id:
                      S.hims_f_cash_handover_detail_id,
                    cash_handover_header_id: S.cash_handover_header_id,
                    casher_id: S.casher_id,
                    shift_status: S.shift_status,
                    open_date: S.open_date,
                    close_date: S.close_date,
                    close_by: S.close_by,
                    expected_cash: S.expected_cash,
                    actual_cash: S.actual_cash,
                    difference_cash: S.difference_cash,
                    cash_status: S.cash_status,
                    expected_card: S.expected_card,
                    actual_card: S.actual_card,
                    difference_card: S.difference_card,
                    card_status: S.card_status,
                    expected_cheque: S.expected_cheque,
                    actual_cheque: S.actual_cheque,
                    difference_cheque: S.difference_cheque,
                    cheque_status: S.cheque_status,
                    remarks: S.remarks,
                    no_of_cheques: S.no_of_cheques,
                    employee_name: S.employee_name,
                    employee_arabic_name: S.employee_arabic_name
                  };
                })
                .ToArray()
            });
          }
          for (let i = 0; i < open_shift_hedr.length; i++) {
            previous_opend_shift.push({
              ...open_shift_hedr[i],

              cashiers: new LINQ(open_shift_detail)
                .Where(
                  w =>
                    w.hims_f_cash_handover_header_id ==
                    open_shift_hedr[i]["hims_f_cash_handover_header_id"]
                )
                .Select(S => {
                  return {
                    hims_f_cash_handover_header_id:
                      S.hims_f_cash_handover_header_id,
                    shift_id: S.shift_id,
                    daily_handover_date: S.daily_handover_date,
                    hims_f_cash_handover_detail_id:
                      S.hims_f_cash_handover_detail_id,
                    cash_handover_header_id: S.cash_handover_header_id,
                    casher_id: S.casher_id,
                    shift_status: S.shift_status,
                    open_date: S.open_date,
                    close_date: S.close_date,
                    close_by: S.close_by,
                    expected_cash: S.expected_cash,
                    actual_cash: S.actual_cash,
                    difference_cash: S.difference_cash,
                    cash_status: S.cash_status,
                    expected_card: S.expected_card,
                    actual_card: S.actual_card,
                    difference_card: S.difference_card,
                    card_status: S.card_status,
                    expected_cheque: S.expected_cheque,
                    actual_cheque: S.actual_cheque,
                    difference_cheque: S.difference_cheque,
                    cheque_status: S.cheque_status,
                    remarks: S.remarks,
                    no_of_cheques: S.no_of_cheques,
                    employee_name: S.employee_name,
                    employee_arabic_name: S.employee_arabic_name
                  };
                })
                .ToArray()
            });
          }

          req.records = { cash_collection, previous_opend_shift };
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateCashHandoverDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_cash_handover_detail` SET  shift_status=?,close_date=?,close_by=?,actual_cash=?,\
            difference_cash=?,cash_status=?,actual_card=?,difference_card=?,card_status=?,actual_cheque=?,\
            difference_cheque=?,cheque_status=?,remarks=?,\
               updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_f_cash_handover_detail_id`=?;",
          values: [
            input.shift_status,
            input.close_date,
            req.userIdentity.algaeh_d_app_user_id,
            input.actual_cash,
            input.difference_cash,
            input.cash_status,
            input.actual_card,
            input.difference_card,
            input.card_status,
            input.actual_cheque,
            input.difference_cheque,
            input.cheque_status,
            input.remarks,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_cash_handover_detail_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
