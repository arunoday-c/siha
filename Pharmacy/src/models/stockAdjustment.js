import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
    generateNumber: (req, res, next) => {
        const _mysql = new algaehMysql();

        try {
            req.mySQl = _mysql;
            //Bill
            _mysql
                .generateRunningNumber({
                    user_id: req.userIdentity.algaeh_d_app_user_id,
                    numgen_codes: ["STK_ADJ"],
                    table_name: "hims_f_pharmacy_numgen"
                })
                .then(generatedNumbers => {
                    req.connection = {
                        connection: _mysql.connection,
                        isTransactionConnection: _mysql.isTransactionConnection,
                        pool: _mysql.pool
                    };
                    req.body.adjustment_number = generatedNumbers.STK_ADJ;
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
    getStockAdjustment: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query:
                        "SELECT AH.*, L.location_description as location_name from hims_f_pharmacy_stock_adjust_header AH, \
                        hims_d_pharmacy_location L where L.hims_d_pharmacy_location_id = AH.location_id and \
                        adjustment_number=?;",
                    values: [req.query.adjustment_number],
                    printQuery: true
                })
                .then(headerResult => {
                    if (headerResult.length != 0) {
                        _mysql
                            .executeQuery({
                                query:
                                    "select SD.*, IM.item_description, IU.uom_description from \
                                    hims_f_pharmacy_stock_adjust_detail SD, hims_d_item_master IM ,\
                                    hims_d_pharmacy_uom IU where SD.pharmacy_stock_adjust_header_id=? and \
                                    SD.item_id = IM.hims_d_item_master_id and SD.uom_id = IU.hims_d_pharmacy_uom_id",
                                // "select * from hims_f_pharmacy_stock_detail where pharmacy_stock_header_id=? and record_status='A'",
                                values: [headerResult[0].hims_f_pharmacy_stock_adjust_header_id],
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

    addStockAdjustment: (req, res, next) => {
        const _options = req.connection == null ? {} : req.connection;
        const _mysql = new algaehMysql(_options);

        const utilities = new algaehUtilities();
        utilities.logger().log("addStockAdjustment: ");

        try {
            let input = req.body;
            // utilities.logger().log("input: ", input);

            let year = moment().format("YYYY");

            let today = moment().format("YYYY-MM-DD");

            let month = moment().format("MM");

            let period = month;

            _mysql
                .executeQuery({
                    query:
                        "INSERT INTO `hims_f_pharmacy_stock_adjust_header` (adjustment_number, adjustment_date, `year`, period,\
                location_id, location_type, comments, posted,created_date, created_by, updated_date, updated_by, hospital_id) \
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    values: [
                        input.adjustment_number,
                        today,
                        year,
                        period,
                        input.location_id,
                        input.location_type,
                        input.comments,
                        input.posted,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        req.userIdentity.hospital_id
                    ],
                    printQuery: true
                })
                .then(headerResult => {
                    req.body.transaction_id = headerResult.insertId;
                    req.body.transaction_date = today;
                    req.body.year = year;
                    req.body.period = period;

                    let IncludeValues = [
                        "item_id",
                        "item_category_id",
                        "item_group_id",
                        "uom_id",
                        "barcode",
                        "batchno",
                        "sales_uom",
                        "expirydate",
                        "quantity",
                        "sales_price",
                        "reason",
                        "qtyhand",
                        "adjustment_type"
                    ];

                    _mysql
                        .executeQuery({
                            query: "INSERT INTO hims_f_pharmacy_stock_adjust_detail(??) VALUES ?",
                            values: input.pharmacy_stock_detail,
                            includeValues: IncludeValues,
                            extraValues: {
                                pharmacy_stock_adjust_header_id: headerResult.insertId,
                                created_by: req.userIdentity.algaeh_d_app_user_id,
                                created_date: new Date(),
                                updated_by: req.userIdentity.algaeh_d_app_user_id,
                                updated_date: new Date()
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true
                        })
                        .then(stock_detail => {
                            utilities.logger().log("stock_detail: ");
                            req.records = {
                                adjustment_number: input.adjustment_number,
                                hims_f_pharmacy_stock_adjust_header_id: headerResult.insertId,
                                year: year,
                                period: period
                            };
                            next();

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
    }
};
