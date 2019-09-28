"use strict";
import extend from "extend";
import utils from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} = utils;

//created by irfan: to add vendor master
let addVendorMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_vendor` (vendor_code,vendor_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
          contact_number,payment_terms,payment_mode,vat_applicable,vat_percentage,  postal_code,address, country_id, state_id, city_id,\
          created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.vendor_code,
          input.vendor_name,
          input.bank_name,
          input.business_registration_no,
          input.email_id_1,
          input.email_id_2,
          input.website,
          input.contact_number,
          input.payment_terms,
          input.payment_mode,
          input.vat_applicable,
          input.vat_percentage,
          input.postal_code,
          input.address,
          input.country_id,
          input.state_id,
          input.city_id,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
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

//created by irfan: to get vendor master
let getVendorMaster = (req, res, next) => {
  let selectWhere = {
    hims_d_vendor_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    debugLog("where : ", where);
    db.getConnection((error, connection) => {
      connection.query(
        " select hims_d_vendor_id, vendor_code, vendor_name, vendor_status, business_registration_no, email_id_1,\
        email_id_2, website, contact_number, payment_terms, payment_mode, vat_applicable, vat_percentage, bank_name,\
        postal_code,address, country_id, state_id, city_id from hims_d_vendor where record_status='A' and " +
          where.condition +
          " order by hims_d_vendor_id desc",
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

//created by irfan: to delete vendor master
let deleteVendorMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_vendor",
        id: req.body.hims_d_vendor_id,
        query:
          "UPDATE hims_d_vendor SET  record_status='I' WHERE  record_status='A' and hims_d_vendor_id=?",
        values: [req.body.hims_d_vendor_id]
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

//created by irfan: to update vendor Master
let updateVendorMaster = (req, res, next) => {
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
        "UPDATE `hims_d_vendor` SET  vendor_name=?,vendor_status=?,business_registration_no=?,email_id_1=?,email_id_2=?,website=?,\
        contact_number=?,payment_terms=?,payment_mode=?,vat_applicable=?,vat_percentage=?,bank_name=?,postal_code=?,address=?, country_id=?, state_id=?, city_id=?,\
        updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vendor_id`=?;",
        [
          input.vendor_name,
          input.vendor_status,
          input.business_registration_no,
          input.email_id_1,
          input.email_id_2,
          input.website,
          input.contact_number,
          input.payment_terms,
          input.payment_mode,
          input.vat_applicable,
          input.vat_percentage,
          input.bank_name,
          input.postal_code,
          input.address,
          input.country_id,
          input.state_id,
          input.city_id,
          new Date(),
          input.updated_by,
          input.hims_d_vendor_id
        ],
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

//created by:irfan to
let makeVendorMasterInActive = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_vendor",
        id: req.body.hims_d_vendor_id,
        query:
          "UPDATE hims_d_vendor SET  vendor_status='I' WHERE record_status='A' and hims_d_vendor_id=?",
        values: [req.body.hims_d_vendor_id]
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

export default {
  addVendorMaster,
  getVendorMaster,
  updateVendorMaster,
  deleteVendorMaster,
  makeVendorMasterInActive
};
