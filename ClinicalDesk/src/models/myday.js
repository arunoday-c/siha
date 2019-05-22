import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
module.exports = {
  getMydayList: (req, res, next) => {
    const utilities = new algaehUtilities();
    const input = {
      ...{
        provider_id: req.userIdentity.employee_id,
        sub_department_id: req.userIdentity.sub_department_id
      },
      ...req.query
    };
    if (input.fromDate == null && input.toDate == null) {
      next(
        utilities
          .httpStatus()
          .generateError(
            utilities.httpStatus().badRequest,
            "Please provide  date range"
          )
      );
      return;
    }

    const _mysql = new algaehMysql();
    try {
      let _queryData = "";
      if (input.status == "A") {
        _queryData = " E.status <> 'V'";
      } else if (input.status == "V") {
        _queryData = " E.status='V' ";
      }
      _mysql
        .executeQuery({
          query:
            "select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,E.patient_id ,V.appointment_patient,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
        E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.updated_date as encountered_date,E.visit_id ,sub_department_id ,\
        case V.new_visit_patient \
        when V.new_visit_patient ='N' then 'Follow Up' else 'New Visit' end visit_type \
        from hims_f_patient_encounter E \
        INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
           inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  where E.record_status='A' AND  V.record_status='A' \
           and date(V.visit_date) BETWEEN date(?) and date(?) and \
           provider_id=? and  sub_department_id=? and V.hospital_id=? " +
            _queryData +
            " order by E.updated_date desc",
          values: [
            input.fromDate,
            input.toDate,
            input.provider_id,
            input.sub_department_id,
            req.userIdentity.hospital_id
          ]
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
      next(e);
    }
  },
  getPatientDetailList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;
      _mysql
        .executeQuery({
          query:
            "select PE.episode_id,PE.encounter_id , P.hims_d_patient_id,P.full_name,P.patient_code,P.vat_applicable,P.gender, \
             P.date_of_birth,P.contact_number,N.nationality,PV.hims_f_patient_visit_id, \
             concat(PV.age_in_years,'Y')years,concat(PV.age_in_months,'M')months,\
             concat(PV.age_in_days,'D')days,case PE.payment_type when PE.payment_type ='S' then 'Self Paying' else 'Insurance' end payment_type ,\
             PE.created_date as encounter_date  from hims_f_patient_encounter PE ,\
             hims_f_patient P ,hims_d_nationality N,hims_f_patient_visit PV \
             where P.hims_d_patient_id=PE.patient_id and N.hims_d_nationality_id=P.nationality_id \
             and PV.hims_f_patient_visit_id=PE.visit_id and P.hims_d_patient_id=? order by PE.updated_date desc",
          values: [input.hims_d_patient_id]
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
  patientEncounterUpdate: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQueryWithTransaction({
          query:
            "SELECT encounter_id,(encounter_id+1) as newEncounterNo FROM algaeh_d_app_config where param_name='VISITEXPERIDAY';\
        update algaeh_d_app_config set encounter_id=encounter_id+1,updated_by=?,updated_date=? where param_name='VISITEXPERIDAY';",
          values: [req.userIdentity.algaeh_d_app_user_id, new Date()]
        })
        .then(result => {
          const _encounterNumber = result[0]["newEncounterNo"];
          _mysql
            .executeQuery({
              query:
                "UPDATE  hims_f_patient_encounter SET  `status`='W',encounter_id=?,updated_by=?,updated_date=? WHERE \
  hims_f_patient_encounter_id=? AND  record_status='A'",
              values: [
                _encounterNumber,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.body.patient_encounter_id
              ]
            })
            .then(data => {
              _mysql.commitTransaction(error => {
                if (error) {
                  _mysql.rollBackTransaction(() => {
                    _mysql.releaseConnection();
                    next(error);
                  });
                } else {
                  _mysql.releaseConnection();
                  req.records = data;
                  next();
                }
              });
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                _mysql.releaseConnection();
                next(error);
              });
            });
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        _mysql.releaseConnection();
        next(e);
      });
    }
  },
  getPatientVisits: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = {
      ...req.query,
      sub_department_id: req.userIdentity.sub_department_id,
      doctor_id: req.userIdentity.employee_id
    };
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_patient_visit_id,visit_date,episode_id FROM hims_f_patient_visit \
where patient_id=? and sub_department_id=? and doctor_id=? and hospital_id=? order by hims_f_patient_visit_id desc;",
          values: [
            input.patient_id,
            input.sub_department_id,
            input.doctor_id,
            req.userIdentity.hospital_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result.unshift({
            hims_f_patient_visit_id: undefined,
            visit_date: "New Visit",
            episode_id: 0
          });
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
