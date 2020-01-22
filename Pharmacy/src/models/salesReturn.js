import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";

export default {
  getsalesReturn: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.sales_return_number != null) {
        _strAppend = " and sales_return_number=?";
        intValue.push(req.query.sales_return_number);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_pharmcy_sales_return_header_id, reciept_id, PH.from_pos_id, PH.sales_return_number,PH.patient_id,P.patient_code,\
          P.full_name as full_name,PH.visit_id,V.visit_code,PH.ip_id,PH.sales_return_date,PH.`year`,\
          PH.period,PH.location_id,L.location_description,PH.location_type,PH.sub_total,PH.discount_percentage,PH.discount_amount,PH.net_total,\
          PH.copay_amount,PH.patient_responsibility,PH.patient_tax,PH.patient_payable,PH.company_responsibility,PH.company_tax,\
          PH.company_payable,PH.comments,PH.sec_company_responsibility,PH.sec_company_tax,PH.sec_company_payable,\
          PH.sec_copay_amount,PH.net_tax,PH.gross_total,PH.sheet_discount_amount,PH.sheet_discount_percentage,\
          PH.net_amount,PH.credit_amount,PH.payable_amount,PH.posted,PH.card_number,PH.effective_start_date,\
          PH.effective_end_date,PH.insurance_provider_id,PH.sub_insurance_provider_id,PH.network_id,PH.network_type,\
          PH.network_office_id,PH.policy_number,PH.secondary_card_number,PH.secondary_effective_start_date,\
          PH.secondary_effective_end_date,PH.secondary_insurance_provider_id,PH.secondary_network_id,PH.secondary_network_type,\
          PH.secondary_sub_insurance_provider_id,PH.secondary_network_office_id, POS.pos_number from  \
          hims_f_pharmcy_sales_return_header PH inner join hims_d_pharmacy_location L on PH.location_id=L.hims_d_pharmacy_location_id \
          left outer join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id \
          left outer join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
          inner join hims_f_pharmacy_pos_header POS on PH.from_pos_id=POS.hims_f_pharmacy_pos_header_id\
          where PH.record_status='A' and L.record_status='A'  " +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pharmacy_sales_return_detail where sales_return_header_id=?",
                values: [headerResult[0].hims_f_pharmcy_sales_return_header_id],
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                // _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail },
                  ...{ hims_f_receipt_header_id: headerResult[0].reciept_id }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addsalesReturn: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let input = { ...req.body };
      let sales_return_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addPosEntry: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["POS_RET_NUM"],
          table_name: "hims_f_pharmacy_numgen"
        })
        .then(generatedNumbers => {
          sales_return_number = generatedNumbers.POS_RET_NUM;

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          let criedt_qry = ""
          if (parseFloat(input.credit_amount) > 0) {
            criedt_qry = mysql.format(
              "UPDATE `hims_f_pharmacy_pos_header` SET balance_credit = balance_credit - ? \
              WHERE hims_f_pharmacy_pos_header_id=?;",
              [parseFloat(input.credit_amount), input.from_pos_id]
            )
          }
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharmcy_sales_return_header` (sales_return_number,sales_return_date,from_pos_id,patient_id,visit_id,ip_id,`year`,period,\
              location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
              patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
              sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
              sheet_discount_percentage,net_amount,credit_amount,payable_amount, card_number,effective_start_date,effective_end_date,\
              insurance_provider_id, sub_insurance_provider_id, network_id, network_type, network_office_id, policy_number, \
              secondary_card_number, secondary_effective_start_date, secondary_effective_end_date, secondary_insurance_provider_id,\
              secondary_network_id, secondary_network_type, secondary_sub_insurance_provider_id, secondary_network_office_id, \
              posted,reciept_id,created_date,created_by,updated_date,updated_by,hospital_id) \
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); "+ criedt_qry,
              values: [
                sales_return_number,
                today,
                input.from_pos_id,
                input.patient_id,
                input.visit_id,
                input.ip_id,
                year,
                period,
                input.location_id,
                input.location_type,
                input.sub_total,
                input.discount_percentage,
                input.discount_amount,
                input.net_total,
                input.copay_amount,
                input.patient_responsibility,
                input.patient_tax,
                input.patient_payable,
                input.company_responsibility,
                input.company_tax,
                input.company_payable,
                input.comments,
                input.sec_company_responsibility,
                input.sec_company_tax,
                input.sec_company_payable,
                input.sec_copay_amount,
                input.net_tax,
                input.gross_total,
                input.sheet_discount_amount,
                input.sheet_discount_percentage,
                input.net_amount,
                input.credit_amount,
                input.payable_amount,
                input.card_number,
                input.effective_start_date,
                input.effective_end_date,
                input.insurance_provider_id,
                input.sub_insurance_provider_id,
                input.network_id,
                input.network_type,
                input.network_office_id,
                input.policy_number,
                input.secondary_card_number,
                input.secondary_effective_start_date,
                input.secondary_effective_end_date,
                input.secondary_insurance_provider_id,
                input.secondary_network_id,
                input.secondary_network_type,
                input.secondary_sub_insurance_provider_id,
                input.secondary_network_office_id,
                input.posted,
                req.records.receipt_header_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(finalResult => {
              let headerResult = finalResult[0]
              req.body.hims_f_pharmcy_sales_return_header_id = headerResult.insertId;
              req.body.sales_return_number = sales_return_number;

              req.body.transaction_id = headerResult.insertId;
              req.body.year = year;
              req.body.period = period;
              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "item_id",
                "item_category",
                "item_group_id",
                "service_id",
                "grn_no",
                "barcode",
                "expiry_date",
                "batchno",
                "uom_id",
                "quantity",
                "return_quantity",
                "insurance_yesno",
                "tax_inclusive",
                "unit_cost",
                "extended_cost",
                "discount_percent",
                "discount_amount",
                "net_extended_cost",
                "copay_percent",
                "copay_amount",
                "patient_responsibility",
                "patient_tax",
                "patient_payable",
                "company_responsibility",
                "company_tax",
                "company_payable",
                "sec_copay_percent",
                "sec_copay_amount",
                "sec_company_responsibility",
                "sec_company_tax",
                "sec_company_payable"
              ];

              utilities
                .logger()
                .log("pharmacy_stock_detail: ", input.pharmacy_stock_detail);

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_pharmacy_sales_return_detail(??) VALUES ?",
                  values: input.pharmacy_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    sales_return_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();
                  req.records = {
                    sales_return_number: sales_return_number,
                    hims_f_pharmcy_sales_return_header_id:
                      headerResult.insertId,
                    receipt_number: req.records.receipt_number,
                    year: year,
                    period: period
                  };
                  next();
                  //   });
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatesalesReturn: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      req.body.hims_f_pharmcy_sales_return_header_id =
        req.records.hims_f_pharmcy_sales_return_header_id;
      req.body.transaction_id =
        req.records.hims_f_pharmcy_sales_return_header_id;
      req.body.year = req.records.year;
      req.body.period = req.records.period;

      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharmcy_sales_return_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmcy_sales_return_header_id`=?",
          values: [
            inputParam.posted,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_pharmcy_sales_return_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          // _mysql.releaseConnection();
          // req.records = headerResult;
          next();
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

  updatePOSDetail: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let inputParam = { ...req.body };
      const newDtls = inputParam.pharmacy_stock_detail;
      let updateString = "";
      _mysql
        .executeQuery({
          query:
            "SELECT item_id, return_quantity, return_extended_cost, return_discount_amt, return_net_extended_cost, return_pat_responsibility, return_company_responsibility, return_sec_company_responsibility FROM\
            hims_f_pharmacy_pos_detail where pharmacy_pos_header_id=?;",
          values: [inputParam.from_pos_id],
          printQuery: true
        })
        .then(posData => {
          for (let i = 0; i < newDtls.length; i++) {
            let get_item_detail = _.find(
              posData,
              f => f.item_id == newDtls[i].item_id
            );

            const utilities = new algaehUtilities();
            utilities.logger().log("get_item_detail: ", get_item_detail);

            let return_quantity =
              get_item_detail.return_quantity === null
                ? newDtls[i].return_quantity
                : parseFloat(get_item_detail.return_quantity) +
                parseFloat(newDtls[i].return_quantity);
            let return_extended_cost =
              get_item_detail.return_extended_cost === null
                ? newDtls[i].return_extended_cost
                : parseFloat(get_item_detail.return_extended_cost) +
                parseFloat(newDtls[i].return_extended_cost);
            let return_discount_amt =
              get_item_detail.return_discount_amt === null
                ? newDtls[i].return_discount_amt
                : parseFloat(get_item_detail.return_discount_amt) +
                parseFloat(newDtls[i].return_discount_amt);
            let return_net_extended_cost =
              get_item_detail.return_net_extended_cost === null
                ? newDtls[i].return_net_extended_cost
                : parseFloat(get_item_detail.return_net_extended_cost) +
                parseFloat(newDtls[i].return_net_extended_cost);
            let return_pat_responsibility =
              get_item_detail.return_pat_responsibility === null
                ? newDtls[i].return_pat_responsibility
                : parseFloat(get_item_detail.return_pat_responsibility) +
                parseFloat(newDtls[i].return_pat_responsibility);
            let return_company_responsibility =
              get_item_detail.return_company_responsibility === null
                ? newDtls[i].return_company_responsibility
                : parseFloat(get_item_detail.return_company_responsibility) +
                parseFloat(newDtls[i].return_company_responsibility);

            updateString += mysql.format(
              "UPDATE hims_f_pharmacy_pos_detail SET `return_quantity`=?,`return_extended_cost` = ?,\
            `return_discount_amt`=?, `return_net_extended_cost`=?, `return_pat_responsibility`=?, \
            `return_company_responsibility`=?, `return_done`='Y' \
            where `pharmacy_pos_header_id`=? and `item_id`=?;",
              [
                return_quantity,
                return_extended_cost,
                return_discount_amt,
                return_net_extended_cost,
                return_pat_responsibility,
                return_company_responsibility,
                inputParam.from_pos_id,
                newDtls[i].item_id
              ]
            );
          }

          _mysql
            .executeQuery({
              query: updateString,
              printQuery: true
            })
            .then(headerResult => {
              _mysql
                .executeQuery({
                  query:
                    "select * from (SELECT (quantity-return_quantity) as re_quantity FROM\
                    hims_f_pharmacy_pos_detail where pharmacy_pos_header_id=?) as A where re_quantity>0;",
                  values: [inputParam.from_pos_id],
                  printQuery: true
                })
                .then(posqtyData => {
                  // let full_return = _.filter(
                  //   posqtyData,
                  //   f => f.re_quantity > 0
                  // );
                  const utilities = new algaehUtilities();
                  utilities
                    .logger()
                    .log("updatePOSDetail: ", posqtyData.length);
                  if (posqtyData.length == 0) {
                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE hims_f_pharmacy_pos_header set return_done='Y' where\
                          hims_f_pharmacy_pos_header_id=?;",
                        values: [inputParam.from_pos_id],
                        printQuery: true
                      })
                      .then(posData => {
                        next();
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    next();
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
              // _mysql.releaseConnection();
              // req.records = headerResult;
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
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = req.body;
      const decimal_places = req.userIdentity.decimal_places;
      const utilities = new algaehUtilities();
      const _all_service_id = _.map(inputParam.pharmacy_stock_detail, o => {
        return o.service_id;
      });

      const _all_item_id = _.map(inputParam.pharmacy_stock_detail, o => {
        return o.item_id;
      });

      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;\
            SELECT * FROM finance_accounts_maping; \
            SELECT hims_d_services_id, head_id, child_id FROM hims_d_services where hims_d_services_id in (?); \
            SELECT hims_d_item_master_id, waited_avg_cost FROM hims_d_item_master where hims_d_item_master_id in (?); \
            SELECT head_id, child_id FROM hims_d_pharmacy_location where hims_d_pharmacy_location_id=?;",
          values: [_all_service_id, _all_item_id, inputParam.location_id],
          printQuery: true
        })
        .then(result => {
          const org_data = result[0];

          const output_tax_acc = result[1].find(f => f.account === "OUTPUT_TAX")
          const cogs_acc_data = result[1].find(f => f.account === "PHAR_COGS")
          const cash_in_acc = result[1].find(f => f.account === "CIH_PH")
          const sales_discount_acc = result[1].find(f => f.account === "SALES_DISCOUNT")
          const pos_criedt_settl_acc = result[1].find(f => f.account === "PHAR_REC")

          const income_acc = result[2];
          const item_waited_avg_cost = result[3];
          const location_acc = result[4];

          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {

            _mysql
              .executeQuery({
                query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                          voucher_type, document_id, document_number, from_screen, \
                          narration, hospital_id) VALUES (?,?,?,?,?,?,?,?)",
                values: [
                  new Date(),
                  inputParam.net_amount,
                  "credit_note",
                  inputParam.hims_f_pharmcy_sales_return_header_id,
                  inputParam.sales_return_number,
                  inputParam.ScreenCode,
                  "Pharmacy Sales for " + inputParam.net_amount,
                  req.userIdentity.hospital_id
                ],
                printQuery: true
              })
              .then(day_end_header => {
                let insertSubDetail = []
                const month = moment().format("M");
                const year = moment().format("YYYY");
                const IncludeValuess = [
                  "payment_date",
                  "head_id",
                  "child_id",
                  "debit_amount",
                  "payment_type",
                  "credit_amount"
                ];

                // Sheet Level Discount
                if (parseFloat(inputParam.sheet_discount_amount) > 0) {
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: sales_discount_acc.head_id,
                    child_id: sales_discount_acc.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: inputParam.sheet_discount_amount
                  });
                }

                // Credit Amount To be done
                if (parseFloat(inputParam.credit_amount) > 0) {
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: pos_criedt_settl_acc.head_id,
                    child_id: pos_criedt_settl_acc.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: inputParam.credit_amount
                  });
                }

                //OUT PUT Tax Entry
                if (parseFloat(inputParam.patient_tax) > 0 || parseFloat(inputParam.company_tax) > 0) {
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: output_tax_acc.head_id,
                    child_id: output_tax_acc.child_id,
                    debit_amount: parseFloat(inputParam.patient_tax) + parseFloat(inputParam.company_tax),
                    payment_type: "DR",
                    credit_amount: 0
                  });
                }


                for (let i = 0; i < inputParam.receiptdetails.length; i++) {
                  if (inputParam.receiptdetails[i].pay_type === "CA") {
                    //POS Cash in Hand
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: cash_in_acc.head_id,
                      child_id: cash_in_acc.child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: inputParam.receiptdetails[i].amount
                    });
                  }
                }
                for (let i = 0; i < inputParam.pharmacy_stock_detail.length; i++) {

                  const income_head_id = income_acc.find(f =>
                    parseInt(f.hims_d_services_id) === parseInt(inputParam.pharmacy_stock_detail[i].service_id))
                  const income_child_id = income_acc.find(f =>
                    parseInt(f.hims_d_services_id) === parseInt(inputParam.pharmacy_stock_detail[i].service_id))

                  const item_avg_cost = item_waited_avg_cost.find(f =>
                    parseInt(f.hims_d_item_master_id) === parseInt(inputParam.pharmacy_stock_detail[i].item_id))

                  //Income Entry
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: income_head_id.head_id,
                    child_id: income_child_id.child_id,
                    debit_amount: inputParam.pharmacy_stock_detail[i].net_extended_cost,
                    payment_type: "DR",
                    credit_amount: 0
                  });

                  const waited_avg_cost =
                    utilities.decimalPoints(
                      (parseFloat(inputParam.pharmacy_stock_detail[i].quantity) *
                        parseFloat(inputParam.pharmacy_stock_detail[i].conversion_factor) *
                        parseFloat(item_avg_cost.waited_avg_cost)),
                      decimal_places
                    )

                  //COGS Entry
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: cogs_acc_data.head_id,
                    child_id: cogs_acc_data.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: waited_avg_cost
                  });

                  //Location Wise
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: location_acc[0].head_id,
                    child_id: location_acc[0].child_id,
                    debit_amount: waited_avg_cost,
                    payment_type: "DR",
                    credit_amount: 0
                  });
                }

                console.log("insertSubDetail", insertSubDetail)
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                    values: insertSubDetail,
                    includeValues: IncludeValuess,
                    bulkInsertOrUpdate: true,
                    extraValues: {
                      day_end_header_id: day_end_header.insertId,
                      year: year,
                      month: month,
                      entered_date: new Date(),
                      entered_by: req.userIdentity.algaeh_d_app_user_id,
                      hospital_id: req.userIdentity.hospital_id
                    },
                    printQuery: false
                  })
                  .then(subResult => {
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
          } else {
            next();
          }
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
