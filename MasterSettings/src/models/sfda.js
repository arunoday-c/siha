import algaehMysql from "algaeh-mysql";
export default {
  addPatientType: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_patient_type` (`patient_type_code`, `patitent_type_desc`, \
            `arabic_patitent_type_desc`, `created_by` , `created_date`) \
                VALUES ( ?, ?, ?, ?, ?)",
          values: [
            inputParam.patient_type_code,
            inputParam.patitent_type_desc,
            inputParam.arabic_patitent_type_desc,
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

  updatePatientType: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_patient_type` SET `patitent_type_desc`=?, `arabic_patitent_type_desc`=?,  `patient_status`=?,\
            `updated_by`=?, `updated_date`=?\
          WHERE `record_status`='A' and `hims_d_patient_type_id`=?",
          values: [
            inputParam.patitent_type_desc,
            inputParam.arabic_patitent_type_desc,
            inputParam.patient_status,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_patient_type_id
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

  getSFDA: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_sfda_id != null) {
        _strAppend += "and hims_d_sfda_id=?";
        inputValues.push(input.hims_d_sfda_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT * FROM `hims_d_sfda` WHERE record_status='A' " +
            _strAppend +
            " order by hims_d_sfda_id desc",
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
  deletePatientType: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_patient_type SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_patient_type_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_patient_type_id
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
