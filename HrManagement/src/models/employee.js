import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";
import extend from "extend";
import mysql from "mysql";
import Excel from "exceljs/modern.browser";

export default {
  addMisEarnDedcToEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      const utilities = new algaehUtilities();
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
            hospital_id: req.userIdentity.hospital_id,
            created_by: req.userIdentity.algaeh_d_app_user_id,
            created_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
          },
          onDuplicateKeyUpdate: [
            "earning_deductions_id",
            "year",
            "month",
            "employee_id",
          ],
          query:
            "insert into  hims_f_miscellaneous_earning_deduction (??) values ? ON DUPLICATE KEY UPDATE ?",
          printQuery: (query) => {},
          bulkInsertOrUpdate: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
          resolve(result);
        })
        .catch((e) => {
          next(e);
          reject(e);
        });
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();
        let _strAppend = "";

        if (req.query.isdoctor != null) {
          _strAppend += " and isdoctor='Y'";
        }
        if (req.query.sub_department_id != null) {
          _strAppend +=
            " and sub_department_id='" + req.query.sub_department_id + "'";
        }

        if (req.query.department_id != null) {
          _strAppend +=
            " and SD.department_id='" + req.query.department_id + "'";
        }

        if (req.query.designation_id != null) {
          _strAppend +=
            " and E.employee_designation_id='" + req.query.designation_id + "'";
        }

        if (req.query.suspend_salary != null) {
          _strAppend +=
            " and E.suspend_salary='" + req.query.suspend_salary + "'";
        }

        if (
          req.query.hospital_requires === undefined ||
          req.query.hospital_requires === true
        ) {
          if (req.query.select_all === "true") {
            _strAppend +=
              " and E.hospital_id in (" + req.query.hospital_id + ")";
          } else if (req.query.hospital_id != null) {
            _strAppend += " and E.hospital_id='" + req.query.hospital_id + "'";
          } else {
            _strAppend +=
              " and E.hospital_id='" + req.userIdentity.hospital_id + "'";
          }
        }
        const show_active =
          req.query.show_all_status === "true"
            ? ""
            : "and E.employee_status='A' ";
        const specificEmployee =
          req.query.hims_d_employee_id !== undefined
            ? " and hims_d_employee_id ='" + req.query.hims_d_employee_id + "'"
            : "";

        _mysql
          .executeQuery({
            query:
              "SELECT E.*, hims_d_employee_id as employee_id, SD.sub_department_name, D.department_name,N.nationality as nationality_name,\
                R.religion_name, DE.designation,employee_group_id, G.monthly_accrual_days  FROM hims_d_employee E \
                left join hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id \
                left join hims_d_department D on SD.department_id = D.hims_d_department_id \
                left join hims_d_religion R on E.religion_id = R.hims_d_religion_id \
                left join hims_d_employee_group G on E.employee_group_id = G.hims_d_employee_group_id \
                left join hims_d_designation DE on E.employee_designation_id = DE.hims_d_designation_id left join hims_d_nationality N on N.hims_d_nationality_id = E.nationality WHERE \
                E.record_status = 'A'  " +
              specificEmployee +
              " " +
              show_active +
              _strAppend,
            // values: [req.userIdentity.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

        _mysql
          .executeQuery({
            query:
              "INSERT  INTO hims_d_employee (employee_code,full_name,arabic_name, date_of_birth, sex,\
            primary_contact_no,secondary_contact_no,email,work_email,blood_group,nationality,religion_id,\
            marital_status,present_address,present_address2,present_pincode,present_city_id,\
            present_state_id,present_country_id,permanent_address,permanent_address2,permanent_pincode,\
            permanent_city_id,permanent_state_id,permanent_country_id,isdoctor,license_number, \
            date_of_joining,appointment_type,employee_type,reliving_date,notice_period,date_of_resignation,\
            company_bank_id,employee_bank_name,employee_bank_ifsc_code,employee_account_number,mode_of_payment,\
            accomodation_provided,hospital_id,sub_department_id,overtime_group_id,employee_bank_id,services_id,\
            employee_group_id, reporting_to_id, employee_designation_id, entitled_daily_ot, employee_category,\
            gratuity_encash,identity_type_id, identity_no, agency_id, service_dis_percentage,\
            created_date,created_by,updated_date,updated_by,eos_id) \
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.employee_code,
              input.full_name,
              input.arabic_name,
              input.date_of_birth,
              input.sex,
              input.primary_contact_no,
              input.secondary_contact_no,
              input.email,
              input.work_email,
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
              input.sub_department_id,
              input.overtime_group_id,
              input.employee_bank_id,
              input.services_id,
              input.employee_group_id,
              input.reporting_to_id,
              input.employee_designation_id,
              input.entitled_daily_ot,
              input.employee_category,
              input.gratuity_encash,
              input.identity_type_id,
              input.identity_no,
              input.agency_id,
              input.service_dis_percentage,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.eos_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
            // req.body.insertdeptDetails = req.body.insertdeptDetails.map(
            //   (dept_data, index) => {
            //     return {
            //       ...dept_data,
            //       ...{
            //         employee_id: result.insertId
            //       }
            //     };
            //   }
            // );
            // let _InsertEmployeeDept = InsertEmployeeDepartment({
            //   req: req,
            //   _mysql: _mysql
            // });

            // Promise.all([_InsertEmployeeDept])
            //   .then(result => {
            //     _mysql.releaseConnection();
            //     req.records = result;
            //     next();
            //     resolve(result);
            //   })
            //   .catch(e => {
            //     next(e);
            //     reject(e);
            //   });
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployee: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

        _mysql
          .executeQuery({
            query:
              "UPDATE hims_d_employee SET employee_code=?,full_name=?,arabic_name=?, date_of_birth=?, sex=?,\
              primary_contact_no=?, secondary_contact_no=?, email=?, work_email=?, blood_group=?, nationality=?,\
              religion_id=?, marital_status=?, present_address=?, present_address2=?, present_pincode=?,\
              present_city_id=?, present_state_id=?, present_country_id=?, permanent_address=?,\
              permanent_address2=?, permanent_pincode=?, permanent_city_id=?, permanent_state_id=?,\
              permanent_country_id=?, isdoctor=?, license_number=?, date_of_joining=?, appointment_type=?,\
              employee_type=?, reliving_date=?, notice_period=?, date_of_resignation=?, company_bank_id=?,\
              employee_bank_name=?, employee_bank_ifsc_code=?,employee_account_number=?,mode_of_payment=?,\
              accomodation_provided=?,hospital_id=?,gross_salary=?,total_earnings=?,total_deductions=?,\
              total_contributions=?, net_salary=?,cost_to_company=?,leave_salary_process=?,late_coming_rule=?,\
              airfare_process=?,exit_date=?, exclude_machine_data=?,gratuity_applicable=?,suspend_salary=?,\
              pf_applicable=?,overtime_group_id=?,employee_group_id=?, reporting_to_id=?,sub_department_id=?,\
              employee_designation_id=?, entitled_daily_ot= ?, employee_bank_id=?,services_id=?, employee_status=?, \
              inactive_date=?, employee_category=?, gratuity_encash=?, identity_type_id=?, identity_no=?,agency_id=?, \
              service_dis_percentage=?, updated_date=?,updated_by=?,eos_id=? WHERE record_status='A' and  hims_d_employee_id=?",
            values: [
              input.employee_code,
              input.full_name,
              input.arabic_name,
              input.date_of_birth,
              input.sex,
              input.primary_contact_no,
              input.secondary_contact_no,
              input.email,
              input.work_email,
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
              input.overtime_group_id,

              input.employee_group_id,
              input.reporting_to_id,
              input.sub_department_id,
              input.employee_designation_id,
              input.entitled_daily_ot,
              input.employee_bank_id,
              input.services_id,
              input.employee_status,
              input.inactive_date,
              input.employee_category,
              input.gratuity_encash,
              input.identity_type_id,
              input.identity_no,
              input.agency_id,
              input.service_dis_percentage,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.eos_id,
              input.hims_d_employee_id,
            ],
          })
          .then((update_employee) => {
            const utilities = new algaehUtilities();

            let _InsertEmployeeDept = InsertEmployeeDepartment({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmployeeDept = UpdateEmployeeDepartment({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertServiceComm = InsertServiceCommission({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateServiceComm = UpdateServiceCommission({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertServiceTypeComm = InsertServiceTypeCommission({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateServiceTypeComm = UpdateServiceTypeCommission({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertEmpEarning = InsertEmployeeEarnings({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmpEarning = UpdateEmployeeEarnings({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _DeleteEmpEarning = DeleteEmployeeEarnings({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertEmpDeduction = InsertEmployeeDeduction({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmpDeduction = UpdateEmployeeDeduction({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _DeleteEmpDeduction = DeleteEmployeeDeduction({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertEmpContributions = InsertEmployeeContributions({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmpContributions = UpdateEmployeeContributions({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _DeleteEmpContributions = DeleteEmployeeContributions({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertEmpIdentification = InsertEmployeeIdentification({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmpIdentification = UpdateEmployeeIdentification({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _DeleteEmpIdentification = DeleteEmployeeIdentification({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _InsertEmpDependents = InsertEmployeeDependents({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _UpdateEmpDependents = UpdateEmployeeDependents({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            let _DeleteEmpDependents = DeleteEmployeeDependents({
              req: req,
              _mysql: _mysql,
              next: next,
            });

            Promise.all([
              _InsertEmployeeDept,
              _UpdateEmployeeDept,
              _InsertServiceComm,
              _UpdateServiceComm,
              _InsertServiceTypeComm,
              _UpdateServiceTypeComm,
              _InsertEmpEarning,
              _UpdateEmpEarning,
              _DeleteEmpEarning,
              _InsertEmpDeduction,
              _UpdateEmpDeduction,
              _DeleteEmpDeduction,
              _InsertEmpContributions,
              _UpdateEmpContributions,
              _DeleteEmpContributions,
              _InsertEmpIdentification,
              _UpdateEmpIdentification,
              _DeleteEmpIdentification,
              _InsertEmpDependents,
              _UpdateEmpDependents,
              _DeleteEmpDependents,
            ])
              .then((result) => {
                _mysql.releaseConnection();
                req.records = result;
                next();
                resolve(result);
              })
              .catch((e) => {
                next(e);
                reject(e);
              });
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  //Not in use Removed Department Tab in employee Master
  getEmployeeDepartments: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;

        let inputValues = [];
        let _stringData = "";

        _stringData += " AND ED.hospital_id=?";
        inputValues.push(req.userIdentity.hospital_id);

        if (input.employee_id != null) {
          _stringData += " AND employee_id=?";
          inputValues.push(input.employee_id);
        }

        _mysql
          .executeQuery({
            query:
              "SELECT ED.hims_d_employee_department_id, ED.employee_id, ED.sub_department_id,\
            ED.category_speciality_id, ED.user_id, ED.services_id, ED.employee_designation_id, \
            ED.reporting_to_id, ED.from_date, ED.to_date, ED.dep_status, CS.hims_m_category_speciality_mappings_id,\
            CS.category_id, CS.speciality_id, CS.category_speciality_status, CS.effective_start_date,\
            CS.effective_end_date from hims_m_employee_department_mappings ED, \
            hims_m_category_speciality_mappings CS Where ED.record_status='A' and CS.record_status='A' \
            and ED.category_speciality_id = CS.hims_m_category_speciality_mappings_id " +
              _stringData,
            values: inputValues,
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeDepartmentsWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "SELECT SD.sub_department_name, count(*) as no_of_emp  FROM hims_d_employee E, hims_d_sub_department SD WHERE \
            SD.hims_d_sub_department_id = E.sub_department_id and E.record_status = 'A' and E.hospital_id = ? \
            group by SD.hims_d_sub_department_id ; ",
            values: [req.query.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeDesignationWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "SELECT D.designation, count(*) as no_of_emp  FROM hims_d_employee E, hims_d_designation D WHERE \
                D.hims_d_designation_id = E.employee_designation_id and E.record_status = 'A' and E.hospital_id = ? \
                group by D.hims_d_designation_id ; ",
            values: [req.query.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeWorkExperience: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
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
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeWorkExperience: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

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
              req.userIdentity.algaeh_d_app_user_id,
            ],
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployeeWorkExperience: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

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
              input.hims_d_employee_experience_id,
            ],
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  deleteEmployeeWorkExperience: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

        _mysql
          .executeQuery({
            query:
              "DELETE FROM hims_d_employee_experience  WHERE hims_d_employee_experience_id=?",
            values: [input.hims_d_employee_experience_id],
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  //Employee Education
  getEmployeeEducation: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
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
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeEducation: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

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
              req.userIdentity.algaeh_d_app_user_id,
            ],
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployeeEducation: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

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
              input.hims_d_employee_education_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  deleteEmployeeEducation: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let input = { ...req.body };

        _mysql
          .executeQuery({
            query:
              "DELETE FROM hims_d_employee_education  WHERE hims_d_employee_education_id=?",
            values: [input.hims_d_employee_education_id],
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpEarningComponents: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        let _strAppend = "";
        if (input.earnings_id != null) {
          _strAppend += " and earnings_id='" + input.earnings_id + "'";
        }
        _mysql
          .executeQuery({
            query:
              "SELECT hims_d_employee_earnings_id,employee_id,earnings_id, ED.short_desc,amount,ED.formula,allocate,\
                ED.calculation_method from hims_d_employee_earnings EE \
                inner join hims_d_earning_deduction ED  on  ED.hims_d_earning_deduction_id = EE.earnings_id \
                where employee_id = ? " +
              _strAppend,
            values: [input.employee_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpDeductionComponents: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        _mysql
          .executeQuery({
            query:
              "SELECT hims_d_employee_deductions_id,employee_id,deductions_id,ED.short_desc,amount,ED.formula,allocate,\
                ED.calculation_method,ED.min_limit_applicable,ED.min_limit_amount,ED.limit_applicable,ED.limit_amount \
                from hims_d_employee_deductions EMD \
                inner join hims_d_earning_deduction ED  on  ED.hims_d_earning_deduction_id = EMD.deductions_id \
                where employee_id = ?;",
            values: [input.employee_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmpContibuteComponents: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        _mysql
          .executeQuery({
            query:
              "SELECT hims_d_employee_contributions_id,employee_id,contributions_id,ED.short_desc,amount,ED.formula,allocate,\
                ED.calculation_method from hims_d_employee_contributions EC \
                inner join hims_d_earning_deduction ED  on  ED.hims_d_earning_deduction_id = EC.contributions_id \
                where employee_id = ?;",
            values: [input.employee_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getFamilyIdentification: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
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
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getDoctorServiceCommission: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        _mysql
          .executeQuery({
            query:
              "select hims_m_doctor_service_commission_id,provider_id,services_id,service_type_id,op_cash_commission_percent,\
          op_credit_commission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
           from hims_m_doctor_service_commission where record_status='A'and provider_id=? and hospital_id=?",
            values: [input.provider_id, req.userIdentity.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  getDoctorServiceTypeCommission: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        _mysql
          .executeQuery({
            query:
              "select hims_m_doctor_service_type_commission_id,provider_id,service_type_id,\
        op_cash_comission_percent,op_credit_comission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
         from hims_m_doctor_service_type_commission where record_status='A' and provider_id=? and hospital_id=?",
            values: [input.provider_id, req.userIdentity.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  //created by irfan
  getEmployeesForMisED: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let strQuery = "";
    if (input.sub_department_id > 0) {
      strQuery += ` and E.sub_department_id=${input.sub_department_id}`;
    }

    if (input.department_id > 0) {
      strQuery += ` and SD.department_id=${input.department_id}`;
    }

    if (input.employee_id > 0) {
      strQuery += ` and E.hims_d_employee_id=${input.employee_id}`;
    }

    if (input.employee_group_id > 0) {
      strQuery += ` and E.employee_group_id=${input.employee_group_id}`;
    }

    if (input.year > 0 && input.month > 0) {
      _mysql
        .executeQuery({
          query:
            "select E.hims_d_employee_id as employee_id,E.employee_code,E.full_name as employee_name,\
              E.hospital_id,H.hospital_name,E.sub_department_id, SD.sub_department_name, S.salary_processed, \
              MED.amount,earning_deductions_id,hims_f_miscellaneous_earning_deduction_id \
              from hims_d_employee E \
              inner join hims_d_hospital H on E.hospital_id=H.hims_d_hospital_id  and H.record_status='A'\
              left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id  and SD.record_status='A' \
              left join hims_f_salary S on E.hims_d_employee_id=S.employee_id and S.`year`=? and S.`month`=? \
              left join hims_f_miscellaneous_earning_deduction MED on E.hims_d_employee_id=MED.employee_id and\
              MED.`year`=? and MED.`month`=?  and earning_deductions_id=?  \
              where E.record_status='A' and E.`hospital_id`=? " +
            strQuery,
          values: [
            input.year,
            input.month,
            input.year,
            input.month,
            input.earning_deductions_id,
            input.hospital_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = { invalid_input: true, message: "invalid input" };
      next();
      return;
    }
  },
  //created by irfan
  addMisEarnDedcToEmployees: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    if (input.employees != undefined && input.employees.length > 0) {
      const insurtColumns = ["employee_id", "amount"];

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_miscellaneous_earning_deduction(??) VALUES ?  ON DUPLICATE KEY UPDATE\
          employee_id=values(employee_id),amount=values(amount),earning_deductions_id=values(earning_deductions_id), \
                    year=values(year),month=values(month),category=values(category),updated_date=values(updated_date),\
          updated_by=values(updated_by)",
          values: input.employees,
          includeValues: insurtColumns,
          extraValues: {
            earning_deductions_id: input.earning_deduction_id,
            year: input.year,
            month: input.month,
            category: input.category,
            created_date: new Date(),
            created_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: input.hospital_id,
          },
          bulkInsertOrUpdate: true,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = { invalid_input: true, message: "invalid input" };
      next();
      return;
    }
  },
  //Suhail
  updateMisEarnDedcToEmployees: (req, res, next) => {
    const _mysql = new algaehMysql();
    let { hims_f_miscellaneous_earning_deduction_id, amount } = req.body;
    _mysql
      .executeQuery({
        query:
          "update hims_f_miscellaneous_earning_deduction set amount=? where hims_f_miscellaneous_earning_deduction_id =? ",
        values: [amount, hims_f_miscellaneous_earning_deduction_id],
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
  },
  UpdateEmployeeRejoined: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    let strQry = "";
    if (input.dates_equal === false) {
      let to_date = moment(input.last_salary_process_date, "YYYY-MM-DD")
        .add(-1, "days")
        .format("YYYY-MM-DD");
      strQry += mysql.format(
        "UPDATE hims_f_leave_application SET `early_rejoin` = 'Y', `to_date` = ? where hims_f_leave_application_id =? ; ",
        [to_date, input.hims_f_leave_application_id]
      );
    }
    _mysql
      .executeQuery({
        query:
          "Update hims_d_employee set suspend_salary = 'N', last_salary_process_date= ? where hims_d_employee_id=?; " +
          strQry,
        values: [input.last_salary_process_date, input.hims_d_employee_id],

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  getBulkEmployeeLeaves: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const input = req.query;

      if (input.hospital_id > 0 && input.year > 0) {
        let strQry = "";
        if (input.employee_group_id > 0) {
          strQry += " and E.employee_group_id=" + input.employee_group_id;
        }
        if (input.hims_d_employee_id > 0) {
          strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
        }

        //-------------------start
        _mysql
          .executeQuery({
            query: `select E.hims_d_employee_id,E.employee_code,E.full_name,ML.leave_id ,ML.total_eligible,\
                ML.availed_till_date,ML.close_balance, ML.year from hims_d_employee E \
                inner join  hims_f_employee_monthly_leave ML on ML.employee_id=E.hims_d_employee_id and ML.year=?\
                where  E.hospital_id=? and  E.record_status='A' ${strQry} order by cast(E.employee_code as unsigned);\
                select hims_d_leave_id, leave_code, leave_description from hims_d_leave \
                where record_status='A';`,
            values: [input.year, input.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();

            const employees_leave = result[0];
            const leave_master = result[1];
            let outputArray = [];
            if (employees_leave.length > 0 && leave_master.length > 0) {
              _.chain(employees_leave)
                .groupBy((g) => g.hims_d_employee_id)
                .forEach((emp) => {
                  let data = {
                    employee_code: emp[0]["employee_code"],
                    full_name: emp[0]["full_name"],
                    employee_id: emp[0]["hims_d_employee_id"],
                    year: emp[0]["year"],
                  };
                  leave_master.forEach((leave) => {
                    const leave_assignd = emp.find((item) => {
                      return item["leave_id"] == leave["hims_d_leave_id"];
                    });
                    if (leave_assignd != undefined) {
                      data["" + leave["hims_d_leave_id"] + ""] =
                        leave_assignd["close_balance"];
                    } else {
                      data["" + leave["hims_d_leave_id"] + ""] = "N";
                    }
                  });

                  outputArray.push(data);
                })
                .value();

              req.records = {
                leaves: result[1],
                employee_leaves: outputArray,
              };
              next();
            } else {
              req.records = {
                message: "No Employes Found",
                invalid_input: true,
              };
              next();
              return;
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          message: "Please provide valid input",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  InsertOpeningBalanceLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_employee_leave_salary_header` (employee_id, year, balance_leave_days, \
          balance_leave_salary_amount, balance_airticket_amount, leave_days, leave_salary_amount, airticket_amount, \
          airfare_months, hospital_id)\
          VALUE(?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.employee_id,
          input.year,
          input.leave_days,
          input.leave_salary_amount,
          input.airticket_amount,
          input.leave_days,
          input.leave_salary_amount,
          input.airticket_amount,
          input.airfare_months,
          input.hospital_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  getBulkEmployeeLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const input = req.query;

      if (input.hospital_id > 0 && input.year > 0) {
        let strQry = "";
        if (input.employee_group_id > 0) {
          strQry += " and E.employee_group_id=" + input.employee_group_id;
        }
        if (input.hims_d_employee_id > 0) {
          strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
        }

        //-------------------start
        _mysql
          .executeQuery({
            query:
              "select E.employee_code, E.full_name, E.hospital_id, LS.hims_f_employee_leave_salary_header_id, LS.leave_days, \
              LS.leave_salary_amount, LS.airticket_amount, LS.balance_leave_days, LS.balance_leave_salary_amount, \
              LS.balance_airticket_amount, LS.airfare_months, LS.utilized_leave_days, LS.utilized_leave_salary_amount, \
              LS.utilized_airticket_amount, E.hims_d_employee_id as employee_id from hims_d_employee E \
              left join hims_f_employee_leave_salary_header LS on E.hims_d_employee_id=LS.employee_id \
              where E.leave_salary_process = 'Y' and E.record_status = 'A' and E.hospital_id=? order by cast(E.employee_code as unsigned)" +
              strQry,
            values: [input.hospital_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();

            if (result.length > 0) {
              // let final_result = _.sortBy(result, s => s.employee_code);
              req.records = result;
              next();
            } else {
              req.records = {
                message: "No Employes Found",
                invalid_input: true,
              };
              next();
              return;
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          message: "Please provide valid input",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  getEmployeeGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let strQry = "";
    if (input.employee_group_id > 0) {
      strQry += " and E.employee_group_id=" + input.employee_group_id;
    }
    if (input.hims_d_employee_id > 0) {
      strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
    }

    if (input.year !== null) {
      strQry += " and GP.year=" + input.year;
    }
    // if (input.month !== null) {
    //   strQry += " and GP.month=" + input.month;
    // }
    _mysql
      .executeQuery({
        query:
          "select E.employee_code, E.full_name, E.hims_d_employee_id, GP.year, GP.month, GP.gratuity_amount, GP.acc_gratuity,\
          GP.hims_f_gratuity_provision_id from hims_d_employee E inner join hims_f_gratuity_provision GP  on \
          E.hims_d_employee_id = GP.employee_id where E.hospital_id=? " +
          strQry +
          " order by E.hims_d_employee_id;",

        values: [input.hospital_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  getBulkEmployeeGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let strQry = "";
    if (input.employee_group_id > 0) {
      strQry += " and E.employee_group_id=" + input.employee_group_id;
    }
    if (input.hims_d_employee_id > 0) {
      strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
    }

    _mysql
      .executeQuery({
        query:
          "select E.employee_code, E.full_name, E.hims_d_employee_id, GP.year, GP.month, GP.gratuity_amount, \
          GP.hims_f_gratuity_provision_id, GP.acc_gratuity, E.hims_d_employee_id as employee_id from hims_d_employee E \
          left join hims_f_gratuity_provision GP  on E.hims_d_employee_id = GP.employee_id \
          where E.record_status = 'A' and E.hospital_id=? and E.employee_status='A' and E.gratuity_applicable='Y'\
          order by cast(E.employee_code as unsigned)" +
          strQry,
        values: [input.hospital_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        // let final_result = _.sortBy(result, s => s.employee_code);
        // let final_result = result;
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  InsertOpeningBalanceGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_gratuity_provision` (employee_id, year, month, gratuity_amount, acc_gratuity)\
          VALUE(?,?,?,?,?)",
        values: [
          input.employee_id,
          input.year,
          input.month,
          input.gratuity_amount,
          input.gratuity_amount,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  InsertOpeningBalanceLoan: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["EMPLOYEE_LOAN"],
        table_name: "hims_f_hrpayroll_numgen",
      })
      .then((generatedNumbers) => {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_loan_application` (loan_application_number, loan_application_date, employee_id, \
                loan_id, loan_authorized, pending_tenure, installment_amount, pending_loan, start_year, start_month, hospital_id)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers.EMPLOYEE_LOAN,
              input.loan_application_date,
              input.employee_id,
              input.loan_id,
              "IS",
              input.pending_tenure,
              input.installment_amount,
              input.pending_loan,
              input.start_year,
              input.start_month,
              input.hospital_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  UpdateOpeningBalanceGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_gratuity_provision set month=?,acc_gratuity=? \
          WHERE hims_f_gratuity_provision_id = ?",
        values: [
          input.month,
          input.acc_gratuity,
          input.hims_f_gratuity_provision_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  UpdateOpeningBalanceLoan: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_loan_application set pending_tenure=?,installment_amount=?, pending_loan=?, start_month=? \
          WHERE hims_f_loan_application_id = ?",
        values: [
          input.pending_tenure,
          input.installment_amount,
          input.pending_loan,
          input.start_month,
          input.hims_f_loan_application_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan
  downloadEmployeeMaster: (req, res, next) => {
    const _mysql = new algaehMysql();

    if (req.query.hospital_id > 0) {
      _mysql
        .executeQuery({
          query: `select  hospital_name FROM hims_d_hospital where hims_d_hospital_id=? limit 1;\
            select  E.employee_code,E.full_name as name,E.sex as gender ,
            coalesce(E.date_of_joining,'-') as  date_of_joining,
            coalesce(concat(RP.employee_code,' / ', left(RP.full_name,12)),'-') as reporting_to,
            coalesce(G.group_description,'-') as emloyee_group,
            case E.employee_status when 'A' then 'ACTIVE' when 'I' then 'INACTIVE'
            when 'R' then 'RESIGNED' when 'T' then 'TERMINATED' when 'E' then 'RETIRED'
            end as employee_status,   coalesce(DG.designation,'-') as designation,
            coalesce( N.nationality,'-') as nationality,coalesce(R.religion_name,'-') as religion
            ,coalesce(D.department_name,'-') as department,
            coalesce(SD.sub_department_name,'-') as sub_department,
            case E.employee_type when  'PE' then  'PERMANENT' when  'CO' then  'CONTRACT'
            when  'PB' then  'PROBATION' when  'LC' then  'LOCUM'
            when  'VC' then  'VISITING CONSULTANT'end as employee_type,   coalesce(country_name,'-') as country,
            coalesce(state_name,'-') as state,coalesce(city_name,'-') as city,
            coalesce(E.date_of_birth,'-') as date_of_birth,
            coalesce(E.date_of_resignation,'-') as date_of_resignation,coalesce(E.exit_date,'-') as exit_date,
            coalesce(E.work_email,'-') as work_email,coalesce(E.primary_contact_no,'-') as 
            primary_contact_no,E.mode_of_payment
            from hims_d_employee E left join hims_d_employee RP on E.reporting_to_id=RP.hims_d_employee_id
            left join hims_d_designation DG on E.employee_designation_id=DG.hims_d_designation_id
            left join hims_d_religion R on E.religion_id=R.hims_d_religion_id
            left join hims_d_nationality N on E.nationality=N.hims_d_nationality_id
            left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
            left join hims_d_department D on SD.department_id=D.hims_d_department_id
            left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id
            left join hims_d_city C on E.permanent_city_id=C.hims_d_city_id 
            left join hims_d_state S on E.permanent_state_id=S.hims_d_state_id
            left join hims_d_country CO  on E.permanent_country_id=CO.hims_d_country_id  
            where E.hospital_id=? and E.record_status='A' order by cast( E.employee_code as unsigned); `,
          values: [req.query.hospital_id, req.query.hospital_id],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();

          let data = result[1][0];
          let x;
          const columns = [];

          for (x in data) {
            columns.push(x);
          }

          req.records = {
            hospital_name: result[0][0]["hospital_name"],
            columns: columns,
            employees: result[1],
          };
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = { invalid_input: true, message: "Please select branch" };
      next();
      return;
    }
  },
};

//Employee Dept Start
function InsertEmployeeDepartment(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertdeptDetails.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "services_id",
          "sub_department_id",
          "category_speciality_id",
          "user_id",
          "employee_designation_id",
          "reporting_to_id",
          "from_date",
        ];

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_m_employee_department_mappings(??) VALUES ?",
            values: req.body.insertdeptDetails,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeDepartment(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updatedeptDetails.length > 0) {
        let _mysql = options._mysql;

        let inputParam = extend([], req.body.updatedeptDetails);
        let qry = "";

        for (let i = 0; i < req.body.updatedeptDetails.length; i++) {
          qry += mysql.format(
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
              inputParam[i].hims_d_employee_department_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Employee Dept End

//Service Start
function InsertServiceCommission(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertserviceComm.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "provider_id",
          "services_id",
          "service_type_id",
          "op_cash_commission_percent",
          "op_credit_commission_percent",
          "ip_cash_commission_percent",
          "ip_credit_commission_percent",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_m_doctor_service_commission(??) VALUES ?",
            values: req.body.insertserviceComm,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateServiceCommission(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateserviceComm.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateserviceComm);

        for (let i = 0; i < input.updateserviceComm.length; i++) {
          qry += mysql.format(
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
              inputParam[i].hims_m_doctor_service_commission_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Service End

//Service Type Start
function InsertServiceTypeCommission(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertservTypeCommission.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "provider_id",
          "service_type_id",
          "op_cash_comission_percent",
          "op_credit_comission_percent",
          "ip_cash_commission_percent",
          "ip_credit_commission_percent",
        ];

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_m_doctor_service_type_commission(??) VALUES ?",
            values: req.body.insertservTypeCommission,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateServiceTypeCommission(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateservTypeCommission.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateservTypeCommission);

        for (let i = 0; i < input.updateserviceComm.length; i++) {
          qry += mysql.format(
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
              inputParam[i].hims_m_doctor_service_type_commission_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Service Type End

//Earning Start
function InsertEmployeeEarnings(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertearnComp.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "earnings_id",
          "short_desc",
          "amount",
          "formula",
          "allocate",
          "calculation_method",
          "calculation_type",
          "revision_type",
          "revision_date",
          "revised_amount",
          "applicable_annual_leave",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_d_employee_earnings(??) VALUES ?",
            values: req.body.insertearnComp,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            extraValues: {
              hospital_id: req.userIdentity.hospital_id,
            },
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeEarnings(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateearnComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateearnComp);

        for (let i = 0; i < req.body.updateearnComp.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_d_employee_earnings` SET \
            `amount`=?,`allocate`=? where hims_d_employee_earnings_id=?;",
            [
              inputParam[i].amount,
              inputParam[i].allocate,
              inputParam[i].hims_d_employee_earnings_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function DeleteEmployeeEarnings(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.deleteearnComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.deleteearnComp);

        for (let i = 0; i < req.body.deleteearnComp.length; i++) {
          qry += mysql.format(
            "DELETE FROM `hims_d_employee_earnings` where hims_d_employee_earnings_id=?;",
            [inputParam[i].hims_d_employee_earnings_id]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Earning End

//Deduction Start
function InsertEmployeeDeduction(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertDeductionComp.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "deductions_id",
          "short_desc",
          "amount",
          "formula",
          "allocate",
          "calculation_method",
          "calculation_type",
          "revision_type",
          "revision_date",
          "revised_amount",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_d_employee_deductions(??) VALUES ?",
            values: req.body.insertDeductionComp,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            extraValues: {
              hospital_id: req.userIdentity.hospital_id,
            },
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeDeduction(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      let req = options.req;

      if (req.body.updateDeductionComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateDeductionComp);

        for (let i = 0; i < req.body.updateDeductionComp.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_d_employee_deductions` SET \
            `amount`=?,`allocate`=? where hims_d_employee_deductions_id=?;",
            [
              inputParam[i].amount,
              inputParam[i].allocate,
              inputParam[i].hims_d_employee_deductions_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function DeleteEmployeeDeduction(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.deleteDeductionComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.deleteDeductionComp);

        for (let i = 0; i < req.body.deleteDeductionComp.length; i++) {
          qry += mysql.format(
            "DELETE FROM `hims_d_employee_deductions` where hims_d_employee_deductions_id=?;",
            [inputParam[i].hims_d_employee_deductions_id]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Deduction End

//Contributions Start
function InsertEmployeeContributions(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertContributeComp.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "contributions_id",
          "short_desc",
          "amount",
          "formula",
          "allocate",
          "calculation_method",
          "calculation_type",
          "revision_type",
          "revision_date",
          "revised_amount",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_d_employee_contributions(??) VALUES ?",
            values: req.body.insertContributeComp,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            extraValues: {
              hospital_id: req.userIdentity.hospital_id,
            },
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeContributions(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateContributeComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateContributeComp);

        for (let i = 0; i < req.body.updateContributeComp.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_d_employee_contributions` SET \
            `amount`=?,`allocate`=? where hims_d_employee_contributions_id=?;",
            [
              inputParam[i].amount,
              inputParam[i].allocate,
              inputParam[i].hims_d_employee_contributions_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function DeleteEmployeeContributions(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.deleteContributeComp.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.deleteContributeComp);

        for (let i = 0; i < req.body.deleteContributeComp.length; i++) {
          qry += mysql.format(
            "DELETE FROM `hims_d_employee_contributions` where hims_d_employee_contributions_id=?;",
            [inputParam[i].hims_d_employee_contributions_id]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Contributions End

//Employee Identification Start
function InsertEmployeeIdentification(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertIdDetails.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "identity_documents_id",
          "identity_number",
          "valid_upto",

          "issue_date",
          "alert_required",
          "alert_date",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_d_employee_identification(??) VALUES ?",
            values: req.body.insertIdDetails,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeIdentification(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateIdDetails.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateIdDetails);

        for (let i = 0; i < req.body.updateIdDetails.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_d_employee_identification` SET \
            `identity_number`=?,`issue_date`=?, `valid_upto`=?  where hims_d_employee_identification_id=?;",
            [
              inputParam[i].identity_number,
              moment(inputParam[i].issue_date).format("YYYY-MM-DD"),
              moment(inputParam[i].valid_upto).format("YYYY-MM-DD"),

              inputParam[i].hims_d_employee_identification_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function DeleteEmployeeIdentification(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.deleteIdDetails.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.deleteIdDetails);

        for (let i = 0; i < req.body.deleteIdDetails.length; i++) {
          qry += mysql.format(
            "DELETE FROM `hims_d_employee_identification` where hims_d_employee_identification_id=?;",
            [inputParam[i].hims_d_employee_identification_id]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Employee Identification End

//Employee Dependents Start
function InsertEmployeeDependents(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.insertDependentDetails.length > 0) {
        let _mysql = options._mysql;

        const insurtColumns = [
          "employee_id",
          "dependent_type",
          "dependent_name",
          "dependent_identity_type",
          "dependent_identity_no",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_d_employee_dependents(??) VALUES ?",
            values: req.body.insertDependentDetails,
            includeValues: insurtColumns,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateEmployeeDependents(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.updateDependentDetails.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.updateDependentDetails);

        for (let i = 0; i < req.body.updateDependentDetails.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_d_employee_dependents` SET `dependent_type`=?,`dependent_name`=?, \
            `dependent_identity_type`=?, `dependent_identity_no`=? where hims_d_employee_dependents_id=?;",
            [
              inputParam[i].dependent_type,
              inputParam[i].dependent_name,
              inputParam[i].dependent_identity_type,
              inputParam[i].dependent_identity_no,
              inputParam[i].hims_d_employee_dependents_id,
            ]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function DeleteEmployeeDependents(options) {
  return new Promise((resolve, reject) => {
    try {
      let req = options.req;
      if (req.body.deleteDependentDetails.length > 0) {
        let _mysql = options._mysql;

        let qry = "";
        let inputParam = extend([], req.body.deleteDependentDetails);

        for (let i = 0; i < req.body.deleteDependentDetails.length; i++) {
          qry += mysql.format(
            "DELETE FROM `hims_d_employee_dependents` where hims_d_employee_dependents_id=?;",
            [inputParam[i].hims_d_employee_dependents_id]
          );
        }

        _mysql
          .executeQuery({
            query: qry,
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            req.records = result;
            resolve(result);
          })
          .catch((e) => {
            options.next(e);
            reject(e);
          });
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//Employee Dependents End
