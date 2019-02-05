import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
import extend from "extend";
module.exports = {
  addMisEarnDedcToEmployee: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      _mysql
        .executeQuery({
          values: input.employees,
          includeValues: ["employee_id", "amount"],
          extraValues: {
            earning_deductions_id: input.earning_deduction_id,
            year: input.year,
            month: input.month,
            category: input.category,

            created_by: req.userIdentity.algaeh_d_app_user_id,
            created_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date()
          },
          onDuplicateKeyUpdate: [
            "earning_deductions_id",
            "year",
            "month",
            "employee_id"
          ],
          query:
            "insert into  hims_f_miscellaneous_earning_deduction (??) values ? ON DUPLICATE KEY UPDATE ?",
          printQuery: query => {
            utilities
              .AlgaehUtilities()
              .logger()
              .log("Query ", query);
          },
          bulkInsertOrUpdate: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getEmployee: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();

      _mysql
        .executeQuery({
          query: "SELECT * FROM hims_d_employee WHERE record_status ='A'",
          printQuery: true
        })
        .then(result => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("HR management ", result);
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeMaster: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_employee (employee_code,full_name,arabic_name,\
            date_of_birth,sex,primary_contact_no,email,blood_group,nationality,religion_id,\
            marital_status,present_address,present_address2,present_pincode,present_city_id,\
            present_state_id,present_country_id,permanent_address,permanent_address2,permanent_pincode,\
            permanent_city_id,permanent_state_id,permanent_country_id,isdoctor,license_number, \
            date_of_joining,appointment_type,employee_type,reliving_date,notice_period,date_of_resignation,\
            company_bank_id,employee_bank_name,employee_bank_ifsc_code,employee_account_number,mode_of_payment,\
            accomodation_provided,hospital_id,created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.employee_code,
            input.full_name,
            input.arabic_name,
            input.date_of_birth,
            input.sex,
            input.primary_contact_no,
            input.email,
            input.blood_group,
            input.nationality,
            input.religion_id,
            input.marital_status,
            input.present_address,
            input.present_address2,
            input.present_pincode,
            input.present_city_id,
            input.present_state_id,
            input.present_country_id,
            input.permanent_address,
            input.permanent_address2,
            input.permanent_pincode,
            input.permanent_city_id,
            input.permanent_state_id,
            input.permanent_country_id,
            input.isdoctor,
            input.license_number,
            input.date_of_joining,
            input.appointment_type,
            input.employee_type,
            input.reliving_date,
            input.notice_period,
            input.date_of_resignation,
            input.company_bank_id,
            input.employee_bank_name,
            input.employee_bank_ifsc_code,
            input.employee_account_number,
            input.mode_of_payment,
            input.accomodation_provided,
            input.hospital_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_employee SET employee_code=?,full_name=?,arabic_name=?,\
          date_of_birth=?,sex=?,primary_contact_no=?,email=?,blood_group=?,nationality=?,religion_id=?,\
          marital_status=?,present_address=?,present_address2=?,present_pincode=?,present_city_id=?,\
          present_state_id=?,present_country_id=?,permanent_address=?,permanent_address2=?,permanent_pincode=?,\
          permanent_city_id=?,permanent_state_id=?,permanent_country_id=?,isdoctor=?,license_number=?, \
          date_of_joining=?,appointment_type=?,employee_type=?,reliving_date=?,notice_period=?,date_of_resignation=?,\
          company_bank_id=?,employee_bank_name=?,employee_bank_ifsc_code=?,employee_account_number=?,mode_of_payment=?,\
          accomodation_provided=?,hospital_id=?,gross_salary=?,total_earnings=?,total_deductions=?,total_contributions=?,\
          net_salary=?,cost_to_company=?,leave_salary_process=?,late_coming_rule=?,airfare_process=?,exit_date=?,\
          exclude_machine_data=?,gratuity_applicable=?,suspend_salary=?,pf_applicable=?,employee_group_id=?, \
          reporting_to_id=?,sub_department_id=?,employee_designation_id=?,employee_status=?,inactive_date=?,updated_date=?,updated_by=?\
          WHERE record_status='A' and  hims_d_employee_id=?",
        values: [
          input.employee_code,
          input.full_name,
          input.arabic_name,
          input.date_of_birth,
          input.sex,
          input.primary_contact_no,
          input.email,
          input.blood_group,
          input.nationality,
          input.religion_id,
          input.marital_status,
          input.present_address,
          input.present_address2,
          input.present_pincode,
          input.present_city_id,
          input.present_state_id,
          input.present_country_id,
          input.permanent_address,
          input.permanent_address2,
          input.permanent_pincode,
          input.permanent_city_id,
          input.permanent_state_id,
          input.permanent_country_id,
          input.isdoctor,
          input.license_number,
          input.date_of_joining,
          input.appointment_type,
          input.employee_type,
          input.reliving_date,
          input.notice_period,
          input.date_of_resignation,
          input.company_bank_id,
          input.employee_bank_name,
          input.employee_bank_ifsc_code,
          input.employee_account_number,
          input.mode_of_payment,
          input.accomodation_provided,
          input.hospital_id,

          input.gross_salary,
          input.total_earnings,
          input.total_deductions,
          input.total_contributions,
          input.net_salary,
          input.cost_to_company,

          input.leave_salary_process,
          input.late_coming_rule,
          input.airfare_process,
          input.exit_date,
          input.exclude_machine_data,
          input.gratuity_applicable,
          input.suspend_salary,
          input.pf_applicable,

          input.employee_group_id,
          input.reporting_to_id,
          input.sub_department_id,
          input.employee_designation_id,
          input.employee_status,
          input.inactive_date,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_employee_id
        ]
      })
      .then(update_employee => {
        let execute_query = "";

        //Insert Department
        if (input.insertdeptDetails.length > 0) {
          const insurtColumns = [
            "employee_id",
            "services_id",
            "sub_department_id",
            "category_speciality_id",
            "user_id",
            "employee_designation_id",
            "reporting_to_id",
            "from_date"
          ];

          execute_query = {
            query:
              "INSERT INTO hims_m_employee_department_mappings(??) VALUES ?",
            values: req.body.insertdeptDetails,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date()
            },
            bulkInsertOrUpdate: true,
            printQuery: true
          };
        } else {
          execute_query = {
            query: "select 1"
          };
        }

        utilities
          .AlgaehUtilities()
          .logger()
          .log("execute_query: ", execute_query);

        _mysql
          .executeQuery(execute_query)
          .then(employee_department => {
            let qry_employee_department = "";

            //Update Department
            if (input.updatedeptDetails.length > 0) {
              let inputParam = extend([], req.body.updatedeptDetails);

              for (let i = 0; i < input.updatedeptDetails.length; i++) {
                qry_employee_department += mysql.format(
                  "UPDATE `hims_m_employee_department_mappings` SET services_id=?,`sub_department_id`=?,\
                  `category_speciality_id`=?,`employee_designation_id`=?,`reporting_to_id`=?,`to_date`=?,\
                  `dep_status`=?, `record_status`=?,`updated_date`=?,`updated_by`=? \
                  where record_status='A' and hims_d_employee_department_id=?;",
                  [
                    inputParam[i].services_id,
                    inputParam[i].sub_department_id,
                    inputParam[i].category_speciality_id,
                    inputParam[i].employee_designation_id,
                    inputParam[i].reporting_to_id,
                    inputParam[i].to_date,
                    inputParam[i].dep_status,
                    inputParam[i].record_status,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam[i].hims_d_employee_department_id
                  ]
                );
              }
            } else {
              qry_employee_department = "select 1";
            }

            utilities
              .AlgaehUtilities()
              .logger()
              .log("qry_employee_department: ", qry_employee_department);
            _mysql
              .executeQuery({
                query: qry_employee_department,
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(update_employee_department => {
                //Insert Service Commission
                if (input.insertserviceComm.length > 0) {
                  const insurtColumns = [
                    "provider_id",
                    "services_id",
                    "service_type_id",
                    "op_cash_commission_percent",
                    "op_credit_commission_percent",
                    "ip_cash_commission_percent",
                    "ip_credit_commission_percent"
                  ];

                  execute_query = {
                    query:
                      "INSERT INTO hims_m_doctor_service_commission(??) VALUES ?",
                    values: req.body.insertserviceComm,
                    includeValues: insurtColumns,
                    extraValues: {
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date()
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  };
                } else {
                  execute_query = {
                    query: "select 1"
                  };
                }

                _mysql
                  .executeQuery(execute_query)
                  .then(service_commission => {
                    let qry_doctor_service = "";
                    //Update Service Commission
                    if (input.updateserviceComm.length > 0) {
                      let inputParam = extend([], req.body.updateserviceComm);

                      for (let i = 0; i < input.updateserviceComm.length; i++) {
                        qry_doctor_service += mysql.format(
                          "UPDATE `hims_m_doctor_service_commission` SET services_id=?,\
                          `service_type_id`=?,`op_cash_commission_percent`=?,`op_credit_commission_percent`=?,`ip_cash_commission_percent`=?,\
                          `ip_credit_commission_percent`=?,record_status`=?,\
                          updated_date=?,updated_by=? where record_status='A' and hims_m_doctor_service_commission_id=?;",
                          [
                            inputParam[i].services_id,
                            inputParam[i].service_type_id,
                            inputParam[i].op_cash_commission_percent,
                            inputParam[i].op_credit_commission_percent,
                            inputParam[i].ip_cash_commission_percent,
                            inputParam[i].ip_credit_commission_percent,
                            inputParam[i].record_status,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            inputParam[i].hims_m_doctor_service_commission_id
                          ]
                        );
                      }
                    } else {
                      qry_doctor_service = "select 1";
                    }

                    utilities
                      .AlgaehUtilities()
                      .logger()
                      .log("qry_doctor_service: ", qry_doctor_service);
                    _mysql
                      .executeQuery({
                        query: qry_doctor_service,
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(update_service_commission => {
                        //Insert Service Type Commission
                        if (input.insertservTypeCommission.length > 0) {
                          const insurtColumns = [
                            "provider_id",
                            "service_type_id",
                            "op_cash_comission_percent",
                            "op_credit_comission_percent",
                            "ip_cash_commission_percent",
                            "ip_credit_commission_percent"
                          ];

                          execute_query = {
                            query:
                              "INSERT INTO hims_m_doctor_service_type_commission(??) VALUES ?",
                            values: req.body.insertservTypeCommission,
                            includeValues: insurtColumns,
                            extraValues: {
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              created_date: new Date(),
                              updated_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_date: new Date()
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true
                          };
                        } else {
                          execute_query = {
                            query: "select 1"
                          };
                        }

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("execute_query: ", execute_query);

                        _mysql
                          .executeQuery(execute_query)
                          .then(service_type_commission => {
                            let qry_doctor_service_type = "";
                            //Update Service Type Commission
                            if (input.updateserviceComm.length > 0) {
                              let inputParam = extend(
                                [],
                                req.body.updateserviceComm
                              );

                              for (
                                let i = 0;
                                i < input.updateserviceComm.length;
                                i++
                              ) {
                                qry_doctor_service_type += mysql.format(
                                  "UPDATE `hims_m_doctor_service_type_commission` SET \
                              `service_type_id`=?,`op_cash_comission_percent`=?,`op_credit_comission_percent`=?,`ip_cash_commission_percent`=?,\
                              `ip_credit_commission_percent`=?,record_status`=?,\
                              updated_date=?,updated_by=? where record_status='A' and hims_m_doctor_service_type_commission_id=?;",
                                  [
                                    inputParam[i].service_type_id,
                                    inputParam[i].op_cash_comission_percent,
                                    inputParam[i].op_credit_comission_percent,
                                    inputParam[i].ip_cash_commission_percent,
                                    inputParam[i].ip_credit_commission_percent,
                                    inputParam[i].record_status,
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    inputParam[i]
                                      .hims_m_doctor_service_type_commission_id
                                  ]
                                );
                              }
                            } else {
                              qry_doctor_service_type = "select 1";
                            }

                            utilities
                              .AlgaehUtilities()
                              .logger()
                              .log(
                                "qry_doctor_service_type: ",
                                qry_doctor_service_type
                              );
                            _mysql
                              .executeQuery({
                                query: qry_doctor_service_type,
                                bulkInsertOrUpdate: true,
                                printQuery: true
                              })
                              .then(update_service_type_commission => {
                                _mysql.releaseConnection();
                                req.records = update_service_type_commission;
                                next();
                              })
                              .catch(error => {
                                next(error);
                              });
                          })
                          .catch(e => {
                            next(e);
                          });
                      })
                      .catch(error => {
                        next(error);
                      });
                  })
                  .catch(e => {
                    next(e);
                  });
              })
              .catch(error => {
                next(error);
              });
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(e => {
        next(e);
      });
  },

  getEmployeeDepartments: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;

      let inputValues = [];
      let _stringData = "";
      if (input.employee_id != null) {
        _stringData += " AND employee_id=?";
        inputValues.push(input.employee_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,\
        ED.services_id,ED.employee_designation_id,ED.reporting_to_id,ED.from_date,ED.to_date,ED.dep_status,\
        CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
       CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date \
       from hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
        Where ED.record_status='A' and CS.record_status='A' \
         and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id " +
            _stringData,
          values: inputValues,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeWorkExperience: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;

      let employee_id = [];
      if (input.employee_id != "null" && input.employee_id != undefined) {
        employee_id.push(input.employee_id);
      } else {
        employee_id.push(req.userIdentity.employee_id);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_experience_id,employee_id,\
          from_date,to_date,previous_company_name,designation,experience_years, experience_months from hims_d_employee_experience\
          where record_status='A' and employee_id=?",
          values: employee_id,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeWorkExperience: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_employee_experience (employee_id, previous_company_name,from_date,\
            to_date,designation,experience_years, experience_months,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.employee_id,
            input.previous_company_name,
            input.from_date,
            input.to_date,
            input.designation,
            input.experience_years,
            input.experience_months,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployeeWorkExperience: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "update hims_d_employee_experience set employee_id=?,from_date=?,to_date=?,previous_company_name=?,\
          designation=?,experience_years=?, experience_months=?, updated_date=?, updated_by=?  \
          WHERE record_status='A' and  hims_d_employee_experience_id = ?",
          values: [
            input.employee_id,
            input.from_date,
            input.to_date,
            input.previous_company_name,
            input.designation,
            input.experience_years,
            input.experience_months,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_employee_experience_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  deleteEmployeeWorkExperience: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "DELETE FROM hims_d_employee_experience  WHERE hims_d_employee_experience_id=?",
          values: [input.hims_d_employee_experience_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  //Employee Education
  getEmployeeEducation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;

      let employee_id = [];
      if (input.employee_id != "null" && input.employee_id != undefined) {
        employee_id.push(input.employee_id);
      } else {
        employee_id.push(req.userIdentity.employee_id);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_education_id,employee_id,\
          qualification,qualitfication_type,year,university from hims_d_employee_education\
          where record_status='A' and employee_id=?",
          values: employee_id,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeEducation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_employee_education (employee_id, qualification,qualitfication_type,\
            year,university,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?)",
          values: [
            input.employee_id,
            input.qualification,
            input.qualitfication_type,
            input.year,
            input.university,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployeeEducation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "update hims_d_employee_education set employee_id=?,qualification=?,qualitfication_type=?,year=?,\
          university=?,updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_education_id = ?",
          values: [
            input.employee_id,
            input.qualification,
            input.qualitfication_type,
            input.year,
            input.university,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_employee_experience_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  deleteEmployeeEducation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      let input = { ...req.body };
      utilities
        .AlgaehUtilities()
        .logger()
        .log("input: ", input);

      _mysql
        .executeQuery({
          query:
            "DELETE FROM hims_d_employee_education  WHERE hims_d_employee_education_id=?",
          values: [input.hims_d_employee_education_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpEarningComponents: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_employee_earnings_id,employee_id,earnings_id,amount,formula,allocate,\
        calculation_method from hims_d_employee_earnings where employee_id = ?;",
          values: [input.employee_id],
          printQuery: true
        })
        .then(result => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("HR management ", result);
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpDeductionComponents: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_employee_deductions_id,employee_id,deductions_id,amount,formula,allocate,\
          calculation_method from hims_d_employee_deductions where employee_id = ?;",
          values: [input.employee_id],
          printQuery: true
        })
        .then(result => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("HR management ", result);
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpContibuteComponents: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_employee_contributions_id,employee_id,contributions_id,amount,formula,allocate,\
          calculation_method from hims_d_employee_contributions where employee_id = ?;",
          values: [input.employee_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getFamilyIdentification: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_employee_identification_id,employee_id,identity_documents_id,identity_number,\
          valid_upto,issue_date,alert_required,alert_date from hims_d_employee_identification where \
          employee_id = ?; \
          SELECT hims_d_employee_dependents_id,employee_id,dependent_type,dependent_name,dependent_identity_type,\
          dependent_identity_no from hims_d_employee_dependents where employee_id = ?;",
          values: [input.employee_id, input.employee_id],
          printQuery: true
        })
        .then(result => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("HR management ", result);
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getDoctorServiceCommission: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "select hims_m_doctor_service_commission_id,provider_id,services_id,service_type_id,op_cash_commission_percent,\
          op_credit_commission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
           from hims_m_doctor_service_commission where record_status='A'and provider_id=?",
          values: [input.provider_id],
          printQuery: true
        })
        .then(result => {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("HR management ", result);
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getDoctorServiceTypeCommission: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "select hims_m_doctor_service_type_commission_id,provider_id,service_type_id,\
        op_cash_comission_percent,op_credit_comission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
         from hims_m_doctor_service_type_commission where record_status='A' and provider_id=?",
          values: [input.provider_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          resolve(result);
          next();
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
