import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import pad from "node-string-pad";
import moment from "moment";
import mysql from "mysql";
import _ from "lodash";

export default {
  getLabOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getLabOrderedServices: ");
      let inputValues = [];
      let _stringData = "";

      _stringData += " LO.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.from_date != null) {
        _stringData +=
          " and date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += " and date(ordered_date) <= date(now())";
      }

      if (req.query.patient_id != null) {
        _stringData += " and LO.patient_id=?";
        inputValues.push(req.query.patient_id);
      }

      if (req.query.status != null) {
        _stringData += " and LO.status=?";
        inputValues.push(req.query.status);
      }

      if (req.query.test_type != null) {
        _stringData += " and LO.test_type=?";
        inputValues.push(req.query.test_type);
      }

      utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            " select hims_f_lab_order_id, LO.patient_id, entered_by, confirmed_by, validated_by, visit_id, critical_status,\
            group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, \
            E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
            LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
            concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
            lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender, LS.sample_id,  \
            LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
            LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id from hims_f_lab_order LO \
            inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
            inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
            inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
            left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
            left join hims_d_title as T on T.his_d_title_id = E.title_id \
            left join hims_d_investigation_test as IT on IT.services_id = LO.service_id \
            left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
            left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id WHERE " +
            _stringData +
            " order by hims_f_lab_order_id desc",
          values: inputValues,
          printQuery: true
        })
        .then(result => {
          utilities.logger().log("result: ", result);
          _mysql.releaseConnection();
          req.records = result;
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
  },

  getLabOrderedComment: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            " select comments from hims_f_lab_order WHERE hims_f_lab_order_id = ?",
          values: [req.query.hims_f_lab_order_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result[0];
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
  },

  insertLadOrderedServices_BAKP_JAN_30_2020: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();

      let input = req.body;
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

      utilities.logger().log("labServices: ", labServices.length);
      if (labServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT IGNORE INTO hims_f_lab_order(??) VALUES ?",
            values: labServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              hospital_id: req.userIdentity.hospital_id
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
                  "select  hims_d_investigation_test_id from hims_d_investigation_test where record_status='A' and services_id in (?);\
                  select case when days<31 then 'D' when days<365 then 'M' else 'Y' end as age_type,\
                  TIMESTAMPDIFF(day, ?, curdate()) as days,\
                  TIMESTAMPDIFF(month, ?, curdate()) as months,\
                  TIMESTAMPDIFF(year, ?, curdate()) as years from \
                  (select  TIMESTAMPDIFF(day, ?, curdate()) as days) as a;",
                values: [
                  get_services_id,
                  input.date_of_birth,
                  input.date_of_birth,
                  input.date_of_birth,
                  input.date_of_birth
                ],
                printQuery: true
              })
              .then(results => {
                let investigation_test = results[0];
                const age_data = results[1][0];
                const age_type = age_data["age_type"];
                let age = "";
                switch (age_type) {
                  case "D":
                    age = age_data["days"];

                    break;
                  case "M":
                    age = age_data["months"];
                    break;
                  case "Y":
                    age = age_data["years"];
                    break;
                }

                const test_id = new LINQ(investigation_test)
                  .Select(s => {
                    return s.hims_d_investigation_test_id;
                  })
                  .ToArray();
                _mysql
                  .executeQuery({
                    query:
                      "select services_id,specimen_id FROM  hims_m_lab_specimen,hims_d_investigation_test \
                      where hims_d_investigation_test_id=hims_m_lab_specimen.test_id and \
                      hims_m_lab_specimen.record_status='A' and test_id in (?); \
                      select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' \
                      and visit_id =? and service_id in (?); \
                      select hims_d_investigation_test.services_id, analyte_type, result_unit, analyte_id, \
                      critical_low, critical_high, normal_low,normal_high from hims_d_investigation_test,  hims_m_lab_analyte where hims_d_investigation_test_id=hims_m_lab_analyte.test_id and \
                      hims_m_lab_analyte.record_status='A' and hims_m_lab_analyte.test_id in  (?) \
                      and gender=? and age_type=? and ? between from_age and to_age;",
                    values: [
                      test_id,
                      req.body.visit_id,
                      get_services_id,
                      test_id,
                      input.gender,
                      age_type,
                      age
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
                          utilities
                            .httpStatus()
                            .generateError(
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
                        query:
                          "INSERT IGNORE INTO hims_f_lab_sample(??) VALUES ?",
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
                              utilities
                                .httpStatus()
                                .generateError(
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
                        utilities
                          .logger()
                          .log("specimentRecords: ", specimentRecords[2]);

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

                        utilities.logger().log("labAnalytes: ", labAnalytes);
                        if (labAnalytes.length > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT IGNORE INTO hims_f_ord_analytes(??) VALUES ?",
                              values: labAnalytes,
                              includeValues: analyts,
                              extraValues: {
                                created_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                                updated_by:
                                  req.userIdentity.algaeh_d_app_user_id
                              },
                              bulkInsertOrUpdate: true,
                              printQuery: true
                            })
                            .then(ord_analytes => {
                              if (req.connection == null) {
                                // _mysql.commitTransaction(() => {
                                //   _mysql.releaseConnection();
                                req.records = ord_analytes;
                                next();
                                // });
                              } else {
                                next();
                              }
                            })
                            .catch(e => {
                              _mysql.rollBackTransaction(() => {
                                next(e);
                              });
                            });
                        } else {
                          if (req.connection == null) {
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            req.records = insert_lab_sample;
                            next();
                            // });
                          } else {
                            next();
                          }
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
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  //Recreated by Irfan:
  insertLadOrderedServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let Services =
        req.records.ResultOfFetchOrderIds == null
          ? req.body.billdetails
          : req.records.ResultOfFetchOrderIds;

      const labServices = Services.filter(
        f =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Lab
      ).map(s => {
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
      });

      if (labServices.length > 0) {
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

        _mysql
          .executeQuery({
            query: "INSERT IGNORE INTO hims_f_lab_order(??) VALUES ?",
            values: labServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              hospital_id: req.userIdentity.hospital_id
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(insert_lab_order => {
            const get_services_id = labServices.map(s => {
              return s.service_id;
            });
            _mysql
              .executeQuery({
                query:
                  "SELECT T.hims_d_investigation_test_id,T.description ,C.test_section ,A.analyte_id\
                  FROM hims_d_investigation_test T inner join  hims_d_test_category C on \
                  T.category_id=C.hims_d_test_category_id and T.services_id in (?) \
                  left join hims_m_lab_analyte A on T.hims_d_investigation_test_id=A.test_id group by T.hims_d_investigation_test_id; \
                    select case when days<31 then 'D' when days<365 then 'M' else 'Y' end as age_type,\
                  TIMESTAMPDIFF(day, ?, curdate()) as days,\
                  TIMESTAMPDIFF(month, ?, curdate()) as months,\
                  TIMESTAMPDIFF(year, ?, curdate()) as years from \
                  (select  TIMESTAMPDIFF(day, ?, curdate()) as days) as a;  ",
                values: [
                  get_services_id,

                  req.body.date_of_birth,
                  req.body.date_of_birth,
                  req.body.date_of_birth,
                  req.body.date_of_birth
                ],
                printQuery: true
              })
              .then(investigation_test => {
                const no_analyte = investigation_test[0].find(f => {
                  return f.test_section != "M" && f.analyte_id == null;
                });
                if (no_analyte) {
                  _mysql.rollBackTransaction(() => {
                    next(
                      httpStatus.generateError(
                        httpStatus.forbidden,
                        "Analytes not deifined for the test :" +
                        no_analyte["description"]
                      )
                    );
                  });
                } else {
                  const test_id = investigation_test[0].map(s => {
                    return s.hims_d_investigation_test_id;
                  });

                  // const category_type = investigation_test[0].find(f => {
                  //   return f.test_section == "M";
                  // });

                  const age_data = investigation_test[1][0];
                  const age_type = age_data["age_type"];
                  let age = "";
                  switch (age_type) {
                    case "D":
                      age = age_data["days"];

                      break;
                    case "M":
                      age = age_data["months"];
                      break;
                    case "Y":
                      age = age_data["years"];
                      break;
                  }

                  _mysql
                    .executeQuery({
                      query:
                        "select services_id,specimen_id,test_id FROM  hims_m_lab_specimen,hims_d_investigation_test \
                    where hims_d_investigation_test_id=hims_m_lab_specimen.test_id and \
                    hims_m_lab_specimen.record_status='A' and test_id in (?); \
                    select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' \
                    and visit_id =? and service_id in (?);\
                    select hims_m_lab_analyte_id,test_id,M.analyte_id, R.gender, R.age_type, R.from_age,\
                    R.to_age, R.critical_low,  R.critical_high, R.normal_low, R.normal_high ,\
                    R.normal_qualitative_value,R.text_value ,A.analyte_type,A.result_unit from hims_m_lab_analyte  M \
                    left join hims_d_lab_analytes A on M.analyte_id=A.hims_d_lab_analytes_id\
                    left join  hims_d_lab_analytes_range R on  M.analyte_id=R.analyte_id\
                    and (R.gender=? or R.gender='BOTH') and R.age_type=? and ? between R.from_age and R.to_age\
                    where M.test_id in(?);",
                      values: [
                        test_id,
                        req.body.visit_id,
                        get_services_id,

                        req.body.gender,
                        age_type,
                        age,
                        test_id
                      ],
                      printQuery: true
                    })
                    .then(specimentRecords => {
                      if (specimentRecords[0].length > 0) {
                        const specimen_list = specimentRecords[0];
                        const lab_orders = specimentRecords[1];
                        const all_analytes = specimentRecords[2];
                        const inserteLabSample = [];

                        lab_orders.forEach(ord => {
                          let temp = specimen_list
                            .filter(f => {
                              return f.services_id == ord.service_id;
                            })
                            .map(m => {
                              return {
                                sample_id: m.specimen_id,
                                test_id: m.test_id,
                                order_id: ord.hims_f_lab_order_id
                              };
                            });
                          inserteLabSample.push(...temp);
                        });

                        const sample = ["order_id", "sample_id"];

                        _mysql
                          .executeQuery({
                            query:
                              "INSERT IGNORE INTO hims_f_lab_sample(??) VALUES ?",
                            values: inserteLabSample,
                            includeValues: sample,
                            extraValues: {
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_by: req.userIdentity.algaeh_d_app_user_id
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true
                          })
                          .then(insert_lab_sample => {
                            if (all_analytes.length > 0) {
                              all_analytes.map(item => {
                                const order_dtails = inserteLabSample.find(
                                  f => {
                                    return item.test_id == f.test_id;
                                  }
                                );

                                item["order_id"] = order_dtails.order_id;
                              });

                              const analyts = [
                                "order_id",
                                "analyte_id",
                                "analyte_type",
                                "result_unit",
                                "critical_low",
                                "critical_high",
                                "normal_low",
                                "normal_high",
                                "text_value",
                                "normal_qualitative_value"
                              ];
                              _mysql
                                .executeQuery({
                                  query:
                                    "INSERT IGNORE INTO hims_f_ord_analytes(??) VALUES ?",
                                  values: all_analytes,
                                  includeValues: analyts,
                                  extraValues: {
                                    created_by:
                                      req.userIdentity.algaeh_d_app_user_id,
                                    updated_by:
                                      req.userIdentity.algaeh_d_app_user_id
                                  },
                                  bulkInsertOrUpdate: true,
                                  printQuery: true
                                })
                                .then(ord_analytes => {
                                  if (req.connection == null) {
                                    req.records = insert_lab_sample;
                                    next();
                                  } else {
                                    next();
                                  }
                                })
                                .catch(e => {
                                  _mysql.rollBackTransaction(() => {
                                    next(e);
                                  });
                                });
                            } else {
                              if (req.connection == null) {
                                req.records = insert_lab_sample;
                                next();
                              } else {
                                next();
                              }
                            }
                          })
                          .catch(e => {
                            _mysql.rollBackTransaction(() => {
                              next(e);
                            });
                          });
                      } else {
                        _mysql.rollBackTransaction(() => {
                          next(
                            httpStatus.generateError(
                              httpStatus.forbidden,
                              "No Specimen Avilable"
                            )
                          );
                        });
                      }
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
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
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateLabOrderServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateLabOrderServices: ");
      let inputParam = { ...req.body };

      return new Promise((resolve, reject) => {
        _mysql
          .executeQueryWithTransaction({
            query:
              "UPDATE hims_f_lab_sample SET `collected`=?,`status`=?, `collected_by`=?,\
          `collected_date` =now() WHERE hims_d_lab_sample_id=?;\
          SELECT distinct LS.container_id, LC.container_id as container_code FROM hims_m_lab_specimen LS \
          inner join hims_d_investigation_test IT on IT.hims_d_investigation_test_id = LS.test_id \
          inner join hims_d_lab_container LC on LC.hims_d_lab_container_id = LS.container_id \
          where IT.services_id=?;\
          SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?",
            values: [
              inputParam.collected,
              inputParam.status,
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.hims_d_lab_sample_id,
              inputParam.service_id,
              inputParam.hims_d_hospital_id
            ],
            printQuery: true
          })
          .then(update_lab_sample => {
            utilities.logger().log("update_lab_sample: ", update_lab_sample);
            inputParam.container_id = update_lab_sample[1][0].container_id;
            inputParam.container_code = update_lab_sample[1][0].container_code;
            inputParam.lab_location_code =
              update_lab_sample[2][0].lab_location_code;
            resolve(update_lab_sample);
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
              reject(e);
            });
          });
      })
        .then(result => {
          utilities.logger().log("result: ", result);
          if (result != null) {
            let _date = new Date();
            _date = moment(_date).format("YYYY-MM-DD");
            return new Promise((resolve, reject) => {
              _mysql
                .executeQuery({
                  query:
                    "select number,hims_m_hospital_container_mapping_id from hims_m_hospital_container_mapping \
                  where hospital_id =? and container_id=? and date =?",
                  values: [
                    inputParam.hims_d_hospital_id,
                    inputParam.container_id,
                    _date
                  ],
                  printQuery: true
                })
                .then(container_mapping => {
                  utilities
                    .logger()
                    .log("container_mapping: ", container_mapping);
                  resolve(container_mapping);
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                    reject(e);
                  });
                });
            }).then(record => {
              let query = "";
              let condition = [];
              let padNum = "";
              let _newNumber = 1;
              utilities.logger().log("record: ", record);
              if (record != null && record.length > 0) {
                _newNumber = parseInt(record[0].number, 10);
                _newNumber = _newNumber + 1;
                padNum = pad(String(_newNumber), 3, "LEFT", "0");
                condition.push(
                  _newNumber,
                  req.userIdentity.algaeh_d_app_user_id,
                  record[0].hims_m_hospital_container_mapping_id
                );

                condition.push;
                query =
                  "Update hims_m_hospital_container_mapping set number =?,updated_by=?,updated_date=now() where hims_m_hospital_container_mapping_id =?";
              } else {
                condition.push(
                  inputParam.hims_d_hospital_id,
                  inputParam.container_id,
                  _date,
                  1,
                  req.userIdentity.algaeh_d_app_user_id,
                  req.userIdentity.algaeh_d_app_user_id
                );

                query =
                  "insert into hims_m_hospital_container_mapping (`hospital_id`,`container_id`,`date`,`number`,`created_by`,`updated_by`) values (?,?,?,?,?,?)";
              }

              utilities.logger().log("query: ", query);

              padNum = pad(String(_newNumber), 3, "LEFT", "0");
              const dayOfYear = moment().dayOfYear();
              const labIdNumber =
                inputParam.lab_location_code +
                moment().format("YY") +
                dayOfYear +
                inputParam.container_code +
                padNum;

              _mysql
                .executeQuery({
                  query:
                    query +
                    ";update hims_f_lab_order set lab_id_number ='" +
                    labIdNumber +
                    "',status='CL' where hims_f_lab_order_id=" +
                    inputParam.hims_f_lab_order_id,
                  values: condition,
                  printQuery: true
                })
                .then(result => {
                  utilities.logger().log("result: ", result);
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      collected: inputParam.collected,
                      collected_by: req.userIdentity.algaeh_d_app_user_id,
                      collected_date: new Date()
                    };
                    next();
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            });
          }
        })
        .catch(e => {
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

  getTestAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *,la.description from hims_f_ord_analytes, hims_d_lab_analytes la where hims_f_ord_analytes.record_status='A' \
          and la.hims_d_lab_analytes_id = hims_f_ord_analytes.analyte_id AND order_id=?",
          values: [req.query.order_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;

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
  },
  getMicroResult: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT MR.*,A.antibiotic_name from hims_f_micro_result MR, hims_d_antibiotic A where  \
           A.hims_d_antibiotic_id = MR.antibiotic_id AND order_id=?",
          values: [req.query.order_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
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
  },
  updateLabSampleStatus: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let collected = ",";
      if (input.status == "R") {
        collected = ", collected='N' ,";
      }
      let queryBuilder =
        "update hims_f_lab_sample set `status`=?" +
        collected +
        "remarks=?,updated_date=?,updated_by=? where hims_d_lab_sample_id=?;";

      let inputs = [
        input.status,
        input.remarks,
        new Date(),
        input.updated_by,
        input.hims_d_lab_sample_id
      ];
      _mysql
        .executeQueryWithTransaction({
          query: queryBuilder,
          values: inputs,
          printQuery: true
        })
        .then(results => {
          if (input.status == "R") {
            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_lab_order` SET `status`='O',updated_date=?,updated_by=?  WHERE `hims_f_lab_order_id`=?;",
                values: [new Date(), input.updated_by, input.order_id],
                printQuery: true
              })
              .then(lab_order => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = lab_order;
                  next();
                });
              })
              .catch(error => {
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

  updateLabResultEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("updateLabResultEntry: ");
    try {
      let inputParam = req.body;
      console.log(req.body, "body");

      let status_C = new LINQ(inputParam).Where(w => w.status == "C").ToArray()
        .length;
      let status_V = new LINQ(inputParam).Where(w => w.status == "V").ToArray()
        .length;

      let status_N = new LINQ(inputParam).Where(w => w.status == "N").ToArray()
        .length;

      let status_E = new LINQ(inputParam).Where(w => w.status == "E").ToArray()
        .length;
      utilities.logger().log("runtype: ");
      // let runtype = new LINQ(inputParam)
      //   .Where(w => w.run_type != null)
      //   .Select(s => s.run_type)
      //   .ToArray();
      let { runtype } = inputParam[inputParam.length - 1];
      console.log(runtype, "run type");

      console.log("inputParam: ", inputParam[0].critical_status);

      let ref = null;
      let entered_by = null;
      let confirmed_by = null;
      let validated_by = null;
      let strQuery = "";
      switch (inputParam.length - 1) {
        case status_C:
          //Do functionality for C here
          ref = "CF";
          confirmed_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", confirmed_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', confirmed_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";
          break;

        case status_V:
          //Do functionality for V here
          ref = "V";
          validated_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", validated_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', validated_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";
          break;

        case status_N:
          //Do functionality for CL here
          ref = "CL";
          break;

        case status_E:
          ref = "CL";
          entered_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", entered_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', entered_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "' ";
          break;
        default:
          ref = null;
      }

      utilities.logger().log("ref: ", ref);

      let qry = "";

      for (let i = 0; i < req.body.length; i++) {
        qry += mysql.format(
          "UPDATE `hims_f_ord_analytes` SET result=?,\
        `status`=?,`remarks`=?,`run1`=?,`run2`=?,`run3`=?,`critical_type`=?,\
        entered_by=?,entered_date=?,validate_by=?,validated_date=?,\
        confirm_by=?,confirmed_date=?,amended=?,amended_date=?,\
        updated_date=?,updated_by=? where order_id=? AND hims_f_ord_analytes_id=?;",
          [
            inputParam[i].result,
            inputParam[i].status,
            inputParam[i].remarks,
            inputParam[i].run1,
            inputParam[i].run2,
            inputParam[i].run3,
            inputParam[i].critical_type,
            req.userIdentity.algaeh_d_app_user_id,
            moment().format("YYYY-MM-DD HH:mm"),
            inputParam[i].validate == "N"
              ? null
              : req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].validate == "N"
              ? null
              : moment().format("YYYY-MM-DD HH:mm"),
            inputParam[i].confirm == "N"
              ? null
              : req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].confirm == "N"
              ? null
              : moment().format("YYYY-MM-DD HH:mm"),
            inputParam[i].amended,
            inputParam[i].amended === "Y"
              ? moment().format("YYYY-MM-DD HH:mm")
              : null,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].order_id,
            inputParam[i].hims_f_ord_analytes_id
          ]
        );
      }
      utilities.logger().log("qry: ", qry);

      _mysql
        .executeQuery({
          query: qry,
          printQuery: true
        })
        .then(results => {
          utilities.logger().log("results: ", results);
          if (results != null && ref != null) {
            _mysql
              .executeQuery({
                query:
                  "update hims_f_lab_order set `status`=?, run_type=?, updated_date= ?, updated_by=?, comments=?, `critical_status`=? " +
                  strQuery +
                  " where hims_f_lab_order_id=?; ",
                values: [
                  ref,
                  String(runtype),
                  moment().format("YYYY-MM-DD HH:mm"),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam[0].comments,
                  inputParam[0].critical_status,
                  inputParam[0].order_id
                ],
                printQuery: true
              })
              .then(update_lab_order => {
                utilities.logger().log("update_lab_order: ", update_lab_order);
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    results,
                    entered_by: entered_by,
                    confirmed_by: confirmed_by,
                    validated_by: validated_by
                  };
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                results,
                entered_by: entered_by,
                confirmed_by: confirmed_by,
                validated_by: validated_by
              };
              next();
            });
          }
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

  updateMicroResultEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("updateMicroResultEntry: ");
    try {
      let inputParam = req.body;

      let qry = "";
      let entered_by = null;
      let confirmed_by = null;
      let validated_by = null;
      let strQuery = "";
      let updateQuery = "";

      utilities.logger().log("inputParam.status: ", inputParam.status);
      if (inputParam.status == "E") {
        utilities.logger().log("data_exists: ", inputParam.data_exists);
        if (inputParam.data_exists == true) {
          for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
            updateQuery += mysql.format(
              "UPDATE `hims_f_micro_result` SET susceptible=?,\
            `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
              [
                inputParam.microAntbiotic[i].susceptible,
                inputParam.microAntbiotic[i].intermediate,
                inputParam.microAntbiotic[i].resistant,
                inputParam.microAntbiotic[i].hims_f_micro_result_id
              ]
            );
          }
          qry = {
            query: updateQuery,
            printQuery: true
          };
        } else {
          let insertedValues = [
            "antibiotic_id",
            "susceptible",
            "intermediate",
            "resistant"
          ];
          qry = {
            query: "INSERT INTO hims_f_micro_result(??) VALUES ?",
            values: inputParam.microAntbiotic,
            includeValues: insertedValues,
            extraValues: {
              order_id: inputParam.hims_f_lab_order_id
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          };
        }
        entered_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'CL', entered_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', entered_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "' ";
      } else if (inputParam.status == "CF") {
        for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
          updateQuery += mysql.format(
            "UPDATE `hims_f_micro_result` SET susceptible=?,\
          `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
            [
              inputParam.microAntbiotic[i].susceptible,
              inputParam.microAntbiotic[i].intermediate,
              inputParam.microAntbiotic[i].resistant,
              inputParam.microAntbiotic[i].hims_f_micro_result_id
            ]
          );
        }
        qry = {
          query: updateQuery,
          printQuery: true
        };
        confirmed_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'CF', confirmed_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', confirmed_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'  ";
      } else if (inputParam.status == "V") {
        for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
          updateQuery += mysql.format(
            "UPDATE `hims_f_micro_result` SET susceptible=?,\
          `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
            [
              inputParam.microAntbiotic[i].susceptible,
              inputParam.microAntbiotic[i].intermediate,
              inputParam.microAntbiotic[i].resistant,
              inputParam.microAntbiotic[i].hims_f_micro_result_id
            ]
          );
        }
        qry = {
          query: updateQuery,
          printQuery: true
        };
        validated_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'V', validated_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', validated_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'  ";
      }

      utilities.logger().log("qry: ", qry);

      _mysql
        .executeQueryWithTransaction(qry)
        .then(results => {
          utilities.logger().log("results: ", results);
          if (results != null) {
            _mysql
              .executeQuery({
                query:
                  "update hims_f_lab_order set `group_id`=?, `organism_type`=?, `bacteria_name`=?,`bacteria_type`=?, \
                  updated_date= ?, updated_by=?, comments=?" +
                  strQuery +
                  "where hims_f_lab_order_id=? ",
                values: [
                  inputParam.group_id,
                  inputParam.organism_type,
                  inputParam.bacteria_name,
                  inputParam.bacteria_type,
                  moment().format("YYYY-MM-DD HH:mm"),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.comments,
                  inputParam.hims_f_lab_order_id
                ],
                printQuery: true
              })
              .then(update_lab_order => {
                utilities.logger().log("update_lab_order: ", update_lab_order);
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    results,
                    entered_by: entered_by,
                    confirmed_by: confirmed_by,
                    validated_by: validated_by
                  };
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                results,
                entered_by: entered_by,
                confirmed_by: confirmed_by,
                validated_by: validated_by
              };
              next();
            });
          }
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

  updateLabOrderedBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    utilities.logger().log("updateLabOrderedBilled: ");
    try {
      utilities.logger().log("billdetails: ", req.body.billdetails);
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          w =>
            w.hims_f_ordered_services_id > 0 &&
            w.service_type_id ==
            appsettings.hims_d_service_type.service_type_id.Lab
        )
        .Select(s => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id
          };
        })
        .ToArray();

      utilities.logger().log("OrderServices: ", OrderServices);

      if (OrderServices.length > 0) {
        let qry = "";

        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_lab_order` SET billed=?,\
          updated_date=?,updated_by=? where ordered_services_id=?;",
            [
              OrderServices[i].billed,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].ordered_services_id
            ]
          );
        }
        utilities.logger().log("qry: ", qry);
        _mysql
          .executeQuery({
            query: qry,
            printQuery: true
          })
          .then(result => {
            req.records = { LAB: false };
            next();
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = { LAB: true };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  //created by: Irfan to compare lab results
  getComparedLabResult: (req, res, next) => {
    try {
      if (req.query.pre_order_id > 0 && req.query.cur_order_id) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "  select OA.analyte_id,A.description as analyte ,OA.result,A.result_unit,OA.critical_type from \
            hims_f_ord_analytes  OA   inner join hims_d_lab_analytes A on OA.analyte_id=A.hims_d_lab_analytes_id\
            where OA.order_id=?;\
            select OA.analyte_id,OA.result,OA.critical_type from hims_f_ord_analytes  OA    inner join hims_d_lab_analytes A on \
            OA.analyte_id=A.hims_d_lab_analytes_id  where OA.order_id=?; ",
            values: [req.query.cur_order_id, req.query.pre_order_id],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result[0].length > 0) {
              const outputArray = [];

              result[0].forEach(item => {
                const data = result[1].find(val => {
                  return val["analyte_id"] == item["analyte_id"];
                });

                if (data) {
                  let valur_flucuate = "N";
                  if (parseFloat(item["result"]) > parseFloat(data["result"])) {
                    valur_flucuate = "U";
                  } else if (
                    parseFloat(item["result"]) < parseFloat(data["result"])
                  ) {
                    valur_flucuate = "D";
                  }
                  outputArray.push({
                    analyte: item["analyte"],
                    result_unit: item["result_unit"],
                    cur_result: item["result"],
                    pre_result: data["result"],
                    cur_critical_type: item["critical_type"],
                    pre_critical_type: data["critical_type"],
                    valur_flucuate: valur_flucuate
                  });
                }
              });
              req.records = outputArray;
              next();
            } else {
              req.records = result[0];
              next();
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide Valid cur_order_id and pre_order_id"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  getPatientTestList: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *,la.description from hims_f_ord_analytes, hims_d_lab_analytes la where hims_f_ord_analytes.record_status='A' \
              and la.hims_d_lab_analytes_id = hims_f_ord_analytes.analyte_id AND order_id=?;\
            SELECT V.visit_code, V.visit_date, LA.hims_f_lab_order_id,LA.service_id FROM hims_f_lab_order LA, hims_f_patient_visit V \
            where LA.visit_id = V.hims_f_patient_visit_id and LA.patient_id=? and LA.provider_id=? and LA.status='V' \
            AND LA.service_id=? AND LA.visit_id!=?;",
          values: [
            req.query.order_id,
            req.query.patient_id,
            req.query.provider_id,
            req.query.service_id,
            req.query.visit_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;

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
  },

  updateResultFromMachine: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = req.body;

      _mysql
        .executeQuery({
          query:
            "select hims_f_lab_order_id from hims_f_lab_order where lab_id_number=?;",
          values: [input.sampleNo],
          printQuery: true
        })
        .then(lab_order => {
          // MachineId
          if (lab_order.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "select hims_f_ord_analytes_id, analyte_id, critical_low, normal_low, normal_high, critical_high \
                  from hims_f_ord_analytes where order_id=?;",
                values: [lab_order[0].hims_f_lab_order_id],
                printQuery: true
              })
              .then(ord_analytes => {
                let strResultUpdate = "";
                for (let i = 0; i < input.result.length; i++) {
                  _mysql
                    .executeQuery({
                      query:
                        "select D.analyte_id from hims_m_machine_analytes_header H, hims_m_machine_analytes_detail D \
                      where H.hims_m_machine_analytes_header_id = D.machine_analytes_header_id and \
                      H.machine_id = ? and machine_analyte_code=?;",
                      values: [input.MachineId, input.result[i].tesCode],
                      printQuery: true
                    })
                    .then(analyte_data => {
                      let selected_analyte = _.find(
                        ord_analytes,
                        f => f.analyte_id === analyte_data[0].analyte_id
                      );

                      let critical_type = "";
                      if (
                        parseFloat(input.result[i].rawResult) <=
                        parseFloat(selected_analyte.critical_low)
                      ) {
                        critical_type = "CL";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.normal_low)
                      ) {
                        critical_type = "L";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.normal_high)
                      ) {
                        critical_type = "N";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.critical_high)
                      ) {
                        critical_type = "H";
                      } else {
                        critical_type = "CH";
                      }

                      strResultUpdate += mysql.format(
                        "UPDATE `hims_f_ord_analytes` SET result=?, critical_type=? where hims_f_ord_analytes_id=?;",
                        [
                          input.result[i].rawResult,
                          critical_type,
                          selected_analyte.hims_f_ord_analytes_id
                        ]
                      );

                      if (i == input.result.length - 1) {
                        _mysql
                          .executeQuery({
                            query: strResultUpdate,
                            printQuery: true
                          })
                          .then(update_result => {
                            _mysql.releaseConnection();
                            req.records = update_result;
                            next();
                          })
                          .catch(e => {
                            _mysql.releaseConnection();
                            next(e);
                          });
                      }
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = lab_order;
            next();
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
