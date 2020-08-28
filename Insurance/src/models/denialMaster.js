import algaehMysql from "algaeh-mysql";

export const getDenialReasons = (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hims_d_denial_id, denial_code, denial_desc from hims_d_denial_code`,
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export const addDenialReason = (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    _mysql
      .executeQuery({
        query: `insert into hims_d_denial_code (denial_code, denial_desc) value (?, ?)`,
        values: [input.denial_code, input.denial_desc],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export const updateDenialReason = (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    _mysql
      .executeQuery({
        query: `update hims_d_denial_code
        set denial_code = ?, denial_desc = ? where hims_d_denial_id=?`,
        values: [input.denial_code, input.denial_desc, input.hims_d_denial_id],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export const deleteDenialReason = (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    _mysql
      .executeQuery({
        query: `DELETE FROM hims_d_denial_code WHERE hims_d_denial_id=?;`,
        values: [input.hims_d_denial_id],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
