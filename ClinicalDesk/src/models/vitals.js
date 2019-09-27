import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
export default {
  getPatientVitals: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();
    input.visit_id = eval(input.visit_id);
    //department wise vitals functionality removed
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_f_patient_vitals_id, PV.patient_id, visit_id, PV.visit_date, visit_time,\
          case_type, vital_id,PH.vitals_name,vital_short_name,PH.uom, vital_value, vital_value_one,\
           vital_value_two, formula_value from hims_f_patient_vitals PV,hims_d_vitals_header PH,hims_f_patient_visit V \
           where PV.record_status='A' and PH.record_status='A' and PV.vital_id=PH.hims_d_vitals_header_id and PV.patient_id=? \
        and visit_id in (?) and  PH.display='Y' and V.hims_f_patient_visit_id=PV.vital_id and V.hospital_id\
        -- and V.sub_department_id=?  \
        group by visit_date,vital_id",
          values: [
            input.patient_id,
            input.visit_id,
            req.userIdentity.hospital_id
            // req.userIdentity.sub_department_id
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
