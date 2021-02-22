import { Request, Response, NextFunction } from "express";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";

export function getBedStatus(req: Request, res: Response, next: NextFunction) {
  const _mysql = new algaehMysql();
  try {
    console.log("get request", req.query);
    console.log("post request", req.body);
    _mysql
      .executeQuery({
        query: `select * from algaeh_d_app_screens `,
        printQuery: true,
      })
      .then((result) => {
        req["records"] = result;
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    next(e);
  } finally {
    _mysql.releaseConnection();
  }
}
