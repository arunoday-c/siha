"use strict";
import { LINQ } from "node-linq";
import { debugLog } from "../../utils/logging";

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

let updateIntoItemLocation = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  let inputParam = req.body;

  let xmlQuery = "<hims_m_item_location>";

  new LINQ(inputParam.pharmacy_stock_detail)
    .Select(s => {
      xmlQuery += createXmlString({
        item_id: s.item_id,
        pharmacy_location_id: s.location_id,
        batchno: s.batchno,
        expirydt: s.expiry_date,
        barcode: s.barcode,
        qtyhand: s.quantity,
        qtypo: s.qtypo,
        cost_uom: s.uom_id,
        avgcost: s.unit_cost,
        last_purchase_cost: s.last_purchase_cost,
        grn_id: s.grn_id,
        grnno: s.grn_number,
        sale_price: s.sale_price,
        sales_uom: s.sales_uom,
        transaction_type: req.body.transaction_type,
        transaction_id: req.body.transaction_id,
        transaction_date: req.body.transaction_date,
        from_location_id: s.location_id,
        from_location_type: s.location_type,
        year: req.body.year,
        period: req.body.period,
        to_location_id: s.to_location_id,
        to_location_type: s.to_location_type,
        description: req.body.description,
        item_category_id: s.item_category_id,
        item_group_id: s.item_group_id,
        item_code_id: s.item_id,
        required_batchno: s.required_batchno,
        expiry_date: s.expiry_date,
        transaction_qty: s.quantity,
        transaction_uom: s.uom_id,
        transaction_cost: s.unit_cost,
        transaction_total: s.extended_cost,
        discount_percentage: s.discount_percentage,
        discount_amount: s.discount_amount,
        net_total: s.net_total,
        landing_cost: s.landing_cost,
        average_cost: s.unit_cost,
        created_by: req.userIdentity.algaeh_d_app_user_id,
        updated_by: req.userIdentity.algaeh_d_app_user_id,
        operation: s.operation
      });
    })
    .ToArray();
  xmlQuery += "</hims_m_item_location>";

  debugLog("xmlQuery", xmlQuery);
  db.query(
    " call algaeh_proc_item_location ('" + xmlQuery + "')",
    (error, result) => {
      debugLog("error", error);
      debugLog("result", result);
      if (error) {
        req.options.onFailure(error);
      } else {
        req.options.onSuccess(result);
      }
    }
  );
};

module.exports = {
  updateIntoItemLocation
};
