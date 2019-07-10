import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const UpdateOrders = ($this, row) => {
  let dataSend = [];
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);

  if (row.apprv_status === "AP" || row.apprv_status === "RJ") {
    if ($this.props.openFrom === "S") {
      dataSend = [
        {
          hims_f_service_approval_id: row.hims_f_service_approval_id,
          hims_f_ordered_services_id: row.ordered_services_id,
          apprv_status: row.apprv_status,

          insured: "Y",
          hims_d_services_id: row.service_id,
          primary_insurance_provider_id: row.insurance_provider_id,
          primary_network_office_id: row.insurance_network_office_id,
          primary_network_id: row.network_id,
          sec_insured: "N",
          sec_company: "N",
          secondary_insurance_provider_id: null,
          secondary_network_id: null,
          secondary_network_office_id: null,
          pre_approval: "Y",
          approved_amount: row.approved_amount
        }
      ];

      algaehApiCall({
        uri: "/orderAndPreApproval/updateOrderedServices",
        data: dataSend,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            row.billing_updated = "Y";
            services_details[_index] = row;
            $this.setState({
              services_details: services_details
            });
            swalMessage({
              title: "Verified successfully . .",
              type: "success"
            });
          }
        }
      });
    } else if ($this.props.openFrom === "M") {
      dataSend = [
        {
          hims_f_prescription_detail_id: row.prescription_detail_id,
          apprv_status: row.apprv_status,
          approved_amount: row.approved_amount,
          hims_f_medication_approval_id: row.hims_f_medication_approval_id
        }
      ];

      algaehApiCall({
        uri: "/orderAndPreApproval/updatePrescriptionDetail",
        data: dataSend,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            row.billing_updated = "Y";
            services_details[_index] = row;
            $this.setState({
              services_details: services_details
            });
            swalMessage({
              title: "Verified successfully . .",
              type: "success"
            });
          }
        }
      });
    }
  } else {
    swalMessage({
      title: "If Approved or Reject only can be processed",
      type: "warning"
    });
  }
};

export { UpdateOrders };
