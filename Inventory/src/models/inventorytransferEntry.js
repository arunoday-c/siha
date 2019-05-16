import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  gettransferEntry: (req, res, next) => {
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
          printQuery: true
        })
        .then(headerResult => {
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

  addtransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = { ...req.body };
      let transfer_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addtransferEntry: ");

      _mysql
        .generateRunningNumber({
          modules: ["INV_TRN_NUM"]
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

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_inventory_transfer_detail(??) VALUES ?",
                  values: input.inventory_stock_detail,
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
                      hims_f_inventory_transfer_header_id:
                        headerResult.insertId,
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

  updatetransferEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_inventory_transfer_header` SET `completed`=?, `completed_date`=? \
          WHERE `hims_f_inventory_transfer_header_id`=?",
          values: [
            inputParam.completed,
            new Date(),
            inputParam.hims_f_inventory_transfer_header_id
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

          req.records = headerResult;
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
          printQuery: true
        })
        .then(headerResult => {
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
                  ) T ON LOC.item_id = T.item_id AND LOC.expirydt = T.MinDate  and \
                  D.inventory_header_id=? and LOC.inventory_location_id=?",
                values: [
                  headerResult[0].hims_f_inventory_material_header_id,
                  headerResult[0].to_location_id,
                  headerResult[0].hims_f_inventory_material_header_id,
                  headerResult[0].to_location_id
                ],
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

  getrequisitionEntryTransfer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.query;

      _mysql
        .executeQuery({
          query:
            "SELECT * from  hims_f_inventory_material_header \
          where material_requisition_number=?",
          values: [inputParam.material_requisition_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select D.*,LOC.* from hims_f_inventory_material_detail D \
                  inner join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id \
                  where  D.inventory_header_id=? and LOC.inventory_location_id=? and  LOC.expirydt > CURDATE() \
                   and LOC.qtyhand>0  order by  LOC.expirydt ",
                values: [
                  headerResult[0].hims_f_inventory_material_header_id,
                  headerResult[0].to_location_id
                ],
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
  }
};
