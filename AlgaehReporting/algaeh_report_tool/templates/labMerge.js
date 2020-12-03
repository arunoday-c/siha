const executePDF = function executePDFMethod(options) {
  const analytePairs = {
    P: "Physical Appearance",
    M: "Microscopic Examination",
    D: "Differential Leukocyte Count",
    C: "Chemical Examination",
  };
  return new Promise((resolve, reject) => {
    try {
      const _ = options.loadash;
      let input = {};
      let params = options.args.reportParams;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // CASE WHEN LM.analyte_report_group = 'P' THEN 'Physical Appearance' WHEN LM.analyte_report_group = 'M' THEN 'Microscopic Examination' WHEN LM.analyte_report_group = 'D' THEN 'Differential Leukocyte Count'  WHEN LM.analyte_report_group = 'C' THEN 'Chemical Examination' ELSE '--' END AS analyte_report_group_desc,
      options.mysql
        .executeQuery({
          query: `select P.patient_code,trim(E.full_name) as doctor_name,
             P.full_name as patient_name,SD.sub_department_name, gender,
             age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, 
             P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V 
             on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    
             inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   
             left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  
             left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    
             where  V.hims_f_patient_visit_id=?;  
             select LO.hims_f_lab_order_id, MS.hims_d_lab_specimen_id,LA.reference_range_required, 
             LM.analyte_report_group,
             MS.description as investigation_name,LA.description as analyte_name,
             LO.ordered_date,LO.entered_date,LO.validated_date, 
             LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_low)) as normal_low,
             TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_high)) as normal_high,
             OA.critical_low,OA.critical_high,S.service_name,   
             E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, 
             OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    
             inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    
             inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    
             inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     
             inner join hims_d_services S on S.hims_d_services_id= LO.service_id     
             inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   
             inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     
             inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   
             inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id 
             inner join hims_m_lab_analyte LM on LM.analyte_id = LA.hims_d_lab_analytes_id  and LM.test_id = LO.test_id
             where LO.visit_id = ? and LO.hims_f_lab_order_id in (?) group by LA.hims_d_lab_analytes_id order by hims_f_ord_analytes_id;`,
          values: [input.visit_id, input.visit_id, input.lab_order_ids],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();
          const headRecord = _.head(result[0]);
          let records = _.chain(result[1])
            .groupBy((g) => g.hims_f_lab_order_id)
            .map((details) => {
              const { investigation_name } = _.head(details);
              return {
                investigation_name,
                details: _.chain(details)
                  .groupBy((gt) => gt.analyte_report_group)
                  .map((dtl, gkey) => {
                    return {
                      analyte_report_group_desc: analytePairs[gkey],
                      order: gkey === "N" ? 0 : 1,
                      groupDetails: dtl,
                    };
                  })
                  .orderBy((o) => o.order)
                  .value(),
              };
            })
            .value();

          //ToDO need to remove only for testing
          // records = records.concat(records);
          //ToDO need to remove only for testing
          //records = records.concat(records);

          resolve({ headRecord, records });
        });
    } catch (e) {
      options.mysql.releaseConnection();
      reject(e);
    }
  });
};
module.exports = { executePDF };
