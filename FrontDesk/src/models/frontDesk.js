import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import moment from "moment";

export default {
  selectFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = req.query;
      /* Select statemwnt  */

      let inputValues = [];
      let _stringData = "";
      // _stringData += " and hospital_id=?";
      // inputValues.push(req.userIdentity.hospital_id);

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
            "SELECT param_value from algaeh_d_app_config WHERE algaeh_d_app_config_id=11 \
              and record_status='A';SELECT  `hims_d_patient_id`, `patient_code`\
          , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`,`full_name`, `arabic_name`\
          , `gender`, `religion_id`,`date_of_birth`, `age`,`blood_group`, `marital_status`, `address1`\
          , `address2`,`contact_number`, `secondary_contact_number`, `email`\
          , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
          , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`,referring_institute_id\
          , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`,`vat_applicable`\
          , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount`,\
          `patient_type` , `employee_id`, `tel_code` FROM `hims_f_patient` \
           WHERE `record_status`='A'" +
            _stringData,
          values: inputValues,
          // printQuery: true,
        })
        .then((patient_details) => {
          if (patient_details[1].length > 0) {
            const utilities = new algaehUtilities();

            let hims_d_patient_id = patient_details[1][0]["hims_d_patient_id"];
            let param_value = -patient_details[0][0]["param_value"];

            // utilities.logger().log("hims_d_patient_id: ", hims_d_patient_id);
            // utilities.logger().log("param_value: ", param_value);

            let input_Values = [];
            let _string_Data = "";
            _string_Data += " and patient_id=?";
            input_Values.push(hims_d_patient_id);

            // console.log("expiry_visit: ", input.expiry_visit);

            if (input.expiry_visit != null) {
              var expiry_date = moment(new Date()).format("YYYY-MM-DD");

              _string_Data +=
                " and date(visit_expiery_date) >= date('" + expiry_date + "')";

              _string_Data += " and visit_status='O'";
            } else {
              _string_Data += " and visit_status!='CN'";
            }

            _mysql
              .executeQuery({
                query:
                  "SELECT 0 radioselect,`hims_f_patient_visit_id`, `patient_id`,`visit_code`,`visit_status`, \
                  `visit_type`, `visit_date`, V.`department_id`, V.`sub_department_id`, \
                  `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`, \
                  `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`, `no_free_visit`,\
                  `visit_expiery_date`,`visit_status`,`sub_department_name`,`full_name`\
                  FROM `hims_f_patient_visit` V, hims_d_sub_department SD, hims_d_employee E  \
                  WHERE V.`record_status`='A' AND V.sub_department_id = SD.hims_d_sub_department_id AND \
                  doctor_id =E.hims_d_employee_id " +
                  _string_Data +
                  "  ORDER BY hims_f_patient_visit_id desc",
                values: input_Values,
                // // printQuery: true,
              })
              .then((visit_detsils) => {
                req.connection = {
                  connection: _mysql.connection,
                  isTransactionConnection: _mysql.isTransactionConnection,
                  pool: _mysql.pool,
                };
                // _mysql.releaseConnection();
                let result = {
                  patientRegistration: patient_details[1][0],
                  visitDetails: visit_detsils,
                };
                req.records = result;

                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            next(new Error("Selected patient does not exists"));
          }
        })
        .catch((e) => {
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
      // console.log("mrn_num_sep_cop_client", req.body.mrn_num_sep_cop_client);
      // console.log("insurance_type", req.body.insurance_type);
      // const { primary_insurance_provider_id } = req.body;
      let custom = {};
      let numGens = ["PAT_VISIT"];
      if (
        req.body.mrn_num_sep_cop_client === "Y" &&
        req.body.insurance_type === "C"
      ) {
        custom = {
          custom: {
            returnKey: "PAT_REGS",
            primaryKeyName: "hims_d_insurance_provider_id",
            tableName: "hims_d_insurance_provider",
            primaryKeyValue: req.body.primary_insurance_provider_id,
            descriptionKeyName: "insurance_provider_name",
          },
        };
      } else {
        numGens.push("PAT_REGS");
        custom = {};
      }
      if (req.body.consultation === "Y") {
        numGens.push("PAT_BILL", "RECEIPT");
      }
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          // numgexn_codes: ["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"],
          numgen_codes: numGens,
          table_name: "hims_f_app_numgen",
          ...custom,
        })

        .then((generatedNumbers) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          req.body.patient_code = generatedNumbers.PAT_REGS;
          req.body.visit_code = generatedNumbers.PAT_VISIT;
          req.body.bill_number = generatedNumbers.PAT_BILL;
          req.body.receipt_number = generatedNumbers.RECEIPT;
          next();
        })
        .catch((e) => {
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
      req.mySQl = _mysql;
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["PAT_VISIT", "PAT_BILL", "RECEIPT"],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          req.body.visit_code = generatedNumbers.PAT_VISIT;
          req.body.bill_number = generatedNumbers.PAT_BILL;
          req.body.receipt_number = generatedNumbers.RECEIPT;
          next();
        })
        .catch((e) => {
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
  getCashForDashBoard: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;
      _mysql
        .executeQuery({
          query: `SELECT USR.user_display_name,CSH.daily_handover_date,CSD.cash_handover_header_id,
          coalesce(CSD.expected_cash,0) as expected_cash,
          coalesce(CSD.expected_card,0) as expected_card,
          coalesce(CSD.expected_cheque,0) as expected_cheque
         
          FROM hims_f_cash_handover_detail as CSD
          inner join hims_f_cash_handover_header CSH on CSH.hims_f_cash_handover_header_id=CSD.cash_handover_header_id
          left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=CSD.casher_id
          where CSD.hospital_id=? and CSH.record_status = 'A' and CSD.record_status = 'A' and date(CSH.daily_handover_date) between date(?) and date(?) and CSD.casher_id=?;`,
          values: [
            input.hospital_id,
            input.from_date,
            input.to_date,
            input.casher_id,
          ],
          // printQuery: true,
        })
        .then((cash_handover) => {
          _mysql.releaseConnection();
          req.records = cash_handover;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getFrontDeskDataForEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "created_by=" +
          input.created_by +
          " and  date(visit_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  SELECT appointment_patient,visit_date FROM hims_f_patient_visit  where   
            ${_stringData}  `,

          // printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getFrontDeskDataForWeek: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          " and created_by=" +
          input.created_by +
          " and  date(visit_date) between date('" +
          input.from_date +
          "') and date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  SELECT appointment_patient,visit_date FROM hims_f_patient_visit  where  visit_type='10'   
            ${_stringData}  `,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          const arrangedData = _.chain(result)
            .groupBy((g) => moment(g.visit_date).format("YYYY-MM-DD"))
            .map((details, key) => {
              const { visit_date } = _.head(details);

              return {
                date: visit_date,
                detailsOf: _.chain(details)
                  .groupBy((it) => it.appointment_patient)
                  .map((detail, index) => {
                    const { appointment_patient, visit_date } = _.head(detail);
                    return {
                      appointment_patient: appointment_patient,
                      detail: detail,
                      date: visit_date,
                    };
                  })
                  .value(),
              };
            })
            .value();
          req.records = arrangedData;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getFrontDeskDashboardForSubdept: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "PV.created_by=" +
          input.created_by +
          " and  date(visit_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  SELECT PV.sub_department_id,PV.visit_date,SD.hims_d_sub_department_id,SD.sub_department_name
          FROM hims_f_patient_visit PV 
           left join hims_d_sub_department SD on PV.sub_department_id=SD.hims_d_sub_department_id  where   
            ${_stringData}  `,

          // printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          const arrangedData = _.chain(result)
            .groupBy((g) => g.sub_department_name)
            .map((details, key) => {
              const { sub_department_name } = _.head(details);

              return {
                sub_department_name: sub_department_name,
                detailsOf: details,
              };
            })
            .value();
          req.records = arrangedData;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getFrontDeskDashboardDoctor: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "and PV.created_by=" +
          input.created_by +
          " and  date(visit_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  SELECT PV.sub_department_id,PV.visit_date,PV.doctor_id,E.full_name
          FROM hims_f_patient_visit PV 
           left join hims_d_employee E on PV.doctor_id=E.hims_d_employee_id where visit_type='10'   
            ${_stringData}  `,

          // printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          const arrangedData = _.chain(result)
            .groupBy((g) => g.doctor_id)
            .map((details, key) => {
              const { full_name } = _.head(details);

              return {
                full_name: full_name,
                detailsOf: details,
              };
            })
            .value();
          req.records = arrangedData;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
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
          // printQuery: true,
        })
        .then((cash_handover_header) => {
          _mysql.releaseConnection();
          req.records = cash_handover_header;
          next();
        })
        .catch((e) => {
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
      let strQry = "";
      if (req.query.user_wise == "true") {
        strQry = " and D.casher_id = " + req.userIdentity.algaeh_d_app_user_id;
      }
      _mysql
        .executeQuery({
          query: ` select hims_f_cash_handover_header_id,shift_id ,shift_description,daily_handover_date from\
            hims_f_cash_handover_header  H inner join  hims_d_shift S on H.shift_id=S.hims_d_shift_id\
            where H.hospital_id=? and date(daily_handover_date)=date(?);
            select   H.hims_f_cash_handover_header_id,H.shift_id,H.daily_handover_date,\
            D.hims_f_cash_handover_detail_id,D.cash_handover_header_id,D.casher_id,D.shift_status,\
            D.collected_cash,D.refunded_cash,\
            D.open_date,D.close_date,D.close_by,D.expected_cash,D.actual_cash,D.difference_cash,\
            D.cash_status,D.expected_card,D.actual_card,D.difference_card,D.card_status,\
            D.expected_cheque,D.actual_cheque,D.difference_cheque,D.cheque_status,D.remarks,D.no_of_cheques,\
            E.full_name as employee_name,E.arabic_name as employee_arabic_name,E.employee_code \
            from hims_f_cash_handover_header H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id inner join algaeh_d_app_user U on D.casher_id=U.algaeh_d_app_user_id\
            inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id \
            where H.hospital_id=? and date(daily_handover_date)=date(?)  ${strQry} ;\
            select hims_f_cash_handover_header_id,shift_id ,shift_description,daily_handover_date  from \
            hims_f_cash_handover_header  H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id \
            inner join  hims_d_shift S on H.shift_id=S.hims_d_shift_id \
            where H.hospital_id=? and D.shift_status='O' ${strQry} group by H.hims_f_cash_handover_header_id;\
            select H.hims_f_cash_handover_header_id,H.shift_id,H.daily_handover_date,\
            D.hims_f_cash_handover_detail_id,D.cash_handover_header_id,D.casher_id,D.shift_status,\
            D.collected_cash,D.refunded_cash,
            D.open_date,D.close_date,D.close_by,D.expected_cash,D.actual_cash,D.difference_cash,\
            D.cash_status,D.expected_card,D.actual_card,D.difference_card,D.card_status,\
            D.expected_cheque,D.actual_cheque,D.difference_cheque,D.cheque_status,D.remarks,D.no_of_cheques,\
            E.full_name as employee_name,E.arabic_name as employee_arabic_name,E.employee_code \
            from hims_f_cash_handover_header H inner join hims_f_cash_handover_detail D on \
            H.hims_f_cash_handover_header_id=D.cash_handover_header_id inner join algaeh_d_app_user U on D.casher_id=U.algaeh_d_app_user_id\
            inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id \
            where H.hospital_id=? and D.shift_status='O' ${strQry};`,
          values: [
            req.userIdentity.hospital_id,
            req.query.daily_handover_date,
            req.userIdentity.hospital_id,
            req.query.daily_handover_date,
            req.userIdentity.hospital_id,
            req.userIdentity.hospital_id,
          ],
          // printQuery: true,
        })
        .then((result) => {
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
                  (w) =>
                    w.hims_f_cash_handover_header_id ==
                    header[i]["hims_f_cash_handover_header_id"]
                )
                .Select((S) => {
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
                    employee_code: S.employee_code,
                    employee_arabic_name: S.employee_arabic_name,
                    collected_cash: S.collected_cash,
                    refunded_cash: S.refunded_cash,
                  };
                })
                .ToArray(),
            });
          }
          for (let i = 0; i < open_shift_hedr.length; i++) {
            previous_opend_shift.push({
              ...open_shift_hedr[i],

              cashiers: new LINQ(open_shift_detail)
                .Where(
                  (w) =>
                    w.hims_f_cash_handover_header_id ==
                    open_shift_hedr[i]["hims_f_cash_handover_header_id"]
                )
                .Select((S) => {
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
                    employee_code: S.employee_code,
                    employee_arabic_name: S.employee_arabic_name,

                    collected_cash: S.collected_cash,
                    refunded_cash: S.refunded_cash,
                  };
                })
                .ToArray(),
            });
          }

          req.records = { cash_collection, previous_opend_shift };
          next();
        })
        .catch((e) => {
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
            input.hims_f_cash_handover_detail_id,
          ],
          // printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
export function getDoctorAndDepartment(req, res, next) {
  const _mysql = new algaehMysql();
  const { hims_d_hospital_id } = req.userIdentity;
  try {
    _mysql
      .executeQuery({
        query: `
        select distinct UE.employee_id, E.sub_department_id, E.full_name, E.arabic_name, E.services_id,E.work_email,
        SD.department_id, SD.sub_department_name, SD.arabic_sub_department_name, SD.department_type , S.service_type_id
        from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id 
        and  E.isdoctor='Y' inner join hims_d_department D on SD.department_id=D.hims_d_department_id 
        inner join hims_m_user_employee as UE on UE.employee_id = E.hims_d_employee_id and  D.department_type='CLINICAL' 
        inner join hims_d_services as S on S.hims_d_services_id = E.services_id 
        where E.employee_status='A'  and SD.sub_department_status='A' and SD.record_status='A' and E.record_status ='A' 
        and UE.hospital_id=? and services_id is not null;`,
        values: [hims_d_hospital_id],
        // printQuery: true,
      })
      .then((result) => {
        const docDept = _.chain(result)
          .groupBy((g) => g.sub_department_id)
          .map((detail, key) => {
            const {
              department_id,
              sub_department_name,
              arabic_sub_department_name,
              sub_department_id,
              department_type,
              full_name,
            } = detail[0];
            return {
              label: sub_department_name,
              arlabel: arabic_sub_department_name,
              value: sub_department_id,
              doctor_name: full_name,
              children: detail.map((item) => {
                return {
                  department_id: department_id,
                  label: item.full_name,
                  arlabel: item.arabic_name,
                  value: item.employee_id,
                  services_id: item.services_id,
                  service_type_id: item.service_type_id,
                  sub_department_id,
                  department_type,
                };
              }),
            };
          })
          .value();
        req.records = docDept;
        next();
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
