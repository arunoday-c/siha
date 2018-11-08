"use strict";
import extend from "extend";
import { whereCondition, releaseDBConnection } from "../../utils";

import httpStatus from "../../utils/httpStatus";
import { debugLog } from "../../utils/logging";

//created by irfan: to get Uom Location Stock
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
        from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? and expirydt > CURDATE() \
        and qtyhand>0  order by expirydt",
        [req.query.item_id, req.query.item_id, req.query.location_id],
        (error, result) => {
          debugLog("uomResult", result);
          releaseDBConnection(db, connection);

          if (error) {
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

//created by Nowshad: getVisitPrescriptionDetails
let getVisitPrescriptionDetails = (req, res, next) => {
  let selectWhere = {
    episode_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT H.hims_f_prescription_id,H.patient_id, H.encounter_id, H.provider_id, H.episode_id, \
          H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,\
          D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time, D.start_date, D.item_status, D.service_id, D.uom_id,\
          D.item_category_id, D.item_group_id\
          from hims_f_prescription H,hims_f_prescription_detail D  WHERE H.hims_f_prescription_id = D.prescription_id and " +
          where.condition,
        where.values,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: get Item Moment
let getItemMoment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder =
        "date(transaction_date) between date('" +
        req.query.from_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      whereOrder = "date(transaction_date) <= date(now())";
    }
    delete req.query.from_date;
    delete req.query.to_date;
    let where = whereCondition(extend(req.query));

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT * from hims_f_pharmacy_trans_history  WHERE record_status = 'A' and " +
          whereOrder +
          (where.condition == "" ? "" : " AND " + where.condition),
        where.values,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Uom Location Stock
let getItemLocationStock = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? \
        and qtyhand>0  order by expirydt",
        [req.query.item_id, req.query.location_id],
        (error, result) => {
          debugLog("uomResult", result);
          releaseDBConnection(db, connection);

          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get User Wise Location Permission
let getUserLocationPermission = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_m_location_permission_id,user_id, location_id,L.hims_d_pharmacy_location_id,L.location_description,\
        L.location_type,L.allow_pos from hims_m_location_permission LP,hims_d_pharmacy_location L \
        where LP.record_status='A' and\
         L.record_status='A' and LP.location_id=L.hims_d_pharmacy_location_id  and allow='Y' and user_id=?",
        [req.userIdentity.algaeh_d_app_user_id],
        (error, result) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
          }

          if (result.length < 1) {
            connection.query(
              "select  hims_d_pharmacy_location_id, location_description, location_status, location_type,\
            allow_pos from hims_d_pharmacy_location where record_status='A'",
              (error, resultLoctaion) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                //ppppppppp
                req.records = resultLoctaion;
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUomLocationStock,
  getVisitPrescriptionDetails,
  getItemMoment,
  getItemLocationStock,
  getUserLocationPermission
};
