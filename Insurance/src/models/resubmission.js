import algaehMysql from "algaeh-mysql";

export function reSubmissionDetails(req, res, next) {
  const _mysql = new algaehMysql();
  const { invoiceList } = req.body;
  try {
    _mysql
      .executeQueryWithTransaction({
        query: `SELECT MAX(claim_status) as claim_status,
      SUM(gross_amount) as total_gross_amount, SUM(company_resp) as total_company_resp,SUM(company_tax) as total_company_vat,
      SUM(company_payable) as total_company_payable,
      MAX(insurance_provider_id) as insurance_provider_id,MAX(sub_insurance_id) as sub_insurance_id,
      SUM(if(claim_status='S2',remittance_amount2,if(claim_status='S3',remittance_amount3,remittance_amount))) as total_remittance_amount,
      SUM(if(claim_status='S2',denial_amount2,if(claim_status='S3',denial_amount3,denial_amount))) as total_denial_amount,
      MAX(if(claim_status='S2',insurance_statement_id_2,if(claim_status='S3',insurance_statement_id_3,insurance_statement_id))) as insurance_statement_id
       FROM hims_f_invoice_header where hims_f_invoice_header_id in (?) FOR UPDATE;`,
        values: [invoiceList],
        printQuery: true,
      })
      .then((result) => {
        if (result.length === 0) {
          _mysql.rollBackTransaction(() => {
            next(new Error("No invoice found to resubmit"));
          });
          return;
        }
        const {
          insurance_statement_id,
          total_gross_amount,
          total_company_resp,
          total_company_vat,
          total_company_payable,
          total_remittance_amount,
          total_denial_amount,
          insurance_provider_id,
          sub_insurance_id,
          claim_status,
        } = result[0];
        _mysql
          .executeQuery({
            query: `select insurance_statement_number, submission_step from hims_f_insurance_statement where hims_f_insurance_statement_id=? FOR UPDATE;`,
            values: [insurance_statement_id],
          })
          .then((records) => {
            if (records.length === 0) {
              _mysql.rollBackTransaction(() => {
                next(new Error("No previous statement found to resubmit"));
              });
              return;
            }
            const { insurance_statement_number, submission_step } = records[0];
            const { algaeh_d_app_user_id } = req.userIdentity;
            const newNumber = "RESUB-" + insurance_statement_number;
            _mysql
              .executeQuery({
                query: `insert into hims_f_insurance_statement (insurance_statement_number,total_gross_amount,total_company_responsibility,total_company_vat,
                total_company_payable,total_remittance_amount,total_denial_amount,total_balance_amount,
                insurance_provider_id,sub_insurance_id,created_by,updated_by,created_date,updated_date, submission_step)
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                values: [
                  newNumber,
                  total_gross_amount,
                  total_company_resp,
                  total_company_vat,
                  total_company_payable,
                  total_remittance_amount,
                  total_denial_amount,
                  total_denial_amount,
                  insurance_provider_id,
                  sub_insurance_id,
                  algaeh_d_app_user_id,
                  algaeh_d_app_user_id,
                  new Date(),
                  new Date(),
                  submission_step + 1,
                ],
              })
              .then((resubmitResult) => {
                const insertId = resubmitResult.insertId;
                const query =
                  claim_status === "R1"
                    ? ` insurance_statement_id_2=${insertId},claim_status='S2'`
                    : `insurance_statement_id_3=${insertId},claim_status='S3'`;
                _mysql
                  .executeQuery({
                    query: `update hims_f_invoice_header set ${query} where hims_f_invoice_header_id in (?);`,
                    // update hims_f_insurance_statement set record_status='I' where hims_f_insurance_statement_id=${insurance_statement_id};`,
                    values: [invoiceList],
                  })
                  .then(() => {
                    _mysql.commitTransaction((error) => {
                      if (error) {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                        return;
                      }
                      req.records = {
                        insurance_statement_number: newNumber,
                        insurance_statement_id: insertId,
                      };
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (error) {
    _mysql.rollBackTransaction(() => {
      next(error);
    });
  }
}

export function closeClaim(req, res, next) {
  const _mysql = new algaehMysql();
  const inputParam = req.body;
  console.log("inputParam", req.body)
  console.log("inputParam", inputParam)
  try {
    _mysql
      .executeQueryWithTransaction({
        query: `select sum(company_payable) as total_company_payable,MAX(sub_insurance_id) as sub_insurance_id,
        SUM(if(claim_status='R1',remittance_amount,if(claim_status='R2',remittance_amount2,remittance_amount3))) as total_remittance_amount,
        SUM(if(claim_status='R1',denial_amount,if(claim_status='R2',denial_amount2,denial_amount3))) as total_denial_amount
        from hims_f_invoice_header where insurance_statement_id=? for UPDATE;`,
        values: [inputParam.insurance_statement_id],
        printQuery: true,
      })
      .then((result) => {
        if (result.length === 0) {
          _mysql.rollBackTransaction(() => {
            next(new Error("No invoice found to resubmit"));
          });
          return;
        }
        const {
          total_company_payable,
          total_remittance_amount,
          total_denial_amount,
          sub_insurance_id,
        } = result[0];

        _mysql
          .executeQuery({
            query: `select head_id, child_id from hims_d_insurance_sub where hims_d_insurance_sub_id=? FOR UPDATE;
            select head_id, child_id, account from finance_accounts_maping  where account in ('INS_WRITE_OFF', 'cash');`,
            values: [sub_insurance_id],
            printQuery: true
          })
          .then((final_result) => {
            const compamy_details = final_result[0][0]
            const write_off = final_result[1].find(
              (f) => f.account === "INS_WRITE_OFF"
            );
            const cash_acc = final_result[1].find(
              (f) => f.account === "cash"
            );

            console.log("compamy_details", compamy_details)
            console.log("write_off", write_off)
            console.log("cash_acc", cash_acc)

            let execute_query = _mysql.mysqlQueryFormat(
              `INSERT INTO hims_f_insurance_remitance (claim_id, cliam_number, head_id, 
              child_id, amount) values(?,?,?,?,?); 
              INSERT INTO hims_f_insurance_remitance (claim_id, cliam_number, head_id, 
              child_id, amount) values(?,?,?,?,?); `,
              [
                inputParam.insurance_statement_id,
                inputParam.insurance_statement_number,
                compamy_details.head_id,
                compamy_details.child_id,
                total_company_payable,
                inputParam.insurance_statement_id,
                inputParam.insurance_statement_number,
                cash_acc.head_id,
                cash_acc.child_id,
                total_remittance_amount
              ]
            );
            if (parseFloat(total_denial_amount) > 0) {
              execute_query += _mysql.mysqlQueryFormat(
                `INSERT INTO hims_f_insurance_remitance (claim_id, cliam_number, head_id, 
                                child_id, amount) values(?,?,?,?,?); `,
                [
                  inputParam.insurance_statement_id,
                  inputParam.insurance_statement_number,
                  write_off.head_id,
                  write_off.child_id,
                  total_denial_amount
                ]
              );
            }
            _mysql
              .executeQuery({
                query: execute_query,
              })
              .then((data_result) => {
                _mysql.commitTransaction((error) => {
                  if (error) {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                    return;
                  }
                  req.records = data_result;
                  next();
                });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });

          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });

      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (error) {
    _mysql.rollBackTransaction(() => {
      next(error);
    });
  }
}