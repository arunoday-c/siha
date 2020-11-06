import algaehMysql from "algaeh-mysql";
export function addOrUpdateChronic(req, res, next) {
  const _mysql = new algaehMysql();
  const { algaeh_d_app_user_id } = req.userIdentity;
  const {
    is_insert,
    chronicList
    // icd_code,
    // chronic_inactive,
    // hims_f_chronic_id,
    // patient_id,
    // visit_id,
  } = req.body;
  try {
    let query = "";
    if (is_insert) {
        for(let i=0;i<chronicList.length;i++){
            const { icd_code,
                chronic_inactive,
                patient_i
                visit_id } = chronicList[i];
            query += _mysql.mysqlQueryFormat(
                `insert into hims_f_chronic
                (icd_code_id,chronic_inactive,patient_id,visit_id,added_provider_id,
                  updated_provider_id,created_date,updated_date)values(?,?,?,?,?,?,?,?);`,
                [
                  icd_code,
                  chronic_inactive,
                  patient_i
                  visit_id,
                  algaeh_d_app_user_id,
                  algaeh_d_app_user_id,
                  new Date(),
                  new Date(),
                ]
              );
        }
      
    } else {
        for(let i=0;i<chronicList.length;i++){
            const { icd_code_id,
                chronic_inactive,
                algaeh_d_app_user_id,
                visit_id,hims_f_chronic_id} = chronicList[i];
            query += _mysql.mysqlQueryFormat(
                `update hims_f_chronic set icd_code_id=?,
                  chronic_inactive=?,updated_provider_id=?,inactive_on_visit_id=?,
                  updated_date=? where hims_f_chronic_id=?;`,
                [
                  icd_code_id,
                  chronic_inactive,
                  algaeh_d_app_user_id,
                  visit_id,
                  new Date(),
                  hims_f_chronic_id,
                ]
              );
        }
   
    }

    _mysql
      .executeQuery({
        query,
        printQuery: true,
      })
      .then((result) => {})
      .catch((error) => {
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
export function getChronic(req,res,next){
    const _mysql = new algaehMysql();
    const {patient_id} = req.query;
    try{
     _mysql.executeQuery({
         query:`select C.hims_f_chronic_id,C.icd_code_id,C.chronic_inactive,MAX(if(C.visit_id=V.hims_f_patient_visit_id,V.visit_date,'')) as addend_on,
         MAX(if(C.inactive_on_visit_id=V.hims_f_patient_visit_id,V.visit_date,'')) as inactive_on,
         MAX(if(C.added_provider_id=E.hims_d_employee_id,E.full_name,'')) as added_by,
         MAX(if(C.updated_provider_id=E.hims_d_employee_id,E.full_name,'')) as updated_by
         from hims_f_chronic as C inner join hims_d_icd as ICD on
         C.icd_code_id = ICD.hims_d_icd_id inner join hims_f_patient_visit as V on 
         (V.hims_f_patient_visit_id = C.visit_id or V.hims_f_patient_visit_id=C.inactive_on_visit_id)
         inner join hims_d_employee as E on (E.hims_d_employee_id = C.added_provider_id or E.hims_d_employee_id = C.updated_provider_id)
         where C.patient_id=? group by  C.hims_f_chronic_id,C.icd_code_id,C.chronic_inactive ;`,
         values:[patient_id]
     })
    }
    catch(e){
        next(e);
    }
}