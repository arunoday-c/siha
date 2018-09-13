import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  debugger;

  $this.setState({
    [name]: value
  });
};

const UpdateLabOrder = ($this, value, status) => {
  debugger;
  algaehApiCall({
    uri: "/laboratory/updateLabResultEntry",
    data: value,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        swal("Done successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
        debugger;
        for (let k = 0; k < value.length; k++) {
          if (value[k].run_type !== null && value[k].run_type !== undefined) {
            value.splice(k, 1);
          }
        }
        $this.setState({ test_analytes: value, status: status });
      }
    },
    onFailure: error => {
      swal(error, {
        icon: "success",
        buttons: false,
        timer: 2000
      });
    }
  });
};

const onvalidate = $this => {
  debugger;
  let test_analytes = $this.state.test_analytes;
  let success = true;
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].confirm === "N") {
      swal("Invalid Input. Please confirm the result", {
        icon: "warning",
        buttons: false,
        timer: 2000
      });
      success = false;
    } else {
      test_analytes[k].status = "V";
      test_analytes[k].validate = "Y";
    }
  }
  if (success === true) {
    swal({
      title: "Are you sure want to Validate",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willProceed => {
      if (willProceed) {
        test_analytes.push({ run_type: $this.state.run_type });
        UpdateLabOrder($this, test_analytes, "V");
      }
    });
  }
};

const getAnalytes = $this => {
  $this.props.getTestAnalytes({
    uri: "/laboratory/getTestAnalytes",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    redux: {
      type: "TEST_ANALYTES_GET_DATA",
      mappingName: "testanalytes"
    },
    afterSuccess: data => {
      debugger;
      for (let i = 0; i < data.length; i++) {
        data[i].hims_f_lab_order_id = $this.state.hims_f_lab_order_id;
        if (data[i].status === "E" || data[i].status === "N") {
          data[i].validate = "N";
          data[i].confirm = "N";
        } else if (data[i].status === "C") {
          data[i].validate = "N";
          data[i].confirm = "Y";
        } else if (data[i].status === "V") {
          data[i].validate = "Y";
          data[i].confirm = "Y";
        }
      }
      $this.setState({ test_analytes: data });
    }
  });
};

const confirmedgridcol = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;
  if (row.result === null && value === "Y") {
    swal("Invalid Input. Please enter the result", {
      icon: "warning",
      buttons: false,
      timer: 2000
    });
  } else {
    if (row.validate === "Y" && value === "N") {
      row["validate"] = "N";
    }

    row[name] = value;
    // row["status"] = "C";
    for (let l = 0; l < test_analytes.length; l++) {
      if (
        test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        test_analytes[l] = row;
      }
    }
    $this.setState({ test_analytes: test_analytes });
  }
};

const onchangegridcol = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;

  if (name === "validate") {
    if (row.confirm === "N" && value === "Y") {
      swal(
        "Invalid Input. Without confirming cannot validate, please confirm",
        {
          icon: "warning",
          buttons: false,
          timer: 2000
        }
      );
    } else {
      // row["status"] = "V";
      row[name] = value;
      for (let l = 0; l < test_analytes.length; l++) {
        if (
          test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
        ) {
          test_analytes[l] = row;
        }
      }
      $this.setState({ test_analytes: test_analytes });
    }
  } else {
    row[name] = value;
    for (let l = 0; l < test_analytes.length; l++) {
      if (
        test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        test_analytes[l] = row;
      }
    }
    $this.setState({ test_analytes: test_analytes });
  }
};

