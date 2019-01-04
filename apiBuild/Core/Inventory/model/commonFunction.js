"use strict";

var _utils = require("../../utils");

var _nodeLinq = require("node-linq");

var _logging = require("../../utils/logging");

var createXmlString = function createXmlString(Jobject) {
  if (Jobject != null) {
    var stringObj = "";
    Object.keys(Jobject).map(function (item) {
      if (Jobject[item] != null && Jobject[item] != undefined) {
        stringObj += "<" + item + ">" + Jobject[item] + "</" + item + ">";
      }
    });
    return stringObj;
  } else {
    return "";
  }
};

var updateIntoInvItemLocation = function updateIntoInvItemLocation(req, res, next) {
  // let db = req.options == null ? req.db : req.options.db;

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }

    var inputParam = req.body;

    var xmlQuery = "";
    (0, _logging.debugLog)("req.body: ", req.body);

    new _nodeLinq.LINQ(inputParam.inventory_stock_detail).Select(function (s) {
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
    }).ToArray();

    (0, _logging.debugLog)("xmlQuery", xmlQuery);
    connection.query(" call algaeh_proc_inv_item_location ('" + xmlQuery + "')", function (error, result) {
      (0, _logging.debugLog)("error", error);
      (0, _logging.debugLog)("result", result);
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        req.options.onFailure(error);
      } else {
        (0, _logging.debugLog)("Array: ", Array.isArray(result));

        if (Array.isArray(result)) {
          (0, _logging.debugLog)("Error: ", result[0][0].Error);
          // if (result[0][0].Error != null) {
          if (result[0][0].Error != null) {
            (0, _logging.debugLog)("Error: ", result[0][0].Error);

            var _error = new Error();
            _error.message = result[0][0].Error;
            if (req.options != null) {
              req.options.onFailure(_error);
            } else {
              next(_error);
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
    });
  });
};

module.exports = {
  updateIntoInvItemLocation: updateIntoInvItemLocation
};
//# sourceMappingURL=commonFunction.js.map