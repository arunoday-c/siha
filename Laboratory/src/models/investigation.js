import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";
import mysql from "mysql";

export default {
  getInvestigTestList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getInvestigTestList: ");
      let inputValues = [];
      let _stringData = "";

      if (req.query.hims_d_investigation_test_id != null) {
        _stringData += " and hims_d_investigation_test_id=?";
        inputValues.push(req.query.hims_d_investigation_test_id);
      }

      if (req.query.lab_section_id != null) {
        _stringData += " and lab_section_id=?";
        inputValues.push(req.query.lab_section_id);
      }

      if (req.query.category_id != null) {
        _stringData += " and category_id=?";
        inputValues.push(req.query.category_id);
      }

      if (req.query.investigation_type != null) {
        _stringData += " and investigation_type=?";
        inputValues.push(req.query.investigation_type);
      }

      // utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            "select hims_d_investigation_test_id, T.test_code, T.description, services_id, \
            T.investigation_type, lab_section_id, send_out_test, available_in_house, \
            restrict_order, restrict_by, external_facility_required, \
            facility_description,  priority, cpt_id, category_id, film_category, screening_test, film_used,isPCR, \
            TC.test_section, S.specimen_id, S.hims_m_lab_specimen_id, S.container_id,SER.service_name, \
            tat_standard_time, culture_test from hims_d_investigation_test T \
            left join hims_m_lab_specimen S on S.test_id = T.hims_d_investigation_test_id  \
            left join hims_d_test_category TC on TC.hims_d_test_category_id = T.category_id \
            left join hims_d_services as SER on T.services_id = SER.hims_d_services_id \
            where 1=1" +
            _stringData +
            " order by hims_d_investigation_test_id desc",
          values: inputValues,
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
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
  },
  getInvestigTestAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getInvestigTestList: ");

      // utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            "select A.analyte_id,A.analyte_report_group,A.includeInReport,  A.hims_m_lab_analyte_id, A.critical_low, A.gender, A.from_age, \
            A.to_age, A.age_type, A.critical_high,  LA.analyte_type,\
            LA.description as analyte_description,  A.normal_low, A.normal_high, \
            A.formula,A.display_formula,A.decimals from hims_m_lab_analyte A \
            INNER JOIN hims_d_lab_analytes as LA on LA.hims_d_lab_analytes_id=A.analyte_id \
            where test_id=? order by A.display_order",
          values: [req.query.hims_d_investigation_test_id],
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
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
  },
  getInvestigTestTemplate: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getInvestigTestList: ");

      // utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            "select hims_d_rad_template_detail_id, template_name, template_html from hims_d_rad_template_detail \
          where test_id=? order by hims_d_rad_template_detail_id",
          values: [req.query.hims_d_investigation_test_id],
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
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
  },
  updateAnalyteGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const {
        analyte_report_group,
        includeInReport,
        hims_m_lab_analyte_id,
        display_formula,
        original_formula,
        decimals,
      } = req.body;
      _mysql
        .executeQuery({
          query: `UPDATE hims_m_lab_analyte SET analyte_report_group =?,includeInReport=?,formula=?,display_formula=?,decimals=? WHERE (hims_m_lab_analyte_id = ?);`,
          values: [
            analyte_report_group,
            includeInReport,
            original_formula,
            display_formula,
            decimals,
            hims_m_lab_analyte_id,
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
  },

  addInvestigationTest: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("addInvestigationTest: ");
      let input = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "insert into hims_d_investigation_test(test_code, short_description,description,investigation_type,\
            lab_section_id, send_out_test,available_in_house,restrict_order,restrict_by,\
            external_facility_required,facility_description,services_id,priority,cpt_id,category_id,\
            film_category, screening_test, film_used,isPCR, tat_standard_time, culture_test, created_by,updated_by)\
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.test_code,
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
            input.isPCR,
            input.tat_standard_time,
            input.culture_test,
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.algaeh_d_app_user_id,
          ],

          printQuery: true,
        })
        .then((results) => {
          utilities.logger().log("results: ", results);
          utilities
            .logger()
            .log("investigation_type: ", input.investigation_type);
          req.body.test_id = results.insertId;
          if (results.insertId != null && input.investigation_type == "L") {
            utilities.logger().log("specimen_id: ", input.specimen_id);
            _mysql
              .executeQuery({
                query:
                  "insert into hims_m_lab_specimen(test_id,specimen_id,container_id,container_code,created_by,updated_by)\
              values(?,?,?,?,?,?)",
                values: [
                  results.insertId,
                  input.specimen_id,
                  input.container_id,
                  input.container_code,
                  req.userIdentity.algaeh_d_app_user_id,
                  req.userIdentity.algaeh_d_app_user_id,
                ],
                printQuery: true,
              })
              .then((spResult) => {
                if (spResult.insertId != null) {
                  if (req.body.analytes.length > 0) {
                    utilities.logger().log("spResult: ", spResult);
                    const IncludeValues = [
                      "analyte_id",
                      "analyte_report_group",
                      "analyte_type",
                      "result_unit",
                      "age_type",
                      "gender",
                      "from_age",
                      "to_age",
                      "critical_low",
                      "critical_high",
                      "normal_low",
                      "normal_high",
                      "display_order",
                      "includeInReport",
                    ];

                    _mysql
                      .executeQuery({
                        query: "INSERT INTO hims_m_lab_analyte(??) VALUES ?",
                        values: req.body.analytes,
                        includeValues: IncludeValues,
                        extraValues: {
                          test_id: req.body.test_id,
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true,
                      })
                      .then((analyteResult) => {
                        utilities
                          .logger()
                          .log("analyteResult: ", analyteResult);
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = analyteResult;
                          next();
                        });
                      })
                      .catch((e) => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = spResult;
                      next();
                    });
                  }
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else if (
            results.insertId != null &&
            input.investigation_type == "R"
          ) {
            const IncludeValues = [
              "template_name",
              "template_html",
              "template_status",
            ];

            utilities.logger().log("RadTemplate: ", input.RadTemplate);

            _mysql
              .executeQuery({
                query: "INSERT INTO hims_d_rad_template_detail(??) VALUES ?",
                values: req.body.RadTemplate,
                includeValues: IncludeValues,
                extraValues: {
                  test_id: req.body.test_id,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                },
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then((radiolgyResult) => {
                utilities.logger().log("radiolgyResult: ", radiolgyResult);
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = radiolgyResult;
                  next();
                });
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
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  updateInvestigationTest: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("updateInvestigationTest: ");
      let inputParam = req.body;

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_investigation_test` SET test_code=?, short_description=?,description=?,investigation_type=?,\
            lab_section_id=?, send_out_test=?,available_in_house=?,restrict_order=?,restrict_by=?,\
            external_facility_required=?,facility_description=?,services_id=?,priority=?,cpt_id=?,\
            category_id=?,film_category=?,screening_test=?,film_used=?,isPCR=?,tat_standard_time=?,culture_test=?, \
            updated_date=?,updated_by=?\
            WHERE record_status='A' AND `hims_d_investigation_test_id`=?;",
          values: [
            inputParam.test_code,
            inputParam.short_description,
            inputParam.description,
            inputParam.investigation_type,
            inputParam.lab_section_id,
            inputParam.send_out_test,
            inputParam.available_in_house,
            inputParam.restrict_order,
            inputParam.restrict_by,
            inputParam.external_facility_required,
            inputParam.facility_description,
            inputParam.services_id,
            inputParam.priority,
            inputParam.cpt_id,
            inputParam.category_id,
            inputParam.film_category,
            inputParam.screening_test,
            inputParam.film_used,
            inputParam.isPCR,
            inputParam.tat_standard_time,
            inputParam.culture_test,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_investigation_test_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          if (result != null && inputParam.investigation_type == "L") {
            let execute_query = {};
            // utilities
            //   .logger()
            //   .log(
            //     "hims_m_lab_specimen_id: ",
            //     inputParam.hims_m_lab_specimen_id
            //   );
            if (inputParam.hims_m_lab_specimen_id == null) {
              execute_query = {
                query:
                  "insert into hims_m_lab_specimen(test_id,specimen_id,container_id,container_code,\
                    created_by,updated_by) values(?,?,?,?,?,?)",
                values: [
                  inputParam.hims_d_investigation_test_id,
                  inputParam.specimen_id,
                  inputParam.container_id,
                  inputParam.container_code,
                  req.userIdentity.algaeh_d_app_user_id,
                  req.userIdentity.algaeh_d_app_user_id,
                ],
                printQuery: true,
              };
            } else {
              execute_query = {
                query:
                  "UPDATE `hims_m_lab_specimen` SET  specimen_id=?,container_id=?,container_code=?,\
                  updated_date=?,updated_by=? WHERE record_status='A' AND `hims_m_lab_specimen_id`=?;",
                values: [
                  inputParam.specimen_id,
                  inputParam.container_id,
                  inputParam.container_code,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.hims_m_lab_specimen_id,
                ],
                printQuery: true,
              };
            }

            // utilities.logger().log("execute_query: ", execute_query);
            _mysql
              .executeQuery(execute_query)
              .then((resultSpc) => {
                // utilities.logger().log("resultSpc: ", resultSpc);
                new Promise((resolve, reject) => {
                  try {
                    const insert_analytes = inputParam.analytes.filter(
                      (f) =>
                        f.hims_d_investigation_test_id === null ||
                        f.hims_d_investigation_test_id === undefined
                    );
                    // console.log("insert_analytes", insert_analytes);
                    if (insert_analytes.length != 0) {
                      const IncludeValues = [
                        "test_id",
                        "analyte_id",
                        "analyte_report_group",
                        "analyte_type",
                        "result_unit",
                        "age_type",
                        "gender",
                        "from_age",
                        "to_age",
                        "critical_low",
                        "critical_high",
                        "normal_low",
                        "normal_high",
                        "display_order",
                      ];

                      _mysql
                        .executeQuery({
                          query: "INSERT INTO hims_m_lab_analyte(??) VALUES ?",
                          values: insert_analytes,
                          includeValues: IncludeValues,
                          extraValues: {
                            created_by: req.userIdentity.algaeh_d_app_user_id,
                            updated_by: req.userIdentity.algaeh_d_app_user_id,
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: true,
                        })
                        .then((InsAnalyteResult) => {
                          return resolve(InsAnalyteResult);
                        })
                        .catch((e) => {
                          reject(e);
                        });
                    } else {
                      return resolve();
                    }
                  } catch (e) {
                    reject(e);
                  }
                })
                  .then((results) => {
                    const update_analytes = inputParam.analytes.filter(
                      (f) => f.hims_d_investigation_test_id > 0
                    );
                    console.log("update_analytes", update_analytes);
                    if (update_analytes.length != 0) {
                      // let update_analytes = req.body.update_analytes;
                      let qry = "";
                      for (let i = 0; i < update_analytes.length; i++) {
                        qry += mysql.format(
                          "UPDATE `hims_m_lab_analyte` SET record_status=?,\
                        `critical_low`=?, `critical_high`=?, `normal_low`=?, `normal_high`=?,\
                          `from_age`=?, `to_age`=?, `age_type`=?, `gender`=?, display_order=?,includeInReport=?, \
                        updated_date=?, updated_by=? where hims_m_lab_analyte_id=?;",
                          [
                            update_analytes[i].record_status,
                            update_analytes[i].critical_low,
                            update_analytes[i].critical_high,
                            update_analytes[i].normal_low,
                            update_analytes[i].normal_high,
                            update_analytes[i].from_age,
                            update_analytes[i].to_age,
                            update_analytes[i].age_type,
                            update_analytes[i].gender,
                            update_analytes[i].display_order,
                            update_analytes[i].includeInReport,
                            moment().format("YYYY-MM-DD HH:mm"),
                            req.userIdentity.algaeh_d_app_user_id,
                            update_analytes[i].hims_m_lab_analyte_id,
                          ]
                        );
                      }
                      _mysql
                        .executeQuery({
                          query: qry,
                          printQuery: true,
                        })
                        .then((result_anlyt) => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result_anlyt;
                            next();
                          });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    } else {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = results;
                        next();
                      });
                    }
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              })
              .catch((e) => {
                utilities.logger().log("Error: ", e);
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else if (result != null && inputParam.investigation_type == "R") {
            new Promise((resolve, reject) => {
              try {
                if (inputParam.insert_rad_temp.length != 0) {
                  const IncludeValues = [
                    "template_name",
                    "test_id",
                    "template_html",
                  ];

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_d_rad_template_detail(??) VALUES ?",
                      values: inputParam.insert_rad_temp,
                      includeValues: IncludeValues,
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true,
                    })
                    .then((radiolgyResult) => {
                      return resolve(radiolgyResult);
                    })
                    .catch((e) => {
                      reject(e);
                    });
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            })
              .then((result) => {
                if (inputParam.update_rad_temp.length != 0) {
                  let update_rad_temp = req.body.update_rad_temp;
                  let qry = "";
                  for (let i = 0; i < req.body.update_rad_temp.length; i++) {
                    qry += mysql.format(
                      "UPDATE `hims_d_rad_template_detail` SET template_name=?,\
                      `template_html`=?, `template_status`=?, `record_status`=?,\
                      updated_date=?, updated_by=? where hims_d_rad_template_detail_id=?;",
                      [
                        update_rad_temp[i].template_name,
                        update_rad_temp[i].template_html,
                        update_rad_temp[i].template_status,
                        update_rad_temp[i].record_status,
                        moment().format("YYYY-MM-DD HH:mm"),
                        req.userIdentity.algaeh_d_app_user_id,
                        update_rad_temp[i].hims_d_rad_template_detail_id,
                      ]
                    );
                  }
                  _mysql
                    .executeQuery({
                      query: qry,
                      printQuery: true,
                    })
                    .then((result_rad_update) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result_rad_update;
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
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
      // _mysql.releaseConnection();
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  deleteLabAnalyte: (req, res, next) => {
    try {
      if (req.body.hims_m_lab_analyte_id > 0) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "delete from hims_m_lab_analyte where hims_m_lab_analyte_id=?",
            values: [req.body.hims_m_lab_analyte_id],
            printQuery: true,
          })
          .then((result) => {
            // utilities.logger().log("result: ", result);
            _mysql.releaseConnection();

            req.records = result;

            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid input",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  deleteRadTemplate: (req, res, next) => {
    try {
      if (req.body.hims_d_rad_template_detail_id > 0) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "delete from hims_d_rad_template_detail where hims_d_rad_template_detail_id=?",
            values: [req.body.hims_d_rad_template_detail_id],
            printQuery: true,
          })
          .then((result) => {
            // utilities.logger().log("result: ", result);
            _mysql.releaseConnection();

            req.records = result;

            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid input",
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addTestComments: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_investigation_test_comments` (investigation_test_id, commnet_name, commet,  \
              created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)",
          values: [
            inputParam.investigation_test_id,
            inputParam.commnet_name,
            inputParam.commet,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
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
  },

  updateTestComments: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_investigation_test_comments` SET  commet=?, comment_status=?, updated_date=?, updated_by=? \
            WHERE  hims_d_investigation_test_comments_id=?;",
          values: [
            inputParam.commet,
            inputParam.comment_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_investigation_test_comments_id,
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
  },

  getTestComments: (req, res, next) => {
    const _mysql = new algaehMysql();
    let strQuery = "";

    if (
      req.query.comment_status !== null &&
      req.query.comment_status !== undefined
    ) {
      strQuery = ` and comment_status = '${req.query.comment_status}'`;
    }

    try {
      _mysql
        .executeQuery({
          query:
            "select * FROM hims_d_investigation_test_comments where investigation_test_id = ?" +
            strQuery +
            "order by hims_d_investigation_test_comments_id desc ",
          values: [req.query.investigation_test_id],
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
  },
};
