import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  generateNumber: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      //Bill
      _mysql
        .generateRunningNumber({
          modules: ["DN_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          req.body.delivery_note_number = generatedNumbers[0];
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
  getDeliveryNoteEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT DNH.`hims_f_procurement_dn_header_id`, DNH.`delivery_note_number`, DNH.`dn_date`, DNH.`dn_type`, \
            DNH.`dn_from`, DNH.`pharmcy_location_id`, DNH.`inventory_location_id`, DNH.`location_type`, DNH.`vendor_id`, \
            DNH.`purchase_order_id`, DNH.`from_multiple_purchase_orders`, DNH.`payment_terms`, DNH.`comment`, \
            DNH.`sub_total`, DNH.`detail_discount`, DNH.`extended_total`, DNH.`sheet_level_discount_percent`, \
            DNH.`sheet_level_discount_amount`, DNH.`description`, DNH.`net_total`, DNH.`total_tax`, DNH.`net_payable`, \
            DNH.`created_by`, DNH.`created_date`, DNH.`updated_by`, DNH.`updated_date`, DNH.`is_completed`, \
            DNH.`completed_date`, DNH.`cancelled`, DNH.`cancel_by`, DNH.`cancel_date`, DNH.`authorize1`, \
            DNH.`authorize_by_1`, DNH.`authorize_by_date`, POH.purchase_number \
            from  hims_f_procurement_dn_header DNH, hims_f_procurement_po_header POH \
            where DNH.purchase_order_id=POH.hims_f_procurement_po_header_id and DNH.delivery_note_number=?",
          values: [req.query.delivery_note_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let strQuery = "";
            if (headerResult[0].dn_from == "INV") {
              strQuery = mysql.format(
                "select DND.`hims_f_procurement_dn_detail_id`, DND.`hims_f_procurement_dn_header_id`, \
                  DND.`phar_item_category`, DND.`phar_item_group`, DND.`phar_item_id`, DND.`inv_item_category_id`, \
                  DND.`inv_item_group_id`, DND.`inv_item_id`, DND.`barcode`, DND.`po_quantity`, DND.`dn_quantity`, \
                  DND.`authorize_quantity`, DND.`rejected_quantity`, DND.`pharmacy_uom_id`, DND.`inventory_uom_id`, \
                  DND.`unit_cost`, DND.`extended_cost`, DND.`discount_percentage`, DND.`discount_amount`, \
                  DND.`net_extended_cost`, DND.`vendor_item_no`, DND.`manufacturer_item_code`, DND.`quantity_recieved_todate`, \
                  DND.`quantity_outstanding`, DND.`tax_inclusive`, DND.`tax_amount`, DND.`total_amount`, DND.`mrp_price`, DND.vendor_batchno,\
                  DND.`calculate_tax_on`, DND.`tax_percentage`, DND.`tax_discount`, DND.`item_type`, DND.sales_price,\
                  DND.`batchno_expiry_required`, DND.`batchno`, DND.`expiry_date`, DND.`purchase_order_header_id`, \
                  DND.`purchase_order_detail_id`,IM.item_code, IM.item_description, IU.uom_description \
                  from hims_f_procurement_dn_detail DND, hims_d_inventory_item_master IM, hims_d_inventory_uom IU \
                  where DND.inv_item_id = IM.hims_d_inventory_item_master_id and DND.inventory_uom_id = IU.hims_d_inventory_uom_id  \
                  and DND.hims_f_procurement_dn_header_id=?",
                [headerResult[0].hims_f_procurement_dn_header_id]
              );
            } else if (headerResult[0].dn_from == "PHR") {
              strQuery = mysql.format(
                "select DND.`hims_f_procurement_dn_detail_id`, DND.`hims_f_procurement_dn_header_id`, \
                  DND.`phar_item_category`, DND.`phar_item_group`, DND.`phar_item_id`, DND.`inv_item_category_id`, \
                  DND.`inv_item_group_id`, DND.`inv_item_id`, DND.`barcode`, DND.`po_quantity`, DND.`dn_quantity`, \
                  DND.`authorize_quantity`, DND.`rejected_quantity`, DND.`pharmacy_uom_id`, DND.`inventory_uom_id`, \
                  DND.`unit_cost`, DND.`extended_cost`, DND.`discount_percentage`, DND.`discount_amount`, \
                  DND.`net_extended_cost`, DND.`vendor_item_no`, DND.`manufacturer_item_code`, DND.`quantity_recieved_todate`, \
                  DND.`quantity_outstanding`, DND.`tax_inclusive`, DND.`tax_amount`, DND.`total_amount`, DND.`mrp_price`, DND.vendor_batchno,\
                  DND.`calculate_tax_on`, DND.`tax_percentage`, DND.`tax_discount`, DND.`item_type`, DND.sales_price,\
                  DND.`batchno_expiry_required`, DND.`batchno`, DND.`expiry_date`, DND.`purchase_order_header_id`, \
                  DND.`purchase_order_detail_id`,IM.item_code, IM.item_description, PU.uom_description \
                  from hims_f_procurement_dn_detail DND, hims_d_item_master IM ,hims_d_pharmacy_uom PU \
                  where DND.phar_item_id = IM.hims_d_item_master_id and DND.pharmacy_uom_id = PU.hims_d_pharmacy_uom_id\
                  and DND.hims_f_procurement_dn_header_id=?",
                [headerResult[0].hims_f_procurement_dn_header_id]
              );
            }
            _mysql
              .executeQuery({
                query: strQuery,
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
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let input = req.body;

      const utilities = new algaehUtilities();
      utilities.logger().log("addDeliveryNoteEntry: ");

      let today = moment().format("YYYY-MM-DD");

      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_procurement_dn_header` (delivery_note_number,dn_date,dn_type,dn_from, pharmcy_location_id,\
                inventory_location_id,location_type,vendor_id, purchase_order_id, from_multiple_purchase_orders, \
                payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
                sheet_level_discount_amount,description,net_total,total_tax, net_payable, created_by,created_date, \
                updated_by,updated_date,hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.delivery_note_number,
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
            new Date(),
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          let dn_entry_detail = [];
          if (input.dn_from == "PHR") {
            dn_entry_detail = input.pharmacy_stock_detail;
          } else {
            dn_entry_detail = input.inventory_stock_detail;
          }

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
            "purchase_order_detail_id",
            "vendor_batchno",
            "barcode",
            "sales_price"
          ];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_f_procurement_dn_detail(??) VALUES ?",
              values: dn_entry_detail,
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
                delivery_note_number: input.delivery_note_number,
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

      let dn_entry_detail = [];
      if (inputParam.dn_from == "PHR") {
        dn_entry_detail = inputParam.pharmacy_stock_detail;
      } else {
        dn_entry_detail = inputParam.inventory_stock_detail;
      }

      const partial_recived = new LINQ(dn_entry_detail)
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
            let details = dn_entry_detail;

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
