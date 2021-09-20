import React, { useContext, useState, useEffect } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  MainContext,
  AlgaehModal,
  // RawSecurityComponent,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehSecurityComponent,
  AlgaehButton,
  // AlgaehFormGroup,
  AlgaehFormGroup,
  Spin,
} from "algaeh-react-components";
import Options from "../../../Options.json";
import "./ResultEntry.scss";
import { ResultInput } from "./ResultInput";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";
import "../../../styles/site.scss";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
const getAnalytes = async (key, selectedPatient) => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/laboratory/getTestAnalytes",
      module: "laboratory",
      method: "GET",
      data: { order_id: selectedPatient.hims_f_lab_order_id },
    }),
    newAlgaehApi({
      uri: "/laboratory/getLabOrderedComment",
      module: "laboratory",
      method: "GET",
      data: { hims_f_lab_order_id: selectedPatient.hims_f_lab_order_id },
    }),
  ]);

  return {
    analyteData: result[0]?.data?.records,
    commentsData: result[1]?.data?.records,
  };
};
function SampleCollectionPatient({ onClose, selectedPatient = {}, open }) {
  const { userToken } = useContext(MainContext);

  const [portal_exists, setPortal_exists] = useState(false);

  // const [editableGrid, setEditableGrid] = useState(undefined);

  const [run_type, setRun_type] = useState("N");
  const [test_comments_id, setTest_comments_id] = useState(null);
  const [selcted_comments, setSelcted_comments] = useState("");
  const [ordered_by_name, setOrdered_by_name] = useState({
    name: selectedPatient.ordered_by,
    date: selectedPatient.ordered_date,
  });
  const [entered_by_name, setEntered_by_name] = useState({
    name: "",
    date: "",
  });
  const [confirm_by_name, setConfirm_by_name] = useState({
    name: "",
    date: "",
  });
  const [validate_by_name, setValidate_by_name] = useState({
    name: "",
    date: "",
  });
  const [comments_data, setComments_data] = useState([]);
  const [comments, setComments] = useState();
  const [test_analytes, setTest_analytes] = useState([]);
  const [records_test_formula, setRecords_test_formula] = useState([]);
  const [comment_list, setComment_list] = useState([]);
  const [edit_range, setEdit_range] = useState(false);
  const [edit_units, setEdit_units] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  let [, setState] = useState();

  useEffect(() => {
    setPortal_exists(userToken.portal_exists);

    setOrdered_by_name(selectedPatient.ordered_by_name);
    setStatus(selectedPatient.status);
    setComments_data(selectedPatient.comments_data);
    setComments(selectedPatient.comments);
    // RawSecurityComponent({ componentCode: "SPEC_COLL_STATUS_CHANGE" }).then(
    //   (result) => {
    //     if (result === "hide") {
    //       setEditableGrid(undefined);
    //     } else {
    //       setEditableGrid("editOnly");
    //     }
    //   }
    // );
  }, []); //eslint-disable-line

  // const { data: providers } = useQuery(
  //   ["getProviderDetails", {}],
  //   getProviderDetails,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {},
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // async function getProviderDetails(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/employee/get",
  //     module: "hrManagement",
  //     method: "GET",
  //   });
  //   return result?.data?.records;
  // }

  const { refetch: getAnalytesReload } = useQuery(
    ["getAnalytes", { ...selectedPatient }],
    getAnalytes,
    {
      initialData: {
        analyteData: [],
        commentsData: [],
      },
      cacheTime: Infinity,
      initialStale: true,
      onSuccess: (data) => {
        debugger;
        if (data.analyteData.length > 0) {
          for (let i = 0; i < data.analyteData.length; i++) {
            if (data.analyteData[i].analyte_type === "T") {
              data.analyteData[i].dis_text_value =
                data.analyteData[i].text_value !== null &&
                data.analyteData[i].text_value !== ""
                  ? data.analyteData[i].text_value.split("<br/>")
                  : [];

              // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
              data.analyteData[i].text_value =
                data.analyteData[i].text_value !== null &&
                data.analyteData[i].text_value !== ""
                  ? data.analyteData[i].text_value.replace(
                      new RegExp("<br/>|<br />", "g"),
                      "\n"
                    )
                  : null;
            } else {
              data.analyteData[i].dis_text_value = [];
            }
          }
          debugger;
          const records_test_formula = _.filter(
            data.analyteData,
            (f) => f.formula !== null
          );

          setTest_analytes(data.analyteData);
          if (selectedPatient.isPCR === "Y") {
            data.analyteData[0].result =
              data.analyteData[0].result === null ||
              data.analyteData[0].result === ""
                ? "Negative"
                : data.analyteData[0].result;
          }
          setComment_list(
            data.commentsData.comments !== null
              ? data.commentsData.comments.split("<br/>")
              : []
          );

          setRecords_test_formula(records_test_formula);
          setOrdered_by_name({
            name: data.analyteData[0].ordered_by_name,
            date: data.analyteData[0].ordered_date,
          });
          setConfirm_by_name({
            name: data.analyteData[0].confirm_by_name,
            date: data.analyteData[0].confirmed_date,
          });
          setEntered_by_name({
            name: data.analyteData[0].entered_by_name,
            date: data.analyteData[0].entered_date,
          });
          setValidate_by_name({
            name: data.analyteData[0].validate_by_name,
            date: data.analyteData[0].validated_date,
          });
        } else {
          swalMessage({
            title: "Analytes Not defined for this test, Please contact admin.",
            type: "warning",
          });
        }
        setIsLoading(false);
        // records_test_formula, setEntered_by_name;
        // test_analytes: response.data.records,
        // entered_by: response.data.records[0].entered_by,
        // ordered_by_name: response.data.records[0].ordered_by_name,
        // entered_by_name: response.data.records[0].entered_by_name,
        // confirm_by_name: response.data.records[0].confirm_by_name,
        // validate_by_name: response.data.records[0].validate_by_name,
        // entered_date: response.data.records[0].entered_date,
        // confirmed_date: response.data.records[0].confirmed_date,
        // validated_date: response.data.records[0].validated_date,
      },
      onError: (err) => {
        setIsLoading(false);
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  // const getAnalytes = () => {
  //   AlgaehLoader({ show: true });

  //   algaehApiCall({
  //     uri: "/laboratory/getTestAnalytes",
  //     module: "laboratory",
  //     method: "GET",
  //     data: { order_id: $this.state.hims_f_lab_order_id },
  //     onSuccess: (response) => {
  //       // console.timeEnd("lab");
  //       if (response.data.success) {
  //         for (let i = 0; i < response.data.records.length; i++) {
  //           if (response.data.records[i].analyte_type === "T") {
  //             response.data.records[i].dis_text_value =
  //               response.data.records[i].text_value !== null &&
  //               response.data.records[i].text_value !== ""
  //                 ? response.data.records[i].text_value.split("<br/>")
  //                 : [];

  //             // response.data.records[i].text_value = response.data.records[i].text_value.replace("<br/>", "\n/g")
  //             response.data.records[i].text_value =
  //               response.data.records[i].text_value !== null &&
  //               response.data.records[i].text_value !== ""
  //                 ? response.data.records[i].text_value.replace(
  //                     new RegExp("<br/>|<br />", "g"),
  //                     "\n"
  //                   )
  //                 : null;
  //           } else {
  //             response.data.records[i].dis_text_value = [];
  //           }
  //         }
  //         const records_test_formula = _.filter(
  //           response.data.records,
  //           (f) => f.formula !== null
  //         );

  //         setTest_analytes(response.data.records)
  //         setRecords_test_formula(records_test_formula)
  //         $this.setState(
  //           {
  //             records_test_formula,
  //             test_analytes: response.data.records,
  //             entered_by: response.data.records[0].entered_by,
  //             ordered_by_name: response.data.records[0].ordered_by_name,
  //             entered_by_name: response.data.records[0].entered_by_name,
  //             confirm_by_name: response.data.records[0].confirm_by_name,
  //             validate_by_name: response.data.records[0].validate_by_name,
  //             entered_date: response.data.records[0].entered_date,
  //             confirmed_date: response.data.records[0].confirmed_date,
  //             validated_date: response.data.records[0].validated_date,
  //           },
  //           () => {
  //             AlgaehLoader({ show: false });
  //             console.timeEnd("lab");
  //           }
  //         );
  //       }
  //     },
  //   });

  //   algaehApiCall({
  //     uri: "/laboratory/getLabOrderedComment",
  //     module: "laboratory",
  //     method: "GET",
  //     data: { hims_f_lab_order_id: $this.state.hims_f_lab_order_id },
  //     onSuccess: (response) => {
  //       if (response.data.success) {
  //         $this.setState({
  //           comment_list:
  //             response.data.records.comments !== null
  //               ? response.data.records.comments.split("<br/>")
  //               : [],
  //         });
  //       }
  //     },
  //   });
  // };

  const forceUpdate = (row) => {
    let testAnalytes = test_analytes;

    let _index = testAnalytes.indexOf(row);

    testAnalytes[_index] = row;
    debugger;
    setTest_analytes(testAnalytes);
    setState({});
  };

  // const { data: labanalytes } = useQuery(
  //   ["getLabAnalytes", {}],
  //   getLabAnalytes,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {},
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // async function getLabAnalytes(key) {
  //   const result = await newAlgaehApi({
  //     uri: "/labmasters/selectAnalytes",
  //             module: "laboratory",
  //             method: "GET",
  //   });
  //   return result?.data?.records;
  // }
  // const { data: labiologyusers } = useQuery(
  //   ["getUserDetails", {}],
  //   getUserDetails,
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (data) => {
  //       // setEnabledHESN(false);
  //     },
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  const onClickPrintHandle = () => {
    generateLabResultReport({ hidePrinting: false })
      .then(() => {
        // this.setState({ loading: false });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        // this.setState({ loading: false });
      });
  };
  // const [add] = useMutation(generateLabResultReport, {
  //   onSuccess: (data) => {
  //     onSuccess();
  //     AlgaehMessagePop({
  //       type: "success",
  //       display: "Card Added successfully",
  //     });
  //   },
  //   onError,
  // });

  function generateLabResultReport(data) {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      let portalParams = {};

      if (portal_exists === "Y") {
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
              selectedPatient?.isPCR === "Y"
                ? "pcrTestReport"
                : "hematologyTestReport",
            reportParams: [
              { name: "hims_d_patient_id", value: selectedPatient.patient_id },
              {
                name: "visit_id",
                value: selectedPatient.visit_id,
              },
              {
                name: "hims_f_lab_order_id",
                value: selectedPatient.hims_f_lab_order_id,
              },
              {
                name: "visit_code",
                value: selectedPatient.visit_code,
              },
              {
                name: "patient_identity",
                value: selectedPatient.primary_id_no,
              },
              {
                name: "service_id",
                value: selectedPatient.service_id,
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

  const reloadAnalytesMaster = () => {
    setIsLoading(true);

    const inputObj = {
      test_id: selectedPatient.test_id,
      date_of_birth: selectedPatient.date_of_birth,
      gender: selectedPatient.gender,
      order_id: selectedPatient.hims_f_lab_order_id,
      allAnalytesArray: test_analytes,
      reload_analyte: "Y",
    };
    algaehApiCall({
      uri: "/laboratory/reloadAnalytesMaster",
      module: "laboratory",
      method: "PUT",
      data: inputObj,
      onSuccess: (response) => {
        if (response.data.success) {
          getAnalytesReload();
          setIsLoading(false);
        }
      },
      onCatch: (error) => {
        setIsLoading(false);
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const UpdateLabOrder = (value, status) => {
    value[0].comments = comment_list.join("<br/>");
    value[0].portal_exists = portal_exists;
    value[0].visit_code = selectedPatient.visit_code;
    value[0].primary_id_no = selectedPatient.primary_id_no;
    const critical_exit = _.filter(value, (f) => {
      return f.critical_status === "Y";
    });
    if (critical_exit.length > 0) {
      value[0].critical_status = "Y";
    }
    AlgaehLoader({ show: true });
    //

    for (let k = 0; k < value.length; k++) {
      if (value[k].analyte_type === "T" && edit_range) {
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

          const last = value[value.length - 1];
          if (last.hasOwnProperty("runtype")) {
            value.pop();
          }

          getAnalytesReload();
          setTest_analytes(value);
          setStatus(status === "AV" ? "V" : status);

          setRun_type(status === "N" ? last.runtype : run_type);
          setEdit_range(false);
          setEdit_units(false);

          AlgaehLoader({ show: false });

          if (portal_exists === "Y" && (status === "V" || status === "AV")) {
            generateLabResultReport({ hidePrinting: true });
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
  const onvalidate = () => {
    console.time("valid");

    let testAnalytes = test_analytes;

    let strTitle = "Are you sure want to Validate?";

    const intNoofAnalytes = testAnalytes.filter(
      (f) => f.result === null || f.result === ""
    );
    if (testAnalytes.length === intNoofAnalytes.length) {
      swalMessage({
        type: "warning",
        title: "Atleast one Analyte result to be entered.",
      });
      return;
    }

    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result === null || testAnalytes[k].result === "") {
        strTitle =
          "Are you sure want to Validate, for few Analytes no Result Entered?";

        testAnalytes[k].status = "V";
        testAnalytes[k].validate = "Y";
        testAnalytes[k].isre_run = false;
      }
      testAnalytes[k].status = "V";
      // test_analytes[k].validate = "Y";
      testAnalytes[k].isre_run = false;
      testAnalytes[k].comments = comments;
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
        testAnalytes.push({ runtype: run_type });
        UpdateLabOrder(testAnalytes, "V");
      }
    });
  };
  const onconfirm = () => {
    let testAnalytes = test_analytes;

    const intNoofAnalytes = testAnalytes.filter(
      (f) => f.result === null || f.result === ""
    );
    if (testAnalytes.length === intNoofAnalytes.length) {
      swalMessage({
        type: "warning",
        title: "Atleast one Analyte result to be entered.",
      });
      return;
    }

    let strTitle = "Are you sure want to Confirm?";
    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result === null || testAnalytes[k].result === "") {
        strTitle =
          "Are you sure want to Confirm, for few Analytes no Result Entered?";
      } else {
        testAnalytes[k].status = "C";
        testAnalytes[k].confirm = "Y";
        testAnalytes[k].isre_run = false;
        if (selectedPatient.auto_validate === "Y") {
          testAnalytes[k].status = "AV";
          testAnalytes[k].validate = "Y";
          strTitle =
            "This Test is Auto Validate Are you sure want to Confirm ?";
        }
      }
      testAnalytes[k].comments = comments;
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
        test_analytes.push({ runtype: run_type });
        UpdateLabOrder(
          test_analytes,
          selectedPatient.auto_validate === "Y" ? "AV" : "CF"
        );
      }
    });
  };

  const resultEntryUpdate = () => {
    let testAnalytes = test_analytes;
    // let enterResult = true;
    // let enterRemarks = true;
    for (let k = 0; k < testAnalytes.length; k++) {
      if (testAnalytes[k].result !== null) {
        // if (
        //   test_analytes[k].remarks === null &&
        //   test_analytes[k].amended === "Y"
        // ) {
        //   enterRemarks = false;
        // } else {
        testAnalytes[k].status = "E";
        if (testAnalytes[k].confirm !== "N") {
          testAnalytes[k].status = "C";
        }

        if (testAnalytes[k].validate !== "N") {
          testAnalytes[k].status = "V";
        }
      }
      // } else {
      //   enterResult = false;
      // }
      testAnalytes[k].isre_run = false;
      testAnalytes[k].comments = comments;
    }
    testAnalytes.push({ runtype: run_type });
    UpdateLabOrder(testAnalytes, "E");
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

  const onReRun = () => {
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
        let currentAnalytes = [...test_analytes];

        let runtype = run_type === "N" ? 1 : parseInt(run_type) + 1;

        for (let k = 0; k < currentAnalytes.length; k++) {
          currentAnalytes[k][`run${runtype}`] = currentAnalytes[k].result;

          currentAnalytes[k].result = "";
          currentAnalytes[k].confirm = "N";
          currentAnalytes[k].validate = "N";
          currentAnalytes[k].status = "N";
          currentAnalytes[k].isre_run = true;

          currentAnalytes[k].comments = comments;
        }

        currentAnalytes.push({ runtype });

        UpdateLabOrder(currentAnalytes, "N");
      }
    });
  };

  const deleteComment = (row) => {
    let commentList = comment_list;
    let _index = commentList.indexOf(row);
    commentList.splice(_index, 1);
    setComment_list(commentList);
    setState({});
  };
  const onchangegridresult = (row, e) => {
    debugger;
    row.result = e.target.value;
    let testAnalytes = test_analytes;
    // let critical_status = "N";
    const records_test = records_test_formula;
    //"[345]/[890]/[590]*100".match(/\d+]/g)

    const indexOfArray = testAnalytes.findIndex(
      (f) => f.hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
    );
    // row["normal_low"] = testAnalytes[indexOfArray].normal_low;
    // row["normal_high"] = testAnalytes[indexOfArray].normal_high;
    // row["critical_low"] = testAnalytes[indexOfArray].critical_low;
    // row["critical_high"] = testAnalytes[indexOfArray].critical_high;

    row["critical_type"] = checkRange(row);
    if (row["critical_type"] !== "N") {
      row["critical_status"] = "Y";
    }
    testAnalytes[indexOfArray] = row;

    for (let i = 0; i < records_test.length; i++) {
      const { formula, analyte_id, decimals } = records_test[i];
      if (formula) {
        let executableFormula = formula;
        const _aFormula = formula.match(/\d+]/g);
        for (let j = 0; j < _aFormula.length; j++) {
          const formula_id = _aFormula[j].replace(/\]/g, "");
          const _record = testAnalytes.find(
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
          otherValue =
            otherValue === undefined
              ? ""
              : parseFloat(otherValue).toFixed(decimals);
        }
        // console.log("otherValue", otherValue);
        const analyte_index = testAnalytes.findIndex(
          (f) => f.analyte_id === analyte_id
        );

        testAnalytes[analyte_index]["result"] = String(otherValue);
        testAnalytes[analyte_index]["critical_type"] = checkRange(
          testAnalytes[analyte_index]
        );
      }
    }
    setTest_analytes(testAnalytes);
    forceUpdate(row);
  };
  function checkRange(row) {
    let {
      result,
      normal_low,
      normal_high,
      critical_value_req,
      critical_low,
      critical_high,
    } = row;

    result = result === "" ? "" : parseFloat(result);
    critical_low = parseFloat(critical_low);
    normal_low = parseFloat(normal_low);
    normal_high = parseFloat(normal_high);
    critical_high = parseFloat(critical_high);

    if (row.analyte_type === "QN") {
      if (result === "") {
        return null;
      } else if (critical_value_req === "Y" && result < critical_low) {
        return "CL";
      } else if (result < normal_low) {
        return "L";
      } else if (critical_value_req === "Y" && result > critical_high) {
        return "CH";
      } else if (result > normal_high) {
        return "H";
      } else {
        return "N";
      }
    } else {
      return "N";
    }
  }
  const confirmedgridcol = (row, value) => {
    let testAnalytes = test_analytes;

    if (row.validate === "Y" && value === "N") {
      row["validate"] = "N";
    }

    row.confirm = value;
    // row["status"] = "C";
    for (let l = 0; l < testAnalytes.length; l++) {
      if (
        testAnalytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        testAnalytes[l] = row;
      }
    }
    setTest_analytes(testAnalytes);
  };

  const onchangeAmend = (row, value) => {
    let testAnalytes = test_analytes;

    // TO trigger re-render
    let l;
    for (l = 0; l < testAnalytes.length; l++) {
      if (
        testAnalytes[l].hims_f_ord_analytes_id === row.hims_f_ord_analytes_id
      ) {
        if (value === "N") {
          row.amended = "N";
        } else {
          row.amended = "";
        }
        testAnalytes[l] = row;
      }
    }

    setTest_analytes(testAnalytes);
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
          row.amended = value;
          row["confirm"] = "N";
          row["validate"] = "N";
          row["status"] = "E";
        } else {
          row.amended = "N";
        }
        testAnalytes[l - 1] = row;
        setTest_analytes(testAnalytes);
        if (willProceed.value) {
          setStatus("CL");
        }
        setState({});
      });
    }
  };

  const selectCommentEvent = (e, value) => {
    setTest_comments_id(value);
    setSelcted_comments(e.commet);
  };

  const addComments = () => {
    if (selcted_comments === "") {
      swalMessage({
        type: "warning",
        title: "Comment cannot be blank.",
      });
      return;
    }
    let commentList = comment_list;
    commentList.push(selcted_comments);
    setComment_list(commentList);
    setSelcted_comments("");
    setTest_comments_id(null);
  };
  return (
    <div>
      <AlgaehModal
        title="Result Entry"
        class="labResultModalPopup"
        visible={open}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={[
          <div className="row">
            <div className="col-6 footer-btn-left">
              <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
                <AlgaehButton
                  className="btn btn-default"
                  // loading={this.state.loading}
                  onClick={onClickPrintHandle}
                  disabled={
                    status === "V" && selectedPatient.credit_order === "N"
                      ? false
                      : true
                  }
                >
                  Print
                </AlgaehButton>
                {/* <button
         className="btn btn-default"
         onClick={this.onClickPrintHandle.bind(this)}
         disabled={this.state.status === "V" ? false : true}
       >
         Print
       </button> */}
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="EDIT_RANGE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={() => {
                    setEdit_range(!edit_range);
                  }}
                >
                  Edit Ranges
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="EDIT_UNIT_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={() => {
                    setEdit_units(!edit_units);
                  }}
                >
                  Edit Units
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="RELOAD_ANALYTES_MAS">
                <button
                  type="button"
                  className="btn btn-default"
                  disabled={status === "V" ? true : false}
                  onClick={reloadAnalytesMaster}
                >
                  Reload Analytes
                </button>
              </AlgaehSecurityComponent>
            </div>

            <div className="col-6">
              <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onvalidate}
                  disabled={
                    status === "V" ||
                    entered_by_name.name === "" ||
                    confirm_by_name.name === ""
                      ? true
                      : false
                  }
                >
                  Validate All
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onconfirm}
                  disabled={
                    status === "C" || entered_by_name.name === ""
                      ? true
                      : status === "V"
                      ? true
                      : false
                  }
                >
                  Confirm All
                </button>
              </AlgaehSecurityComponent>
              <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resultEntryUpdate}
                  disabled={
                    status === "V" || test_analytes.length <= 0 ? true : false
                  }
                >
                  Save
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="RE_RUN_LAB_RES">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={onReRun}
                  disabled={
                    status === "V" ? (run_type === 3 ? true : false) : true
                  }
                >
                  Re-Run
                </button>
              </AlgaehSecurityComponent>
              <button
                type="button"
                className="btn btn-default"
                onClick={(e) => {
                  onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>,
        ]}
        className={`row algaehNewModal hemResultEntryPopup`}
      >
        <Spin spinning={isLoading}>
          <div className="popupInner">
            <div className="popRightDiv">
              <div className="row">
                <div className="col-12 topbarPatientDetails">
                  <div className="row">
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Name",
                        }}
                      />

                      <h6>
                        {selectedPatient.full_name
                          ? selectedPatient.full_name
                          : "------"}
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          {selectedPatient.patient_code}
                        </small>
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Test Name",
                        }}
                      />

                      <h6>
                        {selectedPatient.service_name
                          ? selectedPatient.service_name
                          : "------"}
                        {/* <small style={{display:"table",fontStyle:"italic"}}
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Critical" : "Normal"}
                        </small> */}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Ordered By",
                        }}
                      />
                      <h6>
                        {ordered_by_name?.name
                          ? ordered_by_name?.name
                          : "------"}

                        {ordered_by_name?.name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(ordered_by_name.date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Entered By",
                        }}
                      />

                      <h6>
                        {entered_by_name.name ? entered_by_name.name : "------"}

                        {entered_by_name.name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(entered_by_name.date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Confirmed By",
                        }}
                      />

                      <h6>
                        {confirm_by_name.name ? confirm_by_name.name : "------"}

                        {confirm_by_name.name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(confirm_by_name.date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Validated By",
                        }}
                      />

                      <h6>
                        {validate_by_name.name
                          ? validate_by_name.name
                          : "------"}

                        {validate_by_name.name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(validate_by_name.date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>
                    {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Critical Result",
                        }}
                      />

                      <h6>
                        <small
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Yes" : "No"}
                        </small>
                      </h6>
                    </div> */}
                  </div>
                </div>
                <hr />
                <div className="col-12">
                  <div className="row">
                    <div className="col-9" id="hemResultEntryGrid">
                      <AlgaehDataGrid
                        // id="labResult_list_grid"
                        columns={[
                          {
                            fieldName: "status",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Analyte Status" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.status === "E" ? (
                                <span className="badge badge-secondary">
                                  Result Entered
                                </span>
                              ) : row.status === "C" ? (
                                <span className="badge badge-primary">
                                  Confirmed
                                </span>
                              ) : row.status === "V" ? (
                                <span className="badge badge-success">
                                  Validated
                                </span>
                              ) : (
                                <span className="badge badge-light">
                                  Result Not Entered
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 150,
                              resizable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "description", //"analyte_id",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Analyte" }} />
                            ),
                            // displayTemplate: (row) => {
                            //   let display =
                            //     this.props.labanalytes === undefined
                            //       ? []
                            //       : this.props.labanalytes.filter(
                            //           (f) =>
                            //             f.hims_d_lab_analytes_id ===
                            //             row.analyte_id
                            //         );

                            //   return (
                            //     <span>
                            //       {display !== null && display.length !== 0
                            //         ? display[0].description
                            //         : ""}
                            //     </span>
                            //   );
                            // },
                            others: {
                              minWidth: 250,
                              resizable: false,
                              style: { textAlign: "left" },
                            },
                          },
                          {
                            fieldName: "analyte_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Analyte Type" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.analyte_type === "QU"
                                ? "Quality"
                                : row.analyte_type === "QN"
                                ? "Quantity"
                                : "Text";
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "result",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Result",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    row.analyte_type === "QU" ? (
                                      <AlgaehAutoComplete
                                        div={{ className: "noLabel" }}
                                        selector={{
                                          name: "result",
                                          className: "select-fld",
                                          value:
                                            row.result === null
                                              ? ""
                                              : row.result,
                                          dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: [
                                              {
                                                name: "Negative",
                                                value: "Negative",
                                              },
                                              {
                                                name: "Positive",
                                                value: "Positive",
                                              },
                                              {
                                                name: "Not Seen",
                                                value: "Not Seen",
                                              },
                                              {
                                                name: "Reactive",
                                                value: "Reactive",
                                              },
                                              {
                                                name: "Non-Reactive",
                                                value: "Non-Reactive",
                                              },
                                            ],
                                          },
                                          updateInternally: true,
                                          onChange: (e, value) => {
                                            row.result = value;
                                            forceUpdate(row);

                                            // onchangegridcol(row, e);
                                          },
                                          onClear: (e) => {
                                            forceUpdate(row);
                                          },
                                        }}
                                      />
                                    ) : (
                                      <ResultInput
                                        row={row}
                                        onChange={(e) => {
                                          onchangegridresult(row, e);
                                        }}
                                      />
                                    )
                                  ) : (
                                    row.result
                                  )}
                                </span>
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },

                          {
                            fieldName: "result_unit",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Units" }} />
                            ),
                            displayTemplate: (row) => {
                              return edit_units === true &&
                                (row.analyte_type === "QN" ||
                                  row.analyte_type === "T") ? (
                                <AlgaehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.result_unit,
                                    className: "txt-fld",
                                    name: "result_unit",

                                    // updateInternally: true,
                                    onChange: (e) => {
                                      row.result_unit = e.target.value;
                                      forceUpdate(row);
                                    },
                                  }}
                                />
                              ) : (
                                <span>
                                  {row.result_unit !== "NULL"
                                    ? row.result_unit
                                    : "--"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "run1",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Run 1",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run1 !== "null" ? row.run1 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },

                          {
                            fieldName: "run2",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Run 2" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run2 !== "null" ? row.run2 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "run3",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Run 3" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run3 !== "null" ? row.run3 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "critical_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Critical Type" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return !row.critical_type ? null : row.critical_type ===
                                "N" ? (
                                <span className="badge badge-success">
                                  Normal
                                </span>
                              ) : row.critical_type === "L" ? (
                                <span className="badge badge-warning">Low</span>
                              ) : row.critical_type === "H" ? (
                                <span className="badge badge-danger">High</span>
                              ) : row.critical_type === "CL" ? (
                                <span className="badge badge-danger">
                                  Critical Low
                                </span>
                              ) : (
                                row.critical_type === "CH" && (
                                  <span className="badge badge-danger">
                                    Critical High
                                  </span>
                                )
                              );
                            },
                          },
                          {
                            fieldName: "normal_low",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Normal Low" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlgaehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_low,
                                    className: "txt-fld",
                                    name: "normal_low",
                                    // updateInternally: true,
                                    onChange: (e) => {
                                      debugger;
                                      row.normal_low = e.target.value;

                                      let testAnalytes = test_analytes;

                                      let _index = testAnalytes.indexOf(row);
                                      testAnalytes[_index] = row;
                                      setTest_analytes(testAnalytes);
                                      forceUpdate(row);
                                    },
                                  }}
                                />
                              ) : (
                                row.normal_low
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "normal_high",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Normal High" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlgaehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_high,
                                    className: "txt-fld",
                                    name: "normal_high",
                                    // updateInternally: true,
                                    onChange: (e) => {
                                      row.normal_high = e.target.value;
                                      forceUpdate(row);
                                    },
                                  }}
                                />
                              ) : (
                                row.normal_high
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "critical_low",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Critical Low" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlgaehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.critical_low,
                                    className: "txt-fld",
                                    name: "critical_low",
                                    // updateInternally: true,
                                    onChange: (e) => {
                                      row.critical_low = e.target.value;
                                      forceUpdate(row);
                                    },
                                  }}
                                />
                              ) : (
                                row.critical_low
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "critical_high",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Critical High" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlgaehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    value: row.critical_high,
                                    className: "txt-fld",
                                    name: "critical_high",
                                    // updateInternally: true,
                                    onChange: (e) => {
                                      row.critical_high = e.target.value;
                                      forceUpdate(row);
                                    },
                                  }}
                                />
                              ) : (
                                // <AlgaehFormGroup
                                //   div={{}}
                                //   textBox={{
                                //     value: row.critical_high,
                                //     className: "txt-fld",
                                //     name: "critical_high",
                                //     events: {
                                //       onChange: ongridEditRanges.bind(
                                //         this,
                                //         this,
                                //         row
                                //       ),
                                //     },
                                //   }}
                                // />
                                row.critical_high
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "dis_text_value",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Default Value" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                // normal_qualitative_value
                                row.normal_qualitative_value === "QU" ? (
                                  row.normal_qualitative_value
                                ) : edit_range === true &&
                                  row.analyte_type === "T" ? (
                                  <textarea
                                    value={row.text_value}
                                    name="text_value"
                                    onChange={
                                      (e) => {
                                        const text_value =
                                          e.target.value.replace(
                                            /\r?\n/g,
                                            "<br/>"
                                          );
                                        row.dis_text_value =
                                          text_value.split("<br/>");
                                        row.text_value = e.target.value;
                                        forceUpdate(row);
                                      }
                                      // this.textAreaEventGrid(row, e)
                                    }
                                  />
                                ) : (
                                  <ul className="analyteTxtUL">
                                    {row.dis_text_value?.length > 0
                                      ? row.dis_text_value.map((row) => {
                                          return <li>{row}</li>;
                                        })
                                      : "-"}
                                  </ul>
                                )
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "confirm",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Confirm" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlgaehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "confirm",
                                        className: "select-fld",
                                        value: row.confirm,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        // updateInternally: true,
                                        onChange: (e, value) => {
                                          if (
                                            row.result === null &&
                                            value === "Y"
                                          ) {
                                            swalMessage({
                                              type: "warning",
                                              title: "Please enter the result",
                                            });
                                          } else {
                                            confirmedgridcol(row, value);
                                          }
                                        },
                                      }}
                                    />
                                  ) : row.confirm === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "validate",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Validate" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlgaehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "validate",
                                        className: "select-fld",
                                        value: row.validate,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        // updateInternally: true,
                                        onChange: (e, value) => {
                                          row.validate = value;
                                          forceUpdate(row);

                                          // onchangegridcol(row, e);
                                        },
                                        onClear: (e) => {
                                          forceUpdate(row);
                                        },
                                      }}
                                    />
                                  ) : row.confirm === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          //TODO
                          {
                            fieldName: "amended",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Amend" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.amended === "N" ? (
                                    <AlgaehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "amended",
                                        className: "select-fld",
                                        value: row.amended,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        // updateInternally: true,
                                        onChange: (e, value) => {
                                          row.amended = value;
                                          // forceUpdate(row);
                                          onchangeAmend(row, value);

                                          // onchangegridcol(row, e);
                                        },
                                      }}
                                    />
                                  ) : row.amended === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "remarks",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Remarks",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlgaehFormGroup
                                      div={{ className: "col" }}
                                      textBox={{
                                        value: row.remarks,
                                        className: "txt-fld",
                                        name: "remarks",
                                        // updateInternally: true,
                                        onChange: (e) => {
                                          row.nphies_code = e.target.value;
                                          forceUpdate(row);
                                        },
                                      }}
                                    />
                                  ) : row.remarks !== "null" ? (
                                    row.remarks
                                  ) : (
                                    ""
                                  )}
                                </span>
                              );
                            },
                            others: {
                              filterable: false,
                              minWidth: 250,
                              resizable: false,
                            },
                          },
                        ]}
                        keyId="patient_code"
                        filter={true}
                        data={test_analytes}
                        paging={true}
                      />
                    </div>
                    <div className="col-3">
                      <div className="row">
                        <AlgaehAutoComplete
                          div={{ className: "col-12  form-group" }}
                          label={{
                            forceLabel: "Select Comment",
                          }}
                          selector={{
                            name: "test_comments_id",
                            className: "select-fld",
                            value: test_comments_id,
                            dataSource: {
                              textField: "commnet_name",
                              valueField:
                                "hims_d_investigation_test_comments_id",
                              data: comments_data,
                            },
                            onChange: selectCommentEvent,
                            onClear: () => {
                              setTest_comments_id(null);
                              setSelcted_comments("");
                            },
                          }}
                        />
                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Enter Comment",
                            }}
                          />

                          <textarea
                            value={selcted_comments}
                            name="selcted_comments"
                            onChange={(e) => {
                              setSelcted_comments(e.target.value);
                            }}
                          />
                        </div>

                        <div className="col-12" style={{ textAlign: "right" }}>
                          <button
                            onClick={addComments}
                            className="btn btn-default"
                            style={{ marginBottom: 15 }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="row finalCommentsSection">
                          <h6>View Final Comments</h6>
                          <ol>
                            {comment_list?.length > 0
                              ? comment_list.map((row, index) => {
                                  if (row) {
                                    return (
                                      <React.Fragment key={index}>
                                        <li key={index}>
                                          <span>{row}</span>
                                          <i
                                            className="fas fa-times"
                                            onClick={() => deleteComment(row)}
                                          ></i>
                                        </li>
                                      </React.Fragment>
                                    );
                                  } else {
                                    return null;
                                  }
                                })
                              : null}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
        {/* <div className="popupFooter">
            <div className="col-12 ">
              <div className="row">
                <div className="col-lg-6 leftBtnGroup">
                  {" "}
                 
                </div>
              </div>
            </div>
          </div> */}
      </AlgaehModal>
    </div>
  );
}

export default SampleCollectionPatient;
