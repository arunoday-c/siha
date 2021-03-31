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

      let _stringDataLabOrder = "";

      if (input.dateGetLabOrderServicesStart != null) {
        _stringDataLabOrder +=
          "  date(ordered_date) between date('" +
          input.dateGetLabOrderServicesStart +
          "') AND date('" +
          input.dateGetLabOrderServicesEnd +
          "')";
      }

      options.mysql
        .executeQuery({
          query: ` select hims_f_lab_order_id,V.episode_id, LO.patient_id, entered_by, confirmed_by, validated_by, visit_id, critical_status,\
            group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, LO.send_out_test,\
            E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
            LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
            concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
            lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender, LS.sample_id, LS.container_id, \
            LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
            LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id, IT.isPCR, \
            case when LO.run_type='1' then '1 Time' when LO.run_type='2' then '2 Times' when LO.run_type='3' then '3 times' else '-' end as run_types, \
            LO.contaminated_culture, LS.barcode_gen, \
            max(if(CL.algaeh_d_app_user_id=LO.entered_by, EM.full_name,'' )) as entered_by_name, \
            max(if(CL.algaeh_d_app_user_id=LO.confirmed_by, EM.full_name,'')) as confirm_by_name, \
            max(if(CL.algaeh_d_app_user_id=LO.validated_by, EM.full_name,'')) as validate_by_name, \
            entered_date,confirmed_date,validated_date  from hims_f_lab_order LO \
            inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
            inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
            inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
            left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
            left join hims_d_title as T on T.his_d_title_id = E.title_id \
            left join hims_d_investigation_test as IT on IT.services_id = LO.service_id \
            left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
            left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id \
            left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LO.entered_by or \
            CL.algaeh_d_app_user_id=LO.validated_by or CL.algaeh_d_app_user_id=LO.confirmed_by) \
            left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id WHERE
            ${_stringDataLabOrder} group by hims_f_lab_order_id order by hims_f_lab_order_id desc
          `,
          values: [],
          printQuery: true,
          //   DD-MM-YYYY - hh:mm A
        })
        .then((result) => {
          const arrangedData = result
            // .filter((f) => f.sample_status === "A")
            .map((item) => {
              return {
                ...item,
                test_type: item.test_type === "S" ? "Stat" : "Routine",
                ordered_date: moment(item.ordered_date).format(
                  "DD-MM-YYYY - hh:mm A"
                ),
                sample_status:
                  item.sample_status === "N"
                    ? "Not Done"
                    : item.sample_status === "A"
                    ? "Accepted"
                    : "Rejected",
                status:
                  item.status === "CL"
                    ? "Collected"
                    : item.status === "CN"
                    ? "Cancelled"
                    : item.status === "CF"
                    ? "Confirmed"
                    : "Validated",
              };
            });
          console.log("arranged DAta", arrangedData);
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

module.exports = { executePDF };
