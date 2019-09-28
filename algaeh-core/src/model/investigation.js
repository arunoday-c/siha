"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by irfan: to insert investigation
let addInvestigationTest = (req, res, next) => {
  let investigationModel = {
    short_description: null,
    description: null,
    investigation_type: null,
    lab_section_id: null,
    send_out_test: null,
    available_in_house: null,
    restrict_order: null,
    restrict_by: null,
    external_facility_required: null,
    facility_description: null,
    priority: null,
    cpt_id: null,
    category_id: null,
    specimen_id: null,
    container_id: null,
    container_code: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  debugFunction("addInvestigation");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(investigationModel, req.body);

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
          "insert into hims_d_investigation_test(short_description,description,investigation_type,lab_section_id,\
          send_out_test,available_in_house,restrict_order,restrict_by,\
          external_facility_required,facility_description,services_id,priority,cpt_id,category_id,film_category, screening_test, film_used,created_by,updated_by)values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.short_description,
            input.description,
            input.investigation_type,
            input.lab_section_id,
            input.send_out_test,
            input.available_in_house,
            input.restrict_order,
            input.restrict_by,
            input.external_facility_required,
            input.facility_description,
            input.services_id,
            input.priority,
            input.cpt_id,
            input.category_id,
            input.film_category,
            input.screening_test,
            input.film_used,
            input.created_by,
            input.updated_by
          ],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            // debugLog("Results are recorded...");

            if (results.insertId != null && input.investigation_type == "L") {
              req.body.test_id = results.insertId;
              debugLog(" test inserted id ", results.insertId);
              debugLog(" body ", req.body);

              connection.query(
                "insert into hims_m_lab_specimen(test_id,specimen_id,container_id,container_code,created_by,updated_by)\
                values(?,?,?,?,?,?)",
                [
                  results.insertId,
                  input.specimen_id,
                  input.container_id,
                  input.container_code,
                  input.created_by,
                  input.updated_by
                ],
                (error, spResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  debugLog(" specimen id :", spResult.insertId);
                  // req.records = spResult;
                  // next();

                  if (spResult.insertId != null) {
                    const insurtColumns = [
                      "analyte_id",
                      "analyte_type",
                      "result_unit",
                      "critical_low",
                      "critical_high",
                      "normal_low",
                      "normal_high",
                      "created_by",
                      "updated_by"
                    ];

                    connection.query(
                      "INSERT INTO hims_m_lab_analyte(" +
                        insurtColumns.join(",") +
                        ",`test_id`) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.analytes,
                          newFieldToInsert: [req.body.test_id],
                          req: req
                        })
                      ],
                      (error, analyteResult) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }

                        connection.commit(error => {
                          if (error) {
                            releaseDBConnection(db, connection);
                            next(error);
                          }
                          releaseDBConnection(db, connection);
                          req.records = analyteResult;
                          next();
                        });
                      }
                    );
                  }
                }
              );
            } else if (
              results.insertId != null &&
              input.investigation_type == "R"
            ) {
              const insurtColumns = [
                "template_name",
                "template_html",
                "template_status",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_d_rad_template_detail(" +
                  insurtColumns.join(",") +
                  ",`test_id`) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.RadTemplate,
                    newFieldToInsert: [req.body.test_id],
                    req: req
                  })
                ],
                (error, radiolgyResult) => {
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
                    req.records = radiolgyResult;
                    next();
                  });
                }
              );
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get list of all investigation tests
let getInvestigTestList = (req, res, next) => {
  let selectWhere = {
    hims_d_investigation_test_id: "ALL",
    lab_section_id: "ALL",
    category_id: "ALL",
    investigation_type: "ALL"
  };

  debugFunction("getListOfInsurenceProvider");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      // extend(insuranceWhereCondition, req.query);
      let where = whereCondition(extend(selectWhere, req.query));

      connection.query(
        "select hims_d_investigation_test_id, description, services_id,R.hims_d_rad_template_detail_id,R.template_name,\
        R.template_html,investigation_type,lab_section_id, send_out_test, available_in_house, restrict_order, restrict_by,\
        external_facility_required,facility_description, priority, cpt_id, category_id, film_category, screening_test,\
        film_used, A.analyte_id, A.hims_m_lab_analyte_id,A.critical_low,A.critical_high, A.normal_low,A.normal_high, \
        S.specimen_id,S.hims_m_lab_specimen_id \
        from hims_d_investigation_test T left  join  hims_d_rad_template_detail R on\
        T.hims_d_investigation_test_id = R.test_id left join hims_m_lab_specimen S on \
        S.test_id = T.hims_d_investigation_test_id  left join hims_m_lab_analyte A on \
        A.test_id=T.hims_d_investigation_test_id where" +
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

let updateInvestigationTest = (req, res, next) => {
  let investigationModel = {
    short_description: null,
    description: null,
    investigation_type: null,
    lab_section_id: null,
    send_out_test: null,
    available_in_house: null,
    restrict_order: null,
    restrict_by: null,
    external_facility_required: null,
    facility_description: null,
    priority: null,
    cpt_id: null,
    category_id: null,
    specimen_id: null,
    container_id: null,
    container_code: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    debugFunction("updateInvestigationTest ");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input body", req.body);
    let investigationDetails = extend(investigationModel, req.body);
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
        let queryBuilder =
          "UPDATE `hims_d_investigation_test`\
        SET   short_description=?,description=?,investigation_type=?,lab_section_id=?,send_out_test=?,available_in_house=?,\
        restrict_order=?,restrict_by=?,external_facility_required=?,facility_description=?,\
        services_id=?,priority=?,cpt_id=?,category_id=?,film_category=?,screening_test=?,film_used=?,updated_date=?,updated_by=?\
        WHERE record_status='A' AND `hims_d_investigation_test_id`=?;";
        let inputs = [
          investigationDetails.short_description,
          investigationDetails.description,
          investigationDetails.investigation_type,
          investigationDetails.lab_section_id,
          investigationDetails.send_out_test,
          investigationDetails.available_in_house,
          investigationDetails.restrict_order,
          investigationDetails.restrict_by,
          investigationDetails.external_facility_required,
          investigationDetails.facility_description,
          investigationDetails.services_id,
          investigationDetails.priority,
          investigationDetails.cpt_id,
          investigationDetails.category_id,
          investigationDetails.film_category,
          investigationDetails.screening_test,
          investigationDetails.film_used,
          new Date(),
          investigationDetails.updated_by,
          investigationDetails.hims_d_investigation_test_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (
            result != null &&
            investigationDetails.investigation_type == "L"
          ) {
            //m_lab_specimen update
            debugLog("inside L near specimen");

            connection.query(
              "UPDATE `hims_m_lab_specimen`\
              SET  specimen_id=?,container_id=?,container_code=?,updated_date=?,updated_by=?\
              WHERE record_status='A' AND `hims_m_lab_specimen_id`=?;",
              [
                investigationDetails.specimen_id,
                investigationDetails.container_id,
                investigationDetails.container_code,
                new Date(),
                investigationDetails.updated_by,
                investigationDetails.hims_m_lab_specimen_id
              ],
              (error, resultSpc) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                new Promise((resolve, reject) => {
                  try {
                    if (investigationDetails.insert_analytes.length != 0) {
                      const insurtColumns = [
                        "test_id",
                        "analyte_id",
                        "analyte_type",
                        "result_unit",
                        "critical_low",
                        "critical_high",
                        "normal_low",
                        "normal_high",
                        "created_by",
                        "updated_by"
                      ];

                      connection.query(
                        "INSERT INTO hims_m_lab_analyte(" +
                          insurtColumns.join(",") +
                          ") VALUES ?",
                        [
                          jsonArrayToObject({
                            sampleInputObject: insurtColumns,
                            arrayObj: investigationDetails.insert_analytes,
                            req: req
                          })
                        ],
                        (error, InsAnalyteResult) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                          return resolve(InsAnalyteResult);
                        }
                      );
                    } else {
                      return resolve();
                    }
                  } catch (e) {
                    reject(e);
                  }
                }).then(results => {
                  debugLog("inside LAB then");

                  //bulk analytes update
                  if (investigationDetails.update_analytes.length != 0) {
                    debugLog("inside L near analyte  bulk update analyte");
                    let inputParam = extend([], req.body.update_analytes);
                    debugLog("input analayte", inputParam);

                    let qry = "";

                    for (let i = 0; i < req.body.update_analytes.length; i++) {
                      qry +=
                        " UPDATE `hims_m_lab_analyte` SET record_status='" +
                        inputParam[i].record_status +
                        "', critical_low='" +
                        inputParam[i].critical_low +
                        "', critical_high='" +
                        inputParam[i].critical_high +
                        "', normal_low='" +
                        inputParam[i].normal_low +
                        "', normal_high='" +
                        inputParam[i].normal_high +
                        "', updated_date='" +
                        new Date().toLocaleString() +
                        "',updated_by=\
'" +
                        investigationDetails.updated_by +
                        "' WHERE hims_m_lab_analyte_id='" +
                        inputParam[i].hims_m_lab_analyte_id +
                        "';";
                    }

                    connection.query(qry, (error, result_anlyt) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      debugLog("analyte,deleted or update as Inactive ");
                      connection.commit(error => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        releaseDBConnection(db, connection);
                        req.records = result_anlyt;
                        next();
                      });
                    });
                  } else {
                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = results;
                      next();
                    });
                  }
                });
              }
            );
          } //bulk update rad_template
          else if (
            result != null &&
            investigationDetails.investigation_type == "R"
          ) {
            new Promise((resolve, reject) => {
              try {
                if (investigationDetails.insert_rad_temp.length != 0) {
                  const insurtColumns = [
                    "template_name",
                    "test_id",
                    "template_html",
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_d_rad_template_detail(" +
                      insurtColumns.join(",") +
                      ") VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtColumns,
                        arrayObj: investigationDetails.insert_rad_temp,
                        req: req
                      })
                    ],
                    (error, radiolgyResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      return resolve(radiolgyResult);
                    }
                  );
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            }).then(result => {
              debugLog("inside RAD then");
              if (investigationDetails.update_rad_temp.length != 0) {
                let inputParam = extend([], req.body.update_rad_temp);
                debugLog("input rad_update:", inputParam);

                let qry = "";

                for (let i = 0; i < req.body.update_rad_temp.length; i++) {
                  qry +=
                    " UPDATE `hims_d_rad_template_detail` SET template_name='" +
                    inputParam[i].template_name +
                    "',template_html='" +
                    inputParam[i].template_html +
                    "',template_status='" +
                    inputParam[i].template_status +
                    "', updated_date='" +
                    new Date().toLocaleString() +
                    "',updated_by='" +
                    investigationDetails.updated_by +
                    "',record_status='" +
                    inputParam[i].record_status +
                    "' WHERE hims_d_rad_template_detail_id='" +
                    inputParam[i].hims_d_rad_template_detail_id +
                    "' AND record_status='A' ;";
                }

                connection.query(qry, (error, result_rad_update) => {
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
                    req.records = result_rad_update;
                    next();
                  });
                });
              } else {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              }
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
export default {
  addInvestigationTest,
  getInvestigTestList,
  updateInvestigationTest
};
