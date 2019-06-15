import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value
    });
  }
};

const containeridhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    container_code: e.selected.container_id
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value,
      container_code: e.selected.container_id
    });
  }
};

const analyteidhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    analyte_type: e.selected.analyte_type,
    result_unit: e.selected.result_unit
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value,
      analyte_type: e.selected.analyte_type,
      result_unit: e.selected.result_unit
    });
  }
};

const AddAnalytes = ($this, context) => {
  if ($this.state.analyte_id !== null) {
    let insert_analytes = $this.state.insert_analytes;
    let analytes = $this.state.analytes;
    let obj = {
      analyte_id: $this.state.analyte_id,
      analyte_type: $this.state.analyte_type,
      result_unit: $this.state.result_unit,
      critical_low: $this.state.critical_low,
      critical_high: $this.state.critical_high,
      normal_low: $this.state.normal_low,
      normal_high: $this.state.normal_high
    };

    if ($this.state.hims_d_investigation_test_id !== null) {
      let Insertobj = {
        analyte_id: $this.state.analyte_id,
        analyte_type: $this.state.analyte_type,
        result_unit: $this.state.result_unit,
        test_id: $this.state.hims_d_investigation_test_id,
        critical_low: $this.state.critical_low,
        critical_high: $this.state.critical_high,
        normal_low: $this.state.normal_low,
        normal_high: $this.state.normal_high
      };
      insert_analytes.push(Insertobj);
    }

    analytes.push(obj);
    $this.setState({
      analytes: analytes,
      insert_analytes: insert_analytes,
      analyte_id: null
    });
    if (context !== undefined) {
      context.updateState({
        analytes: analytes,
        insert_analytes: insert_analytes,
        analyte_id: null
      });
    }
  } else {
    successfulMessage({
      message: "Please select analyte to add.",
      title: "Warning",
      icon: "warning"
    });
  }
};

const updateLabInvestigation = ($this, context, row) => {
  let analytes = $this.state.analytes;
  let update_analytes = $this.state.update_analytes;

  if ($this.state.hims_d_investigation_test_id !== null) {
    if (row.hims_m_lab_analyte_id !== undefined) {
      let Updateobj = {
        hims_m_lab_analyte_id: row.hims_m_lab_analyte_id,
        critical_low: row.critical_low,
        critical_high: row.critical_high,
        normal_low: row.normal_low,
        normal_high: row.normal_high,
        record_status: "A"
      };

      update_analytes.push(Updateobj);
    } else {
      let Updateobj = {
        hims_m_lab_analyte_id: row.hims_m_lab_analyte_id,
        critical_low: row.critical_low,
        critical_high: row.critical_high,
        normal_low: row.normal_low,
        normal_high: row.normal_high,
        record_status: "A"
      };

      for (let j = 0; j < update_analytes.length; j++) {
        if (update_analytes[j].analyte_id === row.analyte_id) {
          update_analytes.splice(j, 1);
        }
      }
      update_analytes.push(Updateobj);
    }
  }

  for (let l = 0; l < analytes.length; l++) {
    if (analytes[l].analyte_id === row.analyte_id) {
      analytes[l] = row;
    }
  }
  // analytes.splice(rowId, 1);
  $this.setState({
    analytes: analytes,
    update_analytes: update_analytes
  });

  if (context !== undefined) {
    context.updateState({
      analytes: analytes,
      update_analytes: update_analytes
    });
  }
};

const deleteLabInvestigation = ($this, context, row, rowId) => {
  let analytes = $this.state.analytes;
  let update_analytes = $this.state.update_analytes;
  let insert_analytes = $this.state.insert_analytes;
  if ($this.state.hims_d_investigation_test_id !== null) {
    if (row.hims_m_lab_analyte_id !== undefined) {
      let Updateobj = {
        hims_m_lab_analyte_id: row.hims_m_lab_analyte_id,
        critical_low: row.critical_low,
        critical_high: row.critical_high,
        normal_low: row.normal_low,
        normal_high: row.normal_high,
        record_status: "I"
      };
      update_analytes.push(Updateobj);
    } else {
      for (let k = 0; k < insert_analytes.length; k++) {
        if (insert_analytes[k].analyte_id === row.analyte_id) {
          insert_analytes.splice(k, 1);
        }
      }
      // insert_analytes
    }
  }
  analytes.splice(rowId, 1);
  $this.setState({
    analytes: analytes,
    update_analytes: update_analytes
  });

  if (context !== undefined) {
    context.updateState({
      analytes: analytes,
      update_analytes: update_analytes
    });
  }
};

const onchangegridcol = ($this, row, e) => {
  let analytes = $this.state.analytes;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;

  for (let x = 0; x < analytes.length; x++) {
    if (analytes[x].analyte_id === row.analyte_id) {
      analytes[x] = row;
    }
  }
  $this.setState({ analytes: analytes });
};
export {
  texthandle,
  analyteidhandle,
  containeridhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabInvestigation,
  onchangegridcol
};
