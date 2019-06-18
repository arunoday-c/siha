import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import _ from "lodash";

const radioChange = ($this, e) => {
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
};

const BatchExpRequired = $this => {
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
    }
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
      $this.setState({
        cpt_code: row.hims_d_cpt_code_id,
        cpt_code_data: row.cpt_code
      });
    }
  });
};

const VatAppilicable = ($this, e) => {
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
    }
  });
};
const texthandle = ($this, ctrl, e) => {
  debugger;
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const additionaleInfo = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const uomtexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    uom_description: e.selected.uom_description
  });
};

const stockingtexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let conversion_factor = 0;
  let convertEnable = false;
  if (value === "Y") {
    conversion_factor = 1;
    convertEnable = true;
  }

  $this.setState(
    {
      [name]: value,
      conversion_factor: conversion_factor,
      convertEnable: convertEnable
    },
    () => {}
  );
};

const AddUom = $this => {
  let isError = false;

  let stocking_uom_id = null;
  debugger;
  if ($this.state.uom_id === null || $this.state.uom_id === "") {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Please Select UOM."
    });
    document.querySelector("[name='uom_id']").focus();
    return isError;
  } else if (
    $this.state.stocking_uom === null ||
    $this.state.stocking_uom === ""
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Enter Stocking Uom."
    });
    document.querySelector("[name='stocking_uom']").focus();

    return isError;
  } else if (parseFloat($this.state.conversion_factor) === 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Define Conversion Factor."
    });
    document.querySelector("[name='conversion_factor']").focus();
    return isError;
  } else {
    let detail_item_uom = $this.state.detail_item_uom;
    let insertItemUomMap = $this.state.insertItemUomMap;

    let uomExists = Enumerable.from(
      detail_item_uom.length !== 0 ? detail_item_uom : null
    )
      .where(w => w.uom_id === $this.state.uom_id)
      .toArray();

    if (uomExists.length === 0) {
      let StockingExit = Enumerable.from(
        detail_item_uom.length !== 0 ? detail_item_uom : null
      )
        .where(w => w.stocking_uom === "Y")
        .toArray();

      if (
        StockingExit.length === 0 ||
        (StockingExit.length !== 0 && $this.state.stocking_uom === "N")
      ) {
        SetBulkState({
          state: $this,
          callback: () => {
            if ($this.state.stocking_uom === "Y") {
              stocking_uom_id = $this.state.uom_id;
            } else {
              stocking_uom_id = $this.state.stocking_uom_id;
            }
            if ($this.state.hims_d_item_master_id !== null) {
              let Insertobj = {
                item_master_id: $this.state.hims_d_item_master_id,
                uom_id: $this.state.uom_id,
                stocking_uom: $this.state.stocking_uom,
                conversion_factor: $this.state.conversion_factor,
                uom_description: $this.state.uom_description,
                uom_status: "A"
              };
              insertItemUomMap.push(Insertobj);
            }

            let uomObj = {
              uom_id: $this.state.uom_id,
              conversion_factor: $this.state.conversion_factor,
              stocking_uom: $this.state.stocking_uom,
              uom_description: $this.state.uom_description
            };
            detail_item_uom.push(uomObj);
            $this.setState({
              detail_item_uom: detail_item_uom,
              insertItemUomMap: insertItemUomMap,
              uom_id: null,
              stocking_uom: null,
              conversion_factor: null,
              stocking_uom_id: stocking_uom_id,
              convertEnable: false
            });

            $this.state.stocking_uom_id = stocking_uom_id;
          }
        });
      } else {
        isError = true;
        swalMessage({
          type: "warning",
          title: "Only one should be stocking UOM"
        });

        return isError;
      }
    } else {
      isError = true;
      swalMessage({
        type: "warning",
        title: "Selected UOM Already exists"
      });

      return isError;
    }
  }
};

