"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to get Uom Location Stock
var getUomLocationStock = function getUomLocationStock(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_m_inventory_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor, hims_m_inventory_item_uom.uom_status, \
        hims_d_inventory_uom.uom_description  \
        from hims_m_inventory_item_uom,hims_d_inventory_uom where hims_m_inventory_item_uom.record_status='A' and \
        hims_m_inventory_item_uom.uom_id = hims_d_inventory_uom.hims_d_inventory_uom_id and hims_m_inventory_item_uom.item_master_id=? ;\
        SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_inventory_item_location where record_status='A'  and item_id=? and inventory_location_id=? and expirydt > CURDATE() \
        and qtyhand>0  order by expirydt", [req.query.item_id, req.query.item_id, req.query.location_id], function (error, result) {
        (0, _logging.debugLog)("uomResult", result);
        (0, _utils.releaseDBConnection)(db, connection);

        if (error) {
          next(error);
        }
        req.records = {
          uomResult: result[0],
          locationResult: result[1]
        };
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//used

//created by Nowshad: get Item Moment
var getItemMoment = function getItemMoment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder = "date(transaction_date) between date('" + req.query.from_date + "') AND date('" + req.query.to_date + "')";
    } else {
      whereOrder = "date(transaction_date) <= date(now())";
    }
    delete req.query.from_date;
    delete req.query.to_date;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT * from hims_f_inventory_trans_history  WHERE record_status = 'A' and " + whereOrder + (where.condition == "" ? "" : " AND " + where.condition), where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//Used
//created by irfan: to get Uom Location Stock
var getItemLocationStock = function getItemLocationStock(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let Orderby = "order by expirydt";
    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_inventory_item_location where record_status='A'  and item_id=? and inventory_location_id=? \
        and qtyhand>0  order by expirydt", [req.query.item_id, req.query.location_id], function (error, result) {
        (0, _logging.debugLog)("uomResult", result);
        (0, _utils.releaseDBConnection)(db, connection);

        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//used
//created by Nowshad: to get User Wise Location Permission
var getUserLocationPermission = function getUserLocationPermission(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_m_inventory_location_permission_id,user_id, location_id,L.hims_d_inventory_location_id,L.location_description,\
        L.location_type,L.allow_pos from hims_m_inventory_location_permission LP,hims_d_inventory_location L \
        where LP.record_status='A' and\
         L.record_status='A' and LP.location_id=L.hims_d_inventory_location_id  and allow='Y' and user_id=?", [req.userIdentity.algaeh_d_app_user_id], function (error, result) {
        if (error) {
          next(error);
          (0, _utils.releaseDBConnection)(db, connection);
        }

        if (result.length < 1) {
          connection.query("select  hims_d_inventory_location_id, location_description, location_status, location_type,\
            allow_pos from hims_d_inventory_location where record_status='A'", function (error, resultLoctaion) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }
            req.records = resultLoctaion;
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Items in selected Location
var getItemandLocationStock = function getItemandLocationStock(req, res, next) {
  var selectWhere = {
    item_id: "ALL",
    inventory_location_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
    var Orderby = " order by expirydt";
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT hims_m_inventory_item_location_id, item_id, inventory_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_inventory_item_location where record_status='A' and qtyhand>0 and " + where.condition, where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUomLocationStock: getUomLocationStock,
  getItemMoment: getItemMoment,
  getItemLocationStock: getItemLocationStock,
  getUserLocationPermission: getUserLocationPermission,
  getItemandLocationStock: getItemandLocationStock
};
//# sourceMappingURL=inventoryGlobal.js.map