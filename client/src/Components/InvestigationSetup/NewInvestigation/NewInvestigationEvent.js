import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

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
      title: "Test Name Cannot be blank."
    });

    document.querySelector("[name='description']").focus();
    return isError;
  } else if ($this.state.services_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Service Cannot be blank."
    });
    document.querySelector("[name='services_id']").focus();
    return isError;
  } else if ($this.state.investigation_type === "L") {
    if ($this.state.specimen_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Specimen Cannot be blank."
      });
      document.querySelector("[name='specimen_id']").focus();
      return isError;
    } else if ($this.state.lab_section_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Lab Section Cannot be blank."
      });
      document.querySelector("[name='lab_section_id']").focus();
      return isError;
    } else if ($this.state.container_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Container Cannot be blank."
      });
      document.querySelector("[name='container_id']").focus();
      return isError;
    } else if ($this.state.analytes.length === 0) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Atleast One Analytes to be add."
      });

      return isError;
    }
  } else if ($this.state.investigation_type === "R") {
    if ($this.state.category_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Category Cannot be blank."
      });
      document.querySelector("[name='category_id']").focus();
      return isError;
    }
  }
};
const InsertLabTest = ($this, e) => {
  const err = Validations($this);

  if (!err) {
    if ($this.state.hims_d_investigation_test_id === null) {
      algaehApiCall({
        uri: "/investigation/addInvestigationTest",
        module: "laboratory",
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
        module: "laboratory",
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
