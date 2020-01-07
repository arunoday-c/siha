import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

//created by irfan: to get hieghest auth level
function getMaxAuth(options) {
  const _mysql = options.mysql;
  let MaxAuth;
  return new Promise((resolve, reject) => {
    _mysql
      .executeQuery({
        query: "SELECT auth_level,auth1_limit FROM finance_options limit 1;"
      })
      .then(result => {
        _mysql.releaseConnection();
        //LEAVE
        switch (result[0]["auth_level"]) {
          case "1":
            MaxAuth = "1";

            break;

          case "2":
            MaxAuth = "2";

            break;
          default:
        }

        resolve({
          MaxAuth: MaxAuth,
          limit: [
            {
              auth_level: 1,
              auth_limit: result[0]["auth1_limit"]
            },
            {
              auth_level: 2
            }
          ]
        });
      })
      .catch(e => {
        _mysql.releaseConnection();
        reject(e);
      });
  });
}

export default {
  //created by irfan:
  addVoucher_BKP_26_dec: (req, res, next) => {
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
                from_screen,transaction_type,hospital_id)\
                  VALUE(?,?,?,?,?,?,?)",
                  values: [
                    transaction_date,
                    credit_amount,
                    input.voucher_type,
                    input.voucher_no,
                    input.from_screen,

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

    // let cash = 0;
    // let card = 0;
    // let cheque = 0;
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

        // if (item.payment_mode == "CA") {
        //   cash = parseFloat(cash) + parseFloat(item.debit_amount);
        // } else if (item.payment_mode == "CD") {
        //   card = parseFloat(card) + parseFloat(item.debit_amount);
        // } else if (item.payment_mode == "CH") {
        //   cheque = parseFloat(cheque) + parseFloat(item.debit_amount);
        // }
      }
    });

    // const insertDetail = [
    //   { payment_mode: "CA", amount: cash },
    //   { payment_mode: "CH", amount: card },
    //   { payment_mode: "CD", amount: cheque }
    // ];

    console.log("debit:", debit_amount);
    console.log("credit_amount:", credit_amount);
    if (credit_amount == debit_amount) {
      _mysql
        .executeQuery({
          query: "SELECT cost_center_type  FROM finance_options limit 1; "
        })
        .then(resul => {
          if (
            resul.length == 1 &&
            (resul[0]["cost_center_type"] == "P" ||
              resul[0]["cost_center_type"] == "SD")
          ) {
            let project_cost_center = null;
            let subDept_cost_center = null;
            if (resul[0]["cost_center_type"] == "P") {
              project_cost_center = input.cost_center_id;
            } else if (resul[0]["cost_center_type"] == "SD") {
              subDept_cost_center = input.cost_center_id;
            }

            const month = moment(transaction_date, "YYYY-MM-DD").format("M");
            const year = moment(transaction_date, "YYYY-MM-DD").format("YYYY");

            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO `finance_voucher_header` (amount, payment_date, month, year,\
                      narration, voucher_no, voucher_type,from_screen,posted_from)\
                  VALUE(?,?,?,?,?,?,?,?,?)",
                values: [
                  credit_amount,
                  transaction_date,
                  month,
                  year,
                  input.narration,
                  input.voucher_no,
                  input.voucher_type,
                  input.from_screen,
                  "V"
                ],
                printQuery: false
              })
              .then(result => {
                // const IncludeValues = ["amount", "payment_mode"];
                const insertColumns = [
                  "head_id",
                  "child_id",
                  "debit_amount",
                  "credit_amount",
                  "payment_type",
                  "hospital_id",
                  "project_id",
                  "sub_department_id"
                ];
                _mysql
                  .executeQueryWithTransaction({
                    query: "insert into finance_voucher_details (??) values ?;",
                    values: input.details,
                    includeValues: insertColumns,
                    bulkInsertOrUpdate: true,
                    printQuery: false,
                    extraValues: {
                      payment_date: transaction_date,
                      month: month,
                      year: year,
                      voucher_header_id: result.insertId,
                      entered_by: req.userIdentity.algaeh_d_app_user_id,
                      hospital_id: input.hospital_id,
                      project_id: project_cost_center,
                      sub_department_id: subDept_cost_center
                    }
                  })
                  .then(result2 => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result2;
                      next();
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
              message: "Please Define cost center type"
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
    const input = req.query;
    const current_year = moment().format("YY");

    let voucher_type = "";

    switch (input.voucher_type) {
      case "journal":
        voucher_type = "JOURNAL";
        break;
      case "contra":
        voucher_type = "CONTRA";
        break;
      case "receipt":
        voucher_type = "RECEIPT";
        break;
      case "payment":
        voucher_type = "PAYMENT";
        break;
      case "sales":
        voucher_type = "SALES";
        break;
      case "purchase":
        voucher_type = "PURCHASE";
        break;
      case "credit_note":
        voucher_type = "CREDIT_NOTE";
        break;
      case "debit_note":
        voucher_type = "DEBIT_NOTE";
        break;
    }

    if (voucher_type == "") {
      req.records = {
        invalid_input: true,
        message: "Please select voucher type"
      };
      next();
    } else {
      _mysql
        .executeQueryWithTransaction({
          query:
            " select finance_numgen_id,prefix,intermediate_series,postfix,\
          length,increment_by,numgen_seperator,postfix_start,postfix_end,current_num,pervious_num\
          from finance_numgen where record_status='A' and numgen_code=? FOR UPDATE;",
          values: [voucher_type],
          printQuery: false
        })
        .then(voucher_result => {
          if (voucher_result.length == 1) {
            let current_num = "";
            let new_number = "";
            let complete_number = "";
            let str = "";

            if (current_year > voucher_result[0]["intermediate_series"]) {
              current_num =
                voucher_result[0]["prefix"] +
                voucher_result[0]["numgen_seperator"] +
                current_year +
                voucher_result[0]["numgen_seperator"] +
                1;

              new_number = 2;
              complete_number =
                voucher_result[0]["prefix"] +
                voucher_result[0]["numgen_seperator"] +
                current_year +
                voucher_result[0]["numgen_seperator"] +
                new_number;

              str = ", intermediate_series =" + current_year;
            } else if (
              current_year == voucher_result[0]["intermediate_series"]
            ) {
              current_num = voucher_result[0]["current_num"];
              new_number =
                parseInt(voucher_result[0]["postfix"]) +
                parseInt(voucher_result[0]["increment_by"]);
              complete_number =
                voucher_result[0]["prefix"] +
                voucher_result[0]["numgen_seperator"] +
                current_year +
                voucher_result[0]["numgen_seperator"] +
                new_number;
            }

            _mysql
              .executeQueryWithTransaction({
                query: `update finance_numgen set pervious_num=current_num,current_num=?,\
                    postfix=?,updated_by=?,updated_date=? ${str} where finance_numgen_id=?;`,

                values: [
                  complete_number,
                  new_number,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  voucher_result[0]["finance_numgen_id"]
                ],
                printQuery: false
              })
              .then(result => {
                if (result.affectedRows > 0) {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      voucher_no: current_num
                    };
                    next();
                  });
                } else {
                  _mysql.rollBackTransaction(() => {
                    req.records = {
                      invalid_input: true,
                      message: "cant generate number "
                    };
                    next();
                  });
                }
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.rollBackTransaction(() => {
              req.records = {
                invalid_input: true,
                message: "Number Generation series not Found"
              };
              next();
            });
          }
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    }
  },
  //created by irfan:
  getVoucherNoOLD: (req, res, next) => {
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
  getCostCentersBAKUPDEC20: (req, res, next) => {
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
  },

  //created by irfan:
  authorizeVoucher: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;

    if (req.userIdentity.finance_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql
      })
        .then(option => {
          if (
            req.userIdentity.finance_authorize_privilege < option.MaxAuth ||
            input.auth_level < option.MaxAuth
          ) {
            getFinanceAuthFields(input["auth_level"]).then(authFields => {
              if (input.auth_status == "A" && input.voucher_header_id > 0) {
                _mysql
                  .executeQuery({
                    query:
                      "select VD.debit_amount,VD.child_id,VD.credit_amount,VD.payment_type,H.root_id,VD.hospital_id\
                      ,C.child_name from finance_voucher_details VD\
                      inner join finance_account_head H on VD.head_id=H.finance_account_head_id\
                       inner join finance_account_child C on VD.child_id=C.finance_account_child_id\
                      where voucher_header_id=? and auth_status='P';",
                    values: [input.voucher_header_id],
                    printQuery: false
                  })
                  .then(result => {
                    if (result.length > 0) {
                      const child_ids = [];
                      result.forEach(child => {
                        child_ids.push(child.child_id);
                      });

                      new Promise((resolve, reject) => {
                        _mysql
                          .executeQuery({
                            query:
                              "select child_id,coalesce(sum(credit_amount)- sum(debit_amount),0) as cred_minus_deb,\
                            coalesce(sum(debit_amount)-sum(credit_amount),0) as deb_minus_cred\
                          from finance_voucher_details \
                          where auth_status='A' and child_id in (?) group by child_id;",
                            values: [child_ids],
                            printQuery: false
                          })
                          .then(closeBalance => {
                            let internal_eror = false;
                            //ST-closing balance CHECK
                            result.forEach(entry => {
                              //checking debit balance for asset and expence
                              if (
                                (entry.root_id == 1 || entry.root_id == 5) &&
                                entry.payment_type == "CR"
                              ) {
                                let ledger = closeBalance.find(f => {
                                  return f.child_id == entry.child_id;
                                });

                                if (ledger != undefined) {
                                  const temp =
                                    parseFloat(ledger.deb_minus_cred) -
                                    parseFloat(entry.credit_amount);

                                  if (temp < 0) {
                                    internal_eror = true;
                                    req.records = {
                                      invalid_user: true,
                                      message: `${entry.child_name} doesn't have debit balance`
                                    };
                                    next();
                                    return;
                                  } else {
                                    ledger.deb_minus_cred = temp;
                                  }
                                } else {
                                  internal_eror = true;
                                  req.records = {
                                    invalid_user: true,
                                    message: `${entry.child_name} doesn't have debit balance`
                                  };
                                  next();
                                  return;
                                }
                              }
                              //checking credit balance for liabilty,capital and income
                              else if (
                                (entry.root_id == 2 ||
                                  entry.root_id == 3 ||
                                  entry.root_id == 4) &&
                                entry.payment_type == "DR"
                              ) {
                                let ledger = closeBalance.find(f => {
                                  return f.child_id == entry.child_id;
                                });

                                if (ledger != undefined) {
                                  const temp =
                                    parseFloat(ledger.cred_minus_deb) -
                                    parseFloat(entry.debit_amount);

                                  if (temp < 0) {
                                    internal_eror = true;
                                    req.records = {
                                      invalid_user: true,
                                      message: `${entry.child_name} doesn't have credit balance`
                                    };
                                    next();
                                    return;
                                  } else {
                                    ledger.deb_minus_cred = temp;
                                  }
                                } else {
                                  internal_eror = true;
                                  req.records = {
                                    invalid_user: true,
                                    message: `${entry.child_name} doesn't have credit balance`
                                  };
                                  next();
                                  return;
                                }
                              }
                            });

                            //END-closing balance CHECK
                            if (internal_eror == false) {
                              resolve({});
                            } else {
                              next();
                            }
                          })
                          .catch(error => {
                            _mysql.releaseConnection();
                            next(error);
                          });
                      }).then(res => {
                        // code comes here
                        _mysql
                          .executeQuery({
                            query:
                              "update finance_voucher_details set " +
                              authFields +
                              "  where voucher_header_id=?",

                            values: [
                              "Y",
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              input.voucher_header_id
                            ],
                            printQuery: false
                          })
                          .then(authResult => {
                            _mysql.releaseConnection();
                            req.records = authResult;
                            next();
                          })
                          .catch(error => {
                            _mysql.releaseConnection();
                            next(error);
                          });
                      });
                    } else {
                      req.records = {
                        invalid_user: true,
                        message: "data not found"
                      };
                      next();
                    }
                    //---------
                  })
                  .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else if (
                input.auth_status == "R" &&
                input.voucher_header_id > 0
              ) {
                _mysql
                  .executeQuery({
                    query:
                      "update finance_voucher_details set \
                      auth_status=?,rejected_by=?,rejected_date=?,rejected_reason=? where voucher_header_id=? and auth_status='P';",

                    values: [
                      "R",
                      req.userIdentity.algaeh_d_app_user_id,

                      new Date(),
                      input.rejected_reason,
                      input.voucher_header_id
                    ],
                    printQuery: false
                  })
                  .then(authResult => {
                    _mysql.releaseConnection();
                    req.records = authResult;
                    next();
                  })
                  .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else {
                req.records = {
                  invalid_user: true,
                  message: "Please provide valid input"
                };
                next();
              }
            });
          } else if (
            req.userIdentity.finance_authorize_privilege >= option.MaxAuth &&
            input.auth_level >= option.MaxAuth
          ) {
            getFinanceAuthFields(input["auth_level"]).then(authFields => {
              if (input.auth_status == "A" && input.voucher_header_id > 0) {
                _mysql
                  .executeQuery({
                    query:
                      "select VD.debit_amount,VD.child_id,VD.credit_amount,VD.payment_type,H.root_id,VD.hospital_id\
                      ,C.child_name from finance_voucher_details VD\
                    inner join finance_account_head H on VD.head_id=H.finance_account_head_id\
                    inner join finance_account_child C on VD.child_id=C.finance_account_child_id\
                    where voucher_header_id=? and auth_status='P';",
                    values: [input.voucher_header_id],
                    printQuery: false
                  })
                  .then(result => {
                    let total_income = 0;
                    let total_expense = 0;
                    let balance = 0;

                    if (result.length > 0) {
                      const child_ids = [];
                      result.forEach(child => {
                        child_ids.push(child.child_id);
                      });

                      new Promise((resolve, reject) => {
                        _mysql
                          .executeQuery({
                            query:
                              "select child_id,coalesce(sum(credit_amount)- sum(debit_amount),0) as cred_minus_deb,\
                            coalesce(sum(debit_amount)-sum(credit_amount),0) as deb_minus_cred\
                          from finance_voucher_details \
                          where auth_status='A' and child_id in (?) group by child_id;",
                            values: [child_ids],
                            printQuery: false
                          })
                          .then(closeBalance => {
                            let internal_eror = false;
                            //ST-closing balance CHECK
                            result.forEach(entry => {
                              //checking debit balance for asset and expence
                              if (
                                (entry.root_id == 1 || entry.root_id == 5) &&
                                entry.payment_type == "CR"
                              ) {
                                let ledger = closeBalance.find(f => {
                                  return f.child_id == entry.child_id;
                                });

                                if (ledger != undefined) {
                                  const temp =
                                    parseFloat(ledger.deb_minus_cred) -
                                    parseFloat(entry.credit_amount);

                                  if (temp < 0) {
                                    internal_eror = true;
                                    req.records = {
                                      invalid_user: true,
                                      message: `${entry.child_name} doesn't have debit balance`
                                    };
                                    next();
                                    return;
                                  } else {
                                    ledger.deb_minus_cred = temp;
                                  }
                                } else {
                                  internal_eror = true;
                                  req.records = {
                                    invalid_user: true,
                                    message: `${entry.child_name} doesn't have debit balance`
                                  };
                                  next();
                                  return;
                                }
                              }
                              //checking credit balance for liabilty,capital and income
                              else if (
                                (entry.root_id == 2 ||
                                  entry.root_id == 3 ||
                                  entry.root_id == 4) &&
                                entry.payment_type == "DR"
                              ) {
                                let ledger = closeBalance.find(f => {
                                  return f.child_id == entry.child_id;
                                });

                                if (ledger != undefined) {
                                  const temp =
                                    parseFloat(ledger.cred_minus_deb) -
                                    parseFloat(entry.debit_amount);

                                  if (temp < 0) {
                                    internal_eror = true;
                                    req.records = {
                                      invalid_user: true,
                                      message: `${entry.child_name} doesn't have credit balance`
                                    };
                                    next();
                                    return;
                                  } else {
                                    ledger.deb_minus_cred = temp;
                                  }
                                } else {
                                  internal_eror = true;
                                  req.records = {
                                    invalid_user: true,
                                    message: `${entry.child_name} doesn't have credit balance`
                                  };
                                  next();
                                  return;
                                }
                              }
                            });

                            //END-closing balance CHECK
                            if (internal_eror == false) {
                              resolve({});
                            } else {
                              next();
                            }
                          })
                          .catch(error => {
                            _mysql.releaseConnection();
                            next(error);
                          });
                      }).then(res => {
                        console.log("res:", res);
                        //ST-profit and loss calculation
                        result.forEach(m => {
                          if (m.root_id == 4) {
                            if (m.payment_type == "CR") {
                              total_income =
                                parseFloat(total_income) +
                                parseFloat(m.credit_amount);
                            } else if (m.payment_type == "DR") {
                              total_income =
                                parseFloat(total_income) -
                                parseFloat(m.debit_amount);
                            }
                          } else if (m.root_id == 5) {
                            if (m.payment_type == "DR") {
                              total_expense =
                                parseFloat(total_expense) +
                                parseFloat(m.debit_amount);
                            } else if (m.payment_type == "CR") {
                              total_expense =
                                parseFloat(total_expense) -
                                parseFloat(m.credit_amount);
                            }
                          }
                        });
                        //END-profit and loss calculation
                        balance =
                          parseFloat(total_income) - parseFloat(total_expense);

                        let pl_account = "";
                        if (balance > 0) {
                          pl_account = {
                            payment_date: new Date(),
                            head_id: 61,
                            child_id: 51,
                            debit_amount: 0,
                            credit_amount: balance,
                            payment_type: "CR",
                            hospital_id: result[0]["hospital_id"],
                            year: moment().format("YYYY"),
                            month: moment().format("M")
                          };
                        } else if (balance < 0) {
                          pl_account = {
                            payment_date: new Date(),
                            head_id: 61,
                            child_id: 51,
                            debit_amount: Math.abs(balance),
                            credit_amount: 0,
                            payment_type: "DR",
                            hospital_id: result[0]["hospital_id"],
                            year: moment().format("YYYY"),
                            month: moment().format("M")
                          };
                        }

                        let strQry = "";

                        if (pl_account != "") {
                          strQry += _mysql.mysqlQueryFormat(
                            "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
                            payment_type,hospital_id,year,month,pl_entry,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                            [
                              pl_account.payment_date,
                              pl_account.head_id,
                              pl_account.child_id,
                              pl_account.debit_amount,
                              pl_account.credit_amount,
                              pl_account.payment_type,
                              pl_account.hospital_id,
                              pl_account.year,
                              pl_account.month,
                              "Y",
                              req.userIdentity.algaeh_d_app_user_id,
                              "A"
                            ]
                          );
                        }

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "update finance_voucher_details set " +
                              authFields +
                              ", auth_status='A'  where voucher_header_id=? and auth_status='P';" +
                              strQry,
                            values: [
                              "Y",
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              input.voucher_header_id
                            ],
                            printQuery: false
                          })
                          .then(authResult => {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = authResult;
                              next();
                            });
                          })
                          .catch(error => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      });
                    } else {
                      req.records = {
                        invalid_user: true,
                        message: "data not found"
                      };
                      next();
                    }
                    //---------
                  })
                  .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else if (
                input.auth_status == "R" &&
                input.voucher_header_id > 0
              ) {
                _mysql
                  .executeQuery({
                    query:
                      "update finance_voucher_details set \
                      auth_status=?,rejected_by=?,rejected_date=?,rejected_reason=? where voucher_header_id=? and auth_status='P';",

                    values: [
                      "R",
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      input.rejected_reason,

                      input.voucher_header_id
                    ],
                    printQuery: false
                  })
                  .then(authResult => {
                    _mysql.releaseConnection();
                    req.records = authResult;
                    next();
                  })
                  .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else {
                req.records = {
                  invalid_user: true,
                  message: "Please provide valid input"
                };
                next();
              }
            });
          } else {
            req.records = {
              invalid_user: true,
              message: "you dont have authorization privilege"
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
        invalid_user: true,
        message: "you dont have authorization privilege"
      };
      next();
    }
  },

  //created by irfan:
  getVouchersToAuthorize: (req, res, next) => {
    const _mysql = new algaehMysql();

    const input = req.query;
    if (input.auth_level > 0 && input.auth_level <= 2) {
      let strQry = "";

      switch (input.auth_status) {
        case "R":
          strQry += " and VD.auth_status='R' ";
          break;
        case "A":
          strQry += " and VD.auth_status='A' ";
          break;
        default:
          strQry += " and VD.auth_status='P' ";
      }
      // if (input.hospital_id) {
      //   strQry += ` and VD.hospital_id=${input.hospital_id} `;
      // }
      if (
        moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
        moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
      ) {
        strQry += ` and H.payment_date  between date('${input.from_date}') and date('${input.to_date}') `;
      }

      // if (input.voucher_no != undefined && input.voucher_no != null) {
      //   strQry += ` and H.voucher_no ='${input.voucher_no}'`;
      // }

      // if (input.voucher_type != undefined && input.voucher_type != null) {
      //   strQry += ` and H.voucher_type ='${input.voucher_type}'`;
      // }

      if (input.auth_status == "P" && input.auth_level == 1) {
        strQry += ` and VD.auth1 ='N'`;
      } else if (input.auth_status == "P" && input.auth_level == 2) {
        strQry += ` and VD.auth1 ='Y' and VD.auth2 ='N'`;
      }

      _mysql
        .executeQuery({
          query: `select distinct finance_voucher_header_id,voucher_type,amount,H.payment_date,\
          narration,voucher_no,VD.auth_status ,U.username as entered_by from finance_voucher_header H\
          inner join finance_voucher_details VD on H.finance_voucher_header_id=VD.voucher_header_id\
          left join algaeh_d_app_user U on VD.entered_by=U.algaeh_d_app_user_id
          where posted_from='V'   ${strQry};`
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
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide auth level"
      };
      next();
    }
  },
  //created by irfan:
  getVouchersDetailsToAuthorize: (req, res, next) => {
    const _mysql = new algaehMysql();

    const input = req.query;

    _mysql
      .executeQuery({
        query:
          "select finance_voucher_id, debit_amount,credit_amount,concat(H.account_name,'->',C.child_name) as ledger\
          from finance_voucher_details VD \
          left join finance_account_head H on VD.head_id=H.finance_account_head_id\
          left join finance_account_child C on VD.child_id=C.finance_account_child_id\
          where VD.voucher_header_id=?; ",
        values: [input.finance_voucher_header_id]
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

// select head_office_id,H.hospital_name as head_office,
// case cost_center_type when 'P' then 'project wise' when 'SD' then
// 'sub department wise' else 'None' end as cost_center_type
//  from finance_options F
// left join hims_d_hospital H on F.head_office_id=H.hims_d_hospital_id

//created by irfan: to get database field for authrzation
function getFinanceAuthFields(auth_level) {
  return new Promise((resolve, reject) => {
    let authFields;

    switch (auth_level.toString()) {
      case "1":
        authFields = ["auth1=?", "auth1_by=?", "auth1_date=?"];
        break;

      case "2":
        authFields = ["auth2=?", "auth2_by=?", "auth2_date=?"];
        break;

      default:
    }

    resolve(authFields);
  });
}
