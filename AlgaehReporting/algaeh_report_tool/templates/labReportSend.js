const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // let is_SendOut = "";

      // if (input.is_SendOut === "Y") {
      //     is_SendOut = " and H.default_nationality=E.nationality ";
      // } else if (input.SENDOUT_TYPE === "N") {
      //     SENDOUT_TYPE = " and H.default_nationality<>E.nationality ";
      // }

      options.mysql
        .executeQuery({
          query: ` 
            SELECT P.patient_code,P.full_name as pat_name, E.full_name as doc_name,S.service_name, case when LO.test_type='R' then 'Routine' else 'Stat' end as test_type, CLE.full_name as collected_by, LS.collected_date, CNE.full_name as confirmed_by,LO.confirmed_date, VLE.full_name as validated_by, LO.validated_date 
            from hims_f_lab_order LO inner join hims_f_patient P on P.hims_d_patient_id = LO.patient_id
            left join hims_d_employee E on E.hims_d_employee_id = LO.provider_id
            left join hims_d_services S on S.hims_d_services_id = LO.service_id
            left join hims_f_lab_sample LS on LS.order_id = LO.hims_f_lab_order_id
            left join algaeh_d_app_user CL on CL.algaeh_d_app_user_id = LS.collected_by
            left join hims_d_employee CLE on CLE.hims_d_employee_id = CL.employee_id
            left join algaeh_d_app_user CN on CN.algaeh_d_app_user_id = LO.created_by
            left join hims_d_employee CNE on CNE.hims_d_employee_id = CN.employee_id
            left join algaeh_d_app_user VL on VL.algaeh_d_app_user_id = LO.validated_by
            left join hims_d_employee VLE on VLE.hims_d_employee_id = VL.employee_id
            where LO.billed='Y' and date(LO.ordered_date) between date(?) and date(?) and LO.hospital_id=? and LO.send_out_test = ? ; `,
          values: [
            input.from_date,
            input.to_date,
            input.hospital_id,
            input.is_SendOut,
          ],
          printQuery: true,
        })
        .then((res) => {
          // options.mysql.releaseConnection();
          // const hospital_name = res[0][0]["hospital_name"];
          const result = res;

          resolve({
            result: result,
          });
        })
        .catch((e) => {
          // console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      // console.log("e:", e);
      reject(e);
    }
  });
};
module.exports = { executePDF };
