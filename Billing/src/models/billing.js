import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import { LINQ } from "node-linq";
import extend from "extend";
import _ from "lodash";
import mysql from "mysql";

export default {
  newReceiptData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };

      const utilities = new algaehUtilities();
      utilities.logger().log("newReceiptData: ");

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
              created_by, created_date, updated_by, updated_date,  counter_id, shift_id,hospital_id ) \
              VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.receipt_number,
            new Date(),
            inputParam.total_amount,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.counter_id,
            inputParam.shift_id,
            req.userIdentity.hospital_id
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
                if (req.connection == null) {
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

    const utilities = new algaehUtilities();
    utilities.logger().log("addBillData: ", req.body);
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
              , patient_tax, s_patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount,\
              balance_credit , created_by, created_date, updated_by, updated_date, copay_amount,\
              deductable_amount,hospital_id)\
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            inputParam.s_patient_tax,
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
            inputParam.deductable_amount,
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          // utilities.logger().log("headerResult Bill: ", headerResult);
          req.body.hims_f_billing_header_id = headerResult.insertId;
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
            "s_patient_tax",
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
            "teeth_number",
            "ordered_services_id",
            "ordered_inventory_id",
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
                s_patient_tax: s.s_patient_tax,
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
                teeth_number: s.teeth_number,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date(),
                ordered_services_id: s.ordered_services_id,
                ordered_inventory_id: s.ordered_inventory_id
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
              if (req.connection == null) {
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
      const utilities = new algaehUtilities();

      let decimal_places = req.userIdentity.decimal_places;

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
      utilities.logger().log("inputParam: ", inputParam);

      utilities.logger().log("hasCalculateall: ", hasCalculateall);
      if (hasCalculateall == true) {
        sendingObject.sub_total_amount = new LINQ(inputParam).Sum(d =>
          parseFloat(d.gross_amount)
        );

        sendingObject.net_total = new LINQ(inputParam).Sum(d =>
          parseFloat(d.net_amout)
        );
        utilities.logger().log("net_total: ", sendingObject.net_total);
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

        sendingObject.s_patient_tax = new LINQ(inputParam).Sum(d =>
          parseFloat(d.s_patient_tax)
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

        sendingObject.patient_payable = utilities.decimalPoints(
          sendingObject.patient_payable,
          decimal_places
        );
        sendingObject.total_tax = utilities.decimalPoints(
          sendingObject.total_tax,
          decimal_places
        );

        sendingObject.patient_tax = utilities.decimalPoints(
          sendingObject.patient_tax,
          decimal_places
        );

        sendingObject.s_patient_tax = utilities.decimalPoints(
          sendingObject.s_patient_tax,
          decimal_places
        );

        sendingObject.company_tax = utilities.decimalPoints(
          sendingObject.company_tax,
          decimal_places
        );
        sendingObject.sec_company_tax = utilities.decimalPoints(
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
            sendingObject.sheet_discount_percentage = parseFloat(
              parseFloat(sendingObject.sheet_discount_percentage).toFixed(3)
            );
            sendingObject.sheet_discount_amount =
              inputParam.sheet_discount_amount;
          } else if (inputParam.sheet_discount_percentage > 0) {
            sendingObject.sheet_discount_percentage =
              inputParam.sheet_discount_percentage;
            sendingObject.sheet_discount_amount =
              (inputParam.gross_total * inputParam.sheet_discount_percentage) /
              100;
          }

          sendingObject.sheet_discount_amount = utilities.decimalPoints(
            sendingObject.sheet_discount_amount,
            decimal_places
          );

          sendingObject.sheet_discount_percentage = utilities.decimalPoints(
            sendingObject.sheet_discount_percentage,
            decimal_places
          );

          sendingObject.net_amount =
            parseFloat(inputParam.gross_total) -
            sendingObject.sheet_discount_amount;

          sendingObject.net_amount = utilities.decimalPoints(
            sendingObject.net_amount,
            decimal_places
          );

          if (inputParam.credit_amount > 0) {
            sendingObject.receiveable_amount =
              sendingObject.net_amount -
              parseFloat(inputParam.advance_adjust) -
              parseFloat(inputParam.credit_amount);
          } else {
            sendingObject.receiveable_amount =
              sendingObject.net_amount - parseFloat(inputParam.advance_adjust);
          }

          sendingObject.receiveable_amount = utilities.decimalPoints(
            sendingObject.receiveable_amount,
            decimal_places
          );

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

      req["adv_refnd"] = "Y";
      // console.log("deination:", req.mySQl);
      _mysql
        .generateRunningNumber({
          modules: [Module_Name],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          req.body["receipt_number"]=generatedNumbers[0];
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
                  created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type,hospital_id) \
                  VALUES (?,?,?,?,?,?,?,?,?,?,?)",
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
                inputParam.pay_type,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerRcptResult => {
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool
              };
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
                            created_date, updated_by, update_date,  hospital_id) VALUES (?,?,?,?,?,?,?,?,?) ;\
                            SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                        values: [
                          inputParam.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParam.transaction_type,
                          inputParam.advance_amount,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.hospital_id,
                          inputParam.hims_f_patient_id
                        ],
                        printQuery: true
                      })
                      .then(Insert_Advance => {
                        let existingAdvance =
                          Insert_Advance[1][0].advance_amount;

                        if (existingAdvance != null) {
                          if (inputParam.transaction_type == "AD") {
                            inputParam.advance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(existingAdvance);
                          } else if (inputParam.transaction_type == "RF") {
                            inputParam.advance_amount =
                              existingAdvance -
                              parseFloat(inputParam.advance_amount);
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
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            //   req.records = {
                            //     receipt_number: generatedNumbers[0],
                            //     total_advance_amount: inputParam.advance_amount
                            //   };
                            //   next();
                            // });

                            req.records = {
                              receipt_number: generatedNumbers[0],
                              total_advance_amount: inputParam.advance_amount
                            };
                            next();
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
  getBillDetailsBACKUP19_july_2019: (req, res, next) => {
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
  //created by:Irfan
  addCashHandover_backup: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();

    try {
      let inputParam = { ...req.body };
      // req.body.receipt_header_id
      utilities.logger().log("inputParam Cash: ", inputParam);

      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        req.records = {
          internal_error: true,
          message: "No receipt details"
        };
        _mysql.rollBackTransaction(() => { });
        next();
        return;
      } else if (
        req.userIdentity.group_type == "C" ||
        req.userIdentity.group_type == "FD" ||
        req.userIdentity.user_type == "C"
      ) {
        let hims_f_cash_handover_detail_id = "";
        _mysql
          .executeQuery({
            query:
              "select hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status,open_date\
              from  hims_f_cash_handover_detail where record_status='A'  and hospital_id=? and\
              date(open_date)=CURDATE()  and casher_id=? and shift_status='O';\
              select hims_f_cash_handover_header_id from hims_f_cash_handover_header where\
            shift_id=? and date(daily_handover_date)=CURDATE() and hospital_id=? ;",
            values: [
              req.userIdentity.hospital_id,
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.shift_id,
              req.userIdentity.hospital_id
            ],
            printQuery: true
          })
          .then(reslt => {
            let checkShiftStatus = reslt[0];
            let shift_header = reslt[1];
            if (checkShiftStatus.length > 0) {
              hims_f_cash_handover_detail_id =
                checkShiftStatus[0].hims_f_cash_handover_detail_id;
            }
            new Promise((resolve, reject) => {
              try {
                if (!checkShiftStatus.length > 0) {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT IGNORE INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                        created_date, created_by, updated_date, updated_by,hospital_id)\
                       VALUE(?,?,?,?,?,?,?)",
                      values: [
                        inputParam.shift_id,
                        new Date(),
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        req.userIdentity.hospital_id
                      ],
                      printQuery: true
                    })
                    .then(headerCashHandover => {
                      let header_id = null;
                      if (headerCashHandover.insertId > 0) {
                        header_id = headerCashHandover.insertId;
                      } else if (shift_header.length > 0) {
                        header_id =
                          shift_header[0].hims_f_cash_handover_header_id;
                      }

                      if (header_id > 0) {
                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,  expected_cash, expected_card,  expected_cheque, \
                              no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            values: [
                              header_id,
                              req.userIdentity.algaeh_d_app_user_id,
                              "O",
                              new Date(),
                              0,
                              0,
                              0,
                              0,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              req.userIdentity.hospital_id
                            ],
                            printQuery: true
                          })
                          .then(CashHandoverDetails => {
                            if (CashHandoverDetails.insertId > 0) {
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
                .Sum(s => parseFloat(s.amount));

              expected_card = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CD")
                .Sum(s => parseFloat(s.amount));

              expected_cheque = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CH")
                .Sum(s => parseFloat(s.amount));

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
                  expected_cash += parseFloat(
                    selectCurrentCash[0].expected_cash
                  );
                  expected_card += parseFloat(
                    selectCurrentCash[0].expected_card
                  );
                  expected_cheque += parseFloat(
                    selectCurrentCash[0].expected_cheque
                  );
                  no_of_cheques += parseFloat(
                    selectCurrentCash[0].no_of_cheques
                  );

                  _mysql
                    .executeQuery({
                      query:
                        "update hims_f_cash_handover_detail set expected_cash=?,expected_card=?,\
                  expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                  and hims_f_cash_handover_detail_id=?;\
                  update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                      values: [
                        expected_cash,
                        expected_card,
                        expected_cheque,
                        no_of_cheques,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        hims_f_cash_handover_detail_id,
                        hims_f_cash_handover_detail_id,
                        req.body.receipt_header_id
                      ],
                      printQuery: true
                    })
                    .then(updateResult => {
                      if (req.connection == null) {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = updateResult;
                          next();
                        });
                      } else {
                        if (req.records) {
                          req.records["internal_error"] = false;
                        } else {
                          req.records = {
                            internal_error: false
                          };
                        }

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
        if (req.connection == null) {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = {
              internal_error: true,
              message: "Current user is not a Cahsier in"
            };
            next();
          });
        } else {
          req.records = {
            internal_error: true,
            message: "Current user is not a Cahsier"
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  //created by:Irfan
  addCashHandover: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);

    const utilities = new algaehUtilities();

    const inputParam = req.body;

    console.log("receiptdetails:", inputParam.receiptdetails);

    try {
      if (req.userIdentity.user_type == "C" && inputParam.shift_id > 0) {
        if (inputParam.receiptdetails.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
                hims_f_cash_handover_detail_id, D.casher_id,D.shift_status,D.open_date,\
                D.expected_cheque,D.expected_card,D.no_of_cheques,D.collected_cash,D.refunded_cash\
                from hims_f_cash_handover_header H left join hims_f_cash_handover_detail D \
                on H.hims_f_cash_handover_header_id=D.cash_handover_header_id\
                and date(D.open_date)=CURDATE()  and casher_id=? and shift_status='O' and D.record_status='A'\
                where H.shift_id=? and date(H.daily_handover_date)=CURDATE() and H.hospital_id=? ",
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.shift_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(result => {
              let collected_cash = 0;
              let expected_card = 0;
              let expected_cheque = 0;
              let no_of_cheques = 0;

              //update Details
              let whichQuery = "UD";

              if (!result.length > 0) {
                //insert header and details
                whichQuery = "IHD";
              } else if (
                result.length > 0 &&
                !result[0]["hims_f_cash_handover_detail_id"] > 0
              ) {
                //insert details
                whichQuery = "ID";
              }

              collected_cash = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CA")
                .Sum(s => parseFloat(s.amount));
              console.log("collected_cash:", collected_cash);
              if (inputParam.pay_type == "P") {
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                            created_date, created_by, updated_date, updated_by,hospital_id)\
                          VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(headerRes => {
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                            shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                            VALUE(?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),
                                collected_cash,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id
                              ],
                              printQuery: true
                            })
                            .then(handoverDetails => {
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                                    update hims_f_receipt_header set cash_handover_detail_id=? where\
                                       hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(updateRecept => {
                                    if (
                                      req.connection == null ||
                                      req.adv_refnd == "Y"
                                    ) {
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if (req.adv_refnd !== "Y") {
                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false
                                        };
                                      }

                                      next();
                                    }
                                  })
                                  .catch(error => {
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error"
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;

                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                        shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                        VALUE(?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(handoverDetails => {
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;\
                              update hims_f_receipt_header set cash_handover_detail_id=? where\
                              hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id
                              ],
                              printQuery: true
                            })
                            .then(updateRecept => {
                              if (
                                req.connection == null ||
                                req.adv_refnd == "Y"
                              ) {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if (req.adv_refnd !== "Y") {
                                    req.records = updateRecept;
                                  }
                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false
                                  };
                                }

                                next();
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;
                  case "UD":
                    collected_cash += parseFloat(result[0].refunded_cash);

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set refunded_cash=?,updated_date=?,updated_by=? where record_status='A' \
                      and hims_f_cash_handover_detail_id=?;\
                      update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                       update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id
                        ],
                        printQuery: true
                      })
                      .then(updateResult => {
                        if (req.connection == null || req.adv_refnd == "Y") {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if (req.adv_refnd !== "Y") {
                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false
                            };
                          }

                          next();
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                    break;
                }
              } else {
                console.log("one :");
                expected_card = new LINQ(inputParam.receiptdetails)
                  .Where(w => w.pay_type == "CD")
                  .Sum(s => parseFloat(s.amount));

                expected_cheque = new LINQ(inputParam.receiptdetails)
                  .Where(w => w.pay_type == "CH")
                  .Sum(s => parseFloat(s.amount));

                no_of_cheques = new LINQ(inputParam.receiptdetails)
                  .Where(w => w.pay_type == "CH")
                  .ToArray().length;

                console.log("whichQuery:", whichQuery);
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                              created_date, created_by, updated_date, updated_by,hospital_id)\
                            VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(headerRes => {
                        console.log("two :");
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,   collected_cash,expected_card,  expected_cheque, \
                              no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),

                                collected_cash,
                                expected_card,
                                expected_cheque,
                                no_of_cheques,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id
                              ],
                              printQuery: true
                            })
                            .then(handoverDetails => {
                              console.log("three :");
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                                    update hims_f_receipt_header set cash_handover_detail_id=? where\
                                         hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(updateRecept => {
                                    console.log("here :", "catt");
                                    if (
                                      req.connection == null ||
                                      req.adv_refnd == "Y"
                                    ) {
                                      console.log("four here :");
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if (req.adv_refnd !== "Y") {
                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      console.log("here :", "dog");
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false
                                        };
                                      }

                                      next();
                                    }
                                  })
                                  .catch(error => {
                                    console.log("error1 :", error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error"
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;

                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                      shift_status,open_date,  collected_cash, expected_card,  expected_cheque, \
                      no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                      VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ]
                      })
                      .then(handoverDetails => {
                        console.log("apple :");
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;\
                              update hims_f_receipt_header set cash_handover_detail_id=? where\
                                hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id
                              ],
                              printQuery: true
                            })
                            .then(updateRecept => {
                              console.log("ball :");
                              if (
                                req.connection == null ||
                                req.adv_refnd == "Y"
                              ) {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if (req.adv_refnd !== "Y") {
                                    req.records = updateRecept;
                                  }

                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false
                                  };
                                }

                                next();
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;
                  case "UD":
                    expected_card += parseFloat(result[0].expected_card);
                    collected_cash += parseFloat(result[0].collected_cash);
                    expected_cheque += parseFloat(result[0].expected_cheque);
                    no_of_cheques += parseFloat(result[0].no_of_cheques);
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set collected_cash=?,expected_card=?,\
                          expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                        and hims_f_cash_handover_detail_id=?;\
                        update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                         update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id
                        ],
                        printQuery: true
                      })
                      .then(updateResult => {
                        console.log("last :");
                        if (req.connection == null || req.adv_refnd == "Y") {
                          console.log("BOOSSS :");
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if (req.adv_refnd !== "Y") {
                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false
                            };
                          }

                          next();
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });

                        console.log("er3 :", error);
                      });
                    break;
                }
              }
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req.records = {
            internal_error: true,
            message: "No receipt details"
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      } else {
        req.records = {
          internal_error: true,
          message: "Current user is not a Cahsier"
        };
        _mysql.rollBackTransaction(() => {
          next();
        });
      }
    } catch (e) {
      console.log("error:", e);
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
  },

  getPakageDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("getPakageDetails ");

    try {
      let inputParam = req.query;

      utilities.logger().log("inputParam: ", inputParam);

      _mysql
        .executeQuery({
          query:
            "SELECT PH.package_service_id,PD.hims_d_package_detail_id,PD.service_id,PD.service_amount \
            FROM hims_d_package_header PH, hims_d_package_detail PD where PH.hims_d_package_header_id=PD.package_header_id and  \
            PH.package_service_id=?;",
          values: [inputParam.package_service_id],
          printQuery: true
        })
        .then(package_details => {
          _mysql.releaseConnection();
          req.records = package_details;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(error);
    }
  },

  patientPackageAdvanceRefund: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

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
          modules: [Module_Name],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
                  created_by, created_date, updated_by, updated_date, shift_id, pay_type,hospital_id) \
                  VALUES (?,?,?,?,?,?,?,?,?,?)",
              values: [
                generatedNumbers[0],
                new Date(),
                inputParam.total_amount,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.shift_id,
                inputParam.pay_type,
                req.userIdentity.hospital_id
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
                          "INSERT  INTO hims_f_patient_pakage_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                            transaction_type, advance_amount, package_id,created_by, \
                            created_date, updated_by, update_date,  hospital_id) VALUES (?,?,?,?,?,?,?,?,?,?) ;\
                            SELECT advance_amount,balance_amount FROM hims_f_package_header WHERE hims_f_package_header_id=?",
                        values: [
                          inputParam.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParam.transaction_type,
                          inputParam.advance_amount,
                          inputParam.package_id,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.hospital_id,
                          inputParam.package_id
                        ],
                        printQuery: true
                      })
                      .then(Insert_Advance => {
                        let existingAdvance =
                          Insert_Advance[1][0].advance_amount;
                        let balance_amount =
                          Insert_Advance[1][0].balance_amount;
                        let utilize_amount =
                          Insert_Advance[1][0].utilize_amount;

                        let strQuery = "";
                        if (existingAdvance != null) {
                          if (inputParam.transaction_type == "AD") {
                            inputParam.balance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(balance_amount);
                            inputParam.advance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(existingAdvance);

                            strQuery +=
                              " , advance_amount='" +
                              inputParam.advance_amount +
                              "' , balance_amount ='" +
                              inputParam.balance_amount +
                              "'";
                          } else if (inputParam.transaction_type == "RF") {
                            strQuery +=
                              ", `closed`='Y', closed_type='R', closed_remarks = '" +
                              inputParam.closed_remarks +
                              "'";
                          }
                        }

                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE  `hims_f_package_header` SET `updated_by`=?, `updated_date`=?" +
                              strQuery +
                              " WHERE `hims_f_package_header_id`=?",
                            values: [
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              inputParam.package_id
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

  updatePatientPackage: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();

    utilities.logger().log("updatePatientPackage: ");
    try {
      let inputParam = req.body;

      utilities.logger().log("consultation data : ", inputParam.consultation);

      utilities
        .logger()
        .log("updatePatientPackage visit_id : ", inputParam.visit_id);
      utilities
        .logger()
        .log("updatePatientPackage doctor_id : ", inputParam.doctor_id);

      if (inputParam.consultation == "Y") {
        for (let i = 0; i < inputParam.package_details.length; i++) {
          inputParam.package_details[i].visit_id = inputParam.visit_id;
          inputParam.package_details[i].doctor_id = inputParam.doctor_id;
        }
      }

      utilities.logger().log("package_details: ", inputParam.package_details);
      req.body.incharge_or_provider = req.body.doctor_id;
      req.body.billed = "N";
      let qry = "";
      for (let i = 0; i < inputParam.package_details.length; i++) {
        qry += mysql.format(
          "UPDATE `hims_f_package_detail` SET utilized_qty=?, available_qty=?,utilized_date=?,utilized_by=? \
          where hims_f_package_detail_id=?;",
          [
            inputParam.package_details[i].utilized_qty,
            inputParam.package_details[i].available_qty,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.package_details[i].hims_f_package_detail_id
          ]
        );
      }

      _mysql
        .executeQuery({
          query: qry,
          forceWithTransactionConnection: req.connection == null ? true : false,
          printQuery: true
        })
        .then(results => {
          _mysql
            .executeQuery({
              query:
                "SELECT * FROM hims_f_package_detail  where package_header_id\
                  in(select package_header_id   FROM hims_f_package_detail  where package_header_id=?\
                  group by package_header_id having sum(available_qty)=0);",
              values: [inputParam.hims_f_package_header_id],
              printQuery: true
            })
            .then(pack_results => {
              let strQuery = "";
              if (pack_results.length > 0) {
                strQuery = ", `closed`='Y', closed_type='D' ";
              }

              utilities
                .logger()
                .log(
                  "actual_utilize_amount: ",
                  inputParam.actual_utilize_amount
                );
              _mysql
                .executeQuery({
                  query:
                    "update hims_f_package_header set balance_amount= ?, actual_utilize_amount=?,utilize_amount=?" +
                    strQuery +
                    " where hims_f_package_header_id=? ",
                  values: [
                    inputParam.balance_amount,
                    inputParam.actual_utilize_amount,
                    inputParam.utilize_amount,
                    inputParam.hims_f_package_header_id
                  ],
                  printQuery: true
                })
                .then(update_header => {
                  if (req.connection == null) {
                    utilities.logger().log("connection : ");
                    req.connection = {
                      connection: _mysql.connection,
                      isTransactionConnection: _mysql.isTransactionConnection,
                      pool: _mysql.pool
                    };
                  }

                  const _services = _.filter(inputParam.package_details, f => {
                    return (
                      f.service_type_id == 2 ||
                      f.service_type_id == 5 ||
                      f.service_type_id == 11
                    );
                  });
                  const _inv_services = _.filter(
                    inputParam.package_details,
                    f => {
                      return f.service_type_id == 4;
                    }
                  );

                  utilities.logger().log("_services : ", _services);

                  insertOrderServices({
                    services: _services,
                    _mysql: _mysql,
                    next: next,
                    inputParam: inputParam,
                    req: req
                  })
                    .then(Order_Services => {
                      utilities
                        .logger()
                        .log("_inv_services : ", _inv_services.length);
                      if (_inv_services.length > 0) {
                        utilities.logger().log("IncludeValues : ");
                        let IncludeValues = [
                          "patient_id",
                          "visit_id",
                          "doctor_id",
                          "service_type_id",
                          "services_id",
                          "trans_package_detail_id",
                          "quantity",
                          "inventory_item_id",
                          "inventory_location_id",
                          "inventory_uom_id"
                        ];

                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO hims_f_ordered_inventory(??) VALUES ?",
                            values: _inv_services,
                            includeValues: IncludeValues,
                            extraValues: {
                              unit_cost: 0,

                              gross_amount: 0,
                              discount_amout: 0,
                              discount_percentage: 0,
                              net_amout: 0,
                              copay_percentage: 0,
                              copay_amount: 0,
                              deductable_amount: 0,
                              deductable_percentage: 0,

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
                              sec_copay_amount: 0,
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              created_date: new Date(),
                              updated_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_date: new Date(),
                              hospital_id: req.userIdentity["x-branch"]
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true
                          })
                          .then(inv_order_detail => {
                            req.records = inv_order_detail;
                            next();
                          })
                          .catch(error => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
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
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:Irfan
  getBillDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      if (req.body.length > 0) {
        const input = req.body;
        const decimal_places = req.userIdentity.decimal_places;
        const outputArray = [];

        const zeroBill = input.find(item => {
          return item.zeroBill == true;
        });

        if (zeroBill == undefined) {
          const service_ids = input.map(val => {
            return val.hims_d_services_id;
          });

          const is_insurance = input.filter(item => {
            return item.insured == "Y";
          });

          let strQuery = "";

          if (is_insurance.length > 0) {
            const network_office_ids = is_insurance.map(item => {
              return item.primary_network_office_id;
            });

            const insurance_provider_ids = is_insurance.map(item => {
              return item.primary_insurance_provider_id;
            });

            const network_ids = is_insurance.map(item => {
              return item.primary_network_id;
            });

            strQuery = `select hims_d_insurance_network_office_id,price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,\
                 copay_percent_dental,copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, \
               deductible_trt, deductible_medicine from hims_d_insurance_network_office where hospital_id=${req.userIdentity.hospital_id}\
               and hims_d_insurance_network_office_id in (${network_office_ids});\
               select SI.insurance_id ,SI.services_id,IP.company_service_price_type,copay_status,copay_amt,deductable_status,\
               deductable_amt,pre_approval,covered,net_amount,gross_amt, cpt_code \
               from hims_d_services_insurance SI inner join hims_d_insurance_provider IP on\
               IP.hims_d_insurance_provider_id=SI.insurance_id where SI.hospital_id=${req.userIdentity.hospital_id}\
               and SI.insurance_id in (${insurance_provider_ids}) and\
               SI.services_id in (${service_ids})  and SI.record_status='A' and IP.record_status='A';\
               select SIN.network_id ,SIN.services_id,IP.insurance_provider_name, IP.company_service_price_type, NET.network_type,\
               copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
               net_amount,gross_amt from  hims_d_services_insurance_network SIN\
               inner join hims_d_insurance_network NET on NET.hims_d_insurance_network_id=SIN.network_id\
               inner join hims_d_insurance_provider IP on SIN.insurance_id=IP.hims_d_insurance_provider_id \
               where   SIN.hospital_id=${req.userIdentity.hospital_id} and SIN.network_id in (${network_ids})\
               AND SIN.services_id in (${service_ids}) and SIN.record_status='A' and NET.record_status='A';`;
          }

          _mysql
            .executeQuery({
              query: `select hims_d_services_id,service_code,cpt_code,service_name,arabic_service_name,service_desc,sub_department_id,\
             service_type_id,procedure_type,standard_fee,followup_free_fee,followup_paid_fee,discount,vat_applicable,\
             vat_percent,service_status,effective_start_date,effectice_end_date,physiotherapy_service from hims_d_services\
             where hospital_id=? and hims_d_services_id in (?);${strQuery}`,
              values: [req.userIdentity.hospital_id, service_ids],
              printQuery: true
            })
            .then(result => {
              _mysql.releaseConnection();

              const allServices = strQuery == "" ? result : result[0];
              const allPolicy = strQuery == "" ? [] : result[1];
              const allCompany_price = strQuery == "" ? [] : result[2];
              const allPolicy_price = strQuery == "" ? [] : result[3];
              let apr_amount_bulk = 0;
              for (let i = 0; i < input.length; i++) {
                let servicesDetails = input[i];

                const records = allServices.find(
                  f =>
                    f.hims_d_services_id === servicesDetails.hims_d_services_id
                );

                let unit_cost =
                  servicesDetails.unit_cost == undefined
                    ? 0
                    : parseFloat(servicesDetails.unit_cost);

                let from_pos = servicesDetails.from_pos;

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
                  total_tax = 0,
                  s_patient_tax = 0;

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
                    : parseFloat(servicesDetails.quantity);

                let discount_amout =
                  servicesDetails.discount_amout == undefined
                    ? 0
                    : parseFloat(servicesDetails.discount_amout);

                let discount_percentage =
                  servicesDetails.discount_percentage == undefined
                    ? 0
                    : parseFloat(servicesDetails.discount_percentage);

                let insured =
                  servicesDetails.insured == undefined
                    ? "N"
                    : servicesDetails.insured;

                let sec_insured =
                  servicesDetails.sec_insured == undefined
                    ? "N"
                    : servicesDetails.sec_insured;

                let bulkProcess =
                  servicesDetails.bulkProcess == undefined
                    ? "N"
                    : servicesDetails.bulkProcess;
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
                    : parseFloat(servicesDetails.approved_amount);

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
                let billed = servicesDetails.billed == undefined
                  ? "N"
                  : servicesDetails.billed;
                let preapp_limit_amount =
                  servicesDetails.preapp_limit_amount == undefined
                    ? 0
                    : servicesDetails.preapp_limit_amount;
                // insurance_price_list
                let policydtls = {};
                if (insured == "Y") {
                  let prices;
                  const cur_policy = allPolicy.find(p => {
                    return (
                      p.hims_d_insurance_network_office_id ==
                      input[i]["primary_network_office_id"]
                    );
                  });

                  if (
                    cur_policy != undefined &&
                    cur_policy["price_from"] == "S"
                  ) {
                    prices = allCompany_price.find(item => {
                      return (
                        item.insurance_id ==
                        input[i]["primary_insurance_provider_id"] &&
                        item.services_id == input[i]["hims_d_services_id"]
                      );
                    });
                  }

                  if (
                    cur_policy != undefined &&
                    cur_policy["price_from"] == "P"
                  ) {
                    prices = allPolicy_price.find(item => {
                      return (
                        item.network_id == input[i]["primary_network_id"] &&
                        item.services_id == input[i]["hims_d_services_id"]
                      );
                    });
                  }

                  policydtls = { ...cur_policy, ...prices };
                }

                covered =
                  policydtls != null
                    ? policydtls.covered != null
                      ? policydtls.covered
                      : "N"
                    : "N";

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

                icd_code =
                  policydtls.cpt_code !== null
                    ? policydtls.cpt_code
                    : records.cpt_code;

                if (insured == "Y" && policydtls.covered == "Y") {
                  ser_net_amount = policydtls.net_amount;
                  ser_gross_amt = policydtls.gross_amt;

                  if (policydtls.company_service_price_type == "N") {
                    unit_cost =
                      unit_cost != 0
                        ? unit_cost
                        : parseFloat(policydtls.net_amount);
                  } else {
                    unit_cost =
                      unit_cost != 0
                        ? unit_cost
                        : parseFloat(policydtls.gross_amt);
                  }

                  // if (conversion_factor != 0) {
                  //   unit_cost = unit_cost * conversion_factor;
                  // }
                  gross_amount = quantity * unit_cost;
                  gross_amount = utilities.decimalPoints(
                    gross_amount,
                    decimal_places
                  );
                  if (discount_amout > 0) {
                    discount_percentage = (discount_amout / gross_amount) * 100;
                  } else if (discount_percentage > 0) {
                    discount_amout = (gross_amount * discount_percentage) / 100;
                    discount_amout = utilities.decimalPoints(
                      discount_amout,
                      decimal_places
                    );
                  }
                  net_amout = parseFloat(gross_amount) - parseFloat(discount_amout);
                  net_amout = utilities.decimalPoints(
                    net_amout,
                    decimal_places
                  );
                  console.log("copay_status", policydtls.copay_status)
                  //Patient And Company
                  if (policydtls.copay_status == "Y") {
                    copay_amount = policydtls.copay_amt;
                    copay_percentage =
                      (parseFloat(copay_amount) / parseFloat(net_amout)) * 100;
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
                      appsettings.hims_d_service_type.service_type_id
                        .Procedure == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_trt;
                      deductable_percentage = policydtls.deductible_trt;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Provider == records.service_type_id
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
                      appsettings.hims_d_service_type.service_type_id
                        .Radiology == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_rad;
                      deductable_percentage = policydtls.deductible_rad;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Pharmacy == records.service_type_id
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

                    console.log("deductable_percentage", deductable_percentage)
                    deductable_amount =
                      deductable_percentage !== null ? (parseFloat(net_amout) * parseFloat(deductable_percentage)) / 100 : 0;

                    deductable_amount = utilities.decimalPoints(
                      deductable_amount,
                      decimal_places
                    );
                    after_dect_amout = parseFloat(net_amout) - parseFloat(deductable_amount);
                    copay_amount =
                      (parseFloat(after_dect_amout) * parseFloat(copay_percentage)) / 100;
                    copay_amount = utilities.decimalPoints(
                      copay_amount,
                      decimal_places
                    );
                  }
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof patient_resp);
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof copay_amount);
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof deductable_amount);

                  console.log("patient_resp", patient_resp);
                  console.log("copay_amount", copay_amount);
                  console.log("deductable_amount", deductable_amount);
                  patient_resp = parseFloat(copay_amount) + parseFloat(deductable_amount);

                  utilities
                    .logger()
                    .log("service_type_id: ", typeof patient_resp);

                  comapany_resp = parseFloat(net_amout) - parseFloat(patient_resp);
                  comapany_resp = utilities.decimalPoints(
                    comapany_resp,
                    decimal_places
                  );

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax =
                      (parseFloat(patient_resp) * parseFloat(records.vat_percent)) / 100;

                    patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                  }
                  utilities
                    .logger()
                    .log("vat_applicable: ", records.vat_applicable);
                  if (records.vat_applicable == "Y") {
                    s_patient_tax =
                      (parseFloat(patient_resp) * parseFloat(records.vat_percent)) / 100;

                    s_patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                  }

                  if (records.vat_applicable == "Y") {
                    company_tax =
                      (parseFloat(comapany_resp) * parseFloat(records.vat_percent)) / 100;
                    company_tax = utilities.decimalPoints(
                      company_tax,
                      decimal_places
                    );
                  }
                  total_tax = parseFloat(patient_tax) + parseFloat(company_tax);
                  // total_tax = total_tax.toFixed(decimal_places);
                  patient_payable = parseFloat(patient_resp) + parseFloat(patient_tax);
                  // patient_payable = patient_payable.toFixed(decimal_places);

                  if (approved_amount !== 0 && approved_amount < unit_cost) {
                    let diff_val = parseFloat(approved_amount) - parseFloat(comapany_resp);
                    patient_payable = parseFloat(patient_payable) + parseFloat(diff_val);
                    patient_resp = parseFloat(patient_resp) + parseFloat(diff_val);
                    comapany_resp = parseFloat(comapany_resp) - parseFloat(diff_val);

                    patient_payable = utilities.decimalPoints(
                      patient_payable,
                      decimal_places
                    );
                    patient_resp = utilities.decimalPoints(
                      patient_resp,
                      decimal_places
                    );
                    comapany_resp = utilities.decimalPoints(
                      comapany_resp,
                      decimal_places
                    );
                  }

                  company_payble = parseFloat(net_amout) - parseFloat(patient_resp);

                  company_payble = parseFloat(company_payble) + parseFloat(company_tax);

                  company_payble = utilities.decimalPoints(
                    company_payble,
                    decimal_places
                  );

                  preapp_limit_amount = parseFloat(policydtls.preapp_limit);

                  if (policydtls.preapp_limit !== 0) {
                    if (bulkProcess == "Y") {
                      apr_amount_bulk =
                        parseFloat(apr_amount_bulk) +
                        parseFloat(company_payble);

                      approval_amt = parseFloat(approval_amt) + parseFloat(apr_amount_bulk);
                    } else {
                      approval_amt =
                        parseFloat(approval_amt) + parseFloat(company_payble);
                    }

                    // utilities.logger().log("approval_amt: ", approval_amt);
                    // utilities.logger().log("company_payble: ", company_payble);
                    // utilities
                    //   .logger()
                    //   .log("preapp_limit_amount: ", preapp_limit_amount);
                    if (approval_amt > preapp_limit_amount) {
                      // utilities.logger().log("enter: ");
                      preapp_limit_exceed = "Y";
                    }
                    // utilities
                    //   .logger()
                    //   .log("preapp_limit_exceed: ", preapp_limit_exceed);
                  }

                  //If primary and secondary exists
                } else {
                  if (FollowUp === true) {
                    unit_cost =
                      unit_cost != 0
                        ? parseFloat(unit_cost)
                        : parseFloat(records.followup_free_fee);
                  } else {
                    unit_cost =
                      from_pos == "Y"
                        ? parseFloat(unit_cost)
                        : unit_cost != 0
                          ? parseFloat(unit_cost)
                          : parseFloat(records.standard_fee);
                  }

                  // if (conversion_factor != 0) {
                  //   unit_cost = unit_cost * conversion_factor;
                  // }
                  console.log("unit_cost", unit_cost);
                  gross_amount = quantity * parseFloat(unit_cost);
                  console.log("gross_amount", gross_amount);
                  console.log("decimal_places", decimal_places);
                  gross_amount = utilities.decimalPoints(
                    gross_amount,
                    decimal_places
                  );

                  if (discount_amout > 0) {
                    discount_percentage = (parseFloat(discount_amout) / parseFloat(gross_amount)) * 100;
                  } else if (discount_percentage > 0) {
                    discount_amout = (parseFloat(gross_amount) * parseFloat(discount_percentage)) / 100;
                    discount_amout = utilities.decimalPoints(
                      discount_amout,
                      decimal_places
                    );
                  }
                  net_amout = parseFloat(gross_amount) - parseFloat(discount_amout);
                  patient_resp = parseFloat(net_amout);

                  utilities
                    .logger()
                    .log("pat_vat_applicable: ", vat_applicable);

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax =
                      (parseFloat(patient_resp) * parseFloat(records.vat_percent)) / 100;

                    patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                    total_tax = parseFloat(patient_tax);
                  }

                  if (records.vat_applicable === "Y") {
                    utilities
                      .logger()
                      .log("vat_applicable: ", records.vat_applicable);
                    s_patient_tax =
                      (parseFloat(patient_resp) * parseFloat(records.vat_percent)) / 100;

                    s_patient_tax = utilities.decimalPoints(
                      s_patient_tax,
                      decimal_places
                    );
                  }

                  // patient_payable = net_amout + patient_tax;
                  patient_payable = parseFloat(patient_resp) + parseFloat(patient_tax);
                }

                // }
                //--------------------------------------
                console.log("fine:calculated bill details");
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
                    s_patient_tax: 0,
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
                    sec_copay_amount: 0,
                  },
                  {
                    service_type_id: records.service_type_id,
                    service_name: records.service_name,
                    insurance_service_name: records.service_name,
                    services_id: records.hims_d_services_id,
                    physiotherapy_service: records.physiotherapy_service,
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
                    s_patient_tax: s_patient_tax,
                    company_tax: company_tax,
                    sec_company_tax: sec_company_tax,
                    total_tax: total_tax,

                    sec_copay_percntage: sec_copay_percntage,
                    sec_copay_amount: sec_copay_amount,
                    sec_company_res: sec_company_res,
                    sec_company_paybale: sec_company_paybale,
                    pre_approval: insured == "Y" ? pre_approval : "N",
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
                    item_group_id: servicesDetails.item_group_id,
                    package_id: servicesDetails.package_id,
                    package_visit_type: servicesDetails.package_visit_type,
                    package_type: servicesDetails.package_type,
                    actual_amount: servicesDetails.actual_amount,
                    pack_expiry_date: servicesDetails.expiry_date,
                    hims_f_ordered_services_id: servicesDetails.hims_f_ordered_services_id,
                    billed: billed
                  }
                );

                outputArray.push(out);

                if (i == input.length - 1) {
                  req.records = { billdetails: outputArray };
                  next();
                }
              }
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          let out = [
            {
              hims_f_billing_details_id: null,
              hims_f_billing_header_id: null,
              service_type_id: zeroBill.service_type_id,
              service_name: "service_name",
              services_id: zeroBill.hims_d_services_id,
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
            }
          ];

          req.records = { billdetails: out };
          next();
          return;
        }
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid Input"
        };

        next();
        return;
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(error);
    }
  },
  getEmployeeAndDepartments: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let strQuery = "";
        if (req.query.services_id != null) {
          strQuery += "and services_id = '" + req.query.services_id + "'";
        }
        if (req.query.employee_id != null) {
          strQuery += "and employee_id = '" + req.query.employee_id + "'";
        }
        _mysql
          .executeQuery({
            query:
              "SELECT hims_d_employee_id as employee_id, sub_department_id, services_id from hims_d_employee \
            Where record_status='A' " +
              strQuery,
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch(e => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  closePackage: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "update hims_f_package_header set closed='Y', closed_type='C', closed_remarks=? where hims_f_package_header_id=? ",
          values: [req.body.closed_remarks, req.body.hims_f_package_header_id],
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
    } catch (e) {
      reject(e);
      next(e);
    }
  },

  //created by:IRFAN
  addtoDayEnd: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;
  
      const _mysql = new algaehMysql(_options);
  
      const utilities = new algaehUtilities();
  
      const inputParam = req.body;
  
      console.log("ONE:");
  
      utilities.logger().log("inputParamRR: ", inputParam);
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO finance_day_end_header (transaction_date,amount,control_account,document_type,document_id,\
              document_number,from_screen,transaction_type,cutomer_type,hospital_id) \
              VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            new Date(),
            inputParam.total_amount,
            "OP_CON",
            "RECEIPT",
            inputParam.receipt_header_id,
            inputParam.receipt_number            ,
            "FD0002",
            inputParam.transaction_type,
            "P",
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerDayEnd => {
          console.log("TWO:");
  
          const insertDetail = inputParam.receiptdetails.map(m => {
            return {
              amount: m.amount,
              payment_mode: m.pay_type
            };
          });
          const IncludeValues = ["amount", "payment_mode"];
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO finance_day_end_detail (??) \
                VALUES ? ",
              values: insertDetail,
              includeValues: IncludeValues,
              bulkInsertOrUpdate: true,
              extraValues: {
                day_end_header_id: headerDayEnd["insertId"]
              },
              printQuery: true
            })
            .then(detail => {

              console.log("THREE:");
              _mysql
                .executeQuery({
                  query: "SELECT * FROM finance_accounts_maping;\
                  select * from finance_day_end_detail where day_end_header_id=?; ",
                  values:[headerDayEnd.insertId],
                  printQuery: true
                })
                .then(rest => {

                  const controlResult=rest[0];
                  const day_end_detail=rest[1];

                  const OP_DEP = controlResult.find(f => {
                    return f.account == "OP_DEP";
                  });
  
                  const CH_IN_HA = controlResult.find(f => {
                    return f.account == "CH_IN_HA";
                  });
  
                  const insertSubDetail = [];
  
                  if (inputParam.transaction_type == "AD") {

                    day_end_detail.forEach(item => {

                  if(item.payment_mode=="CA"){
                      insertSubDetail.push({
                        day_end_detail_id:item.finance_day_end_detail_id,
                        payment_date: new Date(),
                        head_account_code:OP_DEP.head_account_code,
                        head_id: OP_DEP.head_id,
                        child_id: OP_DEP.child_id,
                        debit_amount: item.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        narration:"OP BILL CASH COLLECTION BEBIT",
                        hospital_id: req.userIdentity.hospital_id
                      });
                      insertSubDetail.push({
                        day_end_detail_id:item.finance_day_end_detail_id,
                        payment_date: new Date(),
                        head_account_code:CH_IN_HA.head_account_code,
                        head_id: CH_IN_HA.head_id,
                        child_id: CH_IN_HA.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: item.amount,
                        narration:"OP BILL CASH COLLECTION  CREDIT",
                        hospital_id: req.userIdentity.hospital_id
                    
                      });
                    }


                    });
  
                    const IncludeValuess = [
                      "day_end_detail_id",
                      "payment_date",
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
                          "INSERT INTO finance_day_end_sub_detail (??) \
                           VALUES ? ",
                        values: insertSubDetail,
                        includeValues: IncludeValuess,
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(subResult => {
                        console.log("FOUR");
                        next();
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
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
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  //created by:IRFAN
  addtoDayEndSAVE: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;
  
      const _mysql = new algaehMysql(_options);
  
      const utilities = new algaehUtilities();
  
      const inputParam = req.body;
  
      console.log("ONE:");
  
      utilities.logger().log("inputParamRR: ", inputParam);
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO finance_day_end_header (transaction_date,amount,control_account,document_type,document_id,\
              document_number,from_screen,transaction_type,cutomer_type,hospital_id) \
              VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            new Date(),
            inputParam.total_amount,
            "OP_CON",
            "RECEIPT",
            inputParam.receipt_header_id,
            inputParam.receipt_number            ,
            inputParam.ScreenCode,
            inputParam.transaction_type,
            "P",
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerDayEnd => {
          console.log("TWO:");
  
          const insertDetail = inputParam.receiptdetails.map(m => {
            return {
              amount: m.amount,
              payment_mode: m.pay_type
            };
          });
          const IncludeValues = ["amount", "payment_mode"];
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO finance_day_end_detail (??) \
                VALUES ? ",
              values: insertDetail,
              includeValues: IncludeValues,
              bulkInsertOrUpdate: true,
              extraValues: {
                day_end_header_id: headerDayEnd["insertId"]
              },
              printQuery: true
            })
            .then(detail => {

              let fetchServiceDetails="";
              if(inputParam.billdetails.length>0){

                const servicesIds=inputParam.billdetails.map(m=>{
                  return m.services_id;
                })
                fetchServiceDetails=` SELECT hims_d_services_id,head_account,head_id,child_id FROM hims_d_services
                where hims_d_services_id in(${servicesIds}); `
                        
              }

              console.log("THREE:");
              _mysql
                .executeQuery({
                  query: "SELECT * FROM finance_accounts_maping;\
                  select * from finance_day_end_detail where day_end_header_id=?; "+fetchServiceDetails,
                  values:[headerDayEnd.insertId],
                  printQuery: true
                })
                .then(rest => {

                  const controlResult=rest[0];
                  const day_end_detail=rest[1];

                  const OP_DEP = controlResult.find(f => {
                    return f.account == "OP_DEP";
                  });
  
                  const CH_IN_HA = controlResult.find(f => {
                    return f.account == "CH_IN_HA";
                  });
  
                  const insertSubDetail = [];
  

                  //------------------------4444
              

                  //finall insert
                  new Promise((resolve, reject) => {
                    try {
                     
                      if(inputParam.billdetails.length>0){


                        day_end_detail.forEach(item => {
                          if (item.payment_mode == "CA") {
                            insertSubDetail.push({
                              day_end_detail_id: item.finance_day_end_detail_id,
                              payment_date: new Date(),
                              head_account_code: OP_DEP.head_account_code,
                              head_id: OP_DEP.head_id,
                              child_id: OP_DEP.child_id,
                              debit_amount: item.amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              narration: "OP BILL CASH COLLECTION BEBIT",
                              hospital_id: req.userIdentity.hospital_id
                            });
                            insertSubDetail.push({
                              day_end_detail_id: item.finance_day_end_detail_id,
                              payment_date: new Date(),
                              head_account_code: CH_IN_HA.head_account_code,
                              head_id: CH_IN_HA.head_id,
                              child_id: CH_IN_HA.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: item.amount,
                              narration: "OP BILL CASH COLLECTION  CREDIT",
                              hospital_id: req.userIdentity.hospital_id
                            });
                          }
                        });
                        resolve({});
                        
                      }
                      else if (inputParam.transaction_type == "AD") {
                        day_end_detail.forEach(item => {
                          if (item.payment_mode == "CA") {
                            insertSubDetail.push({
                              day_end_detail_id: item.finance_day_end_detail_id,
                              payment_date: new Date(),
                              head_account_code: OP_DEP.head_account_code,
                              head_id: OP_DEP.head_id,
                              child_id: OP_DEP.child_id,
                              debit_amount: item.amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              narration: "OP BILL CASH COLLECTION BEBIT",
                              hospital_id: req.userIdentity.hospital_id
                            });
                            insertSubDetail.push({
                              day_end_detail_id: item.finance_day_end_detail_id,
                              payment_date: new Date(),
                              head_account_code: CH_IN_HA.head_account_code,
                              head_id: CH_IN_HA.head_id,
                              child_id: CH_IN_HA.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: item.amount,
                              narration: "OP BILL CASH COLLECTION  CREDIT",
                              hospital_id: req.userIdentity.hospital_id
                            });
                          }
                        });
                        resolve({});
                      } else {
                        next();
                      }
                      

                    } catch (e) {
                      reject(e);
                    }}).then(rest => {


                      const IncludeValuess = [
                        "day_end_detail_id",
                        "payment_date",
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
                            "INSERT INTO finance_day_end_sub_detail (??) \
                             VALUES ? ",
                          values: insertSubDetail,
                          includeValues: IncludeValuess,
                          bulkInsertOrUpdate: true,
                          printQuery: true
                        })
                        .then(subResult => {
                          console.log("FOUR");
                          next();
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
        next(e);
      });
    }
  },
  //created by:IRFAN
  addtoDayEnd_DELETE: (req, res, next) => {
    try {
    
      financeCalc(req)
        .then(result => {
          console.log("TWO:");
          next();
  
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
  
};

//Not in Use
function getBillDetailsFunctionality(req, res, next, resolve) {
  const _mysql = new algaehMysql();
  try {
    let service_ids = null;
    // let questions = "?";

    // const utilities = new algaehUtilities();

    if (Array.isArray(req.body)) {
      let len = req.body.length;
      // service_ids = new LINQ(req.body).Select(g => g.hims_d_services_id);
      service_ids = req.body.map(val => {
        return val.hims_d_services_id;
      });

      // for (let i = 1; i < len; i++) {
      //   questions += ",?";
      // }
    }

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id` IN (?) AND record_status='A'",
        values: [service_ids],

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        let outputArray = [];
        for (let m = 0; m < result.length; m++) {
          let servicesDetails = { ...req.body[m] };

          // let records = result[m];
          let records = _.find(
            result,
            f => f.hims_d_services_id === servicesDetails.hims_d_services_id
          );
          const utilities = new algaehUtilities();
          utilities.logger().log("result: ", records.hims_d_services_id);
          utilities.logger().log("body: ", servicesDetails.hims_d_services_id);

          utilities.logger().log("service_type_id: ", records.service_type_id);
          utilities
            .logger()
            .log("hims_d_services_id: ", servicesDetails.service_type_id);

          req.body[m].service_type_id = records.service_type_id;
          req.body[m].services_id = records.hims_d_services_id;

          //Calculation Declarations

          utilities.logger().log("unit_cost: ", servicesDetails.unit_cost);
          let unit_cost =
            servicesDetails.unit_cost == undefined
              ? 0
              : servicesDetails.unit_cost;

          let from_pos = servicesDetails.from_pos;

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
          utilities.logger().log("conversion_factor: ", conversion_factor);
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

          utilities.logger().log("insured: ", insured);

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
              utilities.logger().log("policydtls: ", policydtls);

              utilities.logger().log("covered: ", policydtls.covered);
              covered =
                policydtls != null
                  ? policydtls.covered != null
                    ? policydtls.covered
                    : "N"
                  : "N";
              utilities.logger().log("covered: ", covered);
              utilities.logger().log("pre_approval: ", pre_approval);
              utilities.logger().log("apprv_status: ", apprv_status);
              if (
                covered == "N" ||
                (pre_approval == "Y" && apprv_status == "RJ")
              ) {
                insured = "N";
              }

              utilities
                .logger()
                .log("approval_limit_yesno: ", approval_limit_yesno);
              if (approval_limit_yesno == "Y") {
                pre_approval = "Y";
              }

              if (pre_approval == "N") {
                pre_approval =
                  policydtls !== null ? policydtls.pre_approval : "N";
              }

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

                // if (conversion_factor != 0) {
                //   unit_cost = unit_cost * conversion_factor;
                // }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = discount_amout.toFixed(2);
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
                  copay_amount = copay_amount.toFixed(2);
                }

                patient_resp = copay_amount + deductable_amount;
                comapany_resp = (net_amout - patient_resp).toFixed(2);

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }

                if (records.vat_applicable == "Y") {
                  company_tax = (
                    (comapany_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }
                total_tax = (patient_tax + company_tax).toFixed(2);

                patient_payable = (patient_resp + patient_tax).toFixed(2);

                console.log("approved_amount: ", approved_amount);
                console.log("unit_cost: ", unit_cost);

                if (approved_amount !== 0 && approved_amount < unit_cost) {
                  let diff_val = approved_amount - comapany_resp;
                  patient_payable = (patient_payable + diff_val).toFixed(2);
                  patient_resp = (patient_resp + diff_val).toFixed(2);
                  comapany_resp = comapany_resp - diff_val;
                }

                company_payble = net_amout - patient_resp;

                company_payble = (company_payble + company_tax).toFixed(2);

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
                  unit_cost =
                    from_pos == "Y"
                      ? unit_cost
                      : unit_cost != 0
                        ? unit_cost
                        : records.standard_fee;
                }

                // if (conversion_factor != 0) {
                //   unit_cost = unit_cost * conversion_factor;
                // }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = discount_amout.toFixed(2);
                }
                net_amout = gross_amount - discount_amout;
                patient_resp = net_amout;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                  total_tax = patient_tax;
                }

                // patient_payable = net_amout + patient_tax;
                patient_payable = patient_resp + patient_tax.toFixed(2);
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

                  sec_copay_amount = sec_copay_amount.toFixed(2);
                }

                patient_resp = sec_copay_amount + sec_deductable_amount;
                sec_company_res = sec_unit_cost - patient_resp;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }

                if (records.vat_applicable == "Y") {
                  sec_company_tax = (
                    (sec_company_res * records.vat_percent) /
                    100
                  ).toFixed(2);
                }
                total_tax = patient_tax + company_tax + sec_company_res;

                patient_payable = patient_resp + patient_tax.toFixed(2);
                sec_company_paybale =
                  sec_unit_cost - patient_resp + sec_company_tax;
              }
              utilities
                .logger()
                .log(
                  "hims_d_services_id: ",
                  servicesDetails.hims_d_services_id
                );
              utilities
                .logger()
                .log("service_type_id: ", records.service_type_id);

              utilities
                .logger()
                .log("hims_d_services_id: ", records.hims_d_services_id);

              discount_percentage = discount_percentage.toFixed(3);
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
                  services_id: records.hims_d_services_id,
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
                  pre_approval: insured == "Y" ? pre_approval : "N",
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
                  item_group_id: servicesDetails.item_group_id,
                  package_id: servicesDetails.package_id,
                  package_visit_type: servicesDetails.package_visit_type,
                  package_type: servicesDetails.package_type,
                  actual_amount: servicesDetails.actual_amount,
                  pack_expiry_date: servicesDetails.expiry_date
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

    const utilities = new algaehUtilities();

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
              utilities.logger().log("result_s: ", result_s);
              utilities.logger().log("resultOffic: ", resultOffic);
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
            copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
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
function insertOrderServices(options) {
  return new Promise((resolve, reject) => {
    try {
      const _mysql = options._mysql;
      const _services = options.services;
      const inputParam = options.inputParam;
      const req = options.req;
      const utilities = new algaehUtilities();
      utilities.logger().log("_services : ", _services.length);
      if (_services.length > 0) {
        let IncludeValues = [
          "patient_id",
          "visit_id",
          "doctor_id",
          "service_type_id",
          "services_id",
          "trans_package_detail_id"
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_ordered_services(??) VALUES ?",
            values: _services,
            includeValues: IncludeValues,
            extraValues: {
              quantity: 1,
              unit_cost: 0,

              gross_amount: 0,
              discount_amout: 0,
              discount_percentage: 0,
              net_amout: 0,
              copay_percentage: 0,
              copay_amount: 0,
              deductable_amount: 0,
              deductable_percentage: 0,

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
              sec_copay_amount: 0,
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity["x-branch"]
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(order_detail => {
            utilities.logger().log("order_detail: ", order_detail);
            let patient_id;
            let doctor_id;
            let visit_id;
            let services = new LINQ(inputParam.package_details)
              .Select(s => {
                patient_id = s.patient_id;
                doctor_id = s.doctor_id;
                visit_id = s.visit_id;
                return s.services_id;
              })
              .ToArray();

            utilities.logger().log("services: ", services);
            let servicesForPreAproval = [];

            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            utilities
              .logger()
              .log("servicesForPreAproval: ", servicesForPreAproval);

            _mysql
              .executeQuery({
                query:
                  "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                   where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
                values: servicesForPreAproval,
                printQuery: true
              })
              .then(ordered_services => {
                req.body.billdetails = ordered_services;
                resolve();
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                  reject(error);
                });
              });
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              options.next(error);
              reject(error);
            });
          });
      } else {
        req.body.billdetails = [];
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}


function financeCalc(req){
  return new Promise((resolve, reject) => {
    try {
      const _options = req.connection == null ? {} : req.connection;
  
      const _mysql = new algaehMysql(_options);
  
      const utilities = new algaehUtilities();
  
      const inputParam = req.body;
      console.log("FFFFFFFFFFFFFFFFF")
      utilities.logger().log("REQINPUT: ", inputParam);

if(inputParam.billdetails.length>0){

}else

      if(false){
        console.log("jjjjjjjjjjjj")

        _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO finance_day_end_header (transaction_date,amount,control_account,document_type,document_id,\
              document_number,from_screen,transaction_type,cutomer_type,hospital_id) \
              VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            new Date(),
            inputParam.total_amount,
            "OP_CON",
            "RECEIPT",
            inputParam.receipt_header_id,
            inputParam.receipt_number            ,
            inputParam.ScreenCode,
            inputParam.transaction_type,
            "P",
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(headerDayEnd => {
          console.log("TWO:");
  
          const insertDetail = inputParam.receiptdetails.map(m => {
            return {
              amount: m.amount,
              payment_mode: m.pay_type
            };
          });
          const IncludeValues = ["amount", "payment_mode"];
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO finance_day_end_detail (??) \
                VALUES ? ",
              values: insertDetail,
              includeValues: IncludeValues,
              bulkInsertOrUpdate: true,
              extraValues: {
                day_end_header_id: headerDayEnd["insertId"]
              },
              printQuery: true
            })
            .then(detail => {

              console.log("THREE:");
              _mysql
                .executeQuery({
                  query: "SELECT * FROM finance_accounts_maping;\
                  select * from finance_day_end_detail where day_end_header_id=?; ",
                  values:[headerDayEnd.insertId],
                  printQuery: true
                })
                .then(rest => {

                  const controlResult=rest[0];
                  const day_end_detail=rest[1];

                  const OP_DEP = controlResult.find(f => {
                    return f.account == "OP_DEP";
                  });
  
                  const CH_IN_HA = controlResult.find(f => {
                    return f.account == "CH_IN_HA";
                  });
  
                  const insertSubDetail = [];
  
                  if (inputParam.transaction_type == "AD") {

                    day_end_detail.forEach(item => {

                  if(item.payment_mode=="CA"){
                      insertSubDetail.push({
                        day_end_detail_id:item.finance_day_end_detail_id,
                        payment_date: new Date(),
                        head_account_code:OP_DEP.head_account_code,
                        head_id: OP_DEP.head_id,
                        child_id: OP_DEP.child_id,
                        debit_amount: item.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        narration:"OP BILL CASH COLLECTION BEBIT",
                        hospital_id: req.userIdentity.hospital_id
                      });
                      insertSubDetail.push({
                        day_end_detail_id:item.finance_day_end_detail_id,
                        payment_date: new Date(),
                        head_account_code:CH_IN_HA.head_account_code,
                        head_id: CH_IN_HA.head_id,
                        child_id: CH_IN_HA.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: item.amount,
                        narration:"OP BILL CASH COLLECTION  CREDIT",
                        hospital_id: req.userIdentity.hospital_id
                    
                      });
                    }


                    });
  
                    const IncludeValuess = [
                      "day_end_detail_id",
                      "payment_date",
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
                          "INSERT INTO finance_day_end_sub_detail (??) \
                           VALUES ? ",
                        values: insertSubDetail,
                        includeValues: IncludeValuess,
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(subResult => {
                        console.log("FOUR");
                        resolve(subResult);
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          reject(error);
                        });
                      });
                  } else {
                    resolve({});
                  }
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    reject(error);
                  });
                });
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                reject(error);
              });
            });
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            reject(error);
          });
        });
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}