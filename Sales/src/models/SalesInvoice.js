import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";

export function getInvoiceEntry(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        console.log("getInvoiceEntry: ")
        _mysql
            .executeQuery({
                query: "SELECT SIH.*, C.customer_name, H.hospital_name, SO.sales_order_number, \
                P.project_desc as project_name  from hims_f_sales_invoice_header SIH \
                inner join  hims_f_sales_order SO on  SIH.sales_order_id = SO.hims_f_sales_order_id \
                inner join  hims_d_customer C on  SIH.customer_id = C.hims_d_customer_id \
                inner join  hims_d_hospital H on  SIH.hospital_id = H.hims_d_hospital_id \
                inner join hims_d_project P  on SIH.project_id = P.hims_d_project_id \
                where SIH.invoice_number =? ",
                values: [req.query.invoice_number],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    let strQuery = "";

                    if (headerResult[0].sales_invoice_mode == "I") {
                        strQuery = mysql.format(
                            "select SID.*, DNH.dispatch_note_number from hims_f_sales_invoice_detail SID \
                            inner join hims_f_sales_dispatch_note_header DNH on DNH.hims_f_dispatch_note_header_id = SID.dispatch_note_header_id \
                            where sales_invoice_header_id=?",
                            [headerResult[0].hims_f_sales_invoice_header_id]
                        );
                    } else if (headerResult[0].sales_invoice_mode == "S") {
                        strQuery = mysql.format(
                            "select SIS.*, S.service_name from hims_f_sales_invoice_services SIS \
                            inner join hims_d_services S on S.hims_d_services_id = SIS.services_id \
                            where SIS.sales_invoice_header_id=?",
                            [headerResult[0].hims_f_sales_invoice_header_id]
                        );
                    }
                    _mysql
                        .executeQuery({
                            query: strQuery,
                            printQuery: true
                        })
                        .then(invoice_detail => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ invoice_detail }
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
}

export function getDispatchForInvoice(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        _mysql
            .executeQuery({
                query:
                    "SELECT SQ.*, SQ.hims_f_dispatch_note_header_id as dispatch_note_header_id, C.customer_name, \
                    H.hospital_name, SO.sales_order_number, SO.hims_f_sales_order_id,SO.payment_terms,\
                    P.project_desc as project_name from hims_f_sales_dispatch_note_header SQ \
                    inner join hims_f_sales_order SO on SO.hims_f_sales_order_id = SQ.sales_order_id \
                    inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id \
                    inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id \
                    inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id \
                    where SQ.sales_order_id=?",
                values: [req.query.sales_order_id],
                printQuery: true
            })
            .then(headerResult => {
                _mysql.releaseConnection();
                let invoice_entry_detail_item = headerResult
                req.records = {
                    ...headerResult[0],
                    ...{ invoice_entry_detail_item }
                };
                next();
            })
            .catch(error => {
                _mysql.releaseConnection();
                next(error);
            });
    } catch (e) {
        _mysql.releaseConnection();
        next(e);
    }
}

export function getDispatchItemDetails(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        _mysql
            .executeQuery({
                query:
                    "SELECT DNB.*,IM.item_description, IU.uom_description from  `hims_f_sales_dispatch_note_detail` DND \
                    inner join `hims_f_sales_dispatch_note_batches` DNB on DND.hims_f_sales_dispatch_note_detail_id = DNB.sales_dispatch_note_detail_id\
                    inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = DND.item_id \
                    inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = DND.uom_id\
                    where  dispatch_note_header_id=?",
                values: [req.query.hims_f_dispatch_note_header_id],
                printQuery: true
            })
            .then(headerResult => {
                _mysql.releaseConnection();
                req.records = headerResult;
                next();
            })
            .catch(error => {
                _mysql.releaseConnection();
                next(error);
            });
    } catch (e) {
        _mysql.releaseConnection();
        next(e);
    }
}

