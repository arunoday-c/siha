import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";

module.exports = {
  addDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.body;
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_d_department` (department_code,department_name,arabic_department_name,\
              department_desc,department_type,effective_start_date,effective_end_date,created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.department_code,
              input.department_name,
              input.arabic_department_name,
              input.department_desc,
              input.department_type,
              input.effective_start_date,
              input.effective_end_date,
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
            resolve(result);
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
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },

  updateDepartment: (req, res, next) => {
    return new Promise((resolve, reject) => {
      let input = req.body;
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "UPDATE `hims_d_department`\
        SET   `department_name`=?, `department_desc`=?, `department_type`=?\
        , `effective_start_date`=?, `effective_end_date`=? \
        ,`arabic_department_name`=?, `updated_date`=?, `updated_by`=?\
        WHERE record_status='A' AND `hims_d_department_id`=?;",
            values: [
              input.department_name,
              input.department_desc,
              input.department_type,
              input.effective_start_date,
              input.effective_end_date,
              input.arabic_department_name,
              new Date(),
              input.updated_by,
              input.hims_d_department_id
            ],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
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
    }).catch(e => {
      _mysql.releaseConnection();
      reject(error);
      next(e);
    });
  },

  selectDepartment: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let query = "";
      let values = [];

      if (input.hims_d_department_id != null) {
        query =
          "select hims_d_department_id, department_code, department_name, arabic_department_name,\
      department_desc, department_type, effective_start_date, effective_end_date, department_status\
      from hims_d_department where record_status='A' AND hims_d_department_id=? order by hims_d_department_id desc";

        values = values.push(input.hims_d_department_id);
      } else {
        query =
          "select hims_d_department_id, department_code, department_name, arabic_department_name,\
       department_desc, department_type, effective_start_date, effective_end_date, department_status\
       from hims_d_department where record_status='A' order by hims_d_department_id desc";
      }

      _mysql
        .executeQuery({
          query: query,
          values: values,
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

  selectSubDepartment: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let query = "";
      let values = [];

      if (input.department_id > 0) {
        query =
          "select hims_d_sub_department_id, sub_department_code, sub_department_name, arabic_sub_department_name,\
            inventory_location_id,sub_department_desc, department_id, SD.effective_start_date, SD.effective_end_date, \
            chart_type, sub_department_status,vitals_mandatory, D.department_name  from  hims_d_sub_department SD, \
            hims_d_department D where SD.record_status='A' and D.hims_d_department_id = SD.department_id \
            and department_id=? order by hims_d_sub_department_id desc";

        values.push(input.department_id);
      } else {
        query =
          "select hims_d_sub_department_id, sub_department_code, sub_department_name, arabic_sub_department_name,\
            inventory_location_id,sub_department_desc, department_id, SD.effective_start_date, SD.effective_end_date, \
            chart_type, sub_department_status, vitals_mandatory, D.department_name from  \
            hims_d_sub_department SD, hims_d_department D\
             where SD.record_status='A' and D.hims_d_department_id = SD.department_id \
            order by hims_d_sub_department_id desc";
      }

      _mysql
        .executeQuery({
          query: query,
          values: values,
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
  addSubDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_sub_department` (sub_department_code,sub_department_name,\
            arabic_sub_department_name,sub_department_desc,inventory_location_id,department_id,effective_start_date,\
            effective_end_date,chart_type,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.sub_department_code,
          input.sub_department_name,
          input.arabic_sub_department_name,
          input.sub_department_desc,
          input.inventory_location_id,
          input.department_id,
          input.effective_start_date,
          input.effective_end_date,
          input.chart_type,
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
  },
  updateSubDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_sub_department`\
        SET `sub_department_name`=?, `sub_department_desc`=?,arabic_sub_department_name=?\
        , `effective_start_date`=?, `effective_end_date`=? ,`chart_type`=?\
        ,`updated_date`=?, `updated_by`=?,`vitals_mandatory`=? \
        WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;",
        values: [
          input.sub_department_name,
          input.sub_department_desc,
          input.arabic_sub_department_name,
          input.effective_start_date,
          input.effective_end_date,
          input.chart_type,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.vitals_mandatory,
          input.hims_d_sub_department_id
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
  },
  deleteDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_department SET  record_status='I' WHERE hims_d_department_id=?;",
        values: [req.body.hims_d_department_id]
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
  },
  selectdoctors_Backup: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    // let connectionString = "";
    // if (input.department_type == "CLINICAL") {
    //   connectionString = " and hims_d_department.department_type='CLINICAL' ";
    // } else if (input.department_type == "NON-CLINICAL") {
    //   connectionString =
    //     " and hims_d_department.department_type='NON-CLINICAL' ";
    // }

    _mysql
      .executeQuery({
        query:
          "select hims_m_employee_department_mappings.employee_id,\
        hims_m_employee_department_mappings.sub_department_id,\
     hims_d_employee.full_name,\
     hims_d_employee.arabic_name,\
     hims_m_employee_department_mappings.services_id,\
     hims_d_sub_department.department_id,\
     hims_d_sub_department.sub_department_name,\
     hims_d_sub_department.arabic_sub_department_name,\
     hims_d_sub_department.department_type\
     from hims_m_employee_department_mappings,\
     hims_d_employee,hims_d_sub_department,hims_d_department,\
     hims_d_employee_category,hims_m_category_speciality_mappings\
     where\
     hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
     and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
     and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
     and hims_m_employee_department_mappings.record_status='A'\
     and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
     and hims_d_sub_department.record_status='A'\
     and hims_d_employee.record_status ='A'\
     and hims_d_sub_department.sub_department_status='A'\
     and hims_d_employee.employee_status='A'\
     and hims_d_department.department_type='CLINICAL'\
     and hims_d_employee.isdoctor='Y'\
     group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.services_id,hims_m_employee_department_mappings.sub_department_id;"
      })
      .then(results => {
        _mysql.releaseConnection();
        let departments = new LINQ(results).GroupBy(g => g.sub_department_id);
        let doctors = new LINQ(results).GroupBy(g => g.employee_id);
        req.records = { departments: departments, doctors: doctors };
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  selectdoctors: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select E.hims_d_employee_id as employee_id, E.sub_department_id, E.full_name, E.arabic_name, E.services_id,\
            SD.department_id, SD.sub_department_name, SD.arabic_sub_department_name, SD.department_type \
            from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \
            and  E.isdoctor='Y' inner join hims_d_department D on SD.department_id=D.hims_d_department_id \
            and  D.department_type='CLINICAL' where E.employee_status='A'  and SD.sub_department_status='A'\
            and SD.record_status='A' and E.record_status ='A' and services_id is not null;"
      })
      .then(results => {
        _mysql.releaseConnection();
        let departments = new LINQ(results).GroupBy(g => g.sub_department_id);
        let doctors = new LINQ(results).GroupBy(g => g.employee_id);
        req.records = { departments: departments, doctors: doctors };
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },
  selectDoctorsAndClinic_backUp: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_m_employee_department_mappings.employee_id as provider_id,\
        hims_m_employee_department_mappings.sub_department_id as sub_dept_id,\
      hims_d_employee.full_name,\
 hims_d_employee.arabic_name,\
     hims_m_employee_department_mappings.services_id,\
     hims_d_sub_department.department_id,\
     hims_d_sub_department.sub_department_name,\
     hims_d_sub_department.arabic_sub_department_name,hims_d_appointment_clinic_id as clinic_id,AP.description as clinic_description\
     from hims_m_employee_department_mappings,\
     hims_d_employee,hims_d_sub_department,hims_d_department,\
     hims_d_employee_category,hims_m_category_speciality_mappings,hims_d_appointment_clinic AP\
     where\
     hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
     and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
     and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
     and hims_m_employee_department_mappings.record_status='A'\
     and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
     and hims_d_sub_department.record_status='A'\
     and hims_d_employee.record_status ='A'\
     and hims_d_sub_department.sub_department_status='A'\
     and hims_d_employee.employee_status='A'\
     and hims_d_department.department_type='CLINICAL'\
     and hims_d_employee.isdoctor='Y'\
     and AP.record_status='A' and hims_d_employee.hims_d_employee_id=AP.provider_id \
     group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.sub_department_id;"
      })
      .then(results => {
        _mysql.releaseConnection();
        let departments = new LINQ(results).GroupBy(g => g.sub_dept_id);
        let doctors = new LINQ(results).GroupBy(g => g.provider_id);

        req.records = { departments: departments, doctors: doctors };

        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  selectDoctorsAndClinic: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select E.hims_d_employee_id as provider_id, E.sub_department_id as sub_dept_id, E.full_name, E.arabic_name, \
            E.services_id,SD.department_id, SD.sub_department_name, SD.arabic_sub_department_name, \
            hims_d_appointment_clinic_id as clinic_id,AP.description as clinic_description from hims_d_employee E \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id  and  E.isdoctor='Y' \
            inner join hims_d_department D on SD.department_id=D.hims_d_department_id  and  D.department_type='CLINICAL'\
            left join hims_d_appointment_clinic AP on E.hims_d_employee_id=AP.provider_id \
            where E.employee_status='A'  and SD.sub_department_status='A' \
            and SD.record_status='A' and E.record_status ='A' and services_id is not null;"
      })
      .then(results => {
        _mysql.releaseConnection();
        let departments = new LINQ(results).GroupBy(g => g.sub_dept_id);
        let doctors = new LINQ(results).GroupBy(g => g.provider_id);

        req.records = { departments: departments, doctors: doctors };

        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  deleteSubDepartment: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_sub_department SET  record_status='I' WHERE hims_d_sub_department_id=?",
        values: [req.body.hims_d_sub_department_id]
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
  },
  makeSubDepartmentInActive: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_sub_department SET  sub_department_status='I' WHERE hims_d_sub_department_id=?",
        values: [req.body.hims_d_sub_department_id]
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
  },
  makeDepartmentInActive: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_department SET  department_status='I' WHERE hims_d_department_id=?",
        values: [req.body.hims_d_department_id]
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
};
