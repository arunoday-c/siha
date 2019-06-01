import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import _ from "lodash";
import { LINQ } from "node-linq";

module.exports = {
  gettransferEntryBACKUP: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.transfer_number != null) {
        _strAppend += " and transfer_number=?";
        intValue.push(req.query.transfer_number);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_pharmacy_transfer_header\
          where 1=1" +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pharmacy_transfer_detail where transfer_header_id=?",
                values: [headerResult[0].hims_f_pharmacy_transfer_header_id],
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
  //created by :irfan
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
            query: `SELECT * from  hims_f_pharmacy_transfer_header \
          where hospital_id=? and from_location_id=? and to_location_id=? ${strQty};
          select D.* from  hims_f_pharmacy_transfer_header H inner join  hims_f_pharmacy_transfer_detail D
          on H.hims_f_pharmacy_transfer_header_id=D.transfer_header_id where hospital_id=?
          and H.from_location_id=? and H.to_location_id=? ${strQty};
          select S.* from  hims_f_pharmacy_transfer_header H
          inner join  hims_f_pharmacy_transfer_detail D on H.hims_f_pharmacy_transfer_header_id=D.transfer_header_id
          inner join hims_f_pharmacy_transfer_batches S on D.hims_f_pharmacy_transfer_detail_id=S.transfer_detail_id
          where hospital_id=? and H.from_location_id=? and H.to_location_id=? ${strQty};
           `,
            values: [
              req.userIdentity.hospital_id,
              input.from_location_id,
              input.to_location_id,
              req.userIdentity.hospital_id,
              input.from_location_id,
              input.to_location_id,
              req.userIdentity.hospital_id,
              input.from_location_id,
              input.to_location_id
            ],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result[0].length > 0) {
              let header = result[0];
              let detail = result[1];
              let subDetail = result[2];

              let outputArray = [];

              for (let i = 0; i < header.length; i++) {
                let t_details = new LINQ(detail)
                  .Where(
                    w =>
                      w.transfer_header_id ==
                      header[i]["hims_f_pharmacy_transfer_header_id"]
                  )
                  .Select(s => s)
                  .ToArray();

                let temp = [];
                for (let m = 0; m < t_details.length; m++) {
                  let sub_details = new LINQ(subDetail)
                    .Where(
                      w =>
                        w.transfer_detail_id ==
                        t_details[m]["hims_f_pharmacy_transfer_detail_id"]
                    )
                    .Select(s => s)
                    .ToArray();

                  temp.push({
                    ...t_details[m],
                    pharmacy_stock_detail: sub_details
                  });
                }

                outputArray.push({
                  ...header[i],
                  stock_detail: temp
                });
              }

              //console.log("details:", t_details);
              req.records = outputArray;
              next();
            } else {
              req.records = result[0];
              next();
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid from_location and to_location id"
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
          modules: ["TRAN_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          transfer_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharmacy_transfer_header` (transfer_number,transfer_date,`year`,period,\
                    hims_f_pharamcy_material_header_id,from_location_type,from_location_id, material_requisition_number, to_location_id, \
                    to_location_type, description, completed, completed_date, completed_lines, \
                    transfer_quantity,requested_quantity,recieved_quantity,outstanding_quantity, \
                    cancelled, cancelled_by,cancelled_date) \
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                transfer_number,
                today,
                year,
                period,
                input.hims_f_pharamcy_material_header_id,
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
                input.cancelled_date
              ],
              printQuery: true
            })
            .then(headerResult => {
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
                "material_requisition_detail_id"
              ];

              utilities
                .logger()
                .log("pharmacy_stock_detail: ", input.pharmacy_stock_detail);

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_pharmacy_transfer_detail(??) VALUES ?",
                  values: input.pharmacy_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    transfer_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      transfer_number: transfer_number,
                      hims_f_pharmacy_transfer_header_id: headerResult.insertId,
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
  //created by :irfan
  addtransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = { ...req.body };
      let transfer_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addtransferEntry: ");

      _mysql
        .generateRunningNumber({
          modules: ["TRAN_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          transfer_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO `hims_f_pharmacy_transfer_header` (transfer_number,transfer_date,`year`,period,\
                    hims_f_pharamcy_material_header_id,from_location_type,from_location_id, material_requisition_number, to_location_id, \
                    to_location_type, description, completed, completed_date, completed_lines, \
                    transfer_quantity,requested_quantity,recieved_quantity,outstanding_quantity, \
                    cancelled, cancelled_by,cancelled_date,hospital_id) \
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                transfer_number,
                today,
                year,
                period,
                input.hims_f_pharamcy_material_header_id,
                input.from_location_type,
                input.from_location_id,
                input.material_requisition_number,
                input.to_location_id,
                input.to_location_type,
                input.description,
                input.completed,
                new Date(),
                input.completed_lines,
                input.transfer_quantity,
                input.requested_quantity,
                input.recieved_quantity,
                input.outstanding_quantity,
                input.cancelled,
                input.cancelled_by,
                input.cancelled_date,
                req.userIdentity.hospital_id
              ],
              printQuery: false
            })
            .then(headerResult => {
              req.body.transaction_id = headerResult.insertId;
              req.body.year = year;
              req.body.period = period;
              console.log("headerResult: ", headerResult.insertId);

              for (let i = 0; i < input.stock_detail.length; i++) {
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_pharmacy_transfer_detail ( item_id,item_category_id,item_group_id,\
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
                      headerResult.insertId
                    ],

                    printQuery: false
                  })
                  .then(detailResult => {
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
                      "sales_price"
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_pharmacy_transfer_batches(??) VALUES ?",
                        values: input.stock_detail[i]["pharmacy_stock_detail"],
                        includeValues: IncludeSubValues,
                        extraValues: {
                          transfer_detail_id: detailResult.insertId
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: false
                      })
                      .then(subResult => {
                        if (i == input.stock_detail.length - 1) {
                          req.connection = {
                            connection: _mysql.connection,
                            isTransactionConnection:
                              _mysql.isTransactionConnection,
                            pool: _mysql.pool
                          };
                          req.flag = 1;

                          // _mysql.commitTransaction(() => {
                          //   _mysql.releaseConnection();
                          req.records = {
                            transfer_number: transfer_number,
                            hims_f_pharmacy_transfer_header_id:
                              headerResult.insertId,
                            year: year,
                            period: period
                          };
                          next();
                          // });
                        }
                      });
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatetransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharmacy_transfer_header` SET `completed`=?, `completed_date`=? \
          WHERE `hims_f_pharmacy_transfer_header_id`=?",
          values: [
            inputParam.completed,
            new Date(),
            inputParam.hims_f_pharmacy_transfer_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          req.flag = 1;
          //   _mysql.commitTransaction(() => {
          //     _mysql.releaseConnection();
          req.records = headerResult;
          next();
          //   });
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

  getrequisitionEntryTransferBACKUP: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_pharamcy_material_header \
          where material_requisition_number=?",
          values: [inputParam.material_requisition_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "SELECT LOC.*,D.* FROM hims_m_item_location LOC inner join \
                  hims_f_pharmacy_material_detail D   on D.item_id=LOC.item_id INNER JOIN \
                  (SELECT L.item_id, MIN(expirydt) MinDate \
                  FROM hims_m_item_location L inner join hims_f_pharmacy_material_detail \
                  D on D.item_id= L.item_id where date(expirydt) > curdate() and \
                  D.pharmacy_header_id=? and L.pharmacy_location_id=? GROUP BY L.item_id \
                  ) T ON LOC.item_id = T.item_id AND LOC.expirydt = T.MinDate  and \
                  D.pharmacy_header_id=? and LOC.pharmacy_location_id=?",
                values: [
                  headerResult[0].hims_f_pharamcy_material_header_id,
                  headerResult[0].to_location_id,
                  headerResult[0].hims_f_pharamcy_material_header_id,
                  headerResult[0].to_location_id
                ],
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

  getrequisitionEntryTransfer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      const utilities = new algaehUtilities();
      utilities.logger().log("getrequisitionEntryTransfer: ");
      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_pharamcy_material_header \
          where material_requisition_number=?",
          values: [inputParam.material_requisition_number],
          printQuery: true
        })
        .then(headerResult => {
          utilities.logger().log("headerResult: ", headerResult);
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select D.*,LOC.*,IM.item_description, PU.uom_description from hims_f_pharmacy_material_detail D \
                  inner join `hims_m_item_location` LOC  on D.item_id=LOC.item_id \
                  inner join `hims_d_item_master` IM  on IM.hims_d_item_master_id=D.item_id \
                  inner join `hims_d_pharmacy_uom` PU  on PU.hims_d_pharmacy_uom_id=D.item_uom \
                  where   LOC.pharmacy_location_id=? and  D.pharmacy_header_id=? and  LOC.expirydt > CURDATE() \
                  and LOC.qtyhand>0 and D.quantity_outstanding<>0  order by  LOC.expirydt ",
                values: [
                  headerResult[0].to_location_id,
                  headerResult[0].hims_f_pharamcy_material_header_id
                ],
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                _mysql.releaseConnection();

                utilities
                  .logger()
                  .log("pharmacy_stock_detail: ", pharmacy_stock_detail);

                var item_grp = _(pharmacy_stock_detail)
                  .groupBy("item_id")
                  .map((row, item_id) => item_id)
                  .value();

                let outputArray = [];
                utilities.logger().log("item_grp: ", item_grp);

                for (let i = 0; i < item_grp.length; i++) {
                  let item = new LINQ(pharmacy_stock_detail)
                    .Where(w => w.item_id == item_grp[i])
                    .Select(s => {
                      return {
                        hims_f_pharmacy_material_detail_id:
                          s.hims_f_pharmacy_material_detail_id,
                        pharmacy_header_id: s.pharmacy_header_id,
                        completed: s.completed,
                        item_category_id: s.item_category_id,
                        item_group_id: s.item_group_id,
                        item_id: s.item_id,
                        from_qtyhand: s.from_qtyhand,
                        to_qtyhand: s.to_qtyhand,
                        quantity_required: s.quantity_required,
                        quantity_authorized: s.quantity_authorized,
                        item_uom: s.item_uom,
                        quantity_recieved: s.quantity_recieved,
                        quantity_outstanding: s.quantity_outstanding,
                        po_created_date: s.po_created_date,
                        po_created: s.po_created,
                        po_created_quantity: s.po_created_quantity,
                        po_outstanding_quantity: s.po_outstanding_quantity,
                        po_completed: s.po_completed,
                        item_description: s.item_description,
                        uom_description: s.uom_description
                      };
                    })
                    .FirstOrDefault();

                  let batches = new LINQ(pharmacy_stock_detail)
                    .Where(w => w.item_id == item_grp[i])
                    .Select(s => {
                      return {
                        hims_m_item_location_id: s.hims_m_item_location_id,
                        item_id: s.item_id,
                        pharmacy_location_id: s.pharmacy_location_id,
                        item_location_status: s.item_location_status,
                        batchno: s.batchno,
                        expiry_date: s.expirydt,
                        barcode: s.barcode,
                        qtyhand: s.qtyhand,
                        qtypo: s.qtypo,
                        cost_uom: s.cost_uom,
                        unit_cost: s.avgcost,
                        last_purchase_cost: s.last_purchase_cost,
                        item_type: s.item_type,
                        grn_id: s.grn_id,
                        grnno: s.grnno,
                        sale_price: s.sale_price,
                        mrp_price: s.mrp_price,
                        sales_uom: s.sales_uom,
                        quantity_transfer: 0
                      };
                    })
                    .ToArray();

                  outputArray.push({ ...item, batches });
                }

                req.records = {
                  ...headerResult[0],
                  ...{ stock_detail: outputArray }
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
  }
};
