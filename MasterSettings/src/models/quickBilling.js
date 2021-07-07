import algaehMysql from "algaeh-mysql";
import _ from "lodash";
export function getDefaults(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select default_country,default_patient_type,default_secondary_id_quick_req,default_nationality,local_vat_applicable from hims_d_hospital limit 1;
         select hims_d_visit_type_id from hims_d_visit_type where consultation='N' limit 1;
         select E.hims_d_employee_id,SD.hims_d_sub_department_id,SD.department_id from hims_d_employee as E inner join hims_d_sub_department as SD on 
SD.hims_d_sub_department_id = E.sub_department_id 
inner join hims_d_department as D on D.hims_d_department_id = SD.department_id
where E.hims_d_employee_id = (select default_doc_quick_reg from hims_d_hospital limit 1)
and  E.record_status='A'; `,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        const {
          default_country,
          default_patient_type,
          default_secondary_id_quick_req,
          default_nationality,
          local_vat_applicable,
        } = _.head(result[0]);
        const { hims_d_visit_type_id } = _.head(result[1]);
        const { hims_d_sub_department_id, department_id, hims_d_employee_id } =
          result[2].length === 0 ? {} : result[2][0];

        req.records = {
          default_secondary_id_quick_req,
          default_country,
          default_patient_type,
          hims_d_visit_type_id,
          hims_d_sub_department_id,
          hims_d_employee_id,
          department_id,
          default_nationality,
          local_vat_applicable,
        };
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
