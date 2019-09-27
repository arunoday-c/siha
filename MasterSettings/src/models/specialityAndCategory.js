import algaehMysql from "algaeh-mysql";
export default {
  addEmployeeSpecialityMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_employee_speciality` (sub_department_id, speciality_code, speciality_name, \
            arabic_name,speciality_desc  ,created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.sub_department_id,
            inputParam.speciality_code,
            inputParam.speciality_name,
            inputParam.arabic_name,
            inputParam.speciality_desc,
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

  getEmployeeSpecialityMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.sub_department_id != null) {
        _strAppend += "and sub_department_id=?";
        inputValues.push(input.sub_department_id);
      }
      if (input.speciality_status != null) {
        _strAppend += "and speciality_status=?";
        inputValues.push(input.speciality_status);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_speciality_id, sub_department_id, speciality_code,\
          speciality_status,speciality_name, arabic_name,speciality_desc from hims_d_employee_speciality \
          where record_status='A' " +
            _strAppend +
            " order by hims_d_employee_speciality_id desc",
          values: inputValues,
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

  addEmployeeCategoryMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_employee_category` (employee_category_code, employee_category_name, arabic_name,employee_category_desc,  \
            effective_start_date,   created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.employee_category_code,
            inputParam.employee_category_name,
            inputParam.arabic_name,
            inputParam.employee_category_desc,
            inputParam.effective_start_date,
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

  getEmployeeCategoryMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_employee_category_id != null) {
        _strAppend += "and hims_employee_category_id=?";
        inputValues.push(input.hims_employee_category_id);
      }
      if (input.employee_category_status != null) {
        _strAppend += "and employee_category_status=?";
        inputValues.push(input.employee_category_status);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_employee_category_id, employee_category_code, employee_category_name, arabic_name, \
          employee_category_desc, employee_category_status, effective_start_date, effective_end_date \
          from hims_d_employee_category where record_status='A'" +
            _strAppend +
            " order by hims_employee_category_id desc",
          values: inputValues,
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

  deleteEmployeeCategoryMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_employee_category SET  record_status='I' WHERE  \
          record_status='A' and hims_employee_category_id=?",
          values: [inputParam.hims_employee_category_id],
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

  deleteEmployeeSpecialityMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_employee_speciality SET  record_status='I' WHERE  \
          record_status='A' and hims_d_employee_speciality_id=?",
          values: [inputParam.hims_d_employee_speciality_id],
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

  updateEmployeeSpecialityMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_employee_speciality` SET  speciality_code=?,speciality_name=?, arabic_name=? , speciality_desc=?,sub_department_id=?,\
          speciality_status=?,updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_employee_speciality_id`=?;",
          values: [
            inputParam.speciality_code,
            inputParam.speciality_name,
            inputParam.arabic_name,
            inputParam.speciality_desc,
            inputParam.sub_department_id,
            inputParam.speciality_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_employee_speciality_id
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

  updateEmployeeCategoryMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_employee_category` SET  employee_category_code=?, employee_category_name=?,\
            arabic_name=?,employee_category_desc=?,effective_start_date=?,employee_category_status=?,\
            updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_employee_category_id`=?;",
          values: [
            inputParam.employee_category_code,
            inputParam.employee_category_name,
            inputParam.arabic_name,
            inputParam.employee_category_desc,
            inputParam.effective_start_date,
            inputParam.employee_category_status,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_employee_category_id
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
  makeEmployeeCategoryInActive: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_employee_category SET  employee_category_status='I',effective_end_date=CURDATE() WHERE record_status='A' and hims_employee_category_id=?",
          values: [inputParam.hims_employee_category_id],
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
  makeEmployeeSpecialityInActive: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_employee_speciality SET  speciality_status='I' WHERE record_status='A' and hims_d_employee_speciality_id=?",
          values: [inputParam.hims_d_employee_speciality_id],
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
  addCategorySpecialityMappings: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_m_category_speciality_mappings` (category_id, speciality_id,description, \
            category_speciality_status, effective_start_date, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.category_id,
            inputParam.speciality_id,
            inputParam.description,
            inputParam.category_speciality_status,
            inputParam.effective_start_date,
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

  getCategorySpecialityMap: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_m_category_speciality_mappings_id != null) {
        _strAppend += "and hims_m_category_speciality_mappings_id=?";
        inputValues.push(input.hims_m_category_speciality_mappings_id);
      }

      if (input.category_speciality_status != null) {
        _strAppend += "and category_speciality_status=?";
        inputValues.push(input.category_speciality_status);
      }
      if (input.speciality_status != null) {
        _strAppend += "and speciality_status=?";
        inputValues.push(input.speciality_status);
      }
      if (input.employee_category_status != null) {
        _strAppend += "and employee_category_status=?";
        inputValues.push(input.employee_category_status);
      }
      if (input.hims_d_employee_speciality_id != null) {
        _strAppend += "and hims_d_employee_speciality_id=?";
        inputValues.push(input.hims_d_employee_speciality_id);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_m_category_speciality_mappings_id, category_id, speciality_id, description, category_speciality_status,\
            hims_employee_category_id, employee_category_code, employee_category_name,C.arabic_name as category_arabic_name, employee_category_desc, employee_category_status, \
            hims_d_employee_speciality_id,  speciality_code, speciality_name, S.arabic_name as speciality_arabic_name, speciality_desc, speciality_status \
            from hims_m_category_speciality_mappings CSM,hims_d_employee_category C,hims_d_employee_speciality S \
            where CSM.record_status='A' and C.record_status='A' and S.record_status='A' and \
            CSM.category_id=C.hims_employee_category_id and CSM.speciality_id=S.hims_d_employee_speciality_id " +
            _strAppend +
            " order by hims_m_category_speciality_mappings_id desc",
          values: inputValues,
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

  updateCategorySpecialityMap: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_m_category_speciality_mappings` SET  category_id=?,speciality_id=?,description=?,category_speciality_status=?,effective_start_date=?,\
          updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_m_category_speciality_mappings_id`=?;",
          values: [
            inputParam.category_id,
            inputParam.speciality_id,
            inputParam.description,
            inputParam.category_speciality_status,
            inputParam.effective_start_date,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_m_category_speciality_mappings_id
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
  deleteCategorySpecialityMap: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_m_category_speciality_mappings SET  record_status='I' WHERE  record_status='A' and hims_m_category_speciality_mappings_id=?",
          values: [inputParam.hims_m_category_speciality_mappings_id],
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
  makeCategorySpecialityMapInActive: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_m_category_speciality_mappings SET  category_speciality_status='I' WHERE  record_status='A' and hims_m_category_speciality_mappings_id=?",
          values: [inputParam.hims_m_category_speciality_mappings_id],
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
