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

const UpdateLabOrder = ($this, value) => {
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
        $this.setState({ test_analytes: value });
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
      icon: "success",
      buttons: true,
      dangerMode: true
    }).then(willProceed => {
      if (willProceed) {
        UpdateLabOrder($this, test_analytes);
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
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result !== null) {
      test_analytes[k].status = "E";
      if (test_analytes[k].confirm !== "N") {
        test_analytes[k].status = "C";
      }

      if (test_analytes[k].validate !== "N") {
        test_analytes[k].status = "V";
      }
    } else {
      enterResult = false;
    }
  }
  if (enterResult === true) {
    UpdateLabOrder($this, test_analytes);
  } else {
    swal("Invalid Input. Please enter input.", {
      icon: "warning",
      buttons: false,
      timer: 2000
    });
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
      icon: "success",
      buttons: true,
      dangerMode: true
    }).then(willProceed => {
      if (willProceed) {
        UpdateLabOrder($this, test_analytes);
      }
    });
  }
};

export {
  texthandle,
  onvalidate,
  getAnalytes,
  onchangegridcol,
  onconfirm,
  confirmedgridcol,
  resultEntryUpdate
};
