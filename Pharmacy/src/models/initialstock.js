import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  generateNumber: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      //Bill
      _mysql
        .generateRunningNumber({
          modules: ["STK_DOC"],
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
          req.body.document_number = generatedNumbers[0];
          next();
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
  getPharmacyInitialStock: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_pharmacy_stock_header_id, document_number, docdate, year,\
          period, description, posted  from  hims_f_pharmacy_stock_header\
          where record_status='A' AND document_number=?",
          values: [req.query.document_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select SD.`hims_f_pharmacy_stock_detail_id`, SD.`pharmacy_stock_header_id`, SD.`item_id`, SD.`location_type`, SD.`location_id`, \
                SD.`item_category_id`, SD.`item_group_id`, SD.`uom_id`, SD.`barcode`, SD.`batchno`, SD.`expiry_date`, SD.`grn_number`, SD.`quantity`, \
                SD.`conversion_fact`, SD.`unit_cost`, SD.`extended_cost`, SD.`sales_uom`, SD.`comment`, SD.`created_date`, SD.`created_by`, \
                SD.`updated_date`, SD.`updated_by`, SD.`record_status`, SD.sales_price, IM.item_code, IM.item_description, IU.uom_description, SD.vendor_batchno from \
                hims_f_pharmacy_stock_detail SD, hims_d_item_master IM ,hims_d_pharmacy_uom IU where SD.pharmacy_stock_header_id=? and \
                SD.record_status='A'  and SD.item_id = IM.hims_d_item_master_id and SD.uom_id = IU.hims_d_pharmacy_uom_id",
                // "select * from hims_f_pharmacy_stock_detail where pharmacy_stock_header_id=? and record_status='A'",
                values: [headerResult[0].hims_f_pharmacy_stock_header_id],
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

  addPharmacyInitialStock: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    const utilities = new algaehUtilities();
    utilities.logger().log("addPharmacyInitialStock: ");

    try {
      let input = req.body;
      // utilities.logger().log("input: ", input);

      let year = moment().format("YYYY");

      let today = moment().format("YYYY-MM-DD");

      let month = moment().format("MM");

      let period = month;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_pharmacy_stock_header` (document_number,docdate,`year`,period,\
                description,created_date,created_by,updated_date,updated_by,hospital_id) \
                VALUE(?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.document_number,
            today,
            year,
            period,
            input.description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          req.body.transaction_id = headerResult.insertId;
          req.body.year = year;
          req.body.period = period;

          let IncludeValues = [
            "item_id",
            "location_type",
            "location_id",
            "item_category_id",
            "item_group_id",
            "uom_id",
            "barcode",
            "batchno",
            "vendor_batchno",
            "sales_uom",
            "expiry_date",
            "grn_number",
            "quantity",
            "conversion_fact",
            "unit_cost",
            "extended_cost",
            "comment",
            "sales_price"
          ];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_f_pharmacy_stock_detail(??) VALUES ?",
              values: input.pharmacy_stock_detail,
              includeValues: IncludeValues,
              extraValues: {
                pharmacy_stock_header_id: headerResult.insertId,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              },
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(stock_detail => {
              utilities.logger().log("stock_detail: ");

              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = {
                  document_number: input.document_number,
                  hims_f_pharmacy_stock_header_id: headerResult.insertId,
                  year: year,
                  period: period
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePharmacyInitialStock: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_pharmacy_stock_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
            WHERE `record_status`='A' and `hims_f_pharmacy_stock_header_id`=?",
          values: [
            inputParam.posted,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_pharmacy_stock_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          let UpdateQry = ""
          for (let i = 0; i < inputParam.pharmacy_stock_detail.length; i++) {
            UpdateQry += mysql.format(
              "UPDATE `hims_f_pharmacy_stock_detail` SET barcode=?, batchno=? \
                where hims_f_pharmacy_stock_detail_id=?;",
              [
                inputParam.pharmacy_stock_detail[i].barcode,
                inputParam.pharmacy_stock_detail[i].batchno,
                inputParam.pharmacy_stock_detail[i].hims_f_pharmacy_stock_detail_id
              ]
            );
          }
          _mysql
            .executeQuery({
              query: UpdateQry,
              printQuery: true
            })
            .then(result => {
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
  }
};
