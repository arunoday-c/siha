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
        values: [req.userIdentity.sub_department_id]
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
      `patient_id`,`provider_id`,`hims_d_sub_department_id`,`header_datetime`,hospital_id)values(?,?,?,?,?,?,?)  ON DUPLICATE KEY UPDATE last_update=?",
        values: [
          input.diagram_desc,
          input.diagram_id,
          input.patient_id,
          _req.employee_id,
          _req.sub_department_id,
          input.header_datetime,
          req.userIdentity.hospital_id,
          new Date()
        ],
        printQuery: true
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
                req.records = {
                  hims_f_examination_diagram_header_id: _hims_f_examination_diagram_header_id,
                  ...data
                };
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
const existingHeaderDiagramsGetter = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const _req = req.userIdentity;
  const _getPatientId = req.query.patient_id;
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_examination_diagram_header_id,diagram_desc,diagram_id,patient_id,header_datetime,\
      provider_id,hims_d_sub_department_id,last_update from hims_f_examination_diagram_header \
      where record_status='A' and provider_id=? and hims_d_sub_department_id=? and patient_id=?",
        values: [_req.employee_id, _req.sub_department_id, _getPatientId]
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
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
};

const existingDetailDiagramGetter = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select examination_diagrams_id,visit_id,H.hims_f_examination_diagram_header_id,episode_id,patient_id,\
          provider_id,encounter_id,remarks,update_date, \
          concat(diagram_id,'_',patient_id,'_',provider_id,'_',H.hims_f_examination_diagram_header_id,'_',examination_diagrams_id) as image  from hims_f_examination_diagram_header H,hims_f_examination_diagrams_detail D \
          where H.hims_f_examination_diagram_header_id = D.hims_f_examination_diagram_header_id and record_status='A' \
          and H.hims_f_examination_diagram_header_id = ?",
        values: [req.query.hims_f_examination_diagram_header_id]
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
const deleteExaminationDiagramDetailDelete = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQuery({
        query:
          "delete from hims_f_examination_diagrams_detail where examination_diagrams_id =?",
        values: [req.body.examination_diagrams_id]
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
module.exports = {
  examinationDiagramMasterGetter,
  saveExaminationDiagrams,
  existingHeaderDiagramsGetter,
  existingDetailDiagramGetter,
  deleteExaminationDiagramDetailDelete
};
