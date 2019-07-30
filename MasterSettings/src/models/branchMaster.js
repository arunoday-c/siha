import algaehMysql from "algaeh-mysql";

module.exports = {
  addBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();
        const input = req.body;
        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_d_hospital (hospital_code,default_nationality,default_country,default_currency,hospital_name,\
                    hospital_address,requied_emp_id,created_date,created_by,updated_date,updated_by)\
                     values(?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.hospital_code,
              input.default_nationality,
              input.default_country,
              input.default_currency,
              input.hospital_name,
              input.hospital_address,
              input.requied_emp_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "select hims_d_hospital_id,hospital_code,hospital_name,N.nationality,C.country_name,CU.currency_description,\
              hospital_address,hosital_status,requied_emp_id from hims_d_hospital H left join hims_d_currency CU \
              on H.default_currency=CU.hims_d_currency_id left join   hims_d_nationality N  on \
              H.default_nationality=N.hims_d_nationality_id left join  hims_d_country C on\
              H.default_country=C.hims_d_country_id where H.record_status='A'"
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getActiveBranches: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "select hims_d_hospital_id,hospital_code,hospital_name,N.nationality,C.country_name,CU.currency_description,\
              hospital_address,hosital_status,requied_emp_id from hims_d_hospital H left join hims_d_currency CU \
              on H.default_currency=CU.hims_d_currency_id left join   hims_d_nationality N  on \
              H.default_nationality=N.hims_d_nationality_id left join  hims_d_country C on\
              H.default_country=C.hims_d_country_id where H.record_status='A' and H.hosital_status='A';"
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  updateBranchMaster: (req, res, next) => {
    try {
      if (req.userIdentity.role_type != "GN") {
        const _mysql = new algaehMysql();
        const input = req.body;
        _mysql
          .executeQuery({
            query:
              "update hims_d_hospital set hospital_code=?,default_nationality=?,default_country=?,\
              default_currency=?,hospital_name=?,hospital_address=?,requied_emp_id=?,updated_date=?,updated_by=?;",
            values: [
              input.hospital_code,
              input.default_nationality,
              input.default_country,
              input.default_currency,
              input.hospital_name,
              input.hospital_address,
              input.requied_emp_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ]
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result.affectedRows > 0) {
              req.records = result;
            } else {
              req.records = {
                invalid_data: true,
                message: "Please Provide Valid input"
              };
            }

            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_data: true,
          message: "you dont have admin privilege"
        };
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
