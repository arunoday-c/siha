"use strict";

import { LINQ } from "node-linq";
import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

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
  // const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = req.body;
    let xmlQuery = "";
    const decimal_places = req.userIdentity.decimal_places;
    const utilities = new algaehUtilities();
    utilities
      .logger()
      .log("updateIntoItemLocation: ", inputParam.pharmacy_stock_detail);

    utilities.logger().log("transaction_type: ", req.body.transaction_type);

    new LINQ(inputParam.pharmacy_stock_detail)
      .Select(s => {
        let unit_cost =
          req.body.transaction_type == "DNA" ||
          req.body.transaction_type == "POS" ||
          req.body.transaction_type == "SRT"
            ? s.average_cost
            : s.unit_cost;
        xmlQuery += "<hims_m_item_location>";
        xmlQuery += createXmlString({
          item_id: s.item_id,
          pharmacy_location_id: s.location_id,
          batchno:
            typeof s.batchno === "string" ? s.batchno : String(s.batchno),
          expirydt: s.expiry_date || "~",
          barcode: s.barcode,
          qtyhand: s.quantity,
          qtypo: s.qtypo || 0,
          cost_uom: s.uom_id,
          avgcost: unit_cost,
          last_purchase_cost: s.last_purchase_cost || 0,
          grn_id: s.grn_id || 0,
          grnno: s.grn_number,
          sale_price: s.sales_price || 0,
          sales_uom: s.sales_uom,
          mrp_price: s.mrp_price || 0,
          transaction_type: req.body.transaction_type,
          transaction_id: req.body.transaction_id,
          transaction_date: req.body.transaction_date,
          from_location_id: s.location_id,
          from_location_type: s.location_type,
          vendor_batchno: s.vendor_batchno || null,
          year: req.body.year,
          period: req.body.period,
          to_location_id: s.to_location_id || "~",
          to_location_type: s.to_location_type || "~",
          description: req.body.description,
          item_category_id: s.item_category_id,
          item_group_id: s.item_group_id,
          item_code_id: s.item_id,
          required_batchno: s.required_batchno || "N",
          expiry_date: s.expiry_date || "~",
          transaction_qty: s.quantity,
          transaction_uom: s.uom_id,
          transaction_cost: s.unit_cost,
          transaction_total: utilities.decimalPoints(
            s.extended_cost,
            decimal_places
          ),
          discount_percentage: s.discount_percentage || 0,
          discount_amount: s.discount_amount || 0,
          net_total: utilities.decimalPoints(s.net_total || 0, decimal_places),
          landing_cost: s.landing_cost || 0,
          git_qty: s.git_qty || 0,
          average_cost: unit_cost,
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          operation: s.operation,
          hospital_id: req.userIdentity.hospital_id,
          flag: req.flag || 0
        });
        xmlQuery += "</hims_m_item_location>";
      })
      .ToArray();
    // xmlQuery += "</hims_m_item_location>";

    utilities.logger().log("xmlQuery: ", xmlQuery);
    _mysql
      .executeQuery({
        query: "call algaeh_proc_item_location ('" + xmlQuery + "')",
        printQuery: true
      })
      .then(result => {
        utilities.logger().log("result: ", result);
        utilities.logger().log("req.flag: ", req.flag);
        if (Array.isArray(result)) {
          if (result[0][0].Error != null) {
            const error = new Error();
            error.message = result[0][0].Error;
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          } else {
            if (req.flag == 1) {
              utilities.logger().log("req.flag: ");
              for (let i = 0; i < req.body.pharmacy_stock_detail.length; i++) {
                req.body.pharmacy_stock_detail[i].location_id =
                  req.body.to_location_id;
                req.body.pharmacy_stock_detail[i].location_type =
                  req.body.to_location_type;

                req.body.pharmacy_stock_detail[i].sales_uom =
                  req.body.pharmacy_stock_detail[i].uom_transferred_id;

                req.body.pharmacy_stock_detail[i].operation = "+";
                req.body.pharmacy_stock_detail[i].git_qty = 0;
              }
              req.flag = 0;
              next();
            } else {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                next();
              });
            }
          }
        } else {
          if (req.flag == 1) {
            utilities.logger().log("req.flag: ");
            for (let i = 0; i < req.body.pharmacy_stock_detail.length; i++) {
              req.body.pharmacy_stock_detail[i].location_id =
                req.body.to_location_id;
              req.body.pharmacy_stock_detail[i].location_type =
                req.body.to_location_type;

              req.body.pharmacy_stock_detail[i].sales_uom =
                req.body.pharmacy_stock_detail[i].uom_transferred_id;

              req.body.pharmacy_stock_detail[i].operation = "+";
              req.body.pharmacy_stock_detail[i].git_qty = 0;
            }
            req.flag = 0;
            next();
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              next();
            });
          }
        }
      })
      .catch(e => {
        utilities.logger().log("error: ", e);
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  updateIntoItemLocation
};
