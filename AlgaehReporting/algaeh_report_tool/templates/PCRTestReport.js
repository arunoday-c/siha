// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // console.log(params);

      options.mysql
        .executeQuery({
          query: `
         
          select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,P.date_of_birth,P.contact_number,
          N.nationality,N.arabic_nationality,SD.sub_department_name,gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name,
          P.primary_id_no,ID.identity_document_name as primaryIDName,ID.arabic_identity_document_name as primaryAraIDName,
          P.secondary_id_no,IDD.identity_document_name as secondaryIDName,IDD.arabic_identity_document_name  as secondaryAraIDName,
          REF.institute_name, REF.tel_code, REF.contact_number, REF.inCharge_name
          from hims_f_patient P
          inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
          inner join hims_d_referring_institute REF on REF.hims_d_referring_institute_id = P.referring_institute_id
          inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id
          inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
          left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id
          left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id
          left join hims_d_identity_document ID on ID.hims_d_identity_document_id = P.primary_identity_id
          left join hims_d_identity_document IDD on IDD.hims_d_identity_document_id = P.secondary_identity_id
          where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;
          select LO.lab_id_number,MS.hims_d_lab_specimen_id, MS.description as investigation_name,LA.description as analyte_name,LA.reference_range_required,
          LM.analyte_report_group, CASE WHEN LM.analyte_report_group = 'P' THEN 'Physical Appearance' WHEN LM.analyte_report_group = 'M' THEN 'Microscopic Examination' WHEN LM.analyte_report_group = 'D' THEN 'Differential Leukocyte Count'  WHEN LM.analyte_report_group = 'C' THEN 'Chemical Examination' ELSE '' END AS analyte_report_group_desc,
          LO.ordered_date,LS.collected_date,LO.entered_date,LO.validated_date, LO.critical_status,LO.comments,
          OA.result,CASE WHEN OA.result_unit = 'NULL'  THEN '--' WHEN OA.result_unit IS NULL THEN '--' ELSE OA.result_unit END result_unit,
          TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_low)) as normal_low,
          TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,
          S.service_name, E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type,
          CASE WHEN OA.analyte_type = 'QU' THEN OA.normal_qualitative_value WHEN OA.analyte_type = 'T' THEN OA.text_value ELSE CONCAT(TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_low)), '-',  TRIM(TRAILING '.' FROM TRIM(TRAILING '0' from OA.normal_high))) END AS analyte_ranges
          from hims_f_lab_order LO
          inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id
          inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id
          inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id
          inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id
          inner join hims_d_services S on S.hims_d_services_id= LO.service_id
          inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id
          inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id
          inner join hims_d_investigation_test IT on IT.services_id= LO.service_id
          inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id
          inner join hims_m_lab_analyte LM on LM.analyte_id = LA.hims_d_lab_analytes_id and LM.test_id = LO.test_id
          where LO.visit_id = ? and LO.hims_f_lab_order_id=? group by LA.hims_d_lab_analytes_id order by hims_f_ord_analytes_id;
          select H.hospital_name,H.hospital_address,H.arabic_hospital_name, 
          O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,
          O.email,O.website,O.phone1,O.fax from hims_d_hospital H,hims_d_organization O 
          where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id= (select hospital_id from hims_f_lab_order LOH where LOH.hims_f_lab_order_id=?);
          `,
          values: [
            input.hims_d_patient_id,
            input.visit_id,
            input.visit_id,
            input.hims_f_lab_order_id,
            input.hims_f_lab_order_id,
          ],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const header = {
            ..._.head(res[0]),
            ..._.head(res[1]),
            ..._.head(res[2]),
          };
          console.log("header---", header);
          const result = res[1];

          if (result.length > 0) {
            const specimenWise = _.chain(result)
              .groupBy((g) => g.hims_d_lab_specimen_id)
              .map((m) => m)
              .value();
            //utilities.logger().log("specimenWise:", specimenWise);
            const outputArray = [];
            for (let i = 0; i < specimenWise.length; i++) {
              const groupWise = _.chain(specimenWise[i])
                .groupBy((g) => g.analyte_report_group)
                // (N, M, C, P, D)
                .map((detail, key) => {
                  return {
                    analyte_report_group_desc:
                      detail[0].analyte_report_group_desc,

                    order: key === "N" ? 0 : 1,

                    sub_no_employee: detail.length,
                    hims_d_lab_specimen_id: key,
                    groupDetail: detail,
                  };
                })
                .orderBy((o) => o.order)
                .value();

              outputArray.push({
                investigation_name: specimenWise[i][0]["investigation_name"],
                // dep_no_employee: specimenWise[i].length,
                groupWise: groupWise,
              });
            }

            resolve({
              header: header,
              // no_employees: result.length,
              result: outputArray,
            });
            // console.log(result);
          } else {
            resolve({
              header: header,
              // no_employees: result.length,
              result: result,
            });
            // console.log(result);
          }
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
