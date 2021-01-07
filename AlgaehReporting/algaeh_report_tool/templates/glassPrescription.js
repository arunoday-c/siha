const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise((resolve, reject) => {
    try {
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `select P.prescription_date,auto_ref_right_sch,auto_ref_right_cyl,auto_ref_right_axis,
             auto_ref_left_sch,auto_ref_left_cyl,auto_ref_left_axis,
             bcva_dv_right_sch,bcva_dv_right_cyl,bcva_dv_right_axis,bcva_dv_right_vision,
             bcva_nv_right_sch,bcva_nv_right_cyl,bcva_nv_right_axis,bcva_nv_right_vision,bcva_dv_left_sch,
             bcva_dv_left_sch,bcva_dv_left_cyl,bcva_dv_left_axis,bcva_dv_left_vision,bcva_nv_left_sch,bcva_nv_left_cyl,bcva_nv_left_axis,
             bcva_nv_left_vision,remarks
             ,PT.full_name,E.full_name as provider_name from hims_f_glass_prescription as P
             inner join hims_f_patient as PT on PT.hims_d_patient_id = P.patient_id
             inner join hims_d_employee as E on P.provider_id = E.hims_d_employee_id
              where P.patient_id=? and P.visit_id=? and P.provider_id=?;`,
          values: [input.patient_id, input.visit_id, input.provider_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({ ..._.head(result) });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
