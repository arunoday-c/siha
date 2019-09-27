import algaehMysql from "algaeh-mysql";
export default {
  addVisa: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_visa_type` ( `visa_type_code`, `arabic_visa_type`, `visa_type`, `visa_desc`, `created_by`, \
          `created_date`,`visa_status`) VALUES (?, ?, ?, ?, ?, ?, ?)",
          values: [
            inputParam.visa_type_code,
            inputParam.arabic_visa_type,
            inputParam.visa_type,
            inputParam.visa_desc,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.visa_status
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

  updateVisa: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_visa_type` SET `visa_desc`=?, `visa_type`=?, `arabic_visa_type` = ?, \
            `updated_by`=?, `updated_date`=? ,`visa_status` =? \
          WHERE `record_status`='A' and `hims_d_visa_type_id`=?",
          values: [
            inputParam.visa_desc,
            inputParam.visa_type,
            inputParam.arabic_visa_type,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.visa_status,
            inputParam.hims_d_visa_type_id
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

  getVisaMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_visa_type_id != null) {
        _strAppend += "and hims_d_visa_type_id=?";
        inputValues.push(input.hims_d_visa_type_id);
      }
      if (input.visa_status != null) {
        _strAppend += "and visa_status=?";
        inputValues.push(input.visa_status);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_visa_type_id`, `visa_type_code`, `visa_type`, `arabic_visa_type`, \
          `created_by`, `created_date`, `updated_by`, `updated_date`, `visa_status` FROM \
          `hims_d_visa_type` WHERE `record_status`='A'  " +
            _strAppend +
            " order by hims_d_visa_type_id desc",
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
  deleteVisa: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_visa_type SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_visa_type_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_visa_type_id
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
  }
};
