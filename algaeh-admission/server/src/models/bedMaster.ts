import algaehMysql from "algaeh-mysql";

import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";

export async function getBedStatus(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const result = await _mysql
      .executeQuery({
        query: `select * from hims_adm_ip_bed `,
        printQuery: true,
      })
      // .then((result) => {
      //   req.records = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req.records = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function AddNewBedType(req, res, next) {
  console.log("iam here");
  const _mysql = new algaehMysql();
  try {
    const input = req.query;
    const result = await _mysql
      .executeQuery({
        query: `insert into hims_adm_ip_bed(
          bed_desc,short_name,bed_status,created_by,created_date,updated_by,updated_date)values(
          ?,?,?,?,?,?,?)`,
        values: [
          input.bed_desc,
          input.short_name,
          input.bed_status,

          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req.records = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req.records = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function updateBedType(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    console.log("iam here");
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update hims_adm_ip_bed set bed_desc=?,short_name=?,bed_status=?,updated_by=? ,updated_date=? where hims_adm_ip_bed_id=?`,
        values: [
          input.bed_desc,
          input.short_name,
          input.bed_status,

          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ip_bed_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req.records = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    console.log("iam here 222");
    req.records = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
export async function deleteBedStatus(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;
    const result = await _mysql
      .executeQuery({
        query: `Update  hims_adm_ip_bed set bed_status=I,updated_by=? ,updated_date=? where hims_adm_ip_bed_id=?`,
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.hims_adm_ip_bed_id,
        ],
        printQuery: true,
      })
      // .then((result) => {
      //   req.records = result;
      //   next();
      // })
      .catch((e) => {
        throw e;
      });
    req.records = result;
    next();
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
