import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import InvestigationIOputs from "../../../Models/InvestigationSetup";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  if (name === "category_id") {
    let analytes_required =
      e.selected.test_section === "M" && $this.state.culture_test === "Y"
        ? false
        : true;
    $this.setState({
      [name]: value,
      analytes_required: analytes_required,
      test_section: e.selected.test_section,
    });
  } else if (name === "culture_test") {
    let analytes_required =
      $this.state.test_section === "M" && value === "Y" ? false : true;
    $this.setState({
      [name]: value,
      analytes_required: analytes_required,
    });
  } else {
    $this.setState({
      [name]: value,
    });
  }
  if (name === "investigation_type") {
    $this.setState({ [name]: value }, () => {
      $this.props.getTestCategory({
        uri: "/labmasters/selectTestCategory",
        module: "laboratory",
        method: "GET",
        data: { investigation_type: value },
        redux: {
          type: "TESTCATEGORY_GET_DATA",
          mappingName: "testcategory",
        },
      });
    });
  }
};

const Validations = ($this) => {
  debugger;
  let isError = false;
  // if ($this.state.test_code === null) {
  //   isError = true;
  //   swalMessage({
  //     type: "error",
  //     title: "Test Code Cannot be blank."
  //   });

  //   document.querySelector("[name='test_code']").focus();
  //   return isError;
  // } else

  if ($this.state.description === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Test Name Cannot be blank.",
    });

    document.querySelector("[name='description']").focus();
    return isError;
  } else if ($this.state.services_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Service Cannot be blank.",
    });

    // document.querySelector("[name='services_id']").focus();
    return isError;
  } else if ($this.state.investigation_type === "L") {
    if ($this.state.specimen_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Specimen Cannot be blank.",
      });
      document.querySelector("[name='specimen_id']").focus();
      return isError;
    } else if ($this.state.container_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Container Cannot be blank.",
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
        title: "Atleast One Analytes to be add.",
      });

      return isError;
    } else if ($this.state.category_id === null) {
      isError = true;
      swalMessage({
        type: "error",
        title: "Category Cannot be blank.",
      });
      document.querySelector("[name='category_id']").focus();
      return isError;
    } else {
      return isError;
    }
  } else if ($this.state.investigation_type === "R") {
    if ($this.state.RadTemplate.length <= 0) {
      isError = true;
      swalMessage({
        type: "error",
        title: "At Least One Template to be added.",
      });

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
  // console.log($this.state, "from insert lab");

  if (!err) {
    //
    if ($this.state.draging_done === true) {
      $this.state.analytes = $this.state.drag_analytes;
    } else {
      $this.state.analytes = $this.state.analytes.map((item, index) => {
        return { ...item, display_order: index };
      });
    }
    if ($this.state.hims_d_investigation_test_id === null) {
      algaehApiCall({
        uri: "/investigation/addInvestigationTest",
        module: "laboratory",
        data: $this.state,
        onSuccess: (response) => {
          console.log("from add", response.data);
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Saved successfully . .",
            });
            let IOputs = InvestigationIOputs.inputParam();
            $this.setState({ ...$this.state, ...IOputs }, () => {
              $this.props.onClose && $this.props.onClose(true);
            });
          }
        },
      });
    } else {
      algaehApiCall({
        uri: "/investigation/updateInvestigationTest",
        module: "laboratory",
        data: $this.state,
        method: "PUT",
        onSuccess: (response) => {
          console.log("from update", response.data);
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Updated successfully . .",
            });
            let IOputs = InvestigationIOputs.inputParam();
            $this.setState({ ...$this.state, ...IOputs }, () => {
              $this.props.onClose && $this.props.onClose(true);
            });
          }
        },
      });
    }
  }
};

const CptCodesSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Services.CptCodes,
    },
    searchName: "CptCodes",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        cpt_id: row.hims_d_cpt_code_id,
        cpt_code_data: row.cpt_code,
      });
    },
  });
};
const ServiceTypeSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: [
        { fieldName: "service_code", label: "Service Code" },
        { fieldName: "service_name", label: "Service Name" },
      ],
    },
    searchName: "serviceTypes",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        services_id: row.hims_d_services_id,
        service_name: row.service_name,
      });
    },
  });
};
export { texthandle, InsertLabTest, CptCodesSearch, ServiceTypeSearch };
