import algaehMysql from "algaeh-mysql";
import _ from "lodash";
const keyPath = require("algaeh-keys/keys");
export function getTables(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select TABLE_NAME from INFORMATION_SCHEMA.tables where TABLE_SCHEMA=?;`,
        values: [keyPath.default.mysqlDb.database],
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
}
export function generateTrigger(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { trigger_action, table_name, friendly_name } = req.query;
    _mysql
      .executeQuery({
        query: `select TABLE_NAME,COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME in (?) and TABLE_SCHEMA=?`,
        values: [table_name, keyPath.default.mysqlDb.database],
      })
      .then((result) => {
        let query = ""; //"Delimiter $$;";
        const actionType =
          trigger_action === "U"
            ? " AFTER UPDATE ON "
            : trigger_action === "I"
            ? " AFTER INSERT ON "
            : " AFTER DELETE ";
        const triggerExtension =
          trigger_action === "U"
            ? "update"
            : trigger_action === "I"
            ? "insert"
            : "delete";
        const generateGroup = _.chain(result)
          .groupBy((g) => g.TABLE_NAME)
          .forEach((details, table_name_key) => {
            query = `${query}
                DROP TRIGGER IF EXISTS ${table_name_key}_${triggerExtension};
                CREATE TRIGGER ${table_name_key}_${triggerExtension} AFTER UPDATE ON ${table_name_key}
                    FOR EACH ROW BEGIN`;
            details.forEach((item) => {
              const { COLUMN_NAME } = item;
              query = `${query} 
                IF NEW.${COLUMN_NAME} <> OLD.${COLUMN_NAME}
                  THEN
                    INSERT INTO algaeh_audit_log(user_id,action,table_name,column_name,table_frendly_name,old_row,new_row,branch_id)
                    VALUES(NEW.updated_by,'${trigger_action}','${table_name_key}','${COLUMN_NAME}','${friendly_name}',OLD.${COLUMN_NAME},NEW.${COLUMN_NAME},NEW.hospital_id);
                  END IF;
                `;
            });
            query = `${query} 
                     END;
            `;
          })
          .value();
        // query = `${query} Delimiter;`;
        _mysql
          .executeQuery({
            query,
            printQuery: true,
          })
          .then((output) => {
            _mysql.releaseConnection();
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export function getMonitorList(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select EVENT_OBJECT_TABLE,EVENT_MANIPULATION,TRIGGER_NAME from information_schema.triggers where  TRIGGER_SCHEMA=?`,
        values: [keyPath.default.mysqlDb.database],
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
}
export function getAuditList(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { hims_d_hospital_id, from_date, to_date, employee_id } = req.query;
    let str = "";
    if (employee_id) {
      str = ` and AU.employee_id='${employee_id}' `;
    }
    _mysql
      .executeQuery({
        query: `SELECT AL.user_id, AL.action,AL.table_name,AL.column_name,AL.table_frendly_name,
          AL.old_row,AL.new_row,AL.date_time_stamp,AL.branch_id,
          AU.user_display_name,AU.username,AU.locked,AU.user_type,AU.user_status
           FROM algaeh_audit_log as AL left join  algaeh_d_app_user as AU 
          on AU.algaeh_d_app_user_id=AL.user_id
          where date(date_time_stamp) between date(?) and date(?) and AL.branch_id=? and AU.username <>'algaeh' ${str}
           order by AL.date_time_stamp desc;`,
        values: [from_date, to_date, hims_d_hospital_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        const records = _.chain(result)
          .groupBy((g) => g.user_id)
          .map((item) => {
            const {
              user_display_name,
              user_type,
              user_status,
              username,
            } = _.head(item);
            return {
              user_display_name,
              user_type,
              user_status,
              username,
              details: item,
            };
          });
        req.records = records;
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
}
