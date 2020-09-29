import algaehMysql from "algaeh-mysql";

export function getPromotions(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_promotion;",
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function addPromotion(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      promo_name,
      promo_code,
      offer_code,
      valid_to_from,
      valid_to_date,
      avail_type,
    } = req.body;
    _mysql
      .executeQuery({
        query: `INSERT INTO hims_d_promotion (promo_name, promo_code, offer_code, valid_to_from, valid_to_date, avail_type)
        values(?,?,?,?,?,?)`,
        values: [
          promo_name,
          promo_code,
          offer_code,
          valid_to_from,
          valid_to_date,
          avail_type,
        ],
        printQuery: true,
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function updatePromotion(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      promo_name,
      promo_code,
      offer_code,
      valid_to_from,
      valid_to_date,
      avail_type,
      hims_d_promo_id,
    } = req.body;
    _mysql
      .executeQuery({
        query: `update hims_d_promotion set promo_name=?, promo_code=?, offer_code=?, valid_to_from=?, valid_to_date=?, avail_type=?
                    where hims_d_promo_id=?`,
        values: [
          promo_name,
          promo_code,
          offer_code,
          valid_to_from,
          valid_to_date,
          avail_type,
          hims_d_promo_id,
        ],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function deletePromotion(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { hims_d_promo_id } = req.body;
    _mysql
      .executeQuery({
        query: `delete from hims_d_promotion where hims_d_promo_id=?`,
        values: [hims_d_promo_id],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
