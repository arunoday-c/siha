import algaehMysql from "algaeh-mysql";

import _ from "lodash";
// import algaehUtilities from "algaeh-utilities/utilities";

export function getBedStatus(req, res, next) {
  try {
    const _mysql = new algaehMysql();
    console.log("iam here");
    _mysql
      .executeQuery({
        query: `select * from hims_adm_ip_bed `,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    next(e);
  }
}
