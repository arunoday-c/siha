import algaehMysql from "algaeh-mysql";

import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";

export function getBedStatus(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    console.log("iam here");
    _mysql
      .executeQuery({
        query: `select * from algaeh_d_app_screens `,
        printQuery: true,
      })
      .then((result) => {
        req.records = result;
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
