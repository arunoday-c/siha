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

export function getPromotionDetails(req, res, next) {
  const _mysql = new algaehMysql();
  const promo_id = req.query.promo_id;
  try {
    _mysql
      .executeQuery({
        query: `SELECT PD.*, P.promo_name, ST.service_type FROM hims_d_promotion_detail PD, hims_d_promotion P, hims_d_service_type ST 
          where ST.hims_d_service_type_id = PD.service_type_id and P.hims_d_promo_id = PD.hims_d_promo_id and PD.hims_d_promo_id=?;`,
        values: [promo_id],
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

export function addPromotionDetail(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      service_type_id,
      avail_type,
      offer_value,
      hims_d_promo_id,
    } = req.body;
    _mysql
      .executeQuery({
        query: `INSERT INTO hims_d_promotion_detail ( service_type_id, avail_type, offer_value, hims_d_promo_id) VALUES (?,?,?,?)`,
        values: [service_type_id, avail_type, offer_value, hims_d_promo_id],
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

export function updatePromotionDetail(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      service_type_id,
      avail_type,
      offer_value,
      hims_d_promo_id,
      hims_d_promotion_detail_id,
    } = req.body;
    _mysql
      .executeQuery({
        query: `update hims_d_promotion_detail set service_type_id=?,  offer_value=?,  hims_d_promo_id=?, avail_type=?
                    where hims_d_promotion_detail_id=?`,
        values: [
          service_type_id,
          offer_value,
          hims_d_promo_id,
          avail_type,
          hims_d_promotion_detail_id,
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

export function getPatientsForPromo(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { gender, age_range } = req.query;
    const genderQry = gender === "both" ? "" : `gender=${req.query.gender} and`;
    const ageRange = !!age_range ? age_range.split("-") : [0, 150];
    const query = `select hims_d_patient_id, full_name, patient_code from hims_f_patient
     where ${genderQry} age between ${ageRange[0]} and ${ageRange[1]}`;
    _mysql
      .executeQuery({
        query,
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
