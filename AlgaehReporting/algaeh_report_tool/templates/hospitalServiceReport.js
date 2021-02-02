// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      if (input.hospital_id > 0) {
        str += ` and S.hospital_id=${input.hospital_id}`;
      }

      if (input.service_type_id > 0) {
        str += ` and S.service_type_id=${input.service_type_id}`;
      }
      if (input.accound_id_assigned == "Y") {
        str += ` and S.head_id is NULL`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT S.service_type_id,S.hims_d_services_id,S.service_code,S.service_name,S.arabic_service_name,
          SD.sub_department_name,ST.service_type,case when S.vat_applicable='Y' then 'Yes' else 'No' end as vat_applicable,
          case when S.physiotherapy_service='Y' then 'Yes' else 'No' end as physiotherapy_service, 
          S.vat_percent,S.standard_fee,FH.account_code,FH.account_name,FC.ledger_code,
          FC.child_name,S.hospital_id,S.procedure_type,CPT.cpt_desc,CPT.cpt_code
          FROM hims_d_services S
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = S.sub_department_id
          left join hims_d_service_type ST on ST.hims_d_service_type_id = S.service_type_id
          left join finance_account_head FH on FH.finance_account_head_id = S.head_id
          left join finance_account_child FC on FC.finance_account_child_id = S.child_id
          left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code where 1+1  ${str} order by S.service_type_id asc;`,
          // values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.service_type_id)
            .map(function (dtl) {
              const { service_type } = dtl[0];
              return {
                service_type,
                service_count: dtl.length,
                detailList: dtl,
              };
            })
            .value();
          resolve({ detail: result });
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
