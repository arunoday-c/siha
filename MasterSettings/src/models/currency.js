import algaehMysql from "algaeh-mysql";
export default {
  addCurrencyMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_currency` (currency_code, currency_description, currency_symbol, decimal_places, symbol_position,\
            thousand_separator, decimal_separator, negative_separator,  created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.currency_code,
            inputParam.currency_description,
            inputParam.currency_symbol,
            inputParam.decimal_places,
            inputParam.symbol_position,
            inputParam.thousand_separator,
            inputParam.decimal_separator,
            inputParam.negative_separator,
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

  updateCurrencyMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_currency` SET  decimal_places=?, currency_symbol=?, symbol_position=?, thousand_separator=?, \
          decimal_separator=?, negative_separator=?,\
          updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_d_currency_id`=?;",
          values: [
            inputParam.decimal_places,
            inputParam.currency_symbol,
            inputParam.symbol_position,
            inputParam.thousand_separator,
            inputParam.decimal_separator,
            inputParam.negative_separator,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_currency_id
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

  getCurrencyMaster: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_currency_id, currency_code, currency_description, currency_symbol,\
          decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator\
          FROM hims_d_currency where record_status='A' order by hims_d_currency_id desc ",

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
  deleteCurrencyMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_currency SET  record_status='I' WHERE hims_d_currency_id=?",
          values: [inputParam.hims_d_currency_id],
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
