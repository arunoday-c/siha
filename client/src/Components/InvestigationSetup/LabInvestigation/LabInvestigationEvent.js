import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
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

const containeridhandle = ($this, context, ctrl, e) => {
  debugger;
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
  debugger;
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
  debugger;
  if ($this.state.analyte_id !== null) {
    let insert_analytes = $this.state.insert_analytes;
    let analytes = $this.state.analytes;
    let obj = {
      analyte_id: $this.state.analyte_id,
      analyte_type: $this.state.analyte_type,
      result_unit: $this.state.result_unit
    };

    if ($this.state.hims_d_investigation_test_id !== null) {
      let Insertobj = {
        analyte_id: $this.state.analyte_id,
        test_id: $this.state.hims_d_investigation_test_id
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
      message: "Invalid Input. Please select analyte to add.",
      title: "Warning",
      icon: "warning"
    });
  }
};

const updateLabInvestigation = $this => {
  successfulMessage({
    message: "Invalid Input. No Option to edit.",
    title: "Warning",
    icon: "warning"
  });
};

const deleteLabInvestigation = ($this, context, row, rowId) => {
  debugger;

  let analytes = $this.state.analytes;
  let update_analytes = $this.state.update_analytes;
  if ($this.state.hims_d_investigation_test_id !== null) {
    let Updateobj = {
      hims_m_lab_analyte_id: row.analyte_id,
      test_id: $this.state.hims_d_investigation_test_id,
      record_status: "I"
    };
    update_analytes.push(Updateobj);
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
export {
  texthandle,
  analyteidhandle,
  containeridhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabInvestigation
};
