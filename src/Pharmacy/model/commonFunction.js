"use strict";
import { LINQ } from "node-linq";

let updateIntoItemLocation = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  let inputParam = req.body;
  let xmlQuery = "<hims_m_item_location>";
  new LINQ(inputParam.pharmacy_stock_detail)
    .Select(s => {
      xmlQuery +=
        "<item_id>" +
        s.item_id +
        "</item_id> \
    <pharmacy_location_id>" +
        s.pharmacy_location_id +
        "</pharmacy_location_id> \
    <batchno>" +
        s.batchno +
        "</batchno> <expirydt>" +
        s.expirydt +
        "</expirydt>\
    <barcode>" +
        s.barcode +
        "</barcode><qtyhand>" +
        s.qtyhand +
        "</qtyhand> \
    <qtypo>" +
        s.qtypo +
        "</qtypo> <cost_uom>" +
        s.cost_uom +
        "</cost_uom> \
    <avgcost>" +
        s.avgcost +
        "</avgcost><last_purchase_cost>" +
        s.last_purchase_cost +
        "</last_purchase_cost>\
    <grn_id>" +
        s.grn_id +
        "</grn_id><grnno>" +
        s.grnno +
        "</grnno><sale_price>" +
        s.sale_price +
        "</sale_price>\
    <created_by>" +
        req.userIdentity.algaeh_d_app_user_id +
        "</created_by> \
    <updated_by>" +
        req.userIdentity.algaeh_d_app_user_id +
        "</updated_by>";
    })
    .ToArray();

  db.query(
    " call algaeh_proc_item_location ('" + xmlQuery + "')",
    (error, result) => {
      if (error) {
        req.options.onFailure(error);
      } else {
        req.option.onSuccess(result);
      }
    }
  );
};

module.exports = {
  updateIntoItemLocation
};
