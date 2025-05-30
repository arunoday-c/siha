import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  getReceiptEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      // utilities
      //   .logger()
      //   .log("getReceiptEntry: ", req.records.hims_f_receipt_header_id);
      let hims_f_receipt_header_id =
        req.records.hims_f_receipt_header_id ||
        req.records[0].receipt_header_id;
      _mysql
        .executeQuery({
          query:
            "select * from hims_f_receipt_header where hims_f_receipt_header_id=? and record_status='A'",
          values: [hims_f_receipt_header_id],
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_receipt_details where hims_f_receipt_header_id=? and record_status='A'",
                values: [hims_f_receipt_header_id],
                printQuery: true,
              })
              .then((receiptdetails) => {
                _mysql.releaseConnection();
                req.receptEntry = {
                  ...headerResult[0],
                  ...{ receiptdetails },
                };
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

      const utilities = new algaehUtilities();

      let Module_Name = "";
      //Advance
      if (inputParam.pay_type == "R") {
        Module_Name = "RECEIPT";
      } else if (inputParam.pay_type == "P") {
        Module_Name = "REFUND";
      }
      // utilities.logger().log("inputParam pay_type: ", inputParam.pay_type);
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: [Module_Name],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };

          req.query.receipt_number = generatedNumbers[Module_Name];
          req.body.receipt_number = generatedNumbers[Module_Name];
          inputParam.receipt_number = generatedNumbers[Module_Name];
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
                created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type,hospital_id) VALUES (?,?,?\
                ,?,?,?,?,?,?,?,?,?)",
              values: [
                inputParam.receipt_number,
                new Date(),
                inputParam.billing_header_id,
                inputParam.total_amount,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.counter_id,
                inputParam.shift_id,
                inputParam.pay_type,
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((headerRcptResult) => {
              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                req.body.receipt_header_id = headerRcptResult.insertId;
                const receptSample = [
                  "card_check_number",
                  "bank_card_id",
                  "expiry_date",
                  "pay_type",
                  "amount",
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_receipt_details(??) VALUES ?",
                    values: inputParam.receiptdetails,
                    includeValues: receptSample,
                    extraValues: {
                      hims_f_receipt_header_id: headerRcptResult.insertId,
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date(),
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((RcptDetailsRecords) => {
                    // _mysql.commitTransaction(() => {
                    // _mysql.releaseConnection();
                    req.records = {
                      receipt_header_id: headerRcptResult.insertId,
                      receipt_number: inputParam.receipt_number,
                    };
                    next();
                    // });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch((e) => {
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
};
