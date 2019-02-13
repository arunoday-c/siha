import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import pad from "node-string-pad";
import moment from "moment";
module.exports = {
  getLabOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getLabOrderedServices: ");
      let inputValues = [];
      let _stringData = "";

      if (req.query.from_date != null) {
        _stringData +=
          "date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += "date(ordered_date) <= date(now())";
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
            " select hims_f_lab_order_id,LO.patient_id, entered_by, confirmed_by, validated_by,visit_id,V.visit_code, provider_id, E.full_name as doctor_name, billed, service_id,S.service_code,S.service_name,LO.status,\
            cancelled, provider_id, ordered_date, test_type, lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender,\
            LS.sample_id,LS.collected,LS.collected_by, LS.remarks,LS.collected_date,LS.hims_d_lab_sample_id,LS.status as sample_status\
            from hims_f_lab_order LO inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id and  V.record_status='A'\
            inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
            inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
            left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A'  WHERE " +
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
          SELECT distinct container_id,container_code FROM hims_m_lab_specimen,hims_d_investigation_test \
          where hims_d_investigation_test.hims_d_investigation_test_id =hims_m_lab_specimen.test_id \
          and hims_d_investigation_test.services_id=?;\
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
            const _date = new Date();
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
                _newNumber = parseInt(record[1][0].number, 10);
                _newNumber = _newNumber + 1;
                padNum = pad(String(_newNumber), 3, "LEFT", "0");
                condition.push(
                  _newNumber,
                  record.hims_m_hospital_container_mapping_id,
                  req.userIdentity.algaeh_d_app_user_id
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
  }
};
