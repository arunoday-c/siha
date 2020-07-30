import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import _ from "lodash";
export default {
  gettransferEntryOld: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.transfer_number != null) {
        _strAppend += " and TH.transfer_number=?";
        intValue.push(req.query.transfer_number);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT TH.`hims_f_inventory_transfer_header_id`, TH.`hims_f_inventory_material_header_id`, \
            TH.`transfer_number`, TH.`from_location_type`, TH.`from_location_id`, TH.`transfer_date`, TH.`year`, \
            TH.`period`, TH.`material_requisition_number`, TH.`to_location_type`, TH.`to_location_id`, TH.`description`,\
            TH.`completed`, TH.`completed_date`, TH.`completed_lines`, TH.`transfer_quantity`, TH.`requested_quantity`, \
            TH.`recieved_quantity`, TH.`outstanding_quantity`, TH.`cancelled`, TH.`cancelled_date`, TH.`cancelled_by` \
            from  hims_f_inventory_transfer_header TH\
          where 1=1" +
            _strAppend,
          values: intValue,
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select TD.`hims_f_inventory_transfer_detail_id`, TD.`transfer_header_id`, TD.`from_qtyhand`, \
                  TD.`to_qtyhand`, TD.`completed`, TD.`completed_date`, TD.`item_category_id`, TD.`item_group_id`, \
                  TD.`item_id`, TD.`batchno`, TD.`grnno`, TD.`expiry_date`, TD.`quantity_requested`, \
                  TD.`quantity_authorized`, TD.`uom_requested_id`, TD.`quantity_transferred`, TD.`uom_transferred_id`,\
                  TD.`quantity_recieved`, TD.`uom_recieved_id`, TD.`quantity_outstanding`, TD.`unit_cost`, \
                  TD.`sales_uom`, TD.`material_requisition_header_id`, TD.`material_requisition_detail_id`, \
                  TD.`transfer_to_date`,IM.item_code, IM.item_description, IU.uom_description\
                  from hims_f_inventory_transfer_detail TD, hims_d_inventory_item_master IM ,hims_d_inventory_uom IU \
                  where TD.transfer_header_id=? and TD.item_id = IM.hims_d_inventory_item_master_id and TD.uom_transferred_id = IU.hims_d_inventory_uom_id",
                values: [headerResult[0].hims_f_inventory_transfer_header_id],
                printQuery: true,
              })
              .then((inventory_stock_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ inventory_stock_detail },
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

  gettransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;
      if (input.from_location_id > 0 && input.to_location_id > 0) {
        let strQty = "";
        if (req.query.transfer_number != null) {
          strQty = ` and transfer_number= '${req.query.transfer_number}'`;
        }

        _mysql
          .executeQuery({
            query: `SELECT * from  hims_f_inventory_transfer_header \
          where from_location_id=? and to_location_id=? ${strQty};
          select D.*,IM.item_description, IU.uom_description from  hims_f_inventory_transfer_header H inner join \
          hims_f_inventory_transfer_detail D on H.hims_f_inventory_transfer_header_id = D.transfer_header_id \
          inner join hims_d_inventory_item_master IM on D.item_id=IM.hims_d_inventory_item_master_id \
          inner join hims_d_inventory_uom IU on D.uom_transferred_id=IU.hims_d_inventory_uom_id where 
          H.from_location_id=? and H.to_location_id=? ${strQty};
          select S.* from  hims_f_inventory_transfer_header H
          inner join  hims_f_inventory_transfer_detail D on H.hims_f_inventory_transfer_header_id=D.transfer_header_id
          inner join hims_f_inventory_transfer_batches S on D.hims_f_inventory_transfer_detail_id=S.transfer_detail_id
          where H.from_location_id=? and H.to_location_id=? ${strQty};
           `,
            values: [
              input.from_location_id,
              input.to_location_id,
              input.from_location_id,
              input.to_location_id,
              input.from_location_id,
              input.to_location_id,
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
                      w.transfer_header_id ==
                      header[i]["hims_f_inventory_transfer_header_id"]
                  )
                  .Select((s) => s)
                  .ToArray();

                let temp = [];
                for (let m = 0; m < t_details.length; m++) {
                  let sub_details = new LINQ(subDetail)
                    .Where(
                      (w) =>
                        w.transfer_detail_id ==
                        t_details[m]["hims_f_inventory_transfer_detail_id"]
                    )
                    .Select((s) => {
                      return {
                        ...s,
                        uom_description: t_details[m]["uom_description"],
                      };
                    })
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
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid from_location and to_location id",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addtransferEntryBACKUP: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = { ...req.body };
      let transfer_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addtransferEntry: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["INV_TRN_NUM"],
          table_name: "hims_f_inventory_numgen",
        })
        .then((generatedNumbers) => {
          transfer_number = generatedNumbers.INV_TRN_NUM;

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_inventory_transfer_header` (transfer_number,transfer_date,`year`,period,\
              hims_f_inventory_material_header_id,from_location_type,from_location_id, material_requisition_number, to_location_id, \
              to_location_type, description, completed, completed_date, completed_lines, \
              transfer_quantity,requested_quantity,recieved_quantity,outstanding_quantity, \
              cancelled, cancelled_by,cancelled_date) \
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                transfer_number,
                today,
                year,
                period,
                input.hims_f_inventory_material_header_id,
                input.from_location_type,
                input.from_location_id,
                input.material_requisition_number,
                input.to_location_id,
                input.to_location_type,
                input.description,
                input.completed,
                input.completed_date,
                input.completed_lines,
                input.transfer_quantity,
                input.requested_quantity,
                input.recieved_quantity,
                input.outstanding_quantity,
                input.cancelled,
                input.cancelled_by,
                input.cancelled_date,
              ],
              printQuery: true,
            })
            .then((headerResult) => {
              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "item_id",
                "item_category_id",
                "item_group_id",
                "batchno",
                "expiry_date",
                "to_qtyhand",
                "from_qtyhand",
                "quantity_requested",
                "quantity_authorized",
                "uom_requested_id",
                "quantity_transferred",
                "uom_transferred_id",
                "quantity_recieved",
                "uom_recieved_id",
                "quantity_outstanding",
                "transfer_to_date",
                "grnno",
                "unit_cost",
                "sales_uom",
                "material_requisition_header_id",
                "material_requisition_detail_id",
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_inventory_transfer_detail(??) VALUES ?",
                  values: input.inventory_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    transfer_header_id: headerResult.insertId,
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                })
                .then((detailResult) => {
                  utilities.logger().log("detailResult: ", detailResult);
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = {
                    transfer_number: transfer_number,
                    hims_f_inventory_transfer_header_id: headerResult.insertId,
                    year: year,
                    period: period,
                  };
                  next();
                  // });
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

  addtransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let input = JSON.parse(buffer);
        req.body = input;
        let transfer_number = "";

        // const utilities = new algaehUtilities();
        // console.log("addtransferEntry: ");

        _mysql
          .generateRunningNumber({
            user_id: req.userIdentity.algaeh_d_app_user_id,
            numgen_codes: ["INV_TRN_NUM"],
            table_name: "hims_f_inventory_numgen",
          })
          .then((generatedNumbers) => {
            transfer_number = generatedNumbers.INV_TRN_NUM;

            let year = moment().format("YYYY");

            let today = moment().format("YYYY-MM-DD");

            let month = moment().format("MM");

            let period = month;
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_f_inventory_transfer_header` (transfer_number,transfer_date,`year`,period,\
              hims_f_inventory_material_header_id,from_location_type,from_location_id, material_requisition_number, \
              to_location_id, to_location_type, description, completed, completed_date, completed_lines, \
              transfer_quantity, requested_quantity,direct_transfer, recieved_quantity, outstanding_quantity, \
              return_type, cancelled, cancelled_by,cancelled_date,hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                values: [
                  transfer_number,
                  today,
                  year,
                  period,
                  input.hims_f_inventory_material_header_id,
                  input.from_location_type,
                  input.from_location_id,
                  input.material_requisition_number,
                  input.to_location_id,
                  input.to_location_type,
                  input.description,
                  "Y",
                  new Date(),
                  input.completed_lines,
                  input.transfer_quantity,
                  input.requested_quantity,
                  input.direct_transfer,
                  input.recieved_quantity,
                  input.outstanding_quantity,
                  input.return_type,
                  input.cancelled,
                  input.cancelled_by,
                  input.cancelled_date,
                  req.userIdentity.hospital_id,
                ],
                printQuery: true,
              })
              .then((headerResult) => {
                req.body.transaction_id = headerResult.insertId;
                req.body.year = year;
                req.body.period = period;
                // console.log("headerResult: ", headerResult.insertId);
                // console.log("length: ", input.stock_detail.length);

                for (let i = 0; i < input.stock_detail.length; i++) {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_f_inventory_transfer_detail ( item_id,item_category_id,item_group_id,\
                        batchno,expiry_date,to_qtyhand,from_qtyhand,quantity_requested,quantity_authorized,\
                        uom_requested_id,quantity_transferred,uom_transferred_id,quantity_recieved,uom_recieved_id,\
                        quantity_outstanding,transfer_to_date,grnno,unit_cost,sales_uom,\
                        material_requisition_header_id,material_requisition_detail_id,transfer_header_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        input.stock_detail[i]["item_id"],
                        input.stock_detail[i]["item_category_id"],
                        input.stock_detail[i]["item_group_id"],
                        input.stock_detail[i]["batchno"],
                        input.stock_detail[i]["expiry_date"],
                        input.stock_detail[i]["to_qtyhand"],
                        input.stock_detail[i]["from_qtyhand"],
                        input.stock_detail[i]["quantity_requested"],
                        input.stock_detail[i]["quantity_authorized"],
                        input.stock_detail[i]["uom_requested_id"],
                        input.stock_detail[i]["quantity_transferred"],
                        input.stock_detail[i]["uom_transferred_id"],
                        input.stock_detail[i]["quantity_recieved"],
                        input.stock_detail[i]["uom_recieved_id"],
                        input.stock_detail[i]["quantity_outstanding"],
                        input.stock_detail[i]["transfer_to_date"],
                        input.stock_detail[i]["grnno"],
                        input.stock_detail[i]["unit_cost"],
                        input.stock_detail[i]["sales_uom"],
                        input.stock_detail[i]["material_requisition_header_id"],
                        input.stock_detail[i]["material_requisition_detail_id"],
                        headerResult.insertId,
                      ],
                      printQuery: true,
                    })
                    .then((detailResult) => {
                      let IncludeSubValues = [
                        "transfer_detail_id",
                        "item_category_id",
                        "item_group_id",
                        "item_id",
                        "batchno",
                        "grnno",
                        "expiry_date",
                        "quantity_requested",
                        "quantity_authorized",
                        "uom_requested_id",
                        "quantity_transfer",
                        "uom_transferred_id",
                        "quantity_recieved",
                        "uom_recieved_id",
                        "unit_cost",
                        "sales_uom",
                        "sales_price",
                        "ack_quantity",
                        "barcode",
                        "vendor_batchno",
                      ];

                      _mysql
                        .executeQuery({
                          query:
                            "INSERT INTO hims_f_inventory_transfer_batches(??) VALUES ?",
                          values:
                            input.stock_detail[i]["inventory_stock_detail"],
                          includeValues: IncludeSubValues,
                          extraValues: {
                            transfer_detail_id: detailResult.insertId,
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
                            req.flag = 1;

                            req.records = {
                              transfer_number: transfer_number,
                              hims_f_inventory_transfer_header_id:
                                headerResult.insertId,
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
  },

  updatetransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let buffer = "";
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        let inputParam = JSON.parse(buffer);
        req.body = inputParam;

        _mysql
          .executeQueryWithTransaction({
            query:
              "UPDATE `hims_f_inventory_transfer_header` SET `ack_done`=?, `ack_date`=?, `ack_by`=? \
            WHERE `hims_f_inventory_transfer_header_id`=?;",
            values: [
              inputParam.ack_done,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.hims_f_inventory_transfer_header_id,
            ],
            printQuery: true,
          })
          .then((headerResult) => {
            req.connection = {
              connection: _mysql.connection,
              isTransactionConnection: _mysql.isTransactionConnection,
              pool: _mysql.pool,
            };
            let qry = "";
            for (let i = 0; i < inputParam.inventory_stock_detail.length; i++) {
              qry += _mysql.mysqlQueryFormat(
                "UPDATE hims_f_inventory_transfer_batches set ack_quantity=?\
  		        WHERE hims_f_inventory_transfer_batches_id=?;",
                [
                  inputParam.inventory_stock_detail[i].ack_quantity,
                  inputParam.inventory_stock_detail[i]
                    .hims_f_inventory_transfer_batches_id,
                ]
              );
            }

            // utilities.logger().log("qry: ", qry);
            _mysql
              .executeQuery({
                query: qry,
                printQuery: true,
              })
              .then((batch_detail) => {
                req.flag = 1;
                req.records = headerResult;
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });

            // req.flag = 1;
            //
            // req.records = headerResult;
            // next();
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

  getrequisitionEntryTransferbackup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_inventory_material_header \
          where material_requisition_number=?",
          values: [inputParam.material_requisition_number],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "SELECT LOC.*,D.* FROM hims_m_inventory_item_location LOC inner join\
                  hims_f_inventory_material_detail D   on D.item_id=LOC.item_id INNER JOIN\
                  (SELECT L.item_id, MIN(expirydt) MinDate\
                  FROM hims_m_inventory_item_location L inner join hims_f_inventory_material_detail \
                  D on D.item_id= L.item_id where date(expirydt) > curdate() and \
                  D.inventory_header_id=? and L.inventory_location_id=? GROUP BY L.item_id\
                ) T ON LOC.item_id = T.item_id AND date(LOC.expirydt) = date(T.MinDate)  and \
                  D.inventory_header_id=? and LOC.inventory_location_id=?",
                values: [
                  headerResult[0].hims_f_inventory_material_header_id,
                  headerResult[0].to_location_id,
                  headerResult[0].hims_f_inventory_material_header_id,
                  headerResult[0].to_location_id,
                ],
                printQuery: true,
              })
              .then((inventory_stock_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ inventory_stock_detail },
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

  getrequisitionEntryTransfer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_inventory_material_header \
          where hims_f_inventory_material_header_id=?",
          values: [inputParam.hims_f_inventory_material_header_id],
          printQuery: false,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query: `select D.hims_f_inventory_material_detail_id,D.inventory_header_id,
                D.completed,D.item_category_id,D.item_group_id,D.item_id,
                D.quantity_required,D.quantity_authorized,D.item_uom,D.quantity_recieved,
                D.quantity_outstanding,COALESCE(LOC.hims_m_inventory_item_location_id, LOCAD.hims_m_inventory_item_location_id) as hims_m_inventory_item_location_id,
                COALESCE(LOC.inventory_location_id, LOCAD.inventory_location_id) as inventory_location_id, 
                COALESCE(LOC.batchno,LOCAD.batchno) as batchno
                ,COALESCE(LOC.expirydt, LOCAD.expirydt) as expiry_date,COALESCE( LOC.barcode,LOCAD.barcode) as barcode,
                COALESCE(LOC.qtyhand, LOCAD.qtyhand) as qtyhand,COALESCE(LOC.cost_uom, LOCAD.cost_uom) as cost_uom, 
                COALESCE(LOC.avgcost, LOCAD.avgcost) as unit_cost, COALESCE(LOC.item_type, LOCAD.item_type) as item_type,
                COALESCE(LOC.sale_price, LOCAD.sale_price) as sale_price,COALESCE(LOC.sales_uom, LOCAD.sales_uom) as sales_uom,
                IM.hims_d_inventory_item_master_id, IM.item_description, 0 as quantity_transfer,
                PU.uom_description from hims_f_inventory_material_detail D
                inner join hims_d_inventory_uom PU  on PU.hims_d_inventory_uom_id=D.item_uom
                inner join hims_d_inventory_item_master IM  on IM.hims_d_inventory_item_master_id=D.item_id
                left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id
                and  date(LOC.expirydt) > date(CURDATE()) 
                left join hims_m_inventory_item_location LOCAD  on D.item_id=LOCAD.item_id and
                LOCAD.expirydt is null and IM.exp_date_required='N'
                where D.inventory_header_id=?
                and D.quantity_outstanding<>0 order by  date(LOC.expirydt)`,
                // "select D.*,LOC.*, IM.hims_d_inventory_item_master_id, IM.item_description, PU.uom_description from hims_f_inventory_material_detail D \
                // left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id \
                // inner join `hims_d_inventory_item_master` IM  on IM.hims_d_inventory_item_master_id=D.item_id \
                // inner join `hims_d_inventory_uom` PU  on PU.hims_d_inventory_uom_id=D.item_uom \
                // where D.inventory_header_id=? and  (date(LOC.expirydt) > date(CURDATE()) || exp_date_required='N') \
                // and D.quantity_outstanding<>0 order by  date(LOC.expirydt) ",
                values: [inputParam.hims_f_inventory_material_header_id],
                printQuery: true,
              })
              .then((inventory_stock_detail) => {
                // console.log("inventory_stock_detail", inputParam.from_location_id)
                _mysql.releaseConnection();
                const grouppedData = _.chain(inventory_stock_detail)
                  .groupBy((g) => g.hims_d_inventory_item_master_id)
                  .map((detail, key) => {
                    const {
                      hims_f_inventory_material_detail_id,
                      inventory_header_id,
                      completed,
                      item_category_id,
                      item_group_id,
                      item_id,
                      quantity_required,
                      quantity_authorized,
                      item_uom,
                      quantity_recieved,
                      quantity_outstanding,
                      item_description,
                      uom_description,
                      unit_cost,
                    } = detail[0];
                    return {
                      hims_f_inventory_material_detail_id,
                      inventory_header_id,
                      completed,
                      item_category_id,
                      item_group_id,
                      item_id,
                      quantity_required,
                      quantity_authorized,
                      item_uom,
                      quantity_recieved,
                      quantity_outstanding,
                      item_description,
                      uom_description,
                      unit_cost,
                      batches: detail.filter(
                        (f) =>
                          f.qtyhand > 0 &&
                          f.inventory_location_id ===
                          inputParam.from_location_id
                      ),
                    };
                  })
                  .value();
                req.records = {
                  ...headerResult[0],
                  stock_detail: grouppedData,
                };
                // var item_grp = _(inventory_stock_detail)
                //   .groupBy("hims_d_inventory_item_master_id")
                //   .map(
                //     (row, hims_d_inventory_item_master_id) =>
                //       hims_d_inventory_item_master_id
                //   )
                //   .value();

                // console.log("item_grp", item_grp);
                // let outputArray = [];

                // for (let i = 0; i < item_grp.length; i++) {
                //   let item = new LINQ(inventory_stock_detail)
                //     .Where(
                //       (w) => w.hims_d_inventory_item_master_id == item_grp[i]
                //     )
                //     .Select((s) => {
                //       return {
                //         hims_f_inventory_material_detail_id:
                //           s.hims_f_inventory_material_detail_id,
                //         inventory_header_id: s.inventory_header_id,
                //         completed: s.completed,
                //         item_category_id: s.item_category_id,
                //         item_group_id: s.item_group_id,
                //         item_id: s.hims_d_inventory_item_master_id,
                //         from_qtyhand: s.from_qtyhand,
                //         to_qtyhand: s.to_qtyhand,
                //         quantity_required: s.quantity_required,
                //         quantity_authorized: s.quantity_authorized,
                //         item_uom: s.item_uom,
                //         quantity_recieved: s.quantity_recieved,
                //         quantity_outstanding: s.quantity_outstanding,
                //         po_created_date: s.po_created_date,
                //         po_created: s.po_created,
                //         po_created_quantity: s.po_created_quantity,
                //         po_outstanding_quantity: s.po_outstanding_quantity,
                //         po_completed: s.po_completed,
                //         item_description: s.item_description,
                //         uom_description: s.uom_description,
                //       };
                //     })
                //     .FirstOrDefault();

                //   console.log("item", item);
                //   let batches = new LINQ(inventory_stock_detail)
                //     .Where(
                //       (w) =>
                //         w.hims_d_inventory_item_master_id == item_grp[i] &&
                //         w.qtyhand > 0 &&
                //         w.inventory_location_id == inputParam.from_location_id
                //     )
                //     .Select((s) => {
                //       return {
                //         hims_m_inventory_item_location_id:
                //           s.hims_m_inventory_item_location_id,
                //         item_id: s.hims_d_inventory_item_master_id,
                //         inventory_location_id: s.inventory_location_id,
                //         item_location_status: s.item_location_status,
                //         batchno: s.batchno,
                //         expiry_date: s.expirydt,
                //         barcode: s.barcode,
                //         qtyhand: s.qtyhand,
                //         qtypo: s.qtypo,
                //         cost_uom: s.cost_uom,
                //         unit_cost: s.avgcost,
                //         last_purchase_cost: s.last_purchase_cost,
                //         item_type: s.item_type,
                //         grn_id: s.grn_id,
                //         grnno: s.grnno,
                //         sale_price: s.sale_price,
                //         mrp_price: s.mrp_price,
                //         sales_uom: s.sales_uom,
                //         vendor_batchno: s.vendor_batchno,
                //         quantity_transfer: 0,
                //       };
                //     })
                //     .ToArray();

                //   outputArray.push({ ...item, batches });
                // }

                // req.records = {
                //   ...headerResult[0],
                //   ...{ stock_detail: outputArray },
                // };

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
  getAckTransferList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      let strQuery =
        "SELECT * from  hims_f_inventory_transfer_header\
            where completed='Y' ";

      if (req.query.from_date != null) {
        strQuery +=
          " and date(transfer_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        strQuery += " and date(transfer_date) <= date(now())";
      }

      if (inputParam.from_location_id != null) {
        strQuery += " and from_location_id = " + inputParam.from_location_id;
      }
      if (inputParam.to_location_id != null) {
        strQuery += " and to_location_id = " + inputParam.to_location_id;
      }

      if (inputParam.ack_done != null) {
        strQuery += ` and ack_done= '${inputParam.ack_done}'`;
      }

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

  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();

    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
        })
        .then((result) => {
          // console.log("result", result);
          if (
            result[0]["product_type"] == "HIMS_ERP" ||
            result[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQuery({
                query:
                  "select TH.hims_f_inventory_transfer_header_id, TH.transfer_number, \
                FPL.head_id, FPL.child_id, FPL.hospital_id, TPL.hospital_id as to_hospital_id, TPL.head_id as to_head_id, \
                TPL.child_id as to_child_id, TB.ack_quantity, TB.quantity_transfer, TB.unit_cost, \
                (TB.unit_cost * TB.ack_quantity) as ack_cost, (TB.unit_cost * TB.quantity_transfer) as transfered_cost, \
                (TB.quantity_transfer - TB.ack_quantity) as not_recived, \
                ((TB.unit_cost) * (TB.quantity_transfer - TB.ack_quantity)) as non_reviced_transfer_cost \
                from hims_f_inventory_transfer_header TH \
                inner join hims_f_inventory_transfer_detail TD on TD.transfer_header_id = TH.hims_f_inventory_transfer_header_id \
                inner join hims_f_inventory_transfer_batches TB on TB.transfer_detail_id = TD.hims_f_inventory_transfer_detail_id \
                inner join hims_d_inventory_location FPL on FPL.hims_d_inventory_location_id = TH.from_location_id \
                inner join hims_d_inventory_location TPL on TPL.hims_d_inventory_location_id = TH.to_location_id \
                where hims_f_inventory_transfer_header_id=?;\
                select hims_d_sub_department_id from hims_d_sub_department where department_type='I';\
                select cost_center_type, cost_center_required from finance_options limit 1;",
                values: [inputParam.hims_f_inventory_transfer_header_id],
                printQuery: true,
              })
              .then((result_data) => {
                const headerResult = result_data[0];
                const sub_department_id =
                  result_data[1].length > 0
                    ? result_data[1][0].hims_d_sub_department_id
                    : null;
                const decimal_places = req.userIdentity.decimal_places;
                // console.log("headerResult", headerResult);
                let transfered_cost = _.sumBy(headerResult, (s) =>
                  parseFloat(s.transfered_cost)
                );

                let ack_cost = _.sumBy(headerResult, (s) =>
                  parseFloat(s.ack_cost)
                );

                let non_reviced_transfer_cost = _.sumBy(headerResult, (s) =>
                  parseFloat(s.non_reviced_transfer_cost)
                );

                transfered_cost = utilities.decimalPoints(
                  transfered_cost,
                  decimal_places
                );

                ack_cost = utilities.decimalPoints(ack_cost, decimal_places);

                let strQuery = "select 1=1";

                if (
                  result_data[2][0].cost_center_required === "Y" &&
                  result_data[2][0].cost_center_type === "P"
                ) {
                  strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`;
                }

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO finance_day_end_header (transaction_date, amount, voucher_type, document_id,\
                        document_number, from_screen, narration, entered_date, entered_by) \
                        VALUES (?,?,?,?,?,?,?,?,?);" +
                      strQuery,
                    values: [
                      new Date(),
                      transfered_cost,
                      "journal",
                      headerResult[0].hims_f_inventory_transfer_header_id,
                      headerResult[0].transfer_number,
                      inputParam.ScreenCode,
                      "Transfer Done",
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                    ],
                    printQuery: true,
                  })
                  .then((header_result) => {
                    let project_id = null;
                    const day_end_header = header_result[0];
                    if (header_result[1].length > 0) {
                      project_id = header_result[1][0].project_id;
                    }
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
                    ];

                    //From Location Entry
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: headerResult[0].head_id,
                      child_id: headerResult[0].child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: transfered_cost,
                      hospital_id: headerResult[0].hospital_id,
                    });

                    //Non Recived Entry
                    if (non_reviced_transfer_cost > 0) {
                      non_reviced_transfer_cost = utilities.decimalPoints(
                        non_reviced_transfer_cost,
                        decimal_places
                      );

                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: "46",
                        child_id: "38",
                        debit_amount: non_reviced_transfer_cost,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    //To Location Entry
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: headerResult[0].to_head_id,
                      child_id: headerResult[0].to_child_id,
                      debit_amount: ack_cost,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: headerResult[0].to_hospital_id,
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
                          sub_department_id: sub_department_id,
                        },
                        printQuery: false,
                      })
                      .then((subResult) => {
                        next();
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
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            next();
          }
        })
        .catch((error) => {
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
};
