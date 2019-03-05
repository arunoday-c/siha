import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  selectFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = req.query;
      /* Select statemwnt  */

      let inputValues = [];
      let _stringData = "";
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
          , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount`,`patient_type` FROM `hims_f_patient` \
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
          modules: ["PAT_REGS"]
        })
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
              modules: ["PAT_VISIT"]
            })
            .then(generatedNumbers => {
              req.body.visit_code = generatedNumbers[0];

              //Bill
              _mysql
                .generateRunningNumber({
                  modules: ["PAT_BILL"]
                })
                .then(generatedNumbers => {
                  req.body.bill_number = generatedNumbers[0];

                  //Receipt
                  _mysql
                    .generateRunningNumber({
                      modules: ["RECEIPT"]
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
      _mysql
        .generateRunningNumber({
          modules: ["PAT_VISIT"]
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
              modules: ["PAT_BILL"]
            })
            .then(generatedNumbers => {
              req.body.bill_number = generatedNumbers[0];

              //Receipt
              _mysql
                .generateRunningNumber({
                  modules: ["RECEIPT"]
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
  getCashHandoverDetails: (req, res, next) => {
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
            input.close_by,
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
            input.updated_by,
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
