import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  getrequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.material_requisition_number != null) {
        _strAppend += "and material_requisition_number=?";
        intValue.push(req.query.material_requisition_number);
      }

      if (req.query.from_location_id != null) {
        _strAppend += "and from_location_id=?";
        intValue.push(req.query.from_location_id);
      }

      if (req.query.to_location_id != null) {
        _strAppend += "and to_location_id=?";
        intValue.push(req.query.to_location_id);
      }

      if (req.query.authorize1 != null) {
        _strAppend += "and authorize1=?";
        intValue.push(req.query.authorize1);
      }

      if (req.query.authorie2 != null) {
        _strAppend += "and authorie2=?";
        intValue.push(req.query.authorie2);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_pharamcy_material_header where 1=1 " +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pharmacy_material_detail where pharmacy_header_id=?",
                values: [headerResult[0].hims_f_pharamcy_material_header_id],
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
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

  addrequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = { ...req.body };
      let material_requisition_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addPosEntry: ");

      _mysql
        .generateRunningNumber({
          modules: ["REQ_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          material_requisition_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharamcy_material_header` (material_requisition_number,requistion_date,from_location_type,\
                from_location_id, expiration_date,required_date,requested_by,on_hold, to_location_id, \
                to_location_type, description, comment, is_completed, completed_date, completed_lines,requested_lines, \
                purchase_created_lines,status,requistion_type,no_of_transfers,no_of_po, authorize1,authorize1_date, \
                authorize1_by,authorie2,authorize2_date,authorize2_by,cancelled, cancelled_by,cancelled_date,hospital_id) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                material_requisition_number,
                today,
                input.from_location_type,
                input.from_location_id,
                input.expiration_date,
                input.required_date,
                req.userIdentity.algaeh_d_app_user_id,
                input.on_hold,
                input.to_location_id,
                input.to_location_type,
                input.description,
                input.comment,
                input.is_completed,
                input.completed_date,
                input.completed_lines,
                input.requested_lines,
                input.purchase_created_lines,

                input.status,
                input.requistion_type,
                input.no_of_transfers,

                input.no_of_po,
                input.authorize1,
                input.authorize1_date,
                input.authorize1_by,
                input.authorie2,
                input.authorize2_date,
                input.authorize2_by,
                input.cancelled,
                input.cancelled_by,
                input.cancelled_date,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "item_id",
                "item_category_id",
                "item_group_id",
                "item_uom",
                "to_qtyhand",
                "from_qtyhand",
                "quantity_required"
              ];

              utilities
                .logger()
                .log("pharmacy_stock_detail: ", input.pharmacy_stock_detail);

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_pharmacy_material_detail(??) VALUES ?",
                  values: input.pharmacy_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    pharmacy_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      material_requisition_number: material_requisition_number
                    };
                    next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
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

  updaterequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharamcy_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
          `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
          WHERE `hims_f_pharamcy_material_header_id`=?",
          values: [
            inputParam.authorize1,
            new Date(),
            inputParam.updated_by,
            inputParam.authorie2,
            new Date(),
            inputParam.updated_by,
            inputParam.hims_f_pharamcy_material_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            let details = inputParam.pharmacy_stock_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_pharmacy_material_detail SET `pharmacy_header_id`=?,`completed` = ?,\
              `item_category_id`=?, `item_group_id`=?, `item_id`=?, \
              `quantity_required`=?, `quantity_authorized`=?, `item_uom`=?,`quantity_recieved`=?, `quantity_outstanding`=?\
              where `hims_f_pharmacy_material_detail_id`=?;",
                [
                  details[i].pharmacy_header_id,
                  details[i].completed,
                  details[i].item_category_id,
                  details[i].item_group_id,
                  details[i].item_id,
                  details[i].quantity_required,
                  details[i].quantity_authorized,
                  details[i].item_uom,
                  details[i].quantity_recieved,
                  details[i].quantity_outstanding,
                  details[i].hims_f_pharmacy_material_detail_id
                ]
              );
            }
            _mysql
              .executeQueryWithTransaction({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = detailResult;
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.rollBackTransaction(() => {
              req.records = {};
              next();
            });
          }
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

  getAuthrequisitionList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      let strQuery =
        "SELECT * from  hims_f_pharamcy_material_header\
            where cancelled='N' ";

      if (req.query.from_date != null) {
        strQuery +=
          " and date(requistion_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        strQuery += " and date(requistion_date) <= date(now())";
      }

      if (inputParam.from_location_id != null) {
        strQuery += " and from_location_id = " + inputParam.from_location_id;
      }
      if (inputParam.to_location_id != null) {
        strQuery += " and to_location_id = " + inputParam.to_location_id;
      }

      if (inputParam.status == null || inputParam.status == "0") {
        strQuery += "";
      } else if (inputParam.status == "1") {
        //Pending To Authorize 1
        strQuery += " and authorize1 = 'N'";
      } else if (inputParam.status == "2") {
        //Pending To Authorize 2
        strQuery += " and authorize1 = 'Y' and authorie2 = 'N'";
      } else if (inputParam.status == "3") {
        strQuery += " and is_completed='N'";
      } else if (inputParam.status == "4") {
        strQuery += " and is_completed='Y'";
      }

      _mysql
        .executeQuery({
          query: strQuery,
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

  updaterequisitionEntryOnceTranfer: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    const utilities = new algaehUtilities();
    utilities.logger().log("updaterequisitionEntryOnceTranfer: ");
    try {
      let inputParam = { ...req.body };

      let complete = "Y";

      const partial_recived = new LINQ(inputParam.stock_detail)
        .Where(w => w.quantity_outstanding != 0)
        .ToArray();

      if (partial_recived.length > 0) {
        complete = "N";
      }

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharamcy_material_header` SET `is_completed`=?, `completed_date`=? \
          WHERE `hims_f_pharamcy_material_header_id`=?",
          values: [
            complete,
            new Date(),
            inputParam.hims_f_pharamcy_material_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          utilities.logger().log("headerResult: ", headerResult);
          if (headerResult != null) {
            let details = inputParam.stock_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_pharmacy_material_detail SET `quantity_outstanding`=?\
              where `hims_f_pharmacy_material_detail_id`=?;",
                [
                  details[i].quantity_outstanding,
                  details[i].hims_f_pharmacy_material_detail_id
                ]
              );
            }

            utilities.logger().log("qry: ", qry);
            _mysql
              .executeQueryWithTransaction({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                // req.records = detailResult;
                next();
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.rollBackTransaction(() => {
              // req.records = {};
              next();
            });
          }
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
  }
};
