"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";
import { LINQ } from "node-linq";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by irfan: to add Patient Prescription
let addPatientPrescriptionBAckup = (req, res, next) => {
  debugFunction("addPatientPrescription");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`,\
           `prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`,hospital_id) values(\
            ?,?,?,?,?,?,?,?,?,?)",
          [
            input.patient_id,
            input.encounter_id,
            input.provider_id,
            input.episode_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.hospital_id
          ],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            // debugLog("Results are recorded...");

            if (results.insertId > 0) {
              req.body.prescription_id = results.insertId;

              const insurtColumns = [
                "item_id",
                "generic_id",
                "dosage",
                "service_id",
                "uom_id",
                "item_category_id",
                "item_group_id",
                "frequency",
                "no_of_days",
                "frequency_type",
                "frequency_time",
                "insured",
                "pre_approval",
                "instructions",
                "dispense"
              ];

              connection.query(
                "INSERT INTO hims_f_prescription_detail(" +
                  insurtColumns.join(",") +
                  ",`prescription_id`) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.medicationitems,
                    newFieldToInsert: [req.body.prescription_id],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  let servicesForPreAproval = [];

                  let services = new LINQ(req.body.medicationitems)
                    .Select(s => {
                      return s.service_id;
                    })
                    .ToArray();

                  if (services.length > 0) {
                    servicesForPreAproval.push(input.patient_id);
                    servicesForPreAproval.push(input.provider_id);
                    servicesForPreAproval.push(input.encounter_id);
                    servicesForPreAproval.push(input.episode_id);
                    servicesForPreAproval.push(results.insertId);
                    servicesForPreAproval.push(services);

                    connection.query(
                      "SELECT hims_f_prescription_detail_id, service_id from hims_f_prescription P, hims_f_prescription_detail PD\
                         where P.hims_f_prescription_id = PD.prescription_id and P.`patient_id`=? and \
                         P.`provider_id`=? and `encounter_id`=? and `episode_id`=? and \
                         `hims_f_prescription_id`=? and `services_id` in (?)",
                      servicesForPreAproval,
                      (error, ResultOfFetchOrderIds) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        let detailsPush = new LINQ(req.body.medicationitems)
                          .Where(g => g.pre_approval == "Y")
                          .Select(s => {
                            return {
                              ...s,
                              ...{
                                hims_f_prescription_detail_id: new LINQ(
                                  ResultOfFetchOrderIds
                                )
                                  .Where(w => w.services_id == s.services_id)
                                  .FirstOrDefault()
                                  .hims_f_prescription_detail_id
                              }
                            };
                          })
                          .ToArray();

                        //if request for pre-aproval needed
                        if (detailsPush.length > 0) {
                          const insurtCols = [
                            "prescription_id",
                            "item_id",
                            "service_id",
                            "insurance_provider_id",
                            "insurance_network_office_id",
                            "requested_quantity",
                            "insurance_service_name",
                            "doctor_id",
                            "patient_id",
                            "visit_id",
                            "gross_amt",
                            "net_amount",
                            "requested_quantity",
                            "approved_qty"
                          ];

                          connection.query(
                            "INSERT INTO hims_f_medication_approval(" +
                              insurtCols.join(",") +
                              ",created_by,updated_by) VALUES ?",
                            [
                              jsonArrayToObject({
                                sampleInputObject: insurtCols,
                                arrayObj: detailsPush,
                                replaceObject: [
                                  {
                                    originalKey: "prescription_id",
                                    NewKey: "hims_f_prescription_detail_id"
                                  }
                                ],
                                req: req,
                                newFieldToInsert: [
                                  req.userIdentity.algaeh_d_app_user_id,
                                  req.userIdentity.algaeh_d_app_user_id
                                ]
                              })
                            ],
                            (error, resultPreAprvl) => {
                              if (error) {
                                debugLog("Error 1 Here result ", error);
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }
                              req.records = {
                                resultPreAprvl,
                                ResultOfFetchOrderIds
                              };
                              next();
                            }
                          );
                        } else {
                          debugLog("Commit result ");
                          connection.commit(error => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            releaseDBConnection(db, connection);
                            req.records = {
                              detailResult,
                              ResultOfFetchOrderIds
                            };
                            next();
                          });
                        }
                      }
                    );
                  } else {
                    debugFunction("Else: ");

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = { detailResult, ResultOfFetchOrderIds };
                      next();
                    });
                  }
                }
              );
            } else {
              req.records = results;
              releaseDBConnection(db, connection);
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add Patient Prescription
let addPatientPrescription = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`,\
           `prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`,hospital_id) values(\
            ?,?,?,?,?,?,?,?,?,?)",
          [
            input.patient_id,
            input.encounter_id,
            input.provider_id,
            input.episode_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.hospital_id
          ],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            // debugLog("Results are recorded...");

            if (results.insertId > 0) {
              req.body.prescription_id = results.insertId;

              const insurtColumns = [
                "item_id",
                "generic_id",
                "dosage",
                "service_id",
                "uom_id",
                "item_category_id",
                "item_group_id",
                "frequency",
                "no_of_days",
                "frequency_type",
                "frequency_time",
                "insured",
                "pre_approval",
                "instructions"
              ];

              connection.query(
                "INSERT INTO hims_f_prescription_detail(" +
                  insurtColumns.join(",") +
                  ",`prescription_id`) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.medicationitems,
                    newFieldToInsert: [req.body.prescription_id],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  let services = new LINQ(req.body.medicationitems)
                    .Select(s => s.service_id)
                    .ToArray();

                  if (services.length > 0) {
                    connection.query(
                      "SELECT hims_f_prescription_detail_id, service_id from hims_f_prescription P, hims_f_prescription_detail PD\
                         where P.hims_f_prescription_id = PD.prescription_id and P.`patient_id`=? and \
                         P.`provider_id`=? and `encounter_id`=? and `episode_id`=? and hospital_id=? and `service_id` in (?)",
                      [
                        input.patient_id,
                        input.provider_id,
                        input.encounter_id,
                        input.episode_id,
                        req.userIdentity.hospital_id,
                        services
                      ],
                      (error, detail_res) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        let insertArr = [];
                        for (let i = 0; i < detail_res.length; i++) {
                          let pre_data = new LINQ(input.medicationitems)
                            .Where(
                              w =>
                                w.pre_approval == "Y" &&
                                w.service_id == detail_res[i]["service_id"]
                            )
                            .Select(s => {
                              return {
                                ...s,
                                prescription_detail_id:
                                  detail_res[i]["hims_f_prescription_detail_id"]
                              };
                            })
                            .ToArray();

                          insertArr.push(...pre_data);
                        }
                        //if request for pre-aproval needed
                        if (insertArr.length > 0) {
                          const insurtCols = [
                            "prescription_detail_id",
                            "item_id",
                            "service_id",
                            "requested_quantity",
                            "approved_qty",
                            "insurance_service_name",
                            "doctor_id",
                            "gross_amt",
                            "net_amount"
                          ];

                          connection.query(
                            "INSERT INTO hims_f_medication_approval(" +
                              insurtCols.join(",") +
                              ",created_by,updated_by,created_date,updated_date,insurance_provider_id,\
                              sub_insurance_id, network_id, insurance_network_office_id, patient_id, visit_id,\
                               hospital_id) VALUES ?",
                            [
                              jsonArrayToObject({
                                sampleInputObject: insurtCols,
                                arrayObj: insertArr,

                                req: req,
                                newFieldToInsert: [
                                  req.userIdentity.algaeh_d_app_user_id,
                                  req.userIdentity.algaeh_d_app_user_id,
                                  new Date(),
                                  new Date(),
                                  input.insurance_provider_id,
                                  input.sub_insurance_id,
                                  input.network_id,
                                  input.insurance_network_office_id,
                                  input.patient_id,
                                  input.visit_id,
                                  req.userIdentity.hospital_id
                                ]
                              })
                            ],
                            (error, resultPreAprvl) => {
                              if (error) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }

                              connection.commit(error => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }
                                releaseDBConnection(db, connection);
                                req.records = {
                                  resultPreAprvl,
                                  detail_res
                                };
                                next();
                              });
                            }
                          );
                        } else {
                          connection.commit(error => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            releaseDBConnection(db, connection);
                            req.records = {
                              detailResult,
                              detail_res
                            };
                            next();
                          });
                        }
                      }
                    );
                  } else {
                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = { detailResult, detail_res };
                      next();
                    });
                  }
                }
              );
            } else {
              req.records = results;
              releaseDBConnection(db, connection);
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: getPatientPrescription
let getPatientPrescription = (req, res, next) => {
  let selectWhere = {
    provider_id: "ALL",
    patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    const predate = req.query.prescription_date;
    delete req.query.prescription_date;
    req.query["date(prescription_date)"] = predate;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT H.hims_f_prescription_id,H.patient_id, P.patient_code,P.full_name,H.encounter_id, H.provider_id, H.episode_id, \
        H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,\
        D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time, D.start_date, D.item_status \
        from hims_f_prescription H,hims_f_prescription_detail D ,hims_f_patient P WHERE H.hims_f_prescription_id = D.prescription_id and P.hims_d_patient_id=H.patient_id and " +
          where.condition,
        where.values,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: Latest Prescription
let getPatientMedications = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          // "SELECT * FROM hims_f_prescription P, hims_f_prescription_detail PD \
          //   where P.hims_f_prescription_id=PD.prescription_id and patient_id=? and  \
          //   date(prescription_date) =(SELECT max(date(prescription_date))  FROM hims_f_prescription P, \
          //   hims_f_prescription_detail PD where P.hims_f_prescription_id=PD.prescription_id and patient_id=?);\
          //   SELECT * FROM hims_test_db.hims_f_prescription P, hims_f_prescription_detail PD \
          //   where P.hims_f_prescription_id=PD.prescription_id and patient_id=? ;",
          // values: [
          //   req.query.patient_id,
          //   req.query.patient_id,
          //   req.query.patient_id
          // ],
          " select P.episode_id,P.prescription_date,P.prescription_status,P.cancelled,\
 PD.item_id,IM.item_description,IM.item_code,PD.item_category_id,PD.generic_id,\
 PD.item_id,PD.item_category_id,PD.item_group_id,PD.dosage,PD.frequency,\
 PD.no_of_days,PD.dispense,PD.frequency_type,PD.frequency_time,PD.start_date,\
 PD.service_id,PD.uom_id,PD.item_status,PD.instructions,PD.insured,PD.pre_approval,\
 PD.apprv_status,PD.approved_amount,IG.generic_name \
 from hims_f_prescription as P inner join hims_f_prescription_detail as PD \
 on P.hims_f_prescription_id=PD.prescription_id inner join hims_d_item_master as IM \
 on PD.item_id = IM.hims_d_item_master_id inner join hims_d_item_generic as IG \
 on PD.generic_id = IG.hims_d_item_generic_id \
 where  patient_id=? \
  order by  prescription_date desc; ",
        values: [req.query.patient_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        let latest_mediction = [];
        let all_mediction = result;
        if (result.length > 0) {
          const getPrescriptionDate = result[0]["prescription_date"];
          latest_mediction = new LINQ(result)
            .Where(
              w =>
                moment(w.prescription_date).format("YYYYMMDD") ==
                moment(getPrescriptionDate).format("YYYYMMDD")
            )
            .Select(s => {
              return s;
            })
            .ToArray();
        }
        const actMedic = new LINQ(result)
          .Select(s => {
            const endDate = moment(s.start_date)
              .add(s.no_of_days, "days")
              .format("YYYY-MM-DD HH:mm:ss");

            return {
              ...s,
              enddate: endDate,
              active:
                parseInt(moment().format("YYYYMMDD")) <=
                parseInt(
                  moment(endDate, "YYYY-MM-DD HH:mm:ss").format("YYYYMMDD")
                )
                  ? true
                  : false
            };
          })
          .ToArray();
        const active_medication = new LINQ(actMedic)
          .Where(w => w.active == true)
          .ToArray();
        req.records = {
          latest_mediction,
          all_mediction,
          active_medication
        };

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
};

export default {
  addPatientPrescription,
  getPatientPrescription,
  getPatientMedications
};
