import { swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import { SetBulkState } from "../../../../utils/GlobalFunctions";

const additionaleInfo = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value
    });
  }
};

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const uomtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    uom_description: e.selected.uom_description
  });
};

const stockingtexthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let conversion_factor = 0;
  let convertEnable = false;
  if (value === "Y") {
    conversion_factor = 1;
    convertEnable = true;
  }

  $this.setState({
    [name]: value,
    conversion_factor: conversion_factor,
    convertEnable: convertEnable
  });
};

const AddUom = ($this, context) => {
  let isError = false;

  let stocking_uom_id = null;
  if ($this.state.uom_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Please Select UOM."
    });

    return isError;
  } else if ($this.state.conversion_factor === 0) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Define Conversion Factor."
    });
    return isError;
  } else if ($this.state.stocking_uom === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Enter Stocking Uom."
    });

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
            if (context !== undefined) {
              context.updateState({
                detail_item_uom: detail_item_uom,
                uom_description: $this.state.uom_description,
                insertItemUomMap: insertItemUomMap,
                stocking_uom_id: stocking_uom_id,
                uom_id: null,
                stocking_uom: null,
                conversion_factor: null,
                ...$this.state
              });
            }
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

const updateUOM = ($this, context, row) => {
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

  if (context !== undefined) {
    context.updateState({
      detail_item_uom: detail_item_uom,
      updateUomMapResult: updateUomMapResult
    });
  }
};

const deleteUOM = ($this, context, row, rowId) => {
  if (row.hims_m_item_uom_id !== undefined) {
    let detail_item_uom = $this.state.detail_item_uom;
    let updateUomMapResult = $this.state.updateUomMapResult;
    let insertItemUomMap = $this.state.insertItemUomMap;
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
      insertItemUomMap: insertItemUomMap
    });

    if (context !== undefined) {
      context.updateState({
        detail_item_uom: detail_item_uom,
        updateUomMapResult: updateUomMapResult,
        insertItemUomMap: insertItemUomMap
      });
    }
  }
};

const stockonchangegridcol = ($this, context, row, e) => {
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

    if (context !== undefined) {
      context.updateState({
        detail_item_uom: detail_item_uom
      });
    }
  }
};

const onchangegridcol = ($this, context, row, e) => {
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

  if (context !== undefined) {
    context.updateState({
      detail_item_uom: detail_item_uom
    });
  }
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
  additionaleInfo
};
