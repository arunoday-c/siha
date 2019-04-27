import algaehMysql from "algaeh-mysql";
module.exports = {
  addServices: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_services` (`service_code`, `cpt_code`,`service_name`, `hospital_id`,`service_type_id`, \
          `sub_department_id`,`standard_fee`, `discount`, `vat_applicable`, `vat_percent`, `effective_start_date`\
          , `created_by` ,`created_date`,`service_status`) \
       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          values: [
            inputParam.service_code,
            inputParam.cpt_code,
            inputParam.service_name,
            inputParam.hospital_id,
            inputParam.service_type_id,
            inputParam.sub_department_id,
            inputParam.standard_fee,
            inputParam.discount,
            inputParam.vat_applicable,
            inputParam.vat_percent,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.service_status
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.body.service_id = result.insertId;
          req.body.package_service_id = result.insertId;
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

  updateServices: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_services` \
          SET `service_code`=?,  `cpt_code`=?,`service_name`=?, `hospital_id`=?,  `service_type_id`=?,`sub_department_id` = ?, \
          `standard_fee`=?, `discount`=?,  `vat_applicable`=?,`vat_percent`=?, `updated_by`=?, `updated_date`=?,\
          `service_status`=? , `record_status`=?\
          WHERE `hims_d_services_id`=?",
          values: [
            inputParam.service_code,
            inputParam.cpt_code,
            inputParam.service_name,
            inputParam.hospital_id,
            inputParam.service_type_id,
            inputParam.sub_department_id,
            inputParam.standard_fee,

            inputParam.discount,
            inputParam.vat_applicable,
            inputParam.vat_percent,

            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.service_status,
            inputParam.record_status,
            inputParam.hims_d_services_id
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

  getServiceType: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_service_type_id != null) {
        _strAppend += "and hims_d_service_type_id=?";
        inputValues.push(input.hims_d_service_type_id);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT `hims_d_service_type_id`, `service_type_code`, `service_type`, `service_type_desc` \
          ,`arabic_service_type` FROM `hims_d_service_type` WHERE `record_status`='A' " +
            _strAppend +
            " order by hims_d_service_type_id desc",
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
  getServices: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_services_id != null) {
        _strAppend += "and hims_d_services_id=?";
        inputValues.push(input.hims_d_services_id);
      }

      if (input.service_type_id != null) {
        _strAppend += "and service_type_id=?";
        inputValues.push(input.service_type_id);
      }

      if (input.service_name != null) {
        _strAppend += "and service_name=?";
        inputValues.push(input.service_name);
      }

      if (input.sub_department_id != null) {
        _strAppend += "and sub_department_id=?";
        inputValues.push(input.sub_department_id);
      }
      if (input.procedure_type != null) {
        _strAppend += "and procedure_type=?";
        inputValues.push(input.procedure_type);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_services_id, service_code, cpt_code, service_name , service_desc, sub_department_id, \
            hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent, \
            effective_start_date, effectice_end_date, procedure_type from hims_d_services WHERE record_status ='A' " +
            _strAppend +
            " order by hims_d_services_id desc",
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

  addProcedure: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_services` (service_code,cpt_code,service_name,arabic_service_name,service_desc,sub_department_id,\
        hospital_id,service_type_id,procedure_type,standard_fee,followup_free_fee,followup_paid_fee,\
        discount,vat_applicable,vat_percent,service_status,effective_start_date,effectice_end_date,\
        created_by,created_date,updated_by,updated_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.service_code,
          input.cpt_code,
          input.service_name,
          input.arabic_service_name,
          input.service_desc,
          input.sub_department_id,
          input.hospital_id,
          input.service_type_id,
          input.procedure_type,
          input.standard_fee,
          input.followup_free_fee,
          input.followup_paid_fee,
          input.discount,
          input.vat_applicable,
          input.vat_percent,
          input.service_status,
          input.effective_start_date,
          input.effectice_end_date,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ],

        printQuery: true
      })
      .then(result => {
        if (result.insertId > 0) {
          _mysql
            .executeQuery({
              query:
                " INSERT INTO `hims_d_procedure` (procedure_code,procedure_desc,service_id,\
          created_by,created_date,updated_by,updated_date) values (?,?,?,?,?,?,?)",
              values: [
                input.procedure_code,
                input.procedure_desc,
                result.insertId,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],

              printQuery: true
            })
            .then(pro_head_result => {
              if (pro_head_result.insertId > 0) {
                _mysql
                  .executeQuery({
                    query:
                      " INSERT INTO `hims_d_procedure_detail` (procedure_header_id, item_id, service_id, qty,\
                         created_by, created_date, updated_by, updated_date) values (?,?,?,?,?,?,?,?)",
                    values: [
                      pro_head_result.insertId,
                      input.item_id,
                      input.service_id,
                      input.qty,
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ],

                    printQuery: true
                  })
                  .then(detail_result => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = detail_result;
                      next();
                    });
                  })
                  .catch(e => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              }

              //----------------
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        }
      })
      .catch(e => {
        console.log("error", e);
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  }
};
