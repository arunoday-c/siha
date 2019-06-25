import algaehMysql from "algaeh-mysql";
module.exports = {
  //Section
  selectSection: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_lab_section_id != null) {
        _strAppend += "and hims_d_lab_section_id=?";
        intValue.push(req.query.hims_d_lab_section_id);
      }

      if (req.query.section_status != null) {
        _strAppend += "and section_status=?";
        intValue.push(req.query.section_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_lab_section_id`, `description` as SecDescription, `section_status`, `created_date`, \
            `created_by`, `updated_date`, `updated_by`, `record_status`  FROM `hims_d_lab_section` \
            WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_lab_section_id desc",
          values: intValue,
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
  insertSection: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_lab_section` (`description`, \
          `created_by` ,`created_date`) \
          VALUES ( ?, ?, ?)",
          values: [
            inputParam.description,
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
  updateSection: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_lab_section` \
          SET `description`=?, `updated_by`=?, `updated_date`=?,section_status=? \
          WHERE `record_status`='A' and `hims_d_lab_section_id`=?",
          values: [
            inputParam.description,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.section_status,
            inputParam.hims_d_lab_section_id
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

  deleteSection: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_lab_section SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_lab_section_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_lab_section_id
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

  //Container
  selectContainer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_lab_container_id != null) {
        _strAppend += "and hims_d_lab_container_id=?";
        intValue.push(req.query.hims_d_lab_container_id);
      }

      if (req.query.container_status != null) {
        _strAppend += "and container_status=?";
        intValue.push(req.query.container_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT *, description as ConDescription FROM `hims_d_lab_container` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_lab_container_id desc",
          values: intValue,
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
  insertContainer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_lab_container` (`description`, `container_id`, \
          `created_by` ,`created_date`) \
       VALUES ( ?, ?, ?, ?)",
          values: [
            inputParam.description,
            inputParam.container_id,
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
  updateContainer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_lab_container` \
          SET `description`=?, `container_id`=?,`updated_by`=?, `updated_date`=?,container_status=? \
          WHERE `record_status`='A' and `hims_d_lab_container_id`=?",
          values: [
            inputParam.description,
            inputParam.container_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.container_status,
            inputParam.hims_d_lab_container_id
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

  deleteContainer: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_lab_container SET  record_status='I', \
             updated_by=?,updated_date=? WHERE hims_d_lab_container_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_lab_container_id
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

  //Specimen
  selectSpecimen: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_lab_specimen_id != null) {
        _strAppend += "and hims_d_lab_specimen_id=?";
        intValue.push(req.query.hims_d_lab_specimen_id);
      }

      if (req.query.specimen_status != null) {
        _strAppend += "and specimen_status=?";
        intValue.push(req.query.specimen_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT *, description as SpeDescription FROM `hims_d_lab_specimen` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_lab_specimen_id desc",
          values: intValue,
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
  insertSpecimen: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_lab_specimen` (`description`, `storage_type`,\
          `created_by` ,`created_date`) \
       VALUES ( ?, ?, ?, ?)",
          values: [
            inputParam.description,
            inputParam.storage_type,
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
  updateSpecimen: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_lab_specimen` \
          SET `description`=?, `storage_type` = ?,`updated_by`=?, `updated_date`=?,`specimen_status`=? \
          WHERE `record_status`='A' and `hims_d_lab_specimen_id`=?",
          values: [
            inputParam.description,
            inputParam.storage_type,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.specimen_status,
            inputParam.hims_d_lab_specimen_id
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

  deleteSpecimen: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_lab_specimen SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_lab_specimen_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_lab_specimen_id
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

  //Analytes
  selectAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_lab_analytes_id != null) {
        _strAppend += "and hims_d_lab_analytes_id=?";
        intValue.push(req.query.hims_d_lab_analytes_id);
      }

      if (req.query.analyte_status != null) {
        _strAppend += "and analyte_status=?";
        intValue.push(req.query.analyte_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT *, description as AnaDescription FROM `hims_d_lab_analytes` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_lab_analytes_id desc",
          values: intValue,
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
  insertAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_lab_analytes` (`description`, `analyte_type`,`result_unit`,\
              `created_by` ,`created_date`) \
              VALUES ( ?, ?, ?, ?, ?)",
          values: [
            inputParam.description,
            inputParam.analyte_type,
            inputParam.result_unit,
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
  updateAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_lab_analytes` \
          SET `description`=?, `analyte_type` = ?, `result_unit` = ?,`updated_by`=?, `updated_date`=?,`analyte_status`=? \
          WHERE `record_status`='A' and `hims_d_lab_analytes_id`=?",
          values: [
            inputParam.description,
            inputParam.analyte_type,
            inputParam.result_unit,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.analyte_status,
            inputParam.hims_d_lab_analytes_id
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

  deleteAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_lab_analytes SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_lab_analytes_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_lab_analytes_id
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

  //TestCategory
  selectTestCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_test_category_id != null) {
        _strAppend += "and hims_d_test_category_id=?";
        intValue.push(req.query.hims_d_test_category_id);
      }

      if (req.query.category_status != null) {
        _strAppend += "and category_status=?";
        intValue.push(req.query.category_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT * FROM `hims_d_test_category` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_test_category_id desc",
          values: intValue,
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
  insertTestCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_test_category` (`category_name`,\
            `created_by` ,`created_date`) \
            VALUES ( ?, ?, ?)",
          values: [
            inputParam.category_name,
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
  updateTestCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_test_category` \
            SET `category_name`=?, `updated_by`=?, `updated_date`=?,`category_status`=? \
            WHERE `record_status`='A' and `hims_d_test_category_id`=?",
          values: [
            inputParam.category_name,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.category_status,
            inputParam.hims_d_test_category_id
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

  deleteTestCategory: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_test_category SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_test_category_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_test_category_id
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
  }
};
