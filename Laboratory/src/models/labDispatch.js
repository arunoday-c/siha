import algaehMysql from "algaeh-mysql";
import _ from "lodash";
export function labResultDispatch(req, res, next) {
  const _mysql = new algaehMysql();
  const { hospital_id } = req.userIdentity;
  try {
    const { patient_id } = req.query;
    _mysql
      .executeQuery({
        query: `select LO.validated_date,LO.critical_status,LO.send_out_test,
          concat(T.title,". ",E.full_name) as doc_name,PV.maternity_patient,
          PV.mlc_accident_reg_no,LO.billed,LO.status,PV.visit_date,S.service_name,
          PV.hims_f_patient_visit_id,PV.patient_id,LO.hims_f_lab_order_id
           from hims_f_lab_order as LO inner join hims_f_patient_visit as PV
          on LO.visit_id = PV.hims_f_patient_visit_id
          inner join hims_d_services as S on S.hims_d_services_id = LO.service_id
          inner join hims_d_employee as E on E.hims_d_employee_id = PV.doctor_id
          left join hims_d_title as T on E.title_id = T.his_d_title_id
           where LO.patient_id=? and PV.visit_status != 'CN' and LO.cancelled='N' and PV.hospital_id=? ;`,
        values: [patient_id, hospital_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        const records = _.chain(result)
          .groupBy((g) => g.hims_f_patient_visit_id)
          .map((items) => {
            const head = _.head(items);
            return {
              ...head,
              list: items,
            };
          })
          .value();
        req.records = records;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
