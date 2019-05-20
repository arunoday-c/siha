import algaehMysql from "algaeh-mysql";
import moment from "moment";
import algaehPath from "algaeh-module-bridge";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import _ from "lodash";

const { getBillDetailsFunction } = algaehPath(
  "algaeh-billing/src/models/billing"
);
module.exports = {
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
            "SELECT hims_f_pharmacy_pos_header_id,receipt_header_id,PH.pos_number,PH.patient_id,P.patient_code,P.full_name as full_name,PH.visit_id,V.visit_code,PH.ip_id,PH.pos_date,PH.year,\
          PH.period,PH.location_id,L.location_description,PH.location_type,PH.sub_total,PH.discount_percentage,PH.discount_amount,PH.net_total,\
          PH.copay_amount,PH.patient_responsibility,PH.patient_tax,PH.patient_payable,PH.company_responsibility,PH.company_tax,\
          PH.company_payable,PH.comments,PH.sec_company_responsibility,PH.sec_company_tax,PH.sec_company_payable,\
          PH.sec_copay_amount,PH.net_tax,PH.gross_total,PH.sheet_discount_amount,PH.sheet_discount_percentage,\
          PH.net_amount,PH.credit_amount,PH.balance_credit,PH.receiveable_amount,PH.posted,PH.card_number,PH.effective_start_date,\
          PH.effective_end_date,PH.insurance_provider_id,PH.sub_insurance_provider_id,PH.network_id,PH.network_type,\
          PH.network_office_id,PH.policy_number,PH.secondary_card_number,PH.secondary_effective_start_date,\
          PH.secondary_effective_end_date,PH.secondary_insurance_provider_id,PH.secondary_network_id,PH.secondary_network_type,\
          PH.secondary_sub_insurance_provider_id,PH.secondary_network_office_id from  hims_f_pharmacy_pos_header PH inner join hims_d_pharmacy_location L\
           on PH.location_id=L.hims_d_pharmacy_location_id left outer join hims_f_patient_visit V on\
           PH.visit_id=V.hims_f_patient_visit_id left outer join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
          where PH.record_status='A' and L.record_status='A' " +
            _strAppend,
          values: intValue,
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pharmacy_pos_detail where pharmacy_pos_header_id=? and record_status='A'",
                values: [headerResult[0].hims_f_pharmacy_pos_header_id],
                printQuery: true
              })
              .then(pharmacy_stock_detail => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail },
                  ...{
                    hims_f_receipt_header_id: headerResult[0].receipt_header_id
                  }
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

  addPosEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let input = { ...req.body };
      let pos_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addPosEntry: ");

      _mysql
        .generateRunningNumber({
          modules: ["POS_NUM"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          pos_number = generatedNumbers[0];

          let year = moment().format("YYYY");

          let today = moment().format("YYYY-MM-DD");

          let month = moment().format("MM");

          let period = month;
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_pharmacy_pos_header` (pos_number,pos_date,patient_id,visit_id,ip_id,`year`,period,\
                location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
                patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
                sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
                sheet_discount_percentage,net_amount,credit_amount,balance_credit,receiveable_amount, card_number,effective_start_date,effective_end_date,\
                insurance_provider_id, sub_insurance_provider_id, network_id, network_type, network_office_id, policy_number, \
                secondary_card_number, secondary_effective_start_date, secondary_effective_end_date, secondary_insurance_provider_id,\
                secondary_network_id, secondary_network_type, secondary_sub_insurance_provider_id, secondary_network_office_id, \
                posted,receipt_header_id, pos_customer_type,patient_name,referal_doctor,mobile_number,created_date,created_by,updated_date,updated_by) \
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                input.posted,
                req.records.receipt_header_id,
                input.pos_customer_type,
                input.patient_name,
                input.referal_doctor,
                input.mobile_number,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              req.body.transaction_id = headerResult.insertId;
              req.body.year = year;
              req.body.period = period;
              utilities.logger().log("headerResult: ", headerResult.insertId);
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

              utilities
                .logger()
                .log("pharmacy_stock_detail: ", input.pharmacy_stock_detail);

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
                  utilities.logger().log("detailResult: ", detailResult);
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();
                  req.records = {
                    pos_number: pos_number,
                    hims_f_pharmacy_pos_header_id: headerResult.insertId,
                    receipt_number: req.records.receipt_number,
                    year: year,
                    period: period
                  };
                  next();
                  //   });
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
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      req.body.hims_f_pharmacy_pos_header_id =
        req.records.hims_f_pharmacy_pos_header_id;
      req.body.transaction_id = req.records.hims_f_pharmacy_pos_header_id;
      req.body.year = req.records.year;
      req.body.period = req.records.period;

      let inputParam = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_pharmacy_pos_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmacy_pos_header_id`=?",
          values: [
            inputParam.posted,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_pharmacy_pos_header_id
          ],
          printQuery: true
        })
        .then(headerResult => {
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
              itmloc.grnno, itmloc.sales_uom, itmloc.barcode, item.item_description \
                from hims_m_item_location as itmloc inner join hims_d_item_master as item on itmloc.item_id = item.hims_d_item_master_id  \
                where item_id in (?) and pharmacy_location_id in (?) and qtyhand > 0 and expirydt > CURDATE() order by expirydt",
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

                    item_category_id: ItemcatrgoryGroup.item_category_id,
                    item_group_id: ItemcatrgoryGroup.item_group_id
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
              itmloc.grnno, itmloc.sales_uom, itmloc.barcode, item.item_description, item.service_id,\
              item.category_id,item.group_id \
              from hims_m_item_location as itmloc \
              inner join hims_d_item_master as item on itmloc.item_id = item.hims_d_item_master_id  \
              where item_id in (?) and pharmacy_location_id in (?) and qtyhand > 0 and expirydt > CURDATE() order by expirydt",
          values: [item_ids, location_ids],
          printQuery: true
        })
        .then(result => {
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
                  item_id: s.item_id,
                  service_id: s.service_id,
                  item_category: s.category_id,
                  item_group_id: s.group_id,
                  uom_id: s.sales_uom,
                  quantity: 0,
                  qtyhand: 0,
                  expiry_date: null,
                  insured: item_details.insured,
                  pre_approval: item_details.pre_approval
                };
              })
              .FirstOrDefault();

            let batches = new LINQ(result)
              .Where(w => w.item_id == item_grp[i])
              .Select(s => {
                return {
                  item_id: s.item_id,
                  pharmacy_location_id: s.pharmacy_location_id,
                  batchno: s.batchno,
                  expiry_date: s.expirydt,
                  barcode: s.barcode,
                  qtyhand: s.qtyhand,
                  grnno: s.grnno
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
  }
};
