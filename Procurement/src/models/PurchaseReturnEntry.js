import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";

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
            "SELECT *, sub_total as receipt_net_total, net_payable as receipt_net_payable, net_payable as return_total, \
            total_tax as tax_amount \
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
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["PO_RETURN_NUM"],
          table_name: "hims_f_procurement_numgen"
        })
        .then(generatedNumbers => {
          purchase_return_number = generatedNumbers.PO_RETURN_NUM;

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
            inputParam.hims_f_procurement_return_po_header_id
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

          for (let i = 0; i < inputParam.po_return_entry_detail.length; i++) {

            StrQuery += mysql.format(
              "UPDATE `hims_f_procurement_po_return_detail` SET return_qty=? where hims_f_procurement_po_return_detail_id=?;",
              [
                inputParam.po_return_entry_detail[i].return_qty,
                inputParam.po_return_entry_detail[i].hims_f_procurement_po_return_detail_id
              ]
            );
          }
          _mysql
            .executeQuery({
              query: StrQuery,
              printQuery: true
            })
            .then(detailResult => {
              // _mysql.releaseConnection();
              // req.records = headerResult;
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
  },
  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
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
                  "select head_id, child_id from finance_accounts_maping where account in ('INPUT_TAX');\
                  select hims_d_sub_department_id from hims_d_sub_department where department_type='I';\
                  select hims_d_sub_department_id from hims_d_sub_department where department_type='PH';\
                  select cost_center_type, cost_center_required from finance_options limit 1;"
              })
              .then(result => {
                const input_tax_acc = result[0][0]
                let sub_department_id = null
                let strQuery = ""

                if (inputParam.po_return_from === "PHR") {
                  strQuery = "select RH.hims_f_procurement_return_po_header_id, RH.purchase_return_number, GH.grn_number, \
                  GH.inovice_number, RH.net_total, RH.tax_amount,RH.return_total, PL.head_id, PL.child_id, PL.hospital_id,V.head_id as v_head_id, \
                  V.child_id as v_child_id\
                  from hims_f_procurement_po_return_header RH \
                  inner join hims_f_procurement_grn_header GH on GH.hims_f_procurement_grn_header_id = RH.grn_header_id \
                  inner join hims_d_pharmacy_location PL on PL.hims_d_pharmacy_location_id = RH.pharmcy_location_id\
                  inner join hims_d_vendor V on V.hims_d_vendor_id = RH.vendor_id \
                  where hims_f_procurement_return_po_header_id=?;"
                  sub_department_id = result[2].length > 0 ? result[2][0].hims_d_sub_department_id : null
                } else {
                  strQuery = "select RH.hims_f_procurement_return_po_header_id, RH.purchase_return_number, GH.grn_number, \
                  RH.net_total, RH.tax_amount,RH.return_total, PL.head_id, PL.child_id,PL.hospital_id, V.head_id as v_head_id, \
                  V.child_id as v_child_id\
                  from hims_f_procurement_po_return_header RH \
                  inner join hims_f_procurement_grn_header GH on GH.hims_f_procurement_grn_header_id = RH.grn_header_id \
                  inner join hims_d_inventory_location PL on PL.hims_d_inventory_location_id = GH.inventory_location_id\
                  inner join hims_d_vendor V on V.hims_d_vendor_id = RH.vendor_id \
                  where hims_f_procurement_return_po_header_id=?;"
                  sub_department_id = result[1].length > 0 ? result[1][0].hims_d_sub_department_id : null
                }

                if (result[3][0].cost_center_required === "Y" && result[3][0].cost_center_type === "P") {
                  strQuery += `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`
                }
                _mysql
                  .executeQuery({
                    query: strQuery,
                    values: [inputParam.hims_f_procurement_return_po_header_id],
                    printQuery: true
                  })
                  .then(header_result => {
                    let project_id = null;
                    const headerResult = header_result[0]
                    if (header_result[1].length > 0) {
                      project_id = header_result[1][0].project_id
                    }

                    _mysql
                      .executeQuery({
                        query: "INSERT INTO finance_day_end_header (transaction_date, amount, voucher_type, document_id,\
                        document_number, from_screen, narration, cancel_transaction, invoice_no, entered_date, entered_by) \
                        VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          headerResult[0].return_total,
                          "debit_note",
                          headerResult[0].hims_f_procurement_return_po_header_id,
                          headerResult[0].purchase_return_number,
                          inputParam.ScreenCode,
                          headerResult[0].grn_number,
                          "Y",
                          headerResult[0].inovice_number,
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
                          "hospital_id"
                        ];

                        //Vendor Entry
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: headerResult[0].v_head_id,
                          child_id: headerResult[0].v_child_id,
                          debit_amount: headerResult[0].return_total,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id
                        });

                        //Tax Entry
                        if (parseFloat(headerResult[0].tax_amount) > 0) {
                          insertSubDetail.push({
                            payment_date: new Date(),
                            head_id: input_tax_acc.head_id,
                            child_id: input_tax_acc.child_id,
                            debit_amount: 0,
                            payment_type: "CR",
                            credit_amount: headerResult[0].tax_amount,
                            hospital_id: req.userIdentity.hospital_id
                          });
                        }

                        //Location Level Entry
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: headerResult[0].head_id,
                          child_id: headerResult[0].child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount: headerResult[0].net_total,
                          hospital_id: headerResult[0].hospital_id
                        });

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
                              month: month,
                              project_id: project_id,
                              sub_department_id: sub_department_id
                            },
                            printQuery: false
                          })
                          .then(subResult => {
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            // req.records = subResult;
                            next();
                            // });
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
};
