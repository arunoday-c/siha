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
import moment from "moment";

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
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        connection.query(
          "INSERT INTO `hims_d_item_master` (`item_code`, `item_description`, `structure_id`,\
         `generic_id`, `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `service_id`,\
         `created_date`, `created_by`, `update_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            input.service_id,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            debugLog(" item master id :", result.insertId);
            // req.records = spResult;
            // next();

            if (result.insertId != null) {
              const insurtColumns = [
                "uom_id",
                "stocking_uom",
                "conversion_factor",
                "uom_status",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_m_item_uom(" +
                  insurtColumns.join(",") +
                  ",item_master_id,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.detail_item_uom,
                    newFieldToInsert: [result.insertId, new Date(), new Date()],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    req.records = detailResult;
                    next();
                  });
                }
              );
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ItemCategory
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

//created by irfan: to add  item group
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

//created by irfan: to add   add Pharmacy Uom
let addPharmacyUom = (req, res, next) => {
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
        "INSERT INTO `hims_d_pharmacy_uom` (`uom_description`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.uom_description,
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

//created by irfan: to add   Pharmacy Location
let addPharmacyLocation = (req, res, next) => {
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
        "INSERT INTO `hims_d_pharmacy_location` (`location_description`,  `location_type`, `allow_pos`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?)",
        [
          input.location_description,
          input.location_type,
          input.allow_pos,
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

//created by irfan: to get item master
let getItemMaster = (req, res, next) => {
  let selectWhere = {
    hims_d_item_master_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_master where record_status='A' AND" +
          where.condition,
        where.values,
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
//created by irfan: to get ItemMaster And ItemUom
let getItemMasterAndItemUom = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select  MIU.hims_m_item_uom_id, MIU.item_master_id, MIU.uom_id,PH.uom_description, MIU.stocking_uom, MIU.conversion_factor, MIU.uom_status,\
        IM.hims_d_item_master_id, IM.item_code, IM.item_description, IM.structure_id, IM.generic_id, IM.category_id,\
        IM.group_id, IM.form_id, IM.storage_id, IM.item_uom_id, IM.purchase_uom_id, IM.sales_uom_id, IM.stocking_uom_id, IM.item_status, IM.service_id\
        from hims_d_item_master IM,hims_m_item_uom MIU,hims_d_pharmacy_uom PH  where IM.hims_d_item_master_id=MIU.item_master_id  and\
         MIU.uom_id=PH.hims_d_pharmacy_uom_id and MIU.record_status='A'and IM.record_status='A'",
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

//created by irfan: to get item category
let getItemCategory = (req, res, next) => {
  let selectWhere = {
    hims_d_item_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_category where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by irfan: to get item Generic
let getItemGeneric = (req, res, next) => {
  let selectWhere = {
    hims_d_item_generic_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_generic where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by irfan: to get item Generic
let getItemGroup = (req, res, next) => {
  let selectWhere = {
    hims_d_item_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_group where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by irfan: to get get Pharmacy Uom
let getPharmacyUom = (req, res, next) => {
  let selectWhere = {
    hims_d_pharmacy_uom_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_pharmacy_uom where record_status='A' AND " +
          where.condition,
        where.values,
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

//created by irfan: to get Pharmacy Location
let getPharmacyLocation = (req, res, next) => {
  let selectWhere = {
    hims_d_pharmacy_location_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_pharmacy_location where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by irfan: to updateItemCategory
let updateItemCategory = (req, res, next) => {
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
        "UPDATE `hims_d_item_category` SET `category_desc`=?, `category_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_category_id`=? and `record_status`='A';",
        [
          input.category_desc,
          input.category_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_item_category_id
        ],
        (error, result) => {
          connection.release();
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

//created by irfan: to updateItemGroup
let updateItemGroup = (req, res, next) => {
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
        "UPDATE `hims_d_item_group` SET `group_description`=?, `category_id`=?, `group_status`=?,\
        `updated_by`=?, `updated_date`=?, `record_status`=? WHERE  `record_status`='A' and `hims_d_item_group_id`=?;",
        [
          input.group_description,
          input.category_id,
          input.group_status,
          input.updated_by,
          new Date(),
          input.record_status,
          input.hims_d_item_group_id
        ],
        (error, result) => {
          connection.release();
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

//created by irfan: to update ItemGeneric
let updateItemGeneric = (req, res, next) => {
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
        "UPDATE `hims_d_item_generic` SET `generic_name`=?, `item_generic_status`=?,\
        `updated_date`=? , `updated_by`=?, `record_status`=? WHERE  record_status='A' and `hims_d_item_generic_id`=?",
        [
          input.generic_name,
          input.item_generic_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_item_generic_id
        ],
        (error, result) => {
          connection.release();
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

//created by irfan: to update PharmacyUom
let updatePharmacyUom = (req, res, next) => {
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
        "UPDATE `hims_d_pharmacy_uom` SET `uom_description`=?, `uom_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and`hims_d_pharmacy_uom_id`=?;",
        [
          input.uom_description,
          input.uom_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_pharmacy_uom_id
        ],
        (error, result) => {
          connection.release();
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

//created by irfan: to update Pharmacy Location
let updatePharmacyLocation = (req, res, next) => {
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
        "UPDATE `hims_d_pharmacy_location` SET `location_description`=?, `location_status`=?, `location_type`=?, `allow_pos`=?,\
         `updated_date`=?,`updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_d_pharmacy_location_id`=?;",
        [
          input.location_description,
          input.location_status,
          input.location_type,
          input.allow_pos,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_pharmacy_location_id
        ],
        (error, result) => {
          connection.release();
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

//created by:irfan,to update Item Master And Uom
let updateItemMasterAndUom = (req, res, next) => {
  try {
    debugFunction("updateItemMasterAndUom ");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    debugLog("Input body", input);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        let queryBuilder =
          "UPDATE `hims_d_item_master` SET `item_code`=?, `item_description`=?, `structure_id`=?,\
          `generic_id`=?, `category_id`=?, `group_id`=?, `form_id`=?, `storage_id`=?, `item_uom_id`=?,\
           `purchase_uom_id`=?, `sales_uom_id`=?, `stocking_uom_id`=?, `item_status`=?, `service_id`=?,\
            `update_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and\
           `hims_d_item_master_id`=?";
        let inputs = [
          input.item_code,
          input.item_description,
          input.structure_id,
          input.generic_id,
          input.category_id,
          input.group_id,
          input.form_id,
          input.storage_id,
          input.item_uom_id,
          input.purchase_uom_id,
          input.sales_uom_id,
          input.stocking_uom_id,
          input.item_status,
          input.service_id,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_item_master_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (result != null) {
            new Promise((resolve, reject) => {
              try {
                if (input.insertItemUomMap.length != 0) {
                  const insurtColumns = [
                    "uom_id",
                    "item_master_id",
                    "stocking_uom",
                    "conversion_factor",
                    "uom_status",
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_m_item_uom(" +
                      insurtColumns.join(",") +
                      ",created_date,updated_date) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtColumns,
                        arrayObj: req.body.insertItemUomMap,
                        newFieldToInsert: [new Date(), new Date()],
                        req: req
                      })
                    ],
                    (error, insertUomMapResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      return resolve(insertUomMapResult);
                    }
                  );
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            }).then(results => {
              debugLog("inside uom map then");

              if (input.updateUomMapResult.length != 0) {
                let inputParam = extend([], req.body.updateUomMapResult);

                let qry = "";

                for (let i = 0; i < req.body.updateUomMapResult.length; i++) {
                  qry +=
                    "UPDATE `hims_m_item_uom` SET item_master_id='" +
                    inputParam[i].item_master_id +
                    "', uom_id='" +
                    inputParam[i].uom_id +
                    "', stocking_uom='" +
                    inputParam[i].stocking_uom +
                    "', conversion_factor='" +
                    inputParam[i].conversion_factor +
                    "', uom_status='" +
                    inputParam[i].uom_status +
                    "', record_status='" +
                    inputParam[i].record_status +
                    "', updated_date='" +
                    new Date().toLocaleString() +
                    "',updated_by=\
'" +
                    req.body.updated_by +
                    "' WHERE record_status='A' and hims_m_item_uom_id='" +
                    inputParam[i].hims_m_item_uom_id +
                    "';";
                }

                connection.query(qry, (error, updateUomMapResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    req.records = updateUomMapResult;
                    next();
                  });
                });
              } else {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  req.records = results;
                  next();
                });
              }
            });
          } else {
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
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
let updateItemForm = (req, res, next) => {
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
        "UPDATE `hims_d_item_form` SET `form_description`=?, `item_form_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_form_id`=? and `record_status`='A';",
        [
          input.form_description,
          input.item_form_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_item_form_id
        ],
        (error, result) => {
          connection.release();
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

//created by Nowshad: to updateItemStorage
let updateItemStorage = (req, res, next) => {
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
        "UPDATE `hims_d_item_storage` SET `storage_description`=?, `storage_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_item_storage_id`=? and `record_status`='A';",
        [
          input.storage_description,
          input.storage_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_item_storage_id
        ],
        (error, result) => {
          connection.release();
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

//created by Nowshad: to get item category
let getItemForm = (req, res, next) => {
  let selectWhere = {
    hims_d_item_form_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_form where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by Nowshad: to get item category
let getItemStorage = (req, res, next) => {
  let selectWhere = {
    hims_d_item_storage_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_item_storage where record_status='A' AND" +
          where.condition,
        where.values,
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

//created by Nowshad: to add ItemCategory
let addItemForm = (req, res, next) => {
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
        "INSERT INTO `hims_d_item_form` (`form_description`, `item_form_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?)",
        [
          input.form_description,
          "A",
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

//created by Nowshad: to add Item Forms
let addItemStorage = (req, res, next) => {
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
        "INSERT INTO `hims_d_item_storage` (`storage_description`, `storage_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?)",
        [
          input.storage_description,
          "A",
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

module.exports = {
  addItemMaster,
  addItemCategory,
  addItemGeneric,
  addItemGroup,
  addPharmacyUom,
  addPharmacyLocation,
  addItemForm,
  addItemStorage,

  getItemMaster,
  getItemCategory,
  getItemGeneric,
  getItemGroup,
  getPharmacyUom,
  getPharmacyLocation,
  getItemStorage,
  getItemForm,

  updateItemCategory,
  updateItemGroup,
  updateItemGeneric,
  updatePharmacyUom,
  updatePharmacyLocation,
  updateItemForm,
  updateItemStorage,
  getItemMasterAndItemUom,
  updateItemMasterAndUom
};
