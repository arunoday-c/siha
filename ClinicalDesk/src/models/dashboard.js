import algaehMysql from "algaeh-mysql";
export default {
  getPatientDiagnosis: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select @sl:=@sl+1 as slno, hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,icd.icd_code , icd.icd_description ,\
                diagnosis_type, final_daignosis from hims_f_patient_diagnosis pd,hims_d_icd icd,(SELECT @sl:= 0) AS a where pd.record_status='A'\
                and patient_id=? and episode_id=? and pd.daignosis_id=icd.hims_d_icd_id and pd.record_status='A';",
          values: [input.patient_id, input.episode_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
