import algaehMysql from "algaeh-mysql";
export default {
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
            "SELECT `hims_d_lab_section_id`, `description` as SecDescription, `section_status`, \
            `test_section`, `created_date`, \
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
            "INSERT INTO `hims_d_lab_section` (`description`, `test_section`,\
          `created_by` ,`created_date`) \
          VALUES ( ?, ?, ?, ?)",
          values: [
            inputParam.description,
            inputParam.test_section,
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
            "UPDATE `hims_d_lab_section` SET `description`=?, `test_section`=?,\
            `updated_by`=?, `updated_date`=?,section_status=? \
          WHERE `record_status`='A' and `hims_d_lab_section_id`=?",
          values: [
            inputParam.description,
            inputParam.test_section,
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
            "SELECT `hims_d_lab_specimen_id`, `description` as SpeDescription, `specimen_status`, `urine_specimen`,\
            `storage_type`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`  \
            FROM `hims_d_lab_specimen` WHERE `record_status`='A'" +
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
            "INSERT INTO `hims_d_lab_specimen` (`description`, `storage_type`,`urine_specimen`,\
          `created_by` ,`created_date`) \
       VALUES ( ?, ?, ?, ?, ?)",
          values: [
            inputParam.description,
            inputParam.storage_type,
            inputParam.urine_specimen,
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
          SET `description`=?, `storage_type` = ?, `urine_specimen`=?,\
          `updated_by`=?, `updated_date`=?,`specimen_status`=? \
          WHERE `record_status`='A' and `hims_d_lab_specimen_id`=?",
          values: [
            inputParam.description,
            inputParam.storage_type,
            inputParam.urine_specimen,
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
      if (req.query.investigation_type != null) {
        _strAppend += "and investigation_type=?";
        intValue.push(req.query.investigation_type);
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
            "INSERT INTO `hims_d_test_category` (`category_name`, `test_section`, `investigation_type`,\
            `created_by` ,`created_date`) \
            VALUES ( ?, ?, ?, ?, ?)",
          values: [
            inputParam.category_name,
            inputParam.test_section,
            inputParam.investigation_type,
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
            SET `category_name`=?,  `test_section`=?, `investigation_type`=?,\
            `updated_by`=?, `updated_date`=?,`category_status`=? \
            WHERE `record_status`='A' and `hims_d_test_category_id`=?",
          values: [
            inputParam.category_name,
            inputParam.test_section,
            inputParam.investigation_type,
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
  },

  //Antibiotic Master
  selectAntibiotic: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_antibiotic_id != null) {
        _strAppend += "and hims_d_antibiotic_id=?";
        intValue.push(req.query.hims_d_antibiotic_id);
      }

      if (req.query.antibiotic_status != null) {
        _strAppend += "and antibiotic_status=?";
        intValue.push(req.query.antibiotic_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT * FROM `hims_d_antibiotic` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_antibiotic_id desc",
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
  insertAntibiotic: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_antibiotic` (`antibiotic_code`,`antibiotic_name`,\
            `created_by` ,`created_date`) \
            VALUES ( ?, ?, ?, ?)",
          values: [
            inputParam.antibiotic_code,
            inputParam.antibiotic_name,
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
  updateAntibiotic: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_antibiotic` \
            SET `antibiotic_code`=?, `antibiotic_name`=?, `updated_by`=?, `updated_date`=?,`antibiotic_status`=? \
            WHERE `record_status`='A' and `hims_d_antibiotic_id`=?",
          values: [
            inputParam.antibiotic_code,
            inputParam.antibiotic_name,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.antibiotic_status,
            inputParam.hims_d_antibiotic_id
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

  deleteAntibiotic: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_antibiotic SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_antibiotic_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_antibiotic_id
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

  //Micro Group Master
  selectMicroGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_d_micro_group_id != null) {
        _strAppend += "and hims_d_micro_group_id=?";
        intValue.push(req.query.hims_d_micro_group_id);
      }

      if (req.query.group_status != null) {
        _strAppend += "and group_status=?";
        intValue.push(req.query.group_status);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT * FROM `hims_d_micro_group` WHERE `record_status`='A' " +
            _strAppend +
            "order by hims_d_micro_group_id desc",
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
  insertMicroGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_micro_group` (`group_code`,`group_name`, `arabic_group_name`, `group_type`,\
            `created_by` ,`created_date`) VALUES ( ?, ?, ?, ?, ?, ?)",
          values: [
            inputParam.group_code,
            inputParam.group_name,
            inputParam.arabic_group_name,
            inputParam.group_type,
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
  updateMicroGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_micro_group` SET `group_code`=?, `group_name`=?, `arabic_group_name` = ?, \
            `group_type`=?, `updated_by`=?, `updated_date`=?, `group_status`=? \
            WHERE `record_status`='A' and `hims_d_micro_group_id`=?",
          values: [
            inputParam.group_code,
            inputParam.group_name,
            inputParam.arabic_group_name,
            inputParam.group_type,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.group_status,
            inputParam.hims_d_micro_group_id
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

  //Group Antibiotic Mapping
  selectGroupAntiMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_m_group_antibiotic_id != null) {
        _strAppend += "and hims_m_group_antibiotic_id=?";
        intValue.push(req.query.hims_m_group_antibiotic_id);
      }

      if (req.query.micro_group_id != null) {
        _strAppend += "and micro_group_id=?";
        intValue.push(req.query.micro_group_id);
      }

      if (req.query.urine_specimen == "Y") {
        _strAppend += " order by group_types='U' desc , group_types asc";
      } else {
        _strAppend += " order by group_types";
      }

      _mysql
        .executeQuery({
          query:
            "SELECT GA.*, A.antibiotic_name FROM `hims_m_group_antibiotic` GA \
              inner join hims_d_antibiotic A on A.hims_d_antibiotic_id = GA.antibiotic_id  \
              WHERE GA.`record_status`='A' " +
            _strAppend,
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
  insertGroupAntiMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_m_group_antibiotic` (`micro_group_id`,`antibiotic_id`,`group_types`, \
            `created_by` ,`created_date`) VALUES (?, ?, ?, ?, ?)",
          values: [
            inputParam.micro_group_id,
            inputParam.antibiotic_id,
            inputParam.group_types,
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
  updateGroupAntiMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_m_group_antibiotic` SET `micro_group_id`=?, `antibiotic_id`=?, `group_types`=?, \
            `map_status` = ?, `updated_by`=?, `updated_date`=?\
            WHERE `record_status`='A' and `hims_m_group_antibiotic_id`=?",
          values: [
            inputParam.micro_group_id,
            inputParam.antibiotic_id,
            inputParam.group_types,
            inputParam.map_status,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_m_group_antibiotic_id
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

  selectMachineAnalytesMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _strAppend = "";
      let intValue = [];

      if (req.query.hims_m_machine_analytes_header_id != null) {
        _strAppend += "and H.hims_m_machine_analytes_header_id=?";
        intValue.push(req.query.hims_m_machine_analytes_header_id);
      }

      if (req.query.machine_analyte_code != null) {
        _strAppend += "and D.machine_analyte_code=?";
        intValue.push(req.query.machine_analyte_code);
      }

      if (req.query.machine_id != null) {
        _strAppend += "and D.machine_id=?";
        intValue.push(req.query.machine_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT H.*, D.*, LC.machine_name, HO.hospital_name, LA.description as analyte_name from hims_m_machine_analytes_header H \
            inner join hims_m_machine_analytes_detail D on H.hims_m_machine_analytes_header_id = D.machine_analytes_header_id \
            inner join hims_d_lab_analytes LA on LA.hims_d_lab_analytes_id = D.analyte_id \
            inner join hims_d_lis_configuration LC on H.machine_id = LC.hims_d_lis_configuration_id \
            inner join hims_d_hospital HO on HO.hims_d_hospital_id = LC.hospital_id where 1=1  " +
            _strAppend +
            "order by hims_m_machine_analytes_header_id desc",
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
  insertMachineAnalytesMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO `hims_m_machine_analytes_header` (`machine_id`, `created_by` ,`created_date`) \
          VALUES (?, ?, ?)",
          values: [
            inputParam.machine_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          printQuery: true
        })
        .then(header_result => {
          const analyts_data = [
            "machine_analyte_code",
            "machine_analyte_name",
            "analyte_id"
          ];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_m_machine_analytes_detail(??) VALUES ?",
              values: inputParam.analytes_data,
              includeValues: analyts_data,
              extraValues: {
                machine_analytes_header_id: header_result.insertId
              },
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(ord_analytes => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = ord_analytes;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  updateMachineAnalytesMap: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_m_machine_analytes_header` SET `updated_by`=?, `updated_date`=? \
            WHERE `hims_m_machine_analytes_header_id`=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_m_machine_analytes_header_id
          ],
          printQuery: true
        })
        .then(result => {
          new Promise((resolve, reject) => {
            if (inputParam.insert_analytes_data.length > 0) {
              const analyts_data = [
                "machine_analytes_header_id",
                "machine_analyte_code",
                "machine_analyte_name",
                "analyte_id"
              ];
              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_m_machine_analytes_detail(??) VALUES ?",
                  values: inputParam.insert_analytes_data,
                  includeValues: analyts_data,
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(insert_data => {
                  resolve(insert_data);
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              resolve({});
            }
          }).then(result => {
            console.log("DeleteQry", inputParam.delete_analytes_data.length);
            if (inputParam.delete_analytes_data.length > 0) {
              let DeleteQry = "";
              for (let i = 0; i < inputParam.delete_analytes_data.length; i++) {
                DeleteQry += _mysql.mysqlQueryFormat(
                  "DELETE from `hims_m_machine_analytes_detail`  where hims_m_machine_analytes_detail_id=?;",
                  [
                    inputParam.delete_analytes_data[i]
                      .hims_m_machine_analytes_detail_id
                  ]
                );
              }
              console.log("DeleteQry", DeleteQry);
              _mysql
                .executeQuery({
                  query: DeleteQry,
                  printQuery: true
                })
                .then(result => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              console.log("DeleteQry", inputParam.delete_analytes_data.length);
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            }
          });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  addGroupComments: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_group_comment` (micro_group_id, commnet_name, commet,  \
              created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)",
          values: [
            inputParam.micro_group_id,
            inputParam.commnet_name,
            inputParam.commet,
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

  updateGroupComments: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_group_comment` SET  commet=?, comment_status=?, updated_date=?, updated_by=? \
            WHERE  hims_d_group_comment_id=?;",
          values: [
            inputParam.commet,
            inputParam.comment_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_group_comment_id
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

  getGroupComments: (req, res, next) => {
    const _mysql = new algaehMysql();
    let strQuery = "";

    if (
      req.query.comment_status !== null &&
      req.query.comment_status !== undefined
    ) {
      strQuery = ` and comment_status = '${req.query.comment_status}'`;
    }
    try {
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_group_comment where micro_group_id = ?" +
            strQuery +
            "order by hims_d_group_comment_id desc ",
          values: [req.query.micro_group_id],
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

  //created by :Irfan
  addAnalyteRages: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    try {
      if (input.length > 0) {
        _mysql
          .executeQuery({
            query:
              "select hims_d_lab_analytes_range_id,analyte_id,gender,age_type,\
              case age_type when 'Y' then 'Years' when 'M' then 'Months' when 'D'\
               then 'days' end as age_desc,from_age,to_age,from_oprator,to_operator, \
               low_operator,high_operator from hims_d_lab_analytes_range where analyte_id=? ",
            values: [input[0].analyte_id],
            printQuery: true
          })
          .then(result => {
            let errorStr = "";

            //ST-VALIDATION FOR AGE RANGE
            if (result.length > 0) {
              input.forEach(item => {
                const existData = result.filter(f => {
                  return (
                    f.age_type == item.age_type &&
                    (f.gender == item.gender.toUpperCase() ||
                      f.gender == "BOTH")
                  );
                });

                if (existData) {
                  let err = existData.find(data => {
                    return (
                      (data.from_age <= item.from_age &&
                        item.from_age <= data.to_age) ||
                      (data.from_age <= item.to_age &&
                        item.to_age <= data.to_age) ||
                      (item.from_age <= data.from_age &&
                        data.from_age <= item.to_age)
                    );
                  });

                  if (err) {
                    errorStr = err;
                    return;
                  }
                }
              });
            }

            //EN-VALIDATION FOR AGE RANGE
            if (errorStr != "") {
              //error
              let message = `Analytes Range Exist For: ${errorStr.gender} between ${errorStr.from_age}-${errorStr.to_age} ${errorStr.age_desc}`;
              req.records = {
                invalid_input: true,
                message: message
              };
              next();
            } else {
              const insurtColumns = [
                "analyte_id",
                "gender",
                "age_type",
                "from_age",
                "to_age",
                "critical_low",
                "critical_high",
                "normal_low",
                "normal_high",
                "normal_qualitative_value",
                "text_value",
                "from_oprator",
                "to_operator",
                "low_operator",
                "high_operator"
              ];

              _mysql
                .executeQuery({
                  query: " INSERT INTO hims_d_lab_analytes_range(??) values ?;",
                  values: input,
                  includeValues: insurtColumns,
                  extraValues: {
                    created_date: new Date(),
                    created_by: req.userIdentity.algaeh_d_app_user_id,
                    updated_date: new Date(),
                    updated_by: req.userIdentity.algaeh_d_app_user_id
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(Result => {
                  _mysql.releaseConnection();
                  req.records = Result;
                  next();
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please Provide Valid Input"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by :Irfan
  getAnalyteRages: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_lab_analytes_range_id,analyte_id,gender,age_type,from_age,to_age,\
            critical_low,critical_high,normal_low,normal_qualitative_value,text_value,normal_high,\
            from_oprator,to_operator,low_operator,high_operator from hims_d_lab_analytes_range where analyte_id=? ",
          values: [req.query.analyte_id],
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
  //created by :Irfan
  updateAnalyteRage: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const item = req.body;

      if (item.analyte_id > 0 && item.hims_d_lab_analytes_range_id > 0) {
        _mysql
          .executeQuery({
            query:
              "select hims_d_lab_analytes_range_id,analyte_id,gender,age_type,\
              case age_type when 'Y' then 'Years' when 'M' then 'Months' when 'D'\
               then 'days' end as age_desc,from_age,to_age,from_oprator,to_operator,\
               low_operator,high_operator from hims_d_lab_analytes_range where analyte_id=? and  hims_d_lab_analytes_range_id<>?; ",
            values: [item.analyte_id, item.hims_d_lab_analytes_range_id],
            printQuery: true
          })
          .then(result => {
            let errorStr = "";

            //ST-VALIDATION FOR AGE RANGE
            if (result.length > 0) {
              const existData = result.filter(f => {
                return (
                  f.age_type == item.age_type &&
                  f.gender == item.gender.toUpperCase()
                );
              });

              if (existData) {
                let err = existData.find(data => {
                  return (
                    (data.from_age <= item.from_age &&
                      item.from_age <= data.to_age) ||
                    (data.from_age <= item.to_age &&
                      item.to_age <= data.to_age) ||
                    (item.from_age <= data.from_age &&
                      data.from_age <= item.to_age)
                  );
                });

                if (err) {
                  errorStr = err;
                }
              }
            }

            //EN-VALIDATION FOR AGE RANGE
            if (errorStr != "") {
              //error
              let message = `Analytes Range Exist For: ${errorStr.gender} between ${errorStr.from_age}-${errorStr.to_age} ${errorStr.age_desc}`;
              req.records = {
                invalid_input: true,
                message: message
              };
              next();
            } else {
              _mysql
                .executeQuery({
                  query:
                    " update hims_d_lab_analytes_range \
                    set gender=?, age_type=?,from_age=?,to_age=?, critical_low=?,critical_high=?,\
                    normal_low=?,normal_high=?,normal_qualitative_value=?,text_value=?, updated_by=?,\
                    updated_date=?,from_oprator=?,to_operator=?,low_operator=?,high_operator=? \
                    where hims_d_lab_analytes_range_id=? ",
                  values: [
                    item.gender,
                    item.age_type,
                    item.from_age,
                    item.to_age,
                    item.critical_low,
                    item.critical_high,
                    item.normal_low,
                    item.normal_high,
                    item.normal_qualitative_value,
                    item.text_value,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    item.from_oprator,
                    item.to_operator,
                    item.low_operator,
                    item.high_operator,
                    item.hims_d_lab_analytes_range_id
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
            }
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please Provide Valid Input"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by :Irfan
  deleteAnalyteRage: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "  delete  from hims_d_lab_analytes_range where hims_d_lab_analytes_range_id=?; ",
          values: [req.body.hims_d_lab_analytes_range_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "Please Provide Valid Input"
            };
            next();
          }
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
