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
            "INSERT INTO `hims_d_item_master` (`item_code`, `item_description`, `structure_id`,\
          `generic_id`, `category_id`, `group_id`, `item_uom_id`, `purchase_uom_id`, `sales_uom_id`, `stocking_uom_id`, `service_id`,\
            addl_information, decimals, purchase_cost, markup_percent, sales_price,sfda_id,\
          `created_date`, `created_by`, `update_date`, `updated_by`)\
         VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
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
            input.addl_information,
            input.decimals,
            input.purchase_cost,
            input.markup_percent,
            input.sales_price,
            input.sfda_id,
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
                query: "INSERT INTO hims_m_item_uom(??) VALUES ?",
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
            "INSERT INTO `hims_d_item_category` (`category_desc`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
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

  addItemGeneric: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_item_generic` (`generic_name`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?)",
          values: [
            input.generic_name,
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
            "INSERT INTO `hims_d_item_group` (`group_description`, `category_id`, `created_by`, `created_date`, `updated_by`, `updated_date`) \
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

  addPharmacyUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_pharmacy_uom` (`uom_description`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
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

  addPharmacyLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_pharmacy_location` (`location_description`,  `location_type`, `allow_pos`, `hospital_id`,\
            `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?,?,?,?)",
          values: [
            input.location_description,
            input.location_type,
            input.allow_pos,
            input.hospital_id,
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

  addItemForm: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_item_form` (`form_description`, `item_form_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?,?)",
          values: [
            input.form_description,
            "A",
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

  addItemStorage: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_item_storage` (`storage_description`, `storage_status`, `created_date`, `created_by`, `updated_date`, `updated_by`)\
          VALUE(?,?,?,?,?,?)",
          values: [
            input.storage_description,
            "A",
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

  addLocationPermission: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_m_location_permission` (`user_id`, `location_id`, `allow`,`created_date`,`created_by`)\
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
      if (req.query.hims_d_item_master_id != null) {
        _strQry = "and hims_d_item_master_id=?";
        intValues.push(req.query.hims_d_item_master_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_master where record_status='A'" +
            _strQry +
            " order by hims_d_item_master_id desc;",
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
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_item_master_id != null) {
        _strQry = " where IM.hims_d_item_master_id=?";
        intValues.push(req.query.hims_d_item_master_id);
      }
      _mysql
        .executeQuery({
          query:
            "select  MIU.hims_m_item_uom_id, MIU.item_master_id, MIU.uom_id,PH.uom_description, \
            MIU.stocking_uom, MIU.conversion_factor,IM.hims_d_item_master_id, IM.item_code, IM.item_description,\
             IM.structure_id, IM.generic_id, IM.category_id,IM.group_id, IM.form_id, IM.storage_id, \
             IM.item_uom_id, IM.purchase_uom_id, IM.sales_uom_id, IM.stocking_uom_id, IM.item_status, \
             IM.service_id , IM.purchase_cost,IM.addl_information from  hims_d_item_master IM left join \
             hims_m_item_uom MIU on IM.hims_d_item_master_id=MIU.item_master_id and IM.record_status='A' \
             and MIU.record_status='A' left join hims_d_pharmacy_uom PH  on  \
             MIU.uom_id=PH.hims_d_pharmacy_uom_id " +
            _strQry,
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
      if (req.query.hims_d_item_category_id != null) {
        _strQry = "and hims_d_item_category_id=?";
        intValues.push(req.query.hims_d_item_category_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_category where record_status='A'" +
            _strQry +
            " order by hims_d_item_category_id desc;",
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

  getItemGeneric: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_item_generic_id != null) {
        _strQry = "and hims_d_item_generic_id=?";
        intValues.push(req.query.hims_d_item_generic_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_generic where record_status='A'" +
            _strQry +
            " order by hims_d_item_generic_id desc;",
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
      if (req.query.hims_d_item_group_id != null) {
        _strQry = "and hims_d_item_group_id=?";
        intValues.push(req.query.hims_d_item_group_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_group where record_status='A'" +
            _strQry +
            " order by hims_d_item_group_id desc;",
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

  getPharmacyUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_pharmacy_uom_id != null) {
        _strQry = "and hims_d_pharmacy_uom_id=?";
        intValues.push(req.query.hims_d_pharmacy_uom_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_pharmacy_uom where record_status='A' " +
            _strQry +
            " order by hims_d_pharmacy_uom_id desc;",
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

  getPharmacyLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_pharmacy_location_id != null) {
        _strQry = "and hims_d_pharmacy_location_id=?";
        intValues.push(req.query.hims_d_pharmacy_location_id);
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
            "select * FROM hims_d_pharmacy_location where record_status='A'" +
            _strQry +
            " order by hims_d_pharmacy_location_id desc;",
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

  getItemForm: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_item_form_id != null) {
        _strQry = "and hims_d_item_form_id=?";
        intValues.push(req.query.hims_d_item_form_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_form where record_status='A'" +
            _strQry +
            " order by hims_d_item_form_id desc;",
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
      if (req.query.hims_m_location_permission_id != null) {
        _strQry = "and hims_m_location_permission_id=?";
        intValues.push(req.query.hims_m_location_permission_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_m_location_permission where record_status='A'" +
            _strQry +
            " order by hims_m_location_permission_id desc;",
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

  getItemStorage: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_item_storage_id != null) {
        _strQry = "and hims_d_item_storage_id=?";
        intValues.push(req.query.hims_d_item_storage_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_storage where record_status='A'" +
            _strQry +
            " order by hims_d_item_storage_id desc;",
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
            "UPDATE `hims_d_item_category` SET `category_desc`=?, `category_status`=?,\
                `updated_date`=?, `updated_by`=?, `record_status`=? \
                WHERE `record_status`='A' AND `hims_d_item_category_id`=? ;",
          values: [
            input.category_desc,
            input.category_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_item_category_id
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
            "UPDATE `hims_d_item_group` SET `group_description`=?, `category_id`=?, `group_status`=?,\
                `updated_by`=?, `updated_date`=?, `record_status`=? WHERE  `record_status`='A' and \
                `hims_d_item_group_id`=?;",
          values: [
            input.group_description,
            input.category_id,
            input.group_status,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.record_status,
            input.hims_d_item_group_id
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

  updateItemGeneric: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_item_generic` SET `generic_name`=?, `item_generic_status`=?,\
          `updated_date`=? , `updated_by`=?, `record_status`=? WHERE  record_status='A' and \
          `hims_d_item_generic_id`=?",
          values: [
            input.generic_name,
            input.item_generic_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_item_generic_id
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

  updatePharmacyUom: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_pharmacy_uom` SET `uom_description`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and \
          `hims_d_pharmacy_uom_id`=?;",
          values: [
            input.uom_description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_pharmacy_uom_id
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

  updatePharmacyLocation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_pharmacy_location` SET `location_description`=?, `location_status`=?, `location_type`=?, \
            `allow_pos`=?, `hospital_id`=?, `updated_date`=?,`updated_by`=?, `record_status`=? WHERE `record_status`='A' and \
            `hims_d_pharmacy_location_id`=?;",
          values: [
            input.location_description,
            input.location_status,
            input.location_type,
            input.allow_pos,
            input.hospital_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_pharmacy_location_id
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

  updateItemForm: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_item_form` SET `form_description`=?, `item_form_status`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=?\
          WHERE `hims_d_item_form_id`=? and `record_status`='A';",
          values: [
            input.form_description,
            input.item_form_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_item_form_id
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

  updateItemStorage: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_item_storage` SET `storage_description`=?, `storage_status`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=?\
          WHERE `hims_d_item_storage_id`=? and `record_status`='A';",
          values: [
            input.storage_description,
            input.storage_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_item_storage_id
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
            "UPDATE `hims_m_location_permission` SET `user_id`=?, `location_id`=?,\
          `allow`=?, `updated_date`=?, `updated_by`=?, `record_status`=?\
          WHERE `record_status`='A' and `hims_m_location_permission_id`=?;",
          values: [
            input.user_id,
            input.location_id,
            input.allow,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_m_location_permission_id
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
            "UPDATE `hims_d_item_master` SET `item_code`=?, `item_description`=?, `structure_id`=?,\
          `generic_id`=?, `category_id`=?, `group_id`=?, `form_id`=?, `storage_id`=?, `item_uom_id`=?,\
           `purchase_uom_id`=?, `sales_uom_id`=?, `stocking_uom_id`=?, `item_status`=?, `service_id`=?,\
           addl_information=?, decimals=?, purchase_cost=?, markup_percent=?, sales_price=?,sfda_id=?,\
            `update_date`=?, `updated_by`=?, `record_status`=? WHERE record_status='A' and\
           `hims_d_item_master_id`=?",
          values: [
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
            input.addl_information,
            input.decimals,
            input.purchase_cost,
            input.markup_percent,
            input.sales_price,
            input.sfda_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.record_status,
            input.hims_d_item_master_id
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
                      query: "INSERT INTO hims_m_item_uom(??) VALUES ?",
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
                      "UPDATE `hims_m_item_uom` SET `item_master_id`=?,\
                      `uom_id`=?,`stocking_uom`=?,`conversion_factor`=?,`record_status`=?,\
                      updated_date=?,updated_by=? where record_status='A' and hims_m_item_uom_id=?;",
                      [
                        inputParam[i].item_master_id,
                        inputParam[i].uom_id,
                        inputParam[i].stocking_uom,
                        inputParam[i].conversion_factor,
                        inputParam[i].record_status,
                        moment().format("YYYY-MM-DD HH:mm"),
                        req.userIdentity.algaeh_d_app_user_id,
                        inputParam[i].hims_m_item_uom_id
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

  getItemMasterWithSalesPrice: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strQry = "";
      let intValues = [];
      if (req.query.hims_d_item_master_id != null) {
        _strQry = "and hims_d_item_master_id=?";
        intValues.push(req.query.hims_d_item_master_id);
      }
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_item_master IM left join hims_d_services S on \
            IM.service_id=S.hims_d_services_id where IM.record_status='A' " +
            _strQry +
            " order by hims_d_item_master_id desc;",
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
  }
};
