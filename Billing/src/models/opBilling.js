import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";
import mysql from "mysql";
import moment from "moment";

export default {
  addOpBIlling: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      req.mySQl = _mysql;
      //Bill
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["PAT_BILL", "RECEIPT"],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          req.body.bill_number = generatedNumbers.PAT_BILL;
          req.body.receipt_number = generatedNumbers.RECEIPT;
          next();
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

  updateOrderedConsumablessBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("updateOrderedServicesBilled: ");

      let OrderServices = new LINQ(req.body.billdetails)
        .Where((w) => w.ordered_inventory_id != null)
        .Select((s) => {
          return {
            hims_f_ordered_inventory_id: s.ordered_inventory_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      let qry = "";
      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          // utilities.logger().log("billed: ", OrderServices[i].billed);
          // utilities.logger().log("updated_by: ", OrderServices[i].updated_by);
          // utilities
          //   .logger()
          //   .log("billed: ", OrderServices[i].hims_f_ordered_inventory_id);

          qry += mysql.format(
            "UPDATE `hims_f_ordered_inventory` SET billed=?,\
              updated_date=?,updated_by=? where hims_f_ordered_inventory_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_ordered_inventory_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((updateOrder) => {
            if (req.connection == null) {
              req.records = updateOrder;
              next();
            } else {
              next();
            }
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        // utilities.logger().log("Else: ");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateOrderedServicesBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("updateOrderedServicesBilled: ");

      // utilities.logger().log("OrderServices: ", req.body.billdetails);

      let OrderServices = new LINQ(req.body.billdetails)
        .Where((w) => w.hims_f_ordered_services_id != null)
        .Select((s) => {
          return {
            hims_f_ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      let dentalTreatment = new LINQ(req.body.billdetails)
        .Where((w) => w.d_treatment_id != null)
        .Select((s) => {
          return {
            hims_f_dental_treatment_id: s.d_treatment_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();
      // utilities.logger().log("OrderServices 1: ", OrderServices);
      let qry = "";
      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          // utilities.logger().log("billed: ", OrderServices[i].billed);
          // utilities.logger().log("updated_by: ", OrderServices[i].updated_by);
          // utilities
          //   .logger()
          //   .log("billed: ", OrderServices[i].hims_f_ordered_services_id);

          qry += mysql.format(
            "UPDATE `hims_f_ordered_services` SET billed=?,\
              updated_date=?,updated_by=? where hims_f_ordered_services_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_ordered_services_id,
            ]
          );
        }
        if (dentalTreatment.length > 0) {
          for (let i = 0; i < dentalTreatment.length; i++) {
            qry += mysql.format(
              "UPDATE `hims_f_dental_treatment` SET billed=?,\
                updated_date=?,updated_by=? where hims_f_dental_treatment_id=?;",
              [
                dentalTreatment[i].billed,
                moment().format("YYYY-MM-DD HH:mm"),
                dentalTreatment[i].updated_by,
                dentalTreatment[i].hims_f_dental_treatment_id,
              ]
            );
          }
        }

        // utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((updateOrder) => {
            if (req.connection == null) {
              req.records = updateOrder;
              next();
            } else {
              next();
            }
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        // utilities.logger().log("Else: ");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateOrderedPackageBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where((w) => w.ordered_package_id != null)
        .Select((s) => {
          return {
            hims_f_package_header_id: s.ordered_package_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      let qry = "";
      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_package_header` SET billed=?, closed=?, \
                updated_date=?,updated_by=? where hims_f_package_header_id=?;",
            [
              OrderServices[i].billed,
              OrderServices[i].package_visit_type === "S" ? "Y" : "N",
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].hims_f_package_header_id,
            ]
          );
        }
        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((updateOrder) => {
            // if (req.connection == null) {
            //   req.records = updateOrder;
            //   next();
            // } else {
            //   next();
            // }
            let package_header_id = _.map(OrderServices, (o) => {
              return o.hims_f_package_header_id;
            });
            _mysql
              .executeQuery({
                query:
                  "select D.*,service_id as services_id, now() as created_date, package_header_id as \
                  ordered_package_id, hims_d_investigation_test_id as test_id, send_out_test from hims_f_package_detail D \
                  left join hims_d_investigation_test IT on D.service_id=IT.services_id \
                  where package_header_id in (?)",
                values: [package_header_id],
                printQuery: true,
              })
              .then((package_details) => {
                const lab_data = package_details.filter(
                  (f) => f.service_type_id == "5"
                );
                const rad_data = package_details.filter(
                  (f) => f.service_type_id == "11"
                );
                console.log("lab_data", lab_data);
                if (lab_data.length > 0) {
                  req.body.LAB_Package = true;
                }
                if (rad_data.length > 0) {
                  req.body.RAD_Package = true;
                }
                // consol.log("rad_data", rad_data);

                req.body.billdetails = req.body.billdetails.concat(
                  package_details
                );

                if (req.connection == null) {
                  // console.log("1");
                  req.records = updateOrder;
                  next();
                } else {
                  // console.log("2");
                  next();
                }
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePackageAdvance: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      // console.log("req.body.pack_advance_adjust", req.body.pack_advance_adjust)
      if (req.body.pack_advance_adjust > 0) {
        const package_details = req.body.billdetails.filter(
          (f) =>
            f.ordered_package_id !== null || f.ordered_package_id !== undefined
        );

        // console.log("package_details ======> ", package_details)
        let qry = "";
        if (package_details.length > 0) {
          for (let i = 0; i < package_details.length; i++) {
            qry += mysql.format(
              "UPDATE `hims_f_package_header` SET utilized_advance=utilized_advance+(?) where hims_f_package_header_id=?;",
              [
                package_details[i].gross_amount,
                package_details[i].ordered_package_id,
              ]
            );
          }

          // console.log("qry =------ ", qry)
          // consol.log("package_details", package_details)
          _mysql
            .executeQuery({
              query: qry,
              printQuery: true,
            })
            .then((updateOrder) => {
              next();
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          next();
        }
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  selectBill: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT bh.*, PAT.*, VST.*, emp.full_name as doctor_name, bh.patient_payable as patient_payable_h, \
            VST.sub_department_id, \
            max(if(AU.algaeh_d_app_user_id=bh.created_by, EU.full_name,'' )) as created_name, \
            max(if(AU.algaeh_d_app_user_id=bh.cancel_by, EU.full_name,'' )) as cancelled_name,\
            max(if(AU.algaeh_d_app_user_id=bh.adjusted_by, EU.full_name,'' )) as adjusted_name, \
            FBH.bill_number as from_bill_number FROM hims_f_billing_header bh \
            left join hims_d_employee as emp on bh.incharge_or_provider = emp.hims_d_employee_id \
            inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id \
            inner join hims_f_patient_visit as VST on bh.visit_id = VST.hims_f_patient_visit_id \
            inner join algaeh_d_app_user AU on (bh.created_by = AU.algaeh_d_app_user_id or \
            bh.cancel_by = AU.algaeh_d_app_user_id or bh.adjusted_by = AU.algaeh_d_app_user_id) \
            inner join hims_d_employee EU on AU.employee_id = EU.hims_d_employee_id \
            left join hims_f_billing_header FBH on bh.hims_f_billing_header_id = FBH.from_bill_id \
            where bh.record_status='A' AND bh.bill_number='" +
            req.query.bill_number +
            "' GROUP BY hims_f_billing_header_id;",

          printQuery: true,
        })
        .then((headerResult) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          if (headerResult.length != 0) {
            let strQuery = "";
            if (req.query.from_cancellation == "Y") {
              strQuery = "and D.cancel_yes_no='N'";
            }

            _mysql
              .executeQuery({
                query:
                  "select D.*, S.service_name, ST.service_type from hims_f_billing_details D \
                  inner join hims_d_services S on D.services_id = S.hims_d_services_id  \
                  inner join hims_d_service_type ST on D.service_type_id = ST.hims_d_service_type_id \
                  where hims_f_billing_header_id=? and D.record_status='A'" +
                  strQuery,
                values: [headerResult[0].hims_f_billing_header_id],
                printQuery: true,
              })
              .then((billdetails) => {
                req.records = {
                  ...headerResult[0],
                  ...{ billdetails },
                  ...{
                    hims_f_receipt_header_id: headerResult[0].receipt_header_id,
                  },
                };
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            req.records = headerResult;
            _mysql.releaseConnection();
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
  getPednigBills: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      let inputValues = [];

      _stringData += " and S.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.created_date != null) {
        _stringData += " and date(S.created_date)=?";
        inputValues.push(req.query.created_date);
      }
      if (req.query.visit_id != null) {
        _stringData += " and visit_id=?";
        inputValues.push(req.query.visit_id);
      }
      if (req.query.patient_id != null) {
        _stringData += " and patient_id=? ";
        inputValues.push(req.query.patient_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT  S.patient_id, S.visit_id, S.insurance_yesno, P.patient_code,P.full_name FROM hims_f_ordered_services S,hims_f_patient P  \
          WHERE S.record_status='A' AND S.billed='N' AND P.hims_d_patient_id=S.patient_id" +
            _stringData,
          values: inputValues,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  insertPhysiotherapyServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      let Services =
        req.records.ResultOfFetchOrderIds == null
          ? req.body.billdetails
          : req.records.ResultOfFetchOrderIds;

      const physothServices = [
        ...new Set(
          new LINQ(Services)
            .Where((w) => w.physiotherapy_service == "Y")
            .Select((s) => {
              return {
                ordered_services_id: s.hims_f_ordered_services_id || null,
                patient_id: req.body.patient_id,
                referred_doctor_id: req.body.incharge_or_provider,
                visit_id: req.body.visit_id,
                billed: req.body.billed,
                ordered_date: s.created_date,
                hospital_id: req.userIdentity.hospital_id,
              };
            })
            .ToArray()
        ),
      ];

      const IncludeValues = [
        "ordered_services_id",
        "patient_id",
        "visit_id",
        "referred_doctor_id",
        "billed",
        "ordered_date",
        "hospital_id",
      ];

      if (physothServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_physiotherapy_header(??) VALUES ?",
            values: physothServices,
            includeValues: IncludeValues,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((insert_physiotherapy) => {
            next();
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePhysiotherapyServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    // utilities.logger().log("updatePhysiotherapyServices: ");
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          (w) =>
            w.hims_f_ordered_services_id != null &&
            w.physiotherapy_service == "Y"
        )
        .Select((s) => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      let qry = "";

      if (OrderServices.length > 0) {
        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_physiotherapy_header` SET billed=? where ordered_services_id=?;",
            [OrderServices[i].billed, OrderServices[i].ordered_services_id]
          );
        }

        // utilities.logger().log("qry: ", qry);

        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((rad_result) => {
            req.records = { PHYSIOTHERAPY: false };
            next();
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = { PHYSIOTHERAPY: true };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  updateOldBill: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      _mysql
        .executeQuery({
          query: `update hims_f_billing_header set adjusted=?,adjusted_by=?,
          adjusted_date=? where hims_f_billing_header_id=?`,
          values: [
            "Y",
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.from_bill_id,
          ],
          printQuery: true,
        })
        .then((adjust_done) => {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.data = adjust_done;
            next();
          });
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  generateAccountingEntryAdjustBill: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      // const utilities = new algaehUtilities();
      // console.log("req.connection", req.connection);
      // console.log("generateAccountingEntryAdjustBill");

      const inputParam = req.body;

      // console.log("inputParam", inputParam);
      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
        and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: true,
        })
        .then((product_type) => {
          if (product_type.length == 1) {
            _mysql
              .executeQuery({
                query:
                  "select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
                select BD.* from hims_f_billing_header BH \
                inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
                where BH.hims_f_billing_header_id = ?;\
                select RD.* from hims_f_billing_header BH \
                inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
                where BH.hims_f_billing_header_id=?;\
                select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
                select BD.* from hims_f_billing_header BH \
                inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
                where BH.hims_f_billing_header_id = ?;\
                select RD.* from hims_f_billing_header BH \
                inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
                where BH.hims_f_billing_header_id=?;",
                values: [
                  inputParam.from_bill_id,
                  inputParam.from_bill_id,
                  inputParam.from_bill_id,
                  inputParam.hims_f_billing_header_id,
                  inputParam.hims_f_billing_header_id,
                  inputParam.hims_f_billing_header_id,
                ],
                printQuery: true,
              })
              .then((bill_Result) => {
                const bill_header = bill_Result[0][0];
                const bill_detail = bill_Result[1];
                const receipt_details = bill_Result[2];

                const new_bill_header = bill_Result[3][0];
                const new_bill_detail = bill_Result[4];
                const new_receipt_details = bill_Result[5];

                const servicesIds = ["0"];
                if (new_bill_detail && new_bill_detail.length > 0) {
                  new_bill_detail.forEach((item) => {
                    servicesIds.push(item.services_id);
                  });
                }

                _mysql
                  .executeQuery({
                    query:
                      "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
                    account in ('OP_DEP','CIH_OP','OUTPUT_TAX','OP_REC','CARD_SETTL', 'OP_CTRL');\
                    SELECT hims_d_services_id,service_name,head_id,child_id FROM hims_d_services where hims_d_services_id in(?);\
                    select cost_center_type, cost_center_required from finance_options limit 1;",
                    values: [servicesIds],
                    printQuery: true,
                  })
                  .then((Result) => {
                    const controls = Result[0];
                    const serviceData = Result[1];
                    // const insurance_data = Result[3];

                    const OP_DEP = controls.find((f) => {
                      return f.account == "OP_DEP";
                    });

                    const CIH_OP = controls.find((f) => {
                      return f.account == "CIH_OP";
                    });
                    const OUTPUT_TAX = controls.find((f) => {
                      return f.account == "OUTPUT_TAX";
                    });
                    const OP_REC = controls.find((f) => {
                      return f.account == "OP_REC";
                    });
                    const CARD_SETTL = controls.find((f) => {
                      return f.account == "CARD_SETTL";
                    });
                    const OP_CTRL = controls.find((f) => {
                      return f.account == "OP_CTRL";
                    });

                    let voucher_type = "";
                    let narration = "";
                    let amount = 0;

                    const EntriesArray = [];

                    voucher_type = "sales";

                    amount = new_bill_header.receiveable_amount;
                    narration =
                      "Bill Adjustment Done From :" + bill_header.bill_number;

                    //BOOKING INCOME AND TAX
                    // New Bill Booking
                    //Starts Here
                    serviceData.forEach((curService) => {
                      const bill = new_bill_detail.filter((f) => {
                        if (f.services_id == curService.hims_d_services_id)
                          return f;
                      });

                      const credit_amount = _.sumBy(bill, (s) =>
                        parseFloat(s.net_amout)
                      );

                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: curService.head_id,
                        child_id: curService.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: credit_amount,
                        reverted: "N",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    });

                    //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
                    if (new_bill_header.advance_adjust > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_DEP.head_id,
                        child_id: OP_DEP.child_id,
                        debit_amount: new_bill_header.advance_adjust,
                        payment_type: "DR",
                        credit_amount: 0,
                        reverted: "N",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                    //PROVIDING OP SERVICE ON CREDIT
                    if (new_bill_header.credit_amount > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_REC.head_id,
                        child_id: OP_REC.child_id,
                        debit_amount: new_bill_header.credit_amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        reverted: "N",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    //INCREASING CASH IN CAND AND BANK
                    new_receipt_details.forEach((m) => {
                      if (m.pay_type == "CD") {
                        EntriesArray.push({
                          payment_date: new Date(),
                          head_id: CARD_SETTL.head_id,
                          child_id: CARD_SETTL.child_id,
                          debit_amount: m.amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          reverted: "N",
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      } else {
                        EntriesArray.push({
                          payment_date: new Date(),
                          head_id: CIH_OP.head_id,
                          child_id: CIH_OP.child_id,
                          debit_amount: m.amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          reverted: "N",
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                    });

                    //insurance company payable
                    if (
                      inputParam.insured == "Y" &&
                      parseFloat(new_bill_header.company_payble) > 0
                    ) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_CTRL.head_id,
                        child_id: OP_CTRL.child_id,
                        debit_amount: new_bill_header.company_payble,
                        payment_type: "DR",
                        credit_amount: 0,
                        reverted: "N",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    //TAX part

                    if (parseFloat(new_bill_header.total_tax) > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OUTPUT_TAX.head_id,
                        child_id: OUTPUT_TAX.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: new_bill_header.total_tax,
                        reverted: "N",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                    //Ends Here

                    //REVERT BOOKING INCOME AND TAX
                    //Old Bill revert
                    //Starts Here
                    serviceData.forEach((curService) => {
                      const bill = bill_detail.filter((f) => {
                        if (f.services_id == curService.hims_d_services_id)
                          return f;
                      });

                      const debeit_amount = _.sumBy(bill, (s) =>
                        parseFloat(s.net_amout)
                      );

                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: curService.head_id,
                        child_id: curService.child_id,
                        debit_amount: debeit_amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        reverted: "Y",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    });

                    //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
                    if (bill_header.advance_adjust > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_DEP.head_id,
                        child_id: OP_DEP.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: bill_header.advance_adjust,
                        reverted: "Y",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                    //PROVIDING OP SERVICE ON CREDIT
                    if (bill_header.credit_amount > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_REC.head_id,
                        child_id: OP_REC.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: bill_header.credit_amount,
                        reverted: "Y",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    //INCREASING CASH IN CAND AND BANK
                    receipt_details.forEach((m) => {
                      if (m.pay_type == "CD") {
                        EntriesArray.push({
                          payment_date: new Date(),
                          head_id: CARD_SETTL.head_id,
                          child_id: CARD_SETTL.child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount: m.amount,
                          reverted: "Y",
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      } else {
                        EntriesArray.push({
                          payment_date: new Date(),
                          head_id: CIH_OP.head_id,
                          child_id: CIH_OP.child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount: m.amount,
                          reverted: "Y",
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                    });

                    //insurance company payable
                    // console.log("insured", inputParam.insured);
                    // console.log("company_payble", bill_header.company_payble);
                    if (
                      inputParam.insured == "Y" &&
                      parseFloat(bill_header.company_payble) > 0
                    ) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OP_CTRL.head_id,
                        child_id: OP_CTRL.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: bill_header.company_payble,
                        reverted: "Y",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    //TAX part

                    if (parseFloat(bill_header.total_tax) > 0) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: OUTPUT_TAX.head_id,
                        child_id: OUTPUT_TAX.child_id,
                        debit_amount: bill_header.total_tax,
                        payment_type: "DR",
                        credit_amount: 0,
                        reverted: "Y",
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                    //Ends Here

                    let strQuery = "";

                    if (
                      Result[2][0].cost_center_required === "Y" &&
                      Result[2][0].cost_center_type === "P"
                    ) {
                      strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                  inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                  inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                  division_id= ${req.userIdentity.hospital_id} limit 1;`;
                    }
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                document_number,from_screen,narration,entered_by,entered_date) \
                VALUES (?,?,?,?,?,?,?,?,?);" +
                          strQuery,
                        values: [
                          new Date(),
                          amount,
                          voucher_type,
                          new_bill_header.hims_f_billing_header_id,
                          new_bill_header.bill_number,
                          inputParam.ScreenCode,
                          narration,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                        ],
                        printQuery: true,
                      })
                      .then((header_result) => {
                        let project_id = null;

                        let headerDayEnd = [];
                        if (header_result.length > 1) {
                          headerDayEnd = header_result[0];
                          project_id = header_result[1][0].project_id;
                        } else {
                          headerDayEnd = header_result;
                        }

                        const month = moment().format("M");
                        const year = moment().format("YYYY");
                        const IncludeValuess = [
                          "payment_date",
                          "head_id",
                          "child_id",
                          "debit_amount",
                          "payment_type",
                          "credit_amount",
                          "reverted",
                          "hospital_id",
                        ];

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                            values: EntriesArray,
                            includeValues: IncludeValuess,
                            bulkInsertOrUpdate: true,
                            extraValues: {
                              year: year,
                              month: month,
                              day_end_header_id: headerDayEnd.insertId,
                              project_id: project_id,
                              sub_department_id: req.body.sub_department_id,
                            },
                            printQuery: true,
                          })
                          .then((subResult) => {
                            // console.log("FOUR");
                            if (req.connection == null) {
                              req.records = updateOrder;
                              _mysql.commitTransaction(() => {
                                _mysql.releaseConnection();
                                next();
                              });
                            } else {
                              next();
                            }
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            next();
          }
        })
        .catch((error) => {
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
};

export async function generateAccountingEntryChangeEntitle(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    // const utilities = new algaehUtilities();
    // console.log("req.connection", req.connection);

    const inputParam = req.body;
    // console.log("generateAccountingEntryAdjustBill", inputParam);

    // console.log("inputParam", inputParam);
    const product_type = await _mysql
      .executeQuery({
        query:
          "select product_type from  hims_d_organization where hims_d_organization_id=1\
        and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
        printQuery: true,
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
    if (product_type.length == 1) {
      const bill_Result = await _mysql
        .executeQuery({
          query:
            "select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
                select BD.* from hims_f_billing_header BH \
                inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
                where BH.hims_f_billing_header_id = ?;\
                select RD.* from hims_f_billing_header BH \
                inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
                where BH.hims_f_billing_header_id=?;\
                select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
                select BD.* from hims_f_billing_header BH \
                inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
                where BH.hims_f_billing_header_id = ?;\
                select RD.* from hims_f_billing_header BH \
                inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
                where BH.hims_f_billing_header_id=?;",
          values: [
            inputParam.from_bill_id,
            inputParam.from_bill_id,
            inputParam.from_bill_id,
            inputParam.hims_f_billing_header_id,
            inputParam.hims_f_billing_header_id,
            inputParam.hims_f_billing_header_id,
          ],
          printQuery: true,
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
      const bill_header = bill_Result[0][0];
      const bill_detail = bill_Result[1];
      const receipt_details = bill_Result[2];

      const new_bill_header = bill_Result[3][0];
      const new_bill_detail = bill_Result[4];
      const new_receipt_details = bill_Result[5];

      console.log("new_bill_header", new_bill_header.company_payble);

      const servicesIds = ["0"];
      if (new_bill_detail && new_bill_detail.length > 0) {
        new_bill_detail.forEach((item) => {
          servicesIds.push(item.services_id);
        });
      }

      const Result = await _mysql
        .executeQuery({
          query:
            "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
                    account in ('OP_DEP','CIH_OP','OUTPUT_TAX','OP_REC','CARD_SETTL', 'OP_CTRL');\
                    SELECT hims_d_services_id,service_name,head_id,child_id FROM hims_d_services where hims_d_services_id in(?);\
                    select cost_center_type, cost_center_required from finance_options limit 1;",
          values: [servicesIds],
          printQuery: true,
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
      const controls = Result[0];
      const serviceData = Result[1];
      // const insurance_data = Result[3];

      const OP_DEP = controls.find((f) => {
        return f.account == "OP_DEP";
      });

      const CIH_OP = controls.find((f) => {
        return f.account == "CIH_OP";
      });
      const OUTPUT_TAX = controls.find((f) => {
        return f.account == "OUTPUT_TAX";
      });
      const OP_REC = controls.find((f) => {
        return f.account == "OP_REC";
      });
      const CARD_SETTL = controls.find((f) => {
        return f.account == "CARD_SETTL";
      });
      const OP_CTRL = controls.find((f) => {
        return f.account == "OP_CTRL";
      });

      let voucher_type = "";
      let narration = "";
      let amount = 0;

      const EntriesArray = [];

      voucher_type = "sales";

      amount = new_bill_header.receiveable_amount;
      narration = "Bill Adjustment Done From :" + bill_header.bill_number;

      //BOOKING INCOME AND TAX
      // New Bill Booking
      //Starts Here
      serviceData.forEach((curService) => {
        const bill = new_bill_detail.filter((f) => {
          if (f.services_id == curService.hims_d_services_id) return f;
        });

        const credit_amount = _.sumBy(bill, (s) => parseFloat(s.net_amout));

        EntriesArray.push({
          payment_date: new Date(),
          head_id: curService.head_id,
          child_id: curService.child_id,
          debit_amount: 0,
          payment_type: "CR",
          credit_amount: credit_amount,
          reverted: "N",
          hospital_id: req.userIdentity.hospital_id,
        });
      });

      //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
      if (new_bill_header.advance_adjust > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_DEP.head_id,
          child_id: OP_DEP.child_id,
          debit_amount: new_bill_header.advance_adjust,
          payment_type: "DR",
          credit_amount: 0,
          reverted: "N",
          hospital_id: req.userIdentity.hospital_id,
        });
      }
      //PROVIDING OP SERVICE ON CREDIT
      if (new_bill_header.credit_amount > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_REC.head_id,
          child_id: OP_REC.child_id,
          debit_amount: new_bill_header.credit_amount,
          payment_type: "DR",
          credit_amount: 0,
          reverted: "N",
          hospital_id: req.userIdentity.hospital_id,
        });
      }

      //INCREASING CASH IN CAND AND BANK
      new_receipt_details.forEach((m) => {
        if (parseFloat(m.amount) > 0) {
          if (m.pay_type == "CD") {
            EntriesArray.push({
              payment_date: new Date(),
              head_id: CARD_SETTL.head_id,
              child_id: CARD_SETTL.child_id,
              debit_amount: m.amount,
              payment_type: "DR",
              credit_amount: 0,
              reverted: "N",
              hospital_id: req.userIdentity.hospital_id,
            });
          } else {
            EntriesArray.push({
              payment_date: new Date(),
              head_id: CIH_OP.head_id,
              child_id: CIH_OP.child_id,
              debit_amount: m.amount,
              payment_type: "DR",
              credit_amount: 0,
              reverted: "N",
              hospital_id: req.userIdentity.hospital_id,
            });
          }
        }
      });

      //insurance company payable
      // console.log("insured", inputParam.insured);
      // console.log("company_payble", new_bill_header.company_payble);
      if (
        inputParam.insured == "Y" &&
        parseFloat(new_bill_header.company_payble) > 0
      ) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_CTRL.head_id,
          child_id: OP_CTRL.child_id,
          debit_amount: new_bill_header.company_payble,
          payment_type: "DR",
          credit_amount: 0,
          reverted: "N",
          hospital_id: req.userIdentity.hospital_id,
        });
      }

      //TAX part

      if (parseFloat(new_bill_header.total_tax) > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OUTPUT_TAX.head_id,
          child_id: OUTPUT_TAX.child_id,
          debit_amount: 0,
          payment_type: "CR",
          credit_amount: new_bill_header.total_tax,
          reverted: "N",
          hospital_id: req.userIdentity.hospital_id,
        });
      }
      //Ends Here

      //REVERT BOOKING INCOME AND TAX
      //Old Bill revert
      //Starts Here
      serviceData.forEach((curService) => {
        const bill = bill_detail.filter((f) => {
          if (f.services_id == curService.hims_d_services_id) return f;
        });

        const debeit_amount = _.sumBy(bill, (s) => parseFloat(s.net_amout));

        EntriesArray.push({
          payment_date: new Date(),
          head_id: curService.head_id,
          child_id: curService.child_id,
          debit_amount: debeit_amount,
          payment_type: "DR",
          credit_amount: 0,
          reverted: "Y",
          hospital_id: req.userIdentity.hospital_id,
        });
      });

      //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
      if (bill_header.advance_adjust > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_DEP.head_id,
          child_id: OP_DEP.child_id,
          debit_amount: 0,
          payment_type: "CR",
          credit_amount: bill_header.advance_adjust,
          reverted: "Y",
          hospital_id: req.userIdentity.hospital_id,
        });
      }
      //PROVIDING OP SERVICE ON CREDIT
      if (bill_header.credit_amount > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_REC.head_id,
          child_id: OP_REC.child_id,
          debit_amount: 0,
          payment_type: "CR",
          credit_amount: bill_header.credit_amount,
          reverted: "Y",
          hospital_id: req.userIdentity.hospital_id,
        });
      }

      //INCREASING CASH IN CAND AND BANK
      receipt_details.forEach((m) => {
        if (parseFloat(m.amount) > 0) {
          if (m.pay_type == "CD") {
            EntriesArray.push({
              payment_date: new Date(),
              head_id: CARD_SETTL.head_id,
              child_id: CARD_SETTL.child_id,
              debit_amount: 0,
              payment_type: "CR",
              credit_amount: m.amount,
              reverted: "Y",
              hospital_id: req.userIdentity.hospital_id,
            });
          } else {
            EntriesArray.push({
              payment_date: new Date(),
              head_id: CIH_OP.head_id,
              child_id: CIH_OP.child_id,
              debit_amount: 0,
              payment_type: "CR",
              credit_amount: m.amount,
              reverted: "Y",
              hospital_id: req.userIdentity.hospital_id,
            });
          }
        }
      });

      //insurance company payable
      if (
        inputParam.insured == "Y" &&
        parseFloat(bill_header.company_payble) > 0
      ) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OP_CTRL.head_id,
          child_id: OP_CTRL.child_id,
          debit_amount: 0,
          payment_type: "CR",
          credit_amount: bill_header.company_payble,
          reverted: "Y",
          hospital_id: req.userIdentity.hospital_id,
        });
      }

      //TAX part

      if (parseFloat(bill_header.total_tax) > 0) {
        EntriesArray.push({
          payment_date: new Date(),
          head_id: OUTPUT_TAX.head_id,
          child_id: OUTPUT_TAX.child_id,
          debit_amount: bill_header.total_tax,
          payment_type: "DR",
          credit_amount: 0,
          reverted: "Y",
          hospital_id: req.userIdentity.hospital_id,
        });
      }
      //Ends Here

      let strQuery = "";

      if (
        Result[2][0].cost_center_required === "Y" &&
        Result[2][0].cost_center_type === "P"
      ) {
        strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                  inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                  inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                  division_id= ${req.userIdentity.hospital_id} limit 1;`;
      }
      const header_result = await _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                document_number,from_screen,narration,entered_by,entered_date) \
                VALUES (?,?,?,?,?,?,?,?,?);" +
            strQuery,
          values: [
            new Date(),
            amount,
            voucher_type,
            new_bill_header.hims_f_billing_header_id,
            new_bill_header.bill_number,
            inputParam.ScreenCode,
            narration,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
          ],
          printQuery: true,
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
      let project_id = null;

      let headerDayEnd = [];
      if (header_result.length > 1) {
        headerDayEnd = header_result[0];
        project_id = header_result[1][0].project_id;
      } else {
        headerDayEnd = header_result;
      }

      const month = moment().format("M");
      const year = moment().format("YYYY");
      const IncludeValuess = [
        "payment_date",
        "head_id",
        "child_id",
        "debit_amount",
        "payment_type",
        "credit_amount",
        "reverted",
        "hospital_id",
      ];

      const subResult = await _mysql
        .executeQueryWithTransaction({
          query: "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
          values: EntriesArray,
          includeValues: IncludeValuess,
          bulkInsertOrUpdate: true,
          extraValues: {
            year: year,
            month: month,
            day_end_header_id: headerDayEnd.insertId,
            project_id: project_id,
            sub_department_id: req.body.sub_department_id,
          },
          printQuery: true,
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
      next();
    } else {
      next();
    }
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
