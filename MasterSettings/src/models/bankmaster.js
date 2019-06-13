import algaehMysql from "algaeh-mysql";
module.exports = {
  addBank: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_bank (bank_name, bank_code, bank_short_name, address1, contact_person, contact_number, created_date, created_by, updated_date, updated_by)\
                 values(?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.bank_name,
            input.bank_code,
            input.bank_short_name,
            input.address1,
            input.contact_person,
            input.contact_number,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
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

  updateBank: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "update  hims_d_bank  set bank_name=?,bank_short_name=?,address1=?,contact_person=?,contact_number=?,\
            updated_date=?,updated_by=? where hims_d_bank_id=?",
          values: [
            input.bank_name,
            input.bank_short_name,
            input.address1,
            input.contact_person,
            input.contact_number,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_bank_id
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

  getBank: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let strQuery = "";

      if (req.query.active_status != null) {
        strQuery = " and active_status = '" + req.query.active_status + "'";
      }
      _mysql
        .executeQuery({
          query:
            "select   hims_d_bank_id, bank_name, bank_code, bank_short_name,\
           address1, contact_person, contact_number, active_status from\
            hims_d_bank where record_status='A'" +
            strQuery +
            "order by hims_d_bank_id desc "
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
  deleteBank: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_bank SET  record_status='I' WHERE hims_d_bank_id=?",
          values: [inputParam.hims_d_bank_id],
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
