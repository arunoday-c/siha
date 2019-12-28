import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";

export default {
    getRequestForQuotation: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query:
                        "SELECT RQH.*, CASE WHEN RQH.quotation_for = 'INV' THEN \
                        (select material_requisition_number from hims_f_inventory_material_header \
                        where hims_f_inventory_material_header_id=RQH.inv_requisition_id ) else \
                        (select material_requisition_number from hims_f_pharamcy_material_header  \
                        where hims_f_pharamcy_material_header_id=RQH.phar_requisition_id) END as material_requisition_number \
                        from  hims_f_procurement_req_quotation_header RQH where quotation_number=?",
                    values: [req.query.quotation_number],
                    printQuery: true
                })
                .then(headerResult => {
                    if (headerResult.length != 0) {
                        let strQuery = "";

                        console.log("strQuery: ", headerResult[0].quotation_for)

                        if (headerResult[0].quotation_for === "INV") {
                            strQuery = mysql.format(
                                "select * from hims_f_procurement_req_quotation_detail where req_quotation_header_id=?",
                                [headerResult[0].hims_f_procurement_req_quotation_header_id]
                            );
                        } else if (headerResult[0].quotation_for === "PHR") {
                            strQuery = mysql.format(
                                "select * from hims_f_procurement_req_quotation_detail where req_quotation_header_id=?",
                                [headerResult[0].hims_f_procurement_req_quotation_header_id]
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

    addRequestForQuotation: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            let input = { ...req.body };
            let quotation_number = "";
            const utilities = new algaehUtilities();
            utilities.logger().log("addDeliveryNoteEntry: ");
            _mysql
                .generateRunningNumber({
                    modules: ["REQ_QUT_NUM"],
                    tableName: "hims_f_app_numgen",
                    identity: {
                        algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                        hospital_id: req.userIdentity.hospital_id
                    }
                })
                .then(generatedNumbers => {
                    quotation_number = generatedNumbers[0];

                    // let today = moment().format("YYYY-MM-DD");

                    _mysql
                        .executeQuery({
                            query:
                                "INSERT INTO `hims_f_procurement_req_quotation_header` (quotation_number, quotation_date,\
                                    quotation_for,expected_date, phar_requisition_id,inv_requisition_id, \
                                    created_by,created_date, updated_by,updated_date,hospital_id) \
                                    VALUE(?,?,?,?,?,?,?,?,?,?,?)",
                            values: [
                                quotation_number,
                                new Date(),
                                input.quotation_for,
                                input.expected_date,
                                input.phar_requisition_id,
                                input.inv_requisition_id,
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
                                "quantity"
                            ];

                            _mysql
                                .executeQuery({
                                    query:
                                        "INSERT INTO hims_f_procurement_req_quotation_detail(??) VALUES ?",
                                    values: input.quotation_detail,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        req_quotation_header_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        req.records = {
                                            quotation_number: quotation_number,
                                            hims_f_procurement_req_quotation_header_id: headerResult.insertId
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
    },
    getRequestQuotationToComapre: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            console.log("req.query.quotation_for", req.query.quotation_for)
            let strQuery = ""
            if (req.query.quotation_for === "INV") {
                strQuery = mysql.format(
                    "SELECT  hims_f_procurement_vendor_quotation_header_id,V.vendor_name, vendor_id, IM.item_description, D.quantity, D.unit_price, \
                    IU.uom_description, inv_item_id as item_id FROM hims_f_procurement_vendor_quotation_header H \
                    inner join hims_f_procurement_vendor_quotation_detail D on D.vendor_quotation_header_id = H.hims_f_procurement_vendor_quotation_header_id\
                    inner join hims_d_vendor V on V.hims_d_vendor_id = H.vendor_id   \
                    inner join hims_d_inventory_item_master IM on D.inv_item_id = IM.hims_d_inventory_item_master_id \
                    inner join hims_d_inventory_uom IU on D.inventory_uom_id = IU.hims_d_inventory_uom_id \
                    where H.req_quotation_header_id=? ;",
                    [req.query.hims_f_procurement_req_quotation_header_id]
                );
            } else if (req.query.quotation_for === "PHR") {
                strQuery = mysql.format(
                    "SELECT  hims_f_procurement_vendor_quotation_header_id,V.vendor_name, vendor_id,IM.item_description, D.quantity, D.unit_price, \
                    IU.uom_description, phar_item_id as item_id FROM hims_f_procurement_vendor_quotation_header H \
                    inner join hims_f_procurement_vendor_quotation_detail D on D.vendor_quotation_header_id = H.hims_f_procurement_vendor_quotation_header_id\
                    inner join hims_d_vendor V on V.hims_d_vendor_id = H.vendor_id   \
                    inner join hims_d_item_master IM on D.inv_item_id = IM.hims_d_item_master_id \
                    inner join hims_d_pharmacy_uom IU on D.inventory_uom_id = IU.hims_d_pharmacy_uom_id \
                    where H.req_quotation_header_id=? ;",
                    [req.query.hims_f_procurement_req_quotation_header_id]
                );
            }
            _mysql
                .executeQuery({
                    query: strQuery,
                    printQuery: true
                })
                .then(result => {
                    _mysql.releaseConnection();
                    req.records = result;
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

};
