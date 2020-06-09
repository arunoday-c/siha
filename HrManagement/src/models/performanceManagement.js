"use strict";
import algaehMysql from "algaeh-mysql";
// import algaehUtilities from "algaeh-utilities/utilities";
// import _ from "lodash";

export function addKpiName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    const input = req.body;

    _mysql
      .executeQuery({
        query: `INSERT INTO hrms_d_kpi_master
          (kpi_name,created_date,created_by,updated_date,updated_by)
          values(?,?,?,?,?)`,
        values: [
          input.kpi_name,
          new Date(),
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
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
    next(e);
  }
}
export function getKpiName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hrms_d_kpi_master_id,kpi_name from hrms_d_kpi_master 
       WHERE record_status='A'`,
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
    next(e);
  }
}
export function deleteKpiName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    let input = req.body;
    _mysql
      .executeQuery({
        query: `update hrms_d_kpi_master set record_status='I',updated_by=?,updated_date=? where hrms_d_kpi_master_id=?`,
        values: [algaeh_d_app_user_id, new Date(), input.hrms_d_kpi_master_id],
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
export function insertApprisalMatrixRange(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    const { from_range, to_range, result, increment } = req.body;

    _mysql
      .executeQuery({
        query: `INSERT INTO hrms_d_performance_appraisal_matrix_range
        (from_range,to_range,result,increment,created_date,created_by,updated_date,updated_by)
            values(?,?,?,?,?,?,?,?) `,
        values: [
          from_range,
          to_range,
          result,
          increment,
          new Date(),
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
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
    next(e);
  }
}
export function getApprisalMatrixRange(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hrms_d_apprisal_range_id,from_range,to_range,result,increment from hrms_d_performance_appraisal_matrix_range 
       WHERE record_status='A'`,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        // resolve(result);
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        // reject(error);
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
export function deleteApprisalMatrixRange(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    let input = req.body;
    _mysql
      .executeQuery({
        query: `update  hrms_d_performance_appraisal_matrix_range set record_status='I',updated_by=?,updated_date=? where hrms_d_apprisal_range_id=?`,
        values: [
          algaeh_d_app_user_id,
          new Date(),
          input.hrms_d_apprisal_range_id,
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
export function addGroupName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    const input = req.body;

    _mysql
      .executeQuery({
        query: `INSERT INTO hrms_d_questionnaire_group
          (group_name,created_date,created_by,updated_date,updated_by)
          values(?,?,?,?,?)`,
        values: [
          input.group_name,
          new Date(),
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
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
    next(e);
  }
}
export function getGroupName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select hrms_d_questionnaire_group_id,group_name from hrms_d_questionnaire_group 
       WHERE record_status='A'`,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        // resolve(result);
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        // reject(error);
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
export function deleteGroupName(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    let input = req.body;
    _mysql
      .executeQuery({
        query: `update  hrms_d_questionnaire_group set record_status='I',updated_by=?,updated_date=? where hrms_d_questionnaire_group_id=?`,
        values: [
          algaeh_d_app_user_id,
          new Date(),
          input.hrms_d_questionnaire_group_id,
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

export function addQuestionaries(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    const input = req.body;

    _mysql
      .executeQuery({
        query: `INSERT INTO hrms_d_perfrmance_questionnaire_master
        (hrms_d_questionnaire_group_id,questionaries,created_date,created_by,updated_date,updated_by)
        values(?,?,?,?,?,?)`,
        values: [
          input.hrms_d_questionnaire_group_id,
          input.questionaries,
          new Date(),
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
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
    next(e);
  }
}
export function getQuestionaries(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select pqm.hrms_d_perfrmance_questionnaire_master_id,pqm.hrms_d_questionnaire_group_id,pqm.questionaries,qg.group_name from 
        hrms_d_perfrmance_questionnaire_master as pqm inner join hrms_d_questionnaire_group as qg on pqm.hrms_d_questionnaire_group_id=qg.hrms_d_questionnaire_group_id
        WHERE pqm.record_status='A' and qg.record_status='A'`,
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
    next(e);
  }
}
export function deleteQuestionaries(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    let input = req.body;
    _mysql
      .executeQuery({
        query: `update  hrms_d_perfrmance_questionnaire_master set record_status='I',updated_by=?,updated_date=? where hrms_d_perfrmance_questionnaire_master_id=?`,
        values: [
          algaeh_d_app_user_id,
          new Date(),
          input.hrms_d_perfrmance_questionnaire_master_id,
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
