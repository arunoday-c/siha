import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

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
                    where SQ.sales_order_id =? ",
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
                user_id: req.userIdentity.algaeh_d_app_user_id,
                numgen_codes: ["SALES_INVOICE"],
                table_name: "hims_f_sales_numgen"
            })
            .then(generatedNumbers => {
                invoice_number = generatedNumbers.SALES_INVOICE;

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_sales_invoice_header (invoice_number, invoice_date, sales_invoice_mode, \
                                sales_order_id, location_id, customer_id, payment_terms, project_id, sub_total, discount_amount, \
                                net_total, total_tax, net_payable,created_date, created_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            invoice_number,
                            new Date(),
                            input.sales_invoice_mode,
                            input.sales_order_id,
                            input.location_id,
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

export function postSalesInvoice(req, res, next) {
    const _mysql = new algaehMysql();

    try {
        req.mySQl = _mysql;
        let inputParam = { ...req.body };

        _mysql
            .executeQueryWithTransaction({
                query:
                    "UPDATE `hims_f_sales_invoice_header` SET `is_posted`=?, `posted_date`=?, `posted_by`=? \
          WHERE `hims_f_sales_invoice_header_id`=?",
                values: [
                    inputParam.posted,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.hims_f_sales_invoice_header_id
                ],
                printQuery: true
            })
            .then(headerResult => {
                req.connection = {
                    connection: _mysql.connection,
                    isTransactionConnection: _mysql.isTransactionConnection,
                    pool: _mysql.pool
                };
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
};

export function generateAccountingEntry(req, res, next) {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
        let inputParam = req.body;
        const decimal_places = req.userIdentity.decimal_places;
        const utilities = new algaehUtilities();

        _mysql
            .executeQuery({
                query: "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;"
            })
            .then(org_data => {
                if (
                    org_data[0]["product_type"] == "HIMS_ERP" ||
                    org_data[0]["product_type"] == "FINANCE_ERP"
                ) {
                    _mysql
                        .executeQuery({
                            query:
                                "select account,head_id, child_id from finance_accounts_maping where account in \
                                ('INVNT_COGS', 'OUTPUT_TAX');\
                                select hims_d_sub_department_id from hims_d_sub_department where department_type='I';"
                        })
                        .then(result => {
                            const output_tax_acc = result[0].find(f => f.account === "OUTPUT_TAX")
                            const cogs_acc_data = result[0].find(f => f.account === "INVNT_COGS")

                            const sub_department_id = result[1].length > 0 ? result[1][0].hims_d_sub_department_id : null

                            let strQuery = "";
                            let sales_done = "";
                            if (inputParam.sales_invoice_mode === "I") {
                                strQuery = mysql.format(
                                    "select GH.hims_f_sales_invoice_header_id, GH.invoice_number, GH.net_total, GH.total_tax, \
                                    GH.net_payable, IL.hospital_id ,IL.head_id as inv_head_id, IL.child_id as inv_child_id, C.head_id as customer_head_id, C.child_id as customer_child_id,\
                                    DB.dispatch_quantity , DB.net_extended_cost, ITM.waited_avg_cost, S.head_id as income_head_id, \
                                    S.child_id as income_child_id, C.customer_name, IU.conversion_factor, GH.hospital_id as c_hospital_id,\
                                    GH.project_id, D.hims_d_sub_department_id from hims_f_sales_invoice_header GH \
                                    inner join hims_f_sales_invoice_detail GD on GH.hims_f_sales_invoice_header_id = GD.sales_invoice_header_id \
                                    inner join hims_f_sales_dispatch_note_detail DD on DD.dispatch_note_header_id = GD.dispatch_note_header_id \
                                    inner join hims_f_sales_dispatch_note_batches DB on DD.hims_f_sales_dispatch_note_detail_id = DB.sales_dispatch_note_detail_id \
                                    inner join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = GH.location_id\
                                    inner join hims_d_customer C on C.hims_d_customer_id = GH.customer_id\
                                    inner join hims_d_inventory_item_master ITM on ITM.hims_d_inventory_item_master_id = DB.item_id\
                                    inner join hims_d_services S on S.hims_d_services_id = ITM.service_id\
                                    inner join hims_m_inventory_item_uom IU on IU.item_master_id = DB.item_id and IU.uom_id = DB.uom_id\
                                    left join hims_d_sub_department D on D.inventory_location_id = GH.location_id\
                                    where hims_f_sales_invoice_header_id=?;",
                                    [inputParam.hims_f_sales_invoice_header_id]
                                );
                                sales_done = "Item"
                            } else {
                                strQuery = mysql.format(
                                    "select GH.hims_f_sales_invoice_header_id, GH.invoice_number, GH.net_total, GH.total_tax, \
                                    GH.net_payable, GS.net_extended_cost, C.head_id as customer_head_id, C.child_id as customer_child_id, \
                                    S.head_id as income_head_id, S.child_id as income_child_id, C.customer_name, GH.hospital_id as c_hospital_id,\
                                    D.hims_d_sub_department_id from hims_f_sales_invoice_header GH \
                                    inner join hims_f_sales_invoice_services GS on GH.hims_f_sales_invoice_header_id = GS.sales_invoice_header_id \
                                    inner join hims_d_customer C on C.hims_d_customer_id = GH.customer_id\
                                    inner join hims_d_services S on S.hims_d_services_id = GS.services_id\
                                    left join hims_d_sub_department D on D.hims_d_sub_department_id = S.sub_department_id\
                                    where hims_f_sales_invoice_header_id=?;",
                                    [inputParam.hims_f_sales_invoice_header_id]
                                );
                                sales_done = "Service"
                            }
                            _mysql
                                .executeQuery({
                                    query: strQuery,
                                    printQuery: true
                                })
                                .then(headerResult => {

                                    _mysql
                                        .executeQuery({
                                            query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                                        voucher_type, document_id, document_number, from_screen, \
                                        narration, invoice_no, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?,?)",
                                            values: [
                                                new Date(),
                                                headerResult[0].net_payable,
                                                "sales",
                                                headerResult[0].hims_f_sales_invoice_header_id,
                                                headerResult[0].invoice_number,
                                                inputParam.ScreenCode,
                                                sales_done + " Sales done for  " + headerResult[0].customer_name,
                                                headerResult[0].invoice_number,
                                                new Date(),
                                                req.userIdentity.algaeh_d_app_user_id
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
                                                "credit_amount",
                                                "hospital_id",
                                                "sub_department_id",
                                                "project_id"
                                            ];

                                            //Customer Entry
                                            insertSubDetail.push({
                                                payment_date: new Date(),
                                                head_id: headerResult[0].customer_head_id,
                                                child_id: headerResult[0].customer_child_id,
                                                debit_amount: headerResult[0].net_payable,
                                                payment_type: "DR",
                                                credit_amount: 0,
                                                hospital_id: headerResult[0].c_hospital_id,
                                                sub_department_id: headerResult[0].hims_d_sub_department_id === null ?
                                                    sub_department_id : headerResult[0].hims_d_sub_department_id,
                                                project_id: headerResult[0].project_id
                                            });

                                            //OUT PUT Tax Entry
                                            if (parseFloat(headerResult[0].total_tax) > 0) {
                                                insertSubDetail.push({
                                                    payment_date: new Date(),
                                                    head_id: output_tax_acc.head_id,
                                                    child_id: output_tax_acc.child_id,
                                                    debit_amount: 0,
                                                    payment_type: "CR",
                                                    credit_amount: headerResult[0].total_tax,
                                                    hospital_id: req.userIdentity.hospital_id,
                                                    sub_department_id: headerResult[0].hims_d_sub_department_id === null ?
                                                        sub_department_id : headerResult[0].hims_d_sub_department_id,
                                                    project_id: headerResult[0].project_id
                                                });
                                            }



                                            for (let i = 0; i < headerResult.length; i++) {
                                                //Income Entry
                                                insertSubDetail.push({
                                                    payment_date: new Date(),
                                                    head_id: headerResult[i].income_head_id,
                                                    child_id: headerResult[i].income_child_id,
                                                    debit_amount: 0,
                                                    payment_type: "CR",
                                                    credit_amount: headerResult[i].net_extended_cost,
                                                    hospital_id: req.userIdentity.hospital_id,
                                                    sub_department_id: headerResult[i].hims_d_sub_department_id === null ?
                                                        sub_department_id : headerResult[i].hims_d_sub_department_id,
                                                    project_id: headerResult[i].project_id
                                                });

                                                if (inputParam.sales_invoice_mode === "I") {
                                                    let waited_avg_cost =
                                                        utilities.decimalPoints(
                                                            (parseFloat(headerResult[i].dispatch_quantity) *
                                                                parseFloat(headerResult[i].conversion_factor) *
                                                                parseFloat(headerResult[i].waited_avg_cost)),
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
                                                        hospital_id: req.userIdentity.hospital_id,
                                                        sub_department_id: headerResult[i].hims_d_sub_department_id === null ?
                                                            sub_department_id : headerResult[i].hims_d_sub_department_id,
                                                        project_id: headerResult[i].project_id
                                                    });

                                                    //Location Wise
                                                    insertSubDetail.push({
                                                        payment_date: new Date(),
                                                        head_id: headerResult[i].inv_head_id,
                                                        child_id: headerResult[i].inv_child_id,
                                                        debit_amount: 0,
                                                        payment_type: "CR",
                                                        credit_amount: waited_avg_cost,
                                                        hospital_id: headerResult[i].hospital_id,
                                                        sub_department_id: headerResult[i].hims_d_sub_department_id === null ?
                                                            sub_department_id : headerResult[i].hims_d_sub_department_id,
                                                        project_id: headerResult[i].project_id
                                                    });
                                                }
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
                                                        month: month
                                                    },
                                                    printQuery: false
                                                })
                                                .then(subResult => {
                                                    _mysql.commitTransaction(() => {
                                                        _mysql.releaseConnection();
                                                        req.records = subResult;
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
                        })
                        .catch(error => {
                            _mysql.rollBackTransaction(() => {
                                next(error);
                            });
                        });
                } else {
                    _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = org_data;
                        next();
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
