import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

export function generateLabResultReport(data) {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "hematologyTestReport",
        reportParams: [
          { name: "hims_d_patient_id", value: data.patient_id },
          {
            name: "visit_id",
            value: data.visit_id
          },
          {
            name: "hims_f_lab_order_id",
            value: data.hims_f_lab_order_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Lab Test Report";
    }
  });
}

const UpdateLabOrder = ($this, value, status) => {
  algaehApiCall({
    uri: "/laboratory/updateLabResultEntry",
    module: "laboratory",
    data: value,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        if (status === "N") {
          swalMessage({
            type: "success",
            title: "Re-Run Started, Investigation is in Progress . ."
          });
        } else {
          swalMessage({
            type: "success",
            title: "Done successfully . ."
          });
        }

        for (let k = 0; k < value.length; k++) {
          if (value[k].run_type !== null && value[k].run_type !== undefined) {
            value.splice(k, 1);
          }
        }

        $this.setState({
          test_analytes: value,
          status: status,
          entered_by:
            response.data.records.entered_by || $this.state.entered_by,
          confirmed_by:
            response.data.records.confirmed_by || $this.state.confirmed_by,
          validated_by:
            response.data.records.validated_by || $this.state.validated_by
        });
      }
    },
    onFailure: error => {
      swalMessage({
        type: "error",
        title: error.response.data.message || error.message
      });
    }
  });
};

const onvalidate = $this => {
  let test_analytes = $this.state.test_analytes;

  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].confirm === "N") {
      swalMessage({
        type: "warning",
        title: "Please confirm result for all the Analytes"
      });

      return;
    } else {
      test_analytes[k].status = "V";
      test_analytes[k].validate = "Y";
      test_analytes[k].isre_run = false;
    }
    test_analytes[k].comments = $this.state.comments;
  }

  swal({
    title: "Are you sure want to Validate?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willProceed => {
    if (willProceed.value) {
      test_analytes.push({ run_type: $this.state.run_type });
      UpdateLabOrder($this, test_analytes, "V");
    }
  });
};

const getAnalytes = $this => {
  algaehApiCall({
    uri: "/laboratory/getTestAnalytes",
    module: "laboratory",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
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
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const confirmedgridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;
  if (row.result === null && value === "Y") {
    swalMessage({
      type: "warning",
      title: "Please enter the result"
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
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;

  if (name === "validate") {
    if (row.confirm === "N" && value === "Y") {
      swalMessage({
        type: "warning",
        title: "Without confirming cannot validate, please confirm"
      });
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
    test_analytes[k].isre_run = false;
    test_analytes[k].comments = $this.state.comments;
  }
  if (enterResult === true && enterRemarks === true) {
    test_analytes.push({ run_type: $this.state.run_type });
    UpdateLabOrder($this, test_analytes, "E");
  } else {
    if (enterResult === false) {
      swalMessage({
        type: "warning",
        title: "Please enter result for all the Analytes."
      });
    } else if (enterRemarks === false) {
      swalMessage({
        type: "warning",
        title: "Please enter Remarks for Amended.."
      });
    }
  }
};

const onconfirm = $this => {
  let test_analytes = $this.state.test_analytes;

  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result === null || test_analytes[k].result === "") {
      swalMessage({
        type: "warning",
        title: "Please enter result for all the Analytes."
      });
      return;
    } else {
      test_analytes[k].status = "C";
      test_analytes[k].confirm = "Y";
      test_analytes[k].isre_run = false;
    }
    test_analytes[k].comments = $this.state.comments;
  }

  swal({
    title: "Are you sure want to Confirm?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willProceed => {
    if (willProceed.value) {
      test_analytes.push({ run_type: $this.state.run_type });
      UpdateLabOrder($this, test_analytes, "CF");
    }
  });
};

const onReRun = $this => {
  let test_analytes = $this.state.test_analytes;
  let success = true;
  let runtype = [];

  for (let k = 0; k < test_analytes.length; k++) {
    if ($this.state.run_type === "N") {
      // test_analytes[k].run1 = test_analytes[k].result;
      runtype = { run_type: "1" };
    } else if ($this.state.run_type === "1") {
      // test_analytes[k].run2 = test_analytes[k].result;
      runtype = { run_type: "2" };
    } else if ($this.state.run_type === "2") {
      // test_analytes[k].run3 = test_analytes[k].result;
      runtype = { run_type: "3" };
    }

    // test_analytes[k].result = "";

    //Noor
    if (test_analytes[k].run1 === null) {
      test_analytes[k].run1 = test_analytes[k].result;
    } else if (test_analytes[k].run2 === null) {
      test_analytes[k].run2 = test_analytes[k].result;
    } else if (test_analytes[k].run3 === null) {
      test_analytes[k].run3 = test_analytes[k].result;
    }

    //end noor
    test_analytes[k].result = "";
    test_analytes[k].confirm = "N";
    test_analytes[k].validate = "N";
    test_analytes[k].status = "N";
    test_analytes[k].isre_run = true;

    test_analytes[k].comments = $this.state.comments;
  }
  test_analytes.push(runtype);

  if (success === true) {
    swal({
      title: "Are you sure want to Re-Run?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willProceed => {
      if (willProceed.value) {
        UpdateLabOrder($this, test_analytes, "N");
      }
    });
  }
};

const onchangegridresult = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;

  row[name] = value;
  for (let l = 0; l < test_analytes.length; l++) {
    if (
      test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    ) {
      row["critical_type"] = checkRange(row);
      test_analytes[l] = row;
    }
  }
  $this.setState({ test_analytes: test_analytes });
};

function checkRange(row) {
  let { result, critical_low, critical_high, normal_low, normal_high } = row;

  result = parseFloat(result);
  critical_low = parseFloat(critical_low);
  normal_low = parseFloat(normal_low);
  normal_high = parseFloat(normal_high);
  critical_high = parseFloat(critical_high);

  if (!result) {
    return null;
  } else if (result <= critical_low) {
    return "CL";
  } else if (result < normal_low) {
    return "L";
  } else if (result < normal_high) {
    return "N";
  } else if (result < critical_high) {
    return "H";
  } else {
    return "CH";
    console.log(result);
  }
}

const onchangeAmend = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;

  // TO trigger re-render
  let l;
  for (l = 0; l < test_analytes.length; l++) {
    if (
      test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    ) {
      if (value === "N") {
        row[name] = "N";
      } else {
        row[name] = "";
      }
      test_analytes[l] = row;
    }
  }

  $this.setState(
    {
      test_analytes
    },
    () => {
      if (value === "Y") {
        swal({
          title: "Are you sure want to Amend?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#44b8bd",
          cancelButtonColor: "#d33",
          cancelButtonText: "No"
        }).then(willProceed => {
          if (willProceed.value) {
            row[name] = value;
            row["confirm"] = "N";
            row["validate"] = "N";
            row["status"] = "E";
          } else {
            row[name] = "N";
          }
          test_analytes[l - 1] = row;
          let obj = { test_analytes };
          willProceed.value ? (obj.status = "CL") : obj;
          $this.setState(obj);
        });
      }
    }
  );
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
  onchangeAmend
};
