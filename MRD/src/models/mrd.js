import algaehMysql from "algaeh-mysql";
module.exports = {
  getPatientMrdList: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        full_name,
          patient_code,
          registration_date,
          date_of_birth,
          contact_number;
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientEncounterDetails: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_f_patient_encounter_id, PE.patient_id,P.full_name,PE.provider_id,E.full_name as provider_name, visit_id,\
              V.insured,V.sec_insured,V.sub_department_id,SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date,\
              primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,\
              secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name  from hims_f_patient_encounter PE  inner join  hims_f_patient P on\
              PE.patient_id=P.hims_d_patient_id   inner join hims_d_employee E on E.hims_d_employee_id=PE.provider_id  inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=PE.visit_id\
              inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on\
              V.hims_f_patient_visit_id=IM.patient_visit_id  left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id   left join hims_d_insurance_provider IPR  on \
              IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   where PE.record_status='A' and P.record_status='A' and E.record_status='A' \
              and V.record_status='A' and SD.record_status='A'   and encounter_id <>'null' and PE.patient_id=?\
              order by encountered_date desc;",
            values: [req.query.patient_id],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientChiefComplaint: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_f_episode_chief_complaint_id ,episode_id,chief_complaint_id,HH.hpi_description as chief_complaint\
              from hims_f_episode_chief_complaint ECC,hims_d_hpi_header HH\
              Where ECC.record_status='A' and HH.record_status='A' \
              and ECC.chief_complaint_id=HH.hims_d_hpi_header_id and episode_id=?",
            values: [req.query.episode_id],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientDiagnosis: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientMedication: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientInvestigation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientPaymentDetails: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientTreatments: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
