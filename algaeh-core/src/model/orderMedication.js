"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";
import { LINQ } from "node-linq";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import axios from "axios";
import "regenerator-runtime/runtime";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();
// const { PORTAL_HOST } = process.env;
const processENV = process.env;
const PORTAL_HOST = processENV.PORTAL_HOST ?? "http://localhost:4402/api/v1/";

const keyPath = require("algaeh-keys/keys");

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by irfan: to add Patient Prescription
let addPatientPrescriptionOLD = (req, res, next) => {
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
      connection.beginTransaction((error) => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`,\
          `visit_id`, `prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`,hospital_id) \
          values(?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.patient_id,
            input.encounter_id,
            input.provider_id,
            input.episode_id,
            input.visit_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.hospital_id,
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
                "med_units",
                "service_id",
                "uom_id",
                "item_category_id",
                "item_group_id",
                "frequency",
                "no_of_days",
                "frequency_type",
                "frequency_time",
                "frequency_route",
                "insured",
                "pre_approval",
                "instructions",
                "start_date",
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
                    req: req,
                  }),
                ],
                (error, detailResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  let services = new LINQ(req.body.medicationitems)
                    .Select((s) => s.service_id)
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
                        services,
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
                              (w) =>
                                w.pre_approval == "Y" &&
                                w.service_id == detail_res[i]["service_id"]
                            )
                            .Select((s) => {
                              return {
                                ...s,
                                prescription_detail_id:
                                  detail_res[i][
                                    "hims_f_prescription_detail_id"
                                  ],
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
                            "net_amount",
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
                                  req.userIdentity.hospital_id,
                                ],
                              }),
                            ],
                            (error, resultPreAprvl) => {
                              if (error) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }

                              connection.commit((error) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }
                                releaseDBConnection(db, connection);
                                req.records = {
                                  resultPreAprvl,
                                  detail_res,
                                };
                                next();
                              });
                            }
                          );
                        } else {
                          connection.commit((error) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            releaseDBConnection(db, connection);
                            req.records = {
                              detailResult,
                              detail_res,
                            };
                            next();
                          });
                        }
                      }
                    );
                  } else {
                    connection.commit((error) => {
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
let getFavMedication = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQueryWithTransaction({
        query: ` SELECT M.*, IM.item_description,IM.sales_uom_id as uom_id,IM.generic_id,IM.service_id,IM.group_id as item_group_id,
        IM.category_id as item_category_id, IG.generic_name FROM hims_f_favourite_icd_med M 
        inner join hims_d_item_master IM on IM.hims_d_item_master_id = M.item_id 
        inner join hims_d_item_generic IG on IG.hims_d_item_generic_id = IM.generic_id 
        where   M.added_provider_id=? ;`,
        values: [req.query.added_provider_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
let getPastMedication = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQueryWithTransaction({
        query: ` SELECT M.*, IM.item_description,C.hims_f_chronic_id,C.medication_category, IG.generic_name FROM hims_f_past_medication M 
        inner join hims_d_item_master IM on IM.hims_d_item_master_id = M.item_id 
        inner join hims_d_item_generic IG on IG.hims_d_item_generic_id = IM.generic_id 
       left  join hims_f_chronic C on (C.patient_id = M.patient_id and C.item_id=M.item_id and  C.medication_category="E")
        where   M.patient_id=? ;`,
        values: [req.query.patient_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
let deletePastMedication = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `DELETE from hims_f_past_medication where hims_f_past_medication_id=?`,
        values: [req.body.hims_f_past_medication_id],
        printQuery: true,
      })
      .then((result) => {
        if (req.body.hims_f_chronic_id) {
          try {
            _mysql
              .executeQuery({
                query: `Delete from hims_f_chronic Where hims_f_chronic_id =?`,
                values: [req.body.hims_f_chronic_id],
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
        } else {
          _mysql.releaseConnection();
          req.records = result;
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

let addPastMedication = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_f_past_medication` (`patient_id`, `item_id`, `dosage`, `frequency`,\
        `no_of_days`, `dispense`, `frequency_type`, `frequency_time`, `frequency_route`, `med_units`,\
        `start_date`,`instructions`) values(?,?,?,?,?,?,?,?,?,?,?,?);",
        values: [
          input.patient_id,
          input.item_id,
          input.dosage,
          input.frequency,
          input.no_of_days,
          input.dispense,
          input.frequency_type,
          input.frequency_time,
          input.frequency_route,
          input.med_units,
          input.start_date,
          input.instructions,
        ],
        printQuery: false,
      })
      .then((result) => {
        if (input.chronic_inactive === "Y") {
          _mysql
            .executeQueryWithTransaction({
              query: `INSERT INTO hims_f_chronic (item_id,chronic_inactive, medication_category, chronic_category, patient_id,
            visit_id, created_date, added_provider_id, updated_date, updated_provider_id
        ) values(?,?,?,?,?,?,?,?,?,?);`,
              values: [
                input.item_id,
                "N",
                "E",
                "M",
                input.patient_id,
                input.visit_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
              ],
            })
            .then((med) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let deletePatientPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "DELETE FROM hims_f_prescription_detail  WHERE hims_f_prescription_detail_id=?; \
          DELETE FROM hims_f_medication_approval where prescription_detail_id=?;\
          SELECT portal_exists FROM hims_d_hospital where hims_d_hospital_id=? ",
        values: [
          input.hims_f_prescription_detail_id,
          input.hims_f_prescription_detail_id,
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
      })
      .then(async (result) => {
        const portal_exists = result[2][0].portal_exists;

        // console.log("portal_exists", portal_exists);
        // consol.log("portal_exists", portal_exists);

        if (input.hims_f_chronic_id !== null) {
          _mysql
            .executeQuery({
              query: `Delete from hims_f_chronic Where hims_f_chronic_id =?`,
              values: [input.hims_f_chronic_id],
              printQuery: true,
            })
            .then(async (result) => {
              if (portal_exists === "Y") {
                const portal_data = {
                  patient_identity: input.primary_id_no,
                  item_name: input.item_description,
                  visit_code: input.visit_code,
                  delete_data: true,
                };

                // console.log("portal_data", portal_data);
                // consol.log("portal_data", portal_data);
                await axios
                  .post(
                    `${PORTAL_HOST}/info/deletePatientMedication`,
                    portal_data
                  )
                  .catch((e) => {
                    throw e;
                  });
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = result;
                  next();
                });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = result;
                  next();
                });
              }
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          if (portal_exists === "Y") {
            const portal_data = {
              patient_identity: input.primary_id_no,
              item_name: input.item_description,
              visit_code: input.visit_code,
              delete_data: true,
            };

            // console.log("else portal_data", portal_data);
            // consol.log("portal_data", portal_data);
            await axios
              .post(`${PORTAL_HOST}/info/deletePatientMedication`, portal_data)
              .catch((e) => {
                throw e;
              });
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          }
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
};

//created by irfan: to add Patient Prescription
function addChronic(data) {
  return new Promise((resolve, reject) => {
    const insurtColumn = ["item_id"];
    const { req, input, next, _mysql } = data;
    try {
      if (input.chronicMedicationsItems.length > 0) {
        _mysql
          .executeQueryWithTransaction({
            query: "INSERT INTO hims_f_chronic(??) VALUES ?",
            values: input.chronicMedicationsItems,
            includeValues: insurtColumn,
            printQuery: true,
            bulkInsertOrUpdate: true,
            extraValues: {
              medication_category: "I",
              chronic_category: "M",
              chronic_inactive: "N",
              patient_id: input.patient_id,
              visit_id: input.visit_id,
              created_date: new Date(),
              added_provider_id: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              updated_provider_id: req.userIdentity.algaeh_d_app_user_id,
              // hospital_id: req.userIdentity.hospital_id,
            },
          })

          .then(() => {
            resolve({});
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        resolve();
      }
    } catch (e) {
      next(e);
    }
  });
}

//created by sidhiqe: to add Medication to favourite
function addFavMedcine(data) {
  return new Promise((resolve, reject) => {
    const insurtColumn = ["item_id"];
    const { req, input, next, _mysql } = data;
    try {
      if (input.isFavMedicationsItems.length > 0) {
        _mysql
          .executeQueryWithTransaction({
            query: "INSERT INTO hims_f_favourite_icd_med(??) VALUES ?",
            values: input.isFavMedicationsItems,
            includeValues: insurtColumn,
            printQuery: true,
            bulkInsertOrUpdate: true,
            extraValues: {
              fav_category: "M",
              created_date: new Date(),
              added_provider_id: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              updated_provider_id: req.userIdentity.algaeh_d_app_user_id,
              // hospital_id: req.userIdentity.hospital_id,
            },
          })

          .then(() => {
            resolve({});
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        resolve();
      }
    } catch (e) {
      next(e);
    }
  });
}
let addPatientPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`,\
        `visit_id`, `ip_id`,`prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`,hospital_id) \
        values(?,?,?,?,?,?,?,?,?,?,?,?);",
        values: [
          input.patient_id,
          input.encounter_id,
          input.provider_id,
          input.episode_id,
          input.visit_id,
          input.ip_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        req.body.prescription_id = result.insertId;

        const insurtColumns = [
          "item_id",
          "generic_id",
          "dosage",
          "med_units",
          "service_id",
          "uom_id",
          "item_category_id",
          "item_group_id",
          "frequency",
          "no_of_days",
          "frequency_type",
          "frequency_time",
          "frequency_route",
          "insured",
          "pre_approval",
          "instructions",
          "start_date",
        ];

        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO hims_f_prescription_detail(??) VALUES ?; \
            SELECT portal_exists FROM hims_d_hospital where hims_d_hospital_id=" +
              req.userIdentity.hospital_id +
              ";",
            values: input.medicationitems,
            includeValues: insurtColumns,
            printQuery: true,
            bulkInsertOrUpdate: true,
            extraValues: {
              prescription_id: result.insertId,
            },
          })
          .then((resultDet) => {
            const portal_exists = resultDet[1][0].portal_exists;
            // console.log("portal_exists", portal_exists);
            // consol.log("portal_exists", portal_exists);
            let portal_data = [];

            if (portal_exists === "Y") {
              portal_data = input.medicationitems.map((m) => {
                return {
                  patient_identity: input.primary_id_no,
                  visit_code: input.visit_code,
                  visit_date: input.Encounter_Date,
                  generic_name: m.generic_name,
                  item_name: m.item_description,
                  no_of_days: m.no_of_days,
                  dosage: m.dosage,
                  frequency:
                    m.frequency === "0"
                      ? "1-0-1"
                      : m.frequency === "1"
                      ? "1-0-0"
                      : m.frequency === "2"
                      ? "0-0-1"
                      : m.frequency === "3"
                      ? "0-1-0"
                      : m.frequency === "4"
                      ? "1-1-0"
                      : m.frequency === "5"
                      ? "0-1-1"
                      : m.frequency === "6"
                      ? "1-1-1"
                      : m.frequency === "7"
                      ? "Once only"
                      : m.frequency === "8"
                      ? "Once daily (q24h)"
                      : m.frequency === "9"
                      ? "Twice daily (Bid)"
                      : m.frequency === "10"
                      ? "Three times daily (tid)"
                      : m.frequency === "18"
                      ? "Four times daily (qid)"
                      : m.frequency === "11"
                      ? "Five times daily"
                      : m.frequency === "12"
                      ? "Every two hours (q2h)"
                      : m.frequency === "13"
                      ? "Every three hours (q3h)"
                      : m.frequency === "14"
                      ? "Every four hours (q4h)"
                      : m.frequency === "15"
                      ? "Every six hours (q6h)"
                      : m.frequency === "16"
                      ? "Every eight hours (q8h)"
                      : m.frequency === "17"
                      ? "Every twelve hours (q12h)"
                      : m.frequency === "18"
                      ? "Four times daily (qid)"
                      : m.frequency === "19"
                      ? "Other (As per need)"
                      : null,
                  frequency_type:
                    m.frequency_type === "PD"
                      ? "Per Day"
                      : m.frequency_type === "PH"
                      ? "Per Hour"
                      : m.frequency_type === "PW"
                      ? "Per Week"
                      : m.frequency_type === "PM"
                      ? "Per Month"
                      : m.frequency_type === "AD"
                      ? "Alternate Day"
                      : m.frequency_type === "2W"
                      ? "Every 2 weeks"
                      : m.frequency_type === "2M"
                      ? "Every 2 months"
                      : m.frequency_type === "3M"
                      ? "Every 3 months"
                      : m.frequency_type === "4M"
                      ? "Every 4 months"
                      : m.frequency_type === "6M"
                      ? "Every 6 months"
                      : null,
                  frequency_time:
                    m.frequency_time === "BM"
                      ? "Before Meals"
                      : m.frequency_time === "AM"
                      ? "After Meals"
                      : m.frequency_time === "WF"
                      ? "With Food"
                      : m.frequency_time === "EM"
                      ? "Early Morning"
                      : m.frequency_time === "BB"
                      ? "Before Bed Time"
                      : m.frequency_time === "AB"
                      ? "At Bed Time"
                      : m.frequency_time === "NN"
                      ? "None"
                      : null,
                  frequency_route:
                    m.frequency_route === "BL"
                      ? "Buccal"
                      : m.frequency_route === "EL"
                      ? "Enteral"
                      : m.frequency_route === "IL"
                      ? "Inhalation"
                      : m.frequency_route === "IF"
                      ? "Infusion"
                      : m.frequency_route === "IM"
                      ? "Intramuscular Inj"
                      : m.frequency_route === "IT"
                      ? "Intrathecal Inj"
                      : m.frequency_route === "IV"
                      ? "Intravenous Inj"
                      : m.frequency_route === "NL"
                      ? "Nasal"
                      : m.frequency_route === "OP"
                      ? "Ophthalmic"
                      : m.frequency_route === "OR"
                      ? "Oral"
                      : m.frequency_route === "OE"
                      ? "Otic (ear)"
                      : m.frequency_route === "RL"
                      ? "Rectal"
                      : m.frequency_route === "ST"
                      ? "Subcutaneous"
                      : m.frequency_route === "SL"
                      ? "Sublingual"
                      : m.frequency_route === "TL"
                      ? "Topical"
                      : m.frequency_route === "TD"
                      ? "Transdermal"
                      : m.frequency_route === "VL"
                      ? "Vaginal"
                      : m.frequency_route === "IN"
                      ? "Intravitreal"
                      : m.frequency_route === "VR"
                      ? "Various"
                      : m.frequency_route === "IP"
                      ? "Intraperitoneal"
                      : m.frequency_route === "ID"
                      ? "Intradermal"
                      : m.frequency_route === "INV"
                      ? "Intravesical"
                      : m.frequency_route === "EP"
                      ? "Epilesional"
                      : null,
                  med_units: m.med_units,
                  instructions: m.instructions,
                  hospital_id: req.userIdentity.hospital_id,
                };
              });
            }

            addChronic({
              req: req,
              input: input,
              next: next,
              _mysql: _mysql,
            }).then(() => {
              addFavMedcine({
                req: req,
                input: input,
                next: next,
                _mysql: _mysql,
              }).then(async () => {
                let services = [];
                input.medicationitems.forEach((item) => {
                  services.push(item.service_id);
                });

                if (services.length > 0) {
                  _mysql
                    .executeQuery({
                      query:
                        "SELECT hims_f_prescription_detail_id, service_id from hims_f_prescription P, hims_f_prescription_detail PD\
                  where P.hims_f_prescription_id = PD.prescription_id and P.`patient_id`=? and \
                  P.`provider_id`=? and `encounter_id`=? and `episode_id`=? and hospital_id=? and `service_id` in (?)",
                      values: [
                        input.patient_id,
                        input.provider_id,
                        input.encounter_id,
                        input.episode_id,
                        req.userIdentity.hospital_id,
                        services,
                      ],

                      printQuery: true,
                    })
                    .then(async (detail_res) => {
                      let insertArr = [];

                      detail_res.forEach((recd) => {
                        let pre_aprov = input.medicationitems
                          .filter((f) => {
                            return (
                              f.pre_approval == "Y" &&
                              f.service_id == recd.service_id
                            );
                          })
                          .map((m) => {
                            return {
                              ...m,
                              prescription_detail_id:
                                recd["hims_f_prescription_detail_id"],
                            };
                          });

                        insertArr.push(...pre_aprov);
                      });

                      if (insertArr.length > 0) {
                        const insurtColumn = [
                          "prescription_detail_id",
                          "item_id",
                          "service_id",
                          "requested_quantity",
                          "approved_qty",
                          "insurance_service_name",
                          "doctor_id",
                          "gross_amt",
                          "net_amount",
                        ];

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO hims_f_medication_approval(??) VALUES ?",
                            values: insertArr,
                            includeValues: insurtColumn,
                            printQuery: false,
                            bulkInsertOrUpdate: true,
                            extraValues: {
                              insurance_provider_id:
                                input.insurance_provider_id,
                              sub_insurance_id: input.sub_insurance_id,
                              network_id: input.network_id,
                              insurance_network_office_id:
                                input.insurance_network_office_id,
                              patient_id: input.patient_id,
                              visit_id: input.visit_id,
                              created_date: new Date(),
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_date: new Date(),
                              updated_by: req.userIdentity.algaeh_d_app_user_id,
                              hospital_id: req.userIdentity.hospital_id,
                            },
                          })
                          .then(async (med) => {
                            if (portal_exists === "Y") {
                              // console.log(" eif portal_data", portal_data);
                              // consol.log("portal_data", portal_data);
                              await axios
                                .post(
                                  `${PORTAL_HOST}/info/patientMedication`,
                                  portal_data
                                )
                                .catch((e) => {
                                  throw e;
                                });
                              _mysql.commitTransaction(() => {
                                _mysql.releaseConnection();
                                req.records = resultDet;
                                next();
                              });
                            } else {
                              _mysql.commitTransaction(() => {
                                _mysql.releaseConnection();
                                req.records = resultDet;
                                next();
                              });
                            }
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      } else {
                        if (portal_exists === "Y") {
                          // console.log("else portal_data", portal_data);
                          // consol.log("portal_data", portal_data);
                          await axios
                            .post(
                              `${PORTAL_HOST}/info/patientMedication`,
                              portal_data
                            )
                            .catch((e) => {
                              throw e;
                            });
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = resultDet;
                            next();
                          });
                        } else {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = resultDet;
                            next();
                          });
                        }
                      }
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else {
                  if (portal_exists === "Y") {
                    // console.log("last portal_data", portal_data);
                    // consol.log("portal_data", portal_data);
                    await axios
                      .post(
                        `${PORTAL_HOST}/info/patientMedication`,
                        portal_data
                      )
                      .catch((e) => {
                        throw e;
                      });
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = resultDet;
                      next();
                    });
                  } else {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = resultDet;
                      next();
                    });
                  }
                }
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
let updatePatientPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body.medicationobj;

    let strQuery = "";
    if (input.hims_f_chronic_id > 0 && input.chronic_inactive === "N") {
      strQuery += mysql.format(
        "DELETE FROM `hims_f_chronic` where hims_f_chronic_id=?;",
        [input.hims_f_chronic_id]
      );
    }
    if (input.hims_f_chronic_id === null && input.chronic_inactive === "Y") {
      strQuery += mysql.format(
        "INSERT INTO hims_f_chronic (item_id,chronic_inactive, medication_category, chronic_category, patient_id,\
          visit_id, created_date, added_provider_id, updated_date, updated_provider_id\
      ) values(?,?,?,?,?,?,?,?,?,?);",
        [
          input.item_id,
          "N",
          "E",
          "M",
          input.patient_id,
          input.visit_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
        ]
      );
    }

    _mysql
      .executeQueryWithTransaction({
        query:
          `Update hims_f_prescription_detail set item_id=?,generic_id=?,dosage=?,med_units=?,
          service_id=?,uom_id=?,item_category_id=?,item_group_id=?,frequency=?,no_of_days=?,frequency_type=?,
          frequency_time=?,frequency_route=?,instructions=?,start_date=? where hims_f_prescription_detail_id=?;
          SELECT portal_exists FROM hims_d_hospital where hims_d_hospital_id=?;` +
          strQuery,
        values: [
          input.item_id,
          input.generic_id,
          input.dosage,
          input.med_units,
          input.service_id,
          input.uom_id,
          input.item_category_id,
          input.item_group_id,
          input.frequency,
          input.no_of_days,
          input.frequency_type,
          input.frequency_time,
          input.frequency_route,
          input.instructions,
          input.start_date,
          input.hims_f_prescription_detail_id,
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
      })
      .then(async (result) => {
        const portal_exists = result[1][0].portal_exists;

        // console.log("portal_exists", portal_exists);
        // consol.log("portal_exists", portal_exists);

        if (portal_exists === "Y") {
          const portal_data = {
            patient_identity: input.primary_id_no,
            visit_code: input.visit_code,
            no_of_days: input.no_of_days,
            dosage: input.dosage,
            frequency:
              input.frequency === "0"
                ? "1-0-1"
                : input.frequency === "1"
                ? "1-0-0"
                : input.frequency === "2"
                ? "0-0-1"
                : input.frequency === "3"
                ? "0-1-0"
                : input.frequency === "4"
                ? "1-1-0"
                : input.frequency === "5"
                ? "0-1-1"
                : input.frequency === "6"
                ? "1-1-1"
                : input.frequency === "7"
                ? "Once only"
                : input.frequency === "8"
                ? "Once daily (q24h)"
                : input.frequency === "9"
                ? "Twice daily (Bid)"
                : input.frequency === "10"
                ? "Three times daily (tid)"
                : input.frequency === "11"
                ? "Five times daily"
                : input.frequency === "12"
                ? "Every two hours (q2h)"
                : input.frequency === "13"
                ? "Every three hours (q3h)"
                : input.frequency === "14"
                ? "Every four hours (q4h)"
                : input.frequency === "15"
                ? "Every six hours (q6h)"
                : input.frequency === "16"
                ? "Every eight hours (q8h)"
                : input.frequency === "17"
                ? "Every twelve hours (q12h)"
                : input.frequency === "18"
                ? "Four times daily (qid)"
                : input.frequency === "19"
                ? "Other (As per need)"
                : null,
            frequency_type:
              input.frequency_type === "PD"
                ? "Per Day"
                : input.frequency_type === "PH"
                ? "Per Hour"
                : input.frequency_type === "PW"
                ? "Per Week"
                : input.frequency_type === "PM"
                ? "Per Month"
                : input.frequency_type === "AD"
                ? "Alternate Day"
                : input.frequency_type === "2W"
                ? "Every 2 weeks"
                : input.frequency_type === "2M"
                ? "Every 2 months"
                : input.frequency_type === "3M"
                ? "Every 3 months"
                : input.frequency_type === "4M"
                ? "Every 4 months"
                : input.frequency_type === "6M"
                ? "Every 6 months"
                : null,
            frequency_time:
              input.frequency_time === "BM"
                ? "Before Meals"
                : input.frequency_time === "AM"
                ? "After Meals"
                : input.frequency_time === "WF"
                ? "With Food"
                : input.frequency_time === "EM"
                ? "Early Morning"
                : input.frequency_time === "BB"
                ? "Before Bed Time"
                : input.frequency_time === "AB"
                ? "At Bed Time"
                : input.frequency_time === "NN"
                ? "None"
                : null,
            frequency_route:
              input.frequency_route === "BL"
                ? "Buccal"
                : input.frequency_route === "EL"
                ? "Enteral"
                : input.frequency_route === "IL"
                ? "Inhalation"
                : input.frequency_route === "IF"
                ? "Infusion"
                : input.frequency_route === "IM"
                ? "Intramuscular Inj"
                : input.frequency_route === "IT"
                ? "Intrathecal Inj"
                : input.frequency_route === "IV"
                ? "Intravenous Inj"
                : input.frequency_route === "NL"
                ? "Nasal"
                : input.frequency_route === "OP"
                ? "Ophthalmic"
                : input.frequency_route === "OR"
                ? "Oral"
                : input.frequency_route === "OE"
                ? "Otic (ear)"
                : input.frequency_route === "RL"
                ? "Rectal"
                : input.frequency_route === "ST"
                ? "Subcutaneous"
                : input.frequency_route === "SL"
                ? "Sublingual"
                : input.frequency_route === "TL"
                ? "Topical"
                : input.frequency_route === "TD"
                ? "Transdermal"
                : input.frequency_route === "VL"
                ? "Vaginal"
                : input.frequency_route === "IN"
                ? "Intravitreal"
                : input.frequency_route === "VR"
                ? "Various"
                : input.frequency_route === "IP"
                ? "Intraperitoneal"
                : input.frequency_route === "ID"
                ? "Intradermal"
                : input.frequency_route === "INV"
                ? "Intravesical"
                : input.frequency_route === "EP"
                ? "Epilesional"
                : null,
            med_units: input.med_units,
            instructions: input.instructions,
            item_name: input.item_description,
          };

          // console.log("portal_data", portal_data);
          // consol.log("portal_data", portal_data);
          await axios
            .post(`${PORTAL_HOST}/info/deletePatientMedication`, portal_data)
            .catch((e) => {
              throw e;
            });
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
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
};
//created by irfan: getPatientPrescription
let getPatientPrescriptionOLD = (req, res, next) => {
  let selectWhere = {
    provider_id: "ALL",
    patient_id: "ALL",
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
        H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,D.med_units,\
        D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time,D.frequency_route, D.start_date, D.item_status \
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
let getPatientPrescription = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.query;

    let strQry = "";
    if (input.patient_id > 0) {
      strQry += " and patient_id=" + input.patient_id;
    }

    if (input.provider_id > 0) {
      strQry += " and provider_id=" + input.provider_id;
    }
    if (input.prescription_date) {
      strQry +=
        " and date(prescription_date)= '" + input.prescription_date + "'";
    }

    // console.log("strQry", strQry);
    _mysql
      .executeQuery({
        query:
          "SELECT H.hims_f_prescription_id,H.visit_id,H.patient_id, P.patient_code,P.full_name,H.encounter_id, H.provider_id, H.episode_id, \
        H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,D.med_units,\
        D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time, D.frequency_route,D.start_date, D.item_status \
        from hims_f_prescription H,hims_f_prescription_detail D ,hims_f_patient P WHERE H.hims_f_prescription_id = D.prescription_id\
         and P.hims_d_patient_id=H.patient_id " +
          strQry,

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
          `select P.hims_f_prescription_id,PD.hims_f_prescription_detail_id,C.hims_f_chronic_id,C.medication_category,P.episode_id,P.prescription_date,P.prescription_status,P.cancelled,
            PD.item_id,IM.item_description,IM.item_code,PD.item_category_id,PD.generic_id,
            PD.item_id,PD.item_category_id,PD.item_group_id,PD.dosage,PD.med_units,PD.frequency,
            PD.no_of_days,PD.dispense,PD.frequency_type,PD.frequency_time,PD.frequency_route,PD.start_date,
            PD.service_id,PD.uom_id,PD.item_status,PD.instructions,PD.insured,PD.pre_approval,
            PD.apprv_status,PD.approved_amount,IG.generic_name, hims_f_chronic_id 
            from hims_f_prescription as P 
            inner join hims_f_prescription_detail as PD on P.hims_f_prescription_id=PD.prescription_id 
            inner join hims_d_item_master as IM on PD.item_id = IM.hims_d_item_master_id 
            inner join hims_d_item_generic as IG on PD.generic_id = IG.hims_d_item_generic_id 
            left  join hims_f_chronic C on (C.patient_id = P.patient_id and C.item_id=PD.item_id and
            C.medication_category="I")
            where  P.patient_id=? 
            order by  prescription_date desc;`,
        values: [req.query.patient_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        let latest_mediction = [];
        let all_mediction = [];

        if (result.length > 0) {
          const getPrescriptionDate = result[0]["prescription_date"];
          all_mediction = new LINQ(result)
            .Where(
              (w) =>
                moment(w.prescription_date).format("YYYYMMDD") !=
                moment(getPrescriptionDate).format("YYYYMMDD")
            )
            .Select((s) => {
              return s;
            })
            .ToArray();
          latest_mediction = new LINQ(result)
            .Where(
              (w) =>
                moment(w.prescription_date).format("YYYYMMDD") ==
                moment(getPrescriptionDate).format("YYYYMMDD")
            )
            .Select((s) => {
              return s;
            })
            .ToArray();
        }
        const actMedic = new LINQ(result)
          .Select((s) => {
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
                  : false,
            };
          })
          .ToArray();
        const active_medication = new LINQ(actMedic)
          .Where((w) => w.active == true)
          .ToArray();
        req.records = {
          latest_mediction,
          all_mediction,
          active_medication,
        };

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

export default {
  addPatientPrescription,
  getPatientPrescription,
  getPatientMedications,
  addPastMedication,
  getPastMedication,
  getFavMedication,
  deletePastMedication,
  deletePatientPrescription,
  updatePatientPrescription,
};
