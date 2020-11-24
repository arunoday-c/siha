import algaehMysql from "algaeh-mysql";
import moment from "moment";
import mysql from "mysql";

export default {
  getReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT GH.`hims_f_procurement_grn_header_id`, GH.`grn_number`, GH.receipt_mode, GH.`grn_for`, GH.`vendor_id`,\
             GH.`grn_date`, GH.`year`, GH.`period`, GH.`pharmcy_location_id`, GH.`inventory_location_id`,\
              GH.`location_type`, GH.`po_id`, GH.`payment_terms`, GH.`comment`, GH.`description`, GH.`sub_total`,\
              GH.`detail_discount`, GH.`extended_total`, GH.`sheet_level_discount_percent`,\
              GH.`sheet_level_discount_amount`, GH.`net_total`, GH.`total_tax`, GH.`net_payable`,\
              GH.`additional_cost`, GH.`reciept_total`, GH.`created_by`, GH.`created_date`, \
              GH.`updated_by`, GH.`updated_date`, GH.`posted`, GH.`posted_by`, GH.`posted_date`, \
              GH.`inovice_number`, GH.`invoice_date`, GH.`invoice_posted`, GH.is_revert, PH.purchase_number, V.vendor_name, \
              H.hospital_name, P.project_desc, CASE GH.grn_for WHEN 'INV' then IL.location_description \
              else PL.location_description end as location_name, PH.revert_reason,\
              max(if(U.algaeh_d_app_user_id = GH.reverted_by, E.full_name,'' )) as reverted_name, \
              max(if(U.algaeh_d_app_user_id = GH.created_by, E.full_name,'' )) as created_name \
              from hims_f_procurement_grn_header GH \
              inner join hims_f_procurement_po_header PH on GH.po_id=PH.hims_f_procurement_po_header_id \
              inner join algaeh_d_app_user U on (GH.created_by = U.algaeh_d_app_user_id or GH.reverted_by = U.algaeh_d_app_user_id) \
              inner join hims_d_employee E on E.hims_d_employee_id = U.employee_id \
              inner join hims_d_vendor V on V.hims_d_vendor_id = GH.vendor_id \
              left join hims_d_hospital H on H.hims_d_hospital_id = PH.hospital_id \
              left join hims_d_project P on P.hims_d_project_id = PH.project_id \
              left join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = GH.inventory_location_id \
              left join hims_d_pharmacy_location PL on PL.hims_d_pharmacy_location_id = GH.pharmcy_location_id \
              where  GH.grn_number=? group by hims_f_procurement_grn_header_id;",
          values: [req.query.grn_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let strQuery = "";
            if (headerResult[0].receipt_mode == "S") {

              strQuery = mysql.format(
                "select SIS.*, S.service_name from hims_f_procurement_grn_service SIS \
                  inner join hims_d_services S on S.hims_d_services_id = SIS.services_id \
                  where SIS.grn_header_id=?",
                [headerResult[0].hims_f_procurement_grn_header_id]
              );
            } else {
              strQuery = mysql.format(
                "select GD.*, DN.delivery_note_number from hims_f_procurement_grn_detail GD,\
                  hims_f_procurement_dn_header DN where \
               GD.dn_header_id = DN.hims_f_procurement_dn_header_id and GD.grn_header_id=?",
                [headerResult[0].hims_f_procurement_grn_header_id]
              );
            }
            // if (headerResult[0].grn_for == "INV") {
            //   strQuery = mysql.format(
            //     "select GD.`hims_f_procurement_grn_detail_id`, GD.`grn_header_id`, GD.`phar_item_category`, \
            //     GD.`phar_item_group`, GD.`phar_item_id`, GD.`inv_item_category_id`, GD.`inv_item_group_id`, \
            //     GD.`inv_item_id`, GD.`barcode`, GD.`recieved_quantity`, GD.`po_quantity`, GD.`dn_quantity`, \
            //     GD.`pharmacy_uom_id`, GD.`inventory_uom_id`, GD.`unit_cost`, GD.`extended_cost`, GD.`discount_percentage`, \
            //     GD.`discount_amount`, GD.`net_extended_cost`, GD.`batchno_expiry_required`, GD.`batchno`, GD.`expiry_date`, \
            //     GD.`rejected_quantity`, GD.`outstanding_quantity`, GD.`tax_inclusive`, GD.`tax_percentage`, GD.`tax_amount`, \
            //     GD.`total_amount`, GD.`mrp_price`, GD.`sales_price`, GD.`landed_cost`, GD.`dn_header_id`, GD.`dn_detail_id`, \
            //     GD.`quantity_recieved_todate`,IM.item_code, IM.item_description, IU.uom_description \
            //     from hims_f_procurement_grn_detail GD, hims_d_inventory_item_master IM, hims_d_inventory_uom IU \
            //     where GD.inv_item_id = IM.hims_d_inventory_item_master_id and GD.inventory_uom_id = IU.hims_d_inventory_uom_id  \
            //     and GD.grn_header_id=?",
            //     [headerResult[0].hims_f_procurement_grn_header_id]
            //   );
            // } else if (headerResult[0].grn_for == "PHR") {
            //   strQuery = mysql.format(
            //     "select GD.`hims_f_procurement_grn_detail_id`, GD.`grn_header_id`, GD.`phar_item_category`, \
            //     GD.`phar_item_group`, GD.`phar_item_id`, GD.`inv_item_category_id`, GD.`inv_item_group_id`, \
            //     GD.`inv_item_id`, GD.`barcode`, GD.`recieved_quantity`, GD.`po_quantity`, GD.`dn_quantity`, \
            //     GD.`pharmacy_uom_id`, GD.`inventory_uom_id`, GD.`unit_cost`, GD.`extended_cost`, GD.`discount_percentage`, \
            //     GD.`discount_amount`, GD.`net_extended_cost`, GD.`batchno_expiry_required`, GD.`batchno`, GD.`expiry_date`, \
            //     GD.`rejected_quantity`, GD.`outstanding_quantity`, GD.`tax_inclusive`, GD.`tax_percentage`, GD.`tax_amount`, \
            //     GD.`total_amount`, GD.`mrp_price`, GD.`sales_price`, GD.`landed_cost`, GD.`dn_header_id`, GD.`dn_detail_id`, \
            //     GD.`quantity_recieved_todate`,IM.item_code, IM.item_description, PU.uom_description \
            //     from hims_f_procurement_grn_detail GD, hims_d_item_master IM ,hims_d_pharmacy_uom PU \
            //     where GD.phar_item_id = IM.hims_d_item_master_id and GD.pharmacy_uom_id = PU.hims_d_pharmacy_uom_id\
            //     and GD.grn_header_id=?",
            //     [headerResult[0].hims_f_procurement_grn_header_id]
            //   );
            // }
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
      _mysql
        .executeQuery({
          query:
            "select hims_f_procurement_grn_header_id from hims_f_procurement_grn_header where inovice_number=?;",
          values: [
            input.inovice_number,
          ],
          printQuery: true
        })
        .then(invocie_detail => {
          if (invocie_detail.length > 0) {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: false,
              message: "Given Invoice Number already entered.",
            };
            next();
            return;
          }
          console.log("1")
          _mysql
            .generateRunningNumber({
              user_id: req.userIdentity.algaeh_d_app_user_id,
              numgen_codes: ["RE_NUM"],
              table_name: "hims_f_procurement_numgen"
            })
            .then(generatedNumbers => {
              console.log("2")
              grn_number = generatedNumbers.RE_NUM;

              let year = moment().format("YYYY");

              let today = moment().format("YYYY-MM-DD");

              let month = moment().format("MM");

              let period = month;

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO `hims_f_procurement_grn_header` (grn_number,grn_date, receipt_mode,grn_for, `year`, period,\
                  pharmcy_location_id,inventory_location_id,location_type,vendor_id, po_id, payment_terms, \
                  comment, description, sub_total, detail_discount, extended_total,sheet_level_discount_percent,\
                  sheet_level_discount_amount,net_total,total_tax, net_payable, additional_cost,reciept_total,\
                  inovice_number,invoice_date,created_by,created_date, updated_by,updated_date,hospital_id) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  values: [
                    grn_number,
                    today,
                    input.receipt_mode,
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
                  let IncludeValues = []
                  if (input.receipt_mode === "I") {
                    IncludeValues = [
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
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else {
                    IncludeValues = [
                      "services_id",
                      "unit_cost",
                      "quantity",
                      "extended_cost",
                      "discount_percentage",
                      "discount_amount",
                      "net_extended_cost",
                      "tax_percentage",
                      "tax_amount",
                      "total_amount"
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_procurement_grn_service(??) VALUES ?",
                        values: input.receipt_entry_detail_services,
                        includeValues: IncludeValues,
                        extraValues: {
                          grn_header_id: headerResult.insertId
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(detailResult => {
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
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  }
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
  updatePurchaseOrder: (req, res, next) => {
    console.log("PO1")
    if (req.records.invalid_input == false) {
      next()
      return;
    }
    console.log("updatePurchaseOrder")
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      _mysql
        .executeQuery({
          query: "select is_completed from hims_f_procurement_po_header where hims_f_procurement_po_header_id=?",
          values: [req.body.po_id],
          printQuery: true
        })
        .then(po_data => {
          if (po_data[0].is_completed === "Y") {
            _mysql
              .executeQuery({
                query: "update hims_f_procurement_po_header set receipt_generated='Y' where hims_f_procurement_po_header_id=?",
                values: [req.body.po_id],
                printQuery: true
              })
              .then(po_data => {
                next()
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            next()
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
    console.log("DN 1")
    if (req.records.invalid_input == false) {
      next()
      return;
    }
    console.log("updateDNEntry")
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      if (req.body.receipt_mode === "I") {
        let inputParam = { ...req.body };

        let complete = "Y";


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
      } else {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          next();
        });
      }
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
            "UPDATE `hims_f_procurement_grn_header` SET payment_terms=?, `posted`=?, `posted_date`=?, `posted_by`=? \
          WHERE `hims_f_procurement_grn_header_id`=?",
          values: [
            inputParam.payment_terms,
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

  getPOServiceReceipt: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      console.log("getPOServiceReceipt: ")

      _mysql
        .executeQuery({
          query: "SELECT PH.*, V.vendor_name, H.hospital_name, P.project_desc as project_name \
                from hims_f_procurement_po_header PH inner join  hims_d_vendor V on  PH.vendor_id = V.hims_d_vendor_id \
                inner join hims_d_hospital H  on PH.hospital_id = H.hims_d_hospital_id \
                inner join hims_d_project P  on PH.project_id = P.hims_d_project_id \
                where PH.hims_f_procurement_po_header_id =? ",
          values: [req.query.purchase_order_id],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query: "select OS.*, S.service_name from hims_f_procurement_po_services OS \
                          inner join hims_d_services S on S.hims_d_services_id = OS.services_id where procurement_header_id=?;",
                values: [req.query.purchase_order_id],
                printQuery: true
              })
              .then(receipt_entry_detail_services => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ receipt_entry_detail_services }
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

  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };

      console.log("generateAccountingEntry")
      _mysql
        .executeQuery({
          query: "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;"
        })
        .then(org_data => {

          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQuery({
                query:
                  "select head_id, child_id from finance_accounts_maping where account in ('INPUT_TAX');\
                  select hims_d_sub_department_id from hims_d_sub_department where department_type='I';\
                  select hims_d_sub_department_id from hims_d_sub_department where department_type='PH';\
                  select cost_center_type, cost_center_required from finance_options limit 1;"
              })
              .then(result => {
                const input_tax_acc = result[0][0]
                let sub_department_id = null
                let strQuery = ""

                if (inputParam.grn_for === "PHR") {
                  strQuery = "select GH.hims_f_procurement_grn_header_id, GH.grn_number, GH.inovice_number, \
                    GH.net_total, GH.total_tax, GH.net_payable, PL.head_id, PL.child_id, PL.hospital_id, \
                    V.head_id as v_head_id, V.child_id as v_child_id, V.vendor_name \
                    from hims_f_procurement_grn_header GH \
                    inner join hims_d_pharmacy_location PL on PL.hims_d_pharmacy_location_id = GH.pharmcy_location_id\
                    inner join hims_d_vendor V on V.hims_d_vendor_id = GH.vendor_id\
                    where hims_f_procurement_grn_header_id=?;"
                  sub_department_id = result[2].length > 0 ? result[2][0].hims_d_sub_department_id : null
                }
                else {

                  strQuery = "select GH.hims_f_procurement_grn_header_id, GH.grn_number, GH.inovice_number, \
                    GH.net_total, GH.total_tax, \
                    GH.net_payable, PL.head_id, PL.child_id, PL.hospital_id, V.head_id as v_head_id, V.child_id as v_child_id, \
                    V.vendor_name from hims_f_procurement_grn_header GH \
                    inner join hims_d_inventory_location PL on PL.hims_d_inventory_location_id = GH.inventory_location_id \
                    inner join hims_d_vendor V on V.hims_d_vendor_id = GH.vendor_id\
                    where hims_f_procurement_grn_header_id=?;"
                  sub_department_id = result[1].length > 0 ? result[1][0].hims_d_sub_department_id : null
                }

                if (result[3][0].cost_center_required === "Y" && result[3][0].cost_center_type === "P") {
                  strQuery += `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`
                }

                _mysql
                  .executeQuery({
                    query: strQuery,
                    values: [inputParam.hims_f_procurement_grn_header_id],
                    printQuery: true
                  })
                  .then(header_result => {
                    let project_id = null;
                    let headerResult = []
                    if (header_result.length > 1) {
                      headerResult = header_result[0]
                      project_id = header_result[1][0].project_id
                    } else {
                      headerResult = header_result
                    }

                    _mysql
                      .executeQuery({
                        query: "INSERT INTO finance_day_end_header (transaction_date, amount, voucher_type, document_id,\
                        document_number, from_screen, narration,  invoice_no, due_date, entered_date, entered_by) \
                        VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          headerResult[0].net_payable,
                          "purchase",
                          headerResult[0].hims_f_procurement_grn_header_id,
                          headerResult[0].grn_number,
                          inputParam.ScreenCode,
                          "Receipt Generated " + "/" + headerResult[0].vendor_name + "/" + headerResult[0].net_payable,
                          headerResult[0].inovice_number,
                          inputParam.due_date,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id
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
                          "credit_amount",
                          "hospital_id"
                        ];

                        //Vendor Entry
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: headerResult[0].v_head_id,
                          child_id: headerResult[0].v_child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount: headerResult[0].net_payable,
                          hospital_id: req.userIdentity.hospital_id
                        });

                        //Tax Entry
                        if (parseFloat(headerResult[0].total_tax) > 0) {
                          insertSubDetail.push({
                            payment_date: new Date(),
                            head_id: input_tax_acc.head_id,
                            child_id: input_tax_acc.child_id,
                            debit_amount: headerResult[0].total_tax,
                            payment_type: "DR",
                            credit_amount: 0,
                            hospital_id: req.userIdentity.hospital_id
                          });
                        }

                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: headerResult[0].head_id,
                          child_id: headerResult[0].child_id,
                          debit_amount: headerResult[0].net_total,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: headerResult[0].hospital_id
                        });


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
                              project_id: project_id,
                              sub_department_id: sub_department_id
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
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = org_data;
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
        next(e);
      });
    }
  },

  revertReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQuery({
          query: " UPDATE hims_f_procurement_po_header SET is_posted='N', authorize1='N', authorize2='N',\
                    is_revert='Y', revert_reason=?, reverted_date=?, reverted_by=? WHERE hims_f_procurement_po_header_id=?; \
                    UPDATE hims_f_procurement_grn_header SET is_revert='Y', reverted_date=?, reverted_by=? \
                    WHERE hims_f_procurement_grn_header_id=?;",
          values: [
            inputParam.revert_reason,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.po_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_procurement_grn_header_id
          ],
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
  }
};
