import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const examinationDiagramMasterGetter = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select diagram_id,image_desc,SWD.hims_d_employee_speciality_id,sub_department_id,\
         speciality_name from hims_d_speciality_wise_diagrams SWD left outer join \
         hims_d_employee_speciality ES on SWD.hims_d_employee_speciality_id = ES.hims_d_employee_speciality_id \
         where ES.sub_department_id=? or SWD.hims_d_employee_speciality_id is null \
          and SWD.record_status='A' and ES.speciality_status='A' or ES.speciality_status is null",
        values: [req.userIdentity.sub_department_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
};
const saveExaminationDiagrams = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const input = req.body;
  const _req = req.userIdentity;
  try {
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO hims_f_examination_diagram_header(`diagram_desc`,`diagram_id`,\
      `patient_id`,`provider_id`,`hims_d_sub_department_id`)values(?,?,?,?,?) ON DUPLICATE KEY UPDATE last_update=?",
        values: [
          input.diagram_desc,
          input.diagram_id,
          input.patient_id,
          _req.employee_id,
          _req.sub_department_id,
          new Date()
        ]
      })
      .then(result => {
        const _hims_f_examination_diagram_header_id =
          input.hims_f_examination_diagram_header_id != null
            ? input.hims_f_examination_diagram_header_id
            : result.insertId;
        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_f_examination_diagrams_detail(`visit_id`,\
        `hims_f_examination_diagram_header_id`,\
        `episode_id`,\
        `encounter_id`,\
        `remarks`,\
        `create_by`,\
        `create_date`,\
        `update_by`,\
        `update_date`) values(?,?,?,?,?,?,?,?,?)",
            values: [
              input.visit_id,
              _hims_f_examination_diagram_header_id,
              input.episode_id,
              input.encounter_id,
              input.remarks,
              _req.algaeh_d_app_user_id,
              new Date(),
              _req.algaeh_d_app_user_id,
              new Date()
            ]
          })
          .then(data => {
            _mysql.commitTransaction((error, resu) => {
              if (error) {
                _mysql.rollBackTransaction();
                next(error);
              } else {
                _mysql.releaseConnection();
                req.records = data;
                next();
              }
            });
          })
          .catch(error => {
            _mysql.rollBackTransaction();
            next(error);
          });
      })
      .catch(error => {
        _mysql.rollBackTransaction();
        next(error);
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
};

module.exports = { examinationDiagramMasterGetter, saveExaminationDiagrams };
