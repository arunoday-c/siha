import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export const addSalesQuotation = (ctx, next) => {
    const _mysql = new algaehMysql();
    try {
        input = ctx.request.body;

        let sales_quotation_number = "";
        const utilities = new algaehUtilities();
        utilities.logger().log("addDeliveryNoteEntry: ");
        _mysql
            .generateRunningNumber({
                modules: ["SALES_QUOTE"],
                tableName: "hims_f_sales_numgen",
                identity: {
                    algaeh_d_app_user_id: context.userIdentity.algaeh_d_app_user_id,
                    hospital_id: context.userIdentity.hospital_id
                }
            })
            .then(generatedNumbers => {
                sales_quotation_number = generatedNumbers[0];

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_sales_quotation (sales_quotation_number, sales_quotation_date, \
                                sales_quotation_mode, reference_number, customer_id, quote_validity, sales_man, \
                                payment_terms, service_terms, other_terms, sub_total, discount_amount, net_total, \
                                total_tax, net_payable, narration, created_date, created_by, updated_date, \
                                updated_by, hospital_id)\
                        values(?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            sales_quotation_number,
                            new Date(),
                            input.sales_quotation_mode,
                            input.reference_number,
                            input.customer_id,
                            input.quote_validity,

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
                            new Date(),
                            ctx.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            ctx.userIdentity.algaeh_d_app_user_id,
                            ctx.userIdentity.hospital_id
                        ],
                        printQuery: true
                    })
                    .then(headerResult => {
                        if (input.sales_quotation_items.length > 0) {
                            let IncludeValues = [
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
                                        "INSERT INTO hims_f_sales_quotation_items(??) VALUES ?",
                                    values: input.sales_quotation_items,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_quotation_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        ctx.body = {
                                            sales_quotation_number: sales_quotation_number,
                                            hims_f_sales_quotation_id: headerResult.insertId
                                        };
                                        next();
                                    });
                                })
                                .catch(error => {
                                    utilities.logger().log("erroe: ", error);
                                    _mysql.rollBackTransaction(() => {
                                        next(error);
                                    });
                                });
                        } else if (input.sales_quotation_services.length > 0) {
                            let IncludeValues = [
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
                                        "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?",
                                    values: input.sales_quotation_services,
                                    includeValues: IncludeValues,
                                    extraValues: {
                                        sales_quotation_id: headerResult.insertId
                                    },
                                    bulkInsertOrUpdate: true,
                                    printQuery: true
                                })
                                .then(detailResult => {
                                    _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        ctx.body = {
                                            sales_quotation_number: sales_quotation_number,
                                            hims_f_sales_quotation_id: headerResult.insertId
                                        };
                                        next();
                                    });
                                })
                                .catch(error => {
                                    utilities.logger().log("erroe: ", error);
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
}

// export default {
//     getPurchaseOrderEntry: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT PH.hims_f_procurement_po_header_id, PH.purchase_number, PH.po_date, PH.po_type, PH.po_from, \
//             PH.pharmcy_location_id, PH.inventory_location_id, PH.location_type,PH.vendor_id,PH.expected_date, \
//             PH.on_hold,PH.phar_requisition_id,PH.inv_requisition_id, PH.from_multiple_requisition, PH.payment_terms, \
//             PH.sub_total,PH.detail_discount, PH.extended_total, PH.sheet_level_discount_percent, \
//             PH.sheet_level_discount_amount,PH.description,PH.net_total,PH.total_tax, PH.net_payable,PH.is_completed, \
//             PH.completed_date,PH.cancelled,PH.cancel_by,PH.cancel_date,PH.authorize1, VQH.vendor_quotation_number, \
//             CASE WHEN PH.po_from = 'INV' THEN (select material_requisition_number from hims_f_inventory_material_header \
//             where hims_f_inventory_material_header_id=PH.inv_requisition_id ) \
//             else (select material_requisition_number from hims_f_pharamcy_material_header  \
//             where hims_f_pharamcy_material_header_id=PH.phar_requisition_id) END as material_requisition_number,\
//             CASE PH.po_from WHEN 'INV' then IL.location_description \
//             else PL.location_description end as location_name, V.vendor_name\
//             from  hims_f_procurement_po_header PH inner join hims_d_vendor V on PH.vendor_id = V.hims_d_vendor_id \
//             left join hims_d_pharmacy_location PL on PH.pharmcy_location_id = PL.hims_d_pharmacy_location_id \
//             left join hims_d_inventory_location IL on PH.inventory_location_id = IL.hims_d_inventory_location_id \
//             left join hims_f_procurement_vendor_quotation_header VQH on VQH.hims_f_procurement_vendor_quotation_header_id = PH.vendor_quotation_header_id \
//             where purchase_number=?",
//                     values: [req.query.purchase_number],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     if (headerResult.length != 0) {
//                         let strQuery = "";

//                         let strCondition = "";
//                         if (req.query.from === "DN") {
//                             strCondition = " and quantity_outstanding > 0";
//                         }
//                         if (headerResult[0].po_from == "INV") {
//                             strQuery = mysql.format(
//                                 "select PD.`hims_f_procurement_po_detail_id`, PD.`procurement_header_id`, PD.`phar_item_category`,\
//                    PD.`phar_item_group`, PD.`phar_item_id`, PD.`inv_item_category_id`, PD.`inv_item_group_id`,\
//                    PD.`inv_item_id`, PD.`barcode`, PD.`order_quantity`, PD.`foc_quantity`, PD.`total_quantity`,\
//                    PD.`pharmacy_uom_id`, PD.`inventory_uom_id`, PD.`unit_price`, PD.`extended_price`,\
//                    PD.`sub_discount_percentage`, PD.`sub_discount_amount`, PD.`extended_cost`, PD.`unit_cost`,\
//                    PD.`discount_percentage`, PD.`discount_amount`, PD.`net_extended_cost`,PD.`expected_arrival_date`,\
//                    PD.`vendor_item_no`, PD.`manufacturer_item_code`, PD.`completed`, PD.`completed_date`,\
//                    PD.`quantity_recieved`, PD.`quantity_outstanding`, PD.`pharmacy_requisition_id`,\
//                    PD.`inventory_requisition_id`, PD.`authorize_quantity`, PD.`rejected_quantity`, PD.`tax_percentage`,\
//                    PD.`tax_amount`, PD.`total_amount`, PD.`mrp_price`, PD.`calculate_tax_on`,\
//                    PD.`tax_discount`, PD.`item_type`, IM.item_code, IM.item_description, IM.exp_date_required,\
//                    IU.uom_description,STOCK_UOM.uom_description as stock_uom_description,S.standard_fee as sales_price,IM.sales_uom_id from hims_f_procurement_po_detail PD,\
//                     hims_d_inventory_item_master IM ,hims_d_inventory_uom IU, hims_d_inventory_uom STOCK_UOM, hims_d_services S \
//                     where PD.inv_item_id = IM.hims_d_inventory_item_master_id\
//                    and PD.inventory_uom_id = IU.hims_d_inventory_uom_id and IM.stocking_uom_id = STOCK_UOM.hims_d_inventory_uom_id and IM.service_id = S.hims_d_services_id\
//                    and procurement_header_id=?" +
//                                 strCondition,
//                                 [headerResult[0].hims_f_procurement_po_header_id]
//                             );
//                         } else if (headerResult[0].po_from == "PHR") {
//                             strQuery = mysql.format(
//                                 "select PD.`hims_f_procurement_po_detail_id`, PD.`procurement_header_id`, PD.`phar_item_category`, PD.`phar_item_group`, PD.`phar_item_id`, \
//                 PD.`inv_item_category_id`, PD.`inv_item_group_id`, PD.`inv_item_id`, PD.`barcode`, PD.`order_quantity`, PD.`foc_quantity`, \
//                 PD.`total_quantity`, PD.`pharmacy_uom_id`, PD.`inventory_uom_id`, PD.`unit_price`, PD.`extended_price`, PD.`sub_discount_percentage`, \
//                 PD.`sub_discount_amount`, PD.`extended_cost`, PD.`unit_cost`, PD.`discount_percentage`, PD.`discount_amount`, PD.`net_extended_cost`, \
//                 PD.`expected_arrival_date`, PD.`vendor_item_no`, PD.`manufacturer_item_code`, PD.`completed`, PD.`completed_date`, PD.`quantity_recieved`, \
//                 PD.`quantity_outstanding`, PD.`pharmacy_requisition_id`, PD.`inventory_requisition_id`, PD.`authorize_quantity`, PD.`rejected_quantity`, \
//                 PD.`tax_percentage`, PD.`tax_amount`, PD.`total_amount`, PD.`mrp_price`, PD.`calculate_tax_on`, PD.`tax_discount`, PD.`item_type`, \
//                 IM.item_code, IM.item_description,  IM.exp_date_required,\
//                 PU.uom_description,STOCK_UOM.uom_description  as stock_uom_description, S.standard_fee as sales_price,IM.sales_uom_id\
//                 from hims_f_procurement_po_detail PD, hims_d_item_master IM ,hims_d_pharmacy_uom PU, hims_d_pharmacy_uom STOCK_UOM, hims_d_services S\
//                 where PD.phar_item_id = IM.hims_d_item_master_id and PD.pharmacy_uom_id = PU.hims_d_pharmacy_uom_id \
//                 and IM.stocking_uom_id = STOCK_UOM.hims_d_pharmacy_uom_id and IM.service_id = S.hims_d_services_id and procurement_header_id=?" +
//                                 strCondition,
//                                 [headerResult[0].hims_f_procurement_po_header_id]
//                             );
//                         }
//                         _mysql
//                             .executeQuery({
//                                 query: strQuery,
//                                 printQuery: true
//                             })
//                             .then(po_entry_detail => {
//                                 _mysql.releaseConnection();
//                                 req.records = {
//                                     ...headerResult[0],
//                                     ...{ po_entry_detail }
//                                 };
//                                 next();
//                             })
//                             .catch(error => {
//                                 _mysql.releaseConnection();
//                                 next(error);
//                             });
//                     } else {
//                         _mysql.releaseConnection();
//                         req.records = headerResult;
//                         next();
//                     }
//                 })
//                 .catch(error => {
//                     _mysql.releaseConnection();
//                     next(error);
//                 });
//         } catch (e) {
//             _mysql.releaseConnection();
//             next(e);
//         }
//     },

//     addSalesQuotation: (ctx, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             input = ctx.request.body;

//             let sales_quotation_number = "";
//             const utilities = new algaehUtilities();
//             utilities.logger().log("addDeliveryNoteEntry: ");
//             _mysql
//                 .generateRunningNumber({
//                     modules: ["SALES_QUOTE"],
//                     tableName: "hims_f_sales_numgen",
//                     identity: {
//                         algaeh_d_app_user_id: context.userIdentity.algaeh_d_app_user_id,
//                         hospital_id: context.userIdentity.hospital_id
//                     }
//                 })
//                 .then(generatedNumbers => {
//                     sales_quotation_number = generatedNumbers[0];

//                     _mysql
//                         .executeQuery({
//                             query:
//                                 "INSERT INTO hims_f_sales_quotation (sales_quotation_number, sales_quotation_date, \
//                                     sales_quotation_mode, reference_number, customer_id, quote_validity, sales_man, \
//                                     payment_terms, service_terms, other_terms, sub_total, discount_amount, net_total, \
//                                     total_tax, net_payable, narration, created_date, created_by, updated_date, \
//                                     updated_by, hospital_id)\
//                             values(?,?,?,?,?,?,?,?,?,?)",
//                             values: [
//                                 sales_quotation_number,
//                                 new Date(),
//                                 input.sales_quotation_mode,
//                                 input.reference_number,
//                                 input.customer_id,
//                                 input.quote_validity,

//                                 input.sales_man,
//                                 input.payment_terms,
//                                 input.service_terms,
//                                 input.other_terms,
//                                 input.sub_total,
//                                 input.discount_amount,
//                                 input.net_total,
//                                 input.total_tax,
//                                 input.net_payable,
//                                 input.narration,
//                                 new Date(),
//                                 ctx.userIdentity.algaeh_d_app_user_id,
//                                 new Date(),
//                                 ctx.userIdentity.algaeh_d_app_user_id,
//                                 ctx.userIdentity.hospital_id
//                             ],
//                             printQuery: true
//                         })
//                         .then(headerResult => {
//                             if (input.sales_quotation_items.length > 0) {
//                                 let IncludeValues = [
//                                     "item_id",
//                                     "uom_id",
//                                     "unit_cost",
//                                     "quantity",
//                                     "extended_cost",
//                                     "discount_percentage",
//                                     "discount_amount",
//                                     "net_extended_cost",
//                                     "tax_percentage",
//                                     "tax_amount",
//                                     "total_amount"
//                                 ];

//                                 _mysql
//                                     .executeQuery({
//                                         query:
//                                             "INSERT INTO hims_f_sales_quotation_items(??) VALUES ?",
//                                         values: input.sales_quotation_items,
//                                         includeValues: IncludeValues,
//                                         extraValues: {
//                                             sales_quotation_id: headerResult.insertId
//                                         },
//                                         bulkInsertOrUpdate: true,
//                                         printQuery: true
//                                     })
//                                     .then(detailResult => {
//                                         _mysql.commitTransaction(() => {
//                                             _mysql.releaseConnection();
//                                             ctx.body = {
//                                                 sales_quotation_number: sales_quotation_number,
//                                                 hims_f_sales_quotation_id: headerResult.insertId
//                                             };
//                                             next();
//                                         });
//                                     })
//                                     .catch(error => {
//                                         utilities.logger().log("erroe: ", error);
//                                         _mysql.rollBackTransaction(() => {
//                                             next(error);
//                                         });
//                                     });
//                             } else if (input.sales_quotation_services.length > 0) {
//                                 let IncludeValues = [
//                                     "services_id",
//                                     "unit_cost",
//                                     "quantity",
//                                     "extended_cost",
//                                     "discount_percentage",
//                                     "discount_amount",
//                                     "net_extended_cost",
//                                     "tax_percentage",
//                                     "tax_amount",
//                                     "total_amount"
//                                 ];

//                                 _mysql
//                                     .executeQuery({
//                                         query:
//                                             "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?",
//                                         values: input.sales_quotation_services,
//                                         includeValues: IncludeValues,
//                                         extraValues: {
//                                             sales_quotation_id: headerResult.insertId
//                                         },
//                                         bulkInsertOrUpdate: true,
//                                         printQuery: true
//                                     })
//                                     .then(detailResult => {
//                                         _mysql.commitTransaction(() => {
//                                             _mysql.releaseConnection();
//                                             ctx.body = {
//                                                 sales_quotation_number: sales_quotation_number,
//                                                 hims_f_sales_quotation_id: headerResult.insertId
//                                             };
//                                             next();
//                                         });
//                                     })
//                                     .catch(error => {
//                                         utilities.logger().log("erroe: ", error);
//                                         _mysql.rollBackTransaction(() => {
//                                             next(error);
//                                         });
//                                     });
//                             }
//                         })
//                         .catch(e => {
//                             _mysql.rollBackTransaction(() => {
//                                 next(e);
//                             });
//                         });
//                 })
//                 .catch(e => {
//                     _mysql.rollBackTransaction(() => {
//                         next(e);
//                     });
//                 });
//         } catch (e) {
//             _mysql.rollBackTransaction(() => {
//                 next(e);
//             });
//         }
//     },

//     updatePurchaseOrderEntry: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         let qryExecute = false;
//         const utilities = new algaehUtilities();
//         utilities.logger().log("updatePurchaseOrderEntry: ");
//         try {
//             req.mySQl = _mysql;
//             let inputParam = { ...req.body };
//             utilities.logger().log("inputParam: ", inputParam);
//             _mysql
//                 .executeQueryWithTransaction({
//                     query:
//                         "UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize_by_date`=?, `authorize_by_1`=? \
//           WHERE `hims_f_procurement_po_header_id`=?",
//                     values: [
//                         inputParam.authorize1,
//                         new Date(),
//                         req.userIdentity.algaeh_d_app_user_id,
//                         inputParam.hims_f_procurement_po_header_id
//                     ],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     req.connection = {
//                         connection: _mysql.connection,
//                         isTransactionConnection: _mysql.isTransactionConnection,
//                         pool: _mysql.pool
//                     };
//                     utilities.logger().log("headerResult: ");
//                     if (headerResult != null) {
//                         let details = inputParam.po_entry_detail;

//                         let qry = "";

//                         for (let i = 0; i < details.length; i++) {
//                             utilities.logger().log("details: ");
//                             qry += mysql.format(
//                                 "UPDATE hims_f_procurement_po_detail SET `authorize_quantity`=?, rejected_quantity=?,\
//                 quantity_recieved=?, quantity_outstanding=?\
//               where `hims_f_procurement_po_detail_id`=?;",
//                                 [
//                                     details[i].authorize_quantity,
//                                     details[i].rejected_quantity,
//                                     details[i].quantity_recieved,
//                                     details[i].quantity_outstanding,
//                                     details[i].hims_f_procurement_po_detail_id
//                                 ]
//                             );

//                             if (i == details.length - 1) {
//                                 utilities.logger().log("if Data: ");
//                                 qryExecute = true;
//                             }
//                         }
//                         utilities.logger().log("qryExecute: ", qryExecute);
//                         if (qryExecute == true) {
//                             _mysql
//                                 .executeQuery({
//                                     query: qry,
//                                     printQuery: true
//                                 })
//                                 .then(detailResult => {
//                                     _mysql.commitTransaction(() => {
//                                         _mysql.releaseConnection();
//                                         req.records = detailResult;
//                                         next();
//                                     });
//                                 })
//                                 .catch(e => {
//                                     _mysql.rollBackTransaction(() => {
//                                         next(e);
//                                     });
//                                 });
//                         }
//                     } else {
//                         _mysql.rollBackTransaction(() => {
//                             req.records = {};
//                             next();
//                         });
//                     }
//                 })
//                 .catch(e => {
//                     _mysql.rollBackTransaction(() => {
//                         next(e);
//                     });
//                 });
//         } catch (e) {
//             _mysql.rollBackTransaction(() => {
//                 next(e);
//             });
//         }
//     },

//     getAuthPurchaseList: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             let inputParam = req.query;

//             // let strQuery =
//             //   "SELECT * from  hims_f_procurement_po_header\
//             //       where cancelled='N' ";

//             // if (inputParam.pharmcy_location_id != null) {
//             //   strQuery +=
//             //     " and pharmcy_location_id = " + inputParam.pharmcy_location_id;
//             // }
//             // if (inputParam.inventory_location_id != null) {
//             //   strQuery +=
//             //     " and inventory_location_id = " + inputParam.inventory_location_id;
//             // }

//             let strQuery =
//                 "SELECT * from  hims_f_procurement_po_header\
//           where cancelled='N' ";

//             if (req.query.from_date != null) {
//                 strQuery +=
//                     " and date(po_date) between date('" +
//                     req.query.from_date +
//                     "') AND date('" +
//                     req.query.to_date +
//                     "')";
//             } else {
//                 strQuery += " and date(po_date) <= date(now())";
//             }

//             if (inputParam.po_from != null) {
//                 strQuery += " and po_from = '" + inputParam.po_from + "'";
//             }
//             if (inputParam.pharmcy_location_id != null) {
//                 strQuery +=
//                     " and pharmcy_location_id = " + inputParam.pharmcy_location_id;
//             }
//             if (inputParam.inventory_location_id != null) {
//                 strQuery +=
//                     " and inventory_location_id = " + inputParam.inventory_location_id;
//             }
//             // if (inputParam.authorize1 != null) {
//             //   strQuery += " and authorize1 = '" + inputParam.authorize1 + "'";
//             // }

//             if (inputParam.status == null || inputParam.status == "0") {
//                 strQuery += "";
//             } else if (inputParam.status == "1") {
//                 //Pending To Authorize 1
//                 strQuery += " and authorize1 = 'N'";
//             } else if (inputParam.status == "2") {
//                 strQuery += " and authorize1 = 'Y' and is_completed='N'";
//             } else if (inputParam.status == "3") {
//                 strQuery += " and is_completed='Y'";
//             }

//             _mysql
//                 .executeQuery({
//                     query: strQuery,
//                     printQuery: true
//                 })
//                 .then(result => {
//                     _mysql.releaseConnection();
//                     req.records = result;
//                     next();
//                 })
//                 .catch(error => {
//                     _mysql.releaseConnection();
//                     next(error);
//                 });
//         } catch (e) {
//             _mysql.releaseConnection();
//             next(e);
//         }
//     },

//     getPharRequisitionEntryPO: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT * from  hims_f_pharamcy_material_header where material_requisition_number=?",
//                     values: [req.query.material_requisition_number],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     if (headerResult.length != 0) {
//                         _mysql
//                             .executeQuery({
//                                 query:
//                                     "select * from hims_f_pharmacy_material_detail p left outer join hims_d_item_master l \
//                 on l.hims_d_item_master_id =p.item_id where pharmacy_header_id=?",
//                                 values: [headerResult[0].hims_f_pharamcy_material_header_id],
//                                 printQuery: true
//                             })
//                             .then(po_entry_detail => {
//                                 _mysql.releaseConnection();
//                                 req.records = {
//                                     ...headerResult[0],
//                                     ...{ po_entry_detail }
//                                 };
//                                 next();
//                             })
//                             .catch(error => {
//                                 _mysql.releaseConnection();
//                                 next(error);
//                             });
//                     } else {
//                         _mysql.releaseConnection();
//                         req.records = headerResult;
//                         next();
//                     }
//                 })
//                 .catch(error => {
//                     _mysql.releaseConnection();
//                     next(error);
//                 });
//         } catch (e) {
//             _mysql.releaseConnection();
//             next(e);
//         }
//     },

//     getInvRequisitionEntryPO: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT * from  hims_f_inventory_material_header where material_requisition_number=?",
//                     values: [req.query.material_requisition_number],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     if (headerResult.length != 0) {
//                         _mysql
//                             .executeQuery({
//                                 query:
//                                     "select * from hims_f_inventory_material_detail p left outer join hims_d_inventory_item_master l \
//                 on l.hims_d_inventory_item_master_id =p.item_id where inventory_header_id=?",
//                                 values: [headerResult[0].hims_f_inventory_material_header_id],
//                                 printQuery: true
//                             })
//                             .then(po_entry_detail => {
//                                 _mysql.releaseConnection();
//                                 req.records = {
//                                     ...headerResult[0],
//                                     ...{ po_entry_detail }
//                                 };
//                                 next();
//                             })
//                             .catch(error => {
//                                 _mysql.releaseConnection();
//                                 next(error);
//                             });
//                     } else {
//                         _mysql.releaseConnection();
//                         req.records = headerResult;
//                         next();
//                     }
//                 })
//                 .catch(error => {
//                     _mysql.releaseConnection();
//                     next(error);
//                 });
//         } catch (e) {
//             _mysql.releaseConnection();
//             next(e);
//         }
//     },

//     releaseDB: (req, res, next) => {
//         const _options = req.connection == null ? {} : req.connection;
//         const _mysql = new algaehMysql(_options);
//         try {
//             _mysql.commitTransaction(() => {
//                 _mysql.releaseConnection();
//                 req.data = req.records.purchase_number;
//                 next();
//             });
//         } catch (e) {
//             _mysql.rollBackTransaction(() => {
//                 next(e);
//             });
//         }
//     },

//     updatePharReqEntry: (req, res, next) => {
//         const _options = req.connection == null ? {} : req.connection;
//         const _mysql = new algaehMysql(_options);
//         try {
//             const utilities = new algaehUtilities();
//             utilities.logger().log("updatePOEntry: ");
//             let inputParam = { ...req.body };

//             _mysql
//                 .executeQuery({
//                     query:
//                         "UPDATE `hims_f_pharamcy_material_header` SET `is_completed`=?, `completed_date`=? \
//           WHERE `hims_f_pharamcy_material_header_id`=?;",
//                     values: ["Y", new Date(), inputParam.phar_requisition_id],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     utilities.logger().log("headerResult: ");
//                     if (headerResult != null) {
//                         let details = inputParam.pharmacy_stock_detail;

//                         let qry = "";

//                         for (let i = 0; i < details.length; i++) {
//                             qry += mysql.format(
//                                 "UPDATE hims_f_pharmacy_material_detail SET `po_created_date`=?, po_created='Y', po_created_quantity=?\
//               where `hims_f_pharmacy_material_detail_id`=? ;",
//                                 [
//                                     new Date(),
//                                     details[i].total_quantity,
//                                     details[i].pharmacy_requisition_id
//                                 ]
//                             );
//                         }
//                         _mysql
//                             .executeQuery({
//                                 query: qry,
//                                 printQuery: true
//                             })
//                             .then(detailResult => {
//                                 // _mysql.commitTransaction(() => {
//                                 //   _mysql.releaseConnection();
//                                 req.data = req.records.purchase_number;
//                                 next();
//                                 // });
//                             })
//                             .catch(e => {
//                                 _mysql.rollBackTransaction(() => {
//                                     next(e);
//                                 });
//                             });
//                     } else {
//                         _mysql.rollBackTransaction(() => {
//                             req.records = {};
//                             next();
//                         });
//                     }
//                 })
//                 .catch(e => {
//                     _mysql.rollBackTransaction(() => {
//                         next(e);
//                     });
//                 });
//         } catch (e) {
//             _mysql.rollBackTransaction(() => {
//                 next(e);
//             });
//         }
//     },

//     updateInvReqEntry: (req, res, next) => {
//         const _options = req.connection == null ? {} : req.connection;
//         const _mysql = new algaehMysql(_options);
//         try {
//             const utilities = new algaehUtilities();
//             utilities.logger().log("updatePOEntry: ");
//             let inputParam = { ...req.body };

//             _mysql
//                 .executeQuery({
//                     query:
//                         "UPDATE `hims_f_inventory_material_header` SET `is_completed`=?, `completed_date`=? \
//           WHERE `hims_f_inventory_material_header_id`=?;",
//                     values: ["Y", new Date(), inputParam.inv_requisition_id],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     utilities.logger().log("headerResult: ");
//                     if (headerResult != null) {
//                         let details = inputParam.inventory_stock_detail;

//                         let qry = "";

//                         for (let i = 0; i < details.length; i++) {
//                             qry += mysql.format(
//                                 "UPDATE hims_f_inventory_material_detail SET `po_created_date`=?, po_created='Y', po_created_quantity=?\
//               where `hims_f_inventory_material_detail_id`=? ;",
//                                 [
//                                     new Date(),
//                                     details[i].total_quantity,
//                                     details[i].inventory_requisition_id
//                                 ]
//                             );
//                         }
//                         _mysql
//                             .executeQuery({
//                                 query: qry,
//                                 printQuery: true
//                             })
//                             .then(detailResult => {
//                                 // _mysql.commitTransaction(() => {
//                                 //   _mysql.releaseConnection();
//                                 req.data = req.records.purchase_number;
//                                 next();
//                                 // });
//                             })
//                             .catch(e => {
//                                 _mysql.rollBackTransaction(() => {
//                                     next(e);
//                                 });
//                             });
//                     } else {
//                         _mysql.rollBackTransaction(() => {
//                             req.records = {};
//                             next();
//                         });
//                     }
//                 })
//                 .catch(e => {
//                     _mysql.rollBackTransaction(() => {
//                         next(e);
//                     });
//                 });
//         } catch (e) {
//             _mysql.rollBackTransaction(() => {
//                 next(e);
//             });
//         }
//     },

//     getVendorQuotation: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT * from  hims_f_procurement_vendor_quotation_header where vendor_quotation_number=?",
//                     values: [req.query.vendor_quotation_number],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     if (headerResult.length != 0) {
//                         _mysql
//                             .executeQuery({
//                                 query:
//                                     "select * from hims_f_procurement_vendor_quotation_detail vendor_quotation_header_id=?",
//                                 values: [headerResult[0].hims_f_procurement_vendor_quotation_header_id],
//                                 printQuery: true
//                             })
//                             .then(po_entry_detail => {
//                                 _mysql.releaseConnection();
//                                 req.records = {
//                                     ...headerResult[0],
//                                     ...{ po_entry_detail }
//                                 };
//                                 next();
//                             })
//                             .catch(error => {
//                                 _mysql.releaseConnection();
//                                 next(error);
//                             });
//                     } else {
//                         _mysql.releaseConnection();
//                         req.records = headerResult;
//                         next();
//                     }
//                 })
//                 .catch(error => {
//                     _mysql.releaseConnection();
//                     next(error);
//                 });
//         } catch (e) {
//             _mysql.releaseConnection();
//             next(e);
//         }
//     },
// };
