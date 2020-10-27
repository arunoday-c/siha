import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
// import axios from "axios";
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
// export function multipleInvoices(req, res, next) {
//   const inputs = req.body;
//   const reqHeaders = req.headers;
//   const { merdgeRecords, details } = inputs;
//   let sendArray = [];
//   for (let i = 0; i < merdgeRecords.length; i++) {
//     let indetails = { ...inputs };
//     const { balance_amount, invoice_no } = merdgeRecords[i];
//     const det = details.map((detail) => {
//       return {
//         ...detail,
//         amount: balance_amount,
//       };
//     });
//     indetails["details"] = det;
//     indetails["invoice_no"] = invoice_no;
//     sendArray.push(
//       axios({
//         url: "http://localhost:3007/api/v1/voucher/addVoucher",
//         method: "POST",
//         data: indetails,
//         headers: {
//           "x-api-key": reqHeaders["x-api-key"],
//           "x-client-ip": reqHeaders["x-client-ip"],
//           "x-branch": reqHeaders["x-branch"],
//         },
//       })
//     );
//   }
//   Promise.all(sendArray)
//     .then((result) => {
//       console.log("result", result);
//       next();
//     })
//     .catch((error) => {
//       next(error);
//     });
// }
export default {
  //created by irfan:
  addVoucher: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    const algaeh_d_app_user_id = req.userIdentity.algaeh_d_app_user_id;

    let voucher_type = "";

    let invoice_ref_no = null;

    let invoice_no = input.invoice_no;

    switch (input.voucher_type) {
      case "journal":
        voucher_type = "JOURNAL";
        break;
      case "contra":
        voucher_type = "CONTRA";
        break;
      case "receipt":
        voucher_type = "RECEIPT";
        invoice_ref_no = input.invoice_no;
        invoice_no = null;
        break;
      case "payment":
        voucher_type = "PAYMENT";
        invoice_ref_no = input.invoice_no;
        invoice_no = null;
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
      default:
        voucher_type = input.voucher_type.toUpperCase();
    }
    const { merdgeRecords } = input;
    if (voucher_type == "") {
      req.records = {
        invalid_input: true,
        message: "Please select voucher type"
      };
      next();
      return;
    } else {
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: [voucher_type],
          table_name: "finance_numgen"
        })
        .then(numgen => {
          let transaction_date = "";

          if (
            moment(input.transaction_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
          ) {
            transaction_date = input.transaction_date;
          } else {
            transaction_date = new Date();
          }

          let credit_amount = 0;
          let debit_amount = 0;
          // input.details.forEach((item) => {
          //   if (item.payment_type == "CR") {
          //     credit_amount =
          //       parseFloat(credit_amount) + parseFloat(item.amount);
          //     item["credit_amount"] = item.amount;
          //     item["debit_amount"] = 0;
          //   } else if (item.payment_type == "DR") {
          //     debit_amount = parseFloat(debit_amount) + parseFloat(item.amount);
          //     item["credit_amount"] = 0;
          //     item["debit_amount"] = item.amount;
          //   }
          // });
          credit_amount = _.chain(input.details)
            .filter(f => f.payment_type === "CR")
            .sumBy(s => {
              return parseFloat(s.amount);
            })
            .value();
          debit_amount = _.chain(input.details)
            .filter(f => f.payment_type === "DR")
            .sumBy(s => {
              return parseFloat(s.amount);
            })
            .value();

          if (credit_amount == debit_amount) {
            _mysql
              .executeQuery({
                query:
                  "SELECT cost_center_type,cost_center_required  FROM finance_options limit 1; "
              })
              .then(resul => {
                if (
                  resul.length == 1 &&
                  (resul[0]["cost_center_type"] == "P" ||
                    resul[0]["cost_center_type"] == "SD")
                ) {
                  /* commented by noor to intruduce detail level costcenter*/
                  // let project_cost_center = null;
                  // let subDept_cost_center = null;
                  // if (resul[0]["cost_center_type"] == "P") {
                  //   project_cost_center = input.cost_center_id;
                  // } else if (resul[0]["cost_center_type"] == "SD") {
                  //   subDept_cost_center = input.cost_center_id;
                  // }
                  const month = moment(transaction_date, "YYYY-MM-DD").format(
                    "M"
                  );
                  const year = moment(transaction_date, "YYYY-MM-DD").format(
                    "YYYY"
                  );


                  /* added by noor for detail level costcenters */
                  const cost_center_type = resul[0]["cost_center_type"];
                  const cost_center_required = resul[0]["cost_center_required"];
                  const newDetails = input.details.map(item => {
                    const {
                      cost_center_id,
                      slno,
                      payment_mode,
                      sourceName,
                      amount,
                      hims_d_hospital_id,
                      ...rest
                    } = item;
                    const typeSel =
                      cost_center_type === "P"
                        ? {
                          project_id: cost_center_id,
                          sub_department_id: null
                        }
                        : cost_center_type === "SD"
                          ? {
                            project_id: null,
                            sub_department_id: cost_center_id
                          }
                          : {};

                    return {
                      ...rest,
                      ...typeSel,
                      debit_amount: item.payment_type === "DR" ? amount : 0,
                      credit_amount: item.payment_type === "CR" ? amount : 0,
                      payment_date: transaction_date,
                      month: month,
                      year: year,
                      entered_by: algaeh_d_app_user_id,
                      hospital_id:
                        cost_center_required === "Y"
                          ? hims_d_hospital_id
                          : input.hospital_id
                    };
                  });

                  let cheque_date = null;
                  let ref_no = null;
                  let payment_mode = "N";
                  switch (input.payment_mode) {
                    case "CASH":
                    case "CHEQUE":
                    case "RTGS":
                    case "NEFT":
                    case "IMPS":
                      payment_mode = input.payment_mode;
                  }

                  if (
                    input.cheque_date != null &&
                    input.cheque_date != undefined
                  ) {
                    cheque_date = input.cheque_date;
                  }
                  if (input.ref_no != null && input.ref_no != undefined) {
                    ref_no = input.ref_no;
                  }
                  const isMultipleInvoices =
                    input.receipt_type === undefined ? "S" : input.receipt_type;

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO `finance_voucher_header` (payment_mode,ref_no,cheque_date,amount, payment_date, month, year,\
                       narration, voucher_no, voucher_type,from_screen,invoice_no,invoice_ref_no,posted_from,\
                       created_by, updated_by, created_date, updated_date,receipt_type)\
                       VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        payment_mode,
                        ref_no,
                        cheque_date,
                        credit_amount,
                        transaction_date,
                        month,
                        year,
                        input.narration,
                        numgen[voucher_type],
                        input.voucher_type,
                        input.from_screen,
                        invoice_no,
                        invoice_ref_no,
                        "V",
                        req.userIdentity.algaeh_d_app_user_id,
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        new Date(),
                        isMultipleInvoices
                      ],
                      printQuery: true
                    })
                    .then(result => {
                      // const IncludeValues = ["amount", "payment_mode"];
                      // const insertColumns = [
                      //   "head_id",
                      //   "child_id",
                      //   "debit_amount",
                      //   "credit_amount",
                      //   "payment_type",
                      //   "hospital_id",
                      //   "project_id",
                      //   "sub_department_id"
                      // ];
                      let arrCounter = [];
                      if (isMultipleInvoices === "M") {
                        let queryString = "";
                        for (let i = 0; i < merdgeRecords.length; i++) {
                          const {
                            balance_amount,
                            invoice_no,
                            voucher_type
                          } = merdgeRecords[i];
                          queryString += _mysql.mysqlQueryFormat(
                            "insert into finance_voucher_sub_header(finance_voucher_header_id,invoice_ref_no,amount,voucher_type)value(?,?,?,?);",
                            [
                              result.insertId,
                              invoice_no,
                              balance_amount,
                              voucher_type
                            ]
                          );
                          newDetails.forEach(item => {
                            const { amount, ...rest } = item;
                            arrCounter.push({
                              ...rest,
                              debit_amount:
                                item.payment_type === "DR" ? balance_amount : 0,
                              credit_amount:
                                item.payment_type === "CR" ? balance_amount : 0
                            });
                          });
                        }
                        _mysql
                          .executeQueryWithTransaction({
                            query: queryString
                          })
                          .then(resultsubheader => {
                            //Done.....
                            // console.log("Subdetails are inserted");
                          })
                          .catch(error => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                            return;
                          });
                      } else {
                        arrCounter = newDetails;
                      }
                      // console.log("arrCounter", arrCounter);
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "insert into finance_voucher_details (??) values ?;",
                          values: arrCounter,
                          // values: input.details,
                          // includeValues: insertColumns,
                          bulkInsertOrUpdate: true,
                          printQuery: true,
                          excludeValues: ["disabled", "paytypedisable"],
                          extraValues: {
                            voucher_header_id: result.insertId,
                            hospital_id: input.hospital_id
                          }
                          // extraValues: {
                          //   payment_date: transaction_date,
                          //   month: month,
                          //   year: year,
                          //   voucher_header_id: result.insertId,
                          //   entered_by: algaeh_d_app_user_id,
                          //   hospital_id: input.hospital_id,
                          //   project_id: project_cost_center,
                          //   sub_department_id: subDept_cost_center
                          // }
                        })
                        .then(result2 => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = {
                              voucher_no: numgen[voucher_type]
                            };
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
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.rollBackTransaction(() => {
                    req.records = {
                      invalid_input: true,
                      message: "Please Define cost center type"
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
                message: "Credit and Debit Amount are not equal"
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
  authorizeVoucherBKP_JAN_28_2020: (req, res, next) => {
    //const utilities = new algaehUtilities();
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
                        // console.log("res:", res);
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
                            head_id: 3,
                            child_id: 1,
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
                            head_id: 3,
                            child_id: 1,
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
  authorizeVoucher: (req, res, next) => {
    // const utilities = new algaehUtilities();
    let input = req.body;

    if (
      req.userIdentity.role_type === "SU" ||
      req.userIdentity.finance_authorize_privilege != "N"
    ) {
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
                      where voucher_header_id=? and auth_status='P';SELECT allow_negative_balance FROM finance_options;",
                    values: [input.voucher_header_id],
                    printQuery: false
                  })
                  .then(results => {
                    const result = results[0];

                    const options = results[1][0];
                    if (result.length > 0) {
                      new Promise((resolve, reject) => {
                        if (options.allow_negative_balance == "Y") {
                          resolve({});
                        } else {
                          const child_ids = [];
                          result.forEach(child => {
                            child_ids.push(child.child_id);
                          });

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
                        }
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
                              moment().format("YYYY-MM-DD"),
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
            req.userIdentity.role_type === "SU" ||
            (req.userIdentity.finance_authorize_privilege >= option.MaxAuth &&
              input.auth_level >= option.MaxAuth)
          ) {
            getFinanceAuthFields(input["auth_level"]).then(authFields => {
              if (input.auth_status == "A" && input.voucher_header_id > 0) {
                _mysql
                  .executeQuery({
                    query:
                      "select VD.debit_amount,amount,voucher_type,invoice_ref_no,VD.child_id,VD.credit_amount,VD.payment_type,H.root_id,VD.hospital_id\
                      ,C.child_name,VH.receipt_type from finance_voucher_header VH inner join finance_voucher_details VD on VH.finance_voucher_header_id=VD.voucher_header_id\
                    inner join finance_account_head H on VD.head_id=H.finance_account_head_id\
                    inner join finance_account_child C on VD.child_id=C.finance_account_child_id\
                    where voucher_header_id=? and auth_status='P';SELECT allow_negative_balance FROM finance_options;",
                    values: [input.voucher_header_id],
                    printQuery: false
                  })
                  .then(results => {
                    const result = results[0];
                    const options = results[1][0];
                    let total_income = 0;
                    let total_expense = 0;
                    let balance = 0;

                    if (result.length > 0) {
                      new Promise((resolve, reject) => {
                        if (options.allow_negative_balance == "Y") {
                          resolve({});
                        } else {
                          const child_ids = [];
                          result.forEach(child => {
                            child_ids.push(child.child_id);
                          });
                          _mysql
                            .executeQuery({
                              query:
                                "select child_id,coalesce(sum(credit_amount)- sum(debit_amount),0) as cred_minus_deb,\
                            coalesce(sum(debit_amount)-sum(credit_amount),0) as deb_minus_cred\
                          from finance_voucher_details \
                          where auth_status='A' and child_id in (?) group by child_id;",
                              values: [child_ids],
                              printQuery: true
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
                        }
                      }).then(res => {
                        // console.log("res:", res);
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
                            head_id: 3,
                            child_id: 1,
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
                            head_id: 3,
                            child_id: 1,
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
                            payment_type,hospital_id,year,month,pl_entry,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?);",
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
                        let updateQry = "";
                        new Promise((resolve, reject) => {
                          // PAYMENT AGAINST OLD PENDING VOUCHER
                          if (result[0]["invoice_ref_no"] != null) {
                            const hasMultiple = result[0]["receipt_type"];
                            let queryType = "select 1";
                            if (hasMultiple === "M") {
                              queryType = _mysql.mysqlQueryFormat(
                                "select finance_voucher_header_id,finance_voucher_sub_header_id,invoice_ref_no,amount from finance_voucher_sub_header where finance_voucher_header_id=?",
                                [input.voucher_header_id]
                              );
                            }
                            _mysql
                              .executeQuery({
                                query: queryType
                              })
                              .then(subHeaderResult => {
                                let ref_no_headers = [];
                                if (hasMultiple === "M") {
                                  ref_no_headers = subHeaderResult.map(item => {
                                    return item.invoice_ref_no;
                                  });
                                } else {
                                  ref_no_headers.push(
                                    result[0]["invoice_ref_no"]
                                  );
                                }

                                _mysql
                                  .executeQuery({
                                    query:
                                      "select finance_voucher_header_id,voucher_no, voucher_type,amount,settlement_status,settled_amount,invoice_no\
                               from finance_voucher_header where invoice_no in(?) and voucher_type in ('purchase' ,'sales') and settlement_status='P';",
                                    values: [ref_no_headers],
                                    printQuery: true
                                  })
                                  .then(BalanceInvoice => {
                                    if (
                                      result[0]["voucher_type"] ==
                                      "credit_note" ||
                                      result[0]["voucher_type"] ==
                                      "debit_note" ||
                                      result[0]["voucher_type"] == "payment" ||
                                      result[0]["voucher_type"] == "receipt"
                                    ) {
                                      for (
                                        let b = 0;
                                        b < BalanceInvoice.length;
                                        b++
                                      ) {
                                        const {
                                          settled_amount,
                                          finance_voucher_header_id,
                                          voucher_no,
                                          invoice_no
                                        } = BalanceInvoice[b];
                                        let head_amount = result[0]["amount"];
                                        if (hasMultiple === "M") {
                                          const oneRecord = subHeaderResult.find(
                                            f =>
                                              f.invoice_ref_no === voucher_no ||
                                              f.invoice_ref_no === invoice_no
                                          );

                                          head_amount = oneRecord.amount;
                                        }
                                        //     const total_paid_amount =
                                        //       parseFloat(settled_amount) +
                                        //       parseFloat(head_amount);

                                        //     if (
                                        //       parseFloat(head_amount) ==
                                        //       total_paid_amount
                                        //     ) {
                                        //       updateQry += `update finance_voucher_header set settlement_status=if(settled_amount+${parseFloat(
                                        //         head_amount
                                        //       )}=amount,'S','P'),settled_amount=settled_amount+${parseFloat(
                                        //         head_amount
                                        //       )} where finance_voucher_header_id=${finance_voucher_header_id};`;
                                        //     } else {
                                        //       updateQry += `update finance_voucher_header set settled_amount=settled_amount+${parseFloat(
                                        //         head_amount
                                        //       )}, updated_date='${moment().format(
                                        //         "YYYY-MM-DD"
                                        //       )}',
                                        //  updated_by= ${
                                        //    req.userIdentity.algaeh_d_app_user_id
                                        //  } where finance_voucher_header_id=${finance_voucher_header_id};`;
                                        //     }
                                        updateQry += `update finance_voucher_header set settlement_status=if(settled_amount+${parseFloat(
                                          head_amount
                                        )}=amount,'S','P'),settled_amount=settled_amount+${parseFloat(
                                          head_amount
                                        )},updated_date='${moment().format(
                                          "YYYY-MM-DD"
                                        )}',updated_by=${
                                          req.userIdentity.algaeh_d_app_user_id
                                          } where finance_voucher_header_id=${finance_voucher_header_id};`;
                                      }

                                      // if (hasMultiple === "M") {
                                      //   updateQry += `update finance_voucher_header set settlement_status='S',settled_amount=amount
                                      //   where finance_voucher_header_id=${input.voucher_header_id};`;
                                      // }
                                    }

                                    resolve({});
                                  })
                                  .catch(error => {
                                    _mysql.releaseConnection();
                                    next(error);
                                  });
                              })
                              .catch(error => {
                                _mysql.releaseConnection();
                                next(error);
                              });

                            // _mysql
                            //   .executeQuery({
                            //     query:
                            //       "select finance_voucher_header_id, voucher_type,amount,settlement_status,settled_amount\
                            //     from finance_voucher_header where invoice_no=? and voucher_type in ('purchase' ,'sales') and settlement_status='P';",
                            //     values: [result[0]["invoice_ref_no"]],
                            //     printQuery: true,
                            //   })
                            //   .then((BalanceInvoice) => {
                            //     if (
                            //       result[0]["voucher_type"] == "credit_note" ||
                            //       result[0]["voucher_type"] == "debit_note" ||
                            //       result[0]["voucher_type"] == "payment" ||
                            //       result[0]["voucher_type"] == "receipt"
                            //     ) {
                            //       const total_paid_amount =
                            //         parseFloat(
                            //           BalanceInvoice[0]["settled_amount"]
                            //         ) + parseFloat(result[0]["amount"]);

                            //       if (
                            //         parseFloat(BalanceInvoice[0]["amount"]) ==
                            //         total_paid_amount
                            //       ) {
                            //         updateQry = `update finance_voucher_header set settlement_status='S',settled_amount=settled_amount+${parseFloat(
                            //           result[0]["amount"]
                            //         )} where finance_voucher_header_id=${
                            //           BalanceInvoice[0][
                            //             "finance_voucher_header_id"
                            //           ]
                            //         };`;
                            //       } else {
                            //         updateQry = `update finance_voucher_header set settled_amount=settled_amount+${parseFloat(
                            //           result[0]["amount"]
                            //         )}, updated_date='${moment().format(
                            //           "YYYY-MM-DD"
                            //         )}',
                            //         updated_by= ${
                            //           req.userIdentity.algaeh_d_app_user_id
                            //         } where finance_voucher_header_id=${
                            //           BalanceInvoice[0][
                            //             "finance_voucher_header_id"
                            //           ]
                            //         };`;
                            //       }
                            //     }

                            //     resolve({});
                            //   })
                            //   .catch((error) => {
                            //     _mysql.releaseConnection();
                            //     next(error);
                            //   });
                          } else {
                            resolve({});
                          }
                        }).then(Invoc => {
                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "update finance_voucher_details set " +
                                authFields +
                                ", auth_status='A'  where voucher_header_id=? and auth_status='P';" +
                                strQry +
                                "" +
                                updateQry,
                              values: [
                                "Y",
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                input.voucher_header_id
                              ],
                              printQuery: true
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
    const decimal_places = req.userIdentity.decimal_places;
    if (input.auth_level > 0 && input.auth_level <= 2) {
      let strQry = "";

      switch (input.auth_status) {
        case "R":
          strQry += " and VD.auth_status='R' ";
          break;
        case "A":
          strQry += " and VD.auth_status='A' ";
          break;
        case "P":
          strQry += " and VD.auth_status='P' ";
          break;
        default:
          strQry += "";
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
          query: `select distinct finance_voucher_header_id,voucher_type, ROUND(amount,${decimal_places}) as amount,H.payment_date,\
          H.narration,voucher_no,payment_mode, ref_no, H.cheque_date,   VD.auth_status ,U.username as entered_by from finance_voucher_header H\
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
    const decimal_places = req.userIdentity.decimal_places;
    const input = req.query;

    _mysql
      .executeQuery({
        query: `select finance_voucher_id,ROUND( debit_amount,${decimal_places}) as debit_amount,
          ROUND( credit_amount,${decimal_places}) as credit_amount,VD.narration,
          concat(H.account_name,'->',C.child_name) as ledger\
          from finance_voucher_details VD \
          left join finance_account_head H on VD.head_id=H.finance_account_head_id\
          left join finance_account_child C on VD.child_id=C.finance_account_child_id\
          inner join finance_voucher_header FH on FH.finance_voucher_header_id=VD.voucher_header_id
          where VD.voucher_header_id=? order by payment_type; `,
        values: [input.finance_voucher_header_id],
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
  getVoucherNo: (req, res, next) => {
    const _mysql = new algaehMysql();
    //ss
    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["OP_CRD", "OP_CBIL"],
        table_name: "hims_f_app_numgen"
      })
      .then(result => {
        _mysql.commitTransaction(() => {
          req.records = result;
          next();
        });
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  //created by irfan:
  getUnSettledInvoices: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    let voucher_type = "";
    let str = "";
    if (input.text != undefined && input.text != "") {
      str = ` and invoice_no like '%${input.text}%'`;
    }

    switch (input.voucher_type) {
      case "payment":
      case "debit_note":
        voucher_type = "purchase";
        break;
      case "receipt":
      case "credit_note":
        voucher_type = "sales";
        break;
    }

    if (voucher_type == "") {
      req.records = {
        invalid_input: true,
        message: "Please Select Proper Voucher Type"
      };
      next();
    } else {
      _mysql
        .executeQuery({
          query: `select distinct finance_voucher_header_id,invoice_no from
        finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id
        and D.auth_status='A' where voucher_type='${voucher_type}' and
        settlement_status='P' and invoice_no is not null ${str}; `
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
