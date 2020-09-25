import algaehMysql from "algaeh-mysql";

export function getCards(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_bank_card;",
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

export function addCard(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      card_name,
      head_id,
      child_id,
      card_format,
      vat_percentage,
      service_charge,
    } = req.body;
    _mysql
      .executeQuery({
        query: `INSERT INTO hims_d_bank_card (card_name, head_id, child_id, card_format, vat_percentage, service_charge)
        values(?,?,?,?,?,?)`,
        values: [
          card_name,
          head_id,
          child_id,
          card_format,
          vat_percentage,
          service_charge,
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

export function updateCard(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      card_name,
      head_id,
      child_id,
      card_format,
      vat_percentage,
      service_charge,
      hims_d_bank_card_id,
    } = req.body;
    _mysql
      .executeQuery({
        query: `update hims_d_bank_card set card_name=?, head_id=?, child_id=?, card_format=?, vat_percentage=?, service_charge=?
                    where hims_d_bank_card_id=?`,
        values: [
          card_name,
          head_id,
          child_id,
          card_format,
          vat_percentage,
          service_charge,
          hims_d_bank_card_id,
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

export function deleteCard(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { hims_d_bank_card_id } = req.body;
    _mysql
      .executeQuery({
        query: `delete from hims_d_bank_card where hims_d_bank_card_id=?`,
        values: [hims_d_bank_card_id],
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
