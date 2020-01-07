import algaehMysql from "algaeh-mysql";
import mysql from "mysql";

export function getSalesOrder(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        console.log("getSalesOrder: ")

        let strQuery = ""
        if (req.query.HRMNGMT_Active) {
            strQuery = "SELECT SO.*, C.customer_name, E.full_name as employee_name, SQ.sales_quotation_number from hims_f_sales_order SO \
                        left join  hims_f_sales_quotation SQ on  SO.sales_quotation_id = SQ.hims_f_sales_quotation_id \
                        inner join  hims_d_customer C on  SO.customer_id = C.hims_d_customer_id \
                        inner join  hims_d_employee E on  SO.sales_person_id = E.hims_d_employee_id \
                        where SO.sales_order_number =? "
        } else {
            strQuery = "SELECT SO.*, C.customer_name from hims_f_sales_order SO , SQ.sales_quotation_number from hims_f_sales_order SO \
                        left join  hims_f_sales_quotation SQ on  SO.sales_quotation_id = SQ.hims_f_sales_quotation_id \
                        inner join  hims_d_customer C on  SO.customer_id = C.hims_d_customer_id \
                        where SO.sales_order_number =? "
        }
        _mysql
            .executeQuery({
                query: strQuery,
                values: [req.query.sales_order_number],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    let strQuery = "";

                    if (headerResult[0].sales_order_mode == "I") {
                        strQuery = mysql.format(
                            "select QI.*, IM.item_description, IU.uom_description from hims_f_sales_order_items QI \
                            inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
                            inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id where sales_order_id=?",
                            [headerResult[0].hims_f_sales_order_id]
                        );
                    } else if (headerResult[0].sales_order_mode == "S") {
                        strQuery = mysql.format(
                            "select QS.*, S.service_name from hims_f_sales_order_services QS \
                            inner join hims_d_services S on S.hims_d_services_id = QS.services_id where sales_order_id=?;",
                            [headerResult[0].hims_f_sales_order_id]
                        );
                    }
                    _mysql
                        .executeQuery({
                            query: strQuery,
                            printQuery: true
                        })
                        .then(order_detail => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ order_detail }
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
export function addSalesOrder(req, res, next) {
    const _mysql = new algaehMysql();

    try {
        let input = req.body;
        let sales_order_number = "";
        // const utilities = new algaehUtilities();
        // utilities.logger().log("addSalesOrder: ");

        _mysql
            .generateRunningNumber({
                modules: ["SALES_ORDER"],
                tableName: "hims_f_sales_numgen",
                identity: {
                    algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                    hospital_id: req.userIdentity.hospital_id
                }
            })
            .then(generatedNumbers => {
                sales_order_number = generatedNumbers[0];

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_sales_order (sales_order_number, sales_order_date, sales_order_mode, \
                                sales_quotation_id, reference_number, customer_id, sales_man, \
                                  payment_terms, delivery_date, sales_person_id, sub_total, discount_amount, net_total, \
                                  total_tax, net_payable, narration, project_id, customer_po_no, created_date, \
                                  created_by, updated_date, updated_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            sales_order_number,
                            new Date(),
                            input.sales_order_mode,
                            input.sales_quotation_id,
                            input.reference_number,
                            input.customer_id,
                            input.sales_man,
                            input.payment_terms,
                            input.delivery_date,
                            input.sales_person_id,
                            input.sub_total,
                            input.discount_amount,
                            input.net_total,
                            input.total_tax,
                            input.net_payable,
                            input.narration,
                            input.project_id,
                            input.customer_po_no,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            input.hospital_id
                        ],
                        printQuery: true
                    })
                    .then(headerResult => {
                        console.log("headerResult", headerResult);
                        let IncludeValues = [];
                        if (input.sales_order_items.length > 0) {
                            IncludeValues = [
                                "item_id",
                                "uom_id",
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
                                        "INSERT INTO hims_f_sales_order_items(??) VALUES ?",
                                    values: input.sales_order_items,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_order_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {

                                    if (input.sales_quotation_id !== null) {
                                        updateSalesQuotation({
                                            input: input,
                                            _mysql: _mysql,
                                            next: next,
                                            req: req
                                        })
                                            .then(update_sales_quotation => {
                                                _mysql.commitTransaction(() => {
                                                    _mysql.releaseConnection();
                                                    req.records = {
                                                        sales_order_number: sales_order_number,
                                                        hims_f_sales_order_id: headerResult.insertId
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
                                                sales_order_number: sales_order_number,
                                                hims_f_sales_order_id: headerResult.insertId
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
                        } else if (input.sales_order_services.length > 0) {
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
                                        "INSERT INTO hims_f_sales_order_services(??) VALUES ?",
                                    values: input.sales_order_services,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_order_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    if (input.sales_quotation_id !== null) {
                                        updateSalesQuotation({
                                            input: input,
                                            _mysql: _mysql,
                                            next: next,
                                            req: req
                                        })
                                            .then(update_sales_quotation => {
                                                _mysql.commitTransaction(() => {
                                                    _mysql.releaseConnection();
                                                    req.records = {
                                                        sales_order_number: sales_order_number,
                                                        hims_f_sales_order_id: headerResult.insertId
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
                                                sales_order_number: sales_order_number,
                                                hims_f_sales_order_id: headerResult.insertId
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


export function getSalesQuotationForOrder(req, res, next) {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    try {
        console.log("getSalesQuotationForOrder: ", req.query.HRMNGMT_Active)
        let strQuery = ""
        if (req.query.HRMNGMT_Active) {
            strQuery = "SELECT SQ.*, C.customer_name, E.full_name as employee_name from hims_f_sales_quotation SQ \
            inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
            inner join  hims_d_employee E on  SQ.sales_person_id = E.hims_d_employee_id \
            where SQ.sales_quotation_number =? "
        } else {
            strQuery = "SELECT SQ.*, C.customer_name from hims_f_sales_quotation SQ \
            inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
            where SQ.sales_quotation_number =? "
        }
        _mysql
            .executeQuery({
                query: strQuery,
                values: [req.query.sales_quotation_number],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    let strQuery = "";

                    if (req.query.sales_order_mode == "I") {
                        strQuery = mysql.format(
                            "select QI.*, IM.item_description, IU.uom_description, 0 as quantity_outstanding from hims_f_sales_quotation_items QI \
                            inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
                            inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id \
                            where sales_quotation_id=?",
                            [headerResult[0].hims_f_sales_quotation_id]
                        );
                    } else if (req.query.sales_order_mode == "S") {
                        strQuery = mysql.format(
                            "select QS.*, S.service_name from hims_f_sales_quotation_services QS \
                            inner join hims_d_services S on S.hims_d_services_id = QS.services_id \
                            where sales_quotation_id=?;",
                            [headerResult[0].hims_f_sales_quotation_id]
                        );
                    }
                    _mysql
                        .executeQuery({
                            query: strQuery,
                            printQuery: true
                        })
                        .then(qutation_detail => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ qutation_detail }
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


export function getSalesOrderList(req, res, next) {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    try {
        console.log("getSalesQuotation: ")
        let _strAppend = ""
        let inputParam = req.query;
        if (
            req.query.from_date != "null" &&
            req.query.from_date != "" &&
            req.query.from_date != null &&
            req.query.to_date != "null" &&
            req.query.to_date != "" &&
            req.query.to_date != null
        ) {
            _strAppend += ` and date(sales_order_date)
                between date('${req.query.from_date}') and date('${req.query.to_date}') `;
        }

        if (req.query.customer_id > 0) {
            _strAppend += ` and customer_id= '${req.query.customer_id}'`
        }

        if (req.query.sales_order_number !== null && req.query.sales_order_number !== undefined) {
            _strAppend += ` and sales_order_number= '${req.query.sales_order_number}'`
        }

        if (inputParam.status == null || inputParam.status == "0") {
            _strAppend += "";
        } else if (inputParam.status == "1") {
            //Pending To Authorize 1
            _strAppend += " and authorize1 = 'N' and cancelled='N'";
        } else if (inputParam.status == "2") {
            //Pending To Authorize 2
            _strAppend += " and authorize1 = 'Y' and authorize2 = 'N' and cancelled='N'";
        } else if (inputParam.status == "3") {
            _strAppend +=
                " and authorize1 = 'Y' and authorize2 = 'Y' and is_completed='N' and cancelled='N'";
        } else if (inputParam.status == "4") {
            _strAppend += " and is_completed='Y'";
        } else if (inputParam.status == "5") {
            _strAppend += " and cancelled='Y'";
        }

        _mysql
            .executeQuery({
                query:
                    "SELECT SO.*, C.customer_name from hims_f_sales_order SO, hims_d_customer C  \
                where SO.customer_id = C.hims_d_customer_id " + _strAppend + " order by hims_f_sales_order_id desc",
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
};

export function updateSalesOrderEntry(req, res, next) {
    const _mysql = new algaehMysql();
    let qryExecute = false;

    console.log("updateSalesOrderEntry: ");
    try {
        req.mySQl = _mysql;
        let inputParam = { ...req.body };

        _mysql
            .executeQueryWithTransaction({
                query:
                    "UPDATE `hims_f_sales_order` SET `authorize1`=?, `authorize1_by_date`=?, `authorize1_by`=?, \
            `authorize2`=?, `authorize2_date`=?, `authorize2_by`=? WHERE `hims_f_sales_order_id`=?",
                values: [
                    inputParam.authorize1,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.authorize2,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.hims_f_sales_order_id
                ],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult != null) {
                    let details = [];

                    let qry = "";

                    if (inputParam.sales_order_mode === "I") {
                        details = inputParam.sales_order_items;
                        console.log("details", details)
                        for (let i = 0; i < details.length; i++) {
                            qry += mysql.format(
                                "UPDATE hims_f_sales_order_items SET `quantity`=?, extended_cost = ?, \
                                discount_percentage= ?,discount_amount= ?, net_extended_cost= ?, tax_amount= ?,\
                                total_amount=?, quantity_outstanding=? where `hims_f_sales_order_items_id`=?;",
                                [
                                    details[i].quantity,
                                    details[i].extended_cost,
                                    details[i].discount_percentage,
                                    details[i].discount_amount,
                                    details[i].net_extended_cost,
                                    details[i].tax_amount,
                                    details[i].total_amount,
                                    details[i].quantity_outstanding,
                                    details[i].hims_f_sales_order_items_id
                                ]
                            );

                            if (i == details.length - 1) {
                                qryExecute = true;
                            }
                        }
                    } else {
                        details = inputParam.sales_order_services;
                        for (let i = 0; i < details.length; i++) {
                            qry += mysql.format(
                                "UPDATE hims_f_sales_order_services SET `quantity`=?, extended_cost = ?, \
                                discount_percentage=?, discount_amount= ?, net_extended_cost= ?, tax_amount= ?,\
                                total_amount=? where `hims_f_sales_order_services_id`=?;",
                                [
                                    details[i].quantity,
                                    details[i].extended_cost,
                                    details[i].discount_percentage,
                                    details[i].discount_amount,
                                    details[i].net_extended_cost,
                                    details[i].tax_amount,
                                    details[i].total_amount,
                                    details[i].hims_f_sales_order_services_id
                                ]
                            );

                            if (i == details.length - 1) {
                                qryExecute = true;
                            }
                        }
                    }
                    if (qryExecute == true) {
                        _mysql
                            .executeQuery({
                                query: qry,
                                printQuery: true
                            })
                            .then(detailResult => {
                                _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = detailResult;
                                    next();
                                });
                            })
                            .catch(e => {
                                _mysql.rollBackTransaction(() => {
                                    next(e);
                                });
                            });
                    }
                } else {
                    _mysql.rollBackTransaction(() => {
                        req.records = {};
                        next();
                    });
                }
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

export function cancelSalesServiceOrder(req, res, next) {
    const _mysql = new algaehMysql();

    console.log("cancelSalesServiceOrder: ");
    try {
        req.mySQl = _mysql;
        let inputParam = { ...req.body };

        _mysql
            .executeQueryWithTransaction({
                query:
                    "UPDATE `hims_f_sales_order` SET `cancelled`='Y', `cancelled_date`=?, `cancelled_by`=? \
                    WHERE `hims_f_sales_order_id`=?",
                values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.hims_f_sales_order_id
                ],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult != null) {
                    if (inputParam.sales_quotation_id !== null) {
                        _mysql
                            .executeQuery({
                                query: "update hims_f_sales_quotation set quote_services_status='G' where hims_f_sales_quotation_id=?",
                                values: [inputParam.sales_quotation_id],
                                printQuery: true
                            })
                            .then(detailResult => {
                                _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = detailResult;
                                    next();
                                });
                            })
                            .catch(e => {
                                _mysql.rollBackTransaction(() => {
                                    next(e);
                                });
                            });
                    } else {
                        _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = headerResult;
                            next();
                        });
                    }

                } else {
                    _mysql.rollBackTransaction(() => {
                        req.records = {};
                        next();
                    });
                }
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


function updateSalesQuotation(options) {
    return new Promise((resolve, reject) => {
        try {
            let input = options.input;
            let _mysql = options._mysql;
            let req = options.req

            _mysql
                .executeQuery({
                    query: "select hims_f_sales_quotation_id, quote_items_status, quote_services_status \
                    from hims_f_sales_quotation where hims_f_sales_quotation_id=?",
                    values: [input.sales_quotation_id],
                    printQuery: true
                })
                .then(result => {
                    let strQuery = ""
                    if (input.sales_order_mode === "I") {
                        if (result[0].quote_services_status !== "G") {
                            strQuery = mysql.format(
                                "update hims_f_sales_quotation set qotation_status='O', quote_items_status='O', \
                                updated_date=?, updated_by=? where hims_f_sales_quotation_id=?",
                                [
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    input.sales_quotation_id
                                ]
                            );
                        } else if (result[0].quote_services_status === "G") {
                            strQuery = mysql.format(
                                "update hims_f_sales_quotation set quote_items_status='O', updated_date=?, updated_by=? \
                                where hims_f_sales_quotation_id=?",
                                [
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    input.sales_quotation_id
                                ]
                            );
                        }
                    } else if (input.sales_order_mode === "S") {
                        if (result[0].quote_items_status !== "G") {
                            strQuery = mysql.format(
                                "update hims_f_sales_quotation set qotation_status='O', quote_services_status='O', \
                                updated_date=?, updated_by=? where hims_f_sales_quotation_id=?",
                                [
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    input.sales_quotation_id
                                ]
                            );
                        } else if (result[0].quote_items_status === "G") {
                            strQuery = mysql.format(
                                "update hims_f_sales_quotation set quote_services_status='O', updated_date=?, updated_by=? \
                                where hims_f_sales_quotation_id=?",
                                [
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    input.sales_quotation_id
                                ]
                            );
                        }
                    }

                    _mysql
                        .executeQuery({
                            query: strQuery,
                            printQuery: true
                        })
                        .then(update_Result => {
                            resolve()
                        })
                        .catch(error => {
                            reject(error);
                        });
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
