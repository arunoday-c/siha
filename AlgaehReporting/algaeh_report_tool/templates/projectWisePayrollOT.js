// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      let strData = "";

      if (input.project_id > 0) {
        strData += " and PWP.project_id=" + input.project_id;
      }
      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }
      if (input.employee_group_id > 0) {
        strData += " and E.employee_group_id=" + input.employee_group_id;
      }

      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }
      if (input.employee_type) {
        strData += ` and E.employee_type= '${input.employee_type}'`;
      }
      options.mysql
        .executeQuery({
          query: `Select hims_f_project_wise_payroll_id,employee_id,  month, year,group_description,
          E.employee_code,E.full_name,d.designation, project_id, P.project_code,P.project_desc,SD.sub_department_name,
          concat(round((COALESCE(worked_hours,0) + COALESCE(concat(floor(worked_minutes/60)  ,'.',   right(concat(00,worked_minutes%60),2)),0)),2))
          as total_hours,concat(round((COALESCE(basic_hours,0) + COALESCE(concat(floor(basic_minutes/60)  ,'.',   right(concat(00,basic_minutes%60),2)),0)),2)
          )as basic_hours, concat( round((COALESCE(ot_hours,0) + COALESCE(concat(floor(ot_minutes/60)  ,'.',  right(concat(00,ot_minutes%60),2)),0)),2))
          as ot_hours,concat(round((COALESCE(wot_hours,0) + COALESCE(concat(floor(wot_minutes/60)  ,'.', right(concat(00,wot_minutes%60),2)),0)),2)
          ) as wot_hours,concat(round((COALESCE(hot_hours,0) + COALESCE(concat(floor(hot_minutes/60)  ,'.',  right(concat(00,hot_minutes%60),2)),0)),2)
          ) as hot_hours,basic_cost, ot_cost, wot_cost, hot_cost, cost,
          concat(round((COALESCE(ot_hours+wot_hours+hot_hours,0)+COALESCE(concat(floor((ot_minutes+wot_minutes+hot_minutes)/60) 
          ,'.', right(concat(00,(ot_minutes+wot_minutes+hot_minutes)%60),2)),0)),2)) as total_ot_hours,
          COALESCE(ot_cost+ wot_cost+hot_cost,0) as total_ot_cost  from hims_f_project_wise_payroll PWP 
          inner join hims_d_employee  E on PWP.employee_id=E.hims_d_employee_id 
          inner join hims_d_project  P on PWP.project_id=P.hims_d_project_id  
          left join hims_d_employee_group EG on EG.hims_d_employee_group_id = E.employee_group_id  
          left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id 
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id
          left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id
          where year=? and month=? and PWP.hospital_id=?    and E.employee_status='A' ${is_local}  ${strData}  order by project_id ;`,
          values: [input.year, input.month, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          const data = {
            details: result,
            net_basic_cost: _.sumBy(result, (s) => parseFloat(s.basic_cost)),
            net_ot_cost: _.sumBy(result, (s) => parseFloat(s.ot_cost)),
            net_wot_cost: _.sumBy(result, (s) => parseFloat(s.wot_cost)),
            net_hot_cost: _.sumBy(result, (s) => parseFloat(s.hot_cost)),
            net_total_ot_cost: _.sumBy(result, (s) =>
              parseFloat(s.total_ot_cost)
            ),
            net_cost: _.sumBy(result, (s) => parseFloat(s.cost)),
          };
          resolve({
            ...data,
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
