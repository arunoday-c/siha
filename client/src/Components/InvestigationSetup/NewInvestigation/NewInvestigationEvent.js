import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const Validations = $this => {
  let isError = false;

  if ($this.state.description === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Test Name Cannot be blank."
    });

    document.querySelector("[name='description']").focus();
    return isError;
  }

  if ($this.state.services_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Service Cannot be blank."
    });

    return isError;
  }
};
const InsertLabTest = ($this, e) => {
  const err = Validations($this);

  if (!err) {
    if ($this.state.hims_d_investigation_test_id === null) {
      algaehApiCall({
        uri: "/investigation/addInvestigationTest",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Saved successfully . ."
            });
            $this.props.onClose && $this.props.onClose(true);
          }
        }
      });
    } else {
      algaehApiCall({
        uri: "/investigation/updateInvestigationTest",
        data: $this.state,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Updated successfully . ."
            });
            $this.props.onClose && $this.props.onClose(true);
          }
        }
      });
    }
  }
};
export { texthandle, InsertLabTest };
