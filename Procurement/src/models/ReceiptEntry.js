import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  getReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT GH.`hims_f_procurement_grn_header_id`, GH.`grn_number`, GH.`grn_for`, GH.`vendor_id`, GH.`grn_date`, \
            GH.`year`, GH.`period`, GH.`pharmcy_location_id`, GH.`inventory_location_id`, GH.`location_type`, GH.`po_id`, \
            GH.`dn_id`, GH.`payment_terms`, GH.`comment`, GH.`description`, GH.`sub_total`, GH.`detail_discount`, \
            GH.`extended_total`, GH.`sheet_level_discount_percent`, GH.`sheet_level_discount_amount`, GH.`net_total`, \
            GH.`total_tax`, GH.`net_payable`, GH.`additional_cost`, GH.`reciept_total`, GH.`created_by`, GH.`created_date`, \
            GH.`updated_by`, GH.`updated_date`, GH.`posted`, GH.`posted_by`, GH.`posted_date`, GH.`inovice_number`, \
            GH.`invoice_date`, GH.`invoice_posted` from  hims_f_procurement_grn_header GH where grn_number=?",
          values: [req.query.grn_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let strQuery = "";
            if (headerResult[0].grn_for == "INV") {
              strQuery = mysql.format(
                "select GD.`hims_f_procurement_grn_detail_id`, GD.`grn_header_id`, GD.`phar_item_category`, \
                GD.`phar_item_group`, GD.`phar_item_id`, GD.`inv_item_category_id`, GD.`inv_item_group_id`, \
                GD.`inv_item_id`, GD.`barcode`, GD.`recieved_quantity`, GD.`po_quantity`, GD.`dn_quantity`, \
                GD.`pharmacy_uom_id`, GD.`inventory_uom_id`, GD.`unit_cost`, GD.`extended_cost`, GD.`discount_percentage`, \
                GD.`discount_amount`, GD.`net_extended_cost`, GD.`batchno_expiry_required`, GD.`batchno`, GD.`expiry_date`, \
                GD.`rejected_quantity`, GD.`outstanding_quantity`, GD.`tax_inclusive`, GD.`tax_percentage`, GD.`tax_amount`, \
                GD.`total_amount`, GD.`mrp_price`, GD.`sales_price`, GD.`landed_cost`, GD.`dn_header_id`, GD.`dn_detail_id`, \
                GD.`quantity_recieved_todate`,IM.item_code, IM.item_description, IU.uom_description \
                from hims_f_procurement_grn_detail GD, hims_d_inventory_item_master IM, hims_d_inventory_uom IU \
                where GD.inv_item_id = IM.hims_d_inventory_item_master_id and GD.inventory_uom_id = IU.hims_d_inventory_uom_id  \
                and GD.grn_header_id=?",
                [headerResult[0].hims_f_procurement_grn_header_id]
              );
            } else if (headerResult[0].grn_for == "PHR") {
              strQuery = mysql.format(
                "select GD.`hims_f_procurement_grn_detail_id`, GD.`grn_header_id`, GD.`phar_item_category`, \
                GD.`phar_item_group`, GD.`phar_item_id`, GD.`inv_item_category_id`, GD.`inv_item_group_id`, \
                GD.`inv_item_id`, GD.`barcode`, GD.`recieved_quantity`, GD.`po_quantity`, GD.`dn_quantity`, \
                GD.`pharmacy_uom_id`, GD.`inventory_uom_id`, GD.`unit_cost`, GD.`extended_cost`, GD.`discount_percentage`, \
                GD.`discount_amount`, GD.`net_extended_cost`, GD.`batchno_expiry_required`, GD.`batchno`, GD.`expiry_date`, \
                GD.`rejected_quantity`, GD.`outstanding_quantity`, GD.`tax_inclusive`, GD.`tax_percentage`, GD.`tax_amount`, \
                GD.`total_amount`, GD.`mrp_price`, GD.`sales_price`, GD.`landed_cost`, GD.`dn_header_id`, GD.`dn_detail_id`, \
                GD.`quantity_recieved_todate`,IM.item_code, IM.item_description, PU.uom_description \
                from hims_f_procurement_grn_detail GD, hims_d_item_master IM ,hims_d_pharmacy_uom PU \
                where GD.phar_item_id = IM.hims_d_item_master_id and GD.pharmacy_uom_id = PU.hims_d_pharmacy_uom_id\
                and GD.grn_header_id=?",
                [headerResult[0].hims_f_procurement_grn_header_id]
              );
            }
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true
              })
              .then(receipt_entry_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ receipt_entry_detail }
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

  addReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let grn_number = "";
      const utilities = new algaehUtilities();
      utilities.logger().log("addDeliveryNoteEntry: ");
      _mysql
        .generateRunningNumber({
          modules: ["RE_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          grn_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_procurement_grn_header` (grn_number,grn_date, grn_for, `year`, period, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id, po_id, dn_id, payment_terms, comment, description, sub_total, \
              detail_discount, extended_total,sheet_level_discount_percent, sheet_level_discount_amount,\
              net_total,total_tax, net_payable, additional_cost,reciept_total, created_by,created_date, \
              updated_by,updated_date,hospital_id) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                grn_number,
                today,
                input.grn_for,
                year,
                period,
                input.pharmcy_location_id,
                input.inventory_location_id,
                input.location_type,
                input.vendor_id,
                input.po_id,
                input.dn_id,

                input.payment_terms,
                input.comment,
                input.description,
                input.sub_total,
                input.detail_discount,
                input.extended_total,
                input.sheet_level_discount_percent,
                input.sheet_level_discount_amount,

                input.net_total,
                input.total_tax,
                input.net_payable,
                input.additional_cost,
                input.reciept_total,

                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool
              };

              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "phar_item_category",
                "phar_item_group",
                "phar_item_id",
                "inv_item_category_id",
                "inv_item_group_id",
                "inv_item_id",
                "po_quantity",
                "dn_quantity",
                "recieved_quantity",
                "pharmacy_uom_id",
                "inventory_uom_id",
                "unit_cost",
                "extended_cost",
                "discount_percentage",
                "discount_amount",
                "net_extended_cost",
                "tax_percentage",
                "tax_amount",
                "total_amount",
                "batchno_expiry_required",
                "batchno",
                "expiry_date",
                "vendor_batchno"
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_procurement_grn_detail(??) VALUES ?",
                  values: input.dn_entry_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    grn_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = {
                    grn_number: grn_number,
                    hims_f_procurement_grn_header_id: headerResult.insertId,
                    year: year,
                    period: period
                  };
                  next();
                  // });
                })
                .catch(error => {
                  utilities.logger().log("erroe: ", error);
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

  updateReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_procurement_grn_header` SET `posted`=?, `posted_date`=?, `posted_by`=? \
          WHERE `hims_f_procurement_grn_header_id`=?",
          values: [
            inputParam.posted,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_procurement_grn_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };

          if (headerResult != null) {
            let details = inputParam.receipt_entry_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_procurement_grn_detail SET `recieved_quantity`=?, batchno=?,\
                rejected_quantity=?, outstanding_quantity=?, expiry_date=?\
              where `hims_f_procurement_grn_detail_id`=? ;",
                [
                  details[i].recieved_quantity,
                  details[i].batchno,
                  details[i].rejected_quantity,
                  details[i].outstanding_quantity,
                  details[i].expiry_date,
                  details[i].hims_f_procurement_grn_detail_id
                ]
              );
            }
            _mysql
              .executeQuery({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                req.records = detailResult;
                next();
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

  updateDNEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateDNEntry: ");
      let inputParam = { ...req.body };

      let complete = "Y";
      const partial_recived = new LINQ(inputParam.receipt_entry_detail)
        .Where(w => w.outstanding_quantity != 0)
        .ToArray();

      if (partial_recived.length > 0) {
        complete = "N";
      }

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_procurement_dn_header` SET `is_completed`=?, `completed_date`=?, `updated_by` = ?,`updated_date` = ? \
          WHERE `hims_f_procurement_dn_header_id`=?",
          values: [
            complete,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.dn_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          utilities.logger().log("headerResult: ");
          if (headerResult != null) {
            let details = inputParam.dn_entry_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_procurement_dn_detail SET `quantity_outstanding`=?\
              where `hims_f_procurement_dn_detail_id`=? ;",
                [details[i].quantity_outstanding, details[i].dn_detail_id]
              );
            }
            _mysql
              .executeQuery({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.dnrecords = detailResult;
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
  }
};
