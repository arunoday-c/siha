import algaehMysql from "algaeh-mysql";

import moment from "moment";
import _ from "lodash";

//import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getFinanceOption: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: `select default_cost_center_id,default_branch_id,cost_center_required,P.project_desc as default_cost_center_name,third_party_payroll,
       cost_center_type ,start_month,F.start_date,end_month,F.end_date,auth_level,auth1_limit_amount,auth1_limit,hospital_name as default_branch_name,
       allow_negative_balance,grni_required,default_currency from finance_options F
      left join hims_d_project P on F.default_cost_center_id=P.hims_d_project_id 
      left join  hims_d_hospital H on H.hims_d_hospital_id=F.default_branch_id  limit 1; `,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        req.records = result;
        next();
      })
      .catch((e) => {
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
          "SELECT cost_center_type ,third_party_payroll FROM finance_options limit 1; ",
      })
      .then((result) => {
        if (
          result.length == 1 &&
          result[0]["cost_center_type"] == "P" &&
          result[0]["third_party_payroll"] == "Y"
        ) {
          _mysql
            .executeQuery({
              query:
                "select finance_cost_center_id from finance_cost_center where hospital_id=?; ",
              values: [input.hospital_id],
            })
            .then((results) => {
              // _mysql.releaseConnection();
              // req.records = results;
              // next();
              if (results.length > 0) {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: "Cost Center is already defined for this branch",
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
                      new Date(),
                    ],
                    printQuery: false,
                  })
                  .then((subdetail) => {
                    _mysql.releaseConnection();
                    req.records = subdetail;
                    next();
                  })
                  .catch((e) => {
                    _mysql.releaseConnection();
                    next(e);
                  });
              }
            })
            .catch((e) => {
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
                new Date(),
              ],
              printQuery: false,
            })
            .then((subdetail) => {
              _mysql.releaseConnection();
              req.records = subdetail;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define cost center type",
          };
          next();
        }
      })
      .catch((e) => {
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
          "SELECT finance_options_id,cost_center_required  from finance_options limit 1; ",
      })
      .then((result) => {
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
                new Date(),
              ],
              printQuery: false,
            })
            .then((groupRes) => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled",
          };
          next();
        }
      })
      .catch((e) => {
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
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; ",
      })
      .then((result) => {
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
                new Date(),
              ],
              printQuery: false,
            })
            .then((groupRes) => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled",
          };
          next();
        }
      })
      .catch((e) => {
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
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; ",
      })
      .then((result) => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          let str = "";

          if (input.finance_cost_center_group_id > 0) {
            str = ` where finance_cost_center_group_id=${input.finance_cost_center_group_id}`;
          }
          _mysql
            .executeQuery({
              query: `SELECT finance_cost_center_group_id, group_code, group_name\
              from finance_cost_center_group ${str};`,

              printQuery: false,
            })
            .then((groupRes) => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled",
          };
          next();
        }
      })
      .catch((e) => {
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
          "SELECT finance_options_id,cost_center_required from finance_options limit 1; ",
      })
      .then((result) => {
        if (result.length == 1 && result[0]["cost_center_required"] == "Y") {
          let str = "";

          if (input.group_id > 0) {
            str = ` where group_id=${input.group_id}`;
          }
          _mysql
            .executeQuery({
              query: `SELECT finance_cost_center_id, cost_center_code, group_id, cost_center_name\
                from finance_cost_center  ${str};`,

              printQuery: false,
            })
            .then((groupRes) => {
              _mysql.releaseConnection();
              req.records = groupRes;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Cost center is disabled",
          };
          next();
        }
      })
      .catch((e) => {
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
        query: "SELECT cost_center_type  FROM finance_options limit 1; ",
      })
      .then((result) => {
        if (result.length == 1) {
          let strQuery = "";

          switch (result[0]["cost_center_type"]) {
            case "P":
              strQuery = `select hims_m_division_project_id,   project_id as cost_center_id,
                          P.project_desc as cost_center,hospital_name,H.hims_d_hospital_id
                          from hims_m_division_project D inner join hims_d_project P 
                          on D.project_id=P.hims_d_project_id 
                          inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id ;`;
              break;
            case "SD":
              strQuery = ` select  hims_m_branch_dept_map_id, hims_d_hospital_id, sub_department_id   as cost_center_id,
            SD.sub_department_name as cost_center,hospital_name
            from hims_m_branch_dept_map M inner join hims_d_sub_department SD
            on M.sub_department_id=SD.hims_d_sub_department_id
            inner join hims_d_hospital H on M.hospital_id=H.hims_d_hospital_id;  `;
              break;
            default:
              strQuery = ` select hims_d_hospital_id,hospital_name,hims_d_hospital_id as cost_center_id
                   ,hospital_name as cost_center from hims_d_hospital where record_status='A';`;
          }

          _mysql
            .executeQuery({
              query: strQuery,
              printQuery: true,
            })
            .then((results) => {
              _mysql.releaseConnection();

              let cost = _.chain(results)
                .groupBy((g) => g.cost_center_id)
                .value();
              const output = [];

              for (let c in cost) {
                const branches = [];
                results.forEach((item) => {
                  if (item.cost_center_id == c) {
                    branches.push({
                      hospital_name: item.hospital_name,
                      hims_d_hospital_id: item.hims_d_hospital_id,
                    });
                  }
                });
                output.push({
                  cost_center_id: cost[c][0]["cost_center_id"],
                  cost_center: cost[c][0]["cost_center"],
                  branches: branches,
                });
              }

              req.records = output;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define cost center type",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  updateCostCenters: (req, res, next) => {
    //const utilities = new algaehUtilities();
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
          input.finance_cost_center_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.affectedRows > 0) {
          req.records = result;
          next();
        } else {
          req.records = {
            invalid_input: true,
            message: "Invalid input",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  updateFinanceOption: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query: `update finance_options set default_branch_id=?,default_cost_center_id=?,cost_center_type=?,third_party_payroll=?,
      start_month=?,start_date=?,end_month=?,end_date=?,auth_level=?,auth1_limit=?,auth1_limit_amount=?,
      allow_negative_balance=?,grni_required=?
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
          input.auth1_limit_amount,
          input.allow_negative_balance,
          input.grni_required,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getCostCentersForVoucher: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    _mysql
      .executeQuery({
        query: "SELECT cost_center_type  FROM finance_options limit 1; ",
      })
      .then((result) => {
        if (result.length == 1) {
          let strQuery = "";

          switch (result[0]["cost_center_type"]) {
            case "P":
              strQuery = `select hims_m_division_project_id,   project_id as cost_center_id,
                          P.project_desc as cost_center,hospital_name,H.hims_d_hospital_id
                          from hims_m_division_project D inner join hims_d_project P 
                          on D.project_id=P.hims_d_project_id 
                          inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id ;`;
              break;
            case "SD":
              strQuery = ` select  hims_m_branch_dept_map_id, hims_d_hospital_id, sub_department_id   as cost_center_id,
            SD.sub_department_name as cost_center,hospital_name
            from hims_m_branch_dept_map M inner join hims_d_sub_department SD
            on M.sub_department_id=SD.hims_d_sub_department_id
            inner join hims_d_hospital H on M.hospital_id=H.hims_d_hospital_id;  `;
              break;
            default:
              strQuery = ` select hims_d_hospital_id,hospital_name,hims_d_hospital_id as cost_center_id
                   ,hospital_name as cost_center from hims_d_hospital where record_status='A';`;
          }

          _mysql
            .executeQuery({
              query: strQuery,
              printQuery: true,
            })
            .then((results) => {
              _mysql.releaseConnection();

              // let branch = _.chain(results)
              //   .groupBy((g) => g.hims_d_hospital_id)
              //   .value();
              // const output = [];

              // for (let b in branch) {
              //   const cost_centers = [];
              //   results.forEach((item) => {
              //     if (item.hims_d_hospital_id == b) {
              //       cost_centers.push({
              //         hims_d_hospital_id: item.hims_d_hospital_id,
              //         cost_center: item.cost_center,
              //         cost_center_id: item.cost_center_id,
              //       });
              //     }
              //   });
              //   output.push({
              //     hospital_name: branch[b][0]["hospital_name"],
              //     hims_d_hospital_id: branch[b][0]["hims_d_hospital_id"],
              //     cost_centers: cost_centers,
              //   });
              // }
              /* simplified above code */
              const output = _.chain(results)
                .groupBy((g) => g.hims_d_hospital_id)
                .map((details, key) => {
                  const { hospital_name, hims_d_hospital_id } = _.first(
                    details
                  );
                  return {
                    hospital_name,
                    hims_d_hospital_id,
                    cost_centers: details.map((centers) => {
                      const { cost_center, cost_center_id } = centers;
                      return {
                        hims_d_hospital_id,
                        cost_center,
                        cost_center_id,
                      };
                    }),
                  };
                })
                .value();

              req.records = output;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define cost center type",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getFinanceDate: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    _mysql
      .executeQuery({
        query: `
          select start_month,end_month from finance_options limit 1;  `,

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        let start_month = result[0]["start_month"];
        let end_month = result[0]["end_month"];

        let from_date,
          to_date = null;

        // .startOf("month")
        // .format("YYYY-MM-DD");

        // .endOf("month")
        // .format("YYYY-MM-DD");

        switch (input.transaction_date) {
          case "CY":
            if (start_month > end_month) {
              let from_year,
                to_year = null;

              let year = moment().format("YYYY");
              let month = moment().format("M");

              if (end_month > month) {
                from_year = parseInt(year) - parseInt(1);
                to_year = year;
              } else {
                from_year = year;
                to_year = year;
              }
              from_date = moment(from_year + "-" + start_month, "YYYYM")
                .startOf("year")
                .format("YYYY-MM-DD");

              to_date = moment(to_year + "-" + end_month, "YYYYM")
                .endOf("year")
                .format("YYYY-MM-DD");
            } else {
              from_date = moment().startOf("year").format("YYYY-MM-DD");

              to_date = moment().endOf("year").format("YYYY-MM-DD");
            }

            break;

          case "TM":
            from_date = moment().startOf("month").format("YYYY-MM-DD");

            to_date = moment().endOf("month").format("YYYY-MM-DD");
            break;

          case "TMTD":
            from_date = moment().startOf("month").format("YYYY-MM-DD");

            to_date = moment().format("YYYY-MM-DD");
            break;

          case "LM":
            from_date = moment()
              .add(-1, "months")
              .startOf("month")
              .format("YYYY-MM-DD");

            to_date = moment()
              .add(-1, "months")
              .endOf("month")
              .format("YYYY-MM-DD");
            break;

          default:
            if (start_month > end_month) {
              let from_year,
                to_year = null;

              let year = moment().format("YYYY");
              let month = moment().format("M");

              if (end_month > month) {
                from_year = parseInt(year) - parseInt(1);
                to_year = year;
              } else {
                from_year = year;
                to_year = year;
              }
              from_date = moment(from_year + "-" + start_month, "YYYYM")
                .startOf("year")
                .format("YYYY-MM-DD");

              to_date = moment().format("YYYY-MM-DD");
            } else {
              from_date = moment().startOf("year").format("YYYY-MM-DD");

              to_date = moment().format("YYYY-MM-DD");
            }
        }
        req.records = {
          from_date: from_date,
          to_date: to_date,
        };
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  generateCodes: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    let level = parseInt(input.account_level) - parseInt(1);

    _mysql
      .executeQuery({
        query: `SELECT C.finance_account_head_id,P.account_code ,C.group_parent FROM finance_account_head C ,finance_account_head P  where 
        C.group_parent= P.group_code and  C.account_level=?
        and C.account_code is null order by C.group_code limit 1; `,
        values: [input.account_level],
        printQuery: true,
      })
      .then((resul) => {
        if (resul.length > 0) {
          _mysql
            .executeQueryWithTransaction({
              query: `select finance_account_head_id,account_code,account_name,\
              account_level,hierarchy_path, concat(account_code,'.',(\
              select max( CAST(SUBSTRING_INDEX(account_code, '.', -1) AS UNSIGNED)  )+1\
              FROM finance_account_head where account_parent=?)) as new_code\
              FROM finance_account_head where account_code=? for update; `,
              values: [resul[0]["account_code"], resul[0]["account_code"]],
              printQuery: true,
            })
            .then((result) => {
              // _mysql.releaseConnection();
              let data = result[0];

              let account_code = 0;

              if (data["new_code"] == null) {
                account_code = data["account_code"] + "." + 1;
              } else {
                account_code = data["new_code"];
              }

              _mysql
                .executeQueryWithTransaction({
                  query: `update  finance_account_head set account_code =?,account_parent=?
                  where  finance_account_head_id=?`,
                  values: [
                    account_code,
                    data["account_code"],
                    resul[0]["finance_account_head_id"],
                  ],

                  printQuery: true,
                })
                .then((resultd) => {
                  // outArray += ` update  tms_finance.finance_account_head set account_code =${account_code},account_parent=${data["account_code"]}
                  // where finance_account_head_id=${resul[i]["finance_account_head_id"]} ;`;

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = resultd;
                    next();
                  });
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();

          req.records = {
            message: "nothing to generate",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};
