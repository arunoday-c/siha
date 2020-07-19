import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import _ from "lodash";

export default {
  //created by:irfan
  addBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();
        const input = req.body;
        input.algaeh_api_auth_id = 1;
        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_d_hospital (hospital_code, default_nationality, default_country, default_currency, \
                hospital_name, hospital_address, requied_emp_id, algaeh_api_auth_id, created_date, created_by, \
                updated_date, updated_by,organization_id ) \
                values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.hospital_code,
              input.default_nationality,
              input.default_country,
              input.default_currency,
              input.hospital_name,
              input.hospital_address,
              input.requied_emp_id,
              input.algaeh_api_auth_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.organization_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:irfan
  getBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "select hims_d_hospital_id,hospital_code,hospital_name,N.nationality,C.country_name,CU.currency_description,\
              hospital_address,hosital_status,requied_emp_id,default_currency,default_country,default_nationality from hims_d_hospital H left join hims_d_currency CU \
              on H.default_currency=CU.hims_d_currency_id left join   hims_d_nationality N  on \
              H.default_nationality=N.hims_d_nationality_id left join  hims_d_country C on\
              H.default_country=C.hims_d_country_id where H.record_status='A'",
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  getActiveBranches: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "select hims_d_hospital_id,hospital_code,hospital_name,N.nationality,C.country_name,CU.currency_description,\
              hospital_address,hosital_status,requied_emp_id from hims_d_hospital H left join hims_d_currency CU \
              on H.default_currency=CU.hims_d_currency_id left join   hims_d_nationality N  on \
              H.default_nationality=N.hims_d_nationality_id left join  hims_d_country C on\
              H.default_country=C.hims_d_country_id where H.record_status='A' and H.hosital_status='A';",
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  updateBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN" && req.body.hospital_id > 0) {
        const _mysql = new algaehMysql();
        const input = req.body;
        _mysql
          .executeQuery({
            query:
              "update hims_d_hospital  set hospital_code=?,default_nationality=?,default_country=?,default_currency=?,hospital_name=?,\
                    hospital_address=?,requied_emp_id=?,updated_date=?,updated_by=? where hims_d_hospital_id=?",
            values: [
              input.hospital_code,
              input.default_nationality,
              input.default_country,
              input.default_currency,
              input.hospital_name,
              input.hospital_address,
              input.requied_emp_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hospital_id,
            ],
          })
          .then((result) => {
            _mysql.releaseConnection();

            if (result.affectedRows > 0) {
              req.records = result;
            } else {
              req.records = {
                invalid_data: true,
                message: "Please Provide Valid input",
              };
            }

            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:irfan
  getActiveDepartments: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();
        const utilities = new algaehUtilities();
        _mysql
          .executeQuery({
            query:
              "select hims_d_department_id,D.department_code,D.department_name,SD.department_id,\
              hims_d_sub_department_id,SD.sub_department_code,SD.sub_department_name\
              from hims_d_department D inner join hims_d_sub_department  SD\
              on D.hims_d_department_id=SD.department_id\
              where D.department_status='A' and SD.sub_department_status='A' and D.record_status='A' and SD.record_status='A';",
          })
          .then((result) => {
            _mysql.releaseConnection();
            const outputArray = _.chain(result)
              .groupBy((g) => g.hims_d_department_id)
              .map((m) => {
                return {
                  hims_d_department_id: m[0].hims_d_department_id,
                  department_code: m[0].department_code,
                  department_name: m[0].department_name,
                  subDepts: m.map((item) => {
                    return {
                      hims_d_sub_department_id: item.hims_d_sub_department_id,
                      sub_department_code: item.sub_department_code,
                      sub_department_name: item.sub_department_name,
                    };
                  }),
                };
              })
              .value();

            req.records = outputArray;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  getBranchWiseDepartments: (req, res, next) => {
    try {
      if (req.query.hospital_id > 0) {
        const _mysql = new algaehMysql();
        const utilities = new algaehUtilities();
        _mysql
          .executeQuery({
            query:
              "select hims_m_branch_dept_map_id,hims_d_department_id,D.department_code,D.department_name,SD.department_id,\
              hims_d_sub_department_id,SD.sub_department_code,SD.sub_department_name\
              from hims_m_branch_dept_map B  inner join hims_d_sub_department  SD \
              on B.sub_department_id=SD.hims_d_sub_department_id \
              inner join hims_d_department D on D.hims_d_department_id=SD.department_id\
              where B.hospital_id=?;",
            values: [req.query.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            if (result.length > 0) {
              const outputArray = _.chain(result)
                .groupBy((g) => g.hims_d_department_id)
                .map((m) => {
                  return {
                    hims_d_department_id: m[0].hims_d_department_id,
                    hims_m_branch_dept_map_id: m[0].hims_m_branch_dept_map_id,
                    department_code: m[0].department_code,
                    department_name: m[0].department_name,
                    subDepts: m.map((item) => {
                      return {
                        hims_d_sub_department_id: item.hims_d_sub_department_id,
                        sub_department_code: item.sub_department_code,
                        sub_department_name: item.sub_department_name,
                        hims_m_branch_dept_map_id:
                          item.hims_m_branch_dept_map_id,
                      };
                    }),
                  };
                })
                .value();

              req.records = outputArray;
            } else {
              req.records = result;
            }

            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "please provide branch id",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:irfan
  modifyBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();
        const input = req.body;

        new Promise((resolve, reject) => {
          if (input.remove_sub.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "delete from hims_m_branch_dept_map where hospital_id=? and hims_m_branch_dept_map_id in (?);",
                values: [input.hospital_id, input.remove_sub],
                printQuery: true,
              })
              .then((deleteRes) => {
                resolve(deleteRes);
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            resolve({});
          }
        }).then((res) => {
          if (input.add_new_sub.length > 0) {
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_m_branch_dept_map (??)  values ?",
                values: input.add_new_sub,
                extraValues: {
                  hospital_id: input.hospital_id,
                },

                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then((result) => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            if (input.remove_sub.length > 0) {
              _mysql.releaseConnection();
              req.records = res;
              next();
            } else {
              req.records = {
                invalid_data: true,
                message: "Please provide valid data",
              };
              next();
            }
          }
        });

        //----------------
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  getDepartmentsChart: (req, res, next) => {
    try {
      // if (req.userIdentity.role_type != "GN") {
      const _mysql = new algaehMysql();
      const utilities = new algaehUtilities();
      _mysql
        .executeQuery({
          query:
            "select hims_d_hospital_id, hospital_code, hospital_name,hims_m_branch_dept_map_id,hims_d_department_id,D.department_code,D.department_name,SD.department_id,\
              hims_d_sub_department_id,SD.sub_department_code,SD.sub_department_name\
              from hims_m_branch_dept_map B  inner join hims_d_hospital  H on B.hospital_id=H.hims_d_hospital_id \
              inner join hims_d_sub_department  SD \
              on B.sub_department_id=SD.hims_d_sub_department_id \
              inner join hims_d_department D on D.hims_d_department_id=SD.department_id;",
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result.length > 0) {
            const branchGroup = _.chain(result)
              .groupBy((g) => g.hims_d_hospital_id)
              .map((m) => m)
              .value();

            const outputArray = [];

            for (let i = 0; i < branchGroup.length; i++) {
              const branch = _.chain(branchGroup[i])
                .groupBy((g) => g.hims_d_department_id)
                .map((m) => {
                  return {
                    hims_d_department_id: m[0].hims_d_department_id,
                    hims_m_branch_dept_map_id: m[0].hims_m_branch_dept_map_id,
                    department_code: m[0].department_code,
                    department_name: m[0].department_name,
                    sub_dept_count: m.length,
                    subDepts: m.map((item) => {
                      return {
                        hims_d_sub_department_id: item.hims_d_sub_department_id,
                        sub_department_code: item.sub_department_code,
                        sub_department_name: item.sub_department_name,
                        hims_m_branch_dept_map_id:
                          item.hims_m_branch_dept_map_id,
                      };
                    }),
                  };
                })
                .value();

              outputArray.push({
                hims_d_hospital_id: branchGroup[i][0].hims_d_hospital_id,
                hospital_code: branchGroup[i][0].hospital_code,
                hospital_name: branchGroup[i][0].hospital_name,
                dept_count: branch.length,
                departments: branch,
              });
            }
            req.records = outputArray;
          } else {
            req.records = result;
          }

          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
      // } else {
      //   req.records = {
      //     invalid_data: true,
      //     message: "You dont have Admin previlege"
      //   };
      //   next();
      // }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  getEmployeeReportingTo: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      _mysql
        .executeQuery({
          query: `select  hims_d_employee_id, employee_code,full_name as employee_name, null as reporting_to_id,
                  null reporting_to_code,  null as reporting_to_name,SD.sub_department_name,D.designation
                  FROM hims_d_employee E left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
                  left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id
                  where  E.record_status='A' and hims_d_employee_id= (SELECT hims_d_head_of_organization_id FROM 
                  hims_d_organization  where hims_d_organization_id=1 and hims_d_head_of_organization_id>0);
                  select  E.hims_d_employee_id, E.employee_code,  E.full_name as employee_name,E.reporting_to_id,
                  R.employee_code as reporting_to_code, R.full_name as reporting_to_name,SD.sub_department_name,D.designation
                  FROM hims_d_employee  E inner join hims_d_employee R on  E.reporting_to_id= R.hims_d_employee_id 
                  left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
                  left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id 
                  where E.record_status='A' and E.reporting_to_id>0 and E.hims_d_employee_id<> 
                  (SELECT hims_d_head_of_organization_id FROM hims_d_organization  where hims_d_organization_id=1 
                  and hims_d_head_of_organization_id>0);`,
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result[0].length > 0) {
            let hod = result[0][0];
            let employees = _.chain(result[1])
              .groupBy((g) => g.reporting_to_id)
              .value();

            let findReportingEmployees = function (parent) {
              if (employees[parent.hims_d_employee_id]) {
                const childs = employees[parent.hims_d_employee_id];
                parent["count"] = childs.length;
                parent["children"] = childs;
                for (let i = 0, len = parent.children.length; i < len; ++i) {
                  findReportingEmployees(parent.children[i]);
                }
              }
            };
            findReportingEmployees(hod);
            req.records = hod;
            next();
          } else {
            req.records = {
              invalid_data: true,
              message: "Please define head of organization ",
            };
            next();
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      console.log("here:", e);
      _mysql.releaseConnection();
      next(e);
    }
  },
};
