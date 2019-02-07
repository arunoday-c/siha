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
           provider_id=? and  sub_department_id=?  " +
            _queryData +
            " order by E.updated_date desc",
          values: [
            input.fromDate,
            input.toDate,
            input.provider_id,
            input.sub_department_id
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
  }
};
