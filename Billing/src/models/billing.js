import algaehMysql from "algaeh-mysql";
// import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import { LINQ } from "node-linq";
import math from "mathjs";
import extend from "extend";
module.exports = {
  newReceiptData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };

      // const utilities = new algaehUtilities();
      // utilities.logger().log("inputParam Receipt: ", inputParam);

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
              created_by, created_date, updated_by, updated_date,  counter_id, shift_id) \
              VALUES (?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.receipt_number,
            new Date(),
            inputParam.total_amount,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.counter_id,
            inputParam.shift_id
          ],
          printQuery: true
        })
        .then(headerRcptResult => {
          // utilities.logger().log("headerRcptResult: ", headerRcptResult);
          if (
            headerRcptResult.insertId != null &&
            headerRcptResult.insertId != ""
          ) {
            req.body.receipt_header_id = headerRcptResult.insertId;
            const receptSample = [
              "card_check_number",
              "expiry_date",
              "pay_type",
              "amount",
              "card_type"
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
                  updated_date: new Date()
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(RcptDetailsRecords => {
                if (req.mySQl == null) {
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = headerRcptResult;
                  next();
                  // });
                } else {
                  next();
                }
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  addBillData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      if (
        inputParam.billdetails == null ||
        inputParam.billdetails.length == 0
      ) {
        const errorGen = httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service."
        );
        _mysql.rollBackTransaction(() => {
          next(errorGen);
        });
      }

      if (
        inputParam.sheet_discount_amount != 0 &&
        inputParam.bill_comments == ""
      ) {
        const errorGene = httpStatus.generateError(
          httpStatus.badRequest,
          "Please enter sheet level discount comments. "
        );

        _mysql.rollBackTransaction(() => {
          next(errorGene);
        });
      }

      // const utilities = new algaehUtilities();
      // utilities.logger().log("inputParam Bill: ", inputParam);

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_billing_header ( patient_id, visit_id, bill_number,receipt_header_id,\
              incharge_or_provider, bill_date, advance_amount,advance_adjust, discount_amount, sub_total_amount \
              , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount, net_total \
              , company_res, sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable \
              , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount,balance_credit \
              , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount) VALUES (?,?,?,?\
                ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.patient_id,
            inputParam.visit_id,
            inputParam.bill_number,
            inputParam.receipt_header_id,
            inputParam.incharge_or_provider,
            inputParam.bill_date != null
              ? new Date(inputParam.bill_date)
              : inputParam.bill_date,
            inputParam.advance_amount,
            inputParam.advance_adjust,
            inputParam.discount_amount,
            inputParam.sub_total_amount,
            inputParam.total_tax,
            inputParam.billing_status,
            inputParam.sheet_discount_amount,
            inputParam.sheet_discount_percentage,
            inputParam.net_amount,
            inputParam.net_total,
            inputParam.company_res,
            inputParam.sec_company_res,
            inputParam.patient_res,
            inputParam.patient_payable,
            inputParam.company_payable,
            inputParam.sec_company_payable,
            inputParam.patient_tax,
            inputParam.company_tax,
            inputParam.sec_company_tax,
            inputParam.net_tax,
            inputParam.credit_amount,
            inputParam.receiveable_amount,
            inputParam.balance_credit,
            inputParam.created_by,
            new Date(),
            inputParam.updated_by,
            new Date(),
            inputParam.copay_amount,
            inputParam.deductable_amount
          ],
          printQuery: true
        })
        .then(headerResult => {
          // utilities.logger().log("headerResult Bill: ", headerResult);
          if (
            headerResult.insertId != null &&
            headerResult.insertId != "" &&
            inputParam.advance_adjust > 0
          ) {
            _mysql
              .executeQuery({
                query:
                  "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                values: [inputParam.patient_id],
                printQuery: true
              })
              .then(result => {
                let existingAdvance = result[0].advance_amount;
                if (result.length != 0) {
                  inputParam.advance_amount =
                    existingAdvance - inputParam.advance_adjust;

                  _mysql
                    .executeQuery({
                      query:
                        "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                        `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                      values: [
                        inputParam.advance_amount,
                        inputParam.updated_by,
                        new Date(),
                        inputParam.patient_id
                      ],
                      printQuery: true
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                }
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          }

          let IncludeValues = [
            "hims_f_billing_header_id",
            "service_type_id",
            "services_id",
            "quantity",
            "unit_cost",
            "insurance_yesno",
            "gross_amount",
            "discount_amout",
            "discount_percentage",
            "net_amout",
            "copay_percentage",
            "copay_amount",
            "deductable_amount",
            "deductable_percentage",
            "tax_inclusive",
            "patient_tax",
            "company_tax",
            "total_tax",
            "patient_resp",
            "patient_payable",
            "comapany_resp",
            "company_payble",
            "sec_company",
            "sec_deductable_percentage",
            "sec_deductable_amount",
            "sec_company_res",
            "sec_company_tax",
            "sec_company_paybale",
            "sec_copay_percntage",
            "sec_copay_amount",
            "created_by",
            "created_date",
            "updated_by",
            "updated_date"
          ];

          let newDtls = new LINQ(inputParam.billdetails)
            .Select(s => {
              return {
                hims_f_billing_header_id: headerResult.insertId,
                service_type_id: s.service_type_id,
                services_id: s.services_id,
                quantity: s.quantity,
                unit_cost: s.unit_cost,
                insurance_yesno: s.insurance_yesno,
                gross_amount: s.gross_amount,
                discount_amout: s.discount_amout,
                discount_percentage: s.discount_percentage,
                net_amout: s.net_amout,
                copay_percentage: s.copay_percentage,
                copay_amount: s.copay_amount,
                deductable_amount: s.deductable_amount,
                deductable_percentage: s.deductable_percentage,
                tax_inclusive: s.tax_inclusive == 0 ? "N" : s.tax_inclusive,
                patient_tax: s.patient_tax,
                company_tax: s.company_tax,
                total_tax: s.total_tax,
                patient_resp: s.patient_resp,
                patient_payable: s.patient_payable,
                comapany_resp: s.comapany_resp,
                company_payble: s.company_payble,
                sec_company: s.sec_company == 0 ? "N" : s.sec_company,
                sec_deductable_percentage: s.sec_deductable_percentage,
                sec_deductable_amount: s.sec_deductable_amount,
                sec_company_res: s.sec_company_res,
                sec_company_tax: s.sec_company_tax,
                sec_company_paybale: s.sec_company_paybale,
                sec_copay_percntage: s.sec_copay_percntage,
                sec_copay_amount: s.sec_copay_amount,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              };
            })
            .ToArray();

          // let detailsInsert = [];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_f_billing_details(??) VALUES ?",
              values: newDtls,
              includeValues: IncludeValues,
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(detailsRecords => {
              // utilities.logger().log("detailsRecords Bill: ", detailsRecords);
              if (req.mySQl == null) {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = headerResult;
                next();
                // });
              } else {
                next();
              }
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  billingCalculations: (req, res, next) => {
    try {
      // const utilities = new algaehUtilities();

      let decimal_places = req.userIdentity.decimal_places;
      // utilities.logger().log("decimal_places: ", decimal_places);
      let hasCalculateall =
        req.body.intCalculateall == undefined ? true : req.body.intCalculateall;
      let inputParam =
        req.body.intCalculateall == undefined ? req.body.billdetails : req.body;
      if (inputParam.length == 0) {
        next(
          httpStatus.generateError(
            httpStatus.badRequest,
            "Please select atleast one service"
          )
        );
      }
      let sendingObject = {};

      if (hasCalculateall == true) {
        sendingObject.sub_total_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.gross_amount)
        );
        sendingObject.net_total = new LINQ(inputParam).Sum(d =>
          parseFloat(d.net_amout)
        );
        sendingObject.discount_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.discount_amout)
        );
        sendingObject.gross_total = new LINQ(inputParam).Sum(d =>
          parseFloat(d.patient_payable)
        );

        // Primary Insurance
        sendingObject.copay_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.copay_amount)
        );
        sendingObject.deductable_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.deductable_amount)
        );

        // Secondary Insurance
        sendingObject.sec_copay_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.sec_copay_amount)
        );
        sendingObject.sec_deductable_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.sec_deductable_amount)
        );

        // Responsibilities
        sendingObject.patient_res = new LINQ(inputParam).Sum(d =>
          parseFloat(d.patient_resp)
        );
        sendingObject.company_res = new LINQ(inputParam).Sum(d =>
          parseFloat(d.comapany_resp)
        );
        sendingObject.sec_company_res = new LINQ(inputParam).Sum(d =>
          parseFloat(d.sec_company_res)
        );

        // Tax Calculation
        sendingObject.total_tax = new LINQ(inputParam).Sum(d =>
          parseFloat(d.total_tax)
        );

        sendingObject.patient_tax = new LINQ(inputParam).Sum(d =>
          parseFloat(d.patient_tax)
        );

        sendingObject.company_tax = new LINQ(inputParam).Sum(d =>
          parseFloat(d.company_tax)
        );

        sendingObject.sec_company_tax = new LINQ(inputParam).Sum(d =>
          parseFloat(d.sec_company_tax)
        );

        // Payables
        sendingObject.patient_payable = new LINQ(inputParam).Sum(d =>
          parseFloat(d.patient_payable)
        );

        sendingObject.company_payble = new LINQ(inputParam).Sum(d =>
          parseFloat(d.company_payble)
        );
        sendingObject.sec_company_paybale = new LINQ(inputParam).Sum(d =>
          parseFloat(d.sec_company_paybale)
        );
        // Sheet Level Discount Nullify
        sendingObject.sheet_discount_amount = 0;
        sendingObject.sheet_discount_percentage = 0;
        sendingObject.advance_adjust = 0;
        sendingObject.net_amount = sendingObject.patient_payable;
        if (inputParam.credit_amount > 0) {
          sendingObject.receiveable_amount =
            sendingObject.net_amount - inputParam.credit_amount;
        } else {
          sendingObject.receiveable_amount = sendingObject.net_amount;
        }

        //Reciept
        sendingObject.cash_amount = sendingObject.receiveable_amount;
        sendingObject.total_amount = sendingObject.receiveable_amount;

        sendingObject.unbalanced_amount = 0;
        sendingObject.card_amount = 0;
        sendingObject.cheque_amount = 0;

        sendingObject.patient_payable = math.round(
          sendingObject.patient_payable,
          decimal_places
        );
        sendingObject.total_tax = math.round(
          sendingObject.total_tax,
          decimal_places
        );
        sendingObject.patient_tax = math.round(
          sendingObject.patient_tax,
          decimal_places
        );
        sendingObject.company_tax = math.round(
          sendingObject.company_tax,
          decimal_places
        );
        sendingObject.sec_company_tax = math.round(
          sendingObject.sec_company_tax,
          decimal_places
        );
      } else {
        //Reciept

        if (inputParam.isReceipt == false) {
          // Sheet Level Discount Nullify
          sendingObject.sheet_discount_percentage = 0;
          sendingObject.sheet_discount_amount = 0;

          if (inputParam.sheet_discount_amount > 0) {
            sendingObject.sheet_discount_percentage =
              (inputParam.sheet_discount_amount / inputParam.gross_total) * 100;

            sendingObject.sheet_discount_amount =
              inputParam.sheet_discount_amount;
          } else if (inputParam.sheet_discount_percentage > 0) {
            sendingObject.sheet_discount_percentage =
              inputParam.sheet_discount_percentage;
            sendingObject.sheet_discount_amount =
              (inputParam.gross_total * inputParam.sheet_discount_percentage) /
              100;
          }

          sendingObject.sheet_discount_amount = math.round(
            sendingObject.sheet_discount_amount,
            decimal_places
          );
          sendingObject.sheet_discount_percentage = math.round(
            sendingObject.sheet_discount_percentage,
            decimal_places
          );

          sendingObject.net_amount =
            inputParam.gross_total - sendingObject.sheet_discount_amount;

          if (inputParam.credit_amount > 0) {
            sendingObject.receiveable_amount =
              sendingObject.net_amount -
              inputParam.advance_adjust -
              inputParam.credit_amount;
          } else {
            sendingObject.receiveable_amount =
              sendingObject.net_amount - inputParam.advance_adjust;
          }

          sendingObject.cash_amount = sendingObject.receiveable_amount;
          sendingObject.card_amount = 0;
          sendingObject.cheque_amount = 0;
        } else {
          sendingObject.card_amount = inputParam.card_amount;
          sendingObject.cheque_amount = inputParam.cheque_amount;
          sendingObject.cash_amount = inputParam.cash_amount;
          sendingObject.receiveable_amount = inputParam.receiveable_amount;
        }

        sendingObject.total_amount =
          sendingObject.cash_amount +
          sendingObject.card_amount +
          sendingObject.cheque_amount;

        sendingObject.unbalanced_amount =
          sendingObject.receiveable_amount - sendingObject.total_amount;
      }

      req.records = sendingObject;
      next();
    } catch (e) {
      next(e);
    }
  },

  patientAdvanceRefund: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

      // const utilities = new algaehUtilities();
      // utilities.logger().log("inputParam Receipt: ", inputParam);

      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        next(
          httpStatus.generateError(
            httpStatus.badRequest,
            "Please select atleast one service."
          )
        );
      }
      let Module_Name = "";
      //Advance
      if (inputParam.pay_type == "R") {
        Module_Name = "RECEIPT";
      } else if (inputParam.pay_type == "P") {
        Module_Name = "REFUND";
      }

      _mysql
        .generateRunningNumber({
          modules: [Module_Name]
        })
        .then(generatedNumbers => {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
                  created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) \
                  VALUES (?,?,?,?,?,?,?,?,?,?)",
              values: [
                generatedNumbers[0],
                new Date(),
                inputParam.total_amount,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.counter_id,
                inputParam.shift_id,
                inputParam.pay_type
              ],
              printQuery: true
            })
            .then(headerRcptResult => {
              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                req.body.receipt_header_id = headerRcptResult.insertId;
                const receptSample = [
                  "card_check_number",
                  "expiry_date",
                  "pay_type",
                  "amount",
                  "created_by",
                  "updated_by",
                  "card_type"
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_receipt_details(??) VALUES ?",
                    values: inputParam.receiptdetails,
                    includeValues: receptSample,
                    extraValues: {
                      hims_f_receipt_header_id: headerRcptResult.insertId
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(RcptDetailsRecords => {
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                            transaction_type, advance_amount, created_by, \
                            created_date, updated_by, update_date,  record_status) VALUES (?,?,?,?,?,?,?,?,?) ",
                        values: [
                          inputParam.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParam.transaction_type,
                          inputParam.advance_amount,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          inputParam.record_status
                        ],
                        printQuery: true
                      })
                      .then(Insert_Advance => {
                        let existingAdvance =
                          Insert_Advance[1][0].advance_amount;

                        if (existingAdvance != null) {
                          if (inputParam.transaction_type == "AD") {
                            inputParam.advance_amount += existingAdvance;
                          } else if (inputParam.transaction_type == "RF") {
                            inputParam.advance_amount =
                              existingAdvance - inputParam.advance_amount;
                          }
                        }

                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                                        `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                            values: [
                              inputParam.advance_amount,
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              inputParam.hims_f_patient_id
                            ],
                            printQuery: true
                          })
                          .then(update_advance => {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = {
                                receipt_number: generatedNumbers[0],
                                total_advance_amount: inputParam.advance_amount
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
              }
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getBillDetails: (req, res, next) => {
    try {
      // const utilities = new algaehUtilities();

      new Promise((resolve, reject) => {
        try {
          // utilities.logger().log("getBillDetails: ");
          getBillDetailsFunctionality(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then(result => {
        req.records = result;
        next();
      });
    } catch (e) {
      next(e);
    }
  },

  addCashHandover: (req, res, next) => {
    console.log("addCashHandover");
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    // const utilities = new algaehUtilities();
    // utilities.logger().log("addCashHandover ");

    try {
      let inputParam = { ...req.body };

      // utilities.logger().log("inputParam Cash: ", inputParam);
      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        const genErr = httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one payment mode."
        );
        next(genErr);
      }

      if (
        req.userIdentity.group_type == "C" ||
        req.userIdentity.group_type == "FD"
      ) {
        let hims_f_cash_handover_detail_id = "";
        _mysql
          .executeQuery({
            query:
              "select hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status,open_date\
            from  hims_f_cash_handover_detail where record_status='A' and casher_id=? and shift_status='O'",
            values: [inputParam.created_by],
            printQuery: true
          })
          .then(checkShiftStatus => {
            if (checkShiftStatus.length > 0) {
              hims_f_cash_handover_detail_id =
                checkShiftStatus[0].hims_f_cash_handover_detail_id;
            }
            new Promise((resolve, reject) => {
              try {
                if (
                  checkShiftStatus.length == null ||
                  checkShiftStatus.length == ""
                ) {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                        created_date, created_by, updated_date, updated_by)\
                       VALUE(?,?,?,?,?,?)",
                      values: [
                        inputParam.shift_id,
                        new Date(),
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id
                      ],
                      printQuery: true
                    })
                    .then(headerCashHandover => {
                      if (
                        headerCashHandover.insertId != null &&
                        headerCashHandover.insertId != ""
                      ) {
                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,  expected_cash, expected_card,  expected_cheque, \
                              no_of_cheques,created_date, created_by, updated_date, updated_by)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                            values: [
                              headerCashHandover.insertId,
                              inputParam.created_by,
                              "O",
                              new Date(),
                              0,
                              0,
                              0,
                              0,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id
                            ],
                            printQuery: true
                          })
                          .then(CashHandoverDetails => {
                            if (
                              CashHandoverDetails.insertId != null &&
                              CashHandoverDetails.insertId != ""
                            ) {
                              hims_f_cash_handover_detail_id =
                                CashHandoverDetails.insertId;
                            }

                            resolve(CashHandoverDetails);
                          })
                          .catch(error => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                              reject(error);
                            });
                          });
                      }
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else if (checkShiftStatus.length > 0) {
                  resolve({});
                }
              } catch (e) {
                _mysql.rollBackTransaction(() => {
                  reject(e);
                });
              }
            }).then(result => {
              let expected_cash = 0;
              let expected_card = 0;
              let expected_cheque = 0;
              let no_of_cheques = 0;

              expected_cash = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CA")
                .Sum(s => s.amount);

              expected_card = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CD")
                .Sum(s => s.amount);

              expected_cheque = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CH")
                .Sum(s => s.amount);

              no_of_cheques = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CH")
                .ToArray().length;

              _mysql
                .executeQuery({
                  query:
                    "select expected_cash,expected_card, expected_cheque, no_of_cheques from \
                  hims_f_cash_handover_detail where record_status='A' and hims_f_cash_handover_detail_id=?",
                  values: [hims_f_cash_handover_detail_id],
                  printQuery: true
                })
                .then(selectCurrentCash => {
                  expected_cash += selectCurrentCash[0].expected_cash;
                  expected_card += selectCurrentCash[0].expected_card;
                  expected_cheque += selectCurrentCash[0].expected_cheque;
                  no_of_cheques += selectCurrentCash[0].no_of_cheques;
                  _mysql
                    .executeQuery({
                      query:
                        "update hims_f_cash_handover_detail set expected_cash=?,expected_card=?,\
                  expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                  and hims_f_cash_handover_detail_id=?;",
                      values: [
                        expected_cash,
                        expected_card,
                        expected_cheque,
                        no_of_cheques,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        hims_f_cash_handover_detail_id
                      ],
                      printQuery: true
                    })
                    .then(updateResult => {
                      if (req.mySQl == null) {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = updateResult;
                          next();
                        });
                      } else {
                        next();
                      }
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
            });
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        if (req.mySQl == null) {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = { mesage: "not a cahsier" };
            next();
          });
        } else {
          next();
        }
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },
  getBillDetailsFunction: (req, res, next, resolve) => {
    try {
      getBillDetailsFunctionality(req, res, next, resolve);
    } catch (e) {
      next(e);
    }
  }
};

function getBillDetailsFunctionality(req, res, next, resolve) {
  const _mysql = new algaehMysql();
  try {
    let service_ids = null;
    let questions = "?";

    // const utilities = new algaehUtilities();

    if (Array.isArray(req.body)) {
      let len = req.body.length;
      service_ids = new LINQ(req.body).Select(g => g.hims_d_services_id);

      for (let i = 1; i < len; i++) {
        questions += ",?";
      }
    }

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id` IN (" +
          questions +
          ") AND record_status='A'",
        values: service_ids.items,

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        let outputArray = [];
        for (let m = 0; m < result.length; m++) {
          let servicesDetails = { ...req.body[m] };

          let records = result[m];

          req.body[m].service_type_id = result[m].service_type_id;
          req.body[m].services_id = servicesDetails.hims_d_services_id;

          //Calculation Declarations
          let unit_cost =
            servicesDetails.unit_cost == undefined
              ? 0
              : servicesDetails.unit_cost;

          let zeroBill =
            servicesDetails.zeroBill == undefined
              ? false
              : servicesDetails.zeroBill;

          let FollowUp =
            servicesDetails.FollowUp == undefined
              ? false
              : servicesDetails.FollowUp;
          let gross_amount = 0,
            net_amout = 0,
            sec_unit_cost = 0;

          let patient_resp = 0,
            patient_payable = 0;

          let copay_percentage = 0,
            copay_amount = 0,
            sec_copay_percntage = 0,
            sec_copay_amount = 0;

          let comapany_resp = 0,
            company_payble = 0,
            sec_company_res = 0,
            sec_company_paybale = 0;

          let patient_tax = 0,
            company_tax = 0,
            sec_company_tax = 0,
            total_tax = 0;

          let after_dect_amout = 0,
            deductable_percentage = 0,
            deductable_amount = 0;

          let sec_deductable_percentage = 0,
            sec_deductable_amount = 0;
          let conversion_factor =
            servicesDetails.conversion_factor == undefined
              ? 0
              : servicesDetails.conversion_factor;
          let quantity =
            servicesDetails.quantity == undefined
              ? 1
              : servicesDetails.quantity;

          let discount_amout =
            servicesDetails.discount_amout == undefined
              ? 0
              : servicesDetails.discount_amout;

          let discount_percentage =
            servicesDetails.discount_percentage == undefined
              ? 0
              : servicesDetails.discount_percentage;

          let insured =
            servicesDetails.insured == undefined
              ? "N"
              : servicesDetails.insured;

          let sec_insured =
            servicesDetails.sec_insured == undefined
              ? "N"
              : servicesDetails.sec_insured;

          let approval_amt =
            servicesDetails.approval_amt == undefined
              ? 0
              : servicesDetails.approval_amt;
          let approval_limit_yesno =
            servicesDetails.approval_limit_yesno == undefined
              ? "N"
              : servicesDetails.approval_limit_yesno;

          let apprv_status =
            servicesDetails.apprv_status == undefined
              ? "NR"
              : servicesDetails.apprv_status;

          let approved_amount =
            servicesDetails.approved_amount == undefined
              ? 0
              : servicesDetails.approved_amount;

          let pre_approval =
            servicesDetails.pre_approval == undefined
              ? "N"
              : servicesDetails.pre_approval;

          let vat_applicable = servicesDetails.vat_applicable;
          let preapp_limit_exceed = "N";
          let ser_net_amount = 0;
          let ser_gross_amt = 0;
          let icd_code = "";
          let covered = "Y";
          let preapp_limit_amount =
            servicesDetails.preapp_limit_amount == undefined
              ? 0
              : servicesDetails.preapp_limit_amount;

          if (zeroBill === true) {
            let out = {
              hims_f_billing_details_id: null,
              hims_f_billing_header_id: null,
              service_type_id: records.service_type_id,
              service_name: records.service_name,
              services_id: servicesDetails.hims_d_services_id,
              quantity: 1,
              unit_cost: 0,
              insurance_yesno: null,
              gross_amount: 0,
              discount_amout: 0,
              discount_percentage: 0,
              net_amout: 0,
              copay_percentage: 0,
              copay_amount: 0,
              deductable_amount: 0,
              deductable_percentage: 0,
              tax_inclusive: "N",
              patient_tax: 0,
              company_tax: 0,
              total_tax: 0,
              patient_resp: 0,
              patient_payable: 0,
              comapany_resp: 0,
              company_payble: 0,

              sec_deductable_percentage: 0,
              sec_deductable_amount: 0,
              sec_company_res: 0,
              sec_company_tax: 0,
              sec_company_paybale: 0,
              sec_copay_percntage: 0,
              sec_copay_amount: 0
            };
            outputArray.push(out);
            _mysql.releaseConnection();
            req.records = { billdetails: outputArray };
            next();
            return;
          }

          new Promise((resolve, reject) => {
            try {
              // utilities.logger().log("insured: ", insured);
              // utilities.logger().log("sec_insured: ", sec_insured);
              if (insured == "Y") {
                // let callInsurance =

                req.body[m].insurance_id =
                  req.body[m].primary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id =
                  req.body[m].primary_network_office_id;
                req.body[m].network_id = req.body[m].primary_network_id;

                insuranceServiceDetails(req.body[m], next, _mysql, resolve);
              } else if (sec_insured == "Y") {
                req.body[m].insurance_id =
                  req.body[m].secondary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id =
                  req.body[m].secondary_network_office_id;
                req.body[m].network_id = req.body[m].secondary_network_id;

                insuranceServiceDetails(req.body[m], next, _mysql, resolve);
              } else {
                resolve({});
              }
            } catch (e) {
              _mysql.releaseConnection();
              reject(e);
            }
          })
            .then(policydtls => {
              // utilities.logger().log("policydtls: ", policydtls);
              if (
                covered == "N" ||
                (pre_approval == "Y" && apprv_status == "RJ")
              ) {
                insured = "N";
              }

              if (approval_limit_yesno == "Y") {
                pre_approval = "Y";
              }

              if (pre_approval == "N") {
                pre_approval =
                  policydtls !== null ? policydtls.pre_approval : "N";
              }

              covered = policydtls !== null ? policydtls.covered : "Y";

              icd_code =
                policydtls.cpt_code !== null
                  ? policydtls.cpt_code
                  : records.cpt_code;

              if (insured == "Y" && policydtls.covered == "Y") {
                ser_net_amount = policydtls.net_amount;
                ser_gross_amt = policydtls.gross_amt;

                if (policydtls.company_service_price_type == "N") {
                  unit_cost =
                    unit_cost != 0 ? unit_cost : policydtls.net_amount;
                } else {
                  unit_cost = unit_cost != 0 ? unit_cost : policydtls.gross_amt;
                }

                if (conversion_factor != 0) {
                  unit_cost = unit_cost * conversion_factor;
                }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = math.round(discount_amout, 2);
                }
                net_amout = gross_amount - discount_amout;

                //Patient And Company
                if (policydtls.copay_status == "Y") {
                  copay_amount = policydtls.copay_amt;
                  copay_percentage = (copay_amount / net_amout) * 100;
                } else {
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", records.service_type_id);
                  if (
                    appsettings.hims_d_service_type.service_type_id
                      .Consultation == records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_consultation;
                    deductable_percentage = policydtls.deductible;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Procedure ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent_trt;
                    deductable_percentage = policydtls.deductible_trt;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Provider ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .InventoryItem == records.service_type_id
                  ) {
                    //Not there
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Lab ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent;
                    deductable_percentage = policydtls.deductible_lab;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NursingCare == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Miscellaneous == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Anesthesia == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Bed ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.OT ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Radiology ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent_rad;
                    deductable_percentage = policydtls.deductible_rad;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Pharmacy ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_medicine;
                    deductable_percentage = policydtls.deductible_medicine;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NonService == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Package ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  }

                  deductable_amount = (net_amout * deductable_percentage) / 100;
                  after_dect_amout = net_amout - deductable_amount;
                  copay_amount = (after_dect_amout * copay_percentage) / 100;
                  copay_amount = math.round(copay_amount, 2);
                }

                patient_resp = copay_amount + deductable_amount;
                comapany_resp = math.round(net_amout - patient_resp, 2);

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = math.round(
                    (patient_resp * records.vat_percent) / 100,
                    2
                  );
                }

                if (records.vat_applicable == "Y") {
                  company_tax = math.round(
                    (comapany_resp * records.vat_percent) / 100,
                    2
                  );
                }
                total_tax = math.round(patient_tax + company_tax, 2);

                patient_payable = math.round(patient_resp + patient_tax, 2);

                if (approved_amount !== 0 && approved_amount < comapany_resp) {
                  let diff_val = comapany_resp - approved_amount;
                  patient_payable = math.round(patient_payable + diff_val, 2);
                  patient_resp = math.round(patient_resp + diff_val, 2);
                  comapany_resp = approved_amount;
                }

                company_payble = net_amout - patient_resp;

                company_payble = math.round(company_payble + company_tax, 2);

                preapp_limit_amount = policydtls.preapp_limit;
                if (policydtls.preapp_limit !== 0) {
                  approval_amt = approval_amt + company_payble;
                  if (approval_amt > policydtls.preapp_limit) {
                    preapp_limit_exceed = "Y";
                  }
                }
                // utilities.logger().log("patient_payable: ", patient_payable);
                //If primary and secondary exists
                if (sec_insured == "Y") {
                  req.body[m].insurance_id =
                    req.body[m].secondary_insurance_provider_id;
                  req.body[m].hims_d_insurance_network_office_id =
                    req.body[m].secondary_network_office_id;
                  req.body[m].network_id = req.body[m].secondary_network_id;
                  //Secondary Insurance
                  return new Promise((resolve, reject) => {
                    try {
                      // let callInsurance =
                      insuranceServiceDetails(
                        req.body[m],
                        req.db,
                        next,
                        connection,
                        resolve
                      );
                      //if (callInsurance != null) resolve(callInsurance);
                    } catch (e) {
                      reject(e);
                    }
                  });
                }
              } else {
                if (FollowUp === true) {
                  unit_cost =
                    unit_cost != 0 ? unit_cost : records.followup_free_fee;
                } else {
                  unit_cost = unit_cost != 0 ? unit_cost : records.standard_fee;
                }

                if (conversion_factor != 0) {
                  unit_cost = unit_cost * conversion_factor;
                }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = math.round(discount_amout, 2);
                }
                net_amout = gross_amount - discount_amout;
                patient_resp = net_amout;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = math.round(
                    (patient_resp * records.vat_percent) / 100,
                    2
                  );
                  total_tax = patient_tax;
                }

                // patient_payable = net_amout + patient_tax;
                patient_payable = math.round(patient_resp + patient_tax, 2);
              }
            })
            .then(secpolicydtls => {
              if (secpolicydtls != null) {
                debugFunction("secpolicydtls");
                //secondary Insurance
                sec_unit_cost = patient_resp;

                //Patient And Company
                if (secpolicydtls.copay_status == "Y") {
                  debugFunction("secpolicydtls Y");
                  sec_copay_amount = secpolicydtls.copay_amt;
                  sec_copay_percntage =
                    (sec_copay_amount / sec_unit_cost) * 100;
                } else {
                  debugFunction("secpolicydtls N");
                  if (
                    appsettings.hims_d_service_type.service_type_id
                      .Consultation == records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_consultation;
                    sec_deductable_percentage = secpolicydtls.deductible;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Procedure ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent_trt;
                    sec_deductable_percentage = secpolicydtls.deductible_trt;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Provider ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .InventoryItem == records.service_type_id
                  ) {
                    //Not there
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Lab ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent;
                    sec_deductable_percentage = secpolicydtls.deductible_lab;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NursingCare == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Miscellaneous == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Anesthesia == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Bed ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.OT ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Radiology ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent_rad;
                    sec_deductable_percentage = secpolicydtls.deductible_rad;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Pharmacy ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_medicine;
                    sec_deductable_percentage =
                      secpolicydtls.deductible_medicine;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NonService == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Package ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  }

                  sec_deductable_amount =
                    (sec_unit_cost * sec_deductable_percentage) / 100;
                  after_dect_amout = sec_unit_cost - deductable_amount;

                  sec_copay_amount =
                    (after_dect_amout * sec_copay_percntage) / 100;

                  sec_copay_amount = math.round(sec_copay_amount, 2);
                }

                patient_resp = sec_copay_amount + sec_deductable_amount;
                sec_company_res = sec_unit_cost - patient_resp;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = math.round(
                    (patient_resp * records.vat_percent) / 100,
                    2
                  );
                }

                if (records.vat_applicable == "Y") {
                  sec_company_tax = math.round(
                    (sec_company_res * records.vat_percent) / 100,
                    2
                  );
                }
                total_tax = patient_tax + company_tax + sec_company_res;

                patient_payable = math.round(patient_resp + patient_tax, 2);
                sec_company_paybale =
                  sec_unit_cost - patient_resp + sec_company_tax;
              }
              let out = extend(
                {
                  hims_f_billing_details_id: null,
                  hims_f_billing_header_id: null,
                  service_type_id: null,
                  services_id: null,
                  quantity: 0,
                  unit_cost: 0,
                  insurance_yesno: null,
                  gross_amount: 0,
                  discount_amout: 0,
                  discount_percentage: 0,
                  net_amout: 0,
                  copay_percentage: 0,
                  copay_amount: 0,
                  deductable_amount: 0,
                  deductable_percentage: 0,
                  tax_inclusive: "N",
                  patient_tax: 0,
                  company_tax: 0,
                  total_tax: 0,
                  patient_resp: 0,
                  patient_payable: 0,
                  comapany_resp: 0,
                  company_payble: 0,
                  // sec_company: 0,
                  sec_deductable_percentage: 0,
                  sec_deductable_amount: 0,
                  sec_company_res: 0,
                  sec_company_tax: 0,
                  sec_company_paybale: 0,
                  sec_copay_percntage: 0,
                  sec_copay_amount: 0
                },
                {
                  service_type_id: records.service_type_id,
                  service_name: records.service_name,
                  services_id: servicesDetails.hims_d_services_id,
                  quantity: quantity,
                  unit_cost: unit_cost,
                  gross_amount: gross_amount,
                  discount_amout: discount_amout,
                  discount_percentage: discount_percentage,
                  net_amout: net_amout,
                  patient_resp: patient_resp,
                  patient_payable: patient_payable,
                  copay_percentage: copay_percentage,
                  copay_amount: copay_amount,

                  comapany_resp: comapany_resp,
                  company_payble: company_payble,
                  patient_tax: patient_tax,
                  company_tax: company_tax,
                  sec_company_tax: sec_company_tax,
                  total_tax: total_tax,

                  sec_copay_percntage: sec_copay_percntage,
                  sec_copay_amount: sec_copay_amount,
                  sec_company_res: sec_company_res,
                  sec_company_paybale: sec_company_paybale,
                  pre_approval: pre_approval,
                  insurance_yesno: insured,
                  preapp_limit_exceed: preapp_limit_exceed,
                  approval_amt: approval_amt,
                  preapp_limit_amount: preapp_limit_amount,
                  approval_limit_yesno: approval_limit_yesno,
                  ser_net_amount: ser_net_amount,
                  ser_gross_amt: ser_gross_amt,
                  icd_code: icd_code,

                  sec_deductable_percentage: sec_deductable_percentage,
                  sec_deductable_amount: sec_deductable_amount,
                  deductable_percentage: deductable_percentage,
                  deductable_amount: deductable_amount,
                  item_id: servicesDetails.item_id,
                  expiry_date: servicesDetails.expirydt,
                  batchno: servicesDetails.batchno,
                  qtyhand: servicesDetails.qtyhand,
                  grnno: servicesDetails.grnno,
                  uom_id: servicesDetails.sales_uom,
                  item_category: servicesDetails.item_category_id,
                  item_group_id: servicesDetails.item_group_id
                }
              );

              outputArray.push(out);
            })
            .then(() => {
              if (m == result.length - 1) {
                _mysql.releaseConnection();
                return resolve({ billdetails: outputArray });
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(httpStatus.generateError(httpStatus.badRequest, e));
            });
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
function insuranceServiceDetails(body, next, _mysql, resolve) {
  try {
    let input = { ...body };

    // const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query:
          "select price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,\
          copay_percent_dental,copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, deductible_trt, \
          deductible_medicine from hims_d_insurance_network_office where hims_d_insurance_network_office_id=?",
        values: [input.hims_d_insurance_network_office_id],
        printQuery: true
      })
      .then(resultOffic => {
        if (resultOffic != null && resultOffic[0].price_from == "S") {
          _mysql
            .executeQuery({
              query:
                "select Inp.company_service_price_type,copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
              net_amount,gross_amt, cpt_code from hims_d_services_insurance sI inner join hims_d_insurance_provider Inp on\
              Inp.hims_d_insurance_provider_id=sI.insurance_id where sI.insurance_id =? and sI.service_type_id =? and \
              sI.services_id =?  and sI.record_status='A' and Inp.record_status='A'",
              values: [
                input.insurance_id,
                input.service_type_id,
                input.services_id
              ],
              printQuery: true
            })
            .then(result_s => {
              let result = { ...result_s[0], ...resultOffic[0] };
              return resolve(result);
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        }
        if (resultOffic != null && resultOffic[0].price_from == "P") {
          _mysql
            .executeQuery({
              query:
                "select Inp.insurance_provider_name, Inp.company_service_price_type, net.network_type, \
            copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,\
            net_amount,gross_amt from (( hims_d_services_insurance_network Sin\
            inner join hims_d_insurance_network net on net.hims_d_insurance_network_id=Sin.network_id) \
             inner join hims_d_insurance_provider Inp on Sin.insurance_id=Inp.hims_d_insurance_provider_id  )\
             where  Sin.network_id=? AND Sin.services_id=? and service_type_id=? and  Sin.record_status='A' and net.record_status='A'",
              values: [
                input.network_id,
                input.services_id,
                input.service_type_id
              ],
              printQuery: true
            })
            .then(result_p => {
              let result = { ...result_p, ...resultOffic };
              return resolve(result);
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
  } catch (e) {
    next(e);
  }
}
