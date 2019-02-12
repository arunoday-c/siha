import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";

module.exports = {
  newReceiptData: (req, res, next) => {
    try {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
      let inputParam = { ...req.body };

      const utilities = new algaehUtilities();
      utilities.logger().log("inputParam Receipt: ", inputParam);

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
          utilities.logger().log("headerRcptResult: ", headerRcptResult);
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
                utilities
                  .logger()
                  .log("RcptDetailsRecords: ", RcptDetailsRecords);
                if (req.mySQl == null) {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = headerRcptResult;
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
    try {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
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

      const utilities = new algaehUtilities();
      utilities.logger().log("inputParam Bill: ", inputParam);

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
          utilities.logger().log("headerResult Bill: ", headerResult);
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
              utilities.logger().log("detailsRecords Bill: ", detailsRecords);
              if (req.mySQl == null) {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = headerResult;
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  billingCalculations: (req, res, next) => {
    try {
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

      debugLog("bool Value: ", hasCalculateall);
      debugLog("Input", req.body);
      if (hasCalculateall == true) {
        sendingObject.sub_total_amount = new LINQ(inputParam).Sum(
          d => d.gross_amount
        );
        sendingObject.net_total = new LINQ(inputParam).Sum(d => d.net_amout);
        sendingObject.discount_amount = new LINQ(inputParam).Sum(
          d => d.discount_amout
        );
        sendingObject.gross_total = new LINQ(inputParam).Sum(
          d => d.patient_payable
        );

        // Primary Insurance
        sendingObject.copay_amount = new LINQ(inputParam).Sum(
          d => d.copay_amount
        );
        sendingObject.deductable_amount = new LINQ(inputParam).Sum(
          d => d.deductable_amount
        );

        // Secondary Insurance
        sendingObject.sec_copay_amount = new LINQ(inputParam).Sum(
          d => d.sec_copay_amount
        );
        sendingObject.sec_deductable_amount = new LINQ(inputParam).Sum(
          d => d.sec_deductable_amount
        );

        // Responsibilities
        sendingObject.patient_res = new LINQ(inputParam).Sum(
          d => d.patient_resp
        );
        sendingObject.company_res = new LINQ(inputParam).Sum(
          d => d.comapany_resp
        );
        sendingObject.sec_company_res = new LINQ(inputParam).Sum(
          d => d.sec_company_res
        );

        // Tax Calculation
        sendingObject.total_tax = new LINQ(inputParam).Sum(d => d.total_tax);
        sendingObject.patient_tax = new LINQ(inputParam).Sum(
          d => d.patient_tax
        );
        sendingObject.company_tax = new LINQ(inputParam).Sum(
          d => d.company_tax
        );
        sendingObject.sec_company_tax = new LINQ(inputParam).Sum(
          d => d.sec_company_tax
        );

        // Payables
        sendingObject.patient_payable = new LINQ(inputParam).Sum(
          d => d.patient_payable
        );

        sendingObject.company_payble = new LINQ(inputParam).Sum(
          d => d.company_payble
        );
        sendingObject.sec_company_paybale = new LINQ(inputParam).Sum(
          d => d.sec_company_paybale
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
          2
        );
        sendingObject.total_tax = math.round(sendingObject.total_tax, 2);
        sendingObject.patient_tax = math.round(sendingObject.patient_tax, 2);
        sendingObject.company_tax = math.round(sendingObject.company_tax, 2);
        sendingObject.sec_company_tax = math.round(
          sendingObject.sec_company_tax,
          2
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
            2
          );
          sendingObject.sheet_discount_percentage = math.round(
            sendingObject.sheet_discount_percentage,
            2
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

      // debugLog("patient_payable", sendingObject.patient_payable);
      req.records = sendingObject;
      next();
    } catch (e) {
      next(e);
    }
  }
};
