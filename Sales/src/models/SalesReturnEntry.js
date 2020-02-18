import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";

export function getSalesReturn(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        console.log("getSalesReturn: ")
        _mysql
            .executeQuery({
                query: "SELECT H.*, C.customer_name,HS.hospital_name, IH.invoice_number, P.project_desc as project_name, \
                L.location_description, L.location_type from hims_f_sales_return_header H \
                inner join  hims_f_sales_invoice_header IH on  IH.hims_f_sales_invoice_header_id = H.sales_invoice_header_id \
                inner join  hims_d_customer C on  H.customer_id = C.hims_d_customer_id \
                inner join  hims_d_inventory_location L on  L.hims_d_inventory_location_id = H.location_id \
                inner join hims_d_project P  on P.hims_d_project_id = H.project_id  \
                inner join  hims_d_hospital HS on  H.hospital_id = HS.hims_d_hospital_id \
                where H.sales_return_number =?",
                values: [req.query.sales_return_number],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {

                    _mysql
                        .executeQuery({
                            query: "select QI.*, IM.item_description, IU.uom_description, IM.sales_uom_id from hims_f_sales_return_detail QI \
                            inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
                            inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id \
                            where sales_return_header_id=?",
                            values: [headerResult[0].hims_f_sales_return_header_id],
                            printQuery: true
                        })
                        .then(sales_return_detail => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ sales_return_detail }
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

export function getInvoiceEntryItems(req, res, next) {
    const _mysql = new algaehMysql();
    const inputParam = req.query;
    try {
        _mysql
            .executeQuery({
                query:
                    "SELECT *, SIH.net_payable as invoice_net_payable, SIH.net_payable as return_total, \
                    C.customer_name, H.hospital_name,  P.project_desc as project_name, L.location_description, \
                    L.location_type, DNH.location_id FROM hims_f_sales_invoice_header SIH \
                    inner join  hims_f_sales_dispatch_note_header DNH on  DNH.sales_order_id = SIH.sales_order_id \
                    inner join  hims_d_customer C on  SIH.customer_id = C.hims_d_customer_id \
                    inner join  hims_d_hospital H on  SIH.hospital_id = H.hims_d_hospital_id \
                    inner join hims_d_project P  on SIH.project_id = P.hims_d_project_id \
                    inner join  hims_d_inventory_location L on  DNH.location_id = L.hims_d_inventory_location_id \
                    where hims_f_sales_invoice_header_id=? ",
                values: [req.query.hims_f_sales_invoice_header_id],
                printQuery: true
            })
            .then(headerResult => {

                _mysql
                    .executeQuery({
                        query: "SELECT GD.dispatch_note_header_id, DNB.*, IM.item_description, IM.sales_uom_id, \
                        DNB.dispatch_quantity as return_qty, DNB.dispatch_quantity as dispatch_quantity, IU.uom_description \
                        from hims_f_sales_invoice_detail GD \
                        inner join hims_f_sales_dispatch_note_detail DND on DND.dispatch_note_header_id = GD.dispatch_note_header_id \
                        inner join hims_f_sales_dispatch_note_batches DNB \
                        on DNB.sales_dispatch_note_detail_id = DND.hims_f_sales_dispatch_note_detail_id \
                        inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = DNB.item_id \
                        inner join hims_d_inventory_uom IU on DND.uom_id = IU.hims_d_inventory_uom_id \
                        where GD.sales_invoice_header_id=?; ",
                        values: [inputParam.hims_f_sales_invoice_header_id],
                        printQuery: true
                    })
                    .then(sales_return_detail => {
                        _mysql.releaseConnection();
                        req.records = {
                            ...headerResult[0],
                            ...{ sales_return_detail }
                        };
                        next();
                    })
                    .catch(error => {
                        _mysql.releaseConnection();
                        next(error);
                    });
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

export function addSalesReturn(req, res, next) {
    const _mysql = new algaehMysql();

    try {
        let input = req.body;
        let sales_return_number = "";
        // const utilities = new algaehUtilities();
        // utilities.logger().log("addSalesOrder: ");

        _mysql
            .generateRunningNumber({
                user_id: req.userIdentity.algaeh_d_app_user_id,
                numgen_codes: ["SALES_RETURN"],
                table_name: "hims_f_sales_numgen"
            })
            .then(generatedNumbers => {
                sales_return_number = generatedNumbers.SALES_RETURN;

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_sales_return_header (sales_return_number, return_date, sales_invoice_header_id, \
                                location_id, customer_id, project_id, comment, \
                                invoice_net_payable, sub_total, discount_amount, net_total, \
                                tax_amount, return_total,  created_date, \
                                  created_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            sales_return_number,
                            new Date(),
                            input.sales_invoice_header_id,
                            input.location_id,
                            input.customer_id,
                            input.project_id,
                            input.comment,
                            input.invoice_net_payable,
                            input.sub_total,
                            input.discount_amount,
                            input.net_total,
                            input.tax_amount,
                            input.return_total,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            input.hospital_id
                        ],
                        printQuery: true
                    })
                    .then(headerResult => {
                        console.log("headerResult", headerResult);

                        let IncludeValues = [
                            "item_category_id",
                            "item_group_id",
                            "item_id",
                            "uom_id",
                            "dispatch_quantity",
                            "unit_cost",
                            "return_qty",
                            "extended_cost",
                            "discount_percentage",
                            "discount_amount",
                            "net_extended_cost",
                            "tax_percentage",
                            "tax_amount",
                            "total_amount",
                            "batchno",
                            "expiry_date",
                            "dispatch_note_header_id",
                        ];

                        let strGrnQry = mysql.format(
                            "UPDATE hims_f_sales_invoice_header set return_done ='Y', updated_date=?, updated_by=? \
                            where hims_f_sales_invoice_header_id=?",
                            [
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                input.sales_invoice_header_id
                            ]
                        );


                        _mysql
                            .executeQuery({
                                query:
                                    "INSERT INTO hims_f_sales_return_detail(??) VALUES ? ;" + strGrnQry,
                                values: input.sales_return_detail,
                                includeValues: IncludeValues,
                                extraValues: {
                                    sales_return_header_id: headerResult.insertId
                                },
                                bulkInsertOrUpdate: true,
                                printQuery: true
                            })
                            .then(detailResult => {
                                _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = {
                                        sales_return_number: sales_return_number,
                                        hims_f_sales_return_header_id: headerResult.insertId
                                    };
                                    return next();
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
};

export function postSalesReturnEntry(req, res, next) {

    const _mysql = new algaehMysql();

    try {
        let inputParam = { ...req.body };

        _mysql
            .executeQueryWithTransaction({
                query:
                    "UPDATE `hims_f_sales_return_header` SET `is_posted` = 'Y', `posted_date`=?, `posted_by`=? \
          WHERE `hims_f_sales_return_header_id`=?;",
                values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.hims_f_sales_return_header_id
                ],
                printQuery: true
            })
            .then(headerResult => {
                req.connection = {
                    connection: _mysql.connection,
                    isTransactionConnection: _mysql.isTransactionConnection,
                    pool: _mysql.pool
                };

                let StrQuery = "";

                for (let i = 0; i < inputParam.sales_return_detail.length; i++) {

                    StrQuery += mysql.format(
                        "UPDATE `hims_f_sales_return_detail` SET return_qty=? where hims_f_sales_return_detail_id=?;",
                        [
                            inputParam.sales_return_detail[i].return_qty,
                            inputParam.sales_return_detail[i].hims_f_sales_return_detail_id
                        ]
                    );
                }
                _mysql
                    .executeQuery({
                        query: StrQuery,
                        printQuery: true
                    })
                    .then(detailResult => {
                        req.body.inventory_stock_detail = req.body.sales_return_detail
                        next();
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


export function generateAccountingEntry(req, res, next) {
    console.log("generateAccountingEntry")
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
        let inputParam = { ...req.body };
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
                            _mysql
                                .executeQuery({
                                    query: "select GH.hims_f_sales_return_header_id, GH.sales_return_number, IH.invoice_number, GH.net_total, GH.tax_amount, \
                                    GH.return_total, IL.hospital_id, IL.head_id as inv_head_id, IL.child_id as inv_child_id, C.head_id as customer_head_id, C.child_id as customer_child_id,\
                                    GD.return_qty , GD.net_extended_cost, ITM.waited_avg_cost, S.head_id as income_head_id, \
                                    S.child_id as income_child_id, C.customer_name, IU.conversion_factor, GH.hospital_id as c_hospital_id,\
                                    GH.project_id, D.hims_d_sub_department_id from hims_f_sales_return_header GH \
                                    inner join hims_f_sales_return_detail GD on GH.hims_f_sales_return_header_id = GD.sales_return_header_id \
                                    inner join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = GH.location_id\
                                    inner join hims_d_customer C on C.hims_d_customer_id = GH.customer_id\
                                    inner join hims_d_inventory_item_master ITM on ITM.hims_d_inventory_item_master_id = GD.item_id\
                                    inner join hims_d_services S on S.hims_d_services_id = ITM.service_id\
                                    inner join hims_f_sales_invoice_header IH on IH.hims_f_sales_invoice_header_id = GH.sales_invoice_header_id\
                                    inner join hims_m_inventory_item_uom IU on IU.item_master_id = GD.item_id and IU.uom_id = GD.uom_id\
                                    left join hims_d_sub_department D on D.inventory_location_id = GH.location_id\
                                    where hims_f_sales_return_header_id=?;",
                                    values: [inputParam.hims_f_sales_return_header_id],
                                    printQuery: true
                                })
                                .then(headerResult => {

                                    _mysql
                                        .executeQuery({
                                            query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                                        voucher_type, document_id, document_number, from_screen, \
                                        narration, invoice_no, cancel_transaction, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                                            values: [
                                                new Date(),
                                                headerResult[0].return_total,
                                                "credit_note",
                                                headerResult[0].hims_f_sales_return_header_id,
                                                headerResult[0].sales_return_number,
                                                inputParam.ScreenCode,
                                                "Return done for  " + headerResult[0].invoice_number + " " + headerResult[0].customer_name,
                                                headerResult[0].invoice_number,
                                                "Y",
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
                                                debit_amount: 0,
                                                payment_type: "CR",
                                                credit_amount: headerResult[0].return_total,
                                                hospital_id: headerResult[0].c_hospital_id,
                                                sub_department_id: headerResult[0].hims_d_sub_department_id === null ?
                                                    sub_department_id : headerResult[0].hims_d_sub_department_id,
                                                project_id: headerResult[0].project_id
                                            });

                                            //OUT PUT Tax Entry
                                            if (parseFloat(headerResult[0].tax_amount) > 0) {
                                                insertSubDetail.push({
                                                    payment_date: new Date(),
                                                    head_id: output_tax_acc.head_id,
                                                    child_id: output_tax_acc.child_id,
                                                    debit_amount: headerResult[0].tax_amount,
                                                    payment_type: "DR",
                                                    credit_amount: 0,
                                                    hospital_id: req.userIdentity.hospital_id,
                                                    sub_department_id: headerResult[0].hims_d_sub_department_id === null ?
                                                        sub_department_id : headerResult[0].hims_d_sub_department_id,
                                                    project_id: headerResult[0].project_id
                                                });
                                            }



                                            for (let i = 0; i < headerResult.length; i++) {
                                                //Income Entry
                                                let waited_avg_cost =
                                                    utilities.decimalPoints(
                                                        (parseFloat(headerResult[i].return_qty) *
                                                            parseFloat(headerResult[i].conversion_factor) *
                                                            parseFloat(headerResult[i].waited_avg_cost)),
                                                        decimal_places
                                                    )

                                                insertSubDetail.push({
                                                    payment_date: new Date(),
                                                    head_id: headerResult[i].income_head_id,
                                                    child_id: headerResult[i].income_child_id,
                                                    debit_amount: headerResult[i].net_extended_cost,
                                                    payment_type: "DR",
                                                    credit_amount: 0,
                                                    hospital_id: req.userIdentity.hospital_id,
                                                    sub_department_id: headerResult[i].hims_d_sub_department_id === null ?
                                                        sub_department_id : headerResult[i].hims_d_sub_department_id,
                                                    project_id: headerResult[i].project_id
                                                });

                                                //COGS Entry
                                                insertSubDetail.push({
                                                    payment_date: new Date(),
                                                    head_id: cogs_acc_data.head_id,
                                                    child_id: cogs_acc_data.child_id,
                                                    debit_amount: 0,
                                                    payment_type: "CR",
                                                    credit_amount: waited_avg_cost,
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
                                                    debit_amount: waited_avg_cost,
                                                    payment_type: "DR",
                                                    credit_amount: 0,
                                                    hospital_id: headerResult[i].hospital_id,
                                                    sub_department_id: headerResult[i].hims_d_sub_department_id === null ?
                                                        sub_department_id : headerResult[i].hims_d_sub_department_id,
                                                    project_id: headerResult[i].project_id
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
                                                        month: month
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