import algaehMysql from "algaeh-mysql";
// import moment from "moment";
// import { LINQ } from "node-linq";
// import algaehUtilities from "algaeh-utilities/utilities";
// import mysql from "mysql";


export function getDispatchForInvoice(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        _mysql
            .executeQuery({
                query:
                    "SELECT SQ.*, C.customer_name, H.hospital_name, \
                    P.project_desc as project_name from hims_f_sales_dispatch_note_header SQ \
                inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id \
                inner join hims_d_hospital H  on SQ.hospital_id = H.hims_d_hospital_id \
                inner join hims_d_project P  on SQ.project_id = P.hims_d_project_id \
                where SQ.sales_order_id=?",
                values: [req.query.sales_order_id],
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
// export default {

//     getDispatchForInvoice: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT * from  hims_f_sales_dispatch_note_header where is_completed = 'N' and sales_order_id=?",
//                     values: [req.query.sales_order_id],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     _mysql.releaseConnection();
//                     req.records = headerResult;
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

//     getDeliveryItemDetails: (req, res, next) => {
//         const _mysql = new algaehMysql();
//         try {
//             _mysql
//                 .executeQuery({
//                     query:
//                         "SELECT DNB.* from  hims_f_procurement_dn_detail DND, hims_f_procurement_dn_batches DNB \
//             where DND.hims_f_procurement_dn_detail_id = DNB.hims_f_procurement_dn_detail_id \
//             and hims_f_procurement_dn_header_id=?",
//                     values: [req.query.dn_header_id],
//                     printQuery: true
//                 })
//                 .then(headerResult => {
//                     _mysql.releaseConnection();
//                     req.records = headerResult;
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
//     }
// };
