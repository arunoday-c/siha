import algaehMysql from "algaeh-mysql";

export function reSubmissionDetails(req, res, next) {
  const _mysql = new algaehMysql();
  const { invoiceList } = req.body;
  try {
    _mysql
      .executeQueryWithTransaction({
        query: `SELECT MAX(claim_status),
      SUM(gross_amount) as total_gross_amount, SUM(company_resp) as total_company_resp,SUM(company_tax) as total_company_vat,
      SUM(company_payable) as total_company_payable,
      MAX(insurance_provider_id) as insurance_provider_id,MAX(sub_insurance_id) as sub_insurance_id,
      SUM(if(claim_status='S2',remittance_amount2,if(claim_status='S3',remittance_amount3,remittance_amount))) as total_remittance_amount,
      SUM(if(claim_status='S2',denial_amount2,if(claim_status='S3',denial_amount3,denial_amount))) as total_denial_amount,
      MAX(if(claim_status='S2',insurance_statement_id_2,if(claim_status='S3',insurance_statement_id_3,insurance_statement_id))) as insurance_statement_id
       FROM hims_f_invoice_header where hims_f_invoice_header_id in (?);`,
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
        } = result[0];
        _mysql
          .executeQuery({
            query: `select insurance_statement_number from hims_f_insurance_statement where hims_f_insurance_statement_id=? FOR UPDATE;`,
            values: [insurance_statement_id],
          })
          .then((records) => {
            if (records.length === 0) {
              _mysql.rollBackTransaction(() => {
                next(new Error("No previous statement found to resubmit"));
              });
              return;
            }
            const { insurance_statement_number } = records[0];
            const { algaeh_d_app_user_id } = req.userIdentity;
            const newNumber = "RESUB-" + insurance_statement_number;
            _mysql
              .executeQuery({
                query: `insert into hims_f_insurance_statement (insurance_statement_number,total_gross_amount,total_company_responsibility,total_company_vat,
                total_company_payable,total_remittance_amount,total_denial_amount,total_balance_amount,
                insurance_provider_id,sub_insurance_id,created_by,updated_by,created_date,updated_date)
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
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
                ],
              })
              .then((resubmitResult) => {
                _mysql.commitTransaction((error) => {
                  if (error) {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                    return;
                  }
                  req.records = {
                    insurance_statement_number: newNumber,
                    insurance_statement_id: resubmitResult.insertId,
                  };
                  next();
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
