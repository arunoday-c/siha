import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  getconsumptionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_pharmacy_consumption_header_id, consumption_number, consumption_date, year,\
          period, location_type,location_id  from  hims_f_pharmacy_consumption_header\
          where consumption_number=?",
          values: [req.query.consumption_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pharmacy_consumption_detail where pharmacy_consumption_header_id=?",
                values: [headerResult[0].hims_f_pharmacy_consumption_header_id],
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail }
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

  addconsumptionEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let document_number = "";

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["PHR_CONS_NUM"],
          table_name: "hims_f_pharmacy_numgen"
        })
        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection:
              _mysql.isTransactionConnection,
            pool: _mysql.pool
          };

          document_number = generatedNumbers.PHR_CONS_NUM;

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharmacy_consumption_header` (consumption_number,consumption_date,`year`, \
                period,location_type,location_id,created_date,created_by,updated_date,updated_by,hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                document_number,
                today,
                year,
                period,
                input.location_type,
                input.location_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              req.body.consumption_number = document_number;
              req.body.hims_f_pharmacy_consumption_header_id = headerResult.insertId;

              let IncludeValues = [
                "item_id",
                "item_category_id",
                "item_group_id",
                "grn_no",
                "barcode",
                "expiry_date",
                "batchno",
                "uom_id",
                "qtyhand",
                "quantity",
                "unit_cost",
                "extended_cost"
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_pharmacy_consumption_detail(??) VALUES ?",
                  values: input.pharmacy_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    pharmacy_consumption_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.body.transaction_id = headerResult.insertId;
                  req.body.year = year;
                  req.body.period = period;
                  period;
                  req.records = {
                    consumption_number: document_number,
                    hims_f_pharmacy_consumption_header_id:
                      headerResult.insertId,
                    year: year,
                    period: period
                  };
                  next();
                  // });
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


  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = req.body;
      const decimal_places = req.userIdentity.decimal_places;
      const utilities = new algaehUtilities();

      const _all_item_id = _.map(inputParam.pharmacy_stock_detail, o => {
        return o.item_id;
      });
      _mysql
        .executeQuery({
          query: "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
          printQuery: true
        })
        .then(org_data => {
          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQuery({
                query:
                  "select * from finance_accounts_maping;\
                  SELECT hims_d_item_master_id, waited_avg_cost FROM hims_d_item_master \
                  where hims_d_item_master_id in (?); \
                  SELECT location_description, head_id, child_id, hospital_id FROM hims_d_pharmacy_location \
                  where hims_d_pharmacy_location_id=?;\
                  select hims_d_sub_department_id from hims_d_sub_department where department_type='PH';\
                  select cost_center_type, cost_center_required from finance_options limit 1;",
                values: [_all_item_id, inputParam.location_id],
                printQuery: true
              })
              .then(result => {
                const cogs_acc_data = result[0].find(f => f.account === "INVNT_COGS")
                const item_waited_avg_cost = result[1];
                const location_acc = result[2];
                const sub_department_id = result[3].length > 0 ? result[3][0].hims_d_sub_department_id : null

                let strQuery = "";

                if (result[4][0].cost_center_required === "Y" && result[4][0].cost_center_type === "P") {
                  strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`
                }

                // console.log("item_waited_avg_cost", item_waited_avg_cost)
                // const 
                const net_payable = _.sumBy(inputParam.pharmacy_stock_detail, s => parseFloat(s.extended_cost));
                _mysql
                  .executeQuery({
                    query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                  voucher_type, document_id, document_number, from_screen, \
                  narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?);"+ strQuery,
                    values: [
                      new Date(),
                      net_payable,
                      "journal",
                      inputParam.hims_f_pharmacy_consumption_header_id,
                      inputParam.consumption_number,
                      inputParam.ScreenCode,
                      "Consumption done for " + location_acc[0].location_description + "/" + net_payable,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id
                    ],
                    printQuery: true
                  })
                  .then(header_result => {
                    let project_id = null;
                    const day_end_header = header_result[0]
                    if (header_result[1].length > 0) {
                      project_id = header_result[1][0].project_id
                    }
                    let insertSubDetail = []
                    const month = moment().format("M");
                    const year = moment().format("YYYY");
                    const IncludeValuess = [
                      "payment_date",
                      "head_id",
                      "child_id",
                      "debit_amount",
                      "payment_type",
                      "credit_amount",
                      "hospital_id"
                    ];
                    for (let i = 0; i < inputParam.pharmacy_stock_detail.length; i++) {
                      const item_avg_cost = item_waited_avg_cost.find(f =>
                        parseInt(f.hims_d_item_master_id) === parseInt(inputParam.pharmacy_stock_detail[i].item_id))

                      let waited_avg_cost =
                        utilities.decimalPoints(
                          (parseFloat(inputParam.pharmacy_stock_detail[i].quantity) *
                            parseFloat(item_avg_cost.waited_avg_cost)),
                          decimal_places
                        )

                      //COGS Entry
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: cogs_acc_data.head_id,
                        child_id: cogs_acc_data.child_id,
                        debit_amount: waited_avg_cost,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: location_acc[0].hospital_id
                      });

                      //Location Wise
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: location_acc[0].head_id,
                        child_id: location_acc[0].child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: waited_avg_cost,
                        hospital_id: location_acc[0].hospital_id
                      });

                    }

                    // console.log("insertSubDetail", insertSubDetail)
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
                          project_id: project_id,
                          sub_department_id: sub_department_id
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

    } catch (error) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  }
};
