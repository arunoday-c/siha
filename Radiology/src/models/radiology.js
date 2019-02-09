import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import appsettings from "algaeh-utilities/appsettings.json";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  getRadOrderedServices: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  insertRadOrderedServices: (req, res, next) => {
    const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("Rad Bill: ");
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
            provider_id: req.body.provider_id,
            visit_id: req.body.visit_id,
            service_id: s.services_id,
            billed: req.body.billed,
            ordered_date: s.created_date,
            ordered_by: req.userIdentity.algaeh_d_app_user_id,
            test_type: s.test_type
          };
        })
        .ToArray();

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
            let result = {
              receipt_number: inputParam.receipt_number,
              bill_number: inputParam.bill_number
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
        let result = {
          receipt_number: inputParam.receipt_number,
          bill_number: inputParam.bill_number
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
  }
};
