"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by Nowshad: to add in itemMaster
let addItemMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    debugLog("Body: ", req.body);

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
          "INSERT INTO `hims_d_inventory_item_master` (`item_code`, `item_description`,item_type, `structure_id`,\
          `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `service_id`,\
          addl_information,decimals, purchase_cost, markup_percent, sales_price, \
         `created_date`, `created_by`, `update_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.item_code,
            input.item_description,
            input.item_type,
            input.structure_id,
            input.category_id,
            input.group_id,
            input.item_uom_id,
            input.purchase_uom_id,
            input.sales_uom_id,
            input.stocking_uom_id,
            input.service_id,
            input.addl_information,
            input.decimals,
            input.purchase_cost,
            input.markup_percent,
            input.sales_price,

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
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_m_inventory_item_uom(" +
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
                    releaseDBConnection(db, connection);
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

//created by Nowshad: to add ItemCategory
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
        "INSERT INTO `hims_d_inventory_tem_category` (`category_desc`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.category_desc,
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

//created by Nowshad: to add  item group
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
        "INSERT INTO `hims_d_inventory_item_group` (`group_description`, `category_id`, `created_by`, `created_date`, `updated_by`, `updated_date`) \
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

//created by Nowshad: to add   add Inventory Uom
let addInventoryUom = (req, res, next) => {
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
        "INSERT INTO `hims_d_inventory_uom` (`uom_description`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.uom_description,
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

//created by Nowshad: to add   Inventory Location
let addInventoryLocation = (req, res, next) => {
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
        "INSERT INTO `hims_d_inventory_location` (`location_description`,  `location_type`, `allow_pos`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
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

//created by Nowshad: to get item master
let getItemMaster = (req, res, next) => {
  let selectWhere = {
    hims_d_inventory_item_master_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_inventory_item_master where record_status='A' AND" +
          where.condition,
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

//created by Nowshad: to get ItemMaster And ItemUom
let getItemMasterAndItemUom = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select  MIU.hims_m_inventory_item_uom_id, MIU.item_master_id, MIU.uom_id,PH.uom_description, MIU.stocking_uom, \
        MIU.conversion_factor,IM.hims_d_inventory_item_master_id, IM.item_code, IM.item_description, IM.structure_id, \
        IM.category_id,IM.group_id, IM.item_uom_id, IM.purchase_uom_id, IM.sales_uom_id, IM.stocking_uom_id, \
        IM.item_status, IM.service_id from  hims_d_inventory_item_master IM left join \
        hims_m_inventory_item_uom MIU on IM.hims_d_inventory_item_master_id=MIU.item_master_id and IM.record_status='A' and MIU.record_status='A' \
        left join hims_d_inventory_uom PH  on  MIU.uom_id=PH.hims_d_inventory_uom_id;",
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

//created by Nowshad: to get item category
let getItemCategory = (req, res, next) => {
  let selectWhere = {
    hims_d_inventory_tem_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_inventory_tem_category where record_status='A' AND" +
          where.condition,
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

//created by Nowshad: to get item Group
let getItemGroup = (req, res, next) => {
  let selectWhere = {
    hims_d_inventory_item_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_inventory_item_group where record_status='A' AND" +
          where.condition,
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

//created by Nowshad: to get get Inventory Uom
let getInventoryUom = (req, res, next) => {
  let selectWhere = {
    hims_d_inventory_uom_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_inventory_uom where record_status='A' AND " +
          where.condition,
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

//created by Nowshad: to get Inventory Location
let getInventoryLocation = (req, res, next) => {
  let selectWhere = {
    hims_d_inventory_location_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_inventory_location where record_status='A' AND" +
          where.condition,
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

//created by Nowshad: to updateItemCategory
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
        "UPDATE `hims_d_inventory_tem_category` SET `category_desc`=?, `category_status`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_d_inventory_tem_category_id`=? and `record_status`='A';",
        [
          input.category_desc,
          input.category_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_inventory_tem_category_id
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

//created by Nowshad: to updateItemGroup
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
        "UPDATE `hims_d_inventory_item_group` SET `group_description`=?, `category_id`=?, `group_status`=?,\
        `updated_by`=?, `updated_date`=?, `record_status`=? WHERE  `record_status`='A' and `hims_d_inventory_item_group_id`=?;",
        [
          input.group_description,
          input.category_id,
          input.group_status,
          input.updated_by,
          new Date(),
          input.record_status,
          input.hims_d_inventory_item_group_id
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

//created by Nowshad: to update Inventory Uom
let updateInventoryUom = (req, res, next) => {
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
        "UPDATE `hims_d_inventory_uom` SET `uom_description`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and`hims_d_inventory_uom_id`=?;",
        [
          input.uom_description,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_inventory_uom_id
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

//created by Nowshad: to update Inventory Location
let updateInventoryLocation = (req, res, next) => {
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
        "UPDATE `hims_d_inventory_location` SET `location_description`=?, `location_status`=?, `location_type`=?, `allow_pos`=?,\
         `updated_date`=?,`updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_d_inventory_location_id`=?;",
        [
          input.location_description,
          input.location_status,
          input.location_type,
          input.allow_pos,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_inventory_location_id
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

//created by:Nowshad,to update Item Master And Uom
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
          "UPDATE `hims_d_inventory_item_master` SET `item_code`=?, `item_description`=?, `structure_id`=?,\
          `category_id`=?, `group_id`=?,`item_uom_id`=?,\
           `purchase_uom_id`=?, `sales_uom_id`=?, `stocking_uom_id`=?, `item_status`=?, `service_id`=?,\
            item_type=?, addl_information=?, decimals=?, purchase_cost=?, markup_percent=?, sales_price=?,\
            `update_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and\
           `hims_d_inventory_item_master_id`=?";
        let inputs = [
          input.item_code,
          input.item_description,
          input.structure_id,
          input.category_id,
          input.group_id,
          input.item_uom_id,
          input.purchase_uom_id,
          input.sales_uom_id,
          input.stocking_uom_id,
          input.item_status,
          input.service_id,
          input.item_type,
          input.addl_information,
          input.decimals,
          input.purchase_cost,
          input.markup_percent,
          input.sales_price,

          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_inventory_item_master_id
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
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_m_inventory_item_uom(" +
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
                    "UPDATE `hims_m_inventory_item_uom` SET item_master_id='" +
                    inputParam[i].item_master_id +
                    "', uom_id='" +
                    inputParam[i].uom_id +
                    "', stocking_uom='" +
                    inputParam[i].stocking_uom +
                    "', conversion_factor='" +
                    inputParam[i].conversion_factor +
                    "', record_status='" +
                    inputParam[i].record_status +
                    "', updated_date='" +
                    new Date().toLocaleString() +
                    "',updated_by='" +
                    req.body.updated_by +
                    "' WHERE record_status='A' and hims_m_inventory_item_uom_id='" +
                    inputParam[i].hims_m_inventory_item_uom_id +
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
                    releaseDBConnection(db, connection);
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
                  releaseDBConnection(db, connection);
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
              releaseDBConnection(db, connection);
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

//Location Permission
//created by Nowshad: to add Location Permission
let addLocationPermission = (req, res, next) => {
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
        "INSERT INTO `hims_m_inventory_location_permission` (`user_id`, `location_id`, `allow`,`created_date`,`created_by`)\
        VALUE(?,?,?,?,?)",
        [
          input.user_id,
          input.location_id,
          input.allow,
          new Date(),
          input.created_by
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

//created by Nowshad: to get Location Permission
let getLocationPermission = (req, res, next) => {
  let selectWhere = {
    hims_m_inventory_location_permission_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_m_inventory_location_permission where record_status='A' AND" +
          where.condition,
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

//created by Nowshad: to update Location Permission
let updateLocationPermission = (req, res, next) => {
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
        "UPDATE `hims_m_inventory_location_permission` SET `user_id`=?, `location_id`=?,\
        `allow`=?, `updated_date`=?, `updated_by`=?, `record_status`=?\
        WHERE `hims_m_inventory_location_permission_id`=? and `record_status`='A';",
        [
          input.user_id,
          input.location_id,
          input.allow,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_m_inventory_location_permission_id
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

export default {
  addItemMaster,
  addItemCategory,
  addItemGroup,
  addInventoryUom,
  addInventoryLocation,
  addLocationPermission,

  getItemMaster,
  getItemCategory,
  getItemGroup,
  getInventoryUom,
  getInventoryLocation,
  getLocationPermission,

  updateItemCategory,
  updateItemGroup,
  updateInventoryUom,
  updateInventoryLocation,
  getItemMasterAndItemUom,
  updateItemMasterAndUom,
  updateLocationPermission
};
