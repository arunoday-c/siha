import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";

export function getDispatchNote(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    // console.log("req.query.dispatch_note_number", req.query.dispatch_note_number)
    _mysql
      .executeQuery({
        query: `SELECT DH.*, E.full_name from  hims_f_sales_dispatch_note_header DH \
          inner join algaeh_d_app_user U on DH.created_by = U.algaeh_d_app_user_id \
          inner join hims_d_employee E on E.hims_d_employee_id = U.employee_id \
          where dispatch_note_number=? ;
          select D.*,IM.item_description, IU.uom_description from  hims_f_sales_dispatch_note_header H inner join \
          hims_f_sales_dispatch_note_detail D on H.hims_f_dispatch_note_header_id = D.dispatch_note_header_id \
          inner join hims_d_inventory_item_master IM on D.item_id=IM.hims_d_inventory_item_master_id \
          inner join hims_d_inventory_uom IU on D.uom_id=IU.hims_d_inventory_uom_id where dispatch_note_number=? ;
          select S.*, IU.uom_description, IM.item_description from  hims_f_sales_dispatch_note_header H \
          inner join  hims_f_sales_dispatch_note_detail D on H.hims_f_dispatch_note_header_id=D.dispatch_note_header_id \
          inner join hims_f_sales_dispatch_note_batches S on D.hims_f_sales_dispatch_note_detail_id=S.sales_dispatch_note_detail_id \
          inner join hims_d_inventory_uom IU on S.uom_id=IU.hims_d_inventory_uom_id \
          inner join hims_d_inventory_item_master IM on S.item_id=IM.hims_d_inventory_item_master_id \          
          where dispatch_note_number=?;`,
        values: [
          req.query.dispatch_note_number,
          req.query.dispatch_note_number,
          req.query.dispatch_note_number,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        if (result[0].length > 0) {
          let header = result[0];
          let detail = result[1];
          let subDetail = result[2];

          let outputArray = [];

          for (let i = 0; i < header.length; i++) {
            let t_details = new LINQ(detail)
              .Where(
                (w) =>
                  w.dispatch_note_header_id ==
                  header[i]["hims_f_dispatch_note_header_id"]
              )
              .Select((s) => s)
              .ToArray();

            let temp = [];
            for (let m = 0; m < t_details.length; m++) {
              let sub_details = new LINQ(subDetail)
                .Where(
                  (w) =>
                    w.sales_dispatch_note_detail_id ==
                    t_details[m]["hims_f_sales_dispatch_note_detail_id"]
                )
                .Select((s) => s)
                .ToArray();

              temp.push({
                ...t_details[m],
                inventory_stock_detail: sub_details,
              });
            }

            outputArray.push({
              ...header[i],
              stock_detail: temp,
            });
          }

          req.records = outputArray;
          next();
        } else {
          req.records = result[0];
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
}

export function getSalesOrderItem(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    let inputParam = req.query;

    _mysql
      .executeQuery({
        query: `SELECT SQ.*, C.customer_name, H.hospital_name, P.project_desc as project_name from hims_f_sales_order SQ 
          inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id 
          inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id 
          inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id 
          where SQ.sales_order_number=?`,
        values: [inputParam.sales_order_number],
        printQuery: false,
      })
      .then((headerResult) => {
        if (headerResult.length != 0) {
          _mysql
            .executeQuery({
              query: `select D.*, D.hims_f_sales_order_items_id as sales_order_items_id,     IM.item_description,    
              (D.quantity - D.quantity_outstanding) as delivered_to_date,
              D.quantity as ordered_quantity, 0 as selected_quantity, 'N' as removed, 
              LOC.hims_m_inventory_item_location_id, LOC.inventory_location_id, LOC.batchno,
              LOC.expirydt as expiry_date, LOC.barcode, LOC.qtyhand, LOC.cost_uom, 
              LOC.avgcost as average_cost, LOC.item_type, LOC.sale_price, LOC.sales_uom,
              IM.hims_d_inventory_item_master_id, IM.item_description,IM.category_id as item_category_id, IM.group_id as item_group_id,
              PU.uom_description, 0 as dispatch_quantity from hims_f_sales_order_items D
              inner join hims_d_inventory_uom PU  on PU.hims_d_inventory_uom_id=D.uom_id
              inner join hims_d_inventory_item_master IM  on IM.hims_d_inventory_item_master_id=D.item_id
              left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id
              and  (date(LOC.expirydt) > date(CURDATE()) or LOC.expirydt is null)
              where D.sales_order_id=? and D.quantity_outstanding<>0 order by  date(LOC.expirydt)`,
              //   `select D.*, D.hims_f_sales_order_items_id as sales_order_items_id,
              // (D.quantity - D.quantity_outstanding) as delivered_to_date,
              // D.quantity as ordered_quantity, 0 as selected_quantity, 'N' as removed,
              // COALESCE(LOC.hims_m_inventory_item_location_id, LOCAD.hims_m_inventory_item_location_id) as hims_m_inventory_item_location_id ,
              // COALESCE(LOC.inventory_location_id, LOCAD.inventory_location_id) as inventory_location_id, COALESCE(LOC.batchno,LOCAD.batchno) as batchno
              // ,COALESCE(LOC.expirydt, LOCAD.expirydt) as expiry_date,COALESCE(LOC.barcode,LOCAD.barcode) as barcode,
              // COALESCE(LOC.qtyhand,LOCAD.qtyhand) as qtyhand,COALESCE(LOC.cost_uom, LOCAD.cost_uom) as cost_uom,
              // COALESCE(LOC.avgcost, LOCAD.avgcost) as avgcost,COALESCE(LOC.item_type, LOCAD.item_type) as item_type,
              // COALESCE(LOC.sale_price, LOCAD.sale_price) as sale_price,COALESCE(LOC.sales_uom, LOCAD.sales_uom) as sales_uom,
              // IM.hims_d_inventory_item_master_id, IM.item_description,IM.category_id as item_category_id, IM.group_id as item_group_id,
              // PU.uom_description, 0 as dispatch_quantity from hims_f_sales_order_items D
              // inner join hims_d_inventory_uom PU  on PU.hims_d_inventory_uom_id=D.uom_id
              // inner join hims_d_inventory_item_master IM  on IM.hims_d_inventory_item_master_id=D.item_id
              // left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id
              // and  date(LOC.expirydt) > date(CURDATE())
              // left join hims_m_inventory_item_location LOCAD  on D.item_id=LOCAD.item_id and
              // LOCAD.expirydt is null and IM.exp_date_required='N'
              // where D.sales_order_id=?
              // and D.quantity_outstanding<>0 order by  date(LOC.expirydt)`,
              // "select D.*, IM.hims_d_inventory_item_master_id, D.quantity as ordered_quantity ,LOC.*,IM.*, PU.uom_description \
              //                 from hims_f_sales_order_items D \
              //             left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id \
              //             inner join `hims_d_inventory_item_master` IM  on IM.hims_d_inventory_item_master_id=D.item_id \
              //             inner join `hims_d_inventory_uom` PU  on PU.hims_d_inventory_uom_id=D.uom_id \
              //             where D.sales_order_id=? and  (date(LOC.expirydt) > date(CURDATE()) || exp_date_required='N') \
              //             and D.quantity_outstanding <> 0 order by  date(LOC.expirydt) ",
              values: [headerResult[0].hims_f_sales_order_id],
              printQuery: true,
            })
            .then((inventory_stock_detail) => {
              _mysql.releaseConnection();
              const grouppedData = _.chain(inventory_stock_detail)
                .groupBy((g) => g.hims_d_inventory_item_master_id)
                .map((detail, key) => {
                  const {
                    sales_order_items_id,
                    item_category_id,
                    item_group_id,
                    item_id,
                    uom_id,
                    quantity_outstanding,
                    item_description,
                    uom_description,
                    unit_cost,
                    discount_percentage,
                    tax_percentage,
                    ordered_quantity,
                    selected_quantity,
                    delivered_to_date,
                    removed,
                  } = detail[0];
                  return {
                    sales_order_items_id,
                    item_category_id,
                    item_group_id,
                    item_id,
                    uom_id,
                    quantity_outstanding,
                    item_description,
                    uom_description,
                    unit_cost,
                    discount_percentage,
                    tax_percentage,
                    ordered_quantity,
                    selected_quantity,
                    delivered_to_date,
                    removed,
                    batches: detail.filter(
                      (f) =>
                        parseFloat(f.qtyhand) > 0 &&
                        f.inventory_location_id == inputParam.location_id
                    ),
                  };
                })
                .value();

              // console.log("inventory_stock_detail", inventory_stock_detail)
              // var item_grp = _(inventory_stock_detail)
              //   .groupBy("hims_d_inventory_item_master_id")
              //   .map(
              //     (row, hims_d_inventory_item_master_id) =>
              //       hims_d_inventory_item_master_id
              //   )
              //   .value();

              // let outputArray = [];
              // console.log("item_grp", item_grp)

              // for (let i = 0; i < item_grp.length; i++) {
              //   let item = new LINQ(inventory_stock_detail)
              //     .Where(
              //       (w) => w.hims_d_inventory_item_master_id == item_grp[i]
              //     )
              //     .Select((s) => {
              //       return {
              //         sales_order_items_id: s.hims_f_sales_order_items_id,
              //         item_category_id: s.category_id,
              //         item_group_id: s.group_id,
              //         item_id: s.hims_d_inventory_item_master_id,
              //         uom_id: s.uom_id,
              //         quantity_outstanding: parseFloat(s.quantity_outstanding),
              //         item_description: s.item_description,
              //         uom_description: s.uom_description,
              //         unit_cost: s.unit_cost,
              //         discount_percentage: s.discount_percentage,
              //         tax_percentage: s.tax_percentage,
              //         ordered_quantity: s.quantity,
              //         selected_quantity: 0,
              //         delivered_to_date:
              //           parseFloat(s.quantity) -
              //           parseFloat(s.quantity_outstanding),
              //         removed: "N",
              //       };
              //     })
              //     .FirstOrDefault();

              //   let batches = new LINQ(inventory_stock_detail)
              //     .Where(
              //       (w) =>
              //         w.hims_d_inventory_item_master_id == item_grp[i] &&
              //         w.qtyhand > 0 &&
              //         w.inventory_location_id == inputParam.location_id
              //     )
              //     .Select((s) => {
              //       return {
              //         item_id: s.hims_d_inventory_item_master_id,
              //         batchno: s.batchno,
              //         expiry_date: s.expirydt,
              //         barcode: s.barcode,
              //         qtyhand: s.qtyhand,
              //         qtypo: s.qtypo,
              //         cost_uom: s.cost_uom,
              //         average_cost: s.avgcost,
              //         unit_cost: s.avgcost,
              //         last_purchase_cost: s.last_purchase_cost,
              //         item_type: s.item_type,
              //         grn_id: s.grn_id,
              //         grnno: s.grnno,
              //         sale_price: s.sale_price,
              //         mrp_price: s.mrp_price,
              //         sales_uom: s.sales_uom,
              //         vendor_batchno: s.vendor_batchno,
              //         dispatch_quantity: 0,
              //       };
              //     })
              //     .ToArray();

              //   outputArray.push({ ...item, batches });
              // }

              req.records = {
                ...headerResult[0],
                stock_detail: grouppedData,
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
}

export function addDispatchNote(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });

    req.on("end", () => {
      let input = JSON.parse(buffer);
      req.body = input;
      let dispatch_note_number = "";

      // console.log("addDispatchNote: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["SALES_DISPATCH"],
          table_name: "hims_f_sales_numgen",
        })
        .then((generatedNumbers) => {
          dispatch_note_number = generatedNumbers.SALES_DISPATCH;

          let year = moment().format("YYYY");

          let month = moment().format("MM");

          let period = month;

          // let strQuery = mysql.format(
          //     "UPDATE hims_f_sales_order SET invoice_generated='Y', invoice_gen_date=?, invoice_gen_by=? \
          //     where  hims_f_sales_order_id = ?;",
          //     [
          //         new Date(),
          //         req.userIdentity.algaeh_d_app_user_id,
          //         input.sales_order_id
          //     ]
          // );

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_sales_dispatch_note_header` (dispatch_note_number, dispatch_note_date,\
                                    sales_order_id, location_id, customer_id, project_id, \
                                    sub_total, discount_amount, net_total, total_tax, net_payable, narration, \
                                    created_by, created_date, updated_by, updated_date, hospital_id ) \
                                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
              values: [
                dispatch_note_number,
                new Date(),
                input.sales_order_id,
                input.location_id,
                input.customer_id,
                input.project_id,
                input.sub_total,
                input.discount_amount,
                input.net_total,
                input.total_tax,
                input.net_payable,
                input.narration,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                input.hospital_id,
              ],
              printQuery: true,
            })
            .then((headerResult) => {
              let dispatch_note_header_id = headerResult.insertId;
              req.body.transaction_id = headerResult.insertId;
              req.body.year = year;
              req.body.period = period;
              // console.log("headerResult: ", headerResult[0].insertId);
              // console.log("length: ", input.stock_detail.length);

              for (let i = 0; i < input.stock_detail.length; i++) {
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_sales_dispatch_note_detail (item_id, uom_id,ordered_quantity, \
                                                dispatched_quantity, quantity_outstanding, delivered_to_date, \
                                                dispatch_note_header_id) \
                                                VALUES (?,?,?,?,?,?,?);",
                    values: [
                      input.stock_detail[i]["item_id"],
                      input.stock_detail[i]["uom_id"],
                      input.stock_detail[i]["ordered_quantity"],
                      input.stock_detail[i]["dispatched_quantity"],
                      input.stock_detail[i]["quantity_outstanding"],
                      input.stock_detail[i]["delivered_to_date"],
                      dispatch_note_header_id,
                    ],
                    printQuery: true,
                  })
                  .then((detailResult) => {
                    let IncludeSubValues = [
                      "sales_order_items_id",
                      "item_category_id",
                      "item_group_id",
                      "item_id",
                      "uom_id",
                      "sales_uom",
                      "batchno",
                      "barcode",
                      "expiry_date",
                      "ordered_quantity",
                      "dispatch_quantity",
                      "sales_price",

                      "unit_cost",
                      "extended_cost",
                      "discount_percentage",
                      "discount_amount",
                      "net_extended_cost",
                      "tax_percentage",
                      "tax_amount",
                      "total_amount",
                      "average_cost",
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_sales_dispatch_note_batches(??) VALUES ?;",
                        values: input.stock_detail[i]["inventory_stock_detail"],
                        includeValues: IncludeSubValues,
                        extraValues: {
                          sales_dispatch_note_detail_id: detailResult.insertId,
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true,
                      })
                      .then((subResult) => {
                        if (i == input.stock_detail.length - 1) {
                          // console.log("done: ", i);
                          req.connection = {
                            connection: _mysql.connection,
                            isTransactionConnection:
                              _mysql.isTransactionConnection,
                            pool: _mysql.pool,
                          };
                          // req.flag = 1;

                          req.records = {
                            dispatch_note_number: dispatch_note_number,
                            hims_f_sales_dispatch_note_header_id: dispatch_note_header_id,
                            year: year,
                            period: period,
                          };
                          next();
                        }
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
}

export function adjustDispatchNote(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });

    req.on("end", () => {
      let input = JSON.parse(buffer);
      req.body = input;

      let year = moment().format("YYYY");

      let month = moment().format("MM");

      let period = month;

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_sales_dispatch_note_header` set sub_total = ?, discount_amount= ?, net_total = ?, \
              total_tax = ?, net_payable = ? where hims_f_dispatch_note_header_id=?; \
              INSERT INTO `hims_f_sales_dn_adjust` (dn_header_id, adjust_reason, adjusted_by, adjusted_date) \
              VALUE(?,?,?,?);",
          values: [
            input.sub_total,
            input.discount_amount,
            input.net_total,
            input.total_tax,
            input.net_payable,
            input.hims_f_dispatch_note_header_id,
            input.hims_f_dispatch_note_header_id,
            input.adjust_reason,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          req.body.transaction_id = input.hims_f_dispatch_note_header_id;
          req.body.year = year;
          req.body.period = period;
          req.body.inventory_stock_detail = input.delete_dispatch_items;

          let strQuery = "";
          // console.log("headerResult: ", headerResult[0].insertId);
          // console.log("length: ", input.stock_detail.length);

          for (let i = 0; i < input.delete_dispatch_items.length; i++) {
            strQuery += mysql.format(
              "DELETE FROM hims_f_sales_dispatch_note_batches where hims_f_sales_dispatch_note_batches_id=?;",
              [
                input.delete_dispatch_items[i][
                  "hims_f_sales_dispatch_note_batches_id"
                ],
              ]
            );
            // if (i == input.stock_detail.length - 1) {

            //   _mysql
            //     .executeQuery({
            //       query: strQuery,
            //       printQuery: true,
            //     })
            //     .then((detailResult) => {

            //     })
            //     .catch((error) => {
            //       _mysql.rollBackTransaction(() => {
            //         next(error);
            //       });
            //     });

            // }
          }

          _mysql
            .executeQuery({
              query: strQuery,
              printQuery: true,
            })
            .then((deleteData) => {
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool,
              };

              req.records = deleteData;
              next();
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
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export function cancelDispatchNote(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });

    req.on("end", () => {
      let input = JSON.parse(buffer);
      req.body = input;

      let year = moment().format("YYYY");
      let month = moment().format("MM");
      let period = month;

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_sales_dispatch_note_header set cancelled = 'Y', cancelled_by=?, cancelled_date=? \
            where hims_f_dispatch_note_header_id=?;",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.hims_f_dispatch_note_header_id,
          ],
          printQuery: true,
        })
        .then((headerResult) => {
          req.body.transaction_id = input.hims_f_dispatch_note_header_id;
          req.body.year = year;
          req.body.period = period;
          req.body.complete = "N";

          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          req.records = {
            dispatch_note_number: input.dispatch_note_number,
            hims_f_dispatch_note_header_id:
              input.hims_f_dispatch_note_header_id,
            year: year,
            period: period,
          };
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
}

export function revertSalesOrder(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };
    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_f_sales_order` SET `is_completed`='N' WHERE `hims_f_sales_order_id`=?; \
          UPDATE hims_f_sales_quotation set qotation_status='O' where hims_f_sales_quotation_id = ?;",
        values: [inputParam.sales_order_id, inputParam.sales_quotation_id],
        printQuery: true,
      })
      .then((headerResult) => {
        next();
        // if (headerResult != null) {
        //   let details = inputParam.inventory_stock_detail;

        //   let qry = "";

        //   for (let i = 0; i < details.length; i++) {
        //     qry += mysql.format(
        //       "UPDATE hims_f_sales_order_items SET `quantity_outstanding`=?\
        //                     where `hims_f_sales_order_items_id`=?;",
        //       [details[i].quantity_outstanding, details[i].sales_order_items_id]
        //     );
        //   }
        //   _mysql
        //     .executeQueryWithTransaction({
        //       query: qry,
        //       printQuery: true,
        //     })
        //     .then((detailResult) => {
        //       next();

        //     })
        //     .catch((e) => {
        //       _mysql.rollBackTransaction(() => {
        //         next(e);
        //       });
        //     });
        // } else {
        //   _mysql.rollBackTransaction(() => {
        //     // req.records = {};
        //     next();
        //   });
        // }
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
}

export function updateinvSalesOrderDispatchAdjust(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };

    // let _sales_order_items_id = []
    // inputParam.delete_dispatch_items.map((o) => {
    //   _sales_order_items_id.push(o.sales_order_items_id);
    // });

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM hims_f_sales_order_items where sales_order_id = ?;",
        values: [inputParam.sales_order_id],
        printQuery: true,
      })
      .then((sales_order_result) => {
        let strQuery = "";
        let sales_order_items = [];

        for (let i = 0; i < inputParam.delete_dispatch_items.length; i++) {
          let sales_order_item = sales_order_result.find(
            (f) => f.item_id == inputParam.delete_dispatch_items[i].item_id
          );

          sales_order_items.push(sales_order_item);
          const _index = sales_order_result.indexOf(sales_order_item);
          if (
            parseFloat(sales_order_item.quantity) ===
            parseFloat(inputParam.delete_dispatch_items[i].dispatch_quantity)
          ) {
            strQuery += mysql.format(
              "DELETE FROM hims_f_sales_order_items where hims_f_sales_order_items_id=?;",
              [sales_order_item.hims_f_sales_order_items_id]
            );
            sales_order_result.splice(_index, 1);
          } else {
            sales_order_item.quantity =
              parseFloat(sales_order_item.quantity) -
              parseFloat(inputParam.delete_dispatch_items[i].dispatch_quantity);
            // sales_order_item.quantity_outstanding = parseFloat(sales_order_item.quantity_outstanding) > 0 ?
            //   parseFloat(sales_order_item.quantity) -
            //   (parseFloat(sales_order_item.quantity_outstanding) + parseFloat(inputParam.delete_dispatch_items[i].dispatch_quantity)) : 0

            if (sales_order_item.quantity === 0) {
              strQuery += mysql.format(
                "DELETE FROM hims_f_sales_order_items where hims_f_sales_order_items_id=?;",
                [sales_order_item.hims_f_sales_order_items_id]
              );
              sales_order_result.splice(_index, 1);
            } else {
              sales_order_item.extended_cost = (
                parseFloat(sales_order_item.unit_cost) *
                parseFloat(sales_order_item.quantity)
              ).toFixed(req.userIdentity.decimal_places);
              sales_order_item.discount_amount = (
                (parseFloat(sales_order_item.extended_cost) *
                  parseFloat(sales_order_item.discount_percentage)) /
                100
              ).toFixed(req.userIdentity.decimal_places);
              sales_order_item.net_extended_cost = (
                parseFloat(sales_order_item.extended_cost) -
                parseFloat(sales_order_item.discount_amount)
              ).toFixed(req.userIdentity.decimal_places);

              sales_order_item.tax_amount = (
                (parseFloat(sales_order_item.net_extended_cost) *
                  parseFloat(sales_order_item.tax_percentage)) /
                100
              ).toFixed(req.userIdentity.decimal_places);

              sales_order_item.total_amount = (
                parseFloat(sales_order_item.net_extended_cost) +
                parseFloat(sales_order_item.tax_amount)
              ).toFixed(req.userIdentity.decimal_places);

              sales_order_result[_index] = sales_order_item;

              strQuery += mysql.format(
                "UPDATE hims_f_sales_order_items SET `quantity`=?, extended_cost=?, discount_amount=?, \
                  net_extended_cost=?, tax_amount=?, total_amount=? where `hims_f_sales_order_items_id`=?;",
                [
                  sales_order_item.quantity,
                  sales_order_item.extended_cost,
                  sales_order_item.discount_amount,
                  sales_order_item.net_extended_cost,
                  sales_order_item.tax_amount,
                  sales_order_item.total_amount,
                  sales_order_item.hims_f_sales_order_items_id,
                ]
              );
              sales_order_result[_index] = sales_order_item;
            }
          }
        }

        const sub_total = _.sumBy(sales_order_result, (s) =>
          parseFloat(s.extended_cost)
        );
        const discount_amount = _.sumBy(sales_order_result, (s) =>
          parseFloat(s.discount_amount)
        );

        const net_total = _.sumBy(sales_order_result, (s) =>
          parseFloat(s.net_extended_cost)
        );

        const total_tax = _.sumBy(sales_order_result, (s) =>
          parseFloat(s.tax_amount)
        );

        const net_payable = _.sumBy(sales_order_result, (s) =>
          parseFloat(s.total_amount)
        );
        strQuery += mysql.format(
          "UPDATE hims_f_sales_order SET sub_total=?, discount_amount=? , net_total=?, total_tax=?, \
            net_payable=? where hims_f_sales_order_id=?;",
          [
            sub_total,
            discount_amount,
            net_total,
            total_tax,
            net_payable,
            inputParam.sales_order_id,
          ]
        );
        // sales_order_result.splice(_index, 1);

        const IncludeValues = [
          "sales_order_id",
          "item_id",
          "uom_id",
          "unit_cost",
          "quantity",
          "extended_cost",
          "discount_percentage",
          "discount_amount",
          "net_extended_cost",
          "tax_percentage",
          "tax_amount",
          "total_amount",
          "quantity_outstanding",
        ];

        _mysql
          .executeQuery({
            query:
              `INSERT INTO hims_f_sales_order_adj_item(??) VALUES ?;` +
              strQuery,
            values: sales_order_items,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((detailResult) => {
            next();
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
        // _mysql
        //   .executeQueryWithTransaction({
        //     query: strQuery,
        //     printQuery: true,
        //   })
        //   .then((detailResult) => {
        //     // _mysql.commitTransaction(() => {
        //     //   _mysql.releaseConnection();
        //     // req.records = detailResult;
        //     next();
        //     // });
        //   })
        //   .catch((e) => {
        //     _mysql.rollBackTransaction(() => {
        //       next(e);
        //     });
        //   });
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
}

export function updateinvSalesOrderOnceDispatch(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };

    let complete = inputParam.complete === "N" ? "N" : "Y";

    const partial_recived = new LINQ(inputParam.inventory_stock_detail)
      .Where((w) => w.quantity_outstanding != 0)
      .ToArray();

    if (partial_recived.length > 0) {
      complete = "N";
    }

    let strQuery = "";
    // console.log("inputParam.sales_quotation_id", inputParam.sales_quotation_id)
    if (inputParam.sales_quotation_id !== null && complete === "Y") {
      strQuery = mysql.format(
        "UPDATE hims_f_sales_quotation set qotation_status='C' where hims_f_sales_quotation_id = ?;",
        [inputParam.sales_quotation_id]
      );
    }

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_f_sales_order` SET `is_completed`=?, `completed_by`=?, `completed_date`=? \
                        WHERE `hims_f_sales_order_id`=?; " +
          strQuery,
        values: [
          complete,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.sales_order_id,
        ],
        printQuery: true,
      })
      .then((headerResult) => {
        if (headerResult != null) {
          let details = inputParam.inventory_stock_detail;

          let qry = "";

          for (let i = 0; i < details.length; i++) {
            qry += mysql.format(
              "UPDATE hims_f_sales_order_items SET `quantity_outstanding`=?\
                            where `hims_f_sales_order_items_id`=?;",
              [details[i].quantity_outstanding, details[i].sales_order_items_id]
            );
          }
          _mysql
            .executeQueryWithTransaction({
              query: qry,
              printQuery: true,
            })
            .then((detailResult) => {
              // _mysql.commitTransaction(() => {
              //   _mysql.releaseConnection();
              // req.records = detailResult;
              next();
              // });
            })
            .catch((e) => {
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
}
