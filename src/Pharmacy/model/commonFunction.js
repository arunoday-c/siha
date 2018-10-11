"use strict";
import { LINQ } from "node-linq";
import { logger, debugFunction, debugLog } from "../../utils/logging";

let updateIntoItemLocation = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  let inputParam = req.body;

  let xmlQuery = "<hims_m_item_location>";
  debugLog("xmlQuery", xmlQuery);
  new LINQ(inputParam.pharmacy_stock_detail)
    .Select(s => {
      xmlQuery +=
        "<item_id>" +
        s.item_id +
        "</item_id> \
    <pharmacy_location_id>" +
        s.location_id +
        "</pharmacy_location_id> \
    <batchno>" +
        s.batchno +
        "</batchno> \
    <expirydt>" +
        s.expiry_date +
        "</expirydt>\
    <barcode>" +
        s.barcode +
        "</barcode>\
    <qtyhand>" +
        s.quantity +
        "</qtyhand> \
    <qtypo>" +
        (s.qtypo == null ? 0 : s.qtypo) +
        "</qtypo>\
    <cost_uom>" +
        s.uom_id +
        "</cost_uom> \
    <avgcost>" +
        s.unit_cost +
        "</avgcost><last_purchase_cost>" +
        (s.last_purchase_cost == null ? 0 : s.last_purchase_cost) +
        "</last_purchase_cost>\
    <grn_id>" +
        (s.grn_id == null ? null : s.grn_id) +
        "</grn_id>\
    <grnno>" +
        s.grn_number +
        "</grnno>\
    <sale_price>" +
        (s.sale_price == null ? 0 : s.sale_price) +
        "</sale_price>\
    <sales_uom>" +
        s.sales_uom +
        "</sales_uom> \
    <transaction_type>" +
        req.body.transaction_type +
        "</transaction_type> \
    <transaction_id>" +
        req.body.transaction_id +
        "</transaction_id> \
    <transaction_date>" +
        req.body.transaction_date +
        "</transaction_date> \
    <from_location_id>" +
        s.location_id +
        "</from_location_id> \
    <from_location_type>" +
        s.location_type +
        "</from_location_type> \
    <year>" +
        req.body.year +
        "</year> \
    <period>" +
        req.body.period +
        "</period> \
    <to_location_id>" +
        (s.to_location_id == null ? null : s.to_location_id) +
        "</to_location_id> \
    <to_location_type>" +
        (s.to_location_type == null ? null : s.to_location_type) +
        "</to_location_type> \
    <description>" +
        req.body.description +
        "</description> \
    <item_category_id>" +
        s.item_category_id +
        "</item_category_id> \
    <item_group_id>" +
        s.item_group_id +
        "</item_group_id> \
    <item_code_id>" +
        s.item_id +
        "</item_code_id> \
    <required_batchno>" +
        s.required_batchno +
        "</required_batchno> \
    <expiry_date>" +
        s.expiry_date +
        "</expiry_date>\
    <transaction_qty>" +
        s.quantity +
        "</transaction_qty> \
    <transaction_uom>" +
        s.uom_id +
        "</transaction_uom> \
    <transaction_cost>" +
        s.unit_cost +
        "</transaction_cost>\
    <transaction_total>" +
        s.extended_cost +
        "</transaction_total>\
    <discount_percentage>" +
        (s.discount_percentage == null ? 0 : s.discount_percentage) +
        "</discount_percentage>\
    <discount_amount>" +
        (s.discount_amount == null ? 0 : s.discount_amount) +
        "</discount_amount>\
    <net_total>" +
        (s.net_total == null ? 0 : s.net_total) +
        "</net_total>\
    <landing_cost>" +
        (s.landing_cost == null ? 0 : s.landing_cost) +
        "</landing_cost> \
    <average_cost>" +
        (s.unit_cost == null ? 0 : s.unit_cost) +
        "</average_cost> \
    <created_by>" +
        req.userIdentity.algaeh_d_app_user_id +
        "</created_by> \
    <updated_by>" +
        req.userIdentity.algaeh_d_app_user_id +
        "</updated_by>\
    <operation>" +
        (s.operation == null ? null : s.operation) +
        "</operation>";
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
