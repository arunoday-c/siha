import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";
import leave from "../models/leave";
import keys from "algaeh-keys";
import AESCrypt from "aescrypt";
import algaehMail from "algaeh-utilities/mail-send";
// import _ from "lodash";
import newAxios from "algaeh-utilities/axios";
// import { currencyFormat } from "../../../AlgaehUtilities";
import utilitites from "algaeh-utilities/utilities";
// import { currencyFormat } from "algaeh-utilities/currencyFormat";

const { SECRETKey } = keys.default;

const { getMaxAuth } = leave;

export default {
  getEmployeeLoanOpenBal: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const input = req.query;

      let inputValues = [];

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
            "select E.employee_code, E.full_name, LA.loan_amount, LA.approved_amount, LA.start_month, LA.start_year, \
             LA.loan_tenure, LA.pending_tenure, LA.installment_amount, LA.pending_loan, L.loan_description, LA.hims_f_loan_application_id from hims_f_loan_application LA \
             inner join hims_d_employee E on E.hims_d_employee_id=LA.employee_id \
             inner join hims_d_loan L on L.hims_d_loan_id=LA.loan_id where loan_authorized <> 'REJ' and E.hospital_id=? " +
            strQry,
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by irfan:
  addLoanApplication: (req, res, next) => {
    const utilities = new algaehUtilities();
    try {
      const _mysql = new algaehMysql();
      let input = req.body;
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id,date_of_joining,exit_date ,employee_status from hims_d_employee\
              where record_status='A' and  hims_d_employee_id=?",

          values: [input.employee_id],

          printQuery: true,
        })
        .then((emp) => {
          if (emp.length > 0) {
            let today = moment(new Date()).format("YYYY-MM-DD");

            if (emp[0].employee_status != "A") {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan ,your status is inactive",
              };
              next();
              return;
            } else if (emp[0].date_of_joining > today) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan before joining date",
              };
              next();
              return;
            } else if (emp[0].exit_date != null) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan for resigned employee",
              };
              next();
              return;
            } else {
              // console.log("userIdentity: ", req.userIdentity);
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
                        "INSERT INTO `hims_f_loan_application` (loan_application_number,employee_id,loan_id,\
                application_reason,loan_application_date,loan_amount,start_month,start_year,loan_tenure,\
                installment_amount, pending_loan,created_date, created_by, updated_date, updated_by,hospital_id)\
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        generatedNumbers.EMPLOYEE_LOAN,

                        input.employee_id,
                        input.loan_id,
                        input.application_reason,
                        new Date(),
                        input.loan_amount,
                        input.start_month,
                        input.start_year,
                        input.loan_tenure,
                        input.installment_amount,
                        input.loan_amount,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        input.hospital_id,
                      ],

                      printQuery: true,
                    })
                    .then((result) => {
                      req.records = {
                        ...result,
                        EMPLOYEE_LOAN: generatedNumbers.EMPLOYEE_LOAN,
                      };
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();

                        next();
                      });
                    })
                    .catch((e) => {
                      utilities.logger().log("e: ", e);
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
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Employee doesn't exist",
            };
            next();
            return;
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  mailSendForLoan: (req, res, next) => {
    const input = req.query;

    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: ` select  UM.user_id, UM.role_id,U.employee_id,E.work_email,E.employee_code,E.full_name
        from algaeh_m_role_user_mappings UM inner join algaeh_d_app_roles R on
        UM.role_id=R.app_d_app_roles_id and R.loan_authorize_privilege ='1'
        inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id 
        inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id;
            select hims_f_email_setup_id,sub_department_email,enable_email,password,salt,report_attach,report_name,sub_department_id from
            hims_f_email_setup where email_type=?`,
        values: [input.email_type],
        printQuery: true,
      })
      .then((result) => {
        const toSendDetails = result[0].map((item) => {
          return item.work_email;
        });

        const fromSendDetails = result[1][0];
        if (fromSendDetails.enable_email === "N") {
          _mysql.releaseConnection();
          next();
          return;
        }
        req.sendingMail = true;
        // console.log("fromSendDetails", fromSendDetails);
        const decrypted = AESCrypt.decryptWithSalt(
          SECRETKey,
          fromSendDetails.salt,
          fromSendDetails.password
        );
        const full_name = input.full_name;
        const employee_code = input.employee_code;
        const loan_application_date = moment(new Date()).format("DD-MM-YYYY");
        const application_reason = input.application_reason;

        const installment_amount = new utilitites().getCurrencyFormart(
          input.installment_amount,
          req.userIdentity
        );
        const start_month = input.start_month;
        const start_year = input.start_year;
        const loan_desc = input.loan_description;
        const loan_code = input.loan_code;
        const { hospital_address, hospital_name } = req.userIdentity;
        const loan_amount = new utilitites().getCurrencyFormart(
          input.loan_amount,
          req.userIdentity
        );

        try {
          newAxios(req, {
            url: "http://localhost:3006/api/v1//Document/getEmailConfig",
          }).then((res) => {
            const options = res.data.data[0];

            // const mailSender =
            new algaehMail({
              user: fromSendDetails.sub_department_email,
              pass: decrypted,
              smtp: options.host,
              port: options.port,
              useSSL: options.secure,
              service: options.service,
            })
              .to(toSendDetails)
              .subject("Employee Loan Request")
              .templateHbs("loan_request_mail.hbs", {
                full_name,
                hospital_name,
                hospital_address,
                employee_code,
                loan_application_date,
                application_reason,
                loan_desc,
                loan_amount,
                installment_amount,
                start_month,
                start_year,
                loan_code,
              })
              .send()
              .then((response) => {
                // res.status(200).json({ success: true, message: "sucess" });
                // next();
                console.log("Mail Sent Sucessfully", response);
              })
              .catch((error) => {
                // next(error);

                console.log(error);
              });

            // if (send_attachment === "true") {
            //   mailSender.attachReportsAndSend(
            //     req,
            //     reportInput,
            //     (error, records) => {
            //       if (error) {
            //         next(error);
            //         return;
            //       }

            //       next();
            //     }
            //   );
            // } else {
            //   mailSender
            //     .send()
            //     .then(() => {
            //       // console.log("Mail Sent");
            //       next();
            //     })
            //     .catch((error) => {
            //       next(error);
            //     });
            // _mysql.releaseConnection();
            // req.records = result;
            // next();
          });
        } catch (e) {
          _mysql.releaseConnection();
          next(e);
        }
        _mysql.releaseConnection();
        // req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  sendAuthorizeLoanEmail: (req, res, next) => {
    const input = req.body;

    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query: `
        select  UM.user_id, UM.role_id,U.employee_id,E.work_email,E.employee_code,E.full_name
    from algaeh_m_role_user_mappings UM inner join algaeh_d_app_roles R on
    UM.role_id=R.app_d_app_roles_id and R.loan_authorize_privilege ='${
      parseInt(input.auth_level) + 1
    }'
    inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id 
    inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id;
        
        select hims_f_email_setup_id,sub_department_email,password,salt,report_attach,enable_email,report_name,sub_department_id from
        hims_f_email_setup where email_type=?;
        select EM.work_email from hims_d_employee EM where hims_d_employee_id=?;  `,
        values: [input.email_type, input.employee_id],
        printQuery: true,
      })
      .then((result) => {
        const toSendDetails = result[0].map((item) => {
          return item.work_email;
        });

        const fromSendDetails = result[1][0];
        if (fromSendDetails.enable_email === "N") {
          _mysql.releaseConnection();
          next();
          return;
        }
        req.sendingMail = true;
        // console.log("fromSendDetails", fromSendDetails);
        const decrypted = AESCrypt.decryptWithSalt(
          SECRETKey,
          fromSendDetails.salt,
          fromSendDetails.password
        );
        const full_name = input.name;

        // const employee_code = input.code;
        const employee_email = result[2][0].work_email;
        const employee_code = input.employee_code;
        const loan_code = input.loan_code;

        const auth_level = input.auth_level;
        const loan_desc = input.loan_desc;
        const approved_amount = new utilitites().getCurrencyFormart(
          input.approved_amount,
          req.userIdentity
        );
        const installment_amount = new utilitites().getCurrencyFormart(
          input.installment_amount,
          req.userIdentity
        );
        const loan_tenure = input.loan_tenure;

        const loan_application_date = moment(new Date()).format("DD-MM-YYYY");
        const application_reason = input.application_reason;
        const loan_amount = new utilitites().getCurrencyFormart(
          input.loan_amount,
          req.userIdentity
        );

        const start_month = input.start_month;
        const start_year = input.start_year;

        const { hospital_address, hospital_name } = req.userIdentity;
        // const branch = hospital_name;
        try {
          newAxios(req, {
            url: "http://localhost:3006/api/v1//Document/getEmailConfig",
          }).then((res) => {
            const options = res.data.data[0];
            let templateName = "";
            let subject = "";
            let toEmail = undefined;
            if (toSendDetails.length <= 0) {
              if (
                Array.isArray(employee_email) &&
                employee_email.length === 0
              ) {
                _mysql.releaseConnection();
                next(new Error(`There is no email found for '${full_name}'`));
                return;
              } else {
                templateName = "loan_approve_mail.hbs";
                subject = "Your loan got approved";
                toEmail = employee_email;
              }
              // try {
              //   // const mailSender =
              //   new algaehMail({
              //     user: fromSendDetails.sub_department_email,
              //     pass: decrypted,
              //     smtp: options.host,
              //     port: options.port,
              //     useSSL: options.useSSL,
              //     service: options.service,
              //   })
              //     .to()
              //     .subject()
              //     .templateHbs("loan_approve_mail.hbs", {
              //       full_name,
              //       hospital_name,
              //       hospital_address,
              //       auth_level,
              //       loan_desc,
              //       approved_amount,
              //       installment_amount,
              //       loan_tenure,
              //     })
              //     .send()
              //     .then((response) => {
              //       _mysql.releaseConnection();
              //       next();
              //     })
              //     .catch((error) => {
              //       next(error);
              //     });

              //   // if (send_attachment === "true") {
              //   //   mailSender.attachReportsAndSend(
              //   //     req,
              //   //     reportInput,
              //   //     (error, records) => {
              //   //       if (error) {
              //   //         next(error);
              //   //         return;
              //   //       }

              //   //       next();
              //   //     }
              //   //   );
              //   // } else {
              //   //   mailSender
              //   //     .send()
              //   //     .then(() => {
              //   //       // console.log("Mail Sent");
              //   //       next();
              //   //     })
              //   //     .catch((error) => {
              //   //       next(error);
              //   //     });
              // } catch (e) {
              //   //_mysql.releaseConnection();
              //   next(e);
              // }
            } else {
              templateName = "loan_request_mail.hbs";
              subject = "Employee Loan Request";
              toEmail = toSendDetails;
            }
            try {
              // const mailSender =
              new algaehMail({
                user: fromSendDetails.sub_department_email,
                pass: decrypted,
                smtp: options.host,
                port: options.port,
                useSSL: options.secure,
                service: options.service,
              })
                .to(toEmail)
                .subject(subject)
                .templateHbs(templateName, {
                  full_name,
                  hospital_name,
                  hospital_address,
                  employee_code,
                  loan_application_date,
                  application_reason,
                  loan_code,
                  loan_amount,
                  installment_amount,
                  start_month,
                  start_year,
                  auth_level,
                  loan_desc,
                  approved_amount,
                  loan_tenure,
                })
                .send()
                .then((response) => {
                  // res.status(200).json({ success: true, message: "sucess" });
                  // _mysql.releaseConnection();
                  // req.records = result;
                  // next();
                  console.log("Mail Sent Sucessfully");
                })
                .catch((error) => {
                  // next(error);
                  console.log(error);
                });
            } catch (e) {
              //_mysql.releaseConnection();
              next(e);
            }
          });
        } catch (e) {
          //_mysql.releaseConnection();
          next(e);
        }

        // _mysql.releaseConnection();
        // req.records = result;
        // next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  sendAuthorizeLoanRejEmail: (req, res, next) => {
    const input = req.body;

    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query: `select work_email from hims_d_employee where hims_d_employee_id=?;
            select hims_f_email_setup_id,sub_department_email,password,salt,report_attach,report_name,sub_department_id from
            hims_f_email_setup where email_type=? ;
            `,
        values: [input.employee_id, input.email_type],
        printQuery: true,
      })
      .then((result) => {
        const full_name = input.name;
        const employee_code = input.employee_code;
        const loan_code = input.loan_code;

        const auth_level = input.auth_level;
        const loan_desc = input.loan_desc;
        const approved_amount = new utilitites().getCurrencyFormart(
          input.approved_amount,
          req.userIdentity
        );
        const installment_amount = new utilitites().getCurrencyFormart(
          input.installment_amount,
          req.userIdentity
        );
        const loan_tenure = input.loan_tenure;

        const loan_application_date = moment(new Date()).format("DD-MM-YYYY");
        const application_reason = input.application_reason;
        const loan_amount = new utilitites().getCurrencyFormart(
          input.loan_amount,
          req.userIdentity
        );

        const start_month = input.start_month;
        const start_year = input.start_year;

        const toSendDetails = result[0][0].work_email;
        const fromSendDetails = result[1][0];
        if (fromSendDetails.enable_email === "N") {
          _mysql.releaseConnection();
          next();
          return;
        }
        req.sendingMail = true;
        // console.log("fromSendDetails", fromSendDetails);
        const decrypted = AESCrypt.decryptWithSalt(
          SECRETKey,
          fromSendDetails.salt,
          fromSendDetails.password
        );

        const { hospital_address, hospital_name } = req.userIdentity;
        if (!toSendDetails) {
          _mysql.releaseConnection();
          next(new Error(`There is no email found for '${full_name}'`));
          return;
        } else {
          try {
            newAxios(req, {
              url: "http://localhost:3006/api/v1//Document/getEmailConfig",
            }).then((res) => {
              const options = res.data.data[0];

              // const mailSender =
              new algaehMail({
                user: fromSendDetails.sub_department_email,
                pass: decrypted,
                smtp: options.host,
                port: options.port,
                useSSL: options.secure,
                service: options.service,
              })
                .to(toSendDetails)
                .subject("Your loan got rejected")
                .templateHbs("loan_reject_mail.hbs", {
                  full_name,
                  hospital_name,
                  hospital_address,
                  employee_code,
                  loan_application_date,
                  application_reason,
                  loan_code,
                  loan_amount,
                  installment_amount,
                  start_month,
                  start_year,
                  auth_level,
                  loan_desc,
                  approved_amount,
                  loan_tenure,
                })
                .send()
                .then((response) => {
                  // res.status(200).json({ success: true, message: "sucess" });
                  // _mysql.releaseConnection();
                  console.log("Mail Sent Sucessfully");
                })
                .catch((error) => {
                  // next(error);
                  console.log(error);
                });

              // if (send_attachment === "true") {
              //   mailSender.attachReportsAndSend(
              //     req,
              //     reportInput,
              //     (error, records) => {
              //       if (error) {
              //         next(error);
              //         return;
              //       }

              //       next();
              //     }
              //   );
              // } else {
              //   mailSender
              //     .send()
              //     .then(() => {
              //       // console.log("Mail Sent");
              //       next();
              //     })
              //     .catch((error) => {
              //       next(error);
              //     });
            });
          } catch (e) {
            //_mysql.releaseConnection();
            next(e);
          }
        }
        // _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  adjustLoanApplication: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;

    if (input.hims_f_loan_application_id > 0 && input.loan_skip_months >= 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_loan_application SET loan_skip_months = ?,\
          updated_date=?, updated_by=?  WHERE record_status='A' and  hims_f_loan_application_id = ?",
          values: [
            input.loan_skip_months,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_loan_application_id,
          ],

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid loan application id",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input",
      };

      next();
      return;
    }
  },

  //created by irfan: to show loan application to authorize
  getLoanApplication_bkp_09_06_2020: (req, res, next) => {
    let employee = "";
    let range = "";

    if (req.query.employee_id > 0) {
      employee = ` and employee_id=${req.query.employee_id} `;
    }

    console.log("req.query.loan_authorized ", req.query.loan_authorized);
    if (
      req.query.loan_authorized !== null &&
      req.query.loan_authorized !== undefined
    ) {
      employee += ` and loan_authorized= '${req.query.loan_authorized}'`;
    }

    if (req.query.hospital_id > 0) {
      employee += ` and  LA.hospital_id=${req.query.hospital_id} `;
    }

    if (
      req.query.from_date != "null" &&
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.to_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null
    ) {
      range = ` and date(loan_application_date)
      between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    let auth_level = "";
    if (req.query.auth_level == "1") {
      auth_level = " and authorized1='P' ";
    } else if (req.query.auth_level == "2") {
      auth_level = " and authorized1='A' and authorized2='P' ";
    }

    let loan_issued = "";

    if (req.query.loan_issued == "Y") {
      loan_issued = " and loan_authorized='IS' ";
    }

    let loan_closed = "";
    if (req.query.loan_closed == "Y" || req.query.loan_closed == "N") {
      loan_closed = ` and LA.loan_closed='${req.query.loan_closed}' `;
    }

    // if (req.userIdentity.loan_authorize_privilege != "N") {
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "select hims_f_loan_application_id,loan_application_number, loan_skip_months , employee_id,loan_id,L.loan_code,L.loan_description,\
          L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
          loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
          start_month,start_year,loan_tenure,pending_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
          authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
          hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
           and E.record_status='A' where L.record_status='A' " +
          employee +
          "" +
          range +
          "" +
          auth_level +
          "" +
          loan_issued +
          "" +
          loan_closed +
          " order by hims_f_loan_application_id desc",

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

  //created by irfan: to show loan application to authorize
  getLoanApplication: (req, res, next) => {
    let input = req.query;
    let employee = "";
    let range = "";

    if (input.employee_id > 0) {
      employee = ` and LA.employee_id=${input.employee_id} `;
    }

    if (input.loan_authorized) {
      employee += ` and loan_authorized= '${input.loan_authorized}'`;
    }

    if (input.select_all === "true") {
      employee += " and E.hospital_id in (" + input.hospital_id + ")";
    } else if (input.hospital_id > 0) {
      employee += " and E.hospital_id='" + input.hospital_id + "'";
    } else {
      employee += " and E.hospital_id='" + req.userIdentity.hospital_id + "'";
    }

    // if (input.hospital_id > 0) {
    //   employee += ` and  E.hospital_id in (${input.hospital_id})`;
    // }else if(input.hospital_id > 0){
    //   employee += ` and  E.hospital_id in (${input.hospital_id})`;
    // }

    if (input.from_date && input.to_date) {
      range = ` and date(loan_application_date)
      between date('${input.from_date}') and date('${input.to_date}') `;
    }

    let loan_issued = "";

    if (input.loan_issued == "Y") {
      loan_issued = " and loan_authorized='IS' ";
    }

    let loan_closed = "";
    if (input.loan_closed == "Y" || input.loan_closed == "N") {
      loan_closed = ` and LA.loan_closed='${input.loan_closed}' `;
    }

    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: "select authorization_plan from hims_d_hrms_options;",
      })
      .then((options) => {
        if (options.length > 0) {
          let auth_level = "";
          if (input.loan_authorized == "PEN") {
            if (options[0]["authorization_plan"] == "A") {
              if (input.auth_level == "1") {
                auth_level =
                  " and authorized1='P'  and AUS.loan_level1=" +
                  req.userIdentity.employee_id;
              } else if (input.auth_level == "2") {
                auth_level =
                  " and authorized1='A' and authorized2='P'  and AUS.loan_level2=" +
                  req.userIdentity.employee_id;
              }
            } else {
              switch (input.auth_level) {
                case "1":
                  if (req.userIdentity.loan_authorize_privilege > 1) {
                    auth_level = " and authorized1='P'  ";
                  } else {
                    // auth_level =
                    //   " and authorized1='P' AND E.reporting_to_id=" +
                    //   req.userIdentity.employee_id;

                    auth_level = " and authorized1='P'  ";
                  }
                  break;
                case "2":
                  auth_level = " and authorized1='A' and authorized2='P' ";
                  break;
              }
            }
          }

          _mysql
            .executeQuery({
              query:
                "select hims_f_loan_application_id,loan_application_number, loan_skip_months , LA.employee_id,loan_id,L.loan_code,L.loan_description,\
            L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
            loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
            start_month,start_year,loan_tenure,pending_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
            authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
            hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
             and E.record_status='A'  left join hims_d_authorization_setup AUS on  AUS.employee_id=E.hims_d_employee_id\
             where L.record_status='A' " +
                employee +
                "" +
                range +
                "" +
                auth_level +
                "" +
                loan_issued +
                "" +
                loan_closed +
                " order by hims_f_loan_application_id desc ;",

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
          _mysql.releaseConnection();
          req.records = {
            message: "Please define HRMS options",
            invalid_input: true,
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getLoanLevels(req, res, next) {
    try {
      let userPrivilege = req.userIdentity.loan_authorize_privilege;

      let auth_levels = [];
      switch (userPrivilege) {
        case "1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "2":
          auth_levels.push(
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
        case "3":
          auth_levels.push(
            { name: "Level 3", value: 3 },
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
        case "4":
          auth_levels.push(
            { name: "Level 4", value: 4 },
            { name: "Level 3", value: 3 },
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
      }

      req.records = { auth_levels };
      next();
    } catch (e) {
      next(e);
    }
  },
  //created by irfan: to
  authorizeLoan: (req, res, next) => {
    const utilities = new algaehUtilities();
    const input = req.body;

    if (req.userIdentity.loan_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql,
      })
        .then((maxAuth) => {
          if (
            req.userIdentity.loan_authorize_privilege < maxAuth.MaxLoan ||
            input.auth_level < maxAuth.MaxLoan
          ) {
            //for lower level authorize
            getLoanAuthFields(input.auth_level).then((authFields) => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_loan_application SET " +
                    authFields +
                    ",approved_amount=?,pending_loan=?,start_year=?,start_month=?,installment_amount=?,\
                  loan_tenure=?,pending_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?;",
                  values: [
                    input.authorized,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    input.approved_amount,
                    input.approved_amount,
                    input.start_year,
                    input.start_month,
                    input.installment_amount,
                    input.loan_tenure,
                    input.loan_tenure,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_loan_application_id,
                  ],
                  printQuery: true,
                })
                .then((result) => {
                  if (result.affectedRows > 0 && input.authorized == "R") {
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_loan_application set loan_authorized='REJ'\
                          where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=?",
                        values: [input.hims_f_loan_application_id],
                        printQuery: true,
                      })
                      .then((rejResult) => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejResult;
                          next();
                        });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (result.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  } else {
                    req.records = {
                      invalid_input: true,
                      message: "Please provide valid loan application id ",
                    };
                    _mysql.rollBackTransaction(() => {
                      next();
                    });
                  }
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          } else if (
            req.userIdentity.loan_authorize_privilege >= maxAuth.MaxLoan &&
            input.auth_level >= maxAuth.MaxLoan
          ) {
            //if he has highest previlege
            getLoanAuthFields(input.auth_level).then((authFields) => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_loan_application SET " +
                    authFields +
                    ",approved_amount=?,pending_loan=?,start_year=?,start_month=?,installment_amount=?,\
                  loan_tenure=?,pending_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",
                  values: [
                    input.authorized,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    input.approved_amount,
                    input.approved_amount,
                    input.start_year,
                    input.start_month,
                    input.installment_amount,
                    input.loan_tenure,
                    input.loan_tenure,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_loan_application_id,
                  ],
                  printQuery: true,
                })
                .then((result) => {
                  if (
                    result.affectedRows > 0 &&
                    (input.authorized == "R" || input.authorized == "A")
                  ) {
                    let qry = "";

                    if (input.authorized == "R") {
                      qry = `update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${input.hims_f_loan_application_id}`;
                    } else if (input.authorized == "A") {
                      qry = `update hims_f_loan_application set loan_authorized='APR',authorized_date='${moment().format(
                        "YYYY-MM-DD"
                      )}', authorized_by=${
                        req.userIdentity.algaeh_d_app_user_id
                      }\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                    }

                    //---------------

                    _mysql
                      .executeQueryWithTransaction({
                        query: qry,
                        printQuery: true,
                      })
                      .then((rejResult) => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejResult;
                          next();
                        });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (result.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  } else {
                    req.records = {
                      invalid_input: true,
                      message: "Please provide valid loan application id ",
                    };
                    _mysql.releaseConnection();
                    next();
                  }
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          } else {
            req.records = {
              invalid_user: true,
              message: "Please provide valid Auth level",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege",
      };
      next();
    }
  },
  //created by irfan: to

  addFinalSettlementReceipt: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["EMPLOYEE_RECEIPT"],
        table_name: "hims_f_hrpayroll_numgen",
      })
      .then((generatedNumbers) => {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_employee_reciepts` (emp_recp_number,employee_id,reciepts_type,recievable_amount,\
            write_off_amount,final_settlement_id,remarks,salary_id,reciepts_mode,cheque_number,\
             created_date, created_by, updated_date, updated_by,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers.EMPLOYEE_RECEIPT,
              input.employee_id,
              input.reciepts_type,
              input.recievable_amount,
              input.write_off_amount,
              input.final_settlement_id,
              input.remarks,
              input.salary_id,
              input.reciepts_mode,
              input.cheque_number,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.hospital_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            req.records = {
              ...result,
              EMPLOYEE_RECEIPT: generatedNumbers.EMPLOYEE_RECEIPT,
            };
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();

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
  addLoanReciept: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["EMPLOYEE_RECEIPT"],
        table_name: "hims_f_hrpayroll_numgen",
      })
      .then((generatedNumbers) => {
        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO `hims_f_employee_reciepts` (emp_recp_number,employee_id,reciepts_type,recievable_amount,\
            write_off_amount,loan_application_id,remarks,balance_amount,reciepts_mode,cheque_number,salary_id,\
             created_date, created_by, updated_date, updated_by,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers.EMPLOYEE_RECEIPT,
              input.employee_id,
              input.reciepts_type,
              input.recievable_amount,
              input.write_off_amount,
              input.loan_application_id,
              input.remarks,
              input.balance_amount,
              input.reciepts_mode,
              input.cheque_number,
              input.salary_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.hospital_id,
            ],
            printQuery: true,
          })
          .then((result) => {
            if (result.insertId > 0) {
              _mysql
                .executeQuery({
                  query:
                    "select hims_f_loan_application_id,pending_loan from\
              hims_f_loan_application where hims_f_loan_application_id=?",
                  values: [input.loan_application_id],
                  printQuery: true,
                })
                .then((pendingResult) => {
                  const cur_pending_loan =
                    parseFloat(pendingResult[0]["pending_loan"]) -
                    parseFloat(input.recievable_amount) -
                    parseFloat(input.write_off_amount);

                  let close_loan = "";
                  if (cur_pending_loan == parseFloat(0)) {
                    close_loan = ",loan_closed='Y'";
                  }

                  if (cur_pending_loan === parseFloat(input.balance_amount)) {
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_loan_application set pending_loan=?" +
                          close_loan +
                          " where hims_f_loan_application_id=?",
                        values: [cur_pending_loan, input.loan_application_id],
                        printQuery: true,
                      })
                      .then((updateResult) => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = updateResult;
                          next();
                        });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else {
                    _mysql.rollBackTransaction(() => {
                      req.records = {
                        invalid_input: true,
                        message: "calculation incorrect",
                      };
                      next();
                    });
                  }
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              //roll back

              _mysql.rollBackTransaction(() => {
                req.records = {
                  invalid_input: true,
                  message: "Please provide valid input",
                };
                next();
              });
            }
          });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  },

  //created by irfan:
  getEmployeeLoanReciept: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.query.hospital_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "select ER.*,LA.loan_application_number,LA.application_reason,\
              L.loan_code,L.loan_description,E.employee_code,E.full_name as employee_name,SL.salary_number \
              from hims_f_employee_reciepts ER \
              inner join hims_f_loan_application LA on ER.loan_application_id=LA.hims_f_loan_application_id\
              inner join hims_d_loan L on LA.loan_id=L.hims_d_loan_id \
              inner join hims_d_employee E on ER.employee_id=E.hims_d_employee_id \
              left join hims_f_salary SL on SL.hims_f_salary_id=ER.salary_id \
              where ER.hospital_id=? order by hims_f_employee_reciepts_id desc",
          values: [req.query.hospital_id],

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
      req.records = {
        invalid_input: true,
        message: "please provide employee id",
      };

      next();
      return;
    }
  },

  getEmployeeFinalSettlementReceipt: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.query.hospital_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select ER.*,FSH.final_settlement_number,S.salary_number,
          E.employee_code,E.full_name as employee_name from hims_f_employee_reciepts ER
           inner join hims_f_final_settlement_header FSH on ER.final_settlement_id=FSH.hims_f_final_settlement_header_id  
          inner join hims_d_employee E on ER.employee_id=E.hims_d_employee_id
          left join hims_f_salary S on ER.salary_id=S.hims_f_salary_id 
            where ER.hospital_id=? order by hims_f_employee_reciepts_id desc`,
          values: [req.query.hospital_id],

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
      req.records = {
        invalid_input: true,
        message: "please provide employee id",
      };

      next();
      return;
    }
  },

  //created by irfan:
  getLoanLevels(req, res, next) {
    try {
      const userPrivilege = req.userIdentity.loan_authorize_privilege;

      if (userPrivilege != "N") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query: `SELECT authorization_plan FROM hims_d_hrms_options limit 1;\
            select leave_level1 from hims_d_authorization_setup where leave_level1=
              ${req.userIdentity.employee_id}  limit 1`,
          })
          .then((result) => {
            _mysql.releaseConnection();

            if (result.length > 0) {
              //----------------

              let auth_levels = [];

              if (result[0][0]["authorization_plan"] == "R") {
                switch (userPrivilege.toString()) {
                  case "1":
                    auth_levels.push({ name: "Level 1", value: 1 });
                    break;
                  case "2":
                    auth_levels.push(
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "3":
                    auth_levels.push(
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "4":
                    auth_levels.push(
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "5":
                    auth_levels.push(
                      { name: "Level 5", value: 5 },
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                }
              } else if (result[0][0]["authorization_plan"] == "A") {
                ///------------------------

                switch (userPrivilege.toString()) {
                  case "1":
                    if (result[1].length > 0) {
                      auth_levels.push({ name: "Level 1", value: 1 });
                    }

                    break;
                  case "2":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 2", value: 2 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 2", value: 2 });
                    }

                    break;
                  case "3":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 3", value: 3 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 3", value: 3 });
                    }

                    break;
                  case "4":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 4", value: 4 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 4", value: 4 });
                    }

                    break;
                  case "5":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 5", value: 5 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 5", value: 5 });
                    }

                    break;
                }
              }
              req.records = { auth_levels };
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "you dont have privilege",
              };

              next();
              return;
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            reject(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "you dont have privilege",
        };

        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },
};
//created by irfan: to get database field for authorization
function getLoanAuthFields(auth_level) {
  return new Promise((resolve, reject) => {
    let authFields;
    switch (auth_level.toString()) {
      case "1":
        authFields = [
          "authorized1=?",
          "authorized1_by=?",
          "authorized1_date=?",
        ];
        break;

      case "2":
        authFields = [
          "authorized2=?",
          "authorized2_by=?",
          "authorized2_date=?",
        ];
        break;

      case "3":
        authFields = [
          "authorized3=?",
          "authorized3_by=?",
          "authorized3_date=?",
        ];
        break;

      case "4":
        authFields = [
          "authorized4=?",
          "authorized4_by=?",
          "authorized4_date=?",
        ];
        break;
      case "5":
        authFields = [
          "authorized5=?",
          "authorized5_by=?",
          "authorized5_date=?",
        ];
        break;
      default:
    }

    resolve(authFields);
  });
}
