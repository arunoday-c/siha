import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const VatAppilicable = ($this, e) => {
  let Applicable = false;
  let Value = "N";

  if ($this.state.Applicable === true) {
    Applicable = false;
    Value = "N";
  } else if ($this.state.Applicable === false) {
    Applicable = true;
    Value = "Y";
  }
  $this.setState({
    [e.target.name]: Value,
    Applicable: Applicable,
    vat_percent: 0
  });
};

const Validations = $this => {
  let isError = false;

  if ($this.state.description === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Test Name Cannot be blank."
    });
    document.querySelector("[name='description']").focus();
    return isError;
  }

  if ($this.state.services_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Service Cannot be blank."
    });
    return isError;
  }
};

const InsertServices = $this => {
  const err = Validations($this);

  if (!err) {
    if ($this.state.hims_d_services_id === null) {
      algaehApiCall({
        uri: "/serviceType/addServices",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Saved successfully . .",
              type: "success"
            });
          }
        }
      });
    } else {
      algaehApiCall({
        uri: "/serviceType/updateServices",
        data: $this.state,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Updated successfully . .",
              type: "success"
            });
          }
        }
      });
    }
  }
};

const clearData = $this => {
  $this.setState({
    open: false,
    MandatoryMsg: "",
    selectedLang: "en",
    Applicable: false,

    hims_d_services_id: null,
    service_code: null,
    cpt_code: null,
    service_name: null,
    hospital_id: null,
    service_type_id: null,

    standard_fee: 0,
    vat_applicable: null,
    vat_percent: 0
  });
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
      debugger;
      $this.setState({
        cpt_code: row.hims_d_cpt_code_id,
        cpt_code_data: row.cpt_code
      });
    }
  });
};

export {
  texthandle,
  VatAppilicable,
  InsertServices,
  clearData,
  CptCodesSearch
};
