import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";
import algaehMail from "algaeh-utilities/mail-send";
import newAxios from "algaeh-utilities/axios";

export default {
  getPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT PH.*, VQH.vendor_quotation_number,\
            CASE WHEN PH.po_from = 'INV' THEN (select material_requisition_number from hims_f_inventory_material_header \
            where hims_f_inventory_material_header_id=PH.inv_requisition_id ) \
            else (select material_requisition_number from hims_f_pharamcy_material_header  \
            where hims_f_pharamcy_material_header_id=PH.phar_requisition_id) END as material_requisition_number,\
            CASE PH.po_from WHEN 'INV' then IL.location_description \
            else PL.location_description end as location_name, V.vendor_name,V.email_id_1,\
            max(if(U.algaeh_d_app_user_id = PH.reverted_by, E.full_name,'' )) as reverted_name, \
            max(if(U.algaeh_d_app_user_id = PH.created_by, E.full_name,'' )) as created_name \
            from  hims_f_procurement_po_header PH inner join hims_d_vendor V on PH.vendor_id = V.hims_d_vendor_id \
            inner join algaeh_d_app_user U on (PH.created_by = U.algaeh_d_app_user_id or PH.reverted_by = U.algaeh_d_app_user_id)\
            inner join hims_d_employee E on E.hims_d_employee_id = U.employee_id \
            left join hims_d_pharmacy_location PL on PH.pharmcy_location_id = PL.hims_d_pharmacy_location_id \
            left join hims_d_inventory_location IL on PH.inventory_location_id = IL.hims_d_inventory_location_id \
            left join hims_f_procurement_vendor_quotation_header VQH on VQH.hims_f_procurement_vendor_quotation_header_id = PH.vendor_quotation_header_id \
            where purchase_number=? group by hims_f_procurement_po_header_id",
          values: [req.query.purchase_number],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            let strQuery = "";

            if (headerResult[0].po_mode == "S") {
              strQuery = mysql.format(
                "select PS.*, S.service_name from hims_f_procurement_po_services PS \
                inner join hims_d_services S on S.hims_d_services_id = PS.services_id where procurement_header_id=?;",
                [headerResult[0].hims_f_procurement_po_header_id]
              );
            } else {
              let strCondition = "";
              if (req.query.from === "DN") {
                strCondition = " and quantity_outstanding > 0";
              }
              if (headerResult[0].po_from == "INV") {
                strQuery = mysql.format(
                  "select PD.`hims_f_procurement_po_detail_id`, PD.`procurement_header_id`, PD.`phar_item_category`,\
                   PD.`phar_item_group`, PD.`phar_item_id`, PD.`inv_item_category_id`, PD.`inv_item_group_id`,\
                   PD.`inv_item_id`, PD.`barcode`, PD.`order_quantity`, PD.`foc_quantity`, PD.`total_quantity`,\
                   PD.`pharmacy_uom_id`, PD.`inventory_uom_id`, PD.`unit_price`, PD.`extended_price`,\
                   PD.`sub_discount_percentage`, PD.`sub_discount_amount`, PD.`extended_cost`, PD.`unit_cost`,\
                   PD.`discount_percentage`, PD.`discount_amount`, PD.`net_extended_cost`,\
                   PD.`vendor_item_no`, PD.`manufacturer_item_code`, PD.`completed`, PD.`completed_date`,\
                   PD.`quantity_recieved`, PD.`quantity_outstanding`, PD.`pharmacy_requisition_id`,\
                   PD.`inventory_requisition_id`, PD.`authorize_quantity`, PD.`rejected_quantity`, PD.`tax_percentage`,\
                   PD.`tax_amount`, PD.`total_amount`, PD.`mrp_price`, PD.`calculate_tax_on`,\
                   PD.`tax_discount`, PD.`item_type`, IM.item_code, IM.item_description, IM.exp_date_required,\
                   IU.uom_description, IU.uom_description as purchase_uom_desc, STOCK_UOM.uom_description as stock_uom_description,\
                   S.standard_fee as sales_price,IM.sales_uom_id, \
                   IC.category_desc,IG.group_description from hims_f_procurement_po_detail PD,\
                   hims_d_inventory_item_master IM ,hims_d_inventory_uom IU, hims_d_inventory_uom STOCK_UOM, hims_d_services S, \
                   hims_d_inventory_tem_category as IC,hims_d_inventory_item_group as IG \
                   where PD.inv_item_id = IM.hims_d_inventory_item_master_id\
                   and PD.inventory_uom_id = IU.hims_d_inventory_uom_id and IM.stocking_uom_id = STOCK_UOM.hims_d_inventory_uom_id and IM.service_id = S.hims_d_services_id \
                   and IC.hims_d_inventory_tem_category_id = PD.inv_item_category_id and \
                   IG.hims_d_inventory_item_group_id =PD.inv_item_group_id \
                   and procurement_header_id=?" +
                  strCondition,
                  [headerResult[0].hims_f_procurement_po_header_id]
                );
              } else if (headerResult[0].po_from == "PHR") {
                strQuery = mysql.format(
                  "select PD.`hims_f_procurement_po_detail_id`, PD.`procurement_header_id`, PD.`phar_item_category`, PD.`phar_item_group`, PD.`phar_item_id`, \
                PD.`inv_item_category_id`, PD.`inv_item_group_id`, PD.`inv_item_id`, PD.`barcode`, PD.`order_quantity`, PD.`foc_quantity`, \
                PD.`total_quantity`, PD.`pharmacy_uom_id`, PD.`inventory_uom_id`, PD.`unit_price`, PD.`extended_price`, PD.`sub_discount_percentage`, \
                PD.`sub_discount_amount`, PD.`extended_cost`, PD.`unit_cost`, PD.`discount_percentage`, PD.`discount_amount`, PD.`net_extended_cost`, \
                PD.`vendor_item_no`, PD.`manufacturer_item_code`, PD.`completed`, PD.`completed_date`, PD.`quantity_recieved`, \
                PD.`quantity_outstanding`, PD.`pharmacy_requisition_id`, PD.`inventory_requisition_id`, PD.`authorize_quantity`, PD.`rejected_quantity`, \
                PD.`tax_percentage`, PD.`tax_amount`, PD.`total_amount`, PD.`mrp_price`, PD.`calculate_tax_on`, PD.`tax_discount`, PD.`item_type`, \
                IM.item_code, IM.item_description,  IM.exp_date_required,\
                PU.uom_description, PU.uom_description as purchase_uom_desc, STOCK_UOM.uom_description  as stock_uom_description, \
                S.standard_fee as sales_price,IM.sales_uom_id,IG.group_description,IC.category_desc \
                from hims_f_procurement_po_detail PD, hims_d_item_master IM ,hims_d_pharmacy_uom PU, hims_d_pharmacy_uom STOCK_UOM, hims_d_services S,\
                hims_d_item_group as IG,hims_d_item_category as IC \
                where PD.phar_item_id = IM.hims_d_item_master_id and PD.pharmacy_uom_id = PU.hims_d_pharmacy_uom_id \
                and IM.stocking_uom_id = STOCK_UOM.hims_d_pharmacy_uom_id and IM.service_id = S.hims_d_services_id and \
                IC.hims_d_item_category_id = PD.phar_item_category and IG.hims_d_item_group_id = PD.phar_item_group and procurement_header_id=?" +
                  strCondition,
                  [headerResult[0].hims_f_procurement_po_header_id]
                );
              }
            }
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true,
              })
              .then((po_entry_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail },
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

  addPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let input = JSON.parse(buffer);
        req.body = input;
        let purchase_number = "";
        _mysql
          .generateRunningNumber({
            user_id: req.userIdentity.algaeh_d_app_user_id,
            numgen_codes: ["PO_NUM"],
            table_name: "hims_f_procurement_numgen",
          })
          .then((generatedNumbers) => {
            purchase_number = generatedNumbers.PO_NUM;

            // let today = moment().format("YYYY-MM-DD");

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_f_procurement_po_header` (purchase_number,po_date,po_mode,po_type,po_from, \
                    pharmcy_location_id,inventory_location_id,location_type,vendor_id,on_hold, phar_requisition_id,\
                inv_requisition_id, vendor_quotation_header_id,\
                from_multiple_requisition, payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
                sheet_level_discount_amount,description,net_total,total_tax, net_payable,created_by,created_date, \
                updated_by,updated_date,project_id,hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                values: [
                  purchase_number,
                  new Date(),
                  input.po_mode,
                  input.po_type,
                  input.po_from,
                  input.pharmcy_location_id,
                  input.inventory_location_id,
                  input.location_type,
                  input.vendor_id,
                  input.on_hold,
                  input.requisition_id,
                  input.inv_requisition_id,
                  input.vendor_quotation_header_id,
                  input.from_multiple_requisition,
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
                  input.project_id,
                  input.po_mode === "I"
                    ? req.userIdentity.hospital_id
                    : input.hospital_id,
                ],
                printQuery: true,
              })
              .then((headerResult) => {
                req.connection = {
                  connection: _mysql.connection,
                  isTransactionConnection: _mysql.isTransactionConnection,
                  pool: _mysql.pool,
                };
                let IncludeValues = [];
                if (input.po_mode === "I") {
                  IncludeValues = [
                    "phar_item_category",
                    "phar_item_group",
                    "phar_item_id",
                    "inv_item_category_id",
                    "inv_item_group_id",
                    "inv_item_id",
                    "order_quantity",
                    "total_quantity",
                    "pharmacy_uom_id",
                    "inventory_uom_id",
                    "unit_price",
                    "extended_price",
                    "sub_discount_percentage",
                    "sub_discount_amount",
                    "extended_cost",
                    "net_extended_cost",
                    "unit_cost",
                    "pharmacy_requisition_id",
                    "inventory_requisition_id",
                    "authorize_quantity",
                    "tax_percentage",
                    "tax_amount",
                    "total_amount",
                    "item_type",
                    "quantity_outstanding",
                    "rejected_quantity",
                  ];

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_f_procurement_po_detail(??) VALUES ?",
                      values: input.po_entry_detail,
                      includeValues: IncludeValues,
                      extraValues: {
                        procurement_header_id: headerResult.insertId,
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true,
                    })
                    .then((detailResult) => {
                      // _mysql.commitTransaction(() => {
                      //   _mysql.releaseConnection();
                      req.records = {
                        purchase_number: purchase_number,
                        hims_f_procurement_po_header_id: headerResult.insertId,
                      };
                      next();
                      // });
                    })
                    .catch((error) => {
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
                    "total_amount",
                  ];

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_f_procurement_po_services(??) VALUES ?",
                      values: input.po_services,
                      includeValues: IncludeValues,
                      extraValues: {
                        procurement_header_id: headerResult.insertId,
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true,
                    })
                    .then((detailResult) => {
                      // _mysql.commitTransaction(() => {
                      //   _mysql.releaseConnection();
                      req.records = {
                        purchase_number: purchase_number,
                        hims_f_procurement_po_header_id: headerResult.insertId,
                      };
                      next();
                      // });
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                }
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
      });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  postPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let input = JSON.parse(buffer);
        req.body = input;
        // const utilities = new algaehUtilities();

        // let today = moment().format("YYYY-MM-DD");

        _mysql
          .executeQueryWithTransaction({
            query:
              "UPDATE `hims_f_procurement_po_header` SET payment_terms=?, is_posted= ?, sub_total =? , detail_discount =?, extended_total =?,\
                sheet_level_discount_percent = ?, sheet_level_discount_amount = ?, net_total = ?, total_tax = ?, \
                net_payable=?, updated_by=?,updated_date=? where hims_f_procurement_po_header_id=?;",
            values: [
              input.payment_terms,
              input.is_posted,
              input.sub_total,
              input.detail_discount,
              input.extended_total,
              input.sheet_level_discount_percent,
              input.sheet_level_discount_amount,
              input.net_total,
              input.total_tax,
              input.net_payable,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              input.hims_f_procurement_po_header_id,
            ],
            printQuery: true,
          })
          .then((headerResult) => {
            let strQuery = "";
            let IncludeValues = [];
            if (input.po_mode === "I") {
              if (input.delete_stock_detail.length > 0) {
                strQuery += mysql.format(
                  "DELETE FROM hims_f_procurement_po_detail where hims_f_procurement_po_detail_id in (?);",
                  [input.delete_stock_detail]
                );
              }
              const update_po_detail = _.filter(input.po_entry_detail, (f) => {
                return (
                  f.hims_f_procurement_po_detail_id !== null &&
                  f.hims_f_procurement_po_detail_id !== undefined
                );
              });

              if (update_po_detail.length > 0) {
                for (let i = 0; i < update_po_detail.length; i++) {
                  strQuery += mysql.format(
                    "UPDATE hims_f_procurement_po_detail set extended_price=?,sub_discount_percentage=?, \
                sub_discount_amount=?,extended_cost=?,net_extended_cost=?,unit_cost=?,\
                tax_amount=?,total_amount=? where hims_f_procurement_po_detail_id=?;",
                    [
                      update_po_detail[i].extended_price,
                      update_po_detail[i].sub_discount_percentage,
                      update_po_detail[i].sub_discount_amount,
                      update_po_detail[i].extended_cost,
                      update_po_detail[i].net_extended_cost,
                      update_po_detail[i].unit_cost,
                      update_po_detail[i].tax_amount,
                      update_po_detail[i].total_amount,
                      update_po_detail[i].hims_f_procurement_po_detail_id,
                    ]
                  );
                }
              }

              const insert_po_detail = _.filter(input.po_entry_detail, (f) => {
                return (
                  f.hims_f_procurement_po_detail_id === null ||
                  f.hims_f_procurement_po_detail_id === undefined
                );
              });

              if (insert_po_detail.length > 0) {
                IncludeValues = [
                  "phar_item_category",
                  "phar_item_group",
                  "phar_item_id",
                  "inv_item_category_id",
                  "inv_item_group_id",
                  "inv_item_id",
                  "order_quantity",
                  "total_quantity",
                  "pharmacy_uom_id",
                  "inventory_uom_id",
                  "unit_price",
                  "extended_price",
                  "sub_discount_percentage",
                  "sub_discount_amount",
                  "extended_cost",
                  "net_extended_cost",
                  "unit_cost",
                  "pharmacy_requisition_id",
                  "inventory_requisition_id",
                  "authorize_quantity",
                  "tax_percentage",
                  "tax_amount",
                  "total_amount",
                  "item_type",
                  "quantity_outstanding",
                  "rejected_quantity",
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_procurement_po_detail(??) VALUES ?; " +
                      strQuery,
                    values: insert_po_detail,
                    includeValues: IncludeValues,
                    extraValues: {
                      procurement_header_id:
                        input.hims_f_procurement_po_header_id,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((detailResult) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        purchase_number: input.purchase_number,
                        hims_f_procurement_po_header_id:
                          input.hims_f_procurement_po_header_id,
                      };
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              } else {
                _mysql
                  .executeQuery({
                    query: strQuery,
                    printQuery: true,
                  })
                  .then((result) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        purchase_number: input.purchase_number,
                        hims_f_procurement_po_header_id:
                          input.hims_f_procurement_po_header_id,
                      };
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            } else {
              // console.log("input.delete_po_services", input.delete_po_services);
              // console.log("input.po_services", input.po_services);
              if (input.delete_po_services.length > 0) {
                strQuery += mysql.format(
                  "DELETE FROM hims_f_procurement_po_services where hims_f_procurement_po_services_id in (?);",
                  [input.delete_po_services]
                );
              } else {
                strQuery += "select 1=1";
              }

              const insert_po_detail = _.filter(input.po_services, (f) => {
                return (
                  f.hims_f_procurement_po_services_id === null ||
                  f.hims_f_procurement_po_services_id === undefined
                );
              });

              if (insert_po_detail.length > 0) {
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
                  "total_amount",
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_procurement_po_services(??) VALUES ?; " +
                      strQuery,
                    values: insert_po_detail,
                    includeValues: IncludeValues,
                    extraValues: {
                      procurement_header_id:
                        input.hims_f_procurement_po_header_id,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((detailResult) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        purchase_number: input.purchase_number,
                        hims_f_procurement_po_header_id:
                          input.hims_f_procurement_po_header_id,
                      };
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              } else {
                _mysql
                  .executeQuery({
                    query: strQuery,
                    printQuery: true,
                  })
                  .then((result) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        purchase_number: input.purchase_number,
                        hims_f_procurement_po_header_id:
                          input.hims_f_procurement_po_header_id,
                      };
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            }
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

  updatePurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    let qryExecute = false;

    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let inputParam = JSON.parse(buffer);
        req.body = inputParam;
        req.mySQl = _mysql;

        let strQuery = "";
        let strUpdQry = "";
        let strRecptQry = "select 1=1";

        // console.log("inputParam.is_revert", inputParam.is_revert)
        if (inputParam.is_revert == "Y") {
          strUpdQry = " is_revert='N',";
          strRecptQry = mysql.format(
            `select hims_f_procurement_grn_header_id from hims_f_procurement_grn_header where po_id=?`,
            [inputParam.hims_f_procurement_po_header_id]
          );
          inputParam.is_completed = "Y"
        }
        // console.log("inputParam.authorize", inputParam.authorize);
        // console.log("inputParam.authorize", inputParam.po_auth_level);
        if (inputParam.po_auth_level == "1") {
          strQuery = mysql.format(
            `UPDATE hims_f_procurement_po_header SET ${strUpdQry} is_completed = ?, authorize1=?, authorize_by_date=?, authorize_by_1=?, \
            authorize2=?, authorize2_date=?, authorize2_by=? WHERE hims_f_procurement_po_header_id=?; ` + strRecptQry,
            [
              inputParam.is_completed,
              inputParam.authorize1,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.authorize2,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.hims_f_procurement_po_header_id,
            ]
          );
        } else {
          if (inputParam.authorize == "authorize1") {
            strQuery = mysql.format(
              "UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize_by_date`=?, `authorize_by_1`=? \
              WHERE `hims_f_procurement_po_header_id`=?;" + "select 1=1",
              [
                inputParam.authorize1,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.hims_f_procurement_po_header_id,
              ]
            );
          } else if (inputParam.authorize == "authorize2") {
            strQuery = mysql.format(
              `UPDATE hims_f_procurement_po_header SET ${strUpdQry} is_completed = ?, \
                  authorize2=?, authorize2_date=?, authorize2_by=? WHERE hims_f_procurement_po_header_id=?;` + strRecptQry,
              [
                inputParam.is_completed,
                inputParam.authorize2,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.hims_f_procurement_po_header_id,
              ]
            );
          }
        }
        _mysql
          .executeQueryWithTransaction({
            query: strQuery,
            printQuery: true,
          })
          .then((headerResult) => {
            req.connection = {
              connection: _mysql.connection,
              isTransactionConnection: _mysql.isTransactionConnection,
              pool: _mysql.pool,
            };
            // let receipt_data = headerResult[1][0];

            // console.log("headerResult", headerResult[1][0])
            let receipt_data = [];
            headerResult[1].map((o) => {
              if (o.hims_f_procurement_grn_header_id !== undefined) {
                receipt_data.push(o.hims_f_procurement_grn_header_id);
              }
            });

            // console.log("receipt_data", receipt_data)
            let details = inputParam.po_entry_detail;

            if (details.length > 0) {
              let qry = "";

              for (let i = 0; i < details.length; i++) {
                qry += mysql.format(
                  "UPDATE hims_f_procurement_po_detail SET `authorize_quantity`=?, rejected_quantity=?,\
                      quantity_recieved=?, quantity_outstanding=?\
                      where `hims_f_procurement_po_detail_id`=?;",
                  [
                    details[i].authorize_quantity,
                    details[i].rejected_quantity,
                    details[i].quantity_recieved,
                    details[i].quantity_outstanding,
                    details[i].hims_f_procurement_po_detail_id,
                  ]
                );

                if (i == details.length - 1) {
                  qryExecute = true;
                }
              }
              if (receipt_data.length > 0) {
                qry += mysql.format("UPDATE hims_f_procurement_grn_header SET is_revert='N', payment_terms=? WHERE hims_f_procurement_grn_header_id in (?); ",
                  [
                    inputParam.payment_terms,
                    receipt_data
                  ]
                );
              }

              if (qryExecute == true) {
                _mysql
                  .executeQuery({
                    query: qry,
                    printQuery: true,
                  })
                  .then((detailResult) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = detailResult;
                      next();
                    });
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              }
            } else {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = headerResult;
                next();
              });
            }
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

  getAuthPurchaseList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      // let strQuery =
      //   "SELECT * from  hims_f_procurement_po_header\
      //       where cancelled='N' ";

      // if (inputParam.pharmcy_location_id != null) {
      //   strQuery +=
      //     " and pharmcy_location_id = " + inputParam.pharmcy_location_id;
      // }
      // if (inputParam.inventory_location_id != null) {
      //   strQuery +=
      //     " and inventory_location_id = " + inputParam.inventory_location_id;
      // }

      let strQuery =
        "SELECT PO.*,V.vendor_name,US.user_display_name as created_name, AE.user_display_name as auth_name, case \
          when cancelled='Y'  then 'PO Rejected'\
          when  is_posted = 'Y' and authorize1 = 'N' then 'Autorization 1 Pending'\
          when authorize1 = 'Y' and authorize2 = 'N'  then 'Final Autorization Pending'\
          when authorize1 = 'Y' and authorize2 = 'Y' and is_completed='N'  then 'Delivery Pending'\
          when is_completed='Y'  and receipt_generated ='N' then 'Delivery Completed' \
          when is_completed='Y'  and receipt_generated ='Y' then 'PO Closed' end status \
          from  hims_f_procurement_po_header PO \
          inner join hims_d_vendor V on PO.vendor_id = V.hims_d_vendor_id \
          inner join algaeh_d_app_user US on PO.created_by = US.algaeh_d_app_user_id \
          left join algaeh_d_app_user AE on PO.authorize_by_1 = AE.algaeh_d_app_user_id \
          where 1=1 ";

      if (req.query.from_date != null) {
        strQuery +=
          " and date(po_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        strQuery += " and date(po_date) <= date(now())";
      }

      if (inputParam.po_from != null) {
        strQuery += " and po_from = '" + inputParam.po_from + "'";
      }
      if (inputParam.pharmcy_location_id != null) {
        strQuery +=
          " and pharmcy_location_id = " + inputParam.pharmcy_location_id;
      }
      if (inputParam.inventory_location_id != null) {
        strQuery +=
          " and inventory_location_id = " + inputParam.inventory_location_id;
      }
      // if (inputParam.authorize1 != null) {
      //   strQuery += " and authorize1 = '" + inputParam.authorize1 + "'";
      // }

      if (inputParam.status == null || inputParam.status == "0") {
        strQuery += "";
      } else if (inputParam.status == "1") {
        //Pending To Authorize 1
        strQuery +=
          " and is_posted = 'Y' and authorize1 = 'N' and cancelled = 'N'";
      } else if (inputParam.status == "2") {
        //Pending To Authorize 2
        strQuery +=
          " and authorize1 = 'Y' and authorize2 = 'N' and cancelled = 'N'";
      } else if (inputParam.status == "3") {
        strQuery +=
          " and authorize1 = 'Y' and authorize2 = 'Y' and is_completed='N' and cancelled = 'N'";
      } else if (inputParam.status == "4") {
        strQuery += " and is_completed='Y'";
      } else if (inputParam.status == "5") {
        strQuery += " and cancelled = 'Y'";
      }

      // if (inputParam.status == null || inputParam.status == "0") {
      //   strQuery += "";
      // } else if (inputParam.status == "1") {
      //   //Pending To Authorize 1
      //   strQuery += " and authorize1 = 'N'";
      // } else if (inputParam.status == "2") {
      //   strQuery += " and authorize1 = 'Y' and is_completed='N'";
      // } else if (inputParam.status == "3") {
      //   strQuery += " and is_completed='Y'";
      // }
      // else if (inputParam.status == "3") {
      //   strQuery += " and authorize1 = 'Y' and authorie2 = 'N'";
      // }

      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
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

  getPharRequisitionEntryPO: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_pharamcy_material_header where material_requisition_number=?",
          values: [req.query.material_requisition_number],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query: `select MD.*,l.*, IM.item_description,IC.category_desc,IG.group_description,
                  UOM.uom_description as purchase_uom_desc from hims_f_pharmacy_material_detail as MD
                  left outer join hims_d_item_master l on l.hims_d_item_master_id =MD.item_id
                  inner join hims_d_item_master IM ON MD.item_id=IM.hims_d_item_master_id 
                  inner join hims_d_item_category IC ON MD.item_category_id=IC.hims_d_item_category_id 
                  inner join hims_d_item_group IG ON MD.item_group_id=IG.hims_d_item_group_id 
                  inner join hims_d_pharmacy_uom UOM ON MD.item_uom=UOM.hims_d_pharmacy_uom_id 
                  
                   where pharmacy_header_id=?`,
                values: [headerResult[0].hims_f_pharamcy_material_header_id],
                printQuery: true,
              })
              .then((po_entry_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail },
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

  getInvRequisitionEntryPO: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_inventory_material_header where material_requisition_number=?",
          values: [req.query.material_requisition_number],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query: `select p.*, l.*, IU.uom_description as purchase_uom_desc,IC.category_desc,IG.group_description from hims_f_inventory_material_detail p 
                  inner join hims_d_inventory_item_master l on l.hims_d_inventory_item_master_id =p.item_id 
                  inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = p.item_uom
                  inner join hims_d_inventory_tem_category IC ON p.item_category_id=IC.hims_d_inventory_tem_category_id
                  inner join hims_d_inventory_item_group IG ON p.item_group_id=IG.hims_d_inventory_item_group_id
                  where inventory_header_id=?`,
                values: [headerResult[0].hims_f_inventory_material_header_id],
                printQuery: true,
              })
              .then((po_entry_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail },
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

  releaseDB: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.data = req.records.purchase_number;
        next();
      });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePharReqEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const details = req.body.po_entry_detail;

      let qry = "";

      for (let i = 0; i < details.length; i++) {
        qry += mysql.format(
          "UPDATE hims_f_pharmacy_material_detail SET `po_created_date`=?, po_created='Y', po_created_quantity=?\
              where `hims_f_pharmacy_material_detail_id`=? ;",
          [
            new Date(),
            details[i].total_quantity,
            details[i].pharmacy_requisition_id,
          ]
        );
      }
      _mysql
        .executeQuery({
          query: qry,
          printQuery: true,
        })
        .then((detailResult) => {
          req.data = req.records.purchase_number;
          next();
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

  updateInvReqEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      // console.log("updateInvReqEntry");
      let qry = "";
      if (req.body.po_type === "PR") {
        qry += mysql.format(
          "UPDATE hims_f_inventory_material_header SET is_completed='Y' ,`completed_date`=? \
          where `hims_f_inventory_material_header_id`=? ;",
          [new Date(), req.body.inv_requisition_id]
        );
      } else {
        const details = req.body.po_entry_detail;
        for (let i = 0; i < details.length; i++) {
          qry += mysql.format(
            "UPDATE hims_f_inventory_material_detail SET `po_created_date`=?, po_created='Y', po_created_quantity=?\
              where `hims_f_inventory_material_detail_id`=? ;",
            [
              new Date(),
              details[i].total_quantity,
              details[i].inventory_requisition_id,
            ]
          );
        }
      }
      _mysql
        .executeQuery({
          query: qry,
          printQuery: true,
        })
        .then((detailResult) => {
          req.data = req.records.purchase_number;
          next();
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

  getVendorQuotation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_procurement_vendor_quotation_header where vendor_quotation_number=?",
          values: [req.query.vendor_quotation_number],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_procurement_vendor_quotation_detail vendor_quotation_header_id=?",
                values: [
                  headerResult[0].hims_f_procurement_vendor_quotation_header_id,
                ],
                printQuery: true,
              })
              .then((po_entry_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail },
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
  raiseRequestForPO: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_procurement_purchase_request` (item_id, request_from, request_location, \
              request_qty, requested_date) \
            VALUE(?, ?, ?, ?, ?)",
          values: [
            req.body.item_id,
            req.body.request_from,
            req.body.request_location,
            req.body.request_qty,
            new Date(),
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          _mysql.releaseConnection();
          req.records = headerResult;
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
  getraiseRequestForPO: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let strQuery = "";
      if (req.query.category_id != null) {
        strQuery += " and category_id = " + req.query.category_id;
      }
      _mysql
        .executeQuery({
          query:
            "select PR.*, IM.item_description,IL.location_description, IM.hims_d_inventory_item_master_id as inv_item_id, \
            IM.category_id as inv_item_category_id, IM.group_id as inv_item_group_id, IM.purchase_uom_id as inventory_uom_id, \
            PR.request_qty as quantity, requested_date as start_date from hims_f_procurement_purchase_request PR \
            inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = PR.item_id\
            inner join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = PR.request_location where 1=1" +
            strQuery,
          printQuery: true,
        })
        .then((headerResult) => {
          _mysql.releaseConnection();
          req.records = headerResult;
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

  rejectPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_procurement_po_header` SET `is_posted` = 'N', authorize1='N', comment=? \
          WHERE `hims_f_procurement_po_header_id`=?; ",
          values: [req.body.comment, req.body.hims_f_procurement_po_header_id],
          printQuery: true,
        })
        .then((headerResult) => {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
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
  cancelPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_procurement_po_header set cancelled = 'Y', comment=?, cancel_by = ? , cancel_date = ? \
            WHERE `hims_f_procurement_po_header_id`=?;",
          values: [
            req.body.comment,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_f_procurement_po_header_id,
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          _mysql.releaseConnection();
          req.records = headerResult;
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
  getReportForMail: (req, res, next) => {
    const {
      hospital_address,
      hospital_name,
      currency_symbol,
    } = req.userIdentity;
    const {
      vendor_email,
      po_from,
      purchase_number,
      location_name,
      po_date,
      net_total,
      vendor_name,
      body_mail,
      send_attachment,
    } = req.query;

    const mail_body = body_mail ? body_mail : "";
    try {
      const reportInput = [
        {
          report: {
            reportName:
              po_from === "PHR"
                ? "poPharmacyProcurement"
                : "poInventoryProcurement",
            reportParams: [
              {
                name: "purchase_number",
                value: purchase_number,
              },
            ],
            outputFileType: "PDF",
          },
        },
      ];

      newAxios(req, {
        url: "http://localhost:3006/api/v1//Document/getEmailConfig",
      }).then((res) => {
        const options = res.data;
        const mailSender = new algaehMail(options.data[0])
          .to(vendor_email)
          .subject("Purchase Order Report")
          .templateHbs("purchaseOrder.hbs", {
            hospital_address,
            hospital_name,
            purchase_number,
            location_name,
            po_date,
            net_total,
            vendor_name,
            currency_symbol,
            mail_body,
          });

        if (send_attachment === "true") {
          mailSender.attachReportsAndSend(
            req,
            reportInput,
            (error, records) => {
              if (error) {
                next(error);
                return;
              }

              next();
            }
          );
        } else {
          mailSender
            .send()
            .then(() => {
              // console.log("Mail Sent");
              next();
            })
            .catch((error) => {
              next(error);
            });
        }
      });
    } catch (e) {
      //_mysql.releaseConnection();
      next(e);
    }
  },
};
