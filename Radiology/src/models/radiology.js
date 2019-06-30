import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import appsettings from "algaeh-utilities/appsettings.json";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";

module.exports = {
  getRadOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getRadOrderedServices: ");
      let inputValues = [];
      let _stringData = "";

      if (req.query.from_date != null) {
        _stringData +=
          "date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += "date(ordered_date) <= date(now())";
      }

      if (req.query.patient_id != null) {
        _stringData += " and SA.patient_id=?";
        inputValues.push(req.query.patient_id);
      }

      if (req.query.status != null) {
        _stringData += " and SA.status=?";
        inputValues.push(req.query.status);
      }

      if (req.query.test_type != null) {
        _stringData += " and SA.test_type=?";
        inputValues.push(req.query.test_type);
      }

      utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_rad_order_id,patient_id,visit_id,provider_id, template_id, billed, service_id,\
            SR.service_code,SR.service_name,status, cancelled, ordered_by, ordered_date, test_type, technician_id, \
            scheduled_date_time,scheduled_by,arrived_date,arrived,validate_by,result_html,validate_date_time,\
            attended_by,attended_date_time,exam_start_date_time,exam_end_date_time,exam_status,report_type,comments,\
            PAT.patient_code,PAT.full_name,PAT.date_of_birth,PAT.gender,EMP.full_name as refered_name\
            from ((hims_f_rad_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
            inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
            inner join hims_d_employee EMP on EMP.hims_d_employee_id=SA.provider_id)  WHERE " +
            _stringData +
            " order by hims_f_rad_order_id desc",
          values: inputValues,
          printQuery: true
        })
        .then(result => {
          utilities.logger().log("result: ", result);
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  // getRadOrderedServices: (req, res, next) => {
  //   return new Promise((resolve, reject) => {
  //     const _mysql = new algaehMysql();
  //     try {
  //       _mysql
  //         .executeQuery({
  //           query: "",
  //           values: [],
  //           printQuery: true
  //         })
  //         .then(result => {
  //           _mysql.releaseConnection();
  //           req.records = result;
  //           resolve(result);
  //           next();
  //         })
  //         .catch(error => {
  //           _mysql.releaseConnection();
  //           reject(error);
  //           next(error);
  //         });
  //     } catch (e) {
  //       _mysql.releaseConnection();
  //       next(e);
  //     }
  //   }).catch(e => {
  //     _mysql.releaseConnection();
  //     next(e);
  //   });
  // },

  insertRadOrderedServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("Rad Bill: ", req.body.incharge_or_provider);
      let inputParam = { ...req.body };
      const IncludeValues = [
        "ordered_services_id",
        "patient_id",
        "visit_id",
        "provider_id",
        "service_id",
        "billed",
        "ordered_date",
        "ordered_by",
        "test_type"
      ];
      // let Services = req.records.ResultOfFetchOrderIds || req.body.billdetails;
      const radServices = new LINQ(req.body.billdetails)
        .Where(
          w =>
            w.service_type_id ==
            appsettings.hims_d_service_type.service_type_id.Radiology
        )
        .Select(s => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id || null,
            patient_id: req.body.patient_id,
            provider_id: req.body.incharge_or_provider,
            visit_id: req.body.visit_id,
            service_id: s.services_id,
            billed: req.body.billed,
            ordered_date: s.created_date,
            ordered_by: s.ordered_by,
            test_type: s.test_type
          };
        })
        .ToArray();

      utilities.logger().log("radServices: ", radServices.length);
      if (radServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_rad_order(??) VALUES ?",
            values: radServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(insert_rad_order => {
            utilities.logger().log("insert_rad_order: ");
            utilities
              .logger()
              .log(
                "insert hims_f_billing_header_id: ",
                inputParam.hims_f_billing_header_id
              );
            let result = {
              receipt_number: inputParam.receipt_number,
              bill_number: inputParam.bill_number,
              hims_f_billing_header_id: inputParam.hims_f_billing_header_id
            };
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        utilities.logger().log("result: ", result);
        utilities
          .logger()
          .log(
            "insert hims_f_billing_header_id: ",
            inputParam.hims_f_billing_header_id
          );
        let result = {
          receipt_number: inputParam.receipt_number,
          bill_number: inputParam.bill_number,
          hims_f_billing_header_id: inputParam.hims_f_billing_header_id
        };
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateRadOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateRadOrderedServices ");
      let inputParam = { ...req.body };
      if (inputParam.scheduled_by == null && inputParam.status == "S") {
        inputParam.scheduled_by = req.userIdentity.algaeh_d_app_user_id;
      }
      if (inputParam.validate_by == null && inputParam.status == "RA") {
        inputParam.validate_by = req.userIdentity.algaeh_d_app_user_id;
      }
      if (
        inputParam.attended_by == null &&
        inputParam.status == "V" &&
        inputParam.report_type == "AD"
      ) {
        inputParam.attended_by = req.userIdentity.algaeh_d_app_user_id;
      }
      if (inputParam.status == "UP") {
        inputParam.technician_id = req.userIdentity.algaeh_d_app_user_id;
      }

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_rad_order` \
          SET `status`=?,  `cancelled`=?,`scheduled_date_time`=?, `scheduled_by`=?, `arrived_date`=?,\
          `arrived`=?,`validate_by`=?, `validate_date_time` = ?, `attended_by`=?, `attended_date_time`=?,\
          `exam_start_date_time`=?, `exam_end_date_time`=?, `exam_status`=?, `report_type`=?,\
          `technician_id`=?, `template_id`=?, `result_html`=?, `comments`=?\
          WHERE `hims_f_rad_order_id`=?",
          values: [
            inputParam.status,
            inputParam.cancelled,
            inputParam.scheduled_date_time,
            inputParam.scheduled_by,
            inputParam.arrived_date,
            inputParam.arrived,
            inputParam.validate_by,
            inputParam.validate_date_time,
            inputParam.attended_by,
            inputParam.attended_date_time,
            inputParam.exam_start_date_time,
            inputParam.exam_end_date_time,
            inputParam.exam_status,
            inputParam.report_type,
            inputParam.technician_id,
            inputParam.template_id,
            inputParam.result_html,
            inputParam.comments,
            inputParam.hims_f_rad_order_id
          ],
          printQuery: true
        })
        .then(update_rad_order => {
          _mysql.releaseConnection();
          req.records = update_rad_order;
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

  getRadTemplateList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getRadTemplateList: ");

      _mysql
        .executeQuery({
          query:
            "SELECT distinct TD.template_name, TD.template_html, IT.hims_d_investigation_test_id,\
            TD.hims_d_rad_template_detail_id \
            FROM hims_d_investigation_test IT, \
            hims_d_rad_template_detail TD  WHERE IT.hims_d_investigation_test_id = TD.test_id AND services_id=?",
          values: [req.query.services_id],
          printQuery: true
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateRadOrderedBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    utilities.logger().log("updateRadOrderedBilled: ");
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          w =>
            w.ordered_services_id != null &&
            w.service_type_id ==
              appsettings.hims_d_service_type.service_type_id.Radiology
        )
        .Select(s => {
          return {
            ordered_services_id: s.ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id
          };
        })
        .ToArray();

      let qry = "";

      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_rad_order` SET billed=?,\
          updated_date=?,updated_by=? where ordered_services_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].ordered_services_id
            ]
          );
        }

        utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(rad_result => {
            utilities
              .logger()
              .log(
                "update hims_f_billing_header_id: ",
                req.body.hims_f_billing_header_id
              );
            let result = {
              receipt_number: req.body.receipt_number,
              bill_number: req.body.bill_number,
              hims_f_billing_header_id: req.body.hims_f_billing_header_id
            };
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = { RAD: true };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
