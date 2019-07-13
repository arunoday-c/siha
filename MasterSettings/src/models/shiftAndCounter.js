import algaehMysql from "algaeh-mysql";
module.exports = {
  addShiftMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_shift` (shift_code,shift_description,arabic_name,\
            in_time1, out_time1, in_time2, out_time2,shift_end_day, break, break_start, break_end, shift_abbreviation,\
            created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.shift_code,
            inputParam.shift_description,
            inputParam.arabic_name,
            inputParam.in_time1,
            inputParam.out_time1,
            inputParam.in_time2,
            inputParam.out_time2,
            inputParam.shift_end_day,
            inputParam.break,
            inputParam.break_start,
            inputParam.break_end,
            inputParam.shift_abbreviation,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addCounterMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_counter` (counter_code, counter_description, arabic_name, created_date, \
            created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?)",
          values: [
            inputParam.counter_code,
            inputParam.counter_description,
            inputParam.arabic_name,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getCounterMaster: (req, res, next) => {
    // let input = req.query;
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_counter_id,counter_code,counter_description,arabic_name,counter_status from \
          hims_d_counter where record_status='A' order by hims_d_counter_id desc;",
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getShiftMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_shift_id != null) {
        _strAppend += "and hims_d_shift_id=?";
        inputValues.push(input.hims_d_shift_id);
      }

      if (input.shift_status != null) {
        _strAppend += "and shift_status=?";
        inputValues.push(input.shift_status);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_shift_id, shift_code, shift_description, arabic_name, shift_status, in_time1,\
            out_time1, in_time2, out_time2, break, break_start, break_end,shift_end_day, shift_abbreviation, \
            created_date, created_by, updated_date, updated_by, record_status from hims_d_shift where \
            record_status='A' " +
            _strAppend +
            "order by hims_d_shift_id desc",
          values: inputValues,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateShiftMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_shift` SET shift_code=?, shift_description=?, arabic_name=?, shift_status=?,\
            in_time1=?, out_time1=?, in_time2=?, out_time2=?,shift_end_day=?,\
            break=?, break_start=?, break_end=?, shift_abbreviation=?,\
            updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_shift_id`=?;",
          values: [
            inputParam.shift_code,
            inputParam.shift_description,
            inputParam.arabic_name,
            inputParam.shift_status,
            inputParam.in_time1,
            inputParam.out_time1,
            inputParam.in_time2,
            inputParam.out_time2,
            inputParam.shift_end_day,
            inputParam.break,
            inputParam.break_start,
            inputParam.break_end,
            inputParam.shift_abbreviation,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.record_status,
            inputParam.hims_d_shift_id
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateCounterMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_counter` SET counter_code=?, counter_description=?, arabic_name=?, counter_status=?,\
          updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_counter_id`=?;",
          values: [
            inputParam.counter_code,
            inputParam.counter_description,
            inputParam.arabic_name,
            inputParam.counter_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.record_status,
            inputParam.hims_d_counter_id
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getCashiers: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select algaeh_d_app_group_id,EDM.user_id as cashier_id,G.group_type,hims_d_employee_id,\
          employee_code,E.full_name as cashier_name          \
          from algaeh_d_app_group G         inner join algaeh_d_app_roles R\
          on G.algaeh_d_app_group_id=R.app_group_id     \
          inner join algaeh_m_role_user_mappings RU on R.app_d_app_roles_id=RU.role_id     \
          inner join hims_m_employee_department_mappings EDM on RU.user_id=EDM.user_id\
          inner join hims_d_employee  E on EDM.employee_id=E.hims_d_employee_id\
          where group_type in('C') order by cashier_id desc",
          //   values: inputValues,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  // crated by :irfan
  addCashierToShift: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_m_cashier_shift_id ,cashier_id,from_date,to_date \
 from hims_m_cashier_shift where cashier_id=? and shift_id=?   and \
((  date(?)>=date(from_date) and date(?)<=date(to_date)) or ( date(?)>=date(from_date) and   date(?)<=date(to_date))\
or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or(date(to_date)>=date(?) and date(to_date)<= date(?)) );",
          values: [
            inputParam.cashier_id,
            inputParam.shift_id,

            inputParam.from_date,
            inputParam.from_date,
            inputParam.to_date,
            inputParam.to_date,
            inputParam.from_date,
            inputParam.to_date,
            inputParam.from_date,
            inputParam.to_date
          ],
          printQuery: true
        })
        .then(ExResult => {
          // _mysql.releaseConnection();
          // req.records = result;
          // next();

          if (ExResult.length > 0) {
            console.log("ExResult", ExResult);
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: `cashier has shift from ${ExResult[0]["from_date"]} to ${
                ExResult[0]["to_date"]
              } `
            };
            next();
          } else {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_m_cashier_shift` (cashier_id, shift_id, from_date,\
                   to_date,  created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?)",
                values: [
                  inputParam.cashier_id,
                  inputParam.shift_id,
                  inputParam.from_date,
                  inputParam.to_date,
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
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  // crated by :irfan
  getCashiersAndShiftMAP: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let str = "";
      if (req.query.for == "T") {
        str = ` and curdate() between from_date and to_date and CS.cashier_id=${
          req.userIdentity.algaeh_d_app_user_id
        } `;
      }

      _mysql
        .executeQuery({
          query: `select hims_m_cashier_shift_id ,cashier_id,shift_id,from_date,to_date,\
          E.full_name as cashier_name,shift_description\
          from hims_m_cashier_shift CS inner join algaeh_d_app_user U on CS.cashier_id=U.algaeh_d_app_user_id\
          inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id\
          inner join hims_d_shift S on CS.shift_id=S.hims_d_shift_id\
          where CS.record_status='A' ${str}`,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  updateCashiersAndShiftMAP: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_m_cashier_shift` SET  shift_id=?,\
          updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_m_cashier_shift_id`=?;",
          values: [
            inputParam.shift_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_m_cashier_shift_id
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  deleteCashiersAndShiftMAP: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_m_cashier_shift SET  record_status='I' WHERE hims_m_cashier_shift_id=?",
          values: [inputParam.hims_m_cashier_shift_id],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
