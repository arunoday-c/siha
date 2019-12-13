import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
    getVendorQuotation: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query:
                        "SELECT VQH.*, RQH.quotation_number, V.payment_terms from  hims_f_procurement_vendor_quotation_header VQH, \
                        hims_f_procurement_req_quotation_header RQH, hims_d_vendor V \
                        where VQH.req_quotation_header_id = RQH.hims_f_procurement_req_quotation_header_id \
                        and V.hims_d_vendor_id = VQH.vendor_id and VQH.vendor_quotation_number=?;",
                    values: [req.query.vendor_quotation_number],
                    printQuery: true
                })
                .then(headerResult => {
                    if (headerResult.length != 0) {
                        let strQuery = "";

                        console.log("strQuery: ", headerResult[0].quotation_for)

                        if (headerResult[0].quotation_for === "INV") {
                            strQuery = mysql.format(
                                "select * from hims_f_procurement_vendor_quotation_detail where vendor_quotation_header_id=?",
                                [headerResult[0].hims_f_procurement_vendor_quotation_header_id]
                            );
                        } else if (headerResult[0].quotation_for === "PHR") {
                            strQuery = mysql.format(
                                "select * from hims_f_procurement_vendor_quotation_detail where vendor_quotation_header_id=?",
                                [headerResult[0].hims_f_procurement_vendor_quotation_header_id]
                            );
                        }
                        console.log("strQuery: ", strQuery)
                        _mysql
                            .executeQuery({
                                query: strQuery,
                                printQuery: true
                            })
                            .then(quotation_detail => {
                                _mysql.releaseConnection();
                                req.records = {
                                    ...headerResult[0],
                                    ...{ quotation_detail }
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

    addVendorQuotation: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            let input = { ...req.body };
            let vendor_quotation_number = "";
            const utilities = new algaehUtilities();
            utilities.logger().log("addDeliveryNoteEntry: ");
            _mysql
                .generateRunningNumber({
                    modules: ["VEN_QUT_NUM"],
                    tableName: "hims_f_app_numgen",
                    identity: {
                        algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                        hospital_id: req.userIdentity.hospital_id
                    }
                })
                .then(generatedNumbers => {
                    vendor_quotation_number = generatedNumbers[0];

                    // let today = moment().format("YYYY-MM-DD");

                    _mysql
                        .executeQuery({
                            query:
                                "INSERT INTO `hims_f_procurement_vendor_quotation_header` (vendor_quotation_number, \
                                    vendor_quotation_date, req_quotation_header_id, vendor_id, quotation_for, expected_date, \
                                    created_by, created_date, updated_by, updated_date, hospital_id) \
                                    VALUE(?,?,?,?,?,?,?,?,?,?,?)",
                            values: [
                                vendor_quotation_number,
                                new Date(),
                                input.req_quotation_header_id,
                                input.vendor_id,
                                input.quotation_for,
                                input.expected_date,
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.hospital_id
                            ],
                            printQuery: true
                        })
                        .then(headerResult => {
                            let IncludeValues = [
                                "phar_item_category",
                                "phar_item_group",
                                "phar_item_id",
                                "inv_item_category_id",
                                "inv_item_group_id",
                                "inv_item_id",
                                "pharmacy_uom_id",
                                "inventory_uom_id",
                                "quantity",
                                "unit_price",
                                "extended_price",
                                "discount_percentage",
                                "discount_amount",
                                "net_extended_cost",
                                "tax_percentage",
                                "tax_amount",
                                "total_amount",
                            ];

                            _mysql
                                .executeQuery({
                                    query:
                                        "INSERT INTO hims_f_procurement_vendor_quotation_detail(??) VALUES ?",
                                    values: input.quotation_detail,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        vendor_quotation_header_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        req.records = {
                                            vendor_quotation_number: vendor_quotation_number,
                                            hims_f_procurement_vendor_quotation_header_id: headerResult.insertId
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
};
