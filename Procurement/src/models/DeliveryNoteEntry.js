import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  getDeliveryNoteEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_procurement_dn_header where delivery_note_number=?",
          values: [req.query.delivery_note_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_procurement_dn_detail where hims_f_procurement_dn_header_id=?",
                values: [headerResult[0].hims_f_procurement_dn_header_id],
                printQuery: true
              })
              .then(dn_entry_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ dn_entry_detail }
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

  addDeliveryNoteEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let delivery_note_number = "";
      const utilities = new algaehUtilities();
      utilities.logger().log("addDeliveryNoteEntry: ");
      _mysql
        .generateRunningNumber({
          modules: ["DN_NUM"]
        })
        .then(generatedNumbers => {
          delivery_note_number = generatedNumbers[0];

          let today = moment().format("YYYY-MM-DD");

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_procurement_dn_header` (delivery_note_number,dn_date,dn_type,dn_from, pharmcy_location_id,\
                inventory_location_id,location_type,vendor_id, purchase_order_id, from_multiple_purchase_orders, \
                payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
                sheet_level_discount_amount,description,net_total,total_tax, net_payable, created_by,created_date, \
                updated_by,updated_date) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                delivery_note_number,
                today,
                input.dn_type,
                input.dn_from,
                input.pharmcy_location_id,
                input.inventory_location_id,
                input.location_type,
                input.vendor_id,
                input.purchase_order_id,
                input.from_multiple_purchase_orders,
                input.payment_terms,
                input.comment,
                input.sub_total,
                input.detail_discount,
                input.extended_total,
                input.sheet_level_discount_percent,
                input.sheet_level_discount_amount,
                input.description,

                input.net_total,
                input.total_tax,
                input.net_payable,

                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
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
                "quantity_outstanding",
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
                "item_type",
                "quantity_recieved_todate",
                "batchno_expiry_required",
                "batchno",
                "expiry_date",
                "purchase_order_header_id",
                "purchase_order_detail_id"
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_procurement_dn_detail(??) VALUES ?",
                  values: input.dn_entry_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    hims_f_procurement_dn_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = {
                    delivery_note_number: delivery_note_number,
                    hims_f_procurement_dn_header_id: headerResult.insertId
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

  updateDeliveryNoteEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize_by_date`=?, `authorize_by_1`=? \
          WHERE `hims_f_procurement_po_header_id`=?",
          values: [
            inputParam.authorize1,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_procurement_po_header_id
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
            let details = inputParam.pharmacy_stock_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_procurement_po_detail SET `authorize_quantity`=?, rejected_quantity=?,\
                quantity_recieved=?, quantity_outstanding=?\
              where `hims_f_procurement_po_detail_id`=? ;",
                [
                  details[i].authorize_quantity,
                  details[i].rejected_quantity,
                  details[i].quantity_recieved,
                  details[i].quantity_outstanding,
                  details[i].hims_f_procurement_po_detail_id
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

  updatePOEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updatePOEntry: ");
      let inputParam = { ...req.body };

      let complete = "Y";

      const partial_recived = new LINQ(inputParam.dn_entry_detail)
        .Where(w => w.quantity_outstanding != 0)
        .ToArray();

      if (partial_recived.length > 0) {
        complete = "N";
      }

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_procurement_po_header` SET `is_completed`=?, `completed_date`=?, `updated_by` = ?,`updated_date` = ? \
          WHERE `hims_f_procurement_po_header_id`=?",
          values: [
            complete,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.purchase_order_id
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
                "UPDATE hims_f_procurement_po_detail SET `quantity_outstanding`=?\
              where `hims_f_procurement_po_detail_id`=? ;",
                [
                  details[i].quantity_outstanding,
                  details[i].purchase_order_detail_id
                ]
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
                  req.porecords = detailResult;
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
