import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const texthandle = ($this, e) => {
  // e = e || ctrl;
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

  AlgaehValidation({
    querySelector: "data-validate='HospitalServices'", //if require section level
    fetchFromFile: true, //if required arabic error
    alertTypeIcon: "warning", // error icon
    onCatch: () => {
      isError = true;
    }
  });

  if (
    $this.state.vat_applicable === "Y" &&
    isError === false &&
    ($this.state.vat_percent === 0 || $this.state.vat_percent === "")
  ) {
    isError = true;
    swalMessage({
      title: "Vat Percentage is mandatory , if Vat Applicable",
      type: "warning"
    });
  }
  return isError;
};

const InsertServices = $this => {
  const err = Validations($this);

  if (!err) {
    if ($this.FIN_Active) {
      if (
        $this.state.selected_gl_account === null ||
        $this.state.selected_gl_account === undefined
      ) {
        swalMessage({
          title: "Please Select G/L Account",
          type: "warning"
        });
        return;
      }
    }
    let inputObj = $this.state;

    let gl_selected_account =
      $this.state.selected_gl_account !== null
        ? $this.state.selected_gl_account.split("-")
        : [];

    inputObj.child_id =
      gl_selected_account.length > 0 ? gl_selected_account[1] : undefined;
    inputObj.head_id =
      gl_selected_account.length > 0 ? gl_selected_account[0] : undefined;

    if ($this.state.hims_d_services_id === null) {
      algaehApiCall({
        uri: "/serviceType/addServices",
        module: "masterSettings",
        data: inputObj,
        onSuccess: response => {
          if (response.data.success === true) {
            clearData($this);
            $this.props.onClose && $this.props.onClose(true);
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
        module: "masterSettings",
        data: inputObj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Updated successfully . .",
              type: "success"
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
        cpt_code: row.hims_d_cpt_code_id,
        cpt_code_data: row.cpt_code
      });
    }
  });
};

const clearData = $this => {
  $this.cashPatientMap = {};
  $this.insurancePatientMap = {};
  $this.setState({
    open: false,

    selectedLang: "en",
    Applicable: false,

    hims_d_services_id: null,
    service_code: null,
    cpt_code: null,
    service_name: null,
    hospital_id: null,
    service_type_id: null,

    standard_fee: 0,
    vat_applicable: "N",
    vat_percent: 0,
    cpt_code_data: null,
    sub_department_id: null,
    cashPatientAccount: "",
    insurancePatientAccount: "",
    head_id: null,
    child_id: null,
    insurance_head_id: null,
    insurance_child_id: null
  });
};

const numberEventHandaler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      type: "warning",
      title: "Vat % cannot be less than zero."
    });
    $this.setState({
      [name]: 0
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

const PhyThryAppilicable = ($this, e) => {
  let PhyService = false;
  let Value = "N";

  if ($this.state.PhyService === true) {
    PhyService = false;
    Value = "N";
  } else if ($this.state.PhyService === false) {
    PhyService = true;
    Value = "Y";
  }
  $this.setState({
    [e.target.name]: Value,
    PhyService: PhyService
  });
};

const getFinanceHeaders = ($this, head_id) => {
  algaehApiCall({
    uri: "/finance/getAccountHeadsForDropdown",
    data: { finance_account_head_id: head_id },
    method: "GET",
    module: "finance",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          finance_account: response.data.result
        });
      }
    }
  });
};

export {
  texthandle,
  VatAppilicable,
  InsertServices,
  clearData,
  CptCodesSearch,
  numberEventHandaler,
  PhyThryAppilicable,
  getFinanceHeaders
};
