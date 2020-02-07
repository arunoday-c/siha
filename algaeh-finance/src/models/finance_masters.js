import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getFinanceOption: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: `select default_cost_center_id,default_branch_id,P.project_desc as default_cost_center_name,third_party_payroll,
       cost_center_type ,start_month,F.start_date,end_month,F.end_date,auth_level,auth1_limit_amount,auth1_limit,hospital_name as default_branch_name
      from finance_options F
      left join hims_d_project P on F.default_cost_center_id=P.hims_d_project_id 
      left join  hims_d_hospital H on H.hims_d_hospital_id=F.default_branch_id  limit 1; `,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  addCostCenter_BAKUP_FEB_3_2020: (req, res, next) => {
    const _mysql = new algaehMysql();

    const input = req.body;
    _mysql
      .executeQuery({
        query:
          "SELECT cost_center_type ,third_party_payroll FROM finance_options limit 1; "
      })
      .then(result => {
        if (
          result.length == 1 &&
          result[0]["cost_center_type"] == "P" &&
          result[0]["third_party_payroll"] == "Y"
        ) {
          _mysql
            .executeQuery({
              query:
                "select finance_cost_center_id from finance_cost_center where hospital_id=?; ",
              values: [input.hospital_id]
            })
            .then(results => {
              // _mysql.releaseConnection();
              // req.records = results;
              // next();
              if (results.length > 0) {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: "Cost Center is already defined for this branch"
                };
                next();
              } else {
                _mysql
                  .executeQuery({
                    query:
                      "insert into finance_cost_center (hospital_id,cost_center_id,cost_center_type\
                      ,created_by,created_date,updated_by,updated_date)  VALUE(?,?,?,?,?,?,?);",
                    values: [
                      input.hospital_id,
                      input.cost_center_id,
                      "P",
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ],
                    printQuery: false
                  })
                  .then(subdetail => {
                    _mysql.releaseConnection();
                    req.records = subdetail;
                    next();
                  })
                  .catch(e => {
                    _mysql.releaseConnection();
                    next(e);
                  });
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else if (result.length == 1) {
          _mysql
            .executeQuery({
              query:
                "insert into finance_cost_center (hospital_id,cost_center_id,cost_center_type\
              ,created_by,created_date,updated_by,updated_date)  VALUE(?,?,?,?,?,?,?);",
              values: [
                input.hospital_id,
                input.cost_center_id,
                result[0]["cost_center_type"],
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],
              printQuery: false
            })
            .then(subdetail => {
              _mysql.releaseConnection();
              req.records = subdetail;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define cost center type"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  addCostCenterGroup: (req, res, next) => {
    const _mysql = new algaehMysql();

    const input = req.body;

    _mysql
      .executeQuery({
        query:
          "SELECT finance_options_id,cost_center_required  from finance_options limit 1; "
      })
      .then(result => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          _mysql
            .executeQuery({
              query:
                "insert into finance_cost_center_group (group_code,group_name,created_by,created_date,\
                  updated_by,updated_date)  VALUE(?,?,?,?,?,?);",
              values: [
                input.group_code,
                input.group_name,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],
              printQuery: false
            })
            .then(groupRes => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  addCostCenter: (req, res, next) => {
    const _mysql = new algaehMysql();

    const input = req.body;

    _mysql
      .executeQuery({
        query:
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; "
      })
      .then(result => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          _mysql
            .executeQuery({
              query:
                "insert into finance_cost_center (cost_center_code,group_id,cost_center_name,created_by,created_date,\
                  updated_by,updated_date)  VALUE(?,?,?,?,?,?,?);",
              values: [
                input.cost_center_code,
                input.group_id,
                input.cost_center_name,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],
              printQuery: false
            })
            .then(groupRes => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getCostCenterGroups: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    _mysql
      .executeQuery({
        query:
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; "
      })
      .then(result => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          let str = "";

          if (input.finance_cost_center_group_id > 0) {
            str = ` where finance_cost_center_group_id=${input.finance_cost_center_group_id}`;
          }
          _mysql
            .executeQuery({
              query: `SELECT finance_cost_center_group_id, group_code, group_name\
              from finance_cost_center_group ${str};`,

              printQuery: false
            })
            .then(groupRes => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getCostCentersNEW_feb7: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    _mysql
      .executeQuery({
        query:
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; "
      })
      .then(result => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          let str = "";

          if (input.group_id > 0) {
            str = ` where group_id=${input.group_id}`;
          }
          _mysql
            .executeQuery({
              query: `SELECT finance_cost_center_id, cost_center_code, group_id, cost_center_name\
                from finance_cost_center  ${str};`,

              printQuery: false
            })
            .then(groupRes => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getCostCenters: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    _mysql
      .executeQuery({
        query: "SELECT cost_center_type  FROM finance_options limit 1; "
      })
      .then(result => {
        if (result.length == 1 && result[0]["cost_center_type"] == "P") {
          let strQry = "";

          if (input.hospital_id > 0) {
            strQry = ` where division_id= ${input.hospital_id}`;
          } else if (input.fromMaster != "Y") {
            strQry = ` where division_id= ${req.userIdentity.hospital_id}`;
          }

          // query: `select finance_cost_center_id,C.hospital_id, cost_center_id,P.project_desc as cost_center,hospital_name from \
          // finance_cost_center C inner join hims_d_project P\
          // on C.cost_center_id=P.hims_d_project_id\
          // left join  hims_d_hospital H on H.hims_d_hospital_id=C.hospital_id ${strQry}; `,
          _mysql
            .executeQuery({
              query: `select hims_m_division_project_id, division_id, project_id as cost_center_id,
              P.project_desc as cost_center,hospital_name
              from hims_m_division_project D inner join hims_d_project P 
              on D.project_id=P.hims_d_project_id 
              inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id ${strQry}; `,

              printQuery: true
            })
            .then(results => {
              _mysql.releaseConnection();
              req.records = results;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else if (
          result.length == 1 &&
          result[0]["cost_center_type"] == "SD"
        ) {
          let strQry = "";

          if (input.hospital_id > 0) {
            strQry = ` where hospital_id= ${input.hospital_id}`;
          } else if (input.fromMaster != "Y") {
            strQry = ` where hospital_id= ${req.userIdentity.hospital_id}`;
          }

          // select finance_cost_center_id,C.hospital_id, cost_center_id,
          //     SD.sub_department_name as cost_center ,hospital_name from
          //     finance_cost_center C inner join hims_d_sub_department SD
          //     on C.cost_center_id=SD.hims_d_sub_department_id\
          //     left join  hims_d_hospital H on H.hims_d_hospital_id=C.hospital_id
          _mysql
            .executeQuery({
              query: ` select  hims_m_branch_dept_map_id, hospital_id, sub_department_id   as cost_center_id,
              SD.sub_department_name as cost_center,hospital_name
              from hims_m_branch_dept_map M inner join hims_d_sub_department SD
              on M.sub_department_id=SD.hims_d_sub_department_id
              inner join hims_d_hospital H on M.hospital_id=H.hims_d_hospital_id;${strQry}; `,

              printQuery: true
            })
            .then(results => {
              _mysql.releaseConnection();
              req.records = results;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define cost center type"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  updateCostCenters: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query: `
        update finance_cost_center set hospital_id=?,cost_center_id=?,updated_by=?,updated_date=?
        where finance_cost_center_id=?; `,
        values: [
          input.hospital_id,
          input.cost_center_id,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.finance_cost_center_id
        ],
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
            message: "Invalid input"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  updateFinanceOption: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query: `update finance_options set default_branch_id=?,default_cost_center_id=?,cost_center_type=?,third_party_payroll=?,
      start_month=?,start_date=?,end_month=?,end_date=?,auth_level=?,auth1_limit=?,auth1_limit_amount=?
      where finance_options_id=1; `,
        values: [
          input.default_branch_id,
          input.default_cost_center_id,
          input.cost_center_type,
          input.third_party_payroll,
          input.start_month,
          input.start_date,
          input.end_month,
          input.end_date,
          input.auth_level,
          input.auth1_limit,
          input.auth1_limit_amount
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  }
};
