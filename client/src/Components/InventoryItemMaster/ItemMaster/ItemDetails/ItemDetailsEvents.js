import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { SetBulkState } from "../../../../utils/GlobalFunctions";
import { swalMessage } from "../../../../utils/algaehApiCall";

//let texthandlerInterval = null;

const texthandle = ($this, context, ctrl, e) => {
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

const BatchExpRequired = ($this, context) => {
  SetBulkState({
    state: $this,
    callback: () => {
      let exp_date_required = "N";
      if (!$this.state.batchexpreq === true) {
        exp_date_required = "Y";
      }
      $this.setState({
        exp_date_required: exp_date_required,
        batchexpreq: !$this.state.batchexpreq,
        ...$this.state
      });

      if (context !== undefined) {
        context.updateState({
          exp_date_required: exp_date_required,
          ...$this.state
        });
      }
    }
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
  let name = e.target.name;
  SetBulkState({
    state: $this,
    callback: () => {
      let Value = "N";

      if ($this.state.Applicable === true) {
        Value = "N";
      } else if ($this.state.Applicable === false) {
        Value = "Y";
      }
      $this.setState({
        [name]: Value,
        vat_percent: 0,
        ...$this.state
      });

      // $this.state.
      if (context !== undefined) {
        context.updateState({
          [name]: Value,
          vat_percent: 0,
          ...$this.state
        });
      }
    }
  });
};

const numberEventHandaler = ($this, context, e) => {
  SetBulkState({
    state: $this,
    callback: () => {
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

        if (context !== undefined) {
          context.updateState({
            [name]: value
          });
        }
      }
    }
  });
};

export {
  texthandle,
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable,
  numberEventHandaler
};
