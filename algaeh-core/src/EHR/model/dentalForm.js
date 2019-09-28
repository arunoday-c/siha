import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
const keyPath = require("algaeh-keys/keys");

let addDentalForm = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_f_dental_form (patient_id,provider_id,visit_id,episode,approved,work_status,\
            due_date,bruxzir_anterior,ips_e_max,lava,lumineers,zirconia_e_max_layered,\
            bruxzir,nobel,white_high_nobel,non_precious,pmma,titanium,zirconia_w_ti_base,\
            biomet_3i_encode,screw_retained,flexi,analog,models,implant_parts,impression,\
            bite,shade_tab,others,photos,bags,rx_forms,created_date,created_by,updated_date,updated_by,hospital_id)\
                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.patient_id,
          input.provider_id,
          input.visit_id,
          input.episode,
          input.approved ? input.approved : "N",
          input.work_status ? input.work_status : "PEN",
          input.due_date,
          input.bruxzir_anterior,
          input.ips_e_max,
          input.lava,
          input.lumineers,
          input.zirconia_e_max_layered,
          input.bruxzir,
          input.nobel,
          input.white_high_nobel,
          input.non_precious,
          input.pmma,
          input.titanium,
          input.zirconia_w_ti_base,
          input.biomet_3i_encode,
          input.screw_retained,
          input.flexi,
          input.analog,
          input.models,
          input.implant_parts,
          input.impression,
          input.bite,
          input.shade_tab,
          input.others,
          input.photos,
          input.bags,
          input.rx_forms,

          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  addDentalForm,
  getDentalLab: (req, res, next) => {
    const _mysql = new algaehMysql({ path: keyPath });
    //// TODO: to sort by hospital id is required or not
    try {
      let input = req.query;
      _mysql
        .executeQuery({
          query:
            "select P.patient_code,concat(T.title,' ',P.full_name)as  patient_name,concat(ET.title,' ',E.full_name)as  employee_name,PL.hims_f_treatment_plan_id, \
        PL.plan_name,D.work_status,D.due_date \
        from hims_f_dental_form as D inner join hims_f_patient as P \
        on P.hims_d_patient_id=D.patient_id \
        left join hims_d_title as T on T.his_d_title_id = P.title_id \
        inner join hims_d_employee as E on  D.provider_id=E.hims_d_employee_id \
        left join hims_d_title as ET on ET.his_d_title_id = E.title_id  inner join hims_f_treatment_plan as PL \
        on PL.patient_id = P.hims_d_patient_id and PL.visit_id = D.visit_id  and PL.episode_id = D.episode \
        where date(D.due_date) >= date(?) and date(D.due_date) <= date(?)",
          values: [input.from_due_date, input.to_due_date]
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
      next(error);
    }
  }
};
