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
    created_by: null,
    updated_by: null
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
          external_facility_required,facility_description,priority,cpt_id,category_id,film_category, screening_test, film_used,created_by,updated_by)values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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

            if (results.insertId != null) {
              req.body.test_id = results.insertId;
              debugLog(" test inserted id ", results.insertId);
              debugLog(" body ", req.body);

              connection.query(
                "insert into hims_m_lab_specimen(test_id,specimen_id,created_by,updated_by)values(\
                ?,?,?,?)",
                [
                  results.insertId,
                  input.specimen_id,
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
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { addInvestigationTest };
