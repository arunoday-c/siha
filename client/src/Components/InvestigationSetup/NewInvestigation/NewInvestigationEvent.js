import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

const texthandle = ($this, ctrl, e) => {
  debugger;
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  if (name === "category_id") {
    let analytes_required = e.selected.test_section === "M" ? false : true;
    $this.setState({
      [name]: value,
      analytes_required: analytes_required
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
  if (name === "investigation_type") {
    $this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      module: "laboratory",
      method: "GET",
      data: { investigation_type: value },
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });
  }
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
    } else if ($this.state.container_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Container Cannot be blank."
      });
      document.querySelector("[name='container_id']").focus();
      return isError;
    } else if (
      $this.state.analytes.length === 0 &&
      $this.state.analytes_required === true
    ) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Atleast One Analytes to be add."
      });

      return isError;
    } else if ($this.state.category_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Category Cannot be blank."
      });
      document.querySelector("[name='category_id']").focus();
      return isError;
    }
  }

  // else if ($this.state.lab_section_id === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "error",
  //     title: "Lab Section Cannot be blank."
  //   });
  //   document.querySelector("[name='lab_section_id']").focus();
  //   return isError;
  // }
};
const InsertLabTest = ($this, e) => {
  const err = Validations($this);
  console.log($this.state, "from insert lab");

  if (!err) {
    if ($this.state.hims_d_investigation_test_id === null) {
      algaehApiCall({
        uri: "/investigation/addInvestigationTest",
        module: "laboratory",
        data: $this.state,
        onSuccess: response => {
          console.log("from add", response.data);
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
          console.log("from update", response.data);
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

const CptCodesSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Services.CptCodes
    },
    searchName: "CptCodes",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        cpt_id: row.hims_d_cpt_code_id,
        cpt_code_data: row.cpt_code
      });
    }
  });
};
export { texthandle, InsertLabTest, CptCodesSearch };
