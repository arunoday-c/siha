import algaehMysql from "algaeh-mysql";
import moment from "moment";
import billModels from "algaeh-billing/src/models/billing";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import _ from "lodash";
import mysql from "mysql";

const { getBillDetailsFunction } = billModels;
export default {
  getPosEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let intValue = [];
      let _strAppend = "";
      if (req.query.pos_number != null) {
        _strAppend = "and pos_number=?";
        intValue.push(req.query.pos_number);
      }
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_pharmacy_pos_header_id,receipt_header_id,PH.pos_number,PH.patient_id,P.patient_code,\
            P.full_name as full_name,PH.visit_id,V.visit_code,PH.ip_id,PH.pos_date,PH.year,\
            PH.period,PH.location_id,L.location_description, PH.location_type,PH.sub_total, PH.discount_percentage,\
            PH.discount_amount,PH.net_total,CASE  pos_customer_type WHEN 'OP' THEN P.nationality_id \
            ELSE PH.nationality_id END as nationality_id,PH.patient_name,PH.mobile_number,PH.referal_doctor,\
            PH.copay_amount,PH.patient_responsibility,PH.patient_tax,PH.patient_payable,PH.company_responsibility,\
            PH.company_tax,PH.company_payable,PH.comments,PH.sec_company_responsibility,PH.sec_company_tax,\
            PH.sec_company_payable,PH.sec_copay_amount,PH.net_tax,PH.gross_total,PH.sheet_discount_amount,\
            PH.sheet_discount_percentage,PH.net_amount,PH.credit_amount,PH.balance_credit,PH.receiveable_amount,\
            PH.posted,PH.cancelled,PH.insurance_yesno,PH.card_number,PH.effective_start_date,PH.effective_end_date,\
            PH.insurance_provider_id, INS.insurance_provider_name, \
            ISB.insurance_sub_name as sub_insurance_provider_name,\
            PH.sub_insurance_provider_id,PH.network_id,PH.network_type,PH.network_office_id,PH.policy_number,\
            PH.secondary_card_number,PH.secondary_effective_start_date,PH.secondary_effective_end_date,\
            PH.secondary_insurance_provider_id,PH.secondary_network_id,PH.secondary_network_type,\
            PH.secondary_sub_insurance_provider_id,PH.secondary_network_office_id, \
            PH.advance_amount, PH.advance_adjust from  hims_f_pharmacy_pos_header PH \
            inner join hims_d_pharmacy_location L on PH.location_id=L.hims_d_pharmacy_location_id \
            left outer join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id \
            left outer join hims_f_patient P on PH.patient_id=P.hims_d_patient_id \
            left outer join hims_d_insurance_provider INS on PH.insurance_provider_id=INS.hims_d_insurance_provider_id \
            left outer join hims_d_insurance_sub ISB on PH.sub_insurance_provider_id = ISB.hims_d_insurance_sub_id \
            where PH.record_status='A' and L.record_status='A' " +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let strQuery = "";
            if (req.query.from_screen == "Sales_Return") {
              strQuery += mysql.format(
                "select * from (select D.*,(COALESCE(quantity,0)-COALESCE(return_quantity,0)) \
                  as re_quantity,extended_cost as gross_amount,net_extended_cost as net_amout ,\
                  patient_responsibility as patient_resp, IU.conversion_factor from hims_f_pharmacy_pos_detail D \
                  inner join hims_m_item_location IL on IL.item_id = D.item_id \
                  inner join hims_m_item_uom IU on IU.item_master_id = D.item_id and IU.uom_id = D.uom_id and IU.record_status = 'A'\
                  where IL.batchno = D.batchno and IL.pharmacy_location_id=? and pharmacy_pos_header_id=?) \
                  as A where re_quantity>0;",
                [
                  headerResult[0].location_id,
                  headerResult[0].hims_f_pharmacy_pos_header_id
                ]
              );
            } else {
              strQuery += mysql.format(
                "select *,extended_cost as gross_amount,net_extended_cost as net_amout ,\
                  patient_responsibility as patient_resp, IU.conversion_factor from hims_f_pharmacy_pos_detail D \
                  inner join hims_m_item_uom IU on IU.item_master_id = D.item_id and IU.uom_id = D.uom_id and IU.record_status = 'A'\
                  where pharmacy_pos_header_id=?",
                [headerResult[0].hims_f_pharmacy_pos_header_id]
              );
            }
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                const utilities = new algaehUtilities();
                utilities.logger().log("headerResult[0]", headerResult[0]);
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail },
                  ...{
                    hims_f_receipt_header_id: headerResult[0].receipt_header_id
                  }
                };
                // utilities.logger().log("req.records: ", req.records);
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

  addPosEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let input = { ...req.body };
      let pos_number = "";

      // const utilities = new algaehUtilities();
      // utilities.logger().log("addPosEntry: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["POS_NUM"],
          table_name: "hims_f_pharmacy_numgen"
        })
        .then(generatedNumbers => {
          pos_number = generatedNumbers.POS_NUM;

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;

          let receipt_header_id =
            req.records === undefined
              ? input.receipt_header_id
              : req.records.receipt_header_id;
          // utilities.logger().log("receipt_header_id: ", receipt_header_id);
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharmacy_pos_header` (pos_number,pos_date,patient_id,visit_id,ip_id,`year`,period,\
                location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
                patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
                sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
                sheet_discount_percentage,advance_amount, advance_adjust, net_amount,credit_amount,balance_credit,receiveable_amount, card_number,effective_start_date,effective_end_date,\
                insurance_provider_id, sub_insurance_provider_id, network_id, network_type, network_office_id, policy_number, \
                secondary_card_number, secondary_effective_start_date, secondary_effective_end_date, secondary_insurance_provider_id,\
                secondary_network_id, secondary_network_type, secondary_sub_insurance_provider_id, secondary_network_office_id, \
                 pos_customer_type,patient_name,referal_doctor,mobile_number,nationality_id,receipt_header_id,posted,\
                 insurance_yesno,s_patient_tax,created_date,\
                 created_by,updated_date,updated_by,hospital_id) \
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                pos_number,
                today,
                input.patient_id,
                input.visit_id,
                input.ip_id,
                year,
                period,
                input.location_id,
                input.location_type,
                input.sub_total,
                input.discount_percentage,
                input.discount_amount,
                input.net_total,
                input.copay_amount,
                input.patient_responsibility,
                input.patient_tax,
                input.patient_payable,
                input.company_responsibility,
                input.company_tax,
                input.company_payable,
                input.comments,
                input.sec_company_responsibility,
                input.sec_company_tax,
                input.sec_company_payable,
                input.sec_copay_amount,
                input.net_tax,
                input.gross_total,
                input.sheet_discount_amount,
                input.sheet_discount_percentage,
                input.advance_amount,
                input.advance_adjust,
                input.net_amount,
                input.credit_amount,
                input.balance_credit,
                input.receiveable_amount,
                input.card_number,
                input.effective_start_date,
                input.effective_end_date,
                input.insurance_provider_id,
                input.sub_insurance_provider_id,
                input.network_id,
                input.network_type,
                input.network_office_id,
                input.policy_number,
                input.secondary_card_number,
                input.secondary_effective_start_date,
                input.secondary_effective_end_date,
                input.secondary_insurance_provider_id,
                input.secondary_network_id,
                input.secondary_network_type,
                input.secondary_sub_insurance_provider_id,
                input.secondary_network_office_id,
                input.pos_customer_type,
                input.patient_name,
                input.referal_doctor,
                input.mobile_number,
                input.nationality_id,
                receipt_header_id,
                input.posted,
                input.insurance_yesno,
                input.s_patient_tax,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              req.body.transaction_id = headerResult.insertId;
              req.body.hims_f_pharmacy_pos_header_id = headerResult.insertId;
              req.body.pos_number = pos_number

              req.body.year = year;
              req.body.period = period;
              // utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "item_id",
                "item_category",
                "item_group_id",
                "service_id",
                "grn_no",
                "barcode",
                "qtyhand",
                "expiry_date",
                "batchno",
                "uom_id",
                "quantity",
                "insurance_yesno",
                "tax_inclusive",
                "unit_cost",
                "extended_cost",
                "discount_percentage",
                "discount_amount",
                "net_extended_cost",
                "copay_percent",
                "copay_amount",
                "patient_responsibility",
                "patient_tax",
                "s_patient_tax",
                "patient_payable",
                "company_responsibility",
                "company_tax",
                "company_payable",
                "sec_copay_percent",
                "sec_copay_amount",
                "sec_company_responsibility",
                "sec_company_tax",
                "sec_company_payable",
                "prescribed_qty",
                "prescription_detail_id",
                "pre_approval",
                "average_cost"
              ];

              // utilities
              //   .logger()
              //   .log("pharmacy_stock_detail: ", input.pharmacy_stock_detail);

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_pharmacy_pos_detail(??) VALUES ?",
                  values: input.pharmacy_stock_detail,
                  includeValues: IncludeValues,
                  extraValues: {
                    pharmacy_pos_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  // utilities.logger().log("detailResult: ", detailResult);
                  if (req.connection == null) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        pos_number: pos_number,
                        hims_f_pharmacy_pos_header_id: headerResult.insertId,
                        // receipt_number: req.records.receipt_number,
                        year: year,
                        period: period
                      };
                      next();
                    });
                  } else {
                    req.records = {
                      pos_number: pos_number,
                      hims_f_pharmacy_pos_header_id: headerResult.insertId,
                      year: year,
                      period: period
                    };
                    next();
                  }
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

  updatePosEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updatePosEntry: ");
      // console.log("req.connection: ", req.connection);

      let inputParam = { ...req.body };

      let receipt_header_id =
        req.records === undefined
          ? inputParam.receipt_header_id
          : req.records.receipt_header_id;

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharmacy_pos_header` SET sub_total=?, discount_percentage=?, discount_amount=?,\
            net_total=?, copay_amount=?, patient_responsibility=?,patient_tax=?, patient_payable=?,\
            company_responsibility=?, company_tax=?, company_payable=?, net_tax=?, gross_total=?,\
            sheet_discount_amount=?, sheet_discount_percentage=?, advance_amount=?, advance_adjust=?, \
            net_amount=?, credit_amount=?, balance_credit=?, receiveable_amount=?,`posted`=?, \
            `receipt_header_id`=?,`updated_by`=?, `updated_date`=? WHERE `hims_f_pharmacy_pos_header_id`=?",
          values: [
            inputParam.sub_total,
            inputParam.discount_percentage,
            inputParam.discount_amount,
            inputParam.net_total,
            inputParam.copay_amount,
            inputParam.patient_responsibility,
            inputParam.patient_tax,
            inputParam.patient_payable,
            inputParam.company_responsibility,
            inputParam.company_tax,
            inputParam.company_payable,
            inputParam.net_tax,
            inputParam.gross_total,
            inputParam.sheet_discount_amount,
            inputParam.sheet_discount_percentage,
            inputParam.advance_amount,
            inputParam.advance_adjust,
            inputParam.net_amount,
            inputParam.credit_amount,
            inputParam.balance_credit,
            inputParam.receiveable_amount,
            inputParam.posted,
            receipt_header_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_pharmacy_pos_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          let DeleteQry = "";

          utilities
            .logger()
            .log(
              "delete_pharmacy_stock: ",
              inputParam.delete_pharmacy_stock.length
            );
          if (inputParam.delete_pharmacy_stock.length > 0) {
            for (let i = 0; i < inputParam.delete_pharmacy_stock.length; i++) {
              DeleteQry += mysql.format(
                "DELETE from `hims_f_pharmacy_pos_detail`  where hims_f_pharmacy_pos_detail_id=?;",
                [
                  inputParam.delete_pharmacy_stock[i]
                    .hims_f_pharmacy_pos_detail_id
                ]
              );
            }
          } else {
            DeleteQry = "select 1";
          }
          utilities.logger().log("DeleteQry: ", DeleteQry);

          _mysql
            .executeQuery({
              query: DeleteQry,
              printQuery: true
            })
            .then(deleteResult => {
              let UpdateQry = "";

              for (
                let j = 0;
                j < inputParam.pharmacy_stock_detail.length;
                j++
              ) {
                if (
                  inputParam.pharmacy_stock_detail[j]
                    .hims_f_pharmacy_pos_detail_id !== null
                ) {
                  UpdateQry += mysql.format(
                    "UPDATE `hims_f_pharmacy_pos_detail` SET quantity=?, unit_cost=?, extended_cost=?,\
                    discount_percentage=?, discount_amount=?, net_extended_cost=?, copay_amount=?,\
                    patient_responsibility=?, patient_tax=?, patient_payable=?, company_responsibility=?, company_tax=?, company_payable=? where hims_f_pharmacy_pos_detail_id=?;",
                    [
                      inputParam.pharmacy_stock_detail[j].quantity,
                      inputParam.pharmacy_stock_detail[j].unit_cost,
                      inputParam.pharmacy_stock_detail[j].extended_cost,
                      inputParam.pharmacy_stock_detail[j].discount_percentage,
                      inputParam.pharmacy_stock_detail[j].discount_amount,
                      inputParam.pharmacy_stock_detail[j].net_extended_cost,
                      inputParam.pharmacy_stock_detail[j].copay_amount,
                      inputParam.pharmacy_stock_detail[j]
                        .patient_responsibility,
                      inputParam.pharmacy_stock_detail[j].patient_tax,
                      inputParam.pharmacy_stock_detail[j].patient_payable,
                      inputParam.pharmacy_stock_detail[j]
                        .company_responsibility,
                      inputParam.pharmacy_stock_detail[j].company_tax,
                      inputParam.pharmacy_stock_detail[j].company_payable,
                      inputParam.pharmacy_stock_detail[j]
                        .hims_f_pharmacy_pos_detail_id
                    ]
                  );
                }
              }

              utilities.logger().log("UpdateQry: ", UpdateQry);

              _mysql
                .executeQuery({
                  query: UpdateQry,
                  printQuery: true
                })
                .then(result => {
                  utilities
                    .logger()
                    .log(
                      "insert_pharmacy_stock: ",
                      inputParam.insert_pharmacy_stock.length
                    );

                  if (inputParam.insert_pharmacy_stock.length > 0) {
                    let IncludeValues = [
                      "item_id",
                      "item_category",
                      "item_group_id",
                      "service_id",
                      "grn_no",
                      "barcode",
                      "qtyhand",
                      "expiry_date",
                      "batchno",
                      "uom_id",
                      "quantity",
                      "insurance_yesno",
                      "tax_inclusive",
                      "unit_cost",
                      "extended_cost",
                      "discount_percentage",
                      "discount_amount",
                      "net_extended_cost",
                      "copay_percent",
                      "copay_amount",
                      "patient_responsibility",
                      "patient_tax",
                      "patient_payable",
                      "company_responsibility",
                      "company_tax",
                      "company_payable",
                      "sec_copay_percent",
                      "sec_copay_amount",
                      "sec_company_responsibility",
                      "sec_company_tax",
                      "sec_company_payable"
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_pharmacy_pos_detail(??) VALUES ?",
                        values: inputParam.insert_pharmacy_stock,
                        includeValues: IncludeValues,
                        extraValues: {
                          pharmacy_pos_header_id:
                            inputParam.hims_f_pharmacy_pos_header_id
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(detailResult => {
                        utilities
                          .logger()
                          .log("req.connection: ", req.connection);
                        if (req.connection == null) {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = { pos_number: inputParam.pos_number };
                            next();
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
                  } else {
                    utilities.logger().log("Check: ");

                    if (req.connection == null) {
                      utilities.logger().log("connection: ");
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = { pos_number: inputParam.pos_number };
                        next();
                      });
                    } else {
                      utilities.logger().log("connection else: ");
                      next();
                    }
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
  getPrescriptionPOSBackUp: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getPrescriptionPOS: ");

      const _reqBody = req.body;
      const item_ids = new LINQ(_reqBody)
        .Select(s => {
          return s.item_id;
        })
        .ToArray();
      const location_ids = new LINQ(_reqBody)
        .Select(s => {
          return s.pharmacy_location_id;
        })
        .ToArray();
      let _message = "";
      return new Promise((resolve, reject) => {
        _mysql
          .executeQuery({
            query:
              "select itmloc.item_id, itmloc.pharmacy_location_id, itmloc.batchno, itmloc.expirydt, itmloc.qtyhand, \
                itmloc.grnno, itmloc.sales_uom, itmloc.barcode, item.item_description, itmloc.sale_price,   \
                itmloc.avgcost from hims_m_item_location as itmloc inner join hims_d_item_master as item on itmloc.item_id = item.hims_d_item_master_id  \
                where item_id in (?) and pharmacy_location_id in (?) and qtyhand > 0 and (expirydt > CURDATE()|| exp_date_required='N')  order by expirydt",
            values: [item_ids, location_ids],
            printQuery: true
          })
          .then(result => {
            let _req = new LINQ(result)
              .Select(s => {
                const ItemcatrgoryGroup = new LINQ(_reqBody)
                  .Where(
                    w =>
                      w.item_id == s.item_id &&
                      w.pharmacy_location_id == s.pharmacy_location_id
                  )
                  .FirstOrDefault();

                return {
                  ...new LINQ(_reqBody)
                    .Where(
                      w =>
                        w.item_id == s.item_id &&
                        w.pharmacy_location_id == s.pharmacy_location_id
                    )
                    .FirstOrDefault(),
                  ...{
                    batchno: s.batchno,
                    expirydt: s.expirydt,
                    grnno: s.grnno,
                    sales_uom: s.sales_uom,
                    qtyhand: s.qtyhand,
                    sale_price: s.sale_price,

                    item_category_id: ItemcatrgoryGroup.item_category_id,
                    item_group_id: ItemcatrgoryGroup.item_group_id,
                    prescribed_qty: ItemcatrgoryGroup.dispense
                  }
                };
              })
              .ToArray();

            req.body = _req;

            for (let i = 0; i < _reqBody.length; i++) {
              const _mess = new LINQ(result)
                .Where(w => w.item_id !== _reqBody[i].item_id)
                .FirstOrDefault();

              utilities.logger().log("_mess: ", _mess);
              if (_mess == undefined || _mess.item_id == undefined) {
                _message =
                  "Some Items not avilable in selected location, Please check Prescription and stock enquiry for more details.";
              }
            }
            resolve(result);
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
            reject(error);
          });
      })
        .then(result => {
          if (result.length > 0) {
            return new Promise((resolve, reject) => {
              try {
                getBillDetailsFunction(req, res, next, resolve);
              } catch (e) {
                reject(e);
              }
            }).then(resultbilling => {
              const _result =
                result != null && result.length > 0 ? result[0] : {};

              _result.message = _message;

              utilities.logger().log("resultbilling: ", resultbilling);
              utilities.logger().log("result: ", result);

              let obj = {
                result: [
                  {
                    ...resultbilling,
                    ..._result
                  }
                ]
              };

              utilities.logger().log("obj: ", obj);
              req.records = obj;
              _mysql.releaseConnection();
              next();
            });
          } else {
            const message =
              "Items not avilable in selected location, for this Prescription Please check Prescription List or stock enquiry for more details.";
            let obj = {
              result: result,
              message: message
            };

            req.records = obj;
            _mysql.releaseConnection();
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

  getPrescriptionPOS: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getPrescriptionPOS: ");

      const _reqBody = req.body;
      const item_ids = new LINQ(_reqBody)
        .Select(s => {
          return s.item_id;
        })
        .ToArray();
      const location_ids = new LINQ(_reqBody)
        .Select(s => {
          return s.pharmacy_location_id;
        })
        .ToArray();
      let _message = "";

      _mysql
        .executeQuery({
          query:
            "select itmloc.item_id, itmloc.pharmacy_location_id, itmloc.batchno, itmloc.expirydt, itmloc.qtyhand, \
              itmloc.grnno, itmloc.sales_uom, itmloc.barcode, itmloc.sale_price, itmloc.avgcost,\
              item.item_description, item.service_id,item.category_id,item.group_id, ITMUOM.conversion_factor \
              from hims_m_item_location as itmloc \
              inner join hims_d_item_master as item on itmloc.item_id = item.hims_d_item_master_id \
              left join hims_m_item_uom as ITMUOM  on ITMUOM.item_master_id=item.hims_d_item_master_id \
              and ITMUOM.uom_id = itmloc.sales_uom and ITMUOM.record_status = 'A' \
              where item_id in (?) and pharmacy_location_id in (?) and qtyhand > 0 and date(expirydt) > CURDATE() order by date(expirydt)",
          values: [item_ids, location_ids],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          var item_grp = _(result)
            .groupBy("item_id")
            .map((row, item_id) => item_id)
            .value();

          let outputArray = [];
          utilities.logger().log("item_grp: ", item_grp);

          for (let i = 0; i < item_grp.length; i++) {
            // utilities.logger().log("item_details: ", item_details);

            let item = new LINQ(result)
              .Where(w => w.item_id == item_grp[i])
              .Select(s => {
                let item_details = new LINQ(_reqBody)
                  .Where(w => w.item_id == s.item_id)
                  .FirstOrDefault();
                return {
                  select_item: "N",
                  item_id: s.item_id,
                  service_id: s.service_id,
                  item_category: s.category_id,
                  item_group_id: s.group_id,
                  uom_id: s.sales_uom,
                  sale_price: s.sale_price,
                  quantity: 0,
                  qtyhand: 0,
                  expiry_date: null,
                  insured: item_details.insured,
                  insurance_yesno: item_details.insured,
                  pre_approval: item_details.pre_approval,
                  prescribed_qty: item_details.dispense,
                  item_description: s.item_description,
                  prescription_detail_id: item_details.prescription_detail_id
                };
              })
              .FirstOrDefault();

            let batches = new LINQ(result)
              .Where(w => w.item_id == item_grp[i])
              .Select(s => {
                let item_details = new LINQ(_reqBody)
                  .Where(w => w.item_id == s.item_id)
                  .FirstOrDefault();
                return {
                  item_description: s.item_description,
                  item_id: s.item_id,
                  pharmacy_location_id: s.pharmacy_location_id,
                  batchno: s.batchno,
                  expiry_date: s.expirydt,
                  barcode: s.barcode,
                  qtyhand: s.qtyhand,
                  grnno: s.grnno,
                  sale_price: s.sale_price,
                  conversion_factor: s.conversion_factor,
                  average_cost: s.avgcost,
                  sales_uom: s.sales_uom,
                  quantity: 0,
                  service_id: s.service_id,
                  item_category: s.category_id,
                  item_group_id: s.group_id,
                  uom_id: s.sales_uom,

                  insured: item_details.insured,
                  insurance_yesno: item_details.insured,
                  pre_approval: item_details.pre_approval,
                  prescribed_qty: item_details.dispense,
                  prescription_detail_id: item_details.prescription_detail_id
                };
              })
              .ToArray();

            outputArray.push({ ...item, batches });
          }

          req.records = outputArray;
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
  },

  cancelPosEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updatePosEntry: ");

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_pharmacy_pos_header` SET cancelled=?, `updated_by`=?,\
            `updated_date`=? WHERE `hims_f_pharmacy_pos_header_id`=?",
          values: [
            "Y",
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_f_pharmacy_pos_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updatePOSDetailForPreApproval: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updatePosEntry: ");

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_pharmacy_pos_detail` SET `pre_approval`=?, `insurance_yesno`=?\
             WHERE `hims_f_pharmacy_pos_detail_id`=?",
          values: [
            req.body.pre_approval,
            req.body.insurance_yesno,
            req.body.hims_f_pharmacy_pos_detail_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  insertPreApprovalOutsideCustomer: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("insertPreApprovalOutsideCustomer: ");
      let pos_number = req.records.pos_number;
      _mysql
        .executeQuery({
          query:
            "SELECT H.patient_name, H.insurance_provider_id, H.sub_insurance_provider_id as sub_insurance_id,\
             H.network_id,H.network_office_id as insurance_network_office_id, H.visit_id, \
             D.hims_f_pharmacy_pos_detail_id as pharmacy_pos_detail_id, D.item_id, D.service_id,\
             D.extended_cost as gross_amt,D.net_extended_cost as net_amount,D.quantity as requested_quantity, D.quantity as approved_qty,IM.item_description as insurance_service_name \
             from hims_f_pharmacy_pos_header H, hims_f_pharmacy_pos_detail D, hims_d_item_master IM where\
             H.hims_f_pharmacy_pos_header_id=D.pharmacy_pos_header_id and\
             D.item_id=IM.hims_d_item_master_id and H.pos_number=? and D.pre_approval='Y' and D.prescription_detail_id is null ",
          values: [pos_number],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            let IncludeValues = [
              "pharmacy_pos_detail_id",
              "patient_name",
              "item_id",
              "service_id",
              "requested_quantity",
              "approved_qty",
              "insurance_service_name",
              "gross_amt",
              "net_amount",
              "insurance_provider_id",
              "sub_insurance_id",
              "network_id",
              "insurance_network_office_id",
              "visit_id"
            ];
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_medication_approval(??) VALUES ?",
                values: headerResult,
                includeValues: IncludeValues,
                extraValues: {
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_date: new Date(),
                  hospital_id: req.userIdentity.hospital_id
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                utilities.logger().log("detailResult: ", detailResult);

                _mysql.releaseConnection();
                req.preapproval = detailResult;
                next();
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.releaseConnection();
            req.preapproval = headerResult;
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


  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = req.body;
      const decimal_places = req.userIdentity.decimal_places;
      const utilities = new algaehUtilities();
      const _all_service_id = _.map(inputParam.pharmacy_stock_detail, o => {
        return o.service_id;
      });

      const _all_item_id = _.map(inputParam.pharmacy_stock_detail, o => {
        return o.item_id;
      });

      // console.log("service_id: ", _all_service_id)
      // console.log("_all_item_id: ", _all_item_id)

      _mysql
        .executeQuery({
          query: "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
          printQuery: true
        })
        .then(org_data => {
          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQuery({
                query:
                  "SELECT * FROM finance_accounts_maping; \
                  SELECT hims_d_services_id, head_id, child_id FROM hims_d_services where hims_d_services_id in (?); \
                  SELECT hims_d_item_master_id, waited_avg_cost FROM hims_d_item_master where hims_d_item_master_id in (?); \
                  SELECT location_description, head_id, child_id, hospital_id FROM hims_d_pharmacy_location \
                  where hims_d_pharmacy_location_id=?;\
                  SELECT hims_d_sub_department_id from hims_d_sub_department where department_type='PH';\
                  SELECT cost_center_type, cost_center_required from finance_options limit 1;",
                values: [_all_service_id, _all_item_id, inputParam.location_id],
                printQuery: true
              })
              .then(result => {
                const output_tax_acc = result[0].find(f => f.account === "OUTPUT_TAX")
                const cogs_acc_data = result[0].find(f => f.account === "PHAR_COGS")
                const cash_in_acc = result[0].find(f => f.account === "CIH_PH")
                const sales_discount_acc = result[0].find(f => f.account === "SALES_DISCOUNT")
                const card_settlement_acc = result[0].find(f => f.account === "CARD_SETTL")
                const pos_criedt_settl_acc = result[0].find(f => f.account === "PHAR_REC")

                const income_acc = result[1];
                const item_waited_avg_cost = result[2];
                const location_acc = result[3];

                let sub_department_id = null
                if (inputParam.pos_customer_type === "OP") {
                  sub_department_id = inputParam.sub_department_id
                } else if (inputParam.pos_customer_type === "OT") {
                  sub_department_id = result[4].length > 0 ? result[4][0].hims_d_sub_department_id : null
                }

                let strQuery = "";

                if (result[5][0].cost_center_required === "Y" && result[5][0].cost_center_type === "P") {
                  strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`
                }
                _mysql
                  .executeQuery({
                    query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                          voucher_type, document_id, document_number, from_screen, \
                          narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?);" + strQuery,
                    values: [
                      new Date(),
                      inputParam.net_amount,
                      "receipt",
                      inputParam.hims_f_pharmacy_pos_header_id,
                      inputParam.pos_number,
                      inputParam.ScreenCode,
                      "Pharmacy Sales for " + location_acc[0].location_description + "/" + inputParam.net_amount,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id
                    ],
                    printQuery: true
                  })
                  .then(header_result => {
                    let project_id = null;
                    const day_end_header = header_result[0]
                    if (header_result[1].length > 0) {
                      project_id = header_result[1][0].project_id
                    }

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

                    // Sheet Level Discount
                    if (parseFloat(inputParam.sheet_discount_amount) > 0) {
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: sales_discount_acc.head_id,
                        child_id: sales_discount_acc.child_id,
                        debit_amount: inputParam.sheet_discount_amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id
                      });
                    }

                    // Credit Amount
                    if (parseFloat(inputParam.credit_amount) > 0) {
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: pos_criedt_settl_acc.head_id,
                        child_id: pos_criedt_settl_acc.child_id,
                        debit_amount: inputParam.credit_amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id
                      });
                    }

                    //OUT PUT Tax Entry
                    if (parseFloat(inputParam.patient_tax) > 0 || parseFloat(inputParam.company_tax) > 0) {
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: output_tax_acc.head_id,
                        child_id: output_tax_acc.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: parseFloat(inputParam.patient_tax) + parseFloat(inputParam.company_tax),
                        hospital_id: req.userIdentity.hospital_id
                      });
                    }


                    for (let i = 0; i < inputParam.receiptdetails.length; i++) {
                      if (inputParam.receiptdetails[i].pay_type === "CA") {
                        //POS Cash in Hand
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: cash_in_acc.head_id,
                          child_id: cash_in_acc.child_id,
                          debit_amount: inputParam.receiptdetails[i].amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id
                        });
                      }
                      if (inputParam.receiptdetails[i].pay_type === "CD") {
                        //POS Card
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: card_settlement_acc.head_id,
                          child_id: card_settlement_acc.child_id,
                          debit_amount: inputParam.receiptdetails[i].amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id
                        });
                      }
                      if (inputParam.receiptdetails[i].pay_type === "CH") {
                        //POS Cheque To be done
                        insertSubDetail.push({
                          payment_date: new Date(),
                          head_id: cash_in_acc.head_id,
                          child_id: cash_in_acc.child_id,
                          debit_amount: inputParam.receiptdetails[i].amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id
                        });
                      }
                    }

                    for (let i = 0; i < inputParam.pharmacy_stock_detail.length; i++) {

                      // console.log("conversion_factor", inputParam.pharmacy_stock_detail[i].conversion_factor)
                      const income_head_id = income_acc.find(f =>
                        parseInt(f.hims_d_services_id) === parseInt(inputParam.pharmacy_stock_detail[i].service_id))
                      const income_child_id = income_acc.find(f =>
                        parseInt(f.hims_d_services_id) === parseInt(inputParam.pharmacy_stock_detail[i].service_id))

                      const item_avg_cost = item_waited_avg_cost.find(f =>
                        parseInt(f.hims_d_item_master_id) === parseInt(inputParam.pharmacy_stock_detail[i].item_id))

                      //Income Entry
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: income_head_id.head_id,
                        child_id: income_child_id.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: inputParam.pharmacy_stock_detail[i].net_extended_cost,
                        hospital_id: req.userIdentity.hospital_id
                      });

                      const waited_avg_cost =
                        utilities.decimalPoints(
                          (parseFloat(inputParam.pharmacy_stock_detail[i].quantity) *
                            parseFloat(inputParam.pharmacy_stock_detail[i].conversion_factor) *
                            parseFloat(item_avg_cost.waited_avg_cost)),
                          decimal_places
                        )

                      //COGS Entry
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: cogs_acc_data.head_id,
                        child_id: cogs_acc_data.child_id,
                        debit_amount: waited_avg_cost,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id
                      });

                      //Location Wise
                      insertSubDetail.push({
                        payment_date: new Date(),
                        head_id: location_acc[0].head_id,
                        child_id: location_acc[0].child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: waited_avg_cost,
                        hospital_id: location_acc[0].hospital_id
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
                          month: month,
                          project_id: project_id,
                          sub_department_id: sub_department_id
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
  },

  updatePatientAdvance: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = req.body;
      if (parseFloat(inputParam.advance_adjust) > 0) {
        _mysql
          .executeQuery({
            query:
              "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
            values: [inputParam.patient_id],
            printQuery: true
          })
          .then(result => {
            let existingAdvance = result[0].advance_amount;
            if (result.length != 0) {
              inputParam.advance_amount =
                parseFloat(existingAdvance) - parseFloat(inputParam.advance_adjust);

              _mysql
                .executeQuery({
                  query:
                    "UPDATE  `hims_f_patient` SET  `advance_amount`=?, `updated_by`=?, `updated_date`=? \
                    WHERE `hims_d_patient_id`=?",
                  values: [
                    inputParam.advance_amount,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    inputParam.patient_id
                  ],
                  printQuery: true
                }).then(patient_advance => {
                  next();
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        next()
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
