import { successfulMessage } from "../../../utils/GlobalFunctions";

const UpdateOrders = ($this, row) => {
  debugger;

  let dataSend = [];

  dataSend = [
    {
      hims_f_ordered_services_id: row.ordered_services_id,
      apprv_status: row.apprv_status,

      insured: "Y",
      hims_d_services_id: row.service_id,
      primary_insurance_provider_id: row.insurance_provider_id,
      primary_network_office_id: row.insurance_network_office_id,
      primary_network_id: row.network_id,
      sec_insured: null,
      secondary_insurance_provider_id: null,
      secondary_network_id: null,
      secondary_network_office_id: null,
      pre_approval: "Y",
      approved_amount: row.approved_amount
    }
  ];
  if (row.apprv_status === "AP" || row.apprv_status === "RJ") {
    dataSend = [
      {
        hims_f_ordered_services_id: row.ordered_services_id,
        apprv_status: row.apprv_status,

        insured: row.apprv_status,
        hims_d_services_id: row.apprv_status,
        primary_insurance_provider_id: row.insurance_provider_id,
        primary_network_office_id: row.insurance_network_office_id,
        primary_network_id: row.network_id,
        sec_insured: null,
        secondary_insurance_provider_id: null,
        secondary_network_id: null,
        secondary_network_office_id: null,
        pre_approval: row.pre_approval,
        approved_amount: row.approved_amount
      }
    ];
  } else {
    successfulMessage({
      message: "Invalid Input. If Approved or Reject only can be processed",
      title: "Warning",
      icon: "warning"
    });
  }
};

export { UpdateOrders };
