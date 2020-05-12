import algaehMysql from "algaeh-mysql";
export function getEOSOptions(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { org_country_id } = req.userIdentity;
    console.log("org_country_id", org_country_id);
    _mysql
      .executeQuery({
        query:
          "select eos_reson_id,eos_reason_name,eos_reason_other_lan from hims_d_end_of_service_reasons where record_status='A' and country_id=?",
        values: [org_country_id],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
}
