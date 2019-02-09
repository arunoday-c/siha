import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";

module.exports = {
  getLabOrderedServices: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  insertLadOrderedServices: (req, res, next) => {
    const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("Services Bill: ");
      // let Services =
      //   req.records.ResultOfFetchOrderIds == null
      //     ? req.body.billdetails
      //     : req.records.ResultOfFetchOrderIds;
      const labServices = [
        ...new Set(
          new LINQ(req.body.billdetails)
            .Where(
              w =>
                w.service_type_id ==
                appsettings.hims_d_service_type.service_type_id.Lab
            )
            .Select(s => {
              return {
                ordered_services_id: s.hims_f_ordered_services_id || null,
                patient_id: req.body.patient_id,
                provider_id: req.body.incharge_or_provider,
                visit_id: req.body.visit_id,
                service_id: s.services_id,
                billed: req.body.billed,
                ordered_date: s.created_date,
                test_type: s.test_type
              };
            })
            .ToArray()
        )
      ];

      const IncludeValues = [
        "ordered_services_id",
        "patient_id",
        "visit_id",
        "provider_id",
        "service_id",
        "billed",
        "ordered_date",
        "test_type"
      ];
      if (labServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_lab_order(??) VALUES ?",
            values: labServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(insert_lab_order => {
            const get_services_id = new LINQ(labServices)
              .Select(s => {
                return s.service_id;
              })
              .ToArray();
            _mysql
              .executeQuery({
                query:
                  "select  hims_d_investigation_test_id from hims_d_investigation_test where record_status='A' and services_id in (?)",
                values: [get_services_id],
                printQuery: true
              })
              .then(investigation_test => {
                const test_id = new LINQ(investigation_test)
                  .Select(s => {
                    return s.hims_d_investigation_test_id;
                  })
                  .ToArray();
                _mysql
                  .executeQuery({
                    query:
                      "select services_id,specimen_id FROM  hims_m_lab_specimen,hims_d_investigation_test where \
                    hims_d_investigation_test_id=hims_m_lab_specimen.test_id and hims_m_lab_specimen.record_status='A' and test_id in (?); \
                    select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' and visit_id =? and service_id in (?); \
                    select hims_d_investigation_test.services_id,analyte_type,result_unit,analyte_id,critical_low,critical_high, \
                    normal_low,normal_high \
                    from hims_d_investigation_test,hims_m_lab_analyte where \
                   hims_d_investigation_test_id=hims_m_lab_analyte.test_id and hims_m_lab_analyte.record_status='A' \
                   and hims_m_lab_analyte.test_id in  (?);",
                    values: [
                      test_id,
                      req.body.visit_id,
                      get_services_id,
                      test_id
                    ],
                    printQuery: true
                  })
                  .then(specimentRecords => {
                    if (
                      specimentRecords[0] == null ||
                      specimentRecords[0].length == 0
                    ) {
                      _mysql.rollBackTransaction(() => {
                        next(
                          httpStatus.generateError(
                            httpStatus.forbidden,
                            "No Specimen Avilable"
                          )
                        );
                      });
                    }

                    const insertedLabSample = new LINQ(specimentRecords[0])
                      .Select(s => {
                        return {
                          order_id: new LINQ(specimentRecords[1])
                            .Where(w => w.service_id == s.services_id)
                            .FirstOrDefault().hims_f_lab_order_id,
                          sample_id: s.specimen_id
                        };
                      })
                      .ToArray();

                    const sample = ["order_id", "sample_id"];

                    _mysql
                      .executeQuery({
                        query: "INSERT INTO hims_f_lab_sample(??) VALUES ?",
                        values: insertedLabSample,
                        includeValues: sample,
                        extraValues: {
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(insert_lab_sample => {
                        if (
                          specimentRecords[2] == null &&
                          specimentRecords[2].length == 0
                        ) {
                          _mysql.rollBackTransaction(() => {
                            next(
                              httpStatus.generateError(
                                httpStatus.forbidden,
                                "No Analytes Avilable"
                              )
                            );
                          });
                        }

                        const analyts = [
                          "order_id",
                          "analyte_id",
                          "analyte_type",
                          "result_unit",
                          "critical_low",
                          "critical_high",
                          "normal_low",
                          "normal_high"
                        ];

                        const labAnalytes = new LINQ(specimentRecords[2])
                          .Select(s => {
                            return {
                              analyte_id: s.analyte_id,
                              order_id: new LINQ(specimentRecords[1])
                                .Where(w => w.service_id == s.services_id)
                                .FirstOrDefault().hims_f_lab_order_id,
                              analyte_type: s.analyte_type,
                              result_unit: s.result_unit,
                              critical_low: s.critical_low,
                              critical_high: s.critical_high,
                              normal_low: s.normal_low,
                              normal_high: s.normal_high
                            };
                          })
                          .ToArray();

                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO hims_f_ord_analytes(??) VALUES ?",
                            values: labAnalytes,
                            includeValues: analyts,
                            extraValues: {
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_by: req.userIdentity.algaeh_d_app_user_id
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true
                          })
                          .then(ord_analytes => {
                            if (req.mySQl == null) {
                              _mysql.commitTransaction(() => {
                                _mysql.releaseConnection();
                                req.records = ord_analytes;
                                next();
                              });
                            } else {
                              next();
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
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
