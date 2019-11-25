import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export default {
  getPurchaseReturnEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT PH.*, GRN.grn_number from  hims_f_procurement_po_return_header PH  \
            inner join hims_f_procurement_grn_header GRN on GRN.hims_f_procurement_grn_header_id=PH.grn_header_id\
            where purchase_return_number=?",
          values: [req.query.purchase_return_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let strQuery = "";


            if (headerResult[0].po_return_from == "INV") {
              strQuery = mysql.format(
                "select PD.*, IM.item_description, IM.exp_date_required, IM.sales_uom_id, IC.category_desc, IG.group_description \
                from hims_f_procurement_po_return_detail PD \
                inner join hims_d_inventory_item_master IM on PD.inv_item_id = IM.hims_d_inventory_item_master_id \
                inner join hims_d_inventory_tem_category IC on PD.inv_item_category_id = IC.hims_d_inventory_tem_category_id \
                inner join hims_d_inventory_item_group IG on PD.inv_item_group_id = IG.hims_d_inventory_item_group_id \
                where po_return_header_id=?;",
                [headerResult[0].hims_f_procurement_return_po_header_id]
              );
            } else if (headerResult[0].po_return_from == "PHR") {
              strQuery = mysql.format(
                "select PD.*, IM.item_description, IM.exp_date_required, IM.sales_uom_id, IC.category_desc, IG.group_description \
                from hims_f_procurement_po_return_detail PD  \
                inner join hims_d_item_master IM on PD.phar_item_id = IM.hims_d_item_master_id \
                inner join hims_d_item_category IC on PD.phar_item_category = IC.hims_d_item_category_id \
                inner join hims_d_item_group IG on PD.phar_item_group = IG.hims_d_item_group_id \
                where po_return_header_id=?;",
                [headerResult[0].hims_f_procurement_return_po_header_id]
              );
            }
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true
              })
              .then(po_return_entry_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ po_return_entry_detail }
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
  getReceiptEntryItems: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, sub_total as receipt_net_total, net_payable as receipt_net_payable, net_payable as return_total \
            FROM hims_f_procurement_grn_header where hims_f_procurement_grn_header_id=?",
          values: [req.query.grn_header_id],
          printQuery: true
        })
        .then(headerResult => {
          let strQuery = "";
          if (inputParam.po_return_from == "INV") {
            strQuery = mysql.format(
              "SELECT dn_header_id, DNB.*, PIL.hims_m_inventory_item_location_id, PIL.qtyhand, PIL.expirydt, PIL.batchno, \
                PIL.vendor_batchno, IM.item_description, IM.sales_uom_id, IC.category_desc, IG.group_description, IU.conversion_factor, \
                (PIL.qtyhand / IU.conversion_factor) as return_qty from hims_f_procurement_grn_detail GD \
                inner join hims_f_procurement_dn_detail DND on DND.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DNB on DNB.hims_f_procurement_dn_detail_id = DND.hims_f_procurement_dn_detail_id \
                inner join hims_m_inventory_item_location PIL on PIL.item_id = DNB.inv_item_id and DNB.batchno = PIL.batchno \
                inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = DNB.inv_item_id \
                inner join hims_m_inventory_item_uom IU on IM.hims_d_inventory_item_master_id = IU.item_master_id and DNB.inventory_uom_id = IU.uom_id \
                inner join hims_d_inventory_tem_category IC on IC.hims_d_inventory_tem_category_id = DNB.inv_item_category_id \
                inner join hims_d_inventory_item_group IG on IG.hims_d_inventory_item_group_id = DNB.inv_item_group_id \
                where grn_header_id=? and inventory_location_id=?;",
              [inputParam.grn_header_id, inputParam.inventory_location_id]
            );
          } else if (inputParam.po_return_from == "PHR") {
            strQuery = mysql.format(
              "SELECT dn_header_id, DNB.*, PIL.hims_m_item_location_id, PIL.qtyhand, PIL.expirydt, PIL.batchno, \
                PIL.vendor_batchno, IM.item_description, IM.sales_uom_id, IC.category_desc, IG.group_description,IU.conversion_factor, \
                (PIL.qtyhand / IU.conversion_factor) as return_qty  from hims_f_procurement_grn_detail GD \
                inner join hims_f_procurement_dn_detail DND on DND.hims_f_procurement_dn_header_id = GD.dn_header_id \
                inner join hims_f_procurement_dn_batches DNB on DNB.hims_f_procurement_dn_detail_id = DND.hims_f_procurement_dn_detail_id \
                inner join hims_m_item_location PIL on PIL.item_id = DNB.phar_item_id and DNB.batchno = PIL.batchno \
                inner join hims_d_item_master IM on IM.hims_d_item_master_id = DNB.phar_item_id \
                inner join hims_m_item_uom IU on IM.hims_d_item_master_id = IU.item_master_id and DNB.pharmacy_uom_id = IU.uom_id \
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
  },


  addPurchaseReturnEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let purchase_return_number = "";
      const utilities = new algaehUtilities();
      utilities.logger().log("addPurchaseReturnEntry: ");
      _mysql
        .generateRunningNumber({
          modules: ["PO_RETURN_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          purchase_return_number = generatedNumbers[0];

          // let today = moment().format("YYYY-MM-DD");

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_procurement_po_return_header` (purchase_return_number, grn_header_id, return_date, \
                  po_return_from, pharmcy_location_id, inventory_location_id, location_type, vendor_id, payment_terms, \
                  comment, sub_total, discount_amount, net_total, tax_amount, receipt_net_total, receipt_net_payable, return_total, hospital_id) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                purchase_return_number,
                input.grn_header_id,
                new Date(),
                input.po_return_from,
                input.pharmcy_location_id,
                input.inventory_location_id,
                input.location_type,
                input.vendor_id,
                input.payment_terms,
                input.comment,
                input.sub_total,
                input.discount_amount,
                input.net_total,
                input.tax_amount,
                input.receipt_net_total,
                input.receipt_net_payable,
                input.return_total,
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
                "dn_quantity",
                "qtyhand",
                "unit_cost",
                "return_qty",
                "extended_cost",
                "discount_percentage",
                "discount_amount",
                "net_extended_cost",
                "tax_amount",
                "total_amount",
                "batchno",
                "expiry_date",
                "dn_header_id",
                "dn_detail_id",
                "vendor_batchno"
              ];



              let strGrnQry = mysql.format(
                "UPDATE hims_f_procurement_grn_header set return_done ='Y' where hims_f_procurement_grn_header_id=?",
                [input.grn_header_id]
              );

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_procurement_po_return_detail(??) VALUES ? ; " + strGrnQry,
                  values: input.po_return_entry_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    po_return_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      purchase_return_number: purchase_return_number,
                      hims_f_procurement_return_po_header_id: headerResult.insertId
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

  cancelPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("cancelPurchaseOrderEntry: ");
    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_procurement_po_return_header` SET `cancelled` = 'Y', `cancel_date`=?, `cancel_by`=? \
          WHERE `hims_f_procurement_return_po_header_id`=?; \
          UPDATE hims_f_procurement_grn_header set return_done ='N' where hims_f_procurement_grn_header_id=?",
          values: [
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_procurement_return_po_header_id,
            inputParam.grn_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
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
  },
  postPurchaseOrderEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("postPurchaseOrderEntry: ");
    try {
      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_procurement_po_return_header` SET `is_posted` = 'Y', `posted_date`=?, `posted_by`=? \
          WHERE `hims_f_procurement_return_po_header_id`=?;",
          values: [
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_procurement_return_po_header_id,
            inputParam.grn_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          // _mysql.releaseConnection();
          // req.records = headerResult;
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
  }
};
