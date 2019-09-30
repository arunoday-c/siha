import algaehMysql from "algaeh-mysql";
import utiliites from "algaeh-utilities";
import moment from "moment";
export default {
  getAppliedLeaveDays: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _leaveDetails = req.query;
    _mysql
      .executeQuery({
        query:
          "select annual_maternity_leave,include_weekoff,\
            include_holiday,leave_mode,leave_status from hims_d_leave \
            where hims_d_leave_id=?",
        values: [_leaveDetails.hims_d_leave_id]
      })
      .then(result => {
        _mysql.releaseConnection();

        const _from_date = moment(_leaveDetails.from_date, "YYYY-MM-DD");
        const _to_date = moment(_leaveDetails.to_date, "YYYY-MM-DD");
        // utiliites
        //   .AlgaehUtilities()
        //   .logger()
        //   .log("_from_date", _from_date + " ; " + _to_date);
        let _generateDate = [];
        var current = new Date(_from_date);
        while (_from_date <= _to_date) {
          _generateDate.push(new Date(current));
        }

        utiliites
          .AlgaehUtilities()
          .logger()
          .log("leaveDates", _generateDate);
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
