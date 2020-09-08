import algaehMysql from "algaeh-mysql";
import newAxios from "algaeh-utilities/axios";

export default {
  getPOOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: "select * from hims_d_procurement_options;",
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();

          newAxios(req, {
            url: "http://localhost:3006/api/v1//Document/getEmailConfig",
          })
            .then((res) => {
              const options = res.data.data[0];
              req.records = { ...result, ...options };
              console.log("req.results", req.records);
              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  addPOOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_procurement_options` (`po_auth_level`, `po_services`,\
                        `created_date`, `created_by`, `updated_date`, `updated_by`)\
                        VALUE(?, ?, ?, ?, ?, ?)",
          values: [
            input.po_auth_level,
            input.po_services,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  updatePOOptions: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_procurement_options` SET `po_auth_level` = ?, `po_services` = ?, `updated_date`=?, `updated_by`=? \
                WHERE `hims_d_procurement_options_id`=? ;",
          values: [
            input.po_auth_level,
            input.po_services,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_procurement_options_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
