import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  addItemMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO `hims_d_inventory_item_master` (`item_code`, `item_description`,item_type, `structure_id`,\
          `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `service_id`,\
          addl_information,decimals, purchase_cost, markup_percent, sales_price, \
         `created_date`, `created_by`, `update_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
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
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.insertId != null) {
            const IncludeValues = [
              "uom_id",
              "stocking_uom",
              "conversion_factor"
            ];
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_m_inventory_item_uom(??) VALUES ?",
                values: input.detail_item_uom,
                includeValues: IncludeValues,
                extraValues: {
                  item_master_id: headerResult.insertId,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date()
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = detailResult;
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  addItemCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_inventory_tem_category` (`category_desc`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?)",
          values: [
            input.category_desc,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addItemGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_inventory_item_group` (`group_description`, `category_id`, `created_by`, `created_date`, `updated_by`, `updated_date`) \
          VALUE(?,?,?,?,?,?)",
          values: [
            input.group_description,
            input.category_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addInventoryUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_inventory_uom` (`uom_description`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?)",
          values: [
            input.uom_description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addInventoryLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_inventory_location` (`location_description`,  `location_type`, \
              `hospital_id`, `allow_pos`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?,?,?,?)",
          values: [
            input.location_description,
            input.location_type,
            input.hospital_id,
            input.allow_pos,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          req.body.inventory_location_id = result.insertId;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_m_inventory_location_permission` (`user_id`, `location_id`, `allow`,`created_date`,`created_by`)\
          VALUE(?,?,?,?,?)",
          values: [
            input.user_id,
            input.location_id,
            input.allow,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getItemMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_inventory_item_master_id != null) {
        _strQry = "and hims_d_inventory_item_master_id=?";
        intValues.push(req.query.hims_d_inventory_item_master_id);
      }

      if (req.query.item_type != null) {
        _strQry = "and item_type=?";
        intValues.push(req.query.item_type);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_inventory_item_master where record_status='A'" +
            _strQry +
            " order by hims_d_inventory_item_master_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getItemMasterAndItemUom: (req, res, next) => {
    const _mysql = new algaehMysql();

    let _strQry = "";
    let intValues = [];
    if (req.query.hims_d_inventory_item_master_id != null) {
      _strQry = "where IM.hims_d_inventory_item_master_id=?";
      intValues.push(req.query.hims_d_inventory_item_master_id);
    }

    try {
      _mysql
        .executeQuery({
          query:
            "select  MIU.hims_m_inventory_item_uom_id, MIU.item_master_id, MIU.uom_id,PH.uom_description, MIU.stocking_uom, \
          MIU.conversion_factor,IM.hims_d_inventory_item_master_id, IM.item_code, IM.item_description, IM.structure_id, \
          IM.category_id,IM.group_id, IM.item_uom_id, IM.purchase_uom_id, IM.sales_uom_id, IM.stocking_uom_id, \
          IM.item_status, IM.service_id from  hims_d_inventory_item_master IM left join \
          hims_m_inventory_item_uom MIU on IM.hims_d_inventory_item_master_id=MIU.item_master_id and IM.record_status='A' and MIU.record_status='A' \
          left join hims_d_inventory_uom PH  on  MIU.uom_id=PH.hims_d_inventory_uom_id "+ _strQry,
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getItemCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_inventory_tem_category_id != null) {
        _strQry = "and hims_d_inventory_tem_category_id=?";
        intValues.push(req.query.hims_d_inventory_tem_category_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_inventory_tem_category where record_status='A'" +
            _strQry +
            " order by hims_d_inventory_tem_category_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getItemGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_inventory_item_group_id != null) {
        _strQry = "and hims_d_inventory_item_group_id=?";
        intValues.push(req.query.hims_d_inventory_item_group_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_inventory_item_group where record_status='A'" +
            _strQry +
            " order by hims_d_inventory_item_group_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getInventoryUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_inventory_uom_id != null) {
        _strQry = "and hims_d_inventory_uom_id=?";
        intValues.push(req.query.hims_d_inventory_uom_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_inventory_uom where record_status='A' " +
            _strQry +
            " order by hims_d_inventory_uom_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getInventoryLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      const utilities = new algaehUtilities();
      utilities.logger().log("req.query: ", req.query.location_status);

      if (req.query.hims_d_inventory_location_id != null) {
        _strQry += "and hims_d_inventory_location_id=?";
        intValues.push(req.query.hims_d_inventory_location_id);
      }

      if (req.query.location_status != null) {
        _strQry += "and location_status=?";
        intValues.push(req.query.location_status);
      }
      if (req.query.hospital_id != null) {
        _strQry += "and hospital_id=?";
        intValues.push(req.query.hospital_id);
      }

      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_inventory_location where record_status='A'" +
            _strQry +
            " order by hims_d_inventory_location_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_m_inventory_location_permission_id != null) {
        _strQry = "and hims_m_inventory_location_permission_id=?";
        intValues.push(req.query.hims_m_inventory_location_permission_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_m_inventory_location_permission where record_status='A'" +
            _strQry +
            " order by hims_m_inventory_location_permission_id desc;",
          values: intValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateItemCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_inventory_tem_category` SET `category_desc`=?, `category_status`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=?\
          WHERE `hims_d_inventory_tem_category_id`=? and `record_status`='A';",
          values: [
            input.category_desc,
            input.category_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_inventory_tem_category_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateItemGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_inventory_item_group` SET `group_description`=?, `category_id`=?, `group_status`=?,\
                `updated_by`=?, `updated_date`=?, `record_status`=? WHERE  `record_status`='A' and \
                `hims_d_inventory_item_group_id`=?;",
          values: [
            input.group_description,
            input.category_id,
            input.group_status,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.record_status,
            input.hims_d_inventory_item_group_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateInventoryUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_inventory_uom` SET `uom_description`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and`hims_d_inventory_uom_id`=?;",
          values: [
            input.uom_description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_inventory_uom_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateInventoryLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_inventory_location` SET `location_description`=?, `location_status`=?, \
            `location_type`=?, `hospital_id`=?, `allow_pos`=?, `updated_date`=?,`updated_by`=?, `record_status`=? \
            WHERE `record_status`='A' and `hims_d_inventory_location_id`=?;",
          values: [
            input.location_description,
            input.location_status,
            input.location_type,
            input.hospital_id,
            input.allow_pos,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_inventory_location_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_m_inventory_location_permission` SET `user_id`=?, `location_id`=?,\
          `allow`=?, `updated_date`=?, `updated_by`=?, `record_status`=?\
          WHERE `hims_m_inventory_location_permission_id`=? and `record_status`='A';",
          values: [
            input.user_id,
            input.location_id,
            input.allow,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_m_inventory_location_permission_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateItemMasterAndUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_inventory_item_master` SET `item_code`=?, `item_description`=?, `structure_id`=?,\
          `category_id`=?, `group_id`=?,`item_uom_id`=?,\
           `purchase_uom_id`=?, `sales_uom_id`=?, `stocking_uom_id`=?, `item_status`=?, `service_id`=?,\
            item_type=?, addl_information=?, decimals=?, purchase_cost=?, markup_percent=?, sales_price=?,\
            `update_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and\
           `hims_d_inventory_item_master_id`=?",
          values: [
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
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_inventory_item_master_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            new Promise((resolve, reject) => {
              try {
                if (input.insertItemUomMap.length != 0) {
                  const IncludeValues = [
                    "uom_id",
                    "item_master_id",
                    "stocking_uom",
                    "conversion_factor"
                  ];

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_m_inventory_item_uom(??) VALUES ?",
                      values: input.insertItemUomMap,
                      includeValues: IncludeValues,
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        created_date: new Date(),
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_date: new Date()
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(insertUomMapResult => {
                      return resolve(insertUomMapResult);
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            })
              .then(results => {
                if (input.updateUomMapResult.length != 0) {
                  let qry = "";
                  let inputParam = req.body.updateUomMapResult;
                  for (let i = 0; i < req.body.updateUomMapResult.length; i++) {
                    qry += mysql.format(
                      "UPDATE `hims_m_inventory_item_uom` SET `item_master_id`=?,\
                      `uom_id`=?,`stocking_uom`=?,`conversion_factor`=?,`record_status`=?,\
                      updated_date=?,updated_by=? where record_status='A' and hims_m_inventory_item_uom_id=?;",
                      [
                        inputParam[i].item_master_id,
                        inputParam[i].uom_id,
                        inputParam[i].stocking_uom,
                        inputParam[i].conversion_factor,
                        inputParam[i].record_status,
                        moment().format("YYYY-MM-DD HH:mm"),
                        req.userIdentity.algaeh_d_app_user_id,
                        inputParam[i].hims_m_inventory_item_uom_id
                      ]
                    );
                  }

                  _mysql
                    .executeQuery({
                      query: qry,
                      printQuery: true
                    })
                    .then(updateUomMapResult => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = updateUomMapResult;
                        next();
                      });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = results;
                    next();
                  });
                }
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = headerResult;
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  addProcedureItems: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;

      const IncludeValues = [
        "patient_id",
        "episode_id",
        "procedure_id",
        "location_id",
        "location_type",
        "item_id",
        "item_category_id",
        "item_group_id",
        "uom_id",
        "batchno",
        "expirydt",
        "barcode",
        "grn_no",
        "unit_cost",
        "quantity",
        "qtyhand",
        "extended_cost"
      ];

      _mysql
        .executeQuery({
          query: "INSERT INTO hims_f_procedure_items(??) VALUES ?",
          values: input.Procedure_items,
          includeValues: IncludeValues,
          extraValues: {
            created_by: req.userIdentity.algaeh_d_app_user_id,
            created_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date()
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
