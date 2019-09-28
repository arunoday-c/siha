"use strict";
import utils from "../../utils";
import { LINQ } from "node-linq";
import logUtils from "../../utils/logging";

const { debugLog } = logUtils;
const { releaseDBConnection } = utils;

const createXmlString = Jobject => {
  if (Jobject != null) {
    let stringObj = "";
    Object.keys(Jobject).map(item => {
      if (Jobject[item] != null && Jobject[item] != undefined) {
        stringObj += "<" + item + ">" + Jobject[item] + "</" + item + ">";
      }
    });
    return stringObj;
  } else {
    return "";
  }
};

let updateIntoInvItemLocation = (req, res, next) => {
  // let db = req.options == null ? req.db : req.options.db;

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }

    let inputParam = req.body;

    let xmlQuery = "";
    debugLog("req.body: ", req.body);

    new LINQ(inputParam.inventory_stock_detail)
      .Select(s => {
        xmlQuery += "<hims_m_inventory_item_location>";
        xmlQuery += createXmlString({
          item_id: s.item_id,
          inventory_location_id: s.location_id,
          batchno: s.batchno,
          expirydt: s.expiry_date,
          barcode: s.barcode,
          qtyhand: s.quantity,
          qtypo: s.qtypo || 0,
          cost_uom: s.uom_id,
          avgcost: s.unit_cost,
          last_purchase_cost: s.last_purchase_cost || 0,
          grn_id: s.grn_id || 0,
          grnno: s.grn_number,
          sale_price: s.sale_price || 0,
          sales_uom: s.sales_uom,
          mrp_price: s.mrp_price || 0,
          transaction_type: req.body.transaction_type,
          transaction_id: req.body.transaction_id,
          transaction_date: req.body.transaction_date,
          from_location_id: s.location_id,
          from_location_type: s.location_type,
          year: req.body.year,
          period: req.body.period,
          to_location_id: s.to_location_id || "~",
          to_location_type: s.to_location_type || "~",
          description: req.body.description,
          item_category_id: s.item_category_id,
          item_group_id: s.item_group_id,
          item_code_id: s.item_id,
          required_batchno: s.required_batchno || "N",
          expiry_date: s.expiry_date,
          transaction_qty: s.quantity,
          transaction_uom: s.uom_id,
          transaction_cost: s.unit_cost,
          transaction_total: s.extended_cost,
          discount_percentage: s.discount_percentage || 0,
          discount_amount: s.discount_amount || 0,
          net_total: s.net_total,
          landing_cost: s.landing_cost || 0,
          average_cost: s.unit_cost,
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          operation: s.operation
        });
        xmlQuery += "</hims_m_inventory_item_location>";
      })
      .ToArray();

    debugLog("xmlQuery", xmlQuery);
    connection.query(
      " call algaeh_proc_inv_item_location ('" + xmlQuery + "')",
      (error, result) => {
        debugLog("error", error);
        debugLog("result", result);
        releaseDBConnection(db, connection);
        if (error) {
          req.options.onFailure(error);
        } else {
          debugLog("Array: ", Array.isArray(result));

          if (Array.isArray(result)) {
            debugLog("Error: ", result[0][0].Error);
            // if (result[0][0].Error != null) {
            if (result[0][0].Error != null) {
              debugLog("Error: ", result[0][0].Error);

              const error = new Error();
              error.message = result[0][0].Error;
              if (req.options != null) {
                req.options.onFailure(error);
              } else {
                next(error);
              }
            } else {
              if (req.options != null) {
                req.options.onSuccess(result);
              } else {
                next();
              }
            }
          } else {
            if (req.options != null) {
              req.options.onSuccess(result);
            } else {
              next();
            }
          }
        }
      }
    );
  });
};

export default {
  updateIntoInvItemLocation
};