const resultEntryUpdate = $this => {
  debugger;
  let test_analytes = $this.state.test_analytes;
  let enterResult = true;
  let enterRemarks = true;
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result !== null) {
      if (
        test_analytes[k].remarks === null &&
        test_analytes[k].amended === "Y"
      ) {
        enterRemarks = false;
      } else {
        test_analytes[k].status = "E";
        if (test_analytes[k].confirm !== "N") {
          test_analytes[k].status = "C";
        }

        if (test_analytes[k].validate !== "N") {
          test_analytes[k].status = "V";
        }
      }
    } else {
      enterResult = false;
    }
  }
  if (enterResult === true && enterRemarks === true) {
    test_analytes.push({ run_type: $this.state.run_type });
    UpdateLabOrder($this, test_analytes, "E");
  } else {
    if (enterResult === false) {
      swal("Invalid Input. Please enter input.", {
        icon: "warning",
        buttons: false,
        timer: 2000
      });
    } else if (enterRemarks === false) {
      swal("Invalid Input. Please enter Remarks for Ammended.", {
        icon: "warning",
        buttons: false,
        timer: 2000
      });
    }
  }
};

const onconfirm = $this => {
  debugger;
  let test_analytes = $this.state.test_analytes;
  let success = true;
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result === null) {
      swal("Invalid Input. Please enter the result", {
        icon: "warning",
        buttons: false,
        timer: 2000
      });
      success = false;
    } else {
      test_analytes[k].status = "C";
      test_analytes[k].confirm = "Y";
    }
  }
  if (success === true) {
    swal({
      title: "Are you sure want to Confirm",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willProceed => {
      if (willProceed) {
        test_analytes.push({ run_type: $this.state.run_type });
        UpdateLabOrder($this, test_analytes, "CF");
      }
    });
  }
};

const onReRun = $this => {
  debugger;
  let test_analytes = $this.state.test_analytes;
  let success = true;
  let runtype = [];
  for (let k = 0; k < test_analytes.length; k++) {
    if ($this.state.run_type === "N") {
      test_analytes[k].run1 = test_analytes[k].result;
      runtype = { run_type: "1" };
    } else if ($this.state.run_type === "1") {
      test_analytes[k].run2 = test_analytes[k].result;
      runtype = { run_type: "1" };
    } else if ($this.state.run_type === "2") {
      test_analytes[k].run3 = test_analytes[k].result;
      runtype = { run_type: "1" };
    }

    test_analytes[k].result = null;
    test_analytes[k].confirm = "N";
    test_analytes[k].validate = "N";
    test_analytes[k].status = "N";
  }
  test_analytes.push(runtype);

  if (success === true) {
    swal({
      title: "Are you sure want to Re-Run",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willProceed => {
      if (willProceed) {
        UpdateLabOrder($this, test_analytes, "N");
      }
    });
  }
};

const onchangegridresult = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;

  row[name] = value;
  for (let l = 0; l < test_analytes.length; l++) {
    if (
      test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    ) {
      if (row.result >= row.normal_low && row.result <= row.normal_high) {
        row["critical_type"] = "N";
      } else if (row.result <= row.critical_low && row.critical_low !== 0) {
        row["critical_type"] = "CL";
      } else if (row.result < row.normal_low && row.result > row.critical_low) {
        row["critical_type"] = "L";
      } else if (row.result >= row.critical_high) {
        row["critical_type"] = "CH";
      } else if (
        row.result > row.normal_high &&
        row.result < row.critical_high
      ) {
        row["critical_type"] = "H";
      }

      test_analytes[l] = row;
    }
  }
  $this.setState({ test_analytes: test_analytes });
};

const onchangegridamended = ($this, row, e) => {
  debugger;

  swal({
    title: "Are you sure you want to Ammend?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(willProceed => {
    if (willProceed) {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let test_analytes = $this.state.test_analytes;

      row[name] = value;
      for (let l = 0; l < test_analytes.length; l++) {
        if (
          test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
        ) {
          row["confirm"] = "N";
          row["validate"] = "N";
          row["status"] = "E";

          test_analytes[l] = row;
        }
      }
      $this.setState({
        test_analytes: test_analytes,
        status: "CL"
      });
    }
  });
};

export {
  texthandle,
  onvalidate,
  getAnalytes,
  onchangegridcol,
  onconfirm,
  confirmedgridcol,
  onReRun,
  resultEntryUpdate,
  onchangegridresult,
  onchangegridamended
};
