const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      if (input.hospital_id > 0) {
        str += ` and S.hospital_id= ${input.hospital_id}`;
      }
      if (input.accound_id_assigned == "Y") {
        str += ` and S.head_id=NULL`;
      }

      options.mysql
        .executeQuery({
          query:
            `SELECT S.hims_d_services_id,S.service_code,S.service_name,S.arabic_service_name,SD.sub_department_name,ST.service_type,S.vat_applicable,S.vat_percent,S.standard_fee,FH.account_code,FH.account_name,FC.ledger_code,FC.child_name,S.physiotherapy_service,S.hospital_id,S.procedure_type,CPT.cpt_desc
          FROM hims_d_services S
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = S.sub_department_id
          left join hims_d_service_type ST on ST.hims_d_service_type_id = S.service_type_id
          left join finance_account_head FH on FH.finance_account_head_id = S.head_id
          left join finance_account_child FC on FC.finance_account_child_id = S.child_id
          left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code` +
            str,
          printQuery: true,
        })
        .then((result) => {
          const header = result.length == 0 ? [] : result[0];
          console.log("header===", header);
          resolve(header);
        });

      // console.log("result: ", options.result[0]);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
