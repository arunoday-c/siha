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
            const newNumber = insurance_statement_number + "-RESUB-" + submission_step;
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

  try {
    _mysql
      .executeQuery({
        query: `update hims_f_insurance_statement set insurance_status='C', total_remittance_amount=?,total_denial_amount=?,writeoff_amount=?,insurance_status=? where 
      hims_f_insurance_statement_id=?; `,
        values: [
          inputParam.total_remittance_amount,
          inputParam.total_denial_amount,
          inputParam.writeoff_amount,
          inputParam.insurance_status,
          inputParam.hims_f_insurance_statement_id,
        ],
        printQuery: true,
      })
      .then((result) => {

        _mysql
          .executeQuery({
            query: `INSERT INTO hims_f_insurance_remitance (claim_id, cliam_number, company_payable, remit_amount, 
              denail_amount, writeoff_amount) values(?,?,?,?,?,?); `,
            values: [
              inputParam.hims_f_insurance_statement_id,
              inputParam.insurance_statement_number,
              inputParam.total_company_payable,
              inputParam.total_remittance_amount,
              inputParam.total_denial_amount,
              inputParam.writeoff_amount,
            ],
            printQuery: true
          })
          .then((final_result) => {
            _mysql.commitTransaction((error) => {
              if (error) {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
                return;
              }
              req.records = final_result;
              next();
            });

          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });


      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });

  } catch (error) {
    _mysql.rollBackTransaction(() => {
      next(error);
    });
  }
}