export function getSalesOrderServiceInvoice(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        console.log("getSalesOrderServiceInvoice: ")

        _mysql
            .executeQuery({
                query: "SELECT SQ.*, C.customer_name, H.hospital_name, P.project_desc as project_name \
                from hims_f_sales_order SQ inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
                inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id \
                inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id \
                where SQ.hims_f_sales_order_id =? ",
                values: [req.query.hims_f_sales_order_id],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    _mysql
                        .executeQuery({
                            query: "select QS.*, S.service_name from hims_f_sales_order_services QS \
                            inner join hims_d_services S on S.hims_d_services_id = QS.services_id where sales_order_id=?;",
                            values: [headerResult[0].hims_f_sales_order_id],
                            printQuery: true
                        })
                        .then(invoice_entry_detail_services => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ invoice_entry_detail_services }
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
};

export function addInvoiceEntry(req, res, next) {
    const _mysql = new algaehMysql();

    try {
        let input = req.body;
        let invoice_number = "";

        _mysql
            .generateRunningNumber({
                modules: ["SALES_INVOICE"],
                tableName: "hims_f_sales_numgen",
                identity: {
                    algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                    hospital_id: req.userIdentity.hospital_id
                }
            })
            .then(generatedNumbers => {
                invoice_number = generatedNumbers[0];

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_sales_invoice_header (invoice_number, invoice_date, sales_invoice_mode, \
                                sales_order_id, customer_id, payment_terms, project_id, sub_total, discount_amount, \
                                net_total, total_tax, net_payable, created_date, created_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            invoice_number,
                            new Date(),
                            input.sales_invoice_mode,
                            input.sales_order_id,
                            input.customer_id,
                            input.payment_terms,
                            input.project_id,
                            input.sub_total,
                            input.discount_amount,
                            input.net_total,
                            input.total_tax,
                            input.net_payable,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            input.hospital_id
                        ],
                        printQuery: true
                    })
                    .then(headerResult => {
                        let IncludeValues = [];
                        if (input.sales_invoice_mode === "I") {
                            IncludeValues = [
                                "dispatch_note_header_id",
                                "sub_total",
                                "discount_amount",
                                "net_total",
                                "total_tax",
                                "net_payable",
                            ];

                            _mysql
                                .executeQuery({
                                    query:
                                        "INSERT INTO hims_f_sales_invoice_detail(??) VALUES ?",
                                    values: input.invoice_entry_detail_item,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_invoice_header_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {

                                    if (input.sales_order_id !== null) {
                                        updateSalesOrder({
                                            input: input,
                                            _mysql: _mysql,
                                            req: req,
                                            next: next
                                        })
                                            .then(update_sales_order => {
                                                _mysql.commitTransaction(() => {
                                                    _mysql.releaseConnection();
                                                    req.records = {
                                                        invoice_number: invoice_number,
                                                        hims_f_sales_invoice_header_id: headerResult.insertId
                                                    };
                                                    return next();
                                                });
                                            })
                                            .catch(error => {
                                                _mysql.rollBackTransaction(() => {
                                                    next(error);
                                                });
                                            });
                                    } else {
                                        _mysql.commitTransaction(() => {
                                            _mysql.releaseConnection();
                                            req.records = {
                                                invoice_number: invoice_number,
                                                hims_f_sales_invoice_header_id: headerResult.insertId
                                            };
                                            return next();
                                        });
                                    }
                                })
                                .catch(error => {
                                    _mysql.rollBackTransaction(() => {
                                        next(error);
                                    });
                                });
                        } else if (input.sales_invoice_mode === "S") {
                            IncludeValues = [
                                "services_id",
                                "service_frequency",
                                "unit_cost",
                                "quantity",
                                "extended_cost",
                                "discount_percentage",
                                "discount_amount",
                                "net_extended_cost",
                                "tax_percentage",
                                "tax_amount",
                                "total_amount"
                            ];

                            _mysql
                                .executeQuery({
                                    query:
                                        "INSERT INTO hims_f_sales_invoice_services(??) VALUES ?",
                                    values: input.invoice_entry_detail_services,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_invoice_header_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    if (input.sales_order_id !== null) {
                                        updateSalesOrder({
                                            input: input,
                                            _mysql: _mysql,
                                            req: req,
                                            next: next
                                        })
                                            .then(update_sales_order => {
                                                _mysql.commitTransaction(() => {
                                                    _mysql.releaseConnection();
                                                    req.records = {
                                                        invoice_number: invoice_number,
                                                        hims_f_sales_invoice_header_id: headerResult.insertId
                                                    };
                                                    return next();
                                                });
                                            })
                                            .catch(error => {
                                                _mysql.rollBackTransaction(() => {
                                                    next(error);
                                                });
                                            });
                                    } else {
                                        _mysql.commitTransaction(() => {
                                            _mysql.releaseConnection();
                                            req.records = {
                                                invoice_number: invoice_number,
                                                hims_f_sales_invoice_header_id: headerResult.insertId
                                            };
                                            return next();
                                        });
                                    }
                                })
                                .catch(error => {
                                    _mysql.rollBackTransaction(() => {
                                        next(error);
                                    });
                                });
                        }
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
};


function updateSalesOrder(options) {
    return new Promise((resolve, reject) => {
        try {
            let input = options.input;
            let _mysql = options._mysql;
            let req = options.req

            _mysql
                .executeQuery({
                    query: "UPDATE hims_f_sales_order set closed = 'Y', closed_date=?, closed_by=? \
                        where hims_f_sales_order_id=?",
                    values: [
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        input.sales_order_id
                    ],
                    printQuery: true
                })
                .then(update_Result => {
                    if (input.sales_invoice_mode === "I") {
                        let dispatch_note_header_id = _.map(input.invoice_entry_detail_item, o => {
                            return o.dispatch_note_header_id;
                        });
                        _mysql
                            .executeQuery({
                                query: "UPDATE hims_f_sales_dispatch_note_header set invoice_generated = 'Y', updated_date=?, updated_by=? \
                        where hims_f_dispatch_note_header_id in (?)",
                                values: [
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    dispatch_note_header_id
                                ],
                                printQuery: true
                            })
                            .then(update_Result => {
                                resolve()
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        resolve()
                    }
                })
                .catch(error => {
                    reject(error);
                });

        } catch (e) {
            reject(e);
        }
    }).catch(e => {
        options.next(e);
    });
}
