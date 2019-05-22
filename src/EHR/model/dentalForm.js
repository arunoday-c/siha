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

module.exports = {
  addDentalForm
};
