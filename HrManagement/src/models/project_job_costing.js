import algaehMysql from "algaeh-mysql";
import _ from "lodash";

module.exports = {
  getDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      let _strQuery = "";
      if (req.query.division_id != null) {
        _strQuery = "and division_id = " + req.query.division_id;
      }

      _mysql
        .executeQuery({
          query:
            "select hims_m_division_project_id, division_id, project_id, d_p_status, DP.inactive_date, \
            P.start_date, P.end_date, P.project_desc,P.hims_d_project_id from hims_m_division_project DP, \
            hims_d_project P where DP.project_id=P.hims_d_project_id " +
            _strQuery +
            " order by hims_m_division_project_id desc;",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  addDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_m_division_project(division_id,project_id,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?)",
          values: [
            input.division_id,
            input.project_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  deleteDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "DELETE FROM hims_m_division_project WHERE hims_m_division_project_id = ?",
          values: [input.hims_m_division_project_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  }
};
