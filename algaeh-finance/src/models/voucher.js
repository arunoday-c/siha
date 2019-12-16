import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  addVoucherBakup: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    let cash = 0;
    let card = 0;
    let cheque = 0;
    let transaction_date = "";

    if (moment(input.transaction_date, "YYYY-MM-DD").format("YYYYMMDD") > 0) {
      transaction_date = input.transaction_date;
    } else {
      transaction_date = new Date();
    }

    let credit_amount = 0;
    let debit_amount = 0;
    input.details.forEach(item => {
      if (item.payment_type == "CR") {
        credit_amount = parseFloat(credit_amount) + parseFloat(item.amount);
        item["credit_amount"] = item.amount;
        item["debit_amount"] = 0;
      } else if (item.payment_type == "DR") {
        debit_amount = parseFloat(debit_amount) + parseFloat(item.amount);
        item["credit_amount"] = 0;
        item["debit_amount"] = item.amount;

        if (item.payment_mode == "CA") {
          cash = parseFloat(cash) + parseFloat(item.amount);
        } else if (item.payment_mode == "CD") {
          card = parseFloat(card) + parseFloat(item.amount);
        } else if (item.payment_mode == "CH") {
          cheque = parseFloat(cheque) + parseFloat(item.amount);
        }
      }
    });

    const insertDetail = [
      { payment_mode: "CA", amount: cash },
      { payment_mode: "CH", amount: card },
      { payment_mode: "CD", amount: cheque }
    ];

    if (credit_amount === debit_amount) {
      _mysql
        .executeQuery({
          query:
            "select hims_d_hospital_id,head_office,cost_center_type from \
          hims_d_hospital where  head_office='Y'; "
        })
        .then(resul => {
          if (resul.length == 1) {
            if (
              resul[0]["cost_center_type"] == "P" ||
              resul[0]["cost_center_type"] == "SD"
            ) {
              let project_cost_center = null;
              let subDept_cost_center = null;
              if (resul[0]["cost_center_type"] == "P") {
                project_cost_center = input.cost_center_id;
              } else if (resul[0]["cost_center_type"] == "SD") {
                subDept_cost_center = input.cost_center_id;
              }
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "INSERT INTO `finance_day_end_header` (transaction_date,amount,voucher_type,voucher_no,\
            from_screen,refrence_no,transaction_type,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?)",
                  values: [
                    transaction_date,
                    credit_amount,
                    input.voucher_type,
                    input.voucher_no,
                    input.from_screen,
                    input.refrence_no,
                    "JV",
                    input.hospital_id
                  ]
                })
                .then(result => {
                  const IncludeValues = ["amount", "payment_mode"];
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_day_end_detail (??) VALUES ? ",
                      values: insertDetail,
                      includeValues: IncludeValues,
                      bulkInsertOrUpdate: true,
                      extraValues: {
                        day_end_header_id: result["insertId"]
                      },
                      printQuery: false
                    })
                    .then(detail => {
                      const month = moment(
                        transaction_date,
                        "YYYY-MM-DD"
                      ).format("M");
                      const year = moment(
                        transaction_date,
                        "YYYY-MM-DD"
                      ).format("YYYY");
                      const IncludeValuess = [
                        "day_end_header_id",
                        "head_account_code",
                        "head_id",
                        "child_id",
                        "debit_amount",
                        "payment_type",
                        "credit_amount",
                        "narration"
                      ];
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ",
                          values: input.details,
                          includeValues: IncludeValuess,
                          bulkInsertOrUpdate: true,
                          extraValues: {
                            year: year,
                            month: month,
                            entered_date: new Date(),
                            entered_by: req.userIdentity.algaeh_d_app_user_id,
                            day_end_header_id: result.insertId,
                            payment_date: transaction_date,
                            hospital_id: input.hospital_id,
                            project_id: project_cost_center,
                            sub_department_id: subDept_cost_center
                          },
                          printQuery: false
                        })
                        .then(subResult => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result;
                            next();
                          });
                        })
                        .catch(error => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Please Define cost_center_type"
              };
              next();
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Please Define proper Head-Office"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Credit and Debit Amount are not equal"
      };
      next();
    }
  },
  //created by irfan:
  addVoucher: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    let cash = 0;
    let card = 0;
    let cheque = 0;
    let transaction_date = "";

    if (moment(input.transaction_date, "YYYY-MM-DD").format("YYYYMMDD") > 0) {
      transaction_date = input.transaction_date;
    } else {
      transaction_date = new Date();
    }

    let credit_amount = 0;
    let debit_amount = 0;
    input.details.forEach(item => {
      if (item.payment_type == "CR") {
        credit_amount =
          parseFloat(credit_amount) + parseFloat(item.credit_amount);
        item["credit_amount"] = item.credit_amount;
        item["debit_amount"] = 0;
      } else if (item.payment_type == "DR") {
        debit_amount = parseFloat(debit_amount) + parseFloat(item.debit_amount);
        item["credit_amount"] = 0;
        item["debit_amount"] = item.debit_amount;

        if (item.payment_mode == "CA") {
          cash = parseFloat(cash) + parseFloat(item.debit_amount);
        } else if (item.payment_mode == "CD") {
          card = parseFloat(card) + parseFloat(item.debit_amount);
        } else if (item.payment_mode == "CH") {
          cheque = parseFloat(cheque) + parseFloat(item.debit_amount);
        }
      }
    });

    const insertDetail = [
      { payment_mode: "CA", amount: cash },
      { payment_mode: "CH", amount: card },
      { payment_mode: "CD", amount: cheque }
    ];

    if (credit_amount === debit_amount) {
      _mysql
        .executeQuery({
          query:
            "select hims_d_hospital_id,head_office,cost_center_type from \
          hims_d_hospital where  head_office='Y'; "
        })
        .then(resul => {
          if (resul.length == 1) {
            if (
              resul[0]["cost_center_type"] == "P" ||
              resul[0]["cost_center_type"] == "SD"
            ) {
              let project_cost_center = null;
              let subDept_cost_center = null;
              if (resul[0]["cost_center_type"] == "P") {
                project_cost_center = input.cost_center_id;
              } else if (resul[0]["cost_center_type"] == "SD") {
                subDept_cost_center = input.cost_center_id;
              }
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "INSERT INTO `finance_day_end_header` (transaction_date,amount,voucher_type,voucher_no,\
            from_screen,refrence_no,transaction_type,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?)",
                  values: [
                    transaction_date,
                    credit_amount,
                    input.voucher_type,
                    input.voucher_no,
                    input.from_screen,
                    input.refrence_no,
                    "JV",
                    input.hospital_id
                  ]
                })
                .then(result => {
                  const IncludeValues = ["amount", "payment_mode"];
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_day_end_detail (??) VALUES ? ",
                      values: insertDetail,
                      includeValues: IncludeValues,
                      bulkInsertOrUpdate: true,
                      extraValues: {
                        day_end_header_id: result["insertId"]
                      },
                      printQuery: false
                    })
                    .then(detail => {
                      const month = moment(
                        transaction_date,
                        "YYYY-MM-DD"
                      ).format("M");
                      const year = moment(
                        transaction_date,
                        "YYYY-MM-DD"
                      ).format("YYYY");
                      const IncludeValuess = [
                        "day_end_header_id",
                        "head_account_code",

                        "head_id",
                        "child_id",
                        "debit_amount",
                        "payment_type",
                        "credit_amount",
                        "narration"
                      ];
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ",
                          values: input.details,
                          includeValues: IncludeValuess,
                          bulkInsertOrUpdate: true,
                          extraValues: {
                            year: year,
                            month: month,
                            entered_date: new Date(),
                            entered_by: req.userIdentity.algaeh_d_app_user_id,
                            day_end_header_id: result.insertId,
                            payment_date: transaction_date,
                            hospital_id: input.hospital_id,
                            project_id: project_cost_center,
                            sub_department_id: subDept_cost_center
                          },
                          printQuery: false
                        })
                        .then(subResult => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result;
                            next();
                          });
                        })
                        .catch(error => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Please Define cost_center_type"
              };
              next();
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Please Define proper Head-Office"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Credit and Debit Amount are not equal"
      };
      next();
    }
  },
  //created by irfan:
  getVoucherNo: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQueryWithTransaction({
        query:
          "SELECT encounter_id  FROM algaeh_d_app_config where algaeh_d_app_config_id=12 FOR UPDATE;"
      })
      .then(voucher_result => {
        _mysql
          .executeQueryWithTransaction({
            query:
              "UPDATE algaeh_d_app_config SET encounter_id = encounter_id + 1 where algaeh_d_app_config_id=12;"
          })
          .then(result => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                voucher_no: voucher_result[0]["encounter_id"]
              };
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
  },
  //created by irfan:
  getVoucherNoNEW: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQueryWithTransaction({
        query:
          "SELECT encounter_id  FROM algaeh_d_app_config where algaeh_d_app_config_id=12 FOR UPDATE;"
      })
      .then(voucher_result => {
        _mysql.releaseConnection();
        req.records = {
          voucher_no: voucher_result[0]["encounter_id"]
        };
        next();
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  //created by irfan:
  getCostCenters: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_hospital_id,head_office,cost_center_type from \
          hims_d_hospital where  head_office='Y'; "
      })
      .then(result => {
        if (result.length == 1) {
          if (result[0]["cost_center_type"] == "P") {
            let hospital_id = req.userIdentity.hospital_id;
            if (req.query.hospital_id > 0) {
              hospital_id = req.query.hospital_id;
            }
            _mysql
              .executeQuery({
                query:
                  "select project_id as cost_center_id,P.project_desc as cost_center from \
              hims_m_division_project DP inner join hims_d_project P\
              on DP.project_id=P.hims_d_project_id where DP.division_id=?; ",
                values: [hospital_id]
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
              message: "Please Define cost_center_type"
            };
            next();
          }
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Please Define proper Head-Office"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  }
};
