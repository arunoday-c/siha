"use strict";

var _utils = require("../../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add in itemMaster
var addItemMaster = function addItemMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    (0, _logging.debugLog)("Body: ", req.body);

    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        // addl_information,
        //   decimals,
        //   purchase_cost,
        //   markup_percent,
        //   sales_price,
        connection.query("INSERT INTO `hims_d_item_master` (`item_code`, `item_description`, `structure_id`,\
         `generic_id`, `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `service_id`,\
           addl_information, decimals, purchase_cost, markup_percent, sales_price,\
         `created_date`, `created_by`, `update_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [input.item_code, input.item_description, input.structure_id, input.generic_id, input.category_id, input.group_id, input.item_uom_id, input.purchase_uom_id, input.sales_uom_id, input.stocking_uom_id, input.service_id, input.addl_information, input.decimals, input.purchase_cost, input.markup_percent, input.sales_price, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          (0, _logging.debugLog)(" item master id :", result.insertId);
          // req.records = spResult;
          // next();

          if (result.insertId != null) {
            var insurtColumns = ["uom_id", "stocking_uom", "conversion_factor", "created_by", "updated_by"];

            connection.query("INSERT INTO hims_m_item_uom(" + insurtColumns.join(",") + ",item_master_id,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
              sampleInputObject: insurtColumns,
              arrayObj: req.body.detail_item_uom,
              newFieldToInsert: [result.insertId, new Date(), new Date()],
              req: req
            })], function (error, detailResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              connection.commit(function (error) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = detailResult;
                next();
              });
            });
          } else {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ItemCategory
var addItemCategory = function addItemCategory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_item_category` (`category_desc`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)", [input.category_desc, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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
//created by irfan: to add  itemMaster
var addItemGeneric = function addItemGeneric(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_item_generic` (`generic_name`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)", [input.generic_name, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to add  item group
var addItemGroup = function addItemGroup(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_item_group` (`group_description`, `category_id`, `created_by`, `created_date`, `updated_by`, `updated_date`) \
        VALUE(?,?,?,?,?,?)", [input.group_description, input.category_id, input.created_by, new Date(), input.updated_by, new Date()], function (error, result) {
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

//created by irfan: to add   add Pharmacy Uom
var addPharmacyUom = function addPharmacyUom(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_pharmacy_uom` (`uom_description`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)", [input.uom_description, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to add   Pharmacy Location
var addPharmacyLocation = function addPharmacyLocation(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_pharmacy_location` (`location_description`,  `location_type`, `allow_pos`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?)", [input.location_description, input.location_type, input.allow_pos, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to get item master
var getItemMaster = function getItemMaster(req, res, next) {
  var selectWhere = {
    hims_d_item_master_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_master where record_status='A' AND" + where.condition + " order by hims_d_item_master_id desc;", where.values, function (error, result) {
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

//created by irfan: to get ItemMaster And ItemUom
var getItemMasterAndItemUom = function getItemMasterAndItemUom(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      connection.query("select  MIU.hims_m_item_uom_id, MIU.item_master_id, MIU.uom_id,PH.uom_description, MIU.stocking_uom, \
        MIU.conversion_factor,IM.hims_d_item_master_id, IM.item_code, IM.item_description, IM.structure_id, \
        IM.generic_id, IM.category_id,IM.group_id, IM.form_id, IM.storage_id, IM.item_uom_id, IM.purchase_uom_id, \
        IM.sales_uom_id, IM.stocking_uom_id, IM.item_status, IM.service_id from  hims_d_item_master IM left join \
        hims_m_item_uom MIU on IM.hims_d_item_master_id=MIU.item_master_id and IM.record_status='A' and MIU.record_status='A' \
        left join hims_d_pharmacy_uom PH  on  MIU.uom_id=PH.hims_d_pharmacy_uom_id;", function (error, result) {
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

//created by irfan: to get item category
var getItemCategory = function getItemCategory(req, res, next) {
  var selectWhere = {
    hims_d_item_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_category where record_status='A' AND" + where.condition + " order by hims_d_item_category_id desc;", where.values, function (error, result) {
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

//created by irfan: to get item Generic
var getItemGeneric = function getItemGeneric(req, res, next) {
  var selectWhere = {
    hims_d_item_generic_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_generic where record_status='A' AND" + where.condition + " order by hims_d_item_generic_id desc;", where.values, function (error, result) {
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

//created by irfan: to get item Generic
var getItemGroup = function getItemGroup(req, res, next) {
  var selectWhere = {
    hims_d_item_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_group where record_status='A' AND" + where.condition + " order by hims_d_item_group_id desc;", where.values, function (error, result) {
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

//created by irfan: to get get Pharmacy Uom
var getPharmacyUom = function getPharmacyUom(req, res, next) {
  var selectWhere = {
    hims_d_pharmacy_uom_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_pharmacy_uom where record_status='A' AND " + where.condition + " order by hims_d_pharmacy_uom_id desc;", where.values, function (error, result) {
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

//created by irfan: to get Pharmacy Location
var getPharmacyLocation = function getPharmacyLocation(req, res, next) {
  var selectWhere = {
    hims_d_pharmacy_location_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_pharmacy_location where record_status='A' AND" + where.condition + " order by hims_d_pharmacy_location_id desc;", where.values, function (error, result) {
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

//created by irfan: to updateItemCategory
var updateItemCategory = function updateItemCategory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_item_category` SET `category_desc`=?, `category_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_category_id`=? and `record_status`='A';", [input.category_desc, input.category_status, new Date(), input.updated_by, input.record_status, input.hims_d_item_category_id], function (error, result) {
        connection.release();
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

//created by irfan: to updateItemGroup
var updateItemGroup = function updateItemGroup(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_item_group` SET `group_description`=?, `category_id`=?, `group_status`=?,\
        `updated_by`=?, `updated_date`=?, `record_status`=? WHERE  `record_status`='A' and `hims_d_item_group_id`=?;", [input.group_description, input.category_id, input.group_status, input.updated_by, new Date(), input.record_status, input.hims_d_item_group_id], function (error, result) {
        connection.release();
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

//created by irfan: to update ItemGeneric
var updateItemGeneric = function updateItemGeneric(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_item_generic` SET `generic_name`=?, `item_generic_status`=?,\
        `updated_date`=? , `updated_by`=?, `record_status`=? WHERE  record_status='A' and `hims_d_item_generic_id`=?", [input.generic_name, input.item_generic_status, new Date(), input.updated_by, input.record_status, input.hims_d_item_generic_id], function (error, result) {
        connection.release();
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

//created by irfan: to update PharmacyUom
var updatePharmacyUom = function updatePharmacyUom(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_pharmacy_uom` SET `uom_description`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and`hims_d_pharmacy_uom_id`=?;", [input.uom_description, new Date(), input.updated_by, input.record_status, input.hims_d_pharmacy_uom_id], function (error, result) {
        connection.release();
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

//created by irfan: to update Pharmacy Location
var updatePharmacyLocation = function updatePharmacyLocation(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_pharmacy_location` SET `location_description`=?, `location_status`=?, `location_type`=?, `allow_pos`=?,\
         `updated_date`=?,`updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_d_pharmacy_location_id`=?;", [input.location_description, input.location_status, input.location_type, input.allow_pos, new Date(), input.updated_by, input.record_status, input.hims_d_pharmacy_location_id], function (error, result) {
        connection.release();
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

//created by:irfan,to update Item Master And Uom
var updateItemMasterAndUom = function updateItemMasterAndUom(req, res, next) {
  try {
    (0, _logging.debugFunction)("updateItemMasterAndUom ");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var input = (0, _extend2.default)({}, req.body);
    (0, _logging.debugLog)("Input body", input);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "UPDATE `hims_d_item_master` SET `item_code`=?, `item_description`=?, `structure_id`=?,\
          `generic_id`=?, `category_id`=?, `group_id`=?, `form_id`=?, `storage_id`=?, `item_uom_id`=?,\
           `purchase_uom_id`=?, `sales_uom_id`=?, `stocking_uom_id`=?, `item_status`=?, `service_id`=?,\
           addl_information=?, decimals=?, purchase_cost=?, markup_percent=?, sales_price=?,\
            `update_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and\
           `hims_d_item_master_id`=?";
        var inputs = [input.item_code, input.item_description, input.structure_id, input.generic_id, input.category_id, input.group_id, input.form_id, input.storage_id, input.item_uom_id, input.purchase_uom_id, input.sales_uom_id, input.stocking_uom_id, input.item_status, input.service_id, input.addl_information, input.decimals, input.purchase_cost, input.markup_percent, input.sales_price, new Date(), input.updated_by, input.record_status, input.hims_d_item_master_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          if (result != null) {
            new Promise(function (resolve, reject) {
              try {
                if (input.insertItemUomMap.length != 0) {
                  var insurtColumns = ["uom_id", "item_master_id", "stocking_uom", "conversion_factor", "created_by", "updated_by"];

                  connection.query("INSERT INTO hims_m_item_uom(" + insurtColumns.join(",") + ",created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.insertItemUomMap,
                    newFieldToInsert: [new Date(), new Date()],
                    req: req
                  })], function (error, insertUomMapResult) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    return resolve(insertUomMapResult);
                  });
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            }).then(function (results) {
              (0, _logging.debugLog)("inside uom map then");

              if (input.updateUomMapResult.length != 0) {
                var inputParam = (0, _extend2.default)([], req.body.updateUomMapResult);

                var qry = "";

                for (var i = 0; i < req.body.updateUomMapResult.length; i++) {
                  qry += "UPDATE `hims_m_item_uom` SET item_master_id='" + inputParam[i].item_master_id + "', uom_id='" + inputParam[i].uom_id + "', stocking_uom='" + inputParam[i].stocking_uom + "', conversion_factor='" + inputParam[i].conversion_factor + "', record_status='" + inputParam[i].record_status + "', updated_date='" + new Date().toLocaleString() + "',updated_by='" + req.body.updated_by + "' WHERE record_status='A' and hims_m_item_uom_id='" + inputParam[i].hims_m_item_uom_id + "';";
                }

                connection.query(qry, function (error, updateUomMapResult) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(function (error) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _utils.releaseDBConnection)(db, connection);
                    req.records = updateUomMapResult;
                    next();
                  });
                });
              } else {
                connection.commit(function (error) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _utils.releaseDBConnection)(db, connection);
                  req.records = results;
                  next();
                });
              }
            });
          } else {
            connection.commit(function (error) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              (0, _utils.releaseDBConnection)(db, connection);
              req.records = result;
              next();
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to updateItemForm
var updateItemForm = function updateItemForm(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_item_form` SET `form_description`=?, `item_form_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_form_id`=? and `record_status`='A';", [input.form_description, input.item_form_status, new Date(), input.updated_by, input.record_status, input.hims_d_item_form_id], function (error, result) {
        connection.release();
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

//created by Nowshad: to updateItemStorage
var updateItemStorage = function updateItemStorage(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_item_storage` SET `storage_description`=?, `storage_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_storage_id`=? and `record_status`='A';", [input.storage_description, input.storage_status, new Date(), input.updated_by, input.record_status, input.hims_d_item_storage_id], function (error, result) {
        connection.release();
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

//created by Nowshad: to get item category
var getItemForm = function getItemForm(req, res, next) {
  var selectWhere = {
    hims_d_item_form_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_form where record_status='A' AND" + where.condition + " order by hims_d_item_form_id desc;", where.values, function (error, result) {
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

//created by Nowshad: to get item category
var getItemStorage = function getItemStorage(req, res, next) {
  var selectWhere = {
    hims_d_item_storage_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_d_item_storage where record_status='A' AND" + where.condition + " order by hims_d_item_storage_id desc;", where.values, function (error, result) {
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

//created by Nowshad: to add ItemCategory
var addItemForm = function addItemForm(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_item_form` (`form_description`, `item_form_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?)", [input.form_description, "A", new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by Nowshad: to add Item Forms
var addItemStorage = function addItemStorage(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_item_storage` (`storage_description`, `storage_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?)", [input.storage_description, "A", new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//Location Permission
//created by Nowshad: to add Location Permission
var addLocationPermission = function addLocationPermission(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_m_location_permission` (`user_id`, `location_id`, `allow`,`created_date`,`created_by`)\
        VALUE(?,?,?,?,?)", [input.user_id, input.location_id, input.allow, new Date(), input.created_by], function (error, result) {
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

//created by Nowshad: to get Location Permission
var getLocationPermission = function getLocationPermission(req, res, next) {
  var selectWhere = {
    hims_m_location_permission_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * FROM hims_m_location_permission where record_status='A' AND" + where.condition + " order by hims_m_location_permission_id desc;", where.values, function (error, result) {
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

//created by Nowshad: to update Location Permission
var updateLocationPermission = function updateLocationPermission(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      (0, _logging.debugLog)("input: ", input);

      connection.query("UPDATE `hims_m_location_permission` SET `user_id`=?, `location_id`=?,\
        `allow`=?, `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `record_status`='A' and `hims_m_location_permission_id`=?;", [input.user_id, input.location_id, input.allow, new Date(), input.updated_by, input.record_status, input.hims_m_location_permission_id], function (error, result) {
        connection.release();
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
  addItemMaster: addItemMaster,
  addItemCategory: addItemCategory,
  addItemGeneric: addItemGeneric,
  addItemGroup: addItemGroup,
  addPharmacyUom: addPharmacyUom,
  addPharmacyLocation: addPharmacyLocation,
  addItemForm: addItemForm,
  addItemStorage: addItemStorage,
  addLocationPermission: addLocationPermission,

  getItemMaster: getItemMaster,
  getItemCategory: getItemCategory,
  getItemGeneric: getItemGeneric,
  getItemGroup: getItemGroup,
  getPharmacyUom: getPharmacyUom,
  getPharmacyLocation: getPharmacyLocation,
  getItemStorage: getItemStorage,
  getItemForm: getItemForm,
  getLocationPermission: getLocationPermission,

  updateItemCategory: updateItemCategory,
  updateItemGroup: updateItemGroup,
  updateItemGeneric: updateItemGeneric,
  updatePharmacyUom: updatePharmacyUom,
  updatePharmacyLocation: updatePharmacyLocation,
  updateItemForm: updateItemForm,
  updateItemStorage: updateItemStorage,
  getItemMasterAndItemUom: getItemMasterAndItemUom,
  updateItemMasterAndUom: updateItemMasterAndUom,
  updateLocationPermission: updateLocationPermission
};
//# sourceMappingURL=pharmacy.js.map