"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  bulkInputArrayObject,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import { logger, debugFunction, debugLog } from "../utils/logging";

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
                      releaseDBConnection(db, connection);
                      next(error);
                    }
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
        "select hims_d_investigation_test_id, description, services_id,R.hims_d_rad_template_detail_id,R.template_name,R.template_html,\
        investigation_type,lab_section_id, send_out_test, available_in_house, restrict_order, restrict_by, external_facility_required,\
                 facility_description, priority, cpt_id, category_id, film_category, screening_test,film_used \
                 from hims_d_investigation_test T left  join  hims_d_rad_template_detail R on\
                 T.hims_d_investigation_test_id = R.test_id left join hims_m_lab_specimen S on \
                 S.test_id = T.hims_d_investigation_test_id  left  join hims_m_lab_analyte A on \
                 A.test_id=T.hims_d_investigation_test_id where" +
          where.condition,
        where.values,

        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

module.exports = { addInvestigationTest, getInvestigTestList };
