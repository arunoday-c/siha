const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      // let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select P.patient_code,P.full_name as patient_full_name,P.arabic_name as patient_arabaic_full_name,RO.result_html, RD.template_name,
          RO.ordered_date, RO.scheduled_date_time,RO.arrived_date,RO.validate_date_time,RO.attended_date_time,
          RO.exam_start_date_time,RO.exam_end_date_time,RO.updated_by,RO.updated_date,
          DOC.full_name as refer_by,
          PER.user_display_name as perform_by,
          SCH.user_display_name as scheduled_by,
          PREP.user_display_name as attended_by,
          REV.user_display_name as validate_by,
          RO.comments
          from hims_f_rad_order RO
          inner join hims_d_rad_template_detail RD  on RO.template_id= RD.hims_d_rad_template_detail_id
          inner join hims_f_patient P on P.hims_d_patient_id= RO.patient_id
          left join hims_d_employee DOC on DOC.hims_d_employee_id=RO.provider_id
          left join algaeh_d_app_user PER on PER.algaeh_d_app_user_id=RO.technician_id
          left join algaeh_d_app_user SCH on SCH.algaeh_d_app_user_id=RO.scheduled_by
          left join algaeh_d_app_user PREP on PREP.algaeh_d_app_user_id=RO.attended_by
          left join algaeh_d_app_user REV on REV.algaeh_d_app_user_id=RO.validate_by   
          where hims_f_rad_order_id =?;
          `,
          // or (RO.patient_id =? and RO.visit_id=?)
          values: [
            input.hims_f_rad_order_id,
            // input.hims_d_patient_id,
            // input.visit_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          const final = {
            header: result[0],
            result: result,
          };
          resolve(final);
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
