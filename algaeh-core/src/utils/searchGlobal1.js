const searchGlobal = ({ hospitalId }) => {
  return [
    {
      searchName: "serviceTypes",
      searchQuery: `select hims_d_services_id, service_code, S.cpt_code, CPT.cpt_code as cpt_p_code, service_name, service_desc,
        sub_department_id, hospital_id, service_type_id, standard_fee , discount, vat_applicable, vat_percent, 
        effective_start_date, effectice_end_date, procedure_type, physiotherapy_service, head_id, child_id from 
        hims_d_services S left join hims_d_cpt_code CPT on CPT.hims_d_cpt_code_id = S.cpt_code 
        WHERE S.record_status ='A' and S.hospital_id =${hospitalId}`,
    },
  ];
};
export default searchGlobal;
