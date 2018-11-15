import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
//let texthandlerInterval = null;

const texthandle = ($this, context, ctrl, e) => {
  debugger;
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

const radioChange = ($this, context, e) => {
  let radioActive = true;
  let radioInactive = false;
  let item_status = "A";
  if (e.target.value === "Active") {
    radioActive = true;
    radioInactive = false;
    item_status = "A";
  } else if (e.target.value === "Inactive") {
    radioActive = false;
    radioInactive = true;
    item_status = "I";
  }
  $this.setState({
    [e.target.name]: e.target.value,
    radioInactive: radioInactive,
    radioActive: radioActive,
    item_status: item_status
  });

  if (context !== undefined) {
    context.updateState({
      radioInactive: radioInactive,
      radioActive: radioActive,
      item_status: item_status
    });
  }
};

const BatchExpRequired = ($this, e) => {
  let required_batchno_expiry = "N";
  if (!$this.state.batchexpreq === true) {
    required_batchno_expiry = "Y";
  }
  $this.setState({
    required_batchno_expiry: required_batchno_expiry,
    batchexpreq: !$this.state.batchexpreq
  });
};

const CptCodesSearch = ($this, context) => {
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
      if (context !== undefined) {
        context.updateState({
          cpt_code: row.hims_d_cpt_code_id,
          cpt_code_data: row.cpt_code
        });
      }
    }
  });
};

const VatAppilicable = ($this, context, e) => {
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

  if (context !== undefined) {
    context.updateState({
      [e.target.name]: Value,
      Applicable: Applicable,
      vat_percent: 0
    });
  }
};

export {
  texthandle,
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable
};
