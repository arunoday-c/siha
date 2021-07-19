// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      let _stringDataSendIn = "";
      // let _stringDataTop10 = "";
      // let _stringDataTestCategory = "";
      // let _stringDataLabOrder = "";
      if (input.startOfWeekSendInOut != null) {
        _stringDataSendIn +=
          "  date(ordered_date) between date('" +
          input.startOfWeekSendInOut +
          "') AND date('" +
          input.endOfWeekSendInOut +
          "')";
      }
      // if (input.objDataTop10OrdersFrom != null) {
      //   _stringDataTop10 +=
      //     "  date(ordered_date) between date('" +
      //     input.objDataTop10OrdersFrom +
      //     "') AND date('" +
      //     input.objDataTop10OrdersTo +
      //     "')";
      // }
      // if (input.startOfWeekOrderByTestCategory != null) {
      //   _stringDataTestCategory +=
      //     "  date(ordered_date) between date('" +
      //     input.startOfWeekOrderByTestCategory +
      //     "') AND date('" +
      //     input.endOfWeekOrderByTestCategory +
      //     "')";
      // }
      // if (input.dateGetLabOrderServicesStart != null) {
      //   _stringDataLabOrder +=
      //     "  date(ordered_date) between date('" +
      //     input.dateGetLabOrderServicesStart +
      //     "') AND date('" +
      //     input.dateGetLabOrderServicesEnd +
      //     "')";
      // }

      options.mysql
        .executeQuery({
          query: `SELECT LO.ordered_date,LO.send_out_test,LO.hims_f_lab_order_id,S.service_name,P.patient_code,P.full_name,P.date_of_birth, P.gender  FROM hims_f_lab_order LO 
          inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'
          where ${_stringDataSendIn} 
          group by hims_f_lab_order_id order by LO.ordered_date desc
             `,
          values: [],
          printQuery: true,
        })
        .then((result) => {
          const arrangedData = _.chain(result)
            .groupBy((g) => moment(g.ordered_date).format("YYYY-MM-DD"))
            .map((details, key) => {
              const { ordered_date } = _.head(details);
              return {
                date: moment(ordered_date).format("YYYY-MM-DD"),
                detailsOf: _.chain(details)
                  .groupBy((it) => it.send_out_test)
                  .map((detail, index) => {
                    const { send_out_test, ordered_date } = _.head(detail);
                    return {
                      send_out_test: send_out_test,
                      type: send_out_test === "Y" ? "Send-Out" : "Send-In",
                      detail: detail,
                      date: ordered_date,
                    };
                  })
                  .value(),
              };
            })
            .value();

          // const getOrderByTestCategory = _.chain(result)
          // .groupBy((g) => g.category_id)
          // .map((details, key) => {
          //   const { category_name } = _.head(details);

          //   return {
          //     category_name: category_name,
          //     detailsOf: details,
          //   };
          // })
          // .value();
          resolve({ result: arrangedData });
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
// SELECT LO.service_id,S.service_name, count(LO.service_id) as service_count FROM hims_f_lab_order as LO
// inner join hims_d_services S on S.hims_d_services_id=LO.service_id
// where ${_stringDataTop10} group by LO.service_id order by service_count DESC limit 0,10;
// SELECT L.category_id,T.category_name,L.description FROM hims_f_lab_order as LO
// inner join hims_d_investigation_test L on L.hims_d_investigation_test_id=LO.test_id
// inner join hims_d_test_category T on T.hims_d_test_category_id=L.category_id
// where ${_stringDataTestCategory};
// select hims_f_lab_order_id,V.episode_id, LO.patient_id, entered_by, confirmed_by, validated_by, visit_id, critical_status,\
//   group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, LO.send_out_test,\
//   E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
//   LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
//   concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
//   lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender, LS.sample_id, LS.container_id, \
//   LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
//   LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id, IT.isPCR, \
//   case when LO.run_type='1' then '1 Time' when LO.run_type='2' then '2 Times' when LO.run_type='3' then '3 times' else '-' end as run_types, \
//   LO.contaminated_culture, LS.barcode_gen, \
//   max(if(CL.algaeh_d_app_user_id=LO.entered_by, EM.full_name,'' )) as entered_by_name, \
//   max(if(CL.algaeh_d_app_user_id=LO.confirmed_by, EM.full_name,'')) as confirm_by_name, \
//   max(if(CL.algaeh_d_app_user_id=LO.validated_by, EM.full_name,'')) as validate_by_name, \
//   entered_date,confirmed_date,validated_date  from hims_f_lab_order LO \
//   inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
//   inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
//   inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
//   inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
//   left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
//   left join hims_d_title as T on T.his_d_title_id = E.title_id \
//   left join hims_d_investigation_test as IT on IT.services_id = LO.service_id \
//   left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
//   left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id \
//   left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LO.entered_by or \
//   CL.algaeh_d_app_user_id=LO.validated_by or CL.algaeh_d_app_user_id=LO.confirmed_by) \
//   left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id WHERE
//   ${_stringDataLabOrder}

module.exports = { executePDF };
