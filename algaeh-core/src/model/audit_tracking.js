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
