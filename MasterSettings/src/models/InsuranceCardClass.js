import algaehMysql from "algaeh-mysql";
export default {
  addInsuranceCardClass: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_insurance_card_class (card_class_name, arabic_card_class_name,\
                created_date, created_by, updated_date, updated_by)\
                 values(?, ?, ?, ?, ?, ?)",
          values: [
            input.card_class_name,
            input.arabic_card_class_name,
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

  updateInsuranceCardClass: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "update  hims_d_insurance_card_class  set card_class_name=?, arabic_card_class_name=?, card_status=?,\
            updated_date=?, updated_by=? where hims_d_insurance_card_class_id=?",
          values: [
            input.card_class_name,
            input.arabic_card_class_name,
            input.card_status,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_insurance_card_class_id
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

  getInsuranceCardClass: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let strQuery = "";

      if (req.query.card_status != null) {
        strQuery = " and card_status = '" + req.query.card_status + "'";
      }
      _mysql
        .executeQuery({
          query:
            "select   hims_d_insurance_card_class_id, card_class_name, arabic_card_class_name, card_status, \
            created_date, created_by, updated_date, updated_by from\
            hims_d_insurance_card_class where record_status='A'" +
            strQuery +
            "order by hims_d_insurance_card_class_id desc "
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
  deleteInsuranceCardClass: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_insurance_card_class SET  record_status='I' WHERE hims_d_insurance_card_class_id=?",
          values: [inputParam.hims_d_insurance_card_class_id],
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
