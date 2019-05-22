import algaehMysql from "algaeh-mysql";

module.exports = {
  getEmployeeDepenedents: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = req.query;
      _mysql
        .executeQuery({
          query:
            "SELECT hims_d_employee_dependents_id,dependent_name,dependent_identity_no,dependent_identity_type,\
                 dependent_type as type,case  when dependent_type ='SP' then 'Spouse'  \
                 when dependent_type ='FT' then 'Father' when dependent_type ='MO' then 'Mother' \
                 when dependent_type ='GU' then 'Gaurdain' when dependent_type ='SO' then 'Son' \
                 when dependent_type ='DG' then 'Daugther' end dependent_type   \
                   FROM hims_d_employee_dependents where employee_id=? and record_status ='A'",
          values: [input.employee_id]
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
  getCompanyDependents: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hospital_name as dependent_name,hims_d_hospital_id as hims_d_employee_dependents_id,hospital_code, 'Company' as dependent_type FROM hims_d_hospital where hosital_status='A'"
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
  getDocumentTypes: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_document_type_id,document_description \
            from hims_d_document_type where document_type_status='A' and record_status='A' and document_type=?",
          values: [input.document_type]
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
  saveDocument: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "insert into hims_f_employee_documents(document_type,employee_id,document_id,\
            document_name,dependent_id,download_uniq_id,create_by,created_date,update_by,update_date,document_type_name,hospital_id)\
             values(?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.document_type,
            input.employee_id,
            input.document_id,
            input.document_name,
            input.dependent_id,
            input.download_uniq_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.document_type_name,
            req.userIdentity.hospital_id
          ]
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
  getDocumentsDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    let appendString = "";
    if (input.dependent_id == "null") {
      appendString = " and dependent_id is null";
    } else {
      appendString = " and dependent_id ='" + input.dependent_id + "'";
    }
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_documents_id,document_type,\
          document_type_name,document_name,download_uniq_id from hims_f_employee_documents \
          where document_type=? and employee_id=? " +
            appendString,
          values: [input.document_type, input.employee_id],
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
  }
};
