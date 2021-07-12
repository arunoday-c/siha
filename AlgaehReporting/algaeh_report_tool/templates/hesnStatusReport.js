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

      console.log("INPUT:", input);

      if (input.hassanShow === "withhassan") {
        str += " and LO.hassan_number is not null";
      }
      if (input.hassanShow === "withOuthassan") {
        str += " and LO.hassan_number is null";
      }

      options.mysql
        .executeQuery({
          query: `select LO.ordered_date,LO.lab_id_number,LO.hassan_number,LO.hassan_number_updated_date,
          case when LO.hesn_upload='Y' then 'Yes' else 'No' end as hesn_upload,LO.hesn_upload_updated_date,P.patient_code,P.full_name,P.primary_id_no,
          INV.description,USR.user_display_name as hesn_no_updated_by,USRR.user_display_name as hesn_file_updated_by
          from hims_f_lab_order LO 
          inner join hims_d_investigation_test INV on INV.hims_d_investigation_test_id=LO.test_id 
          inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id 
          left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=LO.hassan_number_updated_by 
          left join algaeh_d_app_user USRR on USRR.algaeh_d_app_user_id=LO.hesn_upload_updated_by 
          WHERE INV.isPCR='Y' and LO.billed='Y' and date(ordered_date) between date(?) AND date(?) ${str};`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result,
          });
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
