const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const AddUom = ($this, context) => {
  debugger;
  let isError = false;
  if ($this.state.uom_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else if ($this.state.conversion_factor === 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else if ($this.state.stocking_uom === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else {
    let detail_item_uom = $this.state.detail_item_uom;
    let insertItemUomMap = $this.state.insertItemUomMap;

    if ($this.state.hims_d_item_master_id !== null) {
      let Insertobj = {
        item_master_id: $this.state.hims_d_item_master_id,
        uom_id: $this.state.uom_id,
        stocking_uom: $this.state.stocking_uom,
        conversion_factor: $this.state.conversion_factor,
        uom_status: "A"
      };
      insertItemUomMap.push(Insertobj);
    }

    let uomObj = {
      uom_id: $this.state.uom_id,
      conversion_factor: $this.state.conversion_factor,
      stocking_uom: $this.state.stocking_uom
    };
    detail_item_uom.push(uomObj);
    $this.setState({
      detail_item_uom: detail_item_uom,
      insertItemUomMap: insertItemUomMap,
      uom_id: null,
      stocking_uom: null,
      conversion_factor: null
    });

    if (context !== undefined) {
      context.updateState({
        detail_item_uom: detail_item_uom,
        insertItemUomMap: insertItemUomMap,
        uom_id: null,
        stocking_uom: null,
        conversion_factor: null
      });
    }
  }
};

const updateUOM = ($this, context, row) => {
  debugger;
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
        if (updateUomMapResult[j].analyte_id === row.analyte_id) {
          updateUomMapResult.splice(j, 1);
        }
      }
      updateUomMapResult.push(Updateobj);
    }
  }
  debugger;
  for (let l = 0; l < detail_item_uom.length; l++) {
    if (detail_item_uom[l].analyte_id === row.analyte_id) {
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
        if (insertItemUomMap[k].analyte_id === row.analyte_id) {
          insertItemUomMap.splice(k, 1);
        }
      }
    }
  }
  detail_item_uom.splice(rowId, 1);
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
};

export { texthandle, AddUom, deleteUOM, updateUOM };