const updateUOM = ($this, row) => {
  let detail_item_uom = $this.state.detail_item_uom;
  let updateUomMapResult = $this.state.updateUomMapResult;

  if ($this.state.hims_d_item_master_id !== null) {
    if (row.hims_m_item_uom_id !== undefined) {
      let Updateobj = {
        hims_m_item_uom_id: row.hims_m_item_uom_id,
        item_master_id: row.hims_d_item_master_id,
        uom_id: row.uom_id,
        stocking_uom: row.stocking_uom,
        conversion_factor: row.conversion_factor,
        record_status: "A"
      };

      updateUomMapResult.push(Updateobj);
    } else {
      let Updateobj = {
        hims_m_item_uom_id: row.hims_m_item_uom_id,
        item_master_id: row.hims_d_item_master_id,
        uom_id: row.uom_id,
        stocking_uom: row.stocking_uom,
        conversion_factor: row.conversion_factor,
        record_status: "A"
      };

      for (let j = 0; j < updateUomMapResult.length; j++) {
        if (updateUomMapResult[j].uom_id === row.uom_id) {
          updateUomMapResult.splice(j, 1);
        }
      }
      updateUomMapResult.push(Updateobj);
    }
  }

  for (let l = 0; l < detail_item_uom.length; l++) {
    if (detail_item_uom[l].uom_id === row.uom_id) {
      detail_item_uom[l] = row;
    }
  }

  $this.setState({
    detail_item_uom: detail_item_uom,
    updateUomMapResult: updateUomMapResult
  });
};

const deleteUOM = ($this, row, rowId) => {
  let detail_item_uom = $this.state.detail_item_uom;
  let updateUomMapResult = $this.state.updateUomMapResult;
  let insertItemUomMap = $this.state.insertItemUomMap;
  let stocking_uom_id = $this.state.stocking_uom_id;
  const stocking_Uom = _.filter(detail_item_uom, f => {
    return f.stocking_uom == "Y";
  });

  if (stocking_Uom !== undefined && stocking_Uom.length > 0) {
    stocking_uom_id = null;
  }

  if ($this.state.hims_d_item_master_id !== null) {
    if (row.hims_m_item_uom_id !== undefined) {
      let Updateobj = {
        hims_m_item_uom_id: row.hims_m_item_uom_id,
        item_master_id: row.hims_d_item_master_id,
        uom_id: row.uom_id,
        stocking_uom: row.stocking_uom,
        conversion_factor: row.conversion_factor,
        record_status: "I"
      };
      updateUomMapResult.push(Updateobj);
    } else {
      for (let k = 0; k < insertItemUomMap.length; k++) {
        if (insertItemUomMap[k].uom_id === row.uom_id) {
          insertItemUomMap.splice(k, 1);
        }
      }
    }
  }

  for (let x = 0; x < detail_item_uom.length; x++) {
    if (detail_item_uom[x].uom_id === row.uom_id) {
      detail_item_uom.splice(x, 1);
    }
  }

  $this.setState({
    detail_item_uom: detail_item_uom,
    updateUomMapResult: updateUomMapResult,
    insertItemUomMap: insertItemUomMap,
    stocking_uom_id: stocking_uom_id
  });
};

const stockonchangegridcol = ($this, row, e) => {
  let StockingUnit = "N";
  let detail_item_uom = $this.state.detail_item_uom;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  for (let x = 0; x < detail_item_uom.length; x++) {
    if (detail_item_uom[x].stocking_uom === row.stocking_uom) {
      StockingUnit = "Y";
    }
  }

  if (StockingUnit === "N" && value === "N") {
    let conversion_factor = row["conversion_factor"];
    if (value === "Y") {
      conversion_factor = 1;
    }
    row[name] = value;
    row["conversion_factor"] = conversion_factor;

    for (let x = 0; x < detail_item_uom.length; x++) {
      if (detail_item_uom[x].uom_id === row.uom_id) {
        detail_item_uom[x] = row;
      }
    }

    $this.setState({ detail_item_uom: detail_item_uom });
  }
};

const onchangegridcol = ($this, row, e) => {
  let detail_item_uom = $this.state.detail_item_uom;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let conversion_factor = row["conversion_factor"];
  if (value === "Y") {
    conversion_factor = 1;
  }
  row[name] = value;
  row[conversion_factor] = conversion_factor;

  for (let x = 0; x < detail_item_uom.length; x++) {
    if (detail_item_uom[x].uom_id === row.uom_id) {
      detail_item_uom[x] = row;
    }
  }

  $this.setState({ detail_item_uom: detail_item_uom });
};

const numberEventHandaler = ($this, ctrl, e) => {
  debugger;
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  SetBulkState({
    state: $this,
    callback: () => {
      if (value < 0) {
        swalMessage({
          type: "warning",
          title: "Cannot be less than zero."
        });
        $this.setState({
          [name]: 0
        });
      } else {
        $this.setState({
          [name]: value
        });
      }
    }
  });
};

export {
  texthandle,
  AddUom,
  deleteUOM,
  updateUOM,
  onchangegridcol,
  uomtexthandle,
  stockingtexthandle,
  stockonchangegridcol,
  additionaleInfo,
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable,
  numberEventHandaler
};
