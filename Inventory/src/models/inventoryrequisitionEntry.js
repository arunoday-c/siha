import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  getinventoryrequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.material_requisition_number != null) {
        _strAppend += " and material_requisition_number=?";
        intValue.push(req.query.material_requisition_number);
      }

      if (req.query.from_location_id != null) {
        _strAppend += " and from_location_id=?";
        intValue.push(req.query.from_location_id);
      }

      if (req.query.to_location_id != null) {
        _strAppend += " and to_location_id=?";
        intValue.push(req.query.to_location_id);
      }

      if (req.query.authorize1 != null) {
        _strAppend += " and authorize1=?";
        intValue.push(req.query.authorize1);
      }

      if (req.query.authorie2 != null) {
        _strAppend += " and authorie2=?";
        intValue.push(req.query.authorie2);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT * from hims_f_inventory_material_header where 1=1 " +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select ID.`hims_f_inventory_material_detail_id`, ID.`inventory_header_id`, ID.`completed`, ID.`item_category_id`, \
                  ID.`item_group_id`, ID.`item_id`, ID.`from_qtyhand`, ID.`to_qtyhand`, ID.`quantity_required`, ID.`quantity_authorized`, \
                  ID.`item_uom`, ID.`quantity_recieved`, ID.`quantity_outstanding`, ID.`po_created_date`, ID.`po_created`, \
                  ID.`po_created_quantity`, ID.`po_outstanding_quantity`, ID.`po_completed`,IM.item_code, IM.item_description, IU.uom_description\
                  from hims_f_inventory_material_detail ID, hims_d_inventory_item_master IM ,hims_d_inventory_uom IU\
                  where ID.inventory_header_id=? and item_id = IM.hims_d_inventory_item_master_id and item_uom = IU.hims_d_inventory_uom_id",
                values: [headerResult[0].hims_f_inventory_material_header_id],
                printQuery: true
              })
              .then(inventory_stock_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ inventory_stock_detail }
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

  addinventoryrequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = { ...req.body };
      let material_requisition_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addPosEntry: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["INV_REQ_NUM"],
          table_name: "hims_f_inventory_numgen"
        })
        .then(generatedNumbers => {
          material_requisition_number = generatedNumbers.INV_REQ_NUM;
          // let today = moment().format("YYYY-MM-DD");
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_inventory_material_header` (material_requisition_number,requistion_date,from_location_type,\
                from_location_id, expiration_date,required_date,requested_by,on_hold, to_location_id, \
                to_location_type, description, comment, is_completed, completed_date, completed_lines,requested_lines, \
                purchase_created_lines,status,requistion_type,no_of_transfers,no_of_po, authorize1,authorize1_date, \
                authorize1_by,authorie2,authorize2_date,authorize2_by,cancelled, cancelled_by,cancelled_date,hospital_id) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                material_requisition_number,
                new Date(),
                input.from_location_type,
                input.from_location_id,
                input.expiration_date,
                input.required_date,
                req.userIdentity.algaeh_d_app_user_id,
                input.on_hold,
                input.to_location_id,
                input.to_location_type,
                input.description,
                input.comment,
                input.is_completed,
                input.completed_date,
                input.completed_lines,
                input.requested_lines,
                input.purchase_created_lines,

                input.status,
                input.requistion_type,
                input.no_of_transfers,

                input.no_of_po,
                input.authorize1,
                input.authorize1_date,
                input.authorize1_by,
                input.authorie2,
                input.authorize2_date,
                input.authorize2_by,
                input.cancelled,
                input.cancelled_by,
                input.cancelled_date,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "item_id",
                "item_category_id",
                "item_group_id",
                "item_uom",
                "to_qtyhand",
                "from_qtyhand",
                "quantity_required",
                "quantity_authorized"
              ];

              utilities
                .logger()
                .log("inventory_stock_detail: ", input.inventory_stock_detail);

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_inventory_material_detail(??) VALUES ?",
                  values: input.inventory_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    inventory_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      material_requisition_number: material_requisition_number
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

  updateinventoryrequisitionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_inventory_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
          `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
          WHERE `hims_f_inventory_material_header_id`=?",
          values: [
            inputParam.authorize1,
            new Date(),
            inputParam.updated_by,
            inputParam.authorie2,
            new Date(),
            inputParam.updated_by,
            inputParam.hims_f_inventory_material_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            let details = inputParam.inventory_stock_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_inventory_material_detail SET `inventory_header_id`=?,`completed` = ?,\
              `item_category_id`=?, `item_group_id`=?, `item_id`=?, \
              `quantity_required`=?, `quantity_authorized`=?, `item_uom`=?,`quantity_recieved`=?, `quantity_outstanding`=?\
              where `hims_f_inventory_material_detail_id`=?;",
                [
                  details[i].inventory_header_id,
                  details[i].completed,
                  details[i].item_category_id,
                  details[i].item_group_id,
                  details[i].item_id,
                  details[i].quantity_required,
                  details[i].quantity_authorized,
                  details[i].item_uom,
                  details[i].quantity_recieved,
                  details[i].quantity_outstanding,
                  details[i].hims_f_inventory_material_detail_id
                ]
              );
            }
            _mysql
              .executeQueryWithTransaction({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = detailResult;
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
  },

  getinventoryAuthrequisitionList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      let strQuery =
        "SELECT *, CASE requistion_type WHEN 'PR' then 'Purchase Request' else 'Material Request' end as req_type  from  hims_f_inventory_material_header\
            where cancelled='N' ";

      if (req.query.from_date != null) {
        strQuery +=
          " and date(requistion_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        strQuery += " and date(requistion_date) <= date(now())";
      }

      if (inputParam.from_location_id != null) {
        strQuery += " and from_location_id = " + inputParam.from_location_id;
      }
      if (inputParam.to_location_id != null) {
        strQuery += " and to_location_id = " + inputParam.to_location_id;
      }

      if (inputParam.status == null || inputParam.status == "0") {
        strQuery += "";
      } else if (inputParam.status == "1") {
        //Pending To Authorize 1
        strQuery += " and authorize1 = 'N'";
      } else if (inputParam.status == "2") {
        //Pending To Authorize 2
        strQuery += " and authorize1 = 'Y' and authorie2 = 'N'";
      } else if (inputParam.status == "3") {
        strQuery +=
          " and authorize1 = 'Y' and authorie2 = 'Y' and is_completed='N'";
      } else if (inputParam.status == "4") {
        strQuery += " and is_completed='Y'";
      }

      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
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

  updateinvreqEntryOnceTranfer: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };

      let complete = inputParam.complete === "N" ? "N" : "Y";

      const partial_recived = new LINQ(inputParam.inventory_stock_detail)
        .Where(w => w.quantity_outstanding != 0)
        .ToArray();

      if (partial_recived.length > 0) {
        complete = "N";
      }

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_inventory_material_header` SET `is_completed`=?, `completed_date`=? \
          WHERE `hims_f_inventory_material_header_id`=?",
          values: [
            complete,
            new Date(),
            inputParam.hims_f_inventory_material_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            let details = inputParam.inventory_stock_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry += mysql.format(
                "UPDATE hims_f_inventory_material_detail SET `quantity_outstanding`=?\
              where `hims_f_inventory_material_detail_id`=?;",
                [
                  details[i].quantity_outstanding,
                  details[i].material_requisition_detail_id
                ]
              );
            }
            _mysql
              .executeQueryWithTransaction({
                query: qry,
                printQuery: true
              })
              .then(detailResult => {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                // req.records = detailResult;
                next();
                // });
              })
              .catch(e => {
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
