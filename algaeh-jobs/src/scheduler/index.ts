import path from "path";
import fs from "fs-extra";
import { Request, Response, NextFunction } from "express";
import { PoolConnection, format } from "mysql2/promise";
import { select } from "easy-db-node";
import pool from "../database";
import manager from "./collection";
import { response } from "../general";
const cwd = process.cwd();
export function scheduler(req: Request, res: Response, next: NextFunction) {
  try {
    schedulerTask();
    response({ success: true, message: "Started Scheduler successfully" }, res);
  } catch (e) {
    next(e);
  }
}
export async function schedulerTask() {
  const schedules = await select("scheduler");
  if (!schedules) {
    return;
  }

  const schedulers = Object.keys(schedules);
  for (let k = 0; k < schedulers.length; k++) {
    const key = schedulers[k];
    const item = schedules[key];
    if (manager.exists(item.name)) {
      console.log("con job exist", item.name);
      manager.deleteJob(item.name);
    }
    console.log(
      "Schedule at :",
      `${item.second} ${item.minute} ${item.hour} ${item.dayOfMonth} ${item.month} ${item.dayOfWeek}`
    );
    manager.add(
      item.name,
      `${item.second} ${item.minute} ${item.hour} ${item.dayOfMonth} ${item.month} ${item.dayOfWeek}`,
      async () => {
        console.log("Started Inside manager");
        let connection = await pool.getConnection();
        const result = await queryExecuter(
          {
            sqlQuery:
              !item.sqlQuery || item.sqlQuery === "" ? null : item.sqlQuery,
          },
          connection
        );
        if (result && result.length > 0) {
          let templateRecords = await ReadAndExecuteTemplate(
            { templateFile: item.templateFile, data: result },
            connection
          );
          if (templateRecords.length > 0) {
            let mysqlQuery = `INSERT INTO Notification.notification_collection(primary_user_ids,
              primary_message,other_message,other_user_ids,created_at,record_inactive,title,module_type) VALUES ?`;
            let updateBase = "";
            const values: any[] = [];
            for (let i = 0; i < templateRecords.length; i++) {
              const {
                primary_user_ids,
                primary_message,
                other_message,
                other_user_ids,
              } = templateRecords[i];
              values.push([
                primary_user_ids,
                primary_message,
                other_message,
                other_user_ids,
                new Date(),
                0,
                item.title,
                item.module_type,
              ]);
              if (
                item.updateKeyName &&
                item.updateKeyName !== "" &&
                item.updateTable &&
                item.updateTable !== ""
              ) {
                updateBase += format(
                  `UPDATE ${item.updateTable} set is_notify=1 where ${item.updateKeyName}=?;`,
                  [templateRecords[i][item.updateKeyName]]
                );
              }
            }
            // console.log("test....", connection.format(mysqlQuery, [values]));
            // console.log("updateBase==", updateBase);
            await connection.query(mysqlQuery, [values]);
            await connection.query(updateBase);
            connection.release();
          }
        }
      }
    );

    manager.start(item.name);
  }
}

async function ReadAndExecuteTemplate(
  options: {
    templateFile: string;
    data?: any;
  },
  connection: PoolConnection
) {
  try {
    const { templateFile, data } = options;
    if (templateFile !== "") {
      const fullTemplatePath = path.resolve(
        cwd,
        "templates",
        templateFile + ".js"
      );
      if (fs.existsSync(fullTemplatePath)) {
        const execTemplate = __non_webpack_require__(fullTemplatePath);
        const records = await execTemplate({ data }, connection);
        return records;
      } else {
        return {};
      }
    } else {
      throw new Error("There is no message Template exist");
    }
  } catch (e) {
    throw e;
  }
}
interface ExecuteOptions {
  sqlQuery?: string;
}
async function queryExecuter(
  options: ExecuteOptions,
  connection: PoolConnection
) {
  let data: any = undefined;
  try {
    const { sqlQuery } = options;
    if (sqlQuery) {
      const [rows] = await connection.query(sqlQuery);
      data = rows;
      console.log("<<<data get >>>>", data);
    }

    return data;
  } catch (e) {
    connection.release();
    throw e;
  }
}
