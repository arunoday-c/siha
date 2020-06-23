import algaehMysql from "algaeh-mysql";
export default {
  addIdentity: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_identity_document` (`identity_document_code`, `identity_document_name`,`arabic_identity_document_name`,`hims_d_nationality_id` \
            , `created_by` ,`created_date`) \
         VALUES ( ?, ?, ?, ?, ?,?)",
          values: [
            inputParam.identity_document_code,
            inputParam.identity_document_name,
            inputParam.arabic_identity_document_name,
            inputParam.hims_d_nationality_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
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

  updateIdentity: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_identity_document` SET  `identity_document_name`=?, `arabic_identity_document_name` = ?,`hims_d_nationality_id` = ?,\
          `updated_by`=?, `updated_date`=? ,`identity_status` = ? \
          WHERE `record_status`='A' AND `hims_d_identity_document_id`=?;",
          values: [
            inputParam.identity_document_name,
            inputParam.arabic_identity_document_name,
            inputParam.hims_d_nationality_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.identity_status,
            inputParam.hims_d_identity_document_id,
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

  selectIdentity: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_identity_document_id != null) {
        _strAppend += "and hims_d_identity_document_id=?";
        inputValues.push(input.hims_d_identity_document_id);
      }
      if (input.identity_status != null) {
        _strAppend += "and identity_status=?";
        inputValues.push(input.identity_status);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_identity_document_id`, `identity_document_code`, `identity_document_name`, `arabic_identity_document_name`,ID.`hims_d_nationality_id`, `identity_status`\
          ,N.nationality as nationality_name FROM `hims_d_identity_document` as ID left join \
          hims_d_nationality as N on ID.hims_d_nationality_id = N.hims_d_nationality_id  WHERE ID.record_status ='A' " +
            _strAppend, //+
          // " order by hims_d_identity_document_id desc",

          values: inputValues,
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
  deleteIdentity: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_identity_document SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_identity_document_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_identity_document_id,
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
