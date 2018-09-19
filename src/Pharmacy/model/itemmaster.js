import {
  whereCondition,
  releaseDBConnection,
  selectStatement,
  deleteRecord
} from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../../utils/logging";

// created by Nowshad Section
let getItems = (req, res, next) => {
  let labSection = {
    hims_d_item_master_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(labSection, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_d_item_master` WHERE `record_status`='A' AND " +
          condition.condition +
          " " +
          pagePaging,
        values: condition.values
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add in itemMaster
let addItemMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_item_master` (`item_code`, `item_description`, `structure_id`,\
         `generic_id`, `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `created_date`, `created_by`, `update_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.item_code,
          input.item_description,
          input.structure_id,
          input.generic_id,
          input.category_id,
          input.group_id,
          input.item_uom_id,
          input.purchase_uom_id,
          input.sales_uom_id,
          input.stocking_uom_id,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

//created by irfan: to add in itemMaster
let addItemCategory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_item_category` (`category_desc`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.category_desc,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
//created by irfan: to add  itemMaster
let addItemGeneric = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_item_generic` (`generic_name`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.generic_name,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

//created by irfan: to add  itemMaster
let addItemGroup = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_item_group` (`group_description`, `category_id`, `created_by`, `created_date`, `updated_by`, `updated_date`) \
        VALUE(?,?,?,?,?,?)",
        [
          input.group_description,
          input.category_id,
          input.created_by,
          new Date(),
          input.updated_by,
          new Date()
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

module.exports = {
  getItems,
  addItemMaster,
  addItemCategory,
  addItemGeneric
};
