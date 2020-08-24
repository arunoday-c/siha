import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";

export default {
  generateNumber: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let input = JSON.parse(buffer);
        req.mySQl = _mysql;
        req.body = input;
        //Bill
        _mysql
          .generateRunningNumber({
            user_id: req.userIdentity.algaeh_d_app_user_id,
            numgen_codes: ["DN_NUM"],
            table_name: "hims_f_procurement_numgen",
          })
          .then((generatedNumbers) => {
            req.connection = {
              connection: _mysql.connection,
              isTransactionConnection: _mysql.isTransactionConnection,
              pool: _mysql.pool,
            };
            req.body.delivery_note_number = generatedNumbers.DN_NUM;
            next();
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getDeliveryNoteEntryOLD: (req, res, next) => {
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
          printQuery: true,
        })
        .then((headerResult) => {
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
                printQuery: true,
              })
              .then((dn_entry_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ dn_entry_detail },
                };
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
          }
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

  //created by :irfan
  addDeliveryNoteEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      const input = req.body;
      let year = moment().format("YYYY");
      let today = moment().format("YYYY-MM-DD");
      let month = moment().format("MM");
      let period = month;

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
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          req.body.transaction_id = headerResult.insertId;
          req.body.year = year;
          req.body.period = period;
          let dn_entry_detail = [];
          const async = require("async");

          async.eachSeries(input.po_entry_detail, (inputObj, nextLoop) => {
            // console.log("inputObj", inputObj);
            const i = input.po_entry_detail.indexOf(inputObj);
            console.log("index", i);
            updateItemMaster({
              stock_detail: inputObj.dn_entry_detail,
              po_entry_detail: input.po_entry_detail,
              stock_insert_detail: i,
              _mysql: _mysql,
              req: req,
              next: next,
              dn_from: input.dn_from,
            })
              .then((ItemBatchGen) => {
                // console.log("ItemBatchGen", ItemBatchGen);
                // utilities
                //   .logger()
                //   .log("resolve: ", input.po_entry_detail[i].dn_entry_detail);

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_procurement_dn_detail ( phar_item_category,phar_item_group,phar_item_id,\
                        inv_item_category_id,inv_item_group_id,inv_item_id,po_quantity,dn_quantity,\
                        quantity_outstanding,\
                        pharmacy_uom_id,inventory_uom_id,unit_cost,extended_cost,discount_percentage,discount_amount,\
                        net_extended_cost,tax_percentage,tax_amount,total_amount,item_type,quantity_recieved_todate,\
                        batchno_expiry_required,batchno,expiry_date,purchase_order_header_id,purchase_order_detail_id,\
                        vendor_batchno,barcode,sales_price,free_qty,hims_f_procurement_dn_header_id) \
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    values: [
                      input.po_entry_detail[i]["phar_item_category"],
                      input.po_entry_detail[i]["phar_item_group"],
                      input.po_entry_detail[i]["phar_item_id"],
                      input.po_entry_detail[i]["inv_item_category_id"],
                      input.po_entry_detail[i]["inv_item_group_id"],
                      input.po_entry_detail[i]["inv_item_id"],
                      input.po_entry_detail[i]["po_quantity"],
                      input.po_entry_detail[i]["dn_quantity"],
                      input.po_entry_detail[i]["quantity_outstanding"],
                      input.po_entry_detail[i]["pharmacy_uom_id"],
                      input.po_entry_detail[i]["inventory_uom_id"],
                      input.po_entry_detail[i]["unit_cost"],
                      input.po_entry_detail[i]["extended_cost"],
                      input.po_entry_detail[i]["discount_percentage"],
                      input.po_entry_detail[i]["discount_amount"],
                      input.po_entry_detail[i]["net_extended_cost"],
                      input.po_entry_detail[i]["tax_percentage"],
                      input.po_entry_detail[i]["tax_amount"],
                      input.po_entry_detail[i]["total_amount"],
                      input.po_entry_detail[i]["item_type"],
                      input.po_entry_detail[i]["quantity_recieved_todate"],
                      input.po_entry_detail[i]["batchno_expiry_required"],
                      input.po_entry_detail[i]["batchno"],
                      input.po_entry_detail[i]["expiry_date"],
                      input.po_entry_detail[i]["purchase_order_header_id"],
                      input.po_entry_detail[i]["purchase_order_detail_id"],
                      input.po_entry_detail[i]["vendor_batchno"],
                      input.po_entry_detail[i]["barcode"],
                      input.po_entry_detail[i]["sales_price"],
                      input.po_entry_detail[i]["free_qty"],
                      headerResult.insertId,
                    ],

                    printQuery: true,
                  })
                  .then((detailResult) => {
                    console.log("detailResult: ", detailResult.insertId.length);
                    let IncludeSubValues = [
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
                      "sales_price",
                      "free_qty",
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_procurement_dn_batches(??) VALUES ?",
                        values: input.po_entry_detail[i].dn_entry_detail,
                        includeValues: IncludeSubValues,
                        extraValues: {
                          hims_f_procurement_dn_detail_id:
                            detailResult.insertId,
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: false,
                      })
                      .then((subResult) => {
                        if (i == input.po_entry_detail.length - 1) {
                          req.records = {
                            delivery_note_number: input.delivery_note_number,
                            hims_f_procurement_dn_header_id:
                              headerResult.insertId,
                          };
                          next();
                        } else {
                          nextLoop();
                        }
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          });
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

  addDeliveryNoteEntryBackup: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let input = req.body;

      const utilities = new algaehUtilities();
      // utilities.logger().log("addDeliveryNoteEntry: ");

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
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          let dn_entry_detail = [];
          if (input.dn_from == "PHR") {
            dn_entry_detail = input.pharmacy_stock_detail;
          } else {
            dn_entry_detail = input.inventory_stock_detail;
          }

          // utilities.logger().log("headerResult: ", headerResult.insertId);
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
            "sales_price",
          ];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_f_procurement_dn_detail(??) VALUES ?",
              values: dn_entry_detail,
              includeValues: IncludeValues,
              extraValues: {
                hims_f_procurement_dn_header_id: headerResult.insertId,
              },
              bulkInsertOrUpdate: true,
              printQuery: true,
            })
            .then((detailResult) => {
              // utilities.logger().log("detailResult: ", detailResult);
              // _mysql.commitTransaction(() => {
              //   _mysql.releaseConnection();
              req.records = {
                delivery_note_number: input.delivery_note_number,
                hims_f_procurement_dn_header_id: headerResult.insertId,
              };
              next();
              // });
            })
            .catch((error) => {
              // utilities.logger().log("erroe: ", error);
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
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
            inputParam.hims_f_procurement_po_header_id,
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
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
                  details[i].hims_f_procurement_po_detail_id,
                ]
              );
            }
            _mysql
              .executeQuery({
                query: qry,
                printQuery: true,
              })
              .then((detailResult) => {
                req.records = detailResult;
                next();
              })
              .catch((e) => {
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

  updatePOEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("updatePOEntry: ");
      let inputParam = { ...req.body };
      // console.log("inputParam", inputParam);
      let complete = "Y";

      let dn_entry_detail = [];
      if (inputParam.dn_from == "PHR") {
        dn_entry_detail = inputParam.pharmacy_stock_detail;
      } else {
        dn_entry_detail = inputParam.inventory_stock_detail;
      }

      let details = dn_entry_detail;

      let qry = "";
      for (let i = 0; i < details.length; i++) {
        qry += mysql.format(
          "UPDATE hims_f_procurement_po_detail SET `quantity_outstanding`=?\
        where `hims_f_procurement_po_detail_id`=? ;",
          [details[i].quantity_outstanding, details[i].purchase_order_detail_id]
        );
      }
      _mysql
        .executeQuery({
          query: qry,
          printQuery: true,
        })
        .then((update_detailResult) => {
          _mysql
            .executeQuery({
              query:
                "select  D.quantity_outstanding from hims_f_procurement_po_header H, hims_f_procurement_po_detail D\
                 WHERE H.hims_f_procurement_po_header_id = D.procurement_header_id and\
                hims_f_procurement_po_header_id=?",
              values: [inputParam.purchase_order_id],
              printQuery: true,
            })
            .then((detailResult) => {
              //Update
              const partial_recived = new LINQ(detailResult)
                .Where((w) => w.quantity_outstanding != 0)
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
                    inputParam.purchase_order_id,
                  ],
                  printQuery: true,
                })
                .then((headerResult) => {
                  // utilities.logger().log("headerResult: ");
                  req.porecords = headerResult;
                  next();
                })
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
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

  //created by Irfan:
  updateGrni: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {

      let input = req.body;

      let hospital_id = req.userIdentity.hospital_id;

      _mysql
        .executeQuery({
          query: ` select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;`,
          printQuery: false,
        })
        .then((result) => {
          const org_data = result[0];
          if (
            org_data["product_type"] == "HIMS_ERP" ||
            org_data["product_type"] == "FINANCE_ERP"
          ) {
            let locationQry = "";
            if (input.dn_from == "PHR") {
              locationQry = `select head_id,child_id from hims_d_pharmacy_location where hims_d_pharmacy_location_id=${input.pharmcy_location_id};`;
            } else {
              locationQry = `select head_id,child_id from hims_d_inventory_location where hims_d_inventory_location_id=${input.inventory_location_id};`;
            }

            _mysql
              .executeQuery({
                query: `SELECT grni_required,cost_center_type, cost_center_required FROM finance_options;
          select head_id,child_id from finance_accounts_maping where account='GRNI';
          select hims_d_sub_department_id from hims_d_sub_department where department_type='I';
          select hims_d_sub_department_id from hims_d_sub_department where department_type='PH';
          select  hims_m_division_project_id, project_id from hims_m_division_project D 
          inner join hims_d_project P on D.project_id=P.hims_d_project_id inner join 
          hims_d_hospital H on D.division_id=H.hims_d_hospital_id where 
          division_id= ${hospital_id} limit 1; ${locationQry}`,
                printQuery: false,
              })
              .then((result) => {

                const options = result[0][0];
                const grni_required = options["grni_required"];
                const GRNI = result[1][0];
                const inventory = result[2][0];
                const pharmacy = result[3][0];
                const project_id = result[4][0]["project_id"];
                const stock_location = result[5][0];

                let sub_department_id = null;
                if (input.dn_from == "PHR") {
                  sub_department_id = pharmacy["hims_d_sub_department_id"];
                } else if (input.dn_from == "INV") {
                  sub_department_id = inventory["hims_d_sub_department_id"];
                }

                if (grni_required == "Y") {
                  if (GRNI.head_id > 0 && GRNI.child_id > 0) {
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO finance_day_end_header (transaction_date, amount, voucher_type, document_id,\
                  document_number, from_screen, narration,    entered_date, entered_by) \
                  VALUES (?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          input.net_payable,
                          "purchase",
                          input.transaction_id,
                          input.delivery_note_number,
                          "PR0003",
                          "Goods received but not invoiced",
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                        ],
                        printQuery: true,
                      })
                      .then((day_end_header) => {
                        let insertSubDetail = [];
                        const month = moment().format("M");
                        const year = moment().format("YYYY");
                        const IncludeValuess = [
                          "payment_date",
                          "head_id",
                          "child_id",
                          "debit_amount",
                          "payment_type",
                          "credit_amount",
                          "hospital_id",
                          "day_end_header_id",
                          "year",
                          "month",
                          "project_id",
                          "sub_department_id",
                        ];

                        //GRNI
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: GRNI.head_id,
                          child_id: GRNI.child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount: input.net_payable,
                          hospital_id: hospital_id,
                          day_end_header_id: day_end_header.insertId,
                          year: year,
                          month: month,
                          project_id: project_id,
                          sub_department_id: sub_department_id,
                        });

                        //STOCK
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: stock_location.head_id,
                          child_id: stock_location.child_id,
                          debit_amount: input.net_payable,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: hospital_id,
                          day_end_header_id: day_end_header.insertId,
                          year: year,
                          month: month,
                          project_id: project_id,
                          sub_department_id: sub_department_id,
                        });

                        // console.log("insertSubDetail", insertSubDetail)
                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                            values: insertSubDetail,
                            includeValues: IncludeValuess,
                            bulkInsertOrUpdate: true,
                            // extraValues: {
                            //   day_end_header_id: day_end_header.insertId,
                            //   year: year,
                            //   month: month,
                            //   project_id: project_id,
                            //   sub_department_id: sub_department_id,
                            // },
                            printQuery: false,
                          })
                          .then((subResult) => {
                            next();
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            //   req.records = subResult;
                            //   next();
                            // });
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else {
                    _mysql.rollBackTransaction(() => {
                      next(new Error("please define GRNI control account"));
                    });
                  }
                } else {
                  next();
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  //   req.records = org_data;
                  //   next();
                  // });
                }

              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            next();
            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = org_data;
            //   next();
            // });
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
  //created by irfan:
  getDeliveryNoteEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select DN.*, PH.purchase_number, CASE PH.po_from WHEN 'INV' then IL.location_description \
            else PL.location_description end as location_name, V.vendor_name\
            from hims_f_procurement_dn_header DN,\
            hims_f_procurement_po_header PH inner join hims_d_vendor V on PH.vendor_id = V.hims_d_vendor_id \
            left join hims_d_pharmacy_location PL on PH.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
            left join hims_d_inventory_location IL on PH.inventory_location_id = IL.hims_d_inventory_location_id   where DN.purchase_order_id=PH.hims_f_procurement_po_header_id \
            and DN.delivery_note_number=?; \
            select D.*,CASE H.dn_from WHEN 'INV' then II.item_description else PI.item_description end as \
            item_description,CASE H.dn_from WHEN 'INV' then IU.uom_description else PU.uom_description end as \
            uom_description  from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D\
            on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id\
            left join hims_d_item_master PI on D.phar_item_id= PI.hims_d_item_master_id\
            left join hims_d_inventory_item_master II on D.inv_item_id= II.hims_d_inventory_item_master_id\
            left join hims_d_pharmacy_uom PU on D.pharmacy_uom_id= PU.hims_d_pharmacy_uom_id\
            left join hims_d_inventory_uom IU on D.inventory_uom_id= IU.hims_d_inventory_uom_id\
            where delivery_note_number=?;\
            select B.* from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D\
            on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id\
            inner join hims_f_procurement_dn_batches B on D.hims_f_procurement_dn_detail_id=B.hims_f_procurement_dn_detail_id\
            where H.delivery_note_number=?;",
          values: [
            req.query.delivery_note_number,
            req.query.delivery_note_number,
            req.query.delivery_note_number,
          ],
          printQuery: true,
        })
        .then((result) => {
          let header = result[0][0];
          let details = result[1];
          let subDetails = result[2];
          let outputArray = [];

          details.forEach((item) => {
            let dn_entry_detail = subDetails.filter((sub) => {
              return (
                sub["hims_f_procurement_dn_detail_id"] ==
                item["hims_f_procurement_dn_detail_id"]
              );
            });

            outputArray.push({ ...item, dn_entry_detail });
          });

          req.records = { ...header, po_entry_detail: outputArray };
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
};

function updateItemMaster(options) {
  return new Promise((resolve, reject) => {
    try {
      // console.log("updateItemMaster: ");
      let dn_from = options.dn_from;
      let _mysql = options._mysql;
      let req = options.req;
      let stock_detail = options.stock_detail;
      let stock_insert_detail = options.stock_insert_detail;
      let po_entry_detail = options.po_entry_detail;

      const utilities = new algaehUtilities();

      // console.log("updateItemMaster: ", stock_detail);
      // console.log("stock_insert_detail: ", stock_insert_detail);
      // console.log("po_entry_detail: ", po_entry_detail);

      for (let i = 0; i < stock_detail.length; i++) {
        // console.log("i: ", i);

        let prev_length =
          stock_insert_detail > 0
            ? po_entry_detail[stock_insert_detail].dn_entry_detail.length + i
            : i;

        // console.log("prev_length: ", prev_length);
        // console.log(
        //   "length: ",
        //   po_entry_detail[stock_insert_detail].dn_entry_detail.length
        // );

        let strQuery = "";
        if (dn_from == "PHR") {
          strQuery += mysql.format(
            "select  item_code from `hims_d_item_master` WHERE `hims_d_item_master_id`=?",
            [stock_detail[i].item_id]
          );
        } else {
          strQuery += mysql.format(
            "select item_code from `hims_d_inventory_item_master` WHERE `hims_d_inventory_item_master_id`=?",
            [stock_detail[i].item_id]
          );
        }
        _mysql
          .executeQuery({
            query: strQuery,
            printQuery: true,
          })
          .then((result) => {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var day = date.getDate();
            var year = String(new Date().getFullYear()).substring(2, 4);
            var month = date.getMonth();

            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            var length = 2;
            var resultString = year + month + day + hours + minutes + seconds;
            for (var j = length; j > 0; --j)
              resultString += chars[Math.floor(Math.random() * chars.length)];
            resultString += req.userIdentity.hospital_id;

            // let batch_no = parseInt(result[0].batch_no) + 1;
            // let barcode = result[0].item_code + "B" + resultString;

            // console.log("batch_no", "B" + resultString);
            // console.log("barcode", barcode);

            // console.log("dn_index", stock_detail[i].dn_index);
            if (dn_from == "PHR") {
              const phar_stock_data = _.find(
                req.body.pharmacy_stock_detail,
                (f) => f.dn_index === stock_detail[i].dn_index
              );

              const _phar_index = req.body.pharmacy_stock_detail.indexOf(
                phar_stock_data
              );

              // console.log("_phar_index", _phar_index);

              req.body.pharmacy_stock_detail[_phar_index].batchno =
                "B" + resultString;
              req.body.pharmacy_stock_detail[_phar_index].barcode =
                "B" + resultString;
            } else {
              const inv_stock_data = _.find(
                req.body.inventory_stock_detail,
                (f) => f.dn_index === stock_detail[i].dn_index
              );

              const _inv_index = req.body.inventory_stock_detail.indexOf(
                inv_stock_data
              );

              req.body.inventory_stock_detail[_inv_index].batchno =
                "B" + resultString;
              req.body.inventory_stock_detail[_inv_index].barcode =
                "B" + resultString;
            }
            // console.log("length: ", po_entry_detail[stock_insert_detail - 1].dn_entry_detail.length);
            stock_detail[i].batchno = "B" + resultString;
            stock_detail[i].barcode = "B" + resultString;

            if (i == stock_detail.length - 1) {
              // console.log("resolve: ");
              resolve();
            }
          })
          .catch((e) => {
            reject(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function updateItemMasterBackup(options) {
  return new Promise((resolve, reject) => {
    try {
      let dn_from = options.dn_from;
      let _mysql = options._mysql;
      let req = options.req;
      let stock_detail = options.stock_detail;
      if (dn_from == "PHR") {
        const utilities = new algaehUtilities();

        // utilities.logger().log("updateItemMaster: ", stock_detail);

        for (let i = 0; i < stock_detail.length; i++) {
          _mysql
            .executeQuery({
              query:
                "select  item_code from `hims_d_item_master` WHERE `hims_d_item_master_id`=?",
              values: [],
              printQuery: true,
            })
            .then((result) => {
              var date = new Date();
              var hours = date.getHours();
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              var chars =
                String(hours) +
                String(minutes) +
                String(seconds) +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
              var length = 2;
              var resultString = "";
              for (var j = length; j > 0; --j)
                resultString += chars[Math.floor(Math.random() * chars.length)];
              resultString +=
                req.userIdentity.algaeh_d_app_user_id +
                req.userIdentity.hospital_id;

              let batch_no = parseInt(result[0].batch_no) + 1;
              let barcode = result[0].item_code + "B" + resultString;

              // console.log("batch_no", "B" + resultString);
              // console.log("barcode", barcode);

              req.body.pharmacy_stock_detail[i].batchno = "B" + resultString;
              req.body.pharmacy_stock_detail[i].barcode = barcode;
              stock_detail[i].batchno = "B" + resultString;
              stock_detail[i].barcode = barcode;

              // utilities
              //   .logger()
              //   .log("batch_no: ", req.body.pharmacy_stock_detail[i].batch_no);
              if (i == stock_detail.length - 1) {
                resolve();
              }
            })
            .catch((e) => {
              reject(e);
            });
        }
      } else if (dn_from == "INV") {
        const utilities = new algaehUtilities();

        // utilities.logger().log("updateItemMaster: ", stock_detail);

        for (let i = 0; i < stock_detail.length; i++) {
          _mysql
            .executeQuery({
              query:
                "select item_code from `hims_d_inventory_item_master` WHERE `hims_d_inventory_item_master_id`=?",
              values: [stock_detail[i].item_id],
              printQuery: true,
            })
            .then((result) => {
              var date = new Date();
              var hours = date.getHours();
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              var chars =
                String(hours) +
                String(minutes) +
                String(seconds) +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
              var length = 2;
              var resultString = "";
              for (var j = length; j > 0; --j)
                resultString += chars[Math.floor(Math.random() * chars.length)];
              resultString +=
                req.userIdentity.algaeh_d_app_user_id +
                req.userIdentity.hospital_id;

              let batch_no = parseInt(result[0].batch_no) + 1;
              let barcode = result[0].item_code + "B" + resultString;

              // console.log("batch_no", "B" + resultString);
              // console.log("barcode", barcode);

              req.body.inventory_stock_detail[i].batchno = "B" + resultString;
              req.body.inventory_stock_detail[i].barcode = barcode;

              stock_detail[i].batchno = "B" + resultString;
              stock_detail[i].barcode = barcode;
              // utilities
              //   .logger()
              //   .log("batch_no: ", req.body.inventory_stock_detail[i].batch_no);
              if (i == stock_detail.length - 1) {
                resolve();
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function updateInventoryItemMaster(options) {
  return new Promise((resolve, reject) => {
    try {
      let inventory_stock_detail = options.inventory_stock_detail;
      let _mysql = options._mysql;
      let req = options.req;

      const utilities = new algaehUtilities();

      let execute_query = "";

      // utilities.logger().log("updateItemMaster: ", inventory_stock_detail);

      for (let i = 0; i < inventory_stock_detail.length; i++) {
        _mysql
          .executeQuery({
            query:
              "select item_code from `hims_d_inventory_item_master` WHERE `hims_d_inventory_item_master_id`=?",
            values: [inventory_stock_detail[i].item_id],
            printQuery: true,
          })
          .then((result) => {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var chars =
              String(hours) +
              String(minutes) +
              String(seconds) +
              "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var length = 2;
            var resultString = "";
            for (var j = length; j > 0; --j)
              resultString += chars[Math.floor(Math.random() * chars.length)];
            resultString +=
              req.userIdentity.algaeh_d_app_user_id +
              req.userIdentity.hospital_id;

            let batch_no = parseInt(result[0].batch_no) + 1;
            let barcode = result[0].item_code + "B" + resultString;

            // console.log("batch_no", "B" + resultString);
            // console.log("barcode", barcode);

            req.body.inventory_stock_detail[i].batchno = "B" + resultString;
            req.body.inventory_stock_detail[i].barcode = barcode;

            inventory_stock_detail[i].batchno = "B" + resultString;
            inventory_stock_detail[i].barcode = barcode;
            // utilities
            //   .logger()
            //   .log("batch_no: ", req.body.inventory_stock_detail[i].batch_no);
            if (i == inventory_stock_detail.length - 1) {
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
