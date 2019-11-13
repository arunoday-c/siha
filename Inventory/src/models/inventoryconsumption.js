import algaehMysql from "algaeh-mysql";
import moment from "moment";
export default {
  getInventoryConsumption: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_inventory_consumption_header_id, consumption_number, consumption_date, year,\
          period, location_type,location_id  from  hims_f_inventory_consumption_header\
          where consumption_number=?",
          values: [req.query.consumption_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_inventory_consumption_detail where inventory_consumption_header_id=?",
                values: [
                  headerResult[0].hims_f_inventory_consumption_header_id
                ],
                printQuery: true
              })
              .then(inventory_stock_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ inventory_stock_detail }
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

  addInventoryConsumption: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let document_number = "";

      _mysql
        .generateRunningNumber({
          modules: ["INV_CONS_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          document_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_inventory_consumption_header` (consumption_number,consumption_date,`year`, \
                period,location_type,location_id,provider_id,created_date,created_by,updated_date,\
                updated_by,hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                document_number,
                today,
                year,
                period,
                input.location_type,
                input.location_id,
                input.provider_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
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
                    "INSERT INTO hims_f_inventory_consumption_detail(??) VALUES ?",
                  values: input.inventory_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    inventory_consumption_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.body.transaction_id = headerResult.insertId;
                    req.body.year = year;
                    req.body.period = period;
                    period;
                    req.records = {
                      consumption_number: document_number,
                      hims_f_inventory_consumption_header_id:
                        headerResult.insertId,
                      year: year,
                      period: period
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
  }

  //   updateInventoryInitialStock: (req, res, next) => {
  //     const _mysql = new algaehMysql();

  //     try {
  //       req.mySQl = _mysql;
  //       let inputParam = { ...req.body };

  //       _mysql
  //         .executeQueryWithTransaction({
  //           query:
  //             "UPDATE `hims_f_inventory_consumption_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
  //             WHERE `record_status`='A' and `hims_f_inventory_stock_header_id`=?",
  //           values: [
  //             inputParam.posted,
  //             req.userIdentity.algaeh_d_app_user_id,
  //             new Date(),
  //             inputParam.hims_f_inventory_stock_header_id
  //           ],
  //           printQuery: true
  //         })
  //         .then(headerResult => {
  //           req.connection = {
  //             connection: _mysql.connection,
  //             isTransactionConnection: _mysql.isTransactionConnection,
  //             pool: _mysql.pool
  //           };
  //           // _mysql.releaseConnection();
  //           // req.records = headerResult;
  //           next();
  //         })
  //         .catch(e => {
  //           _mysql.rollBackTransaction(() => {
  //             next(e);
  //           });
  //         });
  //     } catch (e) {
  //       _mysql.rollBackTransaction(() => {
  //         next(e);
  //       });
  //     }
  //   }
};
