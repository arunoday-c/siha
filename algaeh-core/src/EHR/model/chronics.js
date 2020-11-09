import algaehMysql from "algaeh-mysql";
export function addOrUpdateChronic(req, res, next) {
  const _mysql = new algaehMysql();
  const { algaeh_d_app_user_id } = req.userIdentity;
  const {
    // is_insert,
    // chronicList,
    icd_code_id,
    chronic_inactive,
    hims_f_chronic_id,
    patient_id,
    visit_id,
  } = req.body;
  try {
    let query = "";
    if (hims_f_chronic_id) {
      query = _mysql.mysqlQueryFormat(
        `update hims_f_chronic set 
                chronic_inactive=?,updated_provider_id=?,inactive_on_visit_id=?,
                updated_date=? where hims_f_chronic_id=?;`,
        [
          chronic_inactive ? "Y" : "N",
          algaeh_d_app_user_id,
          visit_id,
          new Date(),
          hims_f_chronic_id,
        ]
      );
    } else {
      query = _mysql.mysqlQueryFormat(
        `insert into hims_f_chronic
              (icd_code_id,chronic_inactive,patient_id,visit_id,added_provider_id,
                updated_provider_id,created_date,updated_date)values(?,?,?,?,?,?,?,?);`,
        [
          icd_code_id,
          chronic_inactive ? "Y" : "N",
          patient_id,
          visit_id,
          algaeh_d_app_user_id,
          algaeh_d_app_user_id,
          new Date(),
          new Date(),
        ]
      );
    }

    _mysql
      .executeQuery({
        query,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        next();
      })
      .catch((error) => {
        console.log("Error", error);
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export function getChronic(req, res, next) {
  const _mysql = new algaehMysql();
  const { patient_id } = req.query;
  try {
    _mysql
      .executeQuery({
        query: `select C.hims_f_chronic_id,C.icd_code_id,C.chronic_inactive,MAX(if(C.visit_id=V.hims_f_patient_visit_id,V.visit_date,'')) as addend_on,
         MAX(if(C.inactive_on_visit_id=V.hims_f_patient_visit_id,V.visit_date,'')) as inactive_on,
         MAX(if(C.added_provider_id=E.hims_d_employee_id,E.full_name,'')) as added_by,
         MAX(if(C.updated_provider_id=E.hims_d_employee_id,E.full_name,'')) as updated_by,
         MAX(ICD.icd_description) as icd_description ,MAX(C.chronic_inactive) as chronic_inactive,
         MAX(C.created_date) as created_date,MAX(C.updated_date) as updated_date
         from hims_f_chronic as C inner join hims_d_icd as ICD on
         C.icd_code_id = ICD.hims_d_icd_id inner join hims_f_patient_visit as V on 
         (V.hims_f_patient_visit_id = C.visit_id or V.hims_f_patient_visit_id=C.inactive_on_visit_id)
         inner join hims_d_employee as E on (E.hims_d_employee_id = C.added_provider_id or E.hims_d_employee_id = C.updated_provider_id)
         where C.patient_id=? group by  C.hims_f_chronic_id,C.icd_code_id,C.chronic_inactive ;`,
        values: [patient_id],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
