"use strict";
import extend from "extend";
import utils from "../utils";
import billModels from "../model/billing";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import mysql from "mysql";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";

const keyPath = require("algaeh-keys/keys");

const { getBillDetailsFunctionality } = billModels;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by irfan: check pre-aproval status and get PreAproval List
let getPreAprovalList = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";

    if (req.query.created_date != null) {
      _stringData +=
        " and date(SA.created_date) between date('" +
        req.query.created_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      _stringData += " and date(SA.created_date) <= date(now())";
    }
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,network_id,\
        insurance_network_office_id,valid_upto,\
        service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,billing_updated,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.department_type, SD.sub_department_name, \
        PI.primary_card_number as card_no, E.full_name as doctor_name, INS.insurance_provider_name \
        from hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id \
        inner join hims_d_employee E on E.hims_d_employee_id = SA.doctor_id \
        inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
        inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id \
        inner join hims_m_patient_insurance_mapping PI on PI.patient_visit_id=SA.visit_id \
        inner join hims_d_insurance_provider INS on INS.hims_d_insurance_provider_id=PI.primary_insurance_provider_id \
        inner join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id \
        WHERE SA.record_status='A' " +
          _stringData,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: check pre-aproval status and get PreAproval List
let getMedicationAprovalList = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    // console.log("req.query", req.query)
    if (req.query.created_date != null) {
      _stringData +=
        " and date(SA.created_date) between date('" +
        req.query.created_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      _stringData += " and date(SA.created_date) <= date(now())";
    }
    if (req.query.item_id != null) {
      _stringData += " and SA.item_id=?";
      inputValues.push(req.query.item_id);
    }
    if (req.query.visit_id != null) {
      _stringData += " and SA.visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    if (req.query.pharmacy_pos_detail_id != null) {
      _stringData += " and SA.pharmacy_pos_detail_id=?";
      inputValues.push(req.query.pharmacy_pos_detail_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_medication_approval_id,approved_qty,prescription_detail_id,insurance_provider_id,sub_insurance_id,\
        network_id,insurance_network_office_id,\
        service_id,SR.service_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.department_type, billing_updated, SD.sub_department_name,  \
        PI.primary_card_number as card_no, E.full_name as doctor_name, INS.insurance_provider_name \
        from hims_f_medication_approval SA left join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id \
        left join hims_d_employee E on E.hims_d_employee_id = SA.doctor_id \
        inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
        left join hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id \
        left join hims_m_patient_insurance_mapping PI on PI.patient_visit_id=SA.visit_id \
        left join hims_d_insurance_provider INS on INS.hims_d_insurance_provider_id=PI.primary_insurance_provider_id \
        left join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id WHERE SA.record_status='A' " +
          _stringData,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
  // let preAprovalWhere = {
  //   service_id: "ALL"
  // };
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //
  //   req.query["date(SA.created_date)"] = req.query.created_date;
  //   req.query["SA.doctor_id"] = req.query.doctor_id;
  //   req.query["SA.patient_id"] = req.query.patient_id;
  //
  //   delete req.query.created_date;
  //   delete req.query.doctor_id;
  //   delete req.query.patient_id;
  //
  //   let where = whereCondition(extend(preAprovalWhere, req.query));
  //
  //   debugLog("where conditn:", where);
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     db.query(
  //       "SELECT hims_f_medication_approval_id,approved_qty,prescription_detail_id,insurance_provider_id,sub_insurance_id,\
  //       network_id,insurance_network_office_id,\
  //       service_id,SR.service_code, requested_date, requested_by, requested_mode,\
  //       requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
  //       PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
  //       net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
  //       apprv_status,SA.created_date,SA.created_by, SD.department_type,billing_updated \
  //       from ((hims_f_medication_approval SA left join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
  //       inner join \
  //       hims_d_services SR on SR.hims_d_services_id=SA.service_id left join \
  //       hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id left join \
  //       hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) WHERE SA.record_status='A' AND " +
  //         where.condition,
  //       where.values,
  //
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:UPDATE PREAPPROVAL
let updatePreApproval = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let inputParam = extend({}, req.body);

    let qry = "";

    for (let i = 0; i < req.body.length; i++) {
      let _appDate =
        inputParam[i].apprv_date != null ? inputParam[i].apprv_date : null;
      qry += mysql.format(
        "UPDATE `hims_f_service_approval` SET service_id=?, insurance_provider_id=?, insurance_network_office_id=?,\
          icd_code=?,insurance_service_name=?,doctor_id=?,patient_id=?,gross_amt=?,net_amount=?,requested_date=?,\
          requested_by=?, requested_mode=?,requested_quantity=?,submission_type=?,refer_no=?,approved_amount=?,\
          apprv_remarks=?,apprv_date=?,rejected_reason=?, apprv_status=?, approved_no=?, valid_upto = ?,\
          updated_date=?, updated_by=? \
          where hims_f_service_approval_id=?;",
        [
          inputParam[i].service_id,
          inputParam[i].insurance_provider_id,
          inputParam[i].insurance_network_office_id,
          inputParam[i].icd_code,
          inputParam[i].insurance_service_name,
          inputParam[i].doctor_id,
          inputParam[i].patient_id,
          inputParam[i].gross_amt,
          inputParam[i].net_amount,
          inputParam[i].requested_date,
          req.userIdentity.algaeh_d_app_user_id,
          inputParam[i].requested_mode,
          inputParam[i].requested_quantity,
          inputParam[i].submission_type,
          inputParam[i].refer_no,
          inputParam[i].approved_amount,
          inputParam[i].apprv_remarks,
          _appDate,
          inputParam[i].rejected_reason,
          inputParam[i].apprv_status,
          inputParam[i].approved_no,
          inputParam[i].valid_upto,
          moment().format("YYYY-MM-DD HH:mm"),
          req.userIdentity.algaeh_d_app_user_id,
          inputParam[i].hims_f_service_approval_id,
        ]
      );
    }

    _mysql
      .executeQuery({
        query: qry,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan:UPDATE PREAPPROVAL
let updateMedicinePreApproval = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();

    let inputParam = extend({}, req.body);

    let qry = "";

    for (let i = 0; i < req.body.length; i++) {
      let _appDate =
        inputParam[i].apprv_date != null ? inputParam[i].apprv_date : null;

      let _requested_date =
        inputParam[i].requested_date != null
          ? inputParam[i].requested_date
          : null;
      qry += mysql.format(
        "UPDATE `hims_f_medication_approval` SET requested_date=?,\
          requested_by=?, requested_mode=?,requested_quantity=?,submission_type=?,refer_no=?,approved_amount=?,\
          apprv_remarks=?,apprv_date=?,rejected_reason=?, apprv_status=?, approved_no=?, updated_date=?, updated_by=? \
          where hims_f_medication_approval_id=?;",
        [
          _requested_date,
          req.userIdentity.algaeh_d_app_user_id,
          inputParam[i].requested_mode,
          inputParam[i].requested_quantity,
          inputParam[i].submission_type,
          inputParam[i].refer_no,
          inputParam[i].approved_amount,
          inputParam[i].apprv_remarks,
          _appDate,
          inputParam[i].rejected_reason,
          inputParam[i].apprv_status,
          inputParam[i].approved_no,
          moment().format("YYYY-MM-DD HH:mm"),
          req.userIdentity.algaeh_d_app_user_id,
          inputParam[i].hims_f_medication_approval_id,
        ]
      );
    }

    _mysql
      .executeQuery({
        query: qry,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

let checkOrderedDetails = (req, res, next) => {
  try {
    const _mysql = new algaehMysql({ path: keyPath });
    let inputParam = extend({}, req.query);

    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_ordered_services_id, created_date FROM hims_f_ordered_services \
            where patient_id = ? and services_id = ? ORDER BY hims_f_ordered_services_id DESC LIMIT 1; \
            SELECT `interval`, hims_d_services_insurance_id FROM hims_d_services_insurance where \
            insurance_id = ?  and services_id = ? ",
        values: [
          inputParam.patient_id,
          inputParam.services_id,
          inputParam.insurance_id,
          inputParam.services_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        req.flag = true;
        const order_details = result[0];
        const insurance_details = result[1];
        // let date_valid = null;

        // console.log(
        //   "insurance_details[0].interval",
        //   insurance_details[0].interval
        // );
        if (parseInt(insurance_details[0].interval) > 0) {
          if (order_details.length > 0) {
            const ordered_date = moment(
              order_details[0].created_date,
              "YYYY-MM-DD"
            ).format("YYYY-MM-DD");

            // console.log("ordered_date", ordered_date);
            // date_valid = moment(ordered_date).add(
            //   parseInt(insurance_details[0].interval),
            //   "days"
            // );

            let no_of_days = moment().diff(ordered_date, "days");

            // console.log(
            //   "date_valid:---",
            //   moment(date_valid).format("YYYYMMDD")
            // );

            // console.log("currenct:---", moment().format("YYYYMMDD"));
            // console.log("no_of_days:---", no_of_days);
            // moment(date_valid).format("YYYYMMDD") <=
            // moment().format("YYYYMMDD")
            if (no_of_days <= parseInt(insurance_details[0].interval)) {
              // console.log("234567");
              req.flag = false;
            }
            _mysql.releaseConnection();
            req.records = result;
            next();
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
          }
        } else {
          _mysql.releaseConnection();
          req.records = result;
          next();
        }
      })
      .catch((error) => {
        // console.log("error", error);
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};

let insertOrderedServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });

    req.on("end", () => {
      let input = JSON.parse(buffer);
      req.body = input;

      const IncludeValues = [
        "patient_id",
        "visit_id",
        "ip_id",
        "doctor_id",
        "service_type_id",
        "services_id",
        "test_type",
        "insurance_yesno",
        "insurance_provider_id",
        "insurance_sub_id",
        "network_id",
        "insurance_network_office_id",
        "policy_number",
        "pre_approval",
        "quantity",
        "unit_cost",
        "gross_amount",
        "discount_amout",
        "discount_percentage",
        "net_amout",
        "copay_percentage",
        "copay_amount",
        "deductable_amount",
        "deductable_percentage",
        "tax_inclusive",
        "patient_tax",
        "company_tax",
        "total_tax",
        "patient_resp",
        "patient_payable",
        "comapany_resp",
        "company_payble",
        "sec_company",
        "sec_deductable_percentage",
        "sec_deductable_amount",
        "sec_company_res",
        "sec_company_tax",
        "sec_company_paybale",
        "sec_copay_percntage",
        "sec_copay_amount",
        "teeth_number",
        "d_treatment_id",
      ];

      let strQuery = "SELECT 1=1;";
      if (input.source === "O") {
        strQuery = _mysql.mysqlQueryFormat(
          "update hims_f_patient_visit set ins_services_amount=?, approval_limit_yesno=? where hims_f_patient_visit_id=?;",
          [input.approval_amt, input.approval_limit_yesno, input.visit_id]
        );
      }

      let resultOrder = [];
      _mysql
        .executeQueryWithTransaction({
          query: strQuery,
          printQuery: true,
        })
        .then((visitUpdate) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
            path: keyPath,
          };
          deleteOrderServices({
            delete_order_services: input.deleteserviceInput,
            _mysql: _mysql,
            next: next,
          })
            .then((deleteOrders) => {
              new Promise((resolve, reject) => {
                try {
                  // console.log("input.billdetails", input.billdetails)
                  const insert_order_services = _.filter(
                    input.billdetails,
                    (f) => {
                      return (
                        f.hims_f_ordered_services_id === null ||
                        f.hims_f_ordered_services_id === undefined
                      );
                    }
                  );

                  console.log("insert_order_services", insert_order_services);
                  if (insert_order_services.length > 0) {
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO hims_f_ordered_services(??) VALUES ?",
                        values: insert_order_services,
                        includeValues: IncludeValues,
                        extraValues: {
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          created_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date(),
                          hospital_id: req.userIdentity.hospital_id,
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true,
                      })
                      .then((ordered_services) => {
                        resultOrder = ordered_services;
                        return resolve(ordered_services);
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else {
                    return resolve();
                  }
                } catch (e) {
                  reject(e);
                }
              })
                .then((result) => {
                  new Promise((resolve, reject) => {
                    try {
                      const update_Order_Service = _.filter(
                        input.billdetails,
                        (f) => {
                          return f.hims_f_ordered_services_id > 0;
                        }
                      );

                      // console.log("update_Order_Service", update_Order_Service)
                      if (update_Order_Service.length > 0) {
                        let strQry = "";
                        const pre_approval = _.filter(
                          update_Order_Service,
                          (f) => {
                            return f.pre_approval === "N";
                          }
                        );

                        if (pre_approval.length > 0) {
                          let order_ids = _.map(pre_approval, (o) => {
                            return o.hims_f_ordered_services_id;
                          });

                          strQry += mysql.format(
                            "DELETE FROM hims_f_service_approval where ordered_services_id in (?);",
                            [order_ids]
                          );
                        }

                        for (let i = 0; i < update_Order_Service.length; i++) {
                          strQry += mysql.format(
                            "UPDATE `hims_f_ordered_services` SET pre_approval=?, quantity=?, \
                          unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
                          copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?,tax_inclusive=?, \
                          patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
                          company_payble=?, teeth_number=?, d_treatment_id=?, updated_date=?,updated_by=? \
                          where hims_f_ordered_services_id=?;",
                            [
                              update_Order_Service[i].pre_approval,
                              update_Order_Service[i].quantity,
                              update_Order_Service[i].unit_cost,
                              update_Order_Service[i].gross_amount,
                              update_Order_Service[i].discount_amout,
                              update_Order_Service[i].discount_percentage,
                              update_Order_Service[i].net_amout,
                              update_Order_Service[i].copay_percentage,
                              update_Order_Service[i].copay_amount,
                              update_Order_Service[i].deductable_amount,
                              update_Order_Service[i].deductable_percentage,
                              update_Order_Service[i].tax_inclusive,
                              update_Order_Service[i].patient_tax,
                              update_Order_Service[i].company_tax,
                              update_Order_Service[i].total_tax,
                              update_Order_Service[i].patient_resp,
                              update_Order_Service[i].patient_payable,
                              update_Order_Service[i].comapany_resp,
                              update_Order_Service[i].company_payble,
                              update_Order_Service[i].teeth_number,
                              update_Order_Service[i].d_treatment_id,
                              moment().format("YYYY-MM-DD HH:mm"),
                              req.userIdentity.algaeh_d_app_user_id,
                              update_Order_Service[i]
                                .hims_f_ordered_services_id,
                            ]
                          );
                        }
                        _mysql
                          .executeQueryWithTransaction({
                            query: strQry,
                            printQuery: true,
                          })
                          .then((update_order_result) => {
                            // console.log("result", update_order_result);
                            return resolve(update_order_result);
                          })
                          .catch((error) => {
                            // console.log("error", error);
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      } else {
                        return resolve();
                      }
                    } catch (e) {
                      reject(e);
                    }
                  })
                    .then((result) => {
                      // let servicesForPreAproval = [];
                      let patient_id = input["patient_id"];
                      let doctor_id = input["doctor_id"];
                      let visit_id = input["visit_id"];
                      let ip_id = input["ip_id"];

                      let services = [];
                      input["billdetails"].forEach((e) => {
                        // if (e.pre_approval == "Y") {
                        services.push(e.services_id);
                        // }
                      });

                      console.log("services", services);
                      if (services.length > 0) {
                        let strSource = " and OS.visit_id= " + visit_id;
                        if (input.source === "I") {
                          strSource = " and OS.ip_id= " + ip_id;
                        }
                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              // delete_str +
                              "SELECT OS.hims_f_ordered_services_id,IT.send_out_test, OS.services_id, OS.created_date, OS.service_type_id, \
                              OS.test_type, S.physiotherapy_service, S.service_name, hims_d_investigation_test_id as test_id \
                              from hims_f_ordered_services OS \
                              inner join hims_d_services S on  S.hims_d_services_id = OS.services_id\
                              left join hims_d_investigation_test IT on OS.services_id=IT.services_id \
                              left join hims_f_service_approval SA on SA.ordered_services_id=OS.hims_f_ordered_services_id\
                             where   OS.patient_id=? and OS.doctor_id=? " +
                              strSource +
                              " and OS.services_id in (?)  and hims_f_service_approval_id is null ;",
                            values: [patient_id, doctor_id, services],
                            printQuery: true,
                          })
                          .then((ResultOfFetchOrderIds) => {
                            let detailsPush = [];

                            input["billdetails"].forEach((item) => {
                              let os_data = ResultOfFetchOrderIds.find((f) => {
                                return (
                                  item.pre_approval == "Y" &&
                                  item.services_id == f.services_id
                                );
                              });
                              if (os_data) {
                                detailsPush.push({
                                  ...item,
                                  ...os_data,
                                });
                              }
                            });

                            if (detailsPush.length > 0) {
                              const insurtCols = [
                                "hims_f_ordered_services_id",
                                "visit_id",
                                "insurance_provider_id",
                                "insurance_network_office_id",
                                "network_id",
                                "icd_code",
                                "requested_quantity",
                                "insurance_service_name",
                                "doctor_id",
                                "patient_id",
                                "gross_amount",
                                "net_amout",
                                "services_id",
                              ];
                              _mysql
                                .executeQueryWithTransaction({
                                  query:
                                    "INSERT INTO hims_f_service_approval(??) VALUES ?",
                                  values: detailsPush,
                                  includeValues: insurtCols,
                                  replcaeKeys: {
                                    services_id: "service_id",
                                    gross_amount: "gross_amt",
                                    net_amout: "net_amount",
                                    hims_f_ordered_services_id:
                                      "ordered_services_id",
                                  },
                                  extraValues: {
                                    created_by:
                                      req.userIdentity.algaeh_d_app_user_id,
                                    created_date: new Date(),
                                    updated_by:
                                      req.userIdentity.algaeh_d_app_user_id,
                                    updated_date: new Date(),
                                  },
                                  bulkInsertOrUpdate: true,
                                  printQuery: true,
                                })
                                .then((resultPreAprvl) => {
                                  req.records = {
                                    resultPreAprvl,
                                    ResultOfFetchOrderIds:
                                      ResultOfFetchOrderIds,
                                  };
                                  next();
                                })
                                .catch((error) => {
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                  });
                                });
                            } else {
                              req.records = {
                                resultOrder,
                                ResultOfFetchOrderIds: ResultOfFetchOrderIds,
                              };
                              next();
                            }
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      } else {
                        if (req.body.billdetails.length > 0) {
                          services = req.body.billdetails.map((s) => {
                            patient_id = s.patient_id;
                            doctor_id = s.doctor_id;
                            visit_id = s.visit_id;
                            return s.services_id;
                          });

                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                              where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
                              values: [
                                patient_id,
                                doctor_id,
                                visit_id,
                                services,
                              ],
                              printQuery: true,
                            })
                            .then((ResultOfFetchOrderIds) => {
                              req.records = {
                                resultOrder,
                                ResultOfFetchOrderIds: ResultOfFetchOrderIds,
                              };
                              next();
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            resultOrder,
                            ResultOfFetchOrderIds: [],
                          };
                          next();
                        }
                      }
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
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};

//created by irfan: insert ordered services and pre-approval services for insurance
// let insertOrderedServicesBackUp = (req, res, next) => {
//   const insurtColumns = [
//     "patient_id",
//     "visit_id",
//     "doctor_id",
//     "service_type_id",
//     "services_id",
//     "test_type",
//     "insurance_yesno",
//     "insurance_provider_id",
//     "insurance_sub_id",
//     "network_id",
//     "insurance_network_office_id",
//     "policy_number",
//     "pre_approval",
//     "quantity",
//     "unit_cost",
//     "gross_amount",
//     "discount_amout",
//     "discount_percentage",
//     "net_amout",
//     "copay_percentage",
//     "copay_amount",
//     "deductable_amount",
//     "deductable_percentage",
//     "tax_inclusive",
//     "patient_tax",
//     "company_tax",
//     "total_tax",
//     "patient_resp",
//     "patient_payable",
//     "comapany_resp",
//     "company_payble",
//     "sec_company",
//     "sec_deductable_percentage",
//     "sec_deductable_amount",
//     "sec_company_res",
//     "sec_company_tax",
//     "sec_company_paybale",
//     "sec_copay_percntage",
//     "sec_copay_amount",
//     "teeth_number",
//     "d_treatment_id"
//   ];

//   try {
//     if (req.db == null) {
//       next(httpStatus.dataBaseNotInitilizedError());
//     }
//     let db = req.db;

//     let connection = req.connection;

//     connection.beginTransaction(error => {
//       if (error) {
//         connection.rollback(() => {
//           releaseDBConnection(db, connection);
//           next(error);
//         });
//       }

//       connection.query(
//         "INSERT INTO hims_f_ordered_services(" +
//         insurtColumns.join(",") +
//         ",created_by,updated_by,hospital_id) VALUES ?",
//         [
//           jsonArrayToObject({
//             sampleInputObject: insurtColumns,
//             arrayObj: req.body.billdetails,
//             req: req,
//             newFieldToInsert: [
//               req.userIdentity.algaeh_d_app_user_id,
//               req.userIdentity.algaeh_d_app_user_id,
//               req.userIdentity.hospital_id
//             ]
//           })
//         ],
//         (error, resultOrder) => {
//           if (error) {
//             connection.rollback(() => {
//               releaseDBConnection(db, connection);
//               next(error);
//             });
//           }

//           let servicesForPreAproval = [];
//           let patient_id;
//           let doctor_id;
//           let visit_id;

//           let services = new LINQ(req.body.billdetails)
//             .Select(s => {
//               patient_id = s.patient_id;
//               doctor_id = s.doctor_id;
//               visit_id = s.visit_id;
//               return s.services_id;
//             })
//             .ToArray();

//           if (services.length > 0) {
//             servicesForPreAproval.push(patient_id);
//             servicesForPreAproval.push(doctor_id);
//             servicesForPreAproval.push(visit_id);
//             servicesForPreAproval.push(services);

//             connection.query(
//               "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
//                  where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
//               servicesForPreAproval,
//               (error, ResultOfFetchOrderIds) => {
//                 if (error) {
//                   releaseDBConnection(db, connection);
//                   next(error);
//                 }

//                 let detailsPush = new LINQ(req.body.billdetails)
//                   .Where(g => g.pre_approval == "Y")
//                   .Select(s => {
//                     return {
//                       ...s,
//                       ...{
//                         hims_f_ordered_services_id: new LINQ(
//                           ResultOfFetchOrderIds
//                         )
//                           .Where(w => w.services_id == s.services_id)
//                           .FirstOrDefault().hims_f_ordered_services_id
//                       }
//                     };
//                   })
//                   .ToArray();

//                 //if request for pre-aproval needed
//                 if (detailsPush.length > 0) {
//                   const insurtCols = [
//                     "ordered_services_id",
//                     "service_id",
//                     "insurance_provider_id",
//                     "insurance_network_office_id",
//                     "icd_code",
//                     "requested_quantity",
//                     "insurance_service_name",
//                     "doctor_id",
//                     "patient_id",
//                     "visit_id",
//                     "gross_amt",
//                     "net_amount"
//                   ];

//                   connection.query(
//                     "INSERT INTO hims_f_service_approval(" +
//                     insurtCols.join(",") +
//                     ",created_by,updated_by) VALUES ?",
//                     [
//                       jsonArrayToObject({
//                         sampleInputObject: insurtCols,
//                         arrayObj: detailsPush,
//                         replaceObject: [
//                           {
//                             originalKey: "service_id",
//                             NewKey: "services_id"
//                           },
//                           {
//                             originalKey: "gross_amt",
//                             NewKey: "ser_gross_amt"
//                           },
//                           {
//                             originalKey: "net_amount",
//                             NewKey: "ser_net_amount"
//                           },
//                           {
//                             originalKey: "ordered_services_id",
//                             NewKey: "hims_f_ordered_services_id"
//                           }
//                         ],
//                         req: req,
//                         newFieldToInsert: [
//                           req.userIdentity.algaeh_d_app_user_id,
//                           req.userIdentity.algaeh_d_app_user_id
//                         ]
//                       })
//                     ],
//                     (error, resultPreAprvl) => {
//                       if (error) {
//                         connection.rollback(() => {
//                           releaseDBConnection(db, connection);
//                           next(error);
//                         });
//                       }
//                       req.records = { resultPreAprvl, ResultOfFetchOrderIds };
//                       next();
//                     }
//                   );
//                 } else {
//                   req.records = { resultOrder, ResultOfFetchOrderIds };
//                   next();
//                 }
//               }
//             );
//           } else {
//             req.records = { resultOrder, ResultOfFetchOrderIds };
//             next();
//           }
//         }
//       );
//     });
//   } catch (e) {
//     next(e);
//   }
// };

let selectOrderServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and visit_id=?";
      inputValues.push(req.query.visit_id);
    }

    if (req.query.service_type_id != null) {
      _stringData += " and OS.service_type_id=?";
      inputValues.push(req.query.service_type_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_services_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
        OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
        OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
        OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
        OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
        OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
        OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
        OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
        OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
        S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
        S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
        S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
        S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
        OS.services_id = S.hims_d_services_id and \
        OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

// let selectOrderServices = (req, res, next) => {
//   let selectWhere = {
//     visit_id: "ALL",
//     service_type_id: "ALL",
//     billed: "N"
//   };
//
//   try {
//     if (req.db == null) {
//       next(httpStatus.dataBaseNotInitilizedError());
//     }
//     let db = req.db;
//     db.getConnection((error, connection) => {
//       if (error) {
//         next(error);
//       }
//       let where = whereCondition(extend(selectWhere, req.query));
//       connection.query(
//         "SELECT  OS.`hims_f_ordered_services_id`,OS.`hims_f_ordered_services_id` as ordered_services_id,\
//         OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
//         OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
//         OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, \
//         OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
//         OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`,\
//         OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
//         OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
//         S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
//         S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
//         S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
//         S.`vat_percent`, S.`service_status`, OS.teeth_number FROM \
//         `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
//         OS.services_id = S.hims_d_services_id and \
//         OS.`record_status`='A' AND OS.`billed`='N' AND " +
//           where.condition,
//         where.values,
//         (error, result) => {
//           releaseDBConnection(db, connection);
//           if (error) {
//             next(error);
//           }
//           req.records = result;
//           next();
//         }
//       );
//     });
//   } catch (e) {
//     next(e);
//   }
// };
let getAllServicesDateRange = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `SELECT  OS.hims_f_ordered_services_id,LO.lab_id_number,E.full_name as doc_name,
          E.arabic_name as doc_arabicName,P.patient_code, P.full_name,P.arabic_name,P.primary_id_no,OS.patient_id, OS.visit_id, OS.doctor_id, OS.service_type_id
          , OS.services_id, OS.test_type, OS.insurance_yesno,OS.insurance_provider_id, OS.insurance_sub_id, OS.network_id,
           OS.policy_number, OS.pre_approval, OS.apprv_status,OS.billed, OS.created_by, OS.created_date, OS.updated_by,           
           OS.updated_date,  S.hims_d_services_id, S.service_code, S.cpt_code,S.service_name, S.arabic_service_name, S.service_desc,
            S.sub_department_id, S.hospital_id,S.service_type_id, S.procedure_type, S.standard_fee, S.followup_free_fee,
            S.followup_paid_fee, S.discount, S.vat_applicable, S.vat_percent, S.service_status, OS.trans_package_detail_id, 
            ST.service_type FROM hims_f_ordered_services OS            inner join  hims_d_services S on OS.services_id = S.hims_d_services_id 
            inner join  hims_d_service_type ST on OS.service_type_id = ST.hims_d_service_type_id           
             left join  hims_f_lab_order LO on OS.hims_f_ordered_services_id=LO.ordered_services_id left join hims_f_patient P on  
              OS.patient_id=P.hims_d_patient_id left join hims_d_employee E on OS.doctor_id = E.hims_d_employee_id
          WHERE OS.record_status='A' and date(OS.created_date)  = date(?) 
          ;`,
        values: [req.query.selectedHDate],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
let selectOrderServicesbyDoctor = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and OS.visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    if (req.query.ip_id != null) {
      _stringData += " and OS.ip_id=?";
      inputValues.push(req.query.ip_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.hims_f_ordered_services_id,LO.lab_id_number, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`,\
           OS.`service_type_id`, OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, \
           OS.`insurance_provider_id`, OS.`insurance_sub_id`, OS.`network_id`, \
           OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
           OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
           OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
           OS.`deductable_amount`, OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`,\
           OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
           OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`,\
           OS.`sec_deductable_amount`, OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`,\
           OS.`sec_copay_percntage`, OS.`sec_copay_amount`, OS.`created_by`, OS.`created_date`, OS.`updated_by`,\
           OS.`updated_date`, OS.`record_status`, S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`,\
           S.`service_name`, S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`,\
           S.`service_type_id`, S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, \
           S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, S.`vat_percent`, S.`service_status`,\
           OS.`trans_package_detail_id`, ST.service_type FROM `hims_f_ordered_services` OS \
           inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id \
           inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id \
           left join  `hims_f_lab_order` LO on OS.hims_f_ordered_services_id=LO.ordered_services_id\
           WHERE OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getVisitConsumable = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    if (req.query.ip_id != null) {
      _stringData += " and OS.ip_id=?";
      inputValues.push(req.query.ip_id);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_inventory_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`inventory_item_id` as item_id, OS.`service_type_id`, \
        OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
        OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
        OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
        OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
        OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
        OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
        OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
        OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
        OS.item_notchargable,OS.instructions, OS.batchno, OS.batchno as barcode, purchase_uom_id as uom_id, \
        sales_uom_id as sales_uom, category_id as item_category_id, group_id as item_group_id, \
        (patient_resp+comapany_resp) as extended_cost,(patient_payable+company_payble) as net_total,\
        S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
        S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
        S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
        S.`vat_percent`, S.`service_status`, ST.service_type, '+' as operation, OS.expirydt as expiry_date FROM `hims_f_ordered_inventory` OS \
        inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id \
        inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id \
        inner join  `hims_d_inventory_item_master` IM on OS.inventory_item_id = IM.hims_d_inventory_item_master_id \
        WHERE OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let load_orders_for_bill = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    console.log("req.query.visit_id", req.query.visit_id);

    let strQuery = " and visit_id= " + req.query.visit_id,
      strBed = "SELECT 1=1";
    console.log("req.query.ip_id", req.query.ip_id);
    if (req.query.ip_id > 0) {
      strQuery = " and ip_id= " + req.query.ip_id;
      strBed =
        "SELECT  OS.`hims_adm_atd_bed_details_id`,\
      OS.`patient_id`, OS.`admission_id`,\
      OS.`provider_id`, OS.`service_type_id`, OS.`services_id`, OS.`insurance_yesno`, \
      OS.`pre_approval`, OS.`apprv_status`, \
      OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
      OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
      OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
      OS.`comapany_resp`, OS.`company_payble`, \
      OS.`created_by`, OS.`created_date`, \
      OS.`updated_by`, OS.`updated_date`, S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, \
      S.`service_name`, S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, \
      S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, \
      S.`vat_applicable`, S.`vat_percent`, S.`service_status`, S.`physiotherapy_service`, ST.`service_type`\
      FROM `hims_adm_atd_bed_details` OS \
      inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id  \
      inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id  \
      WHERE  OS.`billed`='N' and admission_id = " +
        req.query.ip_id +
        ";";
    }
    console.log("strQuery", strQuery);
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_services_id`, OS.`hims_f_ordered_services_id` as ordered_services_id,\
             OS.`patient_id`, OS.`visit_id`,OS.`trans_package_detail_id`,\
          OS.`doctor_id`, OS.`service_type_id`, OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, \
          OS.`insurance_provider_id`, OS.`insurance_sub_id`, OS.`d_treatment_id`,\
          OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
          OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
          OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
          OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
          OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, \
          OS.`sec_deductable_amount`, OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, \
          OS.`sec_copay_percntage`, OS.`sec_copay_amount`,OS.teeth_number, OS.`created_by`, OS.`created_date`, \
          OS.`updated_by`, OS.`updated_date`, OS.`record_status`,S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, \
          S.`service_name`, S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, \
          S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, \
          S.`vat_applicable`, S.`vat_percent`, S.`service_status`, S.`physiotherapy_service`, ST.`service_type`, \
          PD.package_header_id as ordered_package_id FROM `hims_f_ordered_services` OS \
          inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id  \
          inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id  \
          left join  `hims_f_package_detail` PD on OS.trans_package_detail_id = PD.hims_f_package_detail_id  \
          WHERE  OS.`billed`='N' " +
          strQuery +
          "; \
            SELECT  OS.`hims_f_ordered_inventory_id` as ordered_inventory_id, OS.`patient_id`, OS.`visit_id`,\
          OS.`doctor_id`, OS.`service_type_id`, OS.`trans_package_detail_id`,\
          OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
          OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`,\
          OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
          OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
          OS.`deductable_amount`, OS.`deductable_percentage`, \
          OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
          OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
          OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
          OS.item_notchargable,\
          S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
          S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
          S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
          S.`vat_percent`, S.`service_status`, ST.`service_type` FROM `hims_f_ordered_inventory` OS\
          inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id  \
          inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id  \
          WHERE OS.`record_status`='A' and item_notchargable='N' " +
          strQuery +
          " AND OS.`billed`='N';\
            SELECT  OS.`hims_f_package_header_id` as ordered_package_id, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`,\
          OS.`service_type_id`, OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`,\
          OS.`insurance_sub_id`, OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`,\
          OS.`pre_approval`, OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`,\
          OS.`discount_amout`, OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
          OS.`deductable_amount`, OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`,\
          OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`,OS.`comapany_resp`,\
          OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, \
          OS.`sec_copay_amount`,OS.package_visit_type, OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`,\
          OS.`record_status`, S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`,\
          S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`,\
          S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`,\
          S.`vat_applicable`, S.`vat_percent`, S.`service_status`, ST.`service_type` FROM `hims_f_package_header` OS \
          inner join  `hims_d_services` S on OS.services_id = S.hims_d_services_id  \
          inner join  `hims_d_service_type` ST on OS.service_type_id = ST.hims_d_service_type_id  \
          WHERE OS.`record_status`='A' " +
          strQuery +
          " AND OS.`billed`='N' AND OS.package_visit_type='S';" +
          strBed,
        // values: [req.query.visit_id, req.query.visit_id, req.query.visit_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        let final_Result = result[0].concat(result[1]);
        final_Result = final_Result.concat(result[2]);
        if (req.query.ip_id > 0) {
          final_Result = final_Result.concat(result[3]);
        }
        req.records = final_Result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getOrderServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_f_ordered_services` \
        WHERE `record_status`='A' AND visit_id=? and insurance_yesno=?;",
        values: [req.query.visit_id, req.query.insurance_yesno],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }

  // let selectWhere = {
  //   visit_id: "ALL",
  //   insurance_yesno: "ALL",
  //   service_type_id: "ALL",
  //   services_id: "ALL",
  // };

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     let where = whereCondition(extend(selectWhere, req.query));
  //     connection.query(
  //       "SELECT  * FROM `hims_f_ordered_services` \
  //      WHERE `record_status`='A' AND " +
  //         where.condition,
  //       where.values,
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//ordered services update
let updateOrderedServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    new Promise((resolve, reject) => {
      try {
        getBillDetailsFunctionality(req, res, next, resolve);
      } catch (e) {
        reject(e);
      }
    }).then((result) => {
      let inputParam = result.billdetails[0];

      let input = extend({}, req.body[0]);

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_ordered_services SET service_type_id=?, services_id=?, insurance_yesno=?, \
              pre_approval=?, apprv_status=?, quantity=?, unit_cost=?, gross_amount=?, discount_amout=?,\
              discount_percentage=?, net_amout=?, copay_percentage=?, copay_amount=?, deductable_amount=?,\
              deductable_percentage=?, tax_inclusive=?, patient_tax=?, company_tax=?, total_tax=?, \
              patient_resp=?, patient_payable=?, comapany_resp=?, company_payble=?, sec_company=?, \
              sec_deductable_percentage=?, sec_deductable_amount=?, sec_company_res=?, sec_company_tax=?,\
              sec_company_paybale=?, sec_copay_percntage=?, sec_copay_amount=?, updated_date=?, updated_by=? \
              WHERE `record_status`='A' AND `hims_f_ordered_services_id`=?; \
              UPDATE hims_f_service_approval SET billing_updated ='Y' where hims_f_service_approval_id=?;",
          values: [
            inputParam.service_type_id,
            inputParam.services_id,
            inputParam.insurance_yesno,
            inputParam.pre_approval,
            input.apprv_status,
            inputParam.quantity,
            inputParam.unit_cost,
            inputParam.gross_amount,
            inputParam.discount_amout,
            inputParam.discount_percentage,
            inputParam.net_amout,
            inputParam.copay_percentage,
            inputParam.copay_amount,
            inputParam.deductable_amount,
            inputParam.deductable_percentage,
            inputParam.tax_inclusive,
            inputParam.patient_tax,
            inputParam.company_tax,
            inputParam.total_tax,
            inputParam.patient_resp,
            inputParam.patient_payable,
            inputParam.comapany_resp,
            inputParam.company_payble,
            inputParam.sec_company,
            inputParam.sec_deductable_percentage,
            inputParam.sec_deductable_amount,
            inputParam.sec_company_res,
            inputParam.sec_company_tax,
            inputParam.sec_company_paybale,
            inputParam.sec_copay_percntage,
            inputParam.sec_copay_amount,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_ordered_services_id,
            input.hims_f_service_approval_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//ordered services update as billed
let updateOrderedServicesBilled = (req, res, next) => {
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

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    let qry = "";

    for (let i = 0; i < OrderServices.length; i++) {
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

    if (qry != "") {
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }

        req.records = result;
        next();
      });
    } else {
      req.records = {};
      next();
    }
  } catch (e) {
    next(e);
  }
};

//ordered services update as billed
let updatePrescriptionDetail = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body[0]);

    let insurance_yesno = input.apprv_status === "RJ" ? "N" : "Y";

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_prescription_detail SET apprv_status = ?, insured=?, approved_amount=?, \
          pre_approval = 'N' WHERE `hims_f_prescription_detail_id`=?; \
          UPDATE hims_f_medication_approval SET billing_updated ='Y' where hims_f_medication_approval_id=?;",
        values: [
          input.apprv_status,
          insurance_yesno,
          input.approved_amount,
          input.hims_f_prescription_detail_id,
          input.hims_f_medication_approval_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let insertInvOrderedServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = { ...req.body };

    let IncludeValues = [
      "patient_id",
      "visit_id",
      "ip_id",
      "doctor_id",
      "inventory_item_id",
      "inventory_location_id",
      "inventory_uom_id",
      "service_type_id",
      "item_notchargable",
      "batchno",
      "expirydt",
      "grnno",
      "services_id",
      "insurance_yesno",
      "insurance_provider_id",
      "insurance_sub_id",
      "network_id",
      "insurance_network_office_id",
      "policy_number",
      "pre_approval",
      "quantity",
      "unit_cost",
      "gross_amount",
      "discount_amout",
      "discount_percentage",
      "net_amout",
      "copay_percentage",
      "copay_amount",
      "deductable_amount",
      "deductable_percentage",
      "tax_inclusive",
      "patient_tax",
      "company_tax",
      "total_tax",
      "patient_resp",
      "patient_payable",
      "comapany_resp",
      "company_payble",
      "sec_company",
      "sec_deductable_percentage",
      "sec_deductable_amount",
      "sec_company_res",
      "sec_company_tax",
      "sec_company_paybale",
      "sec_copay_percntage",
      "sec_copay_amount",
      "instructions",
    ];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_ordered_inventory(??) VALUES ?",
        values: input.billdetails,
        includeValues: IncludeValues,
        extraValues: {
          created_by: req.userIdentity.algaeh_d_app_user_id,
          created_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          hospital_id: req.userIdentity.hospital_id,
        },
        bulkInsertOrUpdate: true,
        printQuery: true,
      })
      .then((resultOrder) => {
        let servicesForPreAproval = [];
        let patient_id;
        let doctor_id;
        let visit_id;
        let ip_id;

        let services = new LINQ(req.body.billdetails)
          .Select((s) => {
            patient_id = s.patient_id;
            doctor_id = s.doctor_id;
            visit_id = s.visit_id;
            ip_id = s.ip_id;
            return s.services_id;
          })
          .ToArray();

        if (services.length > 0) {
          servicesForPreAproval.push(patient_id);
          servicesForPreAproval.push(doctor_id);
          if (req.body.source === "I") {
            servicesForPreAproval.push(ip_id);
          } else {
            servicesForPreAproval.push(visit_id);
          }

          servicesForPreAproval.push(services);

          let stQry = " and `visit_id`=? ";
          if (req.body.source === "I") {
            stQry = " and `ip_id`=? ";
          }

          _mysql
            .executeQuery({
              query:
                "SELECT hims_f_ordered_inventory_id,services_id,created_date, service_type_id from hims_f_ordered_inventory\
              where `patient_id`=? and `doctor_id`=? " +
                stQry +
                " and `services_id` in (?)",
              values: servicesForPreAproval,
              printQuery: true,
            })
            .then((ResultOfFetchOrderIds) => {
              let detailsPush = new LINQ(req.body.billdetails)
                .Where((g) => g.pre_approval == "Y")
                .Select((s) => {
                  return {
                    ...s,
                    ...{
                      hims_f_ordered_inventory_id: new LINQ(
                        ResultOfFetchOrderIds
                      )
                        .Where((w) => w.services_id == s.services_id)
                        .FirstOrDefault().hims_f_ordered_inventory_id,
                    },
                  };
                })
                .ToArray();
              if (detailsPush.length > 0) {
                const insurtCols = [
                  "ordered_services_id",
                  "service_id",
                  "insurance_provider_id",
                  "insurance_network_office_id",
                  "icd_code",
                  "requested_quantity",
                  "insurance_service_name",
                  "doctor_id",
                  "patient_id",
                  "gross_amt",
                  "net_amount",
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_service_approval(??) VALUES ?",
                    values: detailsPush,
                    includeValues: insurtCols,
                    replcaeKeys: [
                      {
                        service_id: "services_id",
                        gross_amt: "ser_gross_amt",
                        net_amount: "ser_net_amount",
                        hims_f_ordered_inventory: "hims_f_ordered_inventory_id",
                      },
                    ],
                    extraValues: {
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date(),
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((result) => {
                    _mysql.releaseConnection();
                    req.body.inventory_stock_detail = input.billdetails;
                    req.records = result;
                    next();
                  })
                  .catch((error) => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else {
                _mysql.releaseConnection();
                req.body.inventory_stock_detail = input.billdetails;
                req.records = { resultOrder, ResultOfFetchOrderIds };
                next();
              }

              // _mysql.releaseConnection();
              // req.records = result;
              // next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.body.inventory_stock_detail = input.billdetails;
          req.records = { resultOrder, ResultOfFetchOrderIds };
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
};

let addPackage_backup_may_07_2020 = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    if (input.length > 0) {
      input.forEach((val) => {
        if (!val.package_detail.length > 0) {
          req.records = {
            invalid_input: true,
            message: "Please provide valid  package detail",
          };
          next();
          return;
        }
      });

      for (let i = 0; i < input.length; i++) {
        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO `hims_f_package_header` (package_id,patient_id,visit_id,doctor_id,service_type_id,services_id,insurance_yesno,\
                insurance_provider_id,\
                insurance_sub_id,network_id,insurance_network_office_id,policy_number,pre_approval,\
                billed,quantity,unit_cost,gross_amount,discount_amout,discount_percentage,net_amout,\
                copay_percentage, copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax ,patient_resp, patient_payable, comapany_resp,\
                company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount, sec_company_res,\
                sec_company_tax, sec_company_paybale, sec_copay_percntage, sec_copay_amount, advance_amount, balance_amount, actual_utilize_amount, utilize_amount, actual_amount, package_type,\
                package_visit_type, pack_expiry_date, hospital_id,created_by, created_date,updated_by,updated_date)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
              ?,?,?,?,?,?,?)",
            values: [
              input[i].package_id,
              input[i].patient_id,
              input[i].visit_id,
              input[i].doctor_id,
              input[i].service_type_id,
              input[i].services_id,
              input[i].insurance_yesno,
              input[i].insurance_provider_id,
              input[i].insurance_sub_id,
              input[i].network_id,
              input[i].insurance_network_office_id,
              input[i].policy_number,
              input[i].pre_approval,
              input[i].billed,
              input[i].quantity,
              input[i].unit_cost,
              input[i].gross_amount,
              input[i].discount_amout,
              input[i].discount_percentage,
              input[i].net_amout,
              input[i].copay_percentage,
              input[i].copay_amount,
              input[i].deductable_amount,
              input[i].deductable_percentage,
              input[i].tax_inclusive,
              input[i].patient_tax,
              input[i].company_tax,
              input[i].total_tax,
              input[i].patient_resp,
              input[i].patient_payable,
              input[i].comapany_resp,
              input[i].company_payble,
              input[i].sec_company,
              input[i].sec_deductable_percentage,
              input[i].sec_deductable_amount,
              input[i].sec_company_res,
              input[i].sec_company_tax,
              input[i].sec_company_paybale,
              input[i].sec_copay_percntage,
              input[i].sec_copay_amount,
              input[i].advance_amount,
              input[i].balance_amount,
              0,
              input[i].utilize_amount,
              input[i].actual_amount,
              input[i].package_type,
              input[i].package_visit_type,
              input[i].pack_expiry_date,
              req.userIdentity.hospital_id,

              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
            ],
            printQuery: true,
          })
          .then((headerRes) => {
            if (headerRes.insertId > 0) {
              const insurtColumns = [
                "package_header_id",
                "service_type_id",
                "service_id",
                "service_amount",
                "qty",
                "tot_service_amount",
                "appropriate_amount",
                "available_qty",
              ];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_package_detail (??) VALUES ?",
                  values: input[i]["package_detail"],
                  includeValues: insurtColumns,
                  extraValues: {
                    package_header_id: headerRes.insertId,
                  },
                  bulkInsertOrUpdate: true,
                })
                .then((detailRes) => {
                  if (detailRes.affectedRows > 0) {
                    if (i == input.length - 1) {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = detailRes;
                        next();
                      });
                    }
                  } else {
                    _mysql.rollBackTransaction(() => {
                      req.records = {
                        invalid_input: true,
                        message: "inValid package details",
                      };
                      next();
                      return;
                    });
                  }
                })
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              _mysql.rollBackTransaction(() => {
                req.records = {
                  invalid_input: true,
                  message: "Provide valid package",
                };
                next();
                return;
              });
            }
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      }
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid Input",
      };

      next();
      return;
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:irfan
let addPackage = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    if (input.length > 0) {
      input.forEach((val) => {
        if (!val.package_detail.length > 0) {
          req.records = {
            invalid_input: true,
            message: "Please provide valid  package detail",
          };
          next();
          return;
        }
      });

      const { doctor_id, visit_id, patient_id, ip_id, source } = input[0];

      let insurtColumns = [
        "package_id",
        "patient_id",
        "visit_id",
        "ip_id",
        "doctor_id",
        "service_type_id",
        "services_id",
        "insurance_yesno",
        "insurance_provider_id",
        "insurance_sub_id",
        "network_id",
        "insurance_network_office_id",
        "policy_number",
        "pre_approval",
        "billed",
        "quantity",
        "unit_cost",
        "gross_amount",
        "discount_amout",
        "discount_percentage",
        "net_amout",
        "copay_percentage",
        "copay_amount",
        "deductable_amount",
        "deductable_percentage",
        "tax_inclusive",
        "patient_tax",
        "company_tax",
        "total_tax",
        "patient_resp",
        "patient_payable",
        "comapany_resp",
        "company_payble",
        "sec_company",
        "sec_deductable_percentage",
        "sec_deductable_amount",
        "sec_company_res",
        "sec_company_tax",
        "sec_company_paybale",
        "sec_copay_percntage",
        "sec_copay_amount",
        "advance_amount",
        "balance_amount",
        "utilize_amount",
        "actual_amount",
        "package_type",
        "package_visit_type",
        "pack_expiry_date",
      ];

      let strSource = " and visit_id= " + visit_id;
      if (source === "I") {
        strSource = " and ip_id= " + ip_id;
      }
      _mysql
        .executeQueryWithTransaction({
          query: "INSERT INTO hims_f_package_header (??) VALUES ?;",
          includeValues: insurtColumns,
          values: input,
          bulkInsertOrUpdate: true,

          extraValues: {
            hospital_id: req.userIdentity.hospital_id,
            created_date: new Date(),
            created_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          },

          printQuery: true,
        })
        .then((headerRes) => {
          _mysql
            .executeQuery({
              query: ` select hims_f_package_header_id,package_id from hims_f_package_header
                       where patient_id= ? ${strSource} and doctor_id=? and record_status='A' and billed='N' ; `,
              values: [patient_id, doctor_id],
              printQuery: true,
            })
            .then((headder) => {
              const detailsInsert = [];
              input.forEach((pack) => {
                let data = headder.find((f) => {
                  return f.package_id == pack.package_id;
                });

                pack.package_detail.forEach((item) => {
                  detailsInsert.push({
                    ...item,
                    package_header_id: data["hims_f_package_header_id"],
                  });
                });
              });

              const insrtColumns = [
                "package_header_id",
                "service_type_id",
                "service_id",
                "service_amount",
                "qty",
                "tot_service_amount",
                "appropriate_amount",
                "available_qty",
              ];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_package_detail (??) VALUES ?;",
                  values: detailsInsert,
                  includeValues: insrtColumns,
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                })
                .then((detailRes) => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = detailRes;
                    next();
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
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid Input",
      };

      next();
      return;
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:Nowshad
let deleteOrderedPackage = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    _mysql
      .executeQuery({
        query:
          "select package_header_id from `hims_f_package_detail` where package_header_id=? and utilized_qty > 0;",
        values: [input.hims_f_package_header_id],
        printQuery: true,
      })
      .then((packageUtilizedResult) => {
        if (packageUtilizedResult.length > 0) {
          req.records = {
            invalid_input: true,
            message:
              "In the deleting package already, services are utilized, cannot delete.",
          };
          next();
          return;
        } else {
          _mysql
            .executeQuery({
              query:
                "Delete from `hims_f_package_detail` where package_header_id=?; \
          Delete from `hims_f_package_header` where hims_f_package_header_id=?",
              values: [
                input.hims_f_package_header_id,
                input.hims_f_package_header_id,
              ],
              printQuery: true,
            })
            .then((deleteResult) => {
              _mysql.releaseConnection();
              req.records = deleteResult;
              next();
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        }
      })

      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
//created by:irfan
let getPatientPackage = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let str = "";
    if (req.query.patient_id > 0) {
      str += ` and H.patient_id=${req.query.patient_id} `;
    }
    if (req.query.hims_f_package_header_id > 0) {
      str += ` and H.hims_f_package_header_id=${req.query.hims_f_package_header_id} `;
    }

    // if (req.query.visit_id > 0 && req.query.package_visit_type == "ALL") {
    //   str += ` and H.visit_id=${req.query.visit_id} `;
    // }
    if (req.query.package_type == "S" || req.query.package_type == "D") {
      str += ` and H.package_type='${req.query.package_type}' `;
    }
    if (
      req.query.package_visit_type == "S" ||
      req.query.package_visit_type == "M"
    ) {
      str += ` and H.package_visit_type='${req.query.package_visit_type}' `;
    }

    if (req.query.package_visit_type != "ALL") {
      str += ` and H.package_visit_type='M' `;
    }

    if (req.query.closed != null) {
      str += ` and H.closed='${req.query.closed}' `;
    }
    _mysql
      .executeQuery({
        query: `select hims_f_package_header_id, package_id,ST.service_type,ST.hims_d_service_type_id, patient_id,H.created_date, visit_id, doctor_id, H.service_type_id,\
              services_id, insurance_yesno, insurance_provider_id, insurance_sub_id, network_id,\
              insurance_network_office_id, policy_number, pre_approval, apprv_status, billed, quantity, \
              unit_cost, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage, \
              copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax,\
              total_tax, patient_resp,patient_payable,comapany_resp, company_payble, sec_company,\
              sec_deductable_percentage, sec_deductable_amount, sec_company_res,sec_company_tax, \
              sec_company_paybale, sec_copay_percntage, sec_copay_amount, H.advance_amount, balance_amount,\ 
              actual_utilize_amount, actual_amount, utilize_amount, closed,closed_type,closed_remarks,\
              H.package_type,H.package_visit_type,PM.advance_amount as collect_advance, \
              (H.advance_amount - H.utilized_advance) as pack_advance_amount, H.hospital_id,\
              PM.package_name,P.full_name,P.patient_code, PM.cancellation_policy, \
              PM.cancellation_amount as can_amt, PM.package_code, ST.service_type, S.service_name, PM.advance_percentage \
              from hims_f_package_header H \
              inner join hims_d_package_header PM on PM.hims_d_package_header_id = H.package_id \
              inner join hims_f_patient P on H.patient_id = P.hims_d_patient_id \
              inner join  hims_d_services S on H.services_id = S.hims_d_services_id \
              inner join  hims_d_service_type ST on H.service_type_id = ST.hims_d_service_type_id \
              where H.record_status='A' \
              and H.hospital_id=?  ${str};
              select D.*,0 as quantity, D.service_id as services_id, ST.service_type, S.service_name \
              from hims_f_package_header H  \
              inner join hims_f_package_detail D on H.hims_f_package_header_id=D.package_header_id \
              inner join  hims_d_services S on D.service_id = S.hims_d_services_id \
              inner join  hims_d_service_type ST on D.service_type_id = ST.hims_d_service_type_id \
              where H.record_status='A' \
              and H.hospital_id=?  ${str};  `,
        values: [req.userIdentity.hospital_id, req.userIdentity.hospital_id],
        printQuery: true,
      })
      .then((result) => {
        let header = result[0];
        let details = result[1];

        // console.log("header", header);
        // console.log("req.query.visit_id", req.query.visit_id);
        const outputArray = [];
        header.forEach((item) => {
          const package_details = details.filter((detail) => {
            return (
              detail["package_header_id"] == item["hims_f_package_header_id"]
            );
          });
          if (req.query.visit_id > 0) {
            if (item.package_visit_type == "M") {
              outputArray.push({ ...item, package_details });
            } else if (
              item.package_visit_type == "S" &&
              req.query.visit_id == item.visit_id
            ) {
              outputArray.push({ ...item, package_details });
            }
          } else {
            outputArray.push({ ...item, package_details });
          }
        });

        _mysql.releaseConnection();
        req.records = outputArray;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//Delete ordered services
let deleteOrderService = (req, res, next) => {
  try {
    const _mysql = new algaehMysql({ path: keyPath });
    try {
      let strQuery = "";
      let strQry = "";
      if (req.body.service_type == "LAB") {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT hims_f_lab_order_id from hims_f_lab_order where ordered_services_id=?;",
          [req.body.hims_f_ordered_services_id]
        );
      } else if (req.body.service_type == "RAD") {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT hims_f_rad_order_id from hims_f_rad_order where ordered_services_id=?;",
          [req.body.hims_f_ordered_services_id]
        );
      } else {
        strQuery += "SELECT 1;";
      }

      if (req.body.trans_package_detail_id != null) {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT package_header_id, utilized_qty, available_qty, appropriate_amount, \
          tot_service_amount/qty as actual_utilize_amount from hims_f_package_detail \
          where hims_f_package_detail_id=?;",
          [req.body.trans_package_detail_id]
        );
      } else {
        strQuery += "SELECT 1;";
      }
      _mysql
        .executeQueryWithTransaction({
          query: strQuery,
          printQuery: true,
        })
        .then((result) => {
          let first_result = result[0][0];

          if (req.body.pre_approval == "Y") {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_service_approval where ordered_services_id=?;",
              [req.body.hims_f_ordered_services_id]
            );
          }
          if (req.body.service_type == "LAB") {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_ord_analytes where order_id=?; DELETE FROM hims_f_lab_sample where order_id=?;\
              DELETE FROM hims_f_lab_order where hims_f_lab_order_id=?; DELETE FROM hims_f_ordered_services \
              where hims_f_ordered_services_id=?;",
              [
                first_result.hims_f_lab_order_id,
                first_result.hims_f_lab_order_id,
                first_result.hims_f_lab_order_id,
                req.body.hims_f_ordered_services_id,
              ]
            );
          } else if (req.body.service_type == "RAD") {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_rad_order where hims_f_rad_order_id=?;\
              DELETE FROM hims_f_ordered_services where hims_f_ordered_services_id=?;",
              [
                first_result.hims_f_rad_order_id,
                req.body.hims_f_ordered_services_id,
              ]
            );
          } else {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_ordered_services where hims_f_ordered_services_id=?;",
              [req.body.hims_f_ordered_services_id]
            );
          }

          if (req.body.trans_package_detail_id != null) {
            let second_result = result[1][0];
            let utilized_qty =
              parseFloat(second_result.utilized_qty) -
              parseFloat(req.body.quantity);
            let available_qty =
              parseFloat(second_result.available_qty) +
              parseFloat(req.body.quantity);
            strQry += _mysql.mysqlQueryFormat(
              "UPDATE hims_f_package_detail set utilized_qty=?, available_qty=? \
              where hims_f_package_detail_id=?;",
              [utilized_qty, available_qty, req.body.trans_package_detail_id]
            );

            strQry += _mysql.mysqlQueryFormat(
              "UPDATE hims_f_package_header set utilize_amount=utilize_amount-?, \
              actual_utilize_amount=actual_utilize_amount-? where hims_f_package_header_id=?;",
              [
                second_result.appropriate_amount,
                second_result.actual_utilize_amount,
                second_result.package_header_id,
              ]
            );
          }

          _mysql
            .executeQuery({
              query: strQry,
              printQuery: true,
            })
            .then((delete_result) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = delete_result;
                next();
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  } catch (e) {
    next(e);
  }
};

let insertPhysiotherapyServices = (req, res, next) => {
  // console.log("insertPhysiotherapyServices")
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);

  try {
    // let inputParam = { ...req.body };
    // console.log("insertPhysiotherapyServices", req.records.ResultOfFetchOrderIds)
    // console.log("insertPhysiotherapyServices", req.body.billdetails)
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

    // console.log("physothServices", physothServices)

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
};

//Delete Inventory ordered Items
let deleteInvOrderedItems = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQueryWithTransaction({
        query:
          "SELECT hims_f_inventory_consumption_detail_id, inventory_consumption_header_id FROM hims_f_inventory_consumption_detail where ordered_inventory_id=?; \
          DELETE FROM hims_f_ordered_inventory where hims_f_ordered_inventory_id=?;\
          UPDATE hims_f_inventory_consumption_detail SET cancelled='Y' where ordered_inventory_id=?;",
        values: [
          req.body.hims_f_ordered_inventory_id,
          req.body.hims_f_ordered_inventory_id,
          req.body.hims_f_ordered_inventory_id,
        ],
        printQuery: true,
      })
      .then((res_result) => {
        req.connection = {
          connection: _mysql.connection,
          isTransactionConnection: _mysql.isTransactionConnection,
          pool: _mysql.pool,
          path: keyPath,
        };
        req.body.from_screen = "EHR";
        req.body.hims_f_inventory_consumption_detail_id =
          res_result[0][0].hims_f_inventory_consumption_detail_id;
        req.body.consumption_header_id =
          res_result[0][0].inventory_consumption_header_id;
        // _mysql.releaseConnection();
        // req.records = res_result[0];
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
};

function deleteOrderServices(options) {
  return new Promise((resolve, reject) => {
    try {
      let delete_order_services = options.delete_order_services;
      let _mysql = options._mysql;
      // console.log("delete_order_services", delete_order_services)
      if (
        delete_order_services !== undefined &&
        delete_order_services.length > 0
      ) {
        const lab_order_services = _.filter(delete_order_services, (f) => {
          return f.service_type === "LAB";
        });

        const rad_order_services = _.filter(delete_order_services, (f) => {
          return f.service_type === "RAD";
        });

        // console.log("lab_order_services", lab_order_services.length)
        // console.log("rad_order_services", rad_order_services.length)
        // let _salary_processed_emp = _.map(rad_order_services, o => {
        //   return o.hims_f_ordered_services_id;
        // });

        let strQuery = "";

        if (lab_order_services.length > 0) {
          let lab_order_ids = _.map(lab_order_services, (o) => {
            return o.hims_f_ordered_services_id;
          });
          strQuery += _mysql.mysqlQueryFormat(
            "SELECT hims_f_lab_order_id from hims_f_lab_order where ordered_services_id in (?);",
            [lab_order_ids]
          );
        } else {
          strQuery += "select 1 where 1=2;";
        }

        // console.log("strQuery", strQuery)

        _mysql
          .executeQueryWithTransaction({
            query: strQuery,
            printQuery: true,
          })
          .then((result) => {
            let strQry = "";
            let order_ids = _.map(delete_order_services, (o) => {
              return o.hims_f_ordered_services_id;
            });

            let hims_f_lab_order_ids = [];
            result.forEach((element) => {
              hims_f_lab_order_ids.push(element.hims_f_lab_order_id);
            });

            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_service_approval where ordered_services_id in (?);",
              [order_ids]
            );

            if (hims_f_lab_order_ids.length > 0) {
              strQry += _mysql.mysqlQueryFormat(
                "DELETE FROM hims_f_ord_analytes where order_id in (?); DELETE FROM hims_f_lab_sample where order_id in (?);\
                        DELETE FROM hims_f_lab_order where hims_f_lab_order_id in (?);",
                [
                  hims_f_lab_order_ids,
                  hims_f_lab_order_ids,
                  hims_f_lab_order_ids,
                ]
              );
            }
            if (rad_order_services.length > 0) {
              strQry += _mysql.mysqlQueryFormat(
                "DELETE FROM hims_f_rad_order where ordered_services_id in (?);",
                [order_ids]
              );
            }
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_ordered_services where hims_f_ordered_services_id in (?);",
              [order_ids]
            );
            // console.log("strQry", strQry)
            _mysql
              .executeQueryWithTransaction({
                query: strQry,
                printQuery: true,
              })
              .then((delete_result) => {
                console.log("delete_result");
                resolve();
              })
              .catch((error) => {
                console.log("error", error);
                options.next(error);
              });
          })
          .catch((error) => {
            options.next(e);
          });
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

export default {
  insertOrderedServices,
  getPreAprovalList,
  updatePreApproval,
  selectOrderServices,
  updateOrderedServices,
  updateOrderedServicesBilled,
  getOrderServices,
  selectOrderServicesbyDoctor,
  getMedicationAprovalList,
  updateMedicinePreApproval,
  updatePrescriptionDetail,
  getVisitConsumable,
  insertInvOrderedServices,
  load_orders_for_bill,
  addPackage,
  getPatientPackage,
  deleteOrderService,
  insertPhysiotherapyServices,
  deleteInvOrderedItems,
  deleteOrderedPackage,
  checkOrderedDetails,
  getAllServicesDateRange,
};
