import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  getReceiptEntryItems: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, sub_total as receipt_net_total, net_payable as return_total FROM hims_f_procurement_grn_header where hims_f_procurement_grn_header_id=?",
          values: [req.query.grn_header_id],
          printQuery: true
        })
        .then(headerResult => {
          let strQuery = "";
          if (inputParam.po_return_from == "INV") {
            strQuery = mysql.format(
              "SELECT dn_header_id, DNB.phar_item_category, DNB.phar_item_group, DNB.phar_item_id, \
                PIL.hims_m_item_location_id, PIL.qtyhand, PIL.expirydt, PIL.batchno, PIL.vendor_batchno, \
                IM.item_description, IC.category_desc, IG.group_description  from hims_f_procurement_grn_detail GD \
                inner join hims_f_procurement_dn_detail DND on DND.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DNB on DNB.hims_f_procurement_dn_detail_id = DND.hims_f_procurement_dn_detail_id \
                inner join hims_m_item_location PIL on PIL.item_id = DNB.phar_item_id and date(DNB.expiry_date) = date(PIL.expirydt) \
                inner join hims_d_item_master IM on IM.hims_d_item_master_id = DNB.phar_item_id \
                inner join hims_d_item_category IC on IC.hims_d_item_category_id = DNB.phar_item_category \
                inner join hims_d_item_group IG on IG.hims_d_item_group_id = DNB.phar_item_group \
                where grn_header_id=?;",
              [inputParam.grn_header_id]
            );
          } else if (inputParam.po_return_from == "PHR") {
            strQuery = mysql.format(
              "SELECT dn_header_id, DNB.*, PIL.hims_m_item_location_id, PIL.qtyhand, PIL.expirydt, PIL.batchno, \
                PIL.vendor_batchno, IM.item_description, IC.category_desc, IG.group_description, PIL.qtyhand as return_qty  \
                from hims_f_procurement_grn_detail GD \
                inner join hims_f_procurement_dn_detail DND on DND.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DNB on DNB.hims_f_procurement_dn_detail_id = DND.hims_f_procurement_dn_detail_id \
                inner join hims_m_item_location PIL on PIL.item_id = DNB.phar_item_id and date(DNB.expiry_date) = date(PIL.expirydt) \
                inner join hims_d_item_master IM on IM.hims_d_item_master_id = DNB.phar_item_id \
                inner join hims_d_item_category IC on IC.hims_d_item_category_id = DNB.phar_item_category \
                inner join hims_d_item_group IG on IG.hims_d_item_group_id = DNB.phar_item_group \
                where grn_header_id=? and pharmacy_location_id=?;",
              [inputParam.grn_header_id, inputParam.pharmacy_location_id]
            );
          }
          _mysql
            .executeQuery({
              query: strQuery,
              printQuery: true
            })
            .then(receipt_entry_detail => {
              let result = {};
              if (inputParam.po_return_from == "INV") {
                let inventory_stock_detail = receipt_entry_detail;
                result = {
                  ...headerResult[0],
                  ...{ inventory_stock_detail }
                };
              } else if (inputParam.po_return_from == "PHR") {
                let pharmacy_stock_detail = receipt_entry_detail;
                result = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail }
                };
              }
              _mysql.releaseConnection();
              req.records = result;
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
  }
};
