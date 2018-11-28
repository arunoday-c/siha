import moment from "moment";
import { Validations } from "./SubInsuranceValidation";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });
};

const saveSubInsurance = ($this, context) => {
  let updatedata = [];
  const err = Validations($this);
  if (!err) {
    let obj = {
      insurance_sub_code: $this.state.insurance_sub_code,
      insurance_sub_name: $this.state.insurance_sub_name,
      arabic_sub_name: $this.state.arabic_sub_name,
      insurance_provider_id: $this.state.insurance_provider_id,
      transaction_number: $this.state.transaction_number,
      card_format: $this.state.card_format,
      effective_start_date:
        $this.state.effective_start_date !== null
          ? moment($this.state.effective_start_date)._d
          : null,
      effective_end_date:
        $this.state.effective_end_date !== null
          ? moment($this.state.effective_end_date)._d
          : null
    };
    let previous = $this.state.sub_insurance ? $this.state.sub_insurance : [];
    previous.push(obj);
    // if ($this.state.buttonenable === true) {
    updatedata.push(obj);
    algaehApiCall({
      uri: "/insurance/addSubInsuranceProvider",
      data: updatedata,
      onSuccess: response => {
        if (response.data.success === true) {
          $this.setState({
            insurance_sub_saved: true,
            sub_insurance: previous
          });

          if (context !== undefined) {
            context.updateState({
              sub_insurance: previous
            });
          }
          addNewSubinsurance($this);
          swalMessage({
            type: "success",
            title: "Added successfully . ."
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
    // }
  }
};

const addNewSubinsurance = $this => {
  $this.setState({
    insurance_sub_code: null,
    insurance_sub_name: null,
    transaction_number: null,
    arabic_sub_name: null,
    card_format: null
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const showconfirmDialog = ($this, id) => {
  swal({
    title: "Are you sure you want to delete this Sub Insurance?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let data = {
        hims_d_insurance_sub_id: id
        //updated_by: getCookie("UserID")
      };
      algaehApiCall({
        uri: "/insurance/deleteSubInsurance",
        data: data,
        method: "DELETE",
        onSuccess: response => {
          if (response.data.success) {
            getSubInsuranceDetails($this);
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

const deleteSubInsurance = ($this, row) => {
  showconfirmDialog($this, row.hims_d_insurance_sub_id);
};

const getSubInsuranceDetails = $this => {
  algaehApiCall({
    uri: "/insurance/getSubInsurance",
    method: "GET",
    data: {
      insurance_provider_id: $this.state.insurance_provider_id
    },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({ sub_insurance: response.data.records });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};
const updateSubInsurance = ($this, data) => {
  algaehApiCall({
    uri: "/insurance/updateSubInsuranceProvider",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        getSubInsuranceDetails($this);
        swalMessage({
          type: "success",
          title: "Record updated successfully . ."
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
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

export {
  texthandle,
  saveSubInsurance,
  addNewSubinsurance,
  datehandle,
  deleteSubInsurance,
  updateSubInsurance,
  onchangegridcol,
  getSubInsuranceDetails
};
