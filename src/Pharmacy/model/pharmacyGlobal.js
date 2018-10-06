"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../../utils/logging";
import moment from "moment";

//created by irfan: to get
let getUomLocationStock = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor, uom_status\
        from hims_m_item_uom where record_status='A' and item_master_id=? ",
        [req.query.item_id],
        (error, uomResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          // req.records = result;
          // next();

          connection.query(
            "SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
            avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom\
            from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=?\
            and qtyhand>0  order by expirydt ",
            [req.query.item_id, req.query.location_id],
            (error, locationResult) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }

              req.records = {
                uomResult: uomResult,
                locationResult: locationResult
              };
              next();
            }
          );
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getUomLocationStock };
