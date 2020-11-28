import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

export function generateLabResultReport(data) {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "hematologyTestReport",
        reportParams: [
          { name: "hims_d_patient_id", value: data.patient_id },
          {
            name: "visit_id",
            value: data.visit_id,
          },
          {
            name: "hims_f_lab_order_id",
            value: data.hims_f_lab_order_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Hematology Test Report`;
      window.open(origin);
    },
  });
}

const UpdateLabOrder = ($this, value, status) => {
  value[0].comments = $this.state.comment_list.join("<br/>");
  const critical_exit = _.filter(value, (f) => {
    return f.critical_status === "Y";
  });
  if (critical_exit.length > 0) {
    value[0].critical_status = "Y";
  }
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/laboratory/updateLabResultEntry",
    module: "laboratory",
    data: value,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        if (status === "N") {
          swalMessage({
            type: "success",
            title: "Re-Run Started, Investigation is in Progress . .",
          });
        } else {
          swalMessage({
            type: "success",
            title: "Done successfully . .",
          });
          console.timeEnd("valid");
        }

        // for (let k = 0; k < value.length; k++) {
        //   if (value[k].hasOwnProperty("run_type")) {
        //     value.splice(k, 1);
        //   }
        // }
        const last = value[value.length - 1];
        if (last.hasOwnProperty("runtype")) {
          value.pop();
        }

        $this.setState(
          {
            test_analytes: value,
            status: status,
            entered_by:
              response.data.records.entered_by || $this.state.entered_by,
            confirmed_by:
              response.data.records.confirmed_by || $this.state.confirmed_by,
            validated_by:
              response.data.records.validated_by || $this.state.validated_by,
            run_type: status === "N" ? last.runtype : $this.state.run_type,
          },
          () => {
            AlgaehLoader({ show: false });
          }
        );
      }
    },
    onFailure: (error) => {
      swalMessage({
        type: "error",
        title: error.response.data.message || error.message,
      });
    },
  });
};

const onvalidate = ($this) => {
  console.time("valid");
  let test_analytes = $this.state.test_analytes;

  let strTitle = "Are you sure want to Validate?";

  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].confirm === "N") {
      strTitle =
        "Are you sure want to Validate, for few Analytes no Result Entered?";
      // swalMessage({
      //   type: "warning",
      //   title: "Please confirm result for all the Analytes",
      // });

      // return;
    } else {
      test_analytes[k].status = "V";
      test_analytes[k].validate = "Y";
      test_analytes[k].isre_run = false;
    }
    test_analytes[k].comments = $this.state.comments;
  }

  swal({
    title: strTitle,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
    if (willProceed.value) {
      test_analytes.push({ runtype: $this.state.run_type });
      UpdateLabOrder($this, test_analytes, "V");
    }
  });
};

const getAnalytes = ($this) => {
  AlgaehLoader({ show: true });
  console.time("lab");
  algaehApiCall({
    uri: "/laboratory/getTestAnalytes",
    module: "laboratory",
    method: "GET",
    data: { order_id: $this.state.hims_f_lab_order_id },
    onSuccess: (response) => {
      // console.timeEnd("lab");
      if (response.data.success) {
        // let data = response.data.records;
        // for (let i = 0; i < data.length; i++) {
        //   data[i].hims_f_lab_order_id = $this.state.hims_f_lab_order_id;
        //   if (data[i].status === "E" || data[i].status === "N") {
        //     data[i].validate = "N";
        //     data[i].confirm = "N";
        //   } else if (data[i].status === "C") {
        //     data[i].validate = "N";
        //     data[i].confirm = "Y";
        //   } else if (data[i].status === "V") {
        //     data[i].validate = "Y";
        //     data[i].confirm = "Y";
        //   }
        // }
        $this.setState(
          {
            test_analytes: response.data.records,
            ordered_by_name: response.data.records[0].ordered_by_name,
            entered_by_name: response.data.records[0].entered_by_name,
            confirm_by_name: response.data.records[0].confirm_by_name,
            validate_by_name: response.data.records[0].validate_by_name,
          },
          () => {
            AlgaehLoader({ show: false });
            console.timeEnd("lab");
          }
        );
      }
    },
  });

  algaehApiCall({
    uri: "/laboratory/getLabOrderedComment",
    module: "laboratory",
    method: "GET",
    data: { hims_f_lab_order_id: $this.state.hims_f_lab_order_id },
    onSuccess: (response) => {
      if (response.data.success) {
        $this.setState({
          comment_list:
            response.data.records.comments !== null
              ? response.data.records.comments.split("<br/>")
              : [],
        });
      }
    },
  });
};

const confirmedgridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let test_analytes = $this.state.test_analytes;
  if (row.result === null && value === "Y") {
    swalMessage({
      type: "warning",
      title: "Please enter the result",
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
        title: "Without confirming cannot validate, please confirm",
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

const resultEntryUpdate = ($this) => {
  let test_analytes = $this.state.test_analytes;
  // let enterResult = true;
  // let enterRemarks = true;
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result !== null) {
      // if (
      //   test_analytes[k].remarks === null &&
      //   test_analytes[k].amended === "Y"
      // ) {
      //   enterRemarks = false;
      // } else {
      test_analytes[k].status = "E";
      if (test_analytes[k].confirm !== "N") {
        test_analytes[k].status = "C";
      }

      if (test_analytes[k].validate !== "N") {
        test_analytes[k].status = "V";
      }
    }
    // } else {
    //   enterResult = false;
    // }
    test_analytes[k].isre_run = false;
    test_analytes[k].comments = $this.state.comments;
  }
  test_analytes.push({ runtype: $this.state.run_type });
  UpdateLabOrder($this, test_analytes, "E");
  // if (enterResult === true && enterRemarks === true) {
  //   test_analytes.push({ runtype: $this.state.run_type });
  //   UpdateLabOrder($this, test_analytes, "E");
  // } else {
  //   if (enterResult === false) {
  //     swalMessage({
  //       type: "warning",
  //       title: "Please enter result for all the Analytes.",
  //     });
  //   } else if (enterRemarks === false) {
  //     swalMessage({
  //       type: "warning",
  //       title: "Please enter Remarks for Amended..",
  //     });
  //   }
  // }
};

const onconfirm = ($this) => {
  let test_analytes = $this.state.test_analytes;

  let strTitle = "Are you sure want to Confirm?";
  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result === null || test_analytes[k].result === "") {
      strTitle =
        "Are you sure want to Confirm, for few Analytes no Result Entered?";
      // swalMessage({
      //   type: "warning",
      //   title: "Please enter result for all the Analytes.",
      // });
      // return;
    } else {
      test_analytes[k].status = "C";
      test_analytes[k].confirm = "Y";
      test_analytes[k].isre_run = false;
    }
    test_analytes[k].comments = $this.state.comments;
  }

  swal({
    title: strTitle,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
    if (willProceed.value) {
      test_analytes.push({ runtype: $this.state.run_type });
      UpdateLabOrder($this, test_analytes, "CF");
    }
  });
};

const onReRun = ($this) => {
  swal({
    title: "Are you sure want to Re-Run?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willProceed) => {
    if (willProceed.value) {
      const { test_analytes, run_type } = $this.state;
      let currentAnalytes = [...test_analytes];

      let runtype = run_type === "N" ? 1 : parseInt(run_type) + 1;

      for (let k = 0; k < currentAnalytes.length; k++) {
        currentAnalytes[k][`run${runtype}`] = currentAnalytes[k].result;

        currentAnalytes[k].result = "";
        currentAnalytes[k].confirm = "N";
        currentAnalytes[k].validate = "N";
        currentAnalytes[k].status = "N";
        currentAnalytes[k].isre_run = true;

        currentAnalytes[k].comments = $this.state.comments;
      }

      currentAnalytes.push({ runtype });

      UpdateLabOrder($this, currentAnalytes, "N");
    }
  });
};

const onchangegridresult = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let { test_analytes } = $this.state;
  // let critical_status = "N";
  row[name] = value;

  for (let l = 0; l < test_analytes.length; l++) {
    if (
      test_analytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    ) {
      row["critical_type"] = checkRange(row);
      if (row["critical_type"] !== "N") {
        row["critical_status"] = "Y";
      }
      test_analytes[l] = row;
    }
  }
  $this.setState({
    test_analytes,
  });
};

function checkRange(row) {
  let { result, normal_low, normal_high } = row;

  result = parseFloat(result);
  // critical_low = parseFloat(critical_low);
  normal_low = parseFloat(normal_low);
  normal_high = parseFloat(normal_high);
  // critical_high = parseFloat(critical_high);

  if (!result) {
    return null;
  } else if (result <= normal_low) {
    return "L";
  } else if (result >= normal_high) {
    return "H";
  } else {
    return "N";
  }
}

// function backup_checkRange(row) {
//   let { result, critical_low, critical_high, normal_low, normal_high } = row;

//   result = parseFloat(result);
//   critical_low = parseFloat(critical_low);
//   normal_low = parseFloat(normal_low);
//   normal_high = parseFloat(normal_high);
//   critical_high = parseFloat(critical_high);

//   if (!result) {
//     return null;
//   } else if (result <= critical_low) {
//     return "CL";
//   } else if (result < normal_low) {
//     return "L";
//   } else if (result < normal_high) {
//     return "N";
//   } else if (result < critical_high) {
//     return "H";
//   } else {
//     return "CH";
//   }
// }

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
      test_analytes,
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
          cancelButtonText: "No",
        }).then((willProceed) => {
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
          if (willProceed.value) {
            obj.status = "CL";
          }
          $this.setState(obj);
        });
      }
    }
  );
};

const addComments = ($this) => {
  if ($this.state.selcted_comments === "") {
    swalMessage({
      type: "warning",
      title: "Comment cannot be blank.",
    });
    return;
  }
  let comment_list = $this.state.comment_list;
  comment_list.push($this.state.selcted_comments);

  $this.setState({
    comment_list: comment_list,
    selcted_comments: "",
    test_comments_id: null,
  });
};

const deleteComment = ($this, row) => {
  let comment_list = $this.state.comment_list;
  let _index = comment_list.indexOf(row);
  comment_list.splice(_index, 1);

  $this.setState({
    comment_list: comment_list,
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
  onchangeAmend,
  addComments,
  deleteComment,
};
