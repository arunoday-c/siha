import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { SetBulkState } from "../../../../utils/GlobalFunctions";
import { swalMessage } from "../../../../utils/algaehApiCall";

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
      let required_batchno_expiry = "N";
      if (!$this.state.batchexpreq === true) {
        required_batchno_expiry = "Y";
      }
      $this.setState({
        required_batchno_expiry: required_batchno_expiry,
        batchexpreq: !$this.state.batchexpreq,
        ...$this.state
      });

      if (context !== undefined) {
        context.updateState({
          required_batchno_expiry: required_batchno_expiry,
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
  let value = e.target.value;
  SetBulkState({
    state: $this,
    callback: () => {
      $this.setState({
        [name]: value,
        vat_percent: 0,
        ...$this.state
      });

      // $this.state.
      if (context !== undefined) {
        context.updateState({
          [name]: value,
          vat_percent: 0,
          ...$this.state
        });
      }
    }
  });
};
const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const numberEventHandaler = ($this, context, e) => {
  debugger;
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
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable,
  texthandle,
  numberEventHandaler
};
