import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";
import { LINQ } from "node-linq";
import { parse } from "querystring";

export function getSalesOrder(req, res, next) {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    try {
        console.log("getSalesOrder: ")
        _mysql
            .executeQuery({
                query:
                    "SELECT SQ.*, C.vat_percentage, C.customer_name, H.hospital_name, P.project_desc as project_name from hims_f_sales_order SQ \
                    inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id \
                    inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id \
                    inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id \
                    where SQ.sales_order_number=?",
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
                                  payment_terms, service_terms, other_terms, sub_total, discount_amount, net_total, \
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
                            input.service_terms,
                            input.other_terms,
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
                        } else if (input.sales_order_services.length > 0) {
                            IncludeValues = [
                                "services_id",
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

export function getSalesOrderItem(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        let inputParam = req.query;

        _mysql
            .executeQuery({
                query:
                    "SELECT SQ.*, C.vat_percentage, C.customer_name, H.hospital_name, P.project_desc as project_name from hims_f_sales_order SQ \
                inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id \
                inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id \
                inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id \
                where SQ.sales_order_number=?",
                values: [inputParam.sales_order_number],
                printQuery: false
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    _mysql
                        .executeQuery({
                            query:
                                "select D.*,LOC.*,IM.*, PU.uom_description from hims_f_sales_order_items D \
                            left join hims_m_inventory_item_location LOC  on D.item_id=LOC.item_id \
                            inner join `hims_d_inventory_item_master` IM  on IM.hims_d_inventory_item_master_id=D.item_id \
                            inner join `hims_d_inventory_uom` PU  on PU.hims_d_inventory_uom_id=D.uom_id \
                            where D.sales_order_id=? and  (date(LOC.expirydt) > date(CURDATE()) || exp_date_required='N') \
                            and D.quantity_outstanding <> 0 order by  date(LOC.expirydt) ",
                            values: [headerResult[0].hims_f_sales_order_id],
                            printQuery: true
                        })
                        .then(inventory_stock_detail => {
                            _mysql.releaseConnection();

                            var item_grp = _(inventory_stock_detail)
                                .groupBy("item_id")
                                .map((row, item_id) => item_id)
                                .value();

                            let outputArray = [];

                            for (let i = 0; i < item_grp.length; i++) {
                                let item = new LINQ(inventory_stock_detail)
                                    .Where(w => w.item_id == item_grp[i])
                                    .Select(s => {
                                        return {
                                            item_category_id: s.category_id,
                                            item_group_id: s.group_id,
                                            item_id: s.item_id,
                                            uom_id: s.uom_id,
                                            quantity_outstanding: parseFloat(s.quantity_outstanding),
                                            item_description: s.item_description,
                                            uom_description: s.uom_description,
                                            unit_cost: s.unit_cost,
                                            discount_percentage: s.discount_percentage,
                                            tax_percentage: s.tax_percentage,
                                            quantity: s.quantity,
                                            selected_quantity: 0,
                                            delivered_to_date: parseFloat(s.quantity) - parseFloat(s.quantity_outstanding)
                                        };
                                    })
                                    .FirstOrDefault();

                                let batches = new LINQ(inventory_stock_detail)
                                    .Where(
                                        w => w.item_id == item_grp[i] &&
                                            w.qtyhand > 0 &&
                                            w.inventory_location_id == inputParam.location_id
                                    )
                                    .Select(s => {
                                        return {
                                            item_id: s.item_id,
                                            batchno: s.batchno,
                                            expiry_date: s.expirydt,
                                            barcode: s.barcode,
                                            qtyhand: s.qtyhand,
                                            qtypo: s.qtypo,
                                            cost_uom: s.cost_uom,
                                            unit_cost: s.avgcost,
                                            last_purchase_cost: s.last_purchase_cost,
                                            item_type: s.item_type,
                                            grn_id: s.grn_id,
                                            grnno: s.grnno,
                                            sale_price: s.sale_price,
                                            mrp_price: s.mrp_price,
                                            sales_uom: s.sales_uom,
                                            vendor_batchno: s.vendor_batchno,
                                            dispatch_quantity: 0
                                        };
                                    })
                                    .ToArray();

                                outputArray.push({ ...item, batches });
                            }

                            req.records = {
                                ...headerResult[0],
                                ...{ stock_detail: outputArray }
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