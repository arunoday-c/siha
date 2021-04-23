/*eslint no-eval: 0*/
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";
import axios from "axios";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

export function generateLabResultReport(data) {
  return new Promise((resolve, reject) => {
    let portalParams = {};
    if (data.portal_exists === "Y") {
      portalParams["reportToPortal"] = "true";
    }
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
          // reportName: "hematologyTestReport",
          ...portalParams,
          reportName:
            data?.isPCR === "Y" ? "pcrTestReport" : "hematologyTestReport",
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
            {
              name: "visit_code",
              value: data.visit_code,
            },
            {
              name: "patient_identity",
              value: data.primary_id_no,
            },
            {
              name: "service_id",
              value: data.service_id,
            },
          ],
          qrCodeReport: true,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        if (data.hidePrinting === true) {
          resolve();
        } else {
          const urlBlob = URL.createObjectURL(res.data);
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Test Report`;
          window.open(origin);
          resolve();
        }
      },
      onCatch: (err) => {
        reject(err);
      },
    });
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
  // debugger;

  for (let k = 0; k < value.length; k++) {
    if (value[k].analyte_type === "T" && $this.state.edit_range) {
      value[k].val_text_value =
        value[k].text_value !== null && value[k].text_value !== ""
          ? value[k].text_value.replace(/\r?\n/g, "<br/>")
          : null;
      value[k].dis_text_value =
        value[k].text_value !== null && value[k].text_value !== ""
          ? value[k].val_text_value.split("<br/>")
          : [];
    }
  }
  debugger;
  algaehApiCall({
    uri: "/laboratory/updateLabResultEntry",
    module: "laboratory",
    data: value,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        if (status === "N") {
          if ($this.state.portal_exists === "Y") {
            const portal_data = {
              service_id: $this.state.service_id,
              visit_code: $this.state.visit_code,
              patient_identity: $this.state.primary_id_no,
              service_status: "SAMPLE COLLECTED'",
            };
            axios
              .post(
                "http://localhost:4402/api/v1/info/deletePatientService",
                portal_data
              )
              .then(function (response) {
                //handle success
                console.log(response);
              })
              .catch(function (response) {
                //handle error
                console.log(response);
              });
          }
          swalMessage({
            type: "success",
            title: "Re-Run Started, Investigation is in Progress . .",
          });
        } else {
          if (status === "CF" || status === "V") {
            if ($this.state.portal_exists === "Y") {
              const portal_data = {
                service_id: $this.state.service_id,
                visit_code: $this.state.visit_code,
                patient_identity: $this.state.primary_id_no,
                service_status:
                  status === "CF" ? "RESULT CONFIRMED" : "RESULT VALIDATED",
              };
              axios
                .post(
                  "http://localhost:4402/api/v1/info/deletePatientService",
                  portal_data
                )
                .then(function (response) {
                  //handle success
                  console.log(response);
                })
                .catch(function (response) {
                  //handle error
                  console.log(response);
                });
            }
          }
          swalMessage({
            type: "success",
            title: "Done successfully . .",
          });
          console.timeEnd("valid");
        }

        const last = value[value.length - 1];
        if (last.hasOwnProperty("runtype")) {
          value.pop();
        }

        getAnalytes($this);
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
            edit_range: false,
          },
          () => {
            AlgaehLoader({ show: false });
          }
        );
        if ($this.state.portal_exists === "Y") {
          generateLabResultReport({ ...$this.state, hidePrinting: true });
        }
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
  let intNoofAnalytes = 0;
  let strTitle = "Are you sure want to Validate?";

  for (let k = 0; k < test_analytes.length; k++) {
    if (test_analytes[k].result === null || test_analytes[k].result === "") {
      strTitle =
        "Are you sure want to Validate, for few Analytes no Result Entered?";
      intNoofAnalytes = intNoofAnalytes + 1;

      test_analytes[k].status = "V";
      test_analytes[k].validate = "Y";
      test_analytes[k].isre_run = false;
      // swalMessage({
      //   type: "warning",
      //   title: "Please confirm result for all the Analytes",
      // });

      // return;
    }
    // else {
    //   test_analytes[k].status = "V";
    //   test_analytes[k].validate = "Y";
    //   test_analytes[k].isre_run = false;
    // }
    test_analytes[k].status = "V";
    test_analytes[k].validate = "Y";
    test_analytes[k].isre_run = false;
    test_analytes[k].comments = $this.state.comments;
  }

  if (test_analytes.length === intNoofAnalytes) {
    swalMessage({
      type: "warning",
      title: "Atleast one Analyte result to be entered.",
    });
    return;
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

const reloadAnalytesMaster = ($this) => {
  AlgaehLoader({ show: true });

  // debugger
  const inputObj = {
    test_id: $this.state.hims_d_investigation_test_id,
    date_of_birth: $this.state.date_of_birth,
    gender: $this.state.gender,
    order_id: $this.state.hims_f_lab_order_id,
  };
  algaehApiCall({
    uri: "/laboratory/reloadAnalytesMaster",
    module: "laboratory",
    method: "PUT",
    data: inputObj,
    onSuccess: (response) => {
      if (response.data.success) {
        getAnalytes($this);
        AlgaehLoader({ show: false });
      }
    },
    onCatch: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
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
        for (let i = 0; i < response.data.records.length; i++) {
          if (response.data.records[i].analyte_type === "T") {
            response.data.records[i].dis_text_value =
              response.data.records[i].text_value !== null &&
              response.data.records[i].text_value !== ""
                ? response.data.records[i].text_value.split("<br/>")
                : [];

            // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
            response.data.records[i].text_value =
              response.data.records[i].text_value !== null &&
              response.data.records[i].text_value !== ""
                ? response.data.records[i].text_value.replace(
                    new RegExp("<br/>|<br />", "g"),
                    "\n"
                  )
                : null;
          } else {
            response.data.records[i].dis_text_value = [];
          }
        }
        const records_test_formula = _.filter(
          response.data.records,
          (f) => f.formula !== null
        );

        console.log("response", response.data.records);
        $this.setState(
          {
            records_test_formula,
            test_analytes: response.data.records,
            entered_by: response.data.records[0].entered_by,
            ordered_by_name: response.data.records[0].ordered_by_name,
            entered_by_name: response.data.records[0].entered_by_name,
            confirm_by_name: response.data.records[0].confirm_by_name,
            validate_by_name: response.data.records[0].validate_by_name,
            entered_date: response.data.records[0].entered_date,
            confirmed_date: response.data.records[0].confirmed_date,
            validated_date: response.data.records[0].validated_date,
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

  let intNoofAnalytes = 0;

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
      intNoofAnalytes = intNoofAnalytes + 1;
    } else {
      test_analytes[k].status = "C";
      test_analytes[k].confirm = "Y";
      test_analytes[k].isre_run = false;
    }
    test_analytes[k].comments = $this.state.comments;
  }
  // debugger

  if (test_analytes.length === intNoofAnalytes) {
    swalMessage({
      type: "warning",
      title: "Atleast one Analyte result to be entered.",
    });
    return;
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
  const records_test = $this.state.records_test_formula;
  //"[345]/[890]/[590]*100".match(/\d+]/g)
  row[name] = value;

  const indexOfArray = test_analytes.findIndex(
    (f) => f.hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
  );
  row["critical_type"] = checkRange(row);
  if (row["critical_type"] !== "N") {
    row["critical_status"] = "Y";
  }
  test_analytes[indexOfArray] = row;

  for (let i = 0; i < records_test.length; i++) {
    const { formula, analyte_id, decimals } = records_test[i];
    if (formula) {
      let executableFormula = formula;
      const _aFormula = formula.match(/\d+]/g);
      for (let j = 0; j < _aFormula.length; j++) {
        const formula_id = _aFormula[j].replace(/\]/g, "");
        const _record = test_analytes.find(
          (f) => String(f.analyte_id) === formula_id
        );
        if (_record) {
          if (_record.result !== "") {
            const formula_reg = new RegExp(`${formula_id}`, "g");
            executableFormula = executableFormula
              .replace(formula_reg, _record.result)
              .replace(/\[/gi, "")
              .replace(/\]/gi, "");
          } else {
            executableFormula = "";
          }
        }
      }
      let otherValue = eval(executableFormula);
      if (decimals) {
        otherValue = parseFloat(otherValue).toFixed(decimals);
      }
      // console.log("otherValue", otherValue);
      const analyte_index = test_analytes.findIndex(
        (f) => f.analyte_id === analyte_id
      );

      test_analytes[analyte_index]["result"] = String(otherValue);
      test_analytes[analyte_index]["critical_type"] = checkRange(
        test_analytes[analyte_index]
      );
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
  if (row.analyte_type === "QN") {
    if (!result) {
      return null;
    } else if (result < normal_low) {
      return "L";
    } else if (result > normal_high) {
      return "H";
    } else {
      return "N";
    }
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

const ongridEditRanges = ($this, row, e) => {
  const name = e.name || e.target.name;
  const value = e.value || e.target.value;

  let test_analytes = $this.state.test_analytes;
  const _index = test_analytes.indexOf(row);

  row[name] = value;
  test_analytes[_index] = row;

  $this.setState({
    test_analytes: test_analytes,
  });
};

const eidtRanges = ($this) => {
  $this.setState({
    edit_range: !$this.state.edit_range,
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
  ongridEditRanges,
  eidtRanges,
  reloadAnalytesMaster,
};
