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
          printQuery: true,
        })
        .then((headerResult) => {
          if (headerResult.length != 0) {
            let strQuery = "";

            console.log("strQuery: ", headerResult[0].quotation_for);

            if (headerResult[0].quotation_for === "INV") {
              strQuery = mysql.format(
                "select VQD.*, IM.item_description, IU.uom_description as purchase_uom_desc from hims_f_procurement_vendor_quotation_detail VQD, hims_d_inventory_item_master IM, hims_d_inventory_uom IU where IM.hims_d_inventory_item_master_id=VQD.inv_item_id and IU.hims_d_inventory_uom_id=VQD.inventory_uom_id and vendor_quotation_header_id=?",
                [headerResult[0].hims_f_procurement_vendor_quotation_header_id]
              );
            } else if (headerResult[0].quotation_for === "PHR") {
              strQuery = mysql.format(
                "select VQD.*, IM.item_description, IU.uom_description as purchase_uom_desc from hims_f_procurement_vendor_quotation_detail VQD,hims_d_item_master IM, hims_d_pharmacy_uom IU  where IM.hims_d_item_master_id=VQD.phar_item_id and IU.hims_d_pharmacy_uom_id=VQD.pharmacy_uom_id and vendor_quotation_header_id=?",
                [headerResult[0].hims_f_procurement_vendor_quotation_header_id]
              );
            }
            console.log("strQuery: ", strQuery);
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true,
              })
              .then((quotation_detail) => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ quotation_detail },
                };
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
          }
        })
        .catch((error) => {
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
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["VEN_QUT_NUM"],
          table_name: "hims_f_procurement_numgen",
        })
        .then((generatedNumbers) => {
          vendor_quotation_number = generatedNumbers.VEN_QUT_NUM;

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
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((headerResult) => {
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
                    vendor_quotation_header_id: headerResult.insertId,
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                })
                .then((detailResult) => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      vendor_quotation_number: vendor_quotation_number,
                      hims_f_procurement_vendor_quotation_header_id:
                        headerResult.insertId,
                    };
                    next();
                  });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
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
};
