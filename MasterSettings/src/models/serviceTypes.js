import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import _ from "lodash";

export default {
  addServices: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {

      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO `hims_d_services` (`service_code`, `cpt_code`,`service_name`, `hospital_id`,`service_type_id`, \
                `physiotherapy_service`,`sub_department_id`,`standard_fee`, `discount`, `vat_applicable`, \
              `vat_percent`, `effective_start_date` , `created_by` ,`created_date`, head_id, child_id ) \
                VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)",
          values: [
            inputParam.service_code,
            inputParam.cpt_code,
            inputParam.service_name,
            inputParam.hospital_id,
            inputParam.service_type_id,
            inputParam.physiotherapy_service,
            inputParam.sub_department_id,
            inputParam.standard_fee,
            inputParam.discount,
            inputParam.vat_applicable,
            inputParam.vat_percent,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),

            inputParam.head_id,
            inputParam.child_id,
          ],
          printQuery: true
        })
        .then(result => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          let service_id = result.insertId;
          let package_service_id = result.insertId;
          _mysql
            .executeQuery({
              query:
                "SELECT insurance_id FROM hims_d_services_insurance group by insurance_id; \
              SELECT insurance_id,network_id FROM hims_d_services_insurance_network group by network_id;",
              printQuery: true
            })
            .then(services_insurance_network => {
              const service_insurance = services_insurance_network[0];
              const service_insurance_network =
                services_insurance_network[1];

              if (
                service_insurance.length == 0 &&
                service_insurance_network.length == 0
              ) {
                if (inputParam.direct_call == true) {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.body.service_id = service_id;
                    req.body.package_service_id = package_service_id;
                    req.records = result;
                    next();
                  });
                } else {
                  req.body.service_id = service_id;
                  req.body.package_service_id = package_service_id;
                  req.records = result;
                  next();
                }
              } else {
                InsertintoServiceInsurance({
                  inputParam: inputParam,
                  services_id: service_id,
                  service_insurance: service_insurance,
                  _mysql: _mysql,
                  req: req,
                  next: next
                })
                  .then(insert_service => {
                    InsertintoServiceInsuranceNetwork({
                      inputParam: inputParam,
                      services_id: service_id,
                      service_insurance_network: service_insurance_network,
                      _mysql: _mysql,
                      req: req,
                      next: next
                    })
                      .then(insert_service_network => {
                        if (inputParam.direct_call == true) {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.body.service_id = service_id;
                            req.body.package_service_id = package_service_id;
                            req.records = result;
                            next();
                          });
                        } else {
                          req.body.service_id = service_id;
                          req.body.package_service_id = package_service_id;
                          req.records = result;
                          next();
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });

    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateServices: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_hospital where hims_d_hospital_id=? and \
          (product_type='HIMS_ERP' or product_type='HRMS_ERP' or product_type='FINANCE_ERP');",
          values: [req.userIdentity.hospital_id],
          printQuery: true
        })
        .then(appResult => {
          let str = "";

          if (appResult.length > 0) {
            str = `,head_id= ${inputParam.head_id},child_id= 
            ${inputParam.child_id}`;
          }

          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_d_services` \
          SET `service_code`=?,  `cpt_code`=?,`service_name`=?, `hospital_id`=?,  `service_type_id`=?,`sub_department_id` = ?, \
          `standard_fee`=?, `discount`=?,  `vat_applicable`=?,`vat_percent`=?, `physiotherapy_service`=?, \
          `updated_by`=?, `updated_date`=?,  `record_status`=? " +
                str +
                "\
          WHERE `hims_d_services_id`=?;",
              values: [
                inputParam.service_code,
                inputParam.cpt_code,
                inputParam.service_name,
                inputParam.hospital_id,
                inputParam.service_type_id,
                inputParam.sub_department_id,
                inputParam.standard_fee,

                inputParam.discount,
                inputParam.vat_applicable,
                inputParam.vat_percent,
                inputParam.physiotherapy_service,

                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.record_status,
                inputParam.hims_d_services_id
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

  getServiceType: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_service_type_id != null) {
        _strAppend += "and hims_d_service_type_id=?";
        inputValues.push(input.hims_d_service_type_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_service_type_id`, `service_type_code`, `service_type`, `service_type_desc` \
          ,`arabic_service_type` FROM `hims_d_service_type` WHERE `record_status`='A' " +
            _strAppend +
            " order by hims_d_service_type_id desc",
          values: inputValues,
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
  getServices: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_services_id != null) {
        _strAppend += "and hims_d_services_id=?";
        inputValues.push(input.hims_d_services_id);
      }

      if (input.service_type_id != null) {
        _strAppend += "and service_type_id=?";
        inputValues.push(input.service_type_id);
      }

      if (input.service_name != null) {
        _strAppend += "and service_name=?";
        inputValues.push(input.service_name);
      }

      if (input.sub_department_id != null) {
        _strAppend += "and sub_department_id=?";
        inputValues.push(input.sub_department_id);
      }
      if (input.procedure_type != null) {
        _strAppend += "and procedure_type=?";
        inputValues.push(input.procedure_type);
      }
      _mysql
        .executeQuery({
          query:
            "select hims_d_services_id, service_code, S.cpt_code, CPT.cpt_code as cpt_p_code, service_name, service_desc, \
                sub_department_id, hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent, \
                effective_start_date, effectice_end_date, procedure_type, physiotherapy_service, head_id, child_id from \
                hims_d_services S left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code \
                WHERE S.record_status ='A' " +
            _strAppend +
            " order by hims_d_services_id desc",
          values: inputValues,
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

  getServiceInsured: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [input.insurance_id, input.insurance_id];

      if (input.hims_d_services_id != null) {
        _strAppend += " and hims_d_services_id=?";
        inputValues.push(input.hims_d_services_id);
      }

      if (input.service_type_id != null) {
        _strAppend += " and service_type_id=?";
        inputValues.push(input.service_type_id);
      }

      if (input.service_name != null) {
        _strAppend += " and service_name=?";
        inputValues.push(input.service_name);
      }

      if (input.sub_department_id != null) {
        _strAppend += " and sub_department_id=?";
        inputValues.push(input.sub_department_id);
      }
      if (input.procedure_type != null) {
        _strAppend += " and procedure_type=?";
        inputValues.push(input.procedure_type);
      }

      _mysql
        .executeQuery({
          query:
            "select service_name,service_type_id,hims_d_services_id,'N' as covered,'N' as pre_approval\
              from hims_d_services where hims_d_services_id not in\
              (SELECT services_id FROM hims_d_services_insurance where  insurance_id=?)\
              union all\
              SELECT service_name,service_type_id,services_id as hims_d_services_id, covered,pre_approval \
              FROM hims_d_services_insurance where  insurance_id=?" +
            _strAppend +
            " order by hims_d_services_id desc",
          values: inputValues,
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

  addProcedure: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("input: ", input);

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_services` (service_code,cpt_code,service_name,arabic_service_name,service_desc,sub_department_id,\
        hospital_id,service_type_id,procedure_type,standard_fee,followup_free_fee,followup_paid_fee,\
        discount,vat_applicable,vat_percent,service_status,effective_start_date,effectice_end_date,\
        created_by,created_date,updated_by,updated_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.service_code,
          input.cpt_code,
          input.service_name,
          input.arabic_service_name,
          input.service_desc,
          input.sub_department_id,
          input.hospital_id,
          input.service_type_id,
          input.procedure_type,
          input.standard_fee,
          input.followup_free_fee,
          input.followup_paid_fee,
          input.discount,
          input.vat_applicable,
          input.vat_percent,
          input.service_status,
          input.effective_start_date,
          input.effectice_end_date,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ],

        printQuery: true
      })
      .then(result => {
        let service_id = result.insertId;
        if (result.insertId > 0) {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_d_procedure` (procedure_code,procedure_desc,service_id,procedure_type,\
                    created_by,created_date,updated_by,updated_date) values (?,?,?,?,?,?,?,?)",
              values: [
                input.procedure_code,
                input.procedure_desc,
                result.insertId,
                input.procedure_type,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],

              printQuery: true
            })
            .then(pro_head_result => {
              if (pro_head_result.insertId > 0) {
                let IncludeValues = ["item_id", "service_id", "qty"];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_d_procedure_detail(??) VALUES ?",
                    values: input.ProcedureDetail,
                    includeValues: IncludeValues,
                    extraValues: {
                      procedure_header_id: pro_head_result.insertId,
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date()
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })

                  .then(detail_result => {
                    _mysql
                      .executeQuery({
                        query:
                          "SELECT insurance_id FROM hims_d_services_insurance group by insurance_id; \
                          SELECT * FROM hims_d_services_insurance_network group by network_id;",
                        printQuery: true
                      })
                      .then(services_insurance_network => {
                        const service_insurance = services_insurance_network[0];
                        const service_insurance_network =
                          services_insurance_network[1];

                        if (
                          service_insurance.length == 0 &&
                          service_insurance_network.length == 0
                        ) {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = detail_result;
                            next();
                          });
                        } else {
                          InsertintoServiceInsurance({
                            inputParam: input,
                            services_id: service_id,
                            service_insurance: service_insurance,
                            _mysql: _mysql,
                            req: req,
                            next: next
                          })
                            .then(insert_service => {
                              InsertintoServiceInsuranceNetwork({
                                inputParam: input,
                                services_id: service_id,
                                service_insurance_network: service_insurance_network,
                                _mysql: _mysql,
                                req: req,
                                next: next
                              })
                                .then(insert_service_network => {
                                  _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = detail_result;
                                    next();
                                  });
                                })
                                .catch(error => {
                                  _mysql.releaseConnection();
                                  next(error);
                                });
                            })
                            .catch(error => {
                              _mysql.releaseConnection();
                              next(error);
                            });
                        }
                      })
                      .catch(error => {
                        _mysql.releaseConnection();
                        next(error);
                      });
                  })
                  .catch(e => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              }

              //----------------
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        }
      })
      .catch(e => {
        console.log("error", e);
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  getProcedures: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let strQry = "";

      if (input.hims_d_procedure_id > 0) {
        strQry += ` and  hims_d_procedure_id=${input.hims_d_procedure_id}`;
      } else if (input.service_id > 0) {
        strQry += ` and PH.service_id=${input.service_id} `;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_d_procedure_id,procedure_code,procedure_desc,procedure_status,PH.procedure_type,\
            PH.service_id as header_service_id,S.service_code as header_service_code,\
            S.service_name as header_service_name,hims_d_procedure_detail_id, procedure_header_id, item_id,\
            qty,PD.service_id,SR.service_code as detail_service_code,\
            SR.service_name as detail_service_name from hims_d_procedure PH inner join \
            hims_d_services S on PH.service_id=S.hims_d_services_id inner join hims_d_procedure_detail PD \
            on PH.hims_d_procedure_id=PD.procedure_header_id\
            inner join hims_d_services SR on PD.service_id=SR.hims_d_services_id\
            where PH.record_status='A' and PD.record_status='A'" +
            strQry +
            " order by hims_d_procedure_id desc;",
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

  updateProcedures: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;

      const utilities = new algaehUtilities();
      utilities.logger().log("input: ", input);
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_procedure` SET `procedure_code`=?, `procedure_desc`=?, `service_id`=?,\
          `procedure_type`=?,`updated_date`=?, `updated_by`=? \
          WHERE record_status='A' and `hims_d_procedure_id`=?",
          values: [
            input.procedure_code,
            input.procedure_desc,
            input.service_id,
            input.procedure_type,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_procedure_id
          ],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult != null) {
            new Promise((resolve, reject) => {
              try {
                if (input.insertProcedure.length != 0) {
                  const IncludeValues = [
                    "procedure_header_id",
                    "item_id",
                    "service_id",
                    "qty"
                  ];

                  _mysql
                    .executeQuery({
                      query: "INSERT INTO hims_d_procedure_detail(??) VALUES ?",
                      values: input.insertProcedure,
                      includeValues: IncludeValues,
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        created_date: new Date(),
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_date: new Date()
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(insertProcedure => {
                      return resolve(insertProcedure);
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else {
                  return resolve();
                }
              } catch (e) {
                reject(e);
              }
            })
              .then(results => {
                if (input.deleteProcedure.length != 0) {
                  let qry = "";
                  let inputParam = req.body.deleteProcedure;
                  for (let i = 0; i < req.body.deleteProcedure.length; i++) {
                    qry += mysql.format(
                      "DELETE FROM `hims_d_procedure_detail` where hims_d_procedure_detail_id=?;",
                      [inputParam[i].hims_d_procedure_detail_id]
                    );
                  }

                  _mysql
                    .executeQuery({
                      query: qry,
                      printQuery: true
                    })
                    .then(deleteProcedure => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = deleteProcedure;
                        next();
                      });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
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
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = headerResult;
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  updateServicesOthrs: (req, res, next) => {
    const _mysql = new algaehMysql();

    let inputParam = req.body;
    try {
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_d_services` SET `standard_fee`=?, `vat_applicable`=?,`vat_percent`=?, \
            `updated_by`=?, `updated_date`=? WHERE `hims_d_services_id`=?",
          values: [
            inputParam.standard_fee,
            inputParam.vat_applicable,
            inputParam.vat_percent,

            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.service_id
          ],
          printQuery: true
        })
        .then(result => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          next();
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  //created by:irfan
  getServicesNEw: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hospital_id > 0) {
        _strAppend += " and SD.hospital_id=?";
        inputValues.push(input.hospital_id);
      } else {
        _strAppend += " and SD.hospital_id=?";
        inputValues.push(req.userIdentity.hospital_id);
      }
      if (input.hims_d_services_id > 0) {
        _strAppend += " and hims_d_services_id=?";
        inputValues.push(input.hims_d_services_id);
      }

      if (input.service_type_id > 0) {
        _strAppend += " and service_type_id=?";
        inputValues.push(input.service_type_id);
      }

      if (input.sub_department_id > 0) {
        _strAppend += " and sub_department_id=?";
        inputValues.push(input.sub_department_id);
      }
      if (input.procedure_type == "DN" || input.procedure_type == "GN") {
        _strAppend += " and procedure_type=?";
        inputValues.push(input.procedure_type);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_services_id,S.service_code,S.cpt_code,S.service_name,S.arabic_service_name,\
            S.service_desc,S.sub_department_id,S.service_type_id,S.procedure_type,hims_d_service_detail_id,\
            SD.standard_fee,SD.followup_free_fee,SD.followup_paid_fee,SD.discount,SD.vat_applicable,SD.vat_percent\
            from   hims_d_services S inner join  hims_d_service_detail SD on S.hims_d_services_id=SD.service_id\
            where  SD.service_status='A'  " +
            _strAppend +
            " order by hims_d_services_id desc;",
          values: inputValues,
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
  //created by:Irfan
  addServicesNEW: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO `hims_d_services` (service_code,cpt_code,service_name,\
             sub_department_id,service_type_id,procedure_type,\
             created_by,created_date,updated_by,updated_date) \
             VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.service_code,
            inputParam.cpt_code,
            inputParam.service_name,
            inputParam.sub_department_id,
            inputParam.service_type_id,
            inputParam.procedure_type,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          printQuery: true
        })
        .then(result => {
          if (result.insertId > 0) {
            if (inputParam.branches.length > 0) {
              const insurtColumns = ["hospital_id"];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_d_service_detail(??) VALUES ? ",
                  values: inputParam.branches,
                  includeValues: insurtColumns,
                  extraValues: {
                    service_id: result.insertId,
                    created_date: new Date(),
                    created_by: req.userIdentity.algaeh_d_app_user_id,
                    updated_date: new Date(),
                    updated_by: req.userIdentity.algaeh_d_app_user_id
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: false
                })
                .then(detailResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = detailResult;
                    next();
                  });
                })
                .catch(error => {
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
          } else {
            req.records = {
              invalid_data: true,
              message: "Please provide valid input"
            };
            _mysql.rollBackTransaction(() => {
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};

function InsertintoServiceInsurance(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      const inputParam = options.inputParam;
      const services_id = options.services_id;
      const service_insurance = options.service_insurance;
      const _mysql = options._mysql;
      const req = options.req;
      let strQuery = "";

      utilities
        .logger()
        .log("InsertintoServiceInsurance: ", InsertintoServiceInsurance);

      if (service_insurance.length > 0) {
        utilities.logger().log("service_insurance: ", service_insurance);

        for (let i = 0; i < service_insurance.length; i++) {
          strQuery += _mysql.mysqlQueryFormat(
            "INSERT INTO hims_d_services_insurance (`insurance_id`, `services_id`, `service_code`,\
              `service_type_id`, `cpt_code`, `service_name`, `insurance_service_name`,`hospital_id`, `gross_amt`,\
              `net_amount`, `covered`, `created_by`, `updated_by`)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?) ;",
            [
              service_insurance[i].insurance_id,
              services_id,
              inputParam.service_code,
              inputParam.service_type_id,
              inputParam.cpt_code,
              inputParam.service_name,
              inputParam.service_name,
              inputParam.hospital_id,
              inputParam.standard_fee,
              inputParam.standard_fee,
              "N",
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.algaeh_d_app_user_id
            ]
          );

          if (i == service_insurance.length - 1) {
            utilities.logger().log("strQuery: ", strQuery);
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true
              })
              .then(detailresult => {
                resolve(detailresult);
              })
              .catch(error => {
                console.log("erroe", error);
                reject(error);
              });
          }
        }
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function InsertintoServiceInsuranceNetwork(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      const inputParam = options.inputParam;
      const services_id = options.services_id;
      const service_insurance_network = options.service_insurance_network;
      const _mysql = options._mysql;
      const req = options.req;
      let strQuery = "";

      utilities
        .logger()
        .log(
          "InsertintoServiceInsuranceNetwork: ",
          InsertintoServiceInsuranceNetwork
        );

      if (service_insurance_network.length > 0) {
        utilities
          .logger()
          .log("service_insurance_network: ", service_insurance_network);

        for (let i = 0; i < service_insurance_network.length; i++) {
          strQuery += _mysql.mysqlQueryFormat(
            "INSERT INTO hims_d_services_insurance_network (`insurance_id`, `network_id`, `services_id`,\
             `service_code`, `service_type_id`, `cpt_code`, `service_name`, `insurance_service_name`,\
            `hospital_id`, `gross_amt`, `net_amount`, `covered`, `created_by`, `updated_by`)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;",
            [
              service_insurance_network[i].insurance_id,
              service_insurance_network[i].network_id,
              services_id,
              inputParam.service_code,
              inputParam.service_type_id,
              inputParam.cpt_code,
              inputParam.service_name,
              inputParam.service_name,
              inputParam.hospital_id,
              inputParam.standard_fee,
              inputParam.standard_fee,
              "N",
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.algaeh_d_app_user_id
            ]
          );

          if (i == service_insurance_network.length - 1) {
            utilities.logger().log("strQuery: ", strQuery);
            _mysql
              .executeQuery({
                query: strQuery,
                printQuery: true
              })
              .then(detailresult => {
                resolve(detailresult);
              })
              .catch(error => {
                reject(error);
              });
          }
        }
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}
