import algaehMysql from "algaeh-mysql";
export default {
  addVisit: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_visit_type` (`visit_type_code`, `visit_type_desc`,`arabic_visit_type_desc`, `consultation` \
            , `created_by` ,`created_date`) \
         VALUES ( ?, ?, ?, ?, ?, ?)",
          values: [
            inputParam.visit_type_code,
            inputParam.visit_type_desc,
            inputParam.arabic_visit_type_desc,
            inputParam.consultation,
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
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

  updateVisit: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_visit_type` \
            SET `visit_type_desc`=?,  `arabic_visit_type_desc`=?,`consultation`=?, `updated_by`=?, `updated_date`=?,visit_status=? \
            WHERE `record_status`='A' and `hims_d_visit_type_id`=?",
          values: [
            inputParam.visit_type_desc,
            inputParam.arabic_visit_type_desc,
            inputParam.consultation,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.visit_status,
            inputParam.hims_d_visit_type_id
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

  selectStatement: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_visit_type_id != null) {
        _strAppend += "and hims_d_visit_type_id=?";
        inputValues.push(input.hims_d_visit_type_id);
      }
      if (input.visit_status != null) {
        _strAppend += "and visit_status=?";
        inputValues.push(input.visit_status);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_visit_type_id`, `visit_type_code`, `visit_type_desc`,`visit_status`,`arabic_visit_type_desc`\
            , `consultation`, `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_visit_type`  \
            WHERE record_status='A' " +
            _strAppend +
            " order by hims_d_visit_type_id desc",
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
  deleteVisitType: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_visit_type SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_visit_type_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_visit_type_id
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
