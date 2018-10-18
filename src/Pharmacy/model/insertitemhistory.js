"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../../utils/logging";
import { LINQ } from "node-linq";

//created by nowshad: insert item moment history
let insertItemHistory = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  try {
    let inputParam = extend({}, req.body);
    debugLog("inputParam", inputParam);
    let newDtls = new LINQ(inputParam.pharmacy_stock_detail)
      .Select(s => {
        return {
          transaction_type: req.body.transaction_type,
          transaction_id: req.body.transaction_id,
          transaction_date: req.body.transaction_date,
          from_location_id: req.body.from_location_id,
          from_location_type: req.body.from_location_type,
          year: req.body.year,
          period: req.body.period,
          to_location_id: req.body.to_location_id || null,
          to_location_type: req.body.to_location_type || null,
          description: req.body.description,
          item_category_id: s.item_category_id,
          item_group_id: s.item_group_id,
          item_code_id: s.item_id,
          barcode: s.barcode,
          required_batchno: s.required_batchno || "N",
          batchno: s.batchno,
          expiry_date: s.expiry_date,
          transaction_qty: s.quantity,
          transaction_uom: s.uom_id,
          transaction_cost: s.unit_cost,
          transaction_total: s.extended_cost,
          discount_percentage: s.discount_percentage || 0,
          discount_amount: s.discount_amount || 0,
          net_total: s.net_total || 0,
          landing_cost: s.landing_cost || 0,
          average_cost: s.unit_cost || 0,
          created_by: req.userIdentity.algaeh_d_app_user_id,
          created_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date()
        };
      })
      .ToArray();

    debugLog("before History Insert Data", newDtls);

    const insertColumns = [
      "transaction_type",
      "transaction_id",
      "transaction_date",
      "from_location_id",
      "from_location_type",
      "year",
      "period",
      "to_location_id",
      "to_location_type",
      "description",
      "item_category_id",
      "item_group_id",
      "item_code_id",
      "barcode",
      "required_batchno",
      "batchno",
      "expiry_date",
      "transaction_qty",
      "transaction_uom",
      "transaction_cost",
      "transaction_total",
      "discount_percentage",
      "discount_amount",
      "net_total",
      "landing_cost",
      "average_cost",
      "created_by",
      "created_date",
      "updated_by",
      "updated_date"
    ];

    db.query(
      "INSERT  INTO hims_f_pharmacy_trans_history (" +
        insertColumns.join(",") +
        ") VALUES ? ",
      [
        jsonArrayToObject({
          sampleInputObject: insertColumns,
          arrayObj: newDtls,
          req: req
        })
      ],
      (error, detailResult) => {
        debugLog("error", detailResult);
        if (error) {
          if (req.options == null) {
            db.rollback(() => {
              releaseDBConnection(req.db, db);
              next(error);
            });
          } else {
            req.options.onFailure(error);
          }
        }

        if (req.options == null) {
          req.records = detailResult;
          releaseDBConnection(req.db, db);
          next();
        } else {
          req.options.onSuccess(detailResult);
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

module.exports = {
  insertItemHistory
};
