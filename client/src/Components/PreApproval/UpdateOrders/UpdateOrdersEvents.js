import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const UpdateOrders = ($this, row) => {
  let dataSend = [];

  if (row.apprv_status === "AP" || row.apprv_status === "RJ") {
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
        // updated_by: getCookie("UserID")
      }
    ];

    algaehApiCall({
      uri: "/orderAndPreApproval/updateOrderedServices",
      data: dataSend,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Verified successfully . .",
            type: "success"
          });
        }
      }
    });
  } else {
    swalMessage({
      title: "Invalid Input. If Approved or Reject only can be processed",
      type: "warning"
    });
  }
};

export { UpdateOrders };
