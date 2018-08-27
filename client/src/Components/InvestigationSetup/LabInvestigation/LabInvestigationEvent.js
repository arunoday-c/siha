import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, context, ctrl, e) => {
  debugger;
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

const AddAnalytes = ($this, context) => {
  debugger;
  if ($this.state.analyte_id !== null) {
    let insertanalytes = $this.state.insertanalytes;
    let analytes = $this.state.analytes;
    let obj = { analyte_id: $this.state.analyte_id };

    if ($this.state.hims_d_investigation_test_id !== null) {
      let Insertobj = {
        analyte_id: $this.state.analyte_id,
        test_id: $this.state.hims_d_investigation_test_id
      };
      insertanalytes.push(Insertobj);
    }

    analytes.push(obj);
    $this.setState({
      analytes: analytes,
      insertanalytes: insertanalytes,
      analyte_id: null
    });
    if (context !== undefined) {
      context.updateState({
        analytes: analytes,
        insertanalytes: insertanalytes,
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
  let updateanalytes = $this.state.updateanalytes;
  if ($this.state.hims_d_investigation_test_id !== null) {
    let Updateobj = {
      analyte_id: $this.state.analyte_id,
      test_id: $this.state.hims_d_investigation_test_id,
      record_status: "I"
    };
    updateanalytes.push(Updateobj);
  }
  analytes.splice(rowId, 1);
  $this.setState({
    analytes: analytes,
    updateanalytes: updateanalytes
  });

  if (context !== undefined) {
    context.updateState({
      analytes: analytes,
      updateanalytes: updateanalytes
    });
  }
};
export {
  texthandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabInvestigation
};
