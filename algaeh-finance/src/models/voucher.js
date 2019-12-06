import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  addVoucher: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

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
        credit_amount = parseFloat(credit_amount) + parseFloat(amount);
      } else if (item.payment_type == "DR") {
        debit_amount = parseFloat(debit_amount) + parseFloat(amount);
      }
    });

    if (credit_amount === debit_amount) {
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO `finance_day_end_header` (transaction_date,amount,voucher_type,voucher_no,\
            from_screen,refrence_no,transaction_type,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?)",
          values: [
            transaction_date,
            input.amount,
            input.voucher_type,
            input.voucher_no,
            input.from_screen,
            input.refrence_no,
            "JV",
            req.userIdentity.hospital_id
          ]
        })
        .then(result => {
          const month = moment(transaction_date, "YYYY-MM-DD").format("M");
          const year = moment(transaction_date, "YYYY-MM-DD").format("YYYY");
          const IncludeValuess = [
            "day_end_header_id",
            "payment_date",
            "head_account_code",
            "head_id",
            "child_id",
            "debit_amount",
            "payment_type",
            "credit_amount",
            "narration",
            "hospital_id"
          ];
          _mysql
            .executeQueryWithTransaction({
              query: "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ",
              values: insertSubDetail,
              includeValues: IncludeValuess,
              bulkInsertOrUpdate: true,
              extraValues: {
                year: year,
                month: month,
                entered_date: new Date(),
                entered_by: req.userIdentity.algaeh_d_app_user_id,
                day_end_header_id: result.insertId
              },
              printQuery: false
            })
            .then(subResult => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "SELECT encounter_id  FROM algaeh_d_app_config where algaeh_d_app_config_id=12 FOR UPDATE;\
                      UPDATE algaeh_d_app_config SET encounter_id = encounter_id + 1 where algaeh_d_app_config_id=12;"
                })
                .then(updte_result => {
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
      req.records = {
        invalid_input: true,
        message: "Credit and Debit Amount are not equal"
      };
      next();
    }
  },
  //created by irfan:
  getVoucherNo_BAKUP: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
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
  getVoucherNo: (req, res, next) => {
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
  }
};
