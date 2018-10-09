"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";

import httpStatus from "../../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../../utils/logging";

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
        "select hims_m_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor, hims_m_item_uom.uom_status, \
        hims_d_pharmacy_uom.uom_description  \
        from hims_m_item_uom,hims_d_pharmacy_uom where hims_m_item_uom.record_status='A' and \
        hims_m_item_uom.uom_id = hims_d_pharmacy_uom.hims_d_pharmacy_uom_id and hims_m_item_uom.item_master_id=? ;\
        SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
            avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
            from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? \
            and qtyhand>0  order by expirydt",
        [req.query.item_id, req.query.item_id, req.query.location_id],
        (error, result) => {
          debugLog("uomResult", result);
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = {
            uomResult: result[0],
            locationResult: result[1]
          };
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getUomLocationStock };
