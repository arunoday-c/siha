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
    const {
      trigger_action,
      table_name,
      friendly_name,
      reference_id,
      reference_name,
    } = req.query;
    _mysql
      .executeQuery({
        query: `select C.TABLE_NAME,C.COLUMN_NAME,C.DATA_TYPE,C.COLUMN_COMMENT,CU.REFERENCED_TABLE_NAME,CU.REFERENCED_COLUMN_NAME,CU.CONSTRAINT_NAME from INFORMATION_SCHEMA.COLUMNS as C left join INFORMATION_SCHEMA.KEY_COLUMN_USAGE  as CU
      on C.COLUMN_NAME= CU.COLUMN_NAME and CU.TABLE_NAME = C.TABLE_NAME and CU.CONSTRAINT_SCHEMA=C.TABLE_SCHEMA
      where
      C.TABLE_NAME in (?)
      and C.TABLE_SCHEMA=?;`,
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
            let primaryKey = null;
            const primaryRow = _.find(
              details,
              (f) => f.CONSTRAINT_NAME === "PRIMARY"
            );
            if (primaryRow) {
              primaryKey = `NEW.${primaryRow["COLUMN_NAME"]}`;
            }
            query = `${query}
                DROP TRIGGER IF EXISTS ${table_name_key}_${triggerExtension};
                CREATE TRIGGER ${table_name_key}_${triggerExtension} AFTER UPDATE ON ${table_name_key}
                    FOR EACH ROW BEGIN`;
            details.forEach((item) => {
              const {
                COLUMN_NAME,
                DATA_TYPE,
                COLUMN_COMMENT,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME,
              } = item;
              if (
                COLUMN_NAME === "created_by" ||
                COLUMN_NAME === "created_date" ||
                COLUMN_NAME === "updated_by" ||
                COLUMN_NAME === "updated_date"
              ) {
                return;
              }
              let dataValue = `${null},${null}`; //`OLD.${COLUMN_NAME},NEW.${COLUMN_NAME}`;
              let refTable = null;
              if (REFERENCED_TABLE_NAME) {
                refTable = `'${REFERENCED_TABLE_NAME}'`;
              }
              const CMD_SPLIT = COLUMN_COMMENT.split("~");
              if (DATA_TYPE === "enum" && COLUMN_COMMENT !== "") {
                let _splitCommand;
                if (CMD_SPLIT.length > 1) {
                  _splitCommand = CMD_SPLIT[1]
                    .replace(/\\n/g, "@%&")
                    .replace(/[\{\}\[\]\\]/gi, "")
                    .replace(/\@%&/gi, "\n");
                } else {
                  _splitCommand = CMD_SPLIT[0]
                    .replace(/\\n/g, "@%&")
                    .replace(/[\{\}\[\]\\]/gi, "")
                    .replace(/\@%&/gi, "\n");
                }

                const arrayContent = _splitCommand.split(/[\n,]+/);
                let case_statement = ``;
                for (let i = 0; i < arrayContent.length; i++) {
                  const _arr_context = arrayContent[i].split(/[=-]+/);
                  case_statement += ` WHEN '${String(_arr_context[0])
                    .trim()
                    .replace(/[”“]/g, "")}' THEN '${String(_arr_context[1])
                    .trim()
                    .replace(/[”“]/g, "")}' `;
                }
                // case_statement +` END)`;
                dataValue = `(CASE OLD.${COLUMN_NAME} ${case_statement} END),(CASE NEW.${COLUMN_NAME} ${case_statement} END)`;
              }
              let column_desc = COLUMN_NAME.replace(/\_/g, " ");
              if (COLUMN_COMMENT !== "") {
                column_desc = CMD_SPLIT[0];
              }
              query = `${query}
              IF NEW.${COLUMN_NAME} <> OLD.${COLUMN_NAME}
              THEN
                INSERT INTO algaeh_audit_log(user_id,action,table_name,column_name,table_frendly_name,old_row,new_row,branch_id,
                  old_update_by,old_update_date,old_row_desc,new_row_desc,reference_table,field_desc,record_id,reference_id,reference_name)
                VALUES(NEW.updated_by,'${trigger_action}','${table_name_key}','${COLUMN_NAME}','${friendly_name}',OLD.${COLUMN_NAME},NEW.${COLUMN_NAME},NEW.hospital_id,OLD.updated_by,
               OLD.updated_date,${dataValue},${refTable},'${column_desc}',${primaryKey},OLD.${reference_id},OLD.${reference_name});
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
          AL.old_row,AL.new_row,AL.date_time_stamp,AL.branch_id,AL.reference_id,AL.reference_name,
          AU.user_display_name,AU.username,AU.locked,
         case AU.user_type when 'SU' then 'SUPER USER' when 'AD' then 'ADMIN'
        when 'D' then 'DOCTOR' when 'N' then 'NURSE' when 'C' then 'CASHIER' when 'L' then 'LAB TECHNICIAN' when 'HR'
        then 'HR' when 'PM' then 'PAYROLL MANAGER' else 'OTHERS' end user_type ,AU.user_status
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
          .groupBy((g) => g.username)
          .map((item) => {
            const { username, user_display_name } = _.head(item);
            return {
              username,
              user_display_name,
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
