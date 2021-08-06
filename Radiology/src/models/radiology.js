import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import appsettings from "algaeh-utilities/appsettings.json";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";
import dotenv from "dotenv";
import axios from "axios";
import "regenerator-runtime/runtime";

if (process.env.NODE_ENV !== "production") dotenv.config();

const processENV = process.env;
const PORTAL_HOST = processENV.PORTAL_HOST ?? "http://localhost:4402/api/v1/";

export default {
  getRadOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getRadOrderedServices: ");
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

      if (req.query.hims_f_rad_order_id != null) {
        _stringData += " and SA.hims_f_rad_order_id=?";
        inputValues.push(req.query.hims_f_rad_order_id);
      }

      if (req.query.visit_id != null) {
        _stringData += " and visit_id=?";
        inputValues.push(req.query.visit_id);
      }

      // utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_rad_order_id,V.patient_id,visit_id,provider_id, template_id, billed, service_id,\
            SR.service_code,SR.service_name,status, cancelled, ordered_by, ordered_date, test_type, technician_id, \
            scheduled_date_time,scheduled_by,arrived_date,arrived,validate_by,result_html,validate_date_time,\
            attended_by,attended_date_time,exam_start_date_time,exam_end_date_time,exam_status,report_type,comments,\
            PAT.primary_id_no,PAT.patient_code,PAT.full_name,PAT.date_of_birth,PAT.gender, EMP.full_name as refered_name,\
            V.visit_code from ((hims_f_rad_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
            inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
            inner join hims_d_employee EMP on EMP.hims_d_employee_id=SA.provider_id)  \
            left join hims_d_title as T on T.his_d_title_id = EMP.title_id \
            inner join hims_f_patient_visit as V on V.hims_f_patient_visit_id=SA.visit_id  WHERE " +
            _stringData +
            " order by hims_f_rad_order_id desc",
          values: inputValues,
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
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
  getRadOrderedBy: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      // utilities.logger().log("getRadOrderedServices: ");

      _mysql
        .executeQuery({
          query: `SELECT  hims_f_rad_order_id,
            if(CL.algaeh_d_app_user_id=SA.scheduled_by, EM.full_name,'') as scheduled_by_name,
            if(CL.algaeh_d_app_user_id=SA.validate_by, EM.full_name,'') as validate_by_name,
            if(CL.algaeh_d_app_user_id=SA.ordered_by, EM.full_name,'') as ordered_by_name            
            from hims_f_rad_order SA 
            left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=SA.scheduled_by or
            CL.algaeh_d_app_user_id=SA.validate_by or CL.algaeh_d_app_user_id=SA.ordered_by )
            left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id
             WHERE hims_f_rad_order_id=?;`,
          values: [req.query.hims_f_rad_order_id],
          printQuery: true,
        })
        .then((result) => {
          let list = result.reduce(function (acc, item) {
            let obj = { ...item };
            Object.keys(obj).forEach(function (item) {
              if (acc[item]) {
                //if a property with the the key, 'item' already exists, then append to that
                Object.assign(acc[item], obj[item]);
              } else {
                // else add the key-value pair to the accumulator object.
                acc[item] = obj[item];
              }
            });
            return acc;
          }, {});

          _mysql.releaseConnection();
          req.records = list;
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
      // const utilities = new algaehUtilities();
      // utilities.logger().log("Rad Bill: ", req.body.incharge_or_provider);
      let inputParam = { ...req.body };
      const IncludeValues = [
        "ordered_services_id",
        "ordered_package_id",
        "billing_header_id",
        "patient_id",
        "visit_id",
        "provider_id",
        "service_id",
        "billed",
        "ordered_date",
        "ordered_by",
        "test_type",
      ];
      let Services =
        req.records.ResultOfFetchOrderIds == null
          ? req.body.billdetails
          : req.records.ResultOfFetchOrderIds;

      const radServices = Services.filter(
        (f) =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Radiology
      ).map((s) => {
        return {
          ordered_services_id: s.hims_f_ordered_services_id || null,
          ordered_package_id: s.ordered_package_id || null,
          billing_header_id: req.body.hims_f_billing_header_id || null,
          patient_id: req.body.patient_id,
          provider_id: req.body.incharge_or_provider,
          visit_id: req.body.visit_id,
          service_id: s.services_id,
          billed: req.body.billed,
          ordered_date: new Date(),
          // ordered_by: s.ordered_by,
          test_type: s.test_type,
        };
      });

      if (radServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT ignore  INTO hims_f_rad_order(??)  VALUES ?",
            values: radServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              ordered_by: req.userIdentity.algaeh_d_app_user_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((insert_rad_order) => {
            if (inputParam.consultation == "Y") {
              req.records = insert_rad_order;
              next();
            } else {
              let result = {
                receipt_number: inputParam.receipt_number,
                bill_number: inputParam.bill_number,
                hims_f_billing_header_id: inputParam.hims_f_billing_header_id,
              };
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            }
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        if (inputParam.consultation == "Y") {
          req.records = radServices;
          next();
        } else {
          let result = {
            receipt_number: inputParam.receipt_number,
            bill_number: inputParam.bill_number,
            hims_f_billing_header_id: inputParam.hims_f_billing_header_id,
          };
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
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
      // utilities.logger().log("updateRadOrderedServices ");
      // console.log("4567");

      let inputParam = { ...req.body };
      let strQuery = "";
      if (inputParam.scheduled_by == null && inputParam.status == "S") {
        strQuery =
          ", scheduled_by =" +
          req.userIdentity.algaeh_d_app_user_id +
          ", scheduled_date_time = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'";
      }
      if (inputParam.validate_by == null && inputParam.status == "RA") {
        strQuery =
          ",validate_by =" +
          req.userIdentity.algaeh_d_app_user_id +
          ",validate_date_time = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'";
      }
      if (
        inputParam.attended_by == null &&
        inputParam.status == "V" &&
        inputParam.report_type == "AD"
      ) {
        strQuery =
          ",attended_by =" +
          req.userIdentity.algaeh_d_app_user_id +
          ",attended_date_time = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'";
      }
      if (inputParam.status == "UP") {
        strQuery = ",technician_id =" + req.userIdentity.algaeh_d_app_user_id;
      }

      // console.log("strQuery", strQuery);

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_rad_order` \
          SET `status`=?,  `cancelled`=?, `arrived_date`=?,\
          `arrived`=?, `exam_start_date_time`=?, `exam_end_date_time`=?, `exam_status`=?, `report_type`=?, \
          `template_id`=?, `result_html`=?, `comments`=? " +
            strQuery +
            " WHERE `hims_f_rad_order_id`=?; SELECT portal_exists FROM hims_d_hospital where hims_d_hospital_id=?;",
          values: [
            inputParam.status,
            inputParam.cancelled,
            inputParam.arrived_date,
            inputParam.arrived,
            inputParam.exam_start_date_time,
            inputParam.exam_end_date_time,
            inputParam.exam_status,
            inputParam.report_type,
            inputParam.template_id,
            inputParam.result_html,
            inputParam.comments,
            inputParam.hims_f_rad_order_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then(async (update_rad_order) => {
          // consol.log("4567");
          // console.log("status", inputParam.status);
          // consol.log("portal_exists", update_rad_order[1][0].portal_exists);
          const portal_exists = update_rad_order[1][0].portal_exists;
          // console.log("portal_exists", portal_exists);
          // consol.log("portal_exists", portal_exists);

          if (portal_exists === "Y" && inputParam.status === "RA") {
            const portal_data = {
              service_id: inputParam.service_id,
              visit_code: inputParam.visit_code,
              patient_identity: inputParam.primary_id_no,
              service_status: "RESULT VALIDATED",
            };

            // console.log("portal_data", portal_data);
            // consol.log("portal_data", portal_data);
            await axios
              .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
              .catch((e) => {
                throw e;
              });
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = update_rad_order;
              next();
            });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = update_rad_order;
              next();
            });
          }
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

  getRadTemplateList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getRadTemplateList: ");

      _mysql
        .executeQuery({
          query:
            "SELECT distinct TD.template_name, TD.template_html, IT.hims_d_investigation_test_id,\
            TD.hims_d_rad_template_detail_id \
            FROM hims_d_investigation_test IT, \
            hims_d_rad_template_detail TD  WHERE IT.hims_d_investigation_test_id = TD.test_id AND services_id=?",
          values: [req.query.services_id],
          printQuery: true,
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

  updateRadOrderedBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    // const utilities = new algaehUtilities();
    // utilities.logger().log("updateRadOrderedBilled: ");
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          (w) =>
            w.hims_f_ordered_services_id != null &&
            w.service_type_id ==
              appsettings.hims_d_service_type.service_type_id.Radiology
        )
        .Select((s) => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      let qry = "";

      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_rad_order` SET billing_header_id=?, billed=?,\
          updated_date=?,updated_by=? where ordered_services_id=?;",
            [
              req.body.hims_f_billing_header_id,
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].ordered_services_id,
            ]
          );
        }

        // utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((rad_result) => {
            // utilities
            //   .logger()
            //   .log(
            //     "update hims_f_billing_header_id: ",
            //     req.body.hims_f_billing_header_id
            //   );
            let result = {
              receipt_number: req.body.receipt_number,
              bill_number: req.body.bill_number,
              hims_f_billing_header_id: req.body.hims_f_billing_header_id,
            };
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch((e) => {
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
  },
};
