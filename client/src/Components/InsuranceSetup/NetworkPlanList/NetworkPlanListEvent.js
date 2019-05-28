import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";

const showconfirmDialog = ($this, row) => {
  swal({
    title: "Are you sure you want to delete this Network Plan?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_insurance_network_id: row.hims_d_insurance_network_id,
        hims_d_insurance_network_office_id:
          row.hims_d_insurance_network_office_id
        //updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/insurance/deleteNetworkAndNetworkOfficRecords",
        module: "insurance",
        data: data,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            algaehApiCall({
              uri: "/insurance/getNetworkAndNetworkOfficRecords",
              module: "insurance",
              method: "GET",
              data: {
                insuranceProviderId: $this.state.insurance_provider_id
              },
              onSuccess: response => {
                if (response.data.success) {
                  $this.setState({
                    network_plan: response.data.records
                  });
                }
              },
              onFailure: error => {
                swalMessage({
                  title: error.response.data.message,
                  type: "error"
                });
              }
            });
            // $this.props.getNetworkPlans({
            //   uri: "/insurance/getNetworkAndNetworkOfficRecords",
            //   method: "GET",
            //   printInput: true,
            //   data: {
            //     insuranceProviderId: $this.state.insurance_provider_id
            //   },
            //   redux: {
            //     type: "NETWORK_PLAN_GET_DATA",
            //     mappingName: "networkandplans"
            //   },
            //   afterSuccess: data => {
            //     $this.setState({
            //       network_plan: data
            //     });
            //   }
            // });
            swalMessage({
              type: "success",
              title: "Record deleted successfully . ."
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.response.data.message,
            type: "error"
          });
        }
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const deleteNetWorkPlan = ($this, row) => {
  showconfirmDialog($this, row);
};

const UpdateNetworkPlan = ($this, row) => {
  let updateobj = {
    hims_d_insurance_network_id: row.hims_d_insurance_network_id,
    network_type: row.network_type,
    insurance_provider_id: row.insurance_provider_id,
    insurance_sub_id: row.insurance_sub_id,

    effective_start_date: row.effective_start_date,
    effective_end_date: row.effective_end_date,

    hims_d_insurance_network_office_id: row.hims_d_insurance_network_office_id,
    network_id: row.hims_d_insurance_network_id,
    deductible: row.deductible,
    copay_consultation: row.copay_consultation,
    max_value: row.max_value,
    deductible_lab: row.deductible_lab,
    copay_percent: row.copay_percent,
    lab_max: row.lab_max,
    deductible_rad: row.deductible_rad,
    copay_percent_rad: row.copay_percent_rad,
    rad_max: row.rad_max,
    deductible_trt: row.deductible_trt,
    copay_percent_trt: row.copay_percent_trt,
    trt_max: row.trt_max,
    deductible_dental: row.deductible_dental,
    copay_percent_dental: row.copay_percent_dental,
    dental_max: row.dental_max,
    deductible_medicine: row.deductible_medicine,
    copay_medicine: row.copay_medicine,
    medicine_max: row.medicine_max,

    price_from: row.price_from,
    employer: row.employer,
    policy_number: row.policy_number,
    preapp_limit: row.preapp_limit,
    hospital_id: row.hospital_id,
    invoice_max_deduct:
      row.invoice_max_deduct === null ? 0 : row.invoice_max_deduct,
    preapp_limit_from: row.preapp_limit_from
  };
  if (row.hims_d_insurance_network_id !== null) {
    algaehApiCall({
      uri: "/insurance/updateNetworkAndNetworkOffice",
      module: "insurance",
      data: updateobj,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success === true) {
          swalMessage({
            type: "success",
            title: "Updated successfully . ."
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const onchangegridnumber = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value >= 0) {
    row[name] = value;
    row.update();
  } else {
    swalMessage({
      title: "Cannot be less than zero.",
      type: "warning"
    });
  }
};

export {
  deleteNetWorkPlan,
  UpdateNetworkPlan,
  onchangegridcol,
  onchangegridnumber
};
