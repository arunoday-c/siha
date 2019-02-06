import algaehMysql from "algaeh-mysql";
import utilities from "algaeh-utilities";
module.exports = {
  getMydayList: (req, res, next) => {
    const input = { ...req.query };
    const _mysql = new algaehMysql();
    try {
    } catch (error) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
