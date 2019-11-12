import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import mysql from "mysql";
import moment from "moment";

export default {
  addOpBIlling: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      //Bill
      _mysql
        .generateRunningNumber({
          modules: ["PAT_BILL"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          req.body.bill_number = generatedNumbers[0];

          //Receipt
          _mysql
            .generateRunningNumber({
              modules: ["RECEIPT"],
              tableName: "hims_f_app_numgen",
              identity: {
                algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                hospital_id: req.userIdentity.hospital_id
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateOrderedConsumablessBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateOrderedServicesBilled: ");

      let OrderServices = new LINQ(req.body.billdetails)
        .Where(w => w.ordered_inventory_id != null)
        .Select(s => {
          return {
            hims_f_ordered_inventory_id: s.ordered_inventory_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id
          };
        })
        .ToArray();

      let qry = "";
      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          utilities.logger().log("billed: ", OrderServices[i].billed);
          utilities.logger().log("updated_by: ", OrderServices[i].updated_by);
          utilities
            .logger()
            .log("billed: ", OrderServices[i].hims_f_ordered_inventory_id);

          qry += mysql.format(
            "UPDATE `hims_f_ordered_inventory` SET billed=?,\
              updated_date=?,updated_by=? where hims_f_ordered_inventory_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_ordered_inventory_id
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(updateOrder => {
            if (req.connection == null) {
              req.records = updateOrder;
              next();
            } else {
              next();
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        utilities.logger().log("Else: ");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateOrderedServicesBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateOrderedServicesBilled: ");

      utilities.logger().log("OrderServices: ", req.body.billdetails);

      let OrderServices = new LINQ(req.body.billdetails)
        .Where(w => w.hims_f_ordered_services_id != null)
        .Select(s => {
          return {
            hims_f_ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id
          };
        })
        .ToArray();

      let dentalTreatment = new LINQ(req.body.billdetails)
        .Where(w => w.d_treatment_id != null)
        .Select(s => {
          return {
            hims_f_dental_treatment_id: s.d_treatment_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id
          };
        })
        .ToArray();
      utilities.logger().log("OrderServices 1: ", OrderServices);
      let qry = "";
      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          utilities.logger().log("billed: ", OrderServices[i].billed);
          utilities.logger().log("updated_by: ", OrderServices[i].updated_by);
          utilities
            .logger()
            .log("billed: ", OrderServices[i].hims_f_ordered_services_id);

          qry += mysql.format(
            "UPDATE `hims_f_ordered_services` SET billed=?,\
              updated_date=?,updated_by=? where hims_f_ordered_services_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_ordered_services_id
            ]
          );
        }
        if (dentalTreatment.length > 0) {
          for (let i = 0; i < dentalTreatment.length; i++) {
            qry += mysql.format(
              "UPDATE `hims_f_dental_treatment` SET billed=?,\
                updated_date=?,updated_by=? where hims_f_dental_treatment_id=?;",
              [
                dentalTreatment[i].billed,
                moment().format("YYYY-MM-DD HH:mm"),
                dentalTreatment[i].updated_by,
                dentalTreatment[i].hims_f_dental_treatment_id
              ]
            );
          }
        }

        utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(updateOrder => {
            if (req.connection == null) {
              req.records = updateOrder;
              next();
            } else {
              next();
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        utilities.logger().log("Else: ");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateOrderedPackageBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateOrderedPackageBilled: ");

      let OrderServices = new LINQ(req.body.billdetails)
        .Where(w => w.ordered_package_id != null)
        .Select(s => {
          return {
            hims_f_package_header_id: s.ordered_package_id,
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
            "UPDATE `hims_f_package_header` SET billed=?,\
                updated_date=?,updated_by=? where hims_f_package_header_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_package_header_id
            ]
          );
        }

        utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(updateOrder => {
            if (req.connection == null) {
              req.records = updateOrder;
              next();
            } else {
              next();
            }
            // let package_header_id = _.map(OrderServices, o => {
            //   return o.hims_f_package_header_id;
            // });
            // _mysql
            //   .executeQuery({
            //     query:
            //       "select *,service_id as services_id, now() as created_date  from hims_f_package_detail where package_header_id in (?)",
            //     values: [package_header_id],
            //     printQuery: true
            //   })
            //   .then(package_details => {
            //     // let data = req.body.billdetails.concat(package_details);
            //     req.body.billdetails = req.body.billdetails.concat(
            //       package_details
            //     );
            //
            //     utilities.logger().log("billdetails: ", req.body.billdetails);
            //
            //     if (req.connection == null) {
            //       req.records = updateOrder;
            //       next();
            //     } else {
            //       next();
            //     }
            //   })
            //   .catch(error => {
            //     _mysql.releaseConnection();
            //     next(error);
            //   });
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        utilities.logger().log("Else: ");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  selectBill: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("selectBill: ");
      _mysql
        .executeQuery({
          query:
            "SELECT *,emp.full_name as doctor_name, bh.patient_payable as patient_payable_h  FROM hims_f_billing_header bh \
          left join hims_d_employee as emp on bh.incharge_or_provider = emp.hims_d_employee_id\
          inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id\
          inner join hims_f_patient_visit as vst on bh.visit_id = vst.hims_f_patient_visit_id\
          where bh.record_status='A' AND bh.bill_number='" +
            req.query.bill_number +
            "'",

          printQuery: true
        })
        .then(headerResult => {
          utilities.logger().log("headerResult: ", headerResult);
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_billing_details, hims_d_services where \
                  hims_f_billing_details.services_id = hims_d_services.hims_d_services_id and \
                  hims_f_billing_header_id=? and hims_f_billing_details.record_status='A'",
                values: [headerResult[0].hims_f_billing_header_id],
                printQuery: true
              })
              .then(billdetails => {
                req.records = {
                  ...headerResult[0],
                  ...{ billdetails },
                  ...{
                    hims_f_receipt_header_id: headerResult[0].receipt_header_id
                  }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            req.records = headerResult;
            _mysql.releaseConnection();
            next();
          }
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
  getPednigBills: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      let inputValues = [];

      _stringData += " and S.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.created_date != null) {
        _stringData += " and date(S.created_date)=?";
        inputValues.push(req.query.created_date);
      }
      if (req.query.visit_id != null) {
        _stringData += " and visit_id=?";
        inputValues.push(req.query.visit_id);
      }
      if (req.query.patient_id != null) {
        _stringData += " and patient_id=? ";
        inputValues.push(req.query.patient_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT  S.patient_id, S.visit_id, S.insurance_yesno, P.patient_code,P.full_name FROM hims_f_ordered_services S,hims_f_patient P  \
          WHERE S.record_status='A' AND S.billed='N' AND P.hims_d_patient_id=S.patient_id" +
            _stringData,
          values: inputValues,
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
  },

  insertPhysiotherapyServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      let Services =
        req.records.ResultOfFetchOrderIds == null
          ? req.body.billdetails
          : req.records.ResultOfFetchOrderIds;

      const physothServices = [
        ...new Set(
          new LINQ(Services)
            .Where(w => w.physiotherapy_service == "Y")
            .Select(s => {
              return {
                ordered_services_id: s.hims_f_ordered_services_id || null,
                patient_id: req.body.patient_id,
                referred_doctor_id: req.body.incharge_or_provider,
                visit_id: req.body.visit_id,
                billed: req.body.billed,
                ordered_date: s.created_date,
                hospital_id: req.userIdentity.hospital_id
              };
            })
            .ToArray()
        )
      ];

      const IncludeValues = [
        "ordered_services_id",
        "patient_id",
        "visit_id",
        "referred_doctor_id",
        "billed",
        "ordered_date",
        "hospital_id"
      ];

      if (physothServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_physiotherapy_header(??) VALUES ?",
            values: physothServices,
            includeValues: IncludeValues,
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(insert_physiotherapy => {
            next();
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePhysiotherapyServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    utilities.logger().log("updatePhysiotherapyServices: ");
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          w =>
            w.hims_f_ordered_services_id != null &&
            w.physiotherapy_service == "Y"
        )
        .Select(s => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id,
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
            "UPDATE `hims_f_physiotherapy_header` SET billed=? where ordered_services_id=?;",
            [OrderServices[i].billed, OrderServices[i].ordered_services_id]
          );
        }

        utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(rad_result => {
            req.records = { PHYSIOTHERAPY: false };
            next();
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = { PHYSIOTHERAPY: true };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
