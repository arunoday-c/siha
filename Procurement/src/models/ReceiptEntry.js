import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  getReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT GH.`hims_f_procurement_grn_header_id`, GH.`grn_number`, GH.`grn_for`, GH.`vendor_id`,\
             GH.`grn_date`, GH.`year`, GH.`period`, GH.`pharmcy_location_id`, GH.`inventory_location_id`,\
              GH.`location_type`, GH.`po_id`, GH.`payment_terms`, GH.`comment`, GH.`description`, GH.`sub_total`,\
              GH.`detail_discount`, GH.`extended_total`, GH.`sheet_level_discount_percent`,\
              GH.`sheet_level_discount_amount`, GH.`net_total`, GH.`total_tax`, GH.`net_payable`,\
              GH.`additional_cost`, GH.`reciept_total`, GH.`created_by`, GH.`created_date`, \
              GH.`updated_by`, GH.`updated_date`, GH.`posted`, GH.`posted_by`, GH.`posted_date`, \
              GH.`inovice_number`, GH.`invoice_date`, GH.`invoice_posted`,PH.purchase_number from  \
              hims_f_procurement_grn_header GH,hims_f_procurement_po_header PH  where GH.po_id=PH.hims_f_procurement_po_header_id and GH.grn_number=?",
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
                query:
                  "select GD.*, DN.delivery_note_number from hims_f_procurement_grn_detail GD,\
                   hims_f_procurement_dn_header DN where \
                GD.dn_header_id = DN.hims_f_procurement_dn_header_id and GD.grn_header_id=?",
                values: [headerResult[0].hims_f_procurement_grn_header_id],
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
      utilities.logger().log("addReceiptEntry: ");
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["RE_NUM"],
          table_name: "hims_f_procurement_numgen"
        })
        .then(generatedNumbers => {
          grn_number = generatedNumbers.RE_NUM;

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_procurement_grn_header` (grn_number,grn_date, grn_for, `year`, period,\
                  pharmcy_location_id,inventory_location_id,location_type,vendor_id, po_id, payment_terms, \
                  comment, description, sub_total, detail_discount, extended_total,sheet_level_discount_percent,\
                  sheet_level_discount_amount,net_total,total_tax, net_payable, additional_cost,reciept_total,\
                  inovice_number,invoice_date,created_by,created_date, updated_by,updated_date,hospital_id) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                input.inovice_number,
                input.invoice_date,

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
                "dn_header_id",
                "extended_cost",
                "discount_amount",
                "net_extended_cost",
                "tax_percentage",
                "tax_amount",
                "total_amount"
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_procurement_grn_detail(??) VALUES ?",
                  values: input.receipt_entry_detail,
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

      utilities.logger().log("headerResult: ");

      let details = inputParam.receipt_entry_detail;

      let qry = "";

      for (let i = 0; i < details.length; i++) {
        qry += mysql.format(
          "UPDATE `hims_f_procurement_dn_header` SET `is_completed`=?, `completed_date`=?, \
          `updated_by` = ?,`updated_date` = ? WHERE `hims_f_procurement_dn_header_id`=?;",
          [
            complete,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            details[i].dn_header_id
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
            req.dnrecords = detailResult;
            next();
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

  getDeliveryForReceipt: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_procurement_dn_header where is_completed = 'N' and purchase_order_id=?",
          values: [req.query.purchase_order_id],
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
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

  getDeliveryItemDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT DNB.* from  hims_f_procurement_dn_detail DND, hims_f_procurement_dn_batches DNB \
            where DND.hims_f_procurement_dn_detail_id = DNB.hims_f_procurement_dn_detail_id \
            and hims_f_procurement_dn_header_id=?",
          values: [req.query.dn_header_id],
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
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

  postReceiptEntry: (req, res, next) => {
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

  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;"
        })
        .then(result => {
          // console.log("result", result)
          if (
            result[0]["product_type"] == "HIMS_ERP" ||
            result[0]["product_type"] == "FINANCE_ERP"
          ) {
            let strQuery = ""
            if (inputParam.grn_for === "PHR") {
              strQuery = "select GH.hims_f_procurement_grn_header_id, GH.grn_number, GH.inovice_number, GH.net_payable, \
                GH.detail_discount, GH.total_tax, IC.head_id, IC.child_id, V.head_id as v_head_id, \
                V.child_id as v_child_id,  sum(DB.net_extended_cost) as net_extended_cost, sum(DB.total_amount) as total_amount \
                from hims_f_procurement_grn_header GH \
                inner join hims_f_procurement_grn_detail GD on GH.hims_f_procurement_grn_header_id = GD.grn_header_id \
                inner join hims_f_procurement_dn_detail DD on DD.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DB on DD.hims_f_procurement_dn_detail_id = DB.hims_f_procurement_dn_detail_id \
                inner join hims_d_item_category IC on IC.hims_d_item_category_id = DB.phar_item_category\
                inner join hims_d_vendor V on V.hims_d_vendor_id = GH.vendor_id\
                where hims_f_procurement_grn_header_id=? group by DB.phar_item_category;"
            }
            else {
              strQuery = "select GH.hims_f_procurement_grn_header_id, GH.grn_number, GH.inovice_number, GH.net_payable, \
                GH.detail_discount, GH.total_tax, IC.head_id, IC.child_id, V.head_id as v_head_id, \
                V.child_id as v_child_id,  sum(DB.net_extended_cost) as net_extended_cost, sum(DB.total_amount) as total_amount \
                from hims_f_procurement_grn_header GH \
                inner join hims_f_procurement_grn_detail GD on GH.hims_f_procurement_grn_header_id = GD.grn_header_id \
                inner join hims_f_procurement_dn_detail DD on DD.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DB on DD.hims_f_procurement_dn_detail_id = DB.hims_f_procurement_dn_detail_id \
                inner join hims_d_inventory_tem_category IC on IC.hims_d_inventory_tem_category_id = DB.inv_item_category_id\
                inner join hims_d_vendor V on V.hims_d_vendor_id = GH.vendor_id\
                where hims_f_procurement_grn_header_id=? group by DB.inv_item_category_id;"
            }
            _mysql
              .executeQuery({
                query: strQuery,
                values: [inputParam.hims_f_procurement_grn_header_id],
                printQuery: true
              })
              .then(headerResult => {

                _mysql
                  .executeQuery({
                    query: "INSERT INTO finance_day_end_header (transaction_date, amount, voucher_type, document_id,\
                        document_number, from_screen, transaction_type, narration, hospital_id) \
                        VALUES (?,?,?,?,?,?,?,?,?)",
                    values: [
                      new Date(),
                      headerResult[0].net_payable,
                      "journal",
                      headerResult[0].hims_f_procurement_grn_header_id,
                      headerResult[0].grn_number,
                      inputParam.ScreenCode,
                      "BILL",
                      headerResult[0].inovice_number,
                      req.userIdentity.hospital_id
                    ],
                    printQuery: true
                  })
                  .then(day_end_header => {
                    let insertSubDetail = []
                    const month = moment().format("M");
                    const year = moment().format("YYYY");
                    const IncludeValuess = [
                      "payment_date",
                      "head_id",
                      "child_id",
                      "debit_amount",
                      "payment_type",
                      "credit_amount"
                    ];

                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: headerResult[0].v_head_id,
                      child_id: headerResult[0].v_child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: headerResult[0].net_payable,
                    });

                    if (parseFloat(headerResult[0].total_tax) > 0) {
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: "46",
                        child_id: "38",
                        debit_amount: headerResult[0].total_tax,
                        payment_type: "DR",
                        credit_amount: 0,
                      });
                    }

                    for (let i = 0; i < headerResult.length; i++) {
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: headerResult[i].head_id,
                        child_id: headerResult[i].child_id,
                        debit_amount: headerResult[i].net_extended_cost,
                        payment_type: "DR",
                        credit_amount: 0,
                      });
                    }


                    // console.log("insertSubDetail", insertSubDetail)
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                        values: insertSubDetail,
                        includeValues: IncludeValuess,
                        bulkInsertOrUpdate: true,
                        extraValues: {
                          day_end_header_id: day_end_header.insertId,
                          year: year,
                          month: month,
                          entered_date: new Date(),
                          entered_by: req.userIdentity.algaeh_d_app_user_id,
                          hospital_id: req.userIdentity.hospital_id
                        },
                        printQuery: false
                      })
                      .then(subResult => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = subResult;
                          next();
                        });
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });

    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  }
};
