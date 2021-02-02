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
        str += ` and SUB.hospital_id=${input.hospital_id}`;
      }

      if (input.department_id > 0) {
        str += ` and D.hims_d_department_id=${input.department_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT D.hims_d_department_id,D.department_code,D.department_name,SD.sub_department_code,SD.sub_department_name,SD.arabic_sub_department_name,
          D.department_type, 
          case when SD.department_type='D' then 'Dental' when  SD.department_type='E' then 'Emergency' when SD.department_type='O' then 'Opthomology' when SD.department_type='N' then 'None' when SD.department_type='PH' then 'Pharmacy' when SD.department_type='O' then 'Inventory' end as sub_department_type
          FROM hims_m_branch_dept_map as SUB
          inner join hims_d_sub_department SD on SD.hims_d_sub_department_id = SUB.sub_department_id
          inner join hims_d_department D on D.hims_d_department_id = SD.department_id
          where SD.record_status='A'  ${str} order by D.hims_d_department_id asc;`,
          // values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.hims_d_department_id)
            .map(function (dtl) {
              const {
                department_code,
                department_name,
                department_type,
              } = dtl[0];
              return {
                department_code,
                department_name,
                department_type,
                department_count: dtl.length,
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
