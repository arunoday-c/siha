import React, { memo, useState, useEffect } from "react";
import "../ResultDispatch.scss";
import {
  Collapse,
  Checkbox,
  AlgaehButton,
  Spin,
  // AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
// import _ from "lodash";
const { Panel } = Collapse;
export default memo(function ({ details }) {
  const { visit_date, doc_name, mlc_accident_reg_no, detailsOf } = details;
  const [selectAll, setSelectAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  // const [selectAllPcr, setSelectAllPcr] = useState(false);
  // const [indeterminatePcr, setIndeterminatePcr] = useState(false);
  const [listOfDetails, setListOfDetails] = useState(
    detailsOf?.filter((f) => {
      return f.isPCR === "N";
    })[0]?.list
  );
  // const [pcrListArray, setPcrListArray] = useState(

  // );
  // const [enablePrintButtonPcr, setEnablePrintButtonPcr] = useState(true);
  const [enablePrintButton, setEnablePrintButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingPcr, setLoadingPcr] = useState(false);
  function changeSelectStatus(event) {
    let checkState = event.target.checked;
    console.log("checkState===", checkState);
    if (indeterminate === true && checkState === true) {
      checkState = false;
    }
    const test = listOfDetails
      // .filter((item) => {
      //   return item.checked === undefined || item.checked === false;
      // })
      .map((item) => {
        return { ...item, checked: item.status === "V" ? checkState : false };
      });
    const checkList = test.filter((f) => f.checked === true);
    if (checkList.length === listOfDetails.length) {
      setIndeterminate(false);
      setSelectAll(true);
    } else {
      setIndeterminate(true);
      setSelectAll(false);
    }
    setListOfDetails(test);
    setEnablePrintButton(checkList.length === 0 ? true : false);

    if (checkList.length === 0) {
      setIndeterminate(false);
      setSelectAll(false);
      // const hasChecked = listOfDetails.filter((f) => f.status !== "V");
      // if (hasChecked.length > 0) {
      //   AlgaehMessagePop({
      //     type: "warning",
      //     display: "Report's validation is pending you can't print now.",
      //   });
      // }
    }
    // setCheckState(checkState);
  }

  function showReportPcr(e, data) {
    // debugger;
    setLoadingPcr(true);

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
          reportName: "pcrTestReport",
          reportParams: [
            { name: "hims_d_patient_id", value: data.patient_id },
            {
              name: "visit_id",
              value: data.hims_f_patient_visit_id,
            },
            {
              name: "hims_f_lab_order_id",
              value: data.hims_f_lab_order_id,
            },
          ],
          qrCodeReport: true,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        setLoadingPcr(false);
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report`;
        // const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report for ${this.state.patient_code}-${this.state.patient_name}`;
        window.open(origin);
      },
      onCatch: () => {
        setLoadingPcr(false);
      },
    });
  }
  function printMicroBiologyReport(e, data) {
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
          reportName: "microbioTestReport",
          reportParams: [
            { name: "hims_d_patient_id", value: data.patient_id },
            {
              name: "visit_id",
              value: data.hims_f_patient_visit_id,
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
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report`;
        // const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report for ${this.state.patient_code}-${this.state.patient_name}`;
        window.open(origin);
        // window.document.title = "Lab Test Report";
      },
    });
  }
  function showReport(e) {
    setLoading(true);
    const reportType = e.currentTarget.getAttribute("report");
    let reportExtraParams = {};
    let sentItems = [];
    const recordCheckList = listOfDetails.filter((f) => f.checked === true);
    let reportName = "labMerge";
    if (reportType === "separate") {
      reportExtraParams = { multiMerdgeReport: recordCheckList.length };

      recordCheckList.forEach((item) => {
        let myRecords = [];
        myRecords.push({ name: "hims_d_patient_id", value: item.patient_id });
        myRecords.push({
          name: "visit_id",
          value: item.hims_f_patient_visit_id,
        });
        myRecords.push({
          name: "hims_f_lab_order_id",
          value: item.hims_f_lab_order_id,
        });
        sentItems.push(myRecords);
      });
      reportName = "hematologyTestReport";
    } else {
      const records = recordCheckList.map((m, index) => {
        if (index === 0) {
          sentItems.push({ name: "hims_d_patient_id", value: m.patient_id });
          sentItems.push({
            name: "visit_id",
            value: m.hims_f_patient_visit_id,
          });
        }
        return m.hims_f_lab_order_id;
      });
      sentItems.push({ name: "lab_order_ids", value: records });
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
          reportName: reportName,
          reportParams: sentItems,
          outputFileType: "PDF",
          ...reportExtraParams,
        },
      },
      onSuccess: (res) => {
        setLoading(false);
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report`;
        // const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Lab Report for ${this.state.patient_code}-${this.state.patient_name}`;
        window.open(origin);
      },
      onCatch: (err) => {
        debugger;
        setLoading(false);
      },
    });
  }
  return (
    <Collapse className="accCntr">
      <Panel
        header={
          <div>
            <b>
              {visit_date && moment(visit_date).format("DD-MM-YYYY HH:mm:ss")}
            </b>{" "}
            <small>By {doc_name}</small>
            <small>
              {mlc_accident_reg_no ? `/MLC NO.:${mlc_accident_reg_no}` : ""}
            </small>
          </div>
        }
        key="1"
      >
        {listOfDetails?.length > 0 ? (
          <>
            <table className="accrTable">
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={selectAll}
                      onChange={changeSelectStatus}
                    ></Checkbox>
                  </th>
                  <th>Test Name</th>
                  <th>Test Category</th>
                  <th>Critical</th>
                  <th>Status</th>
                  <th>Billed</th>
                  <th>Send Out</th>
                </tr>
              </thead>
              <tbody>
                {listOfDetails?.map((item, index) => {
                  const {
                    status,
                    service_name,
                    category_name,
                    critical_status,
                    billed,
                    send_out_test,
                  } = item;

                  return (
                    <tr key={index}>
                      <td width="10">
                        <CheckBoxCheck
                          item={item}
                          setSelectAll={setSelectAll}
                          setIndeterminate={setIndeterminate}
                          items={listOfDetails}
                          setEnablePrintButton={setEnablePrintButton}
                        />
                      </td>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        {service_name}
                      </td>
                      <td width="150">{category_name}</td>
                      <td width="20">
                        {critical_status === "Y" ? "Yes" : "No"}
                      </td>
                      <td width="120">
                        {status === "O"
                          ? "Ordered"
                          : status === "CL"
                          ? "Sample Collected"
                          : status === "CN"
                          ? "Test Cancelled"
                          : status === "CF"
                          ? "Confirmed"
                          : status === "V"
                          ? "Validated"
                          : "Validation Pending"}
                      </td>
                      <td width="20">{billed === "Y" ? "Yes" : "No"}</td>
                      <td width="70">{send_out_test === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="accFooter">
              <AlgaehButton
                sty
                className="btn btn-default btn-sm"
                report="merge"
                onClick={showReport}
                disabled={enablePrintButton}
                loading={loading}
                style={{ marginBottom: 10 }}
              >
                Print as merge report
              </AlgaehButton>
              <AlgaehButton
                className="btn btn-default btn-sm"
                report="separate"
                onClick={showReport}
                disabled={enablePrintButton}
                loading={loading}
                style={{ marginLeft: 10, marginBottom: 10 }}
              >
                Print as separate report
              </AlgaehButton>
            </div>
          </>
        ) : null}
        {detailsOf?.filter((f) => {
          return f.isPCR === "Y";
        })[0]?.list ? (
          <Spin spinning={loadingPcr}>
            <table className="accrTable">
              <thead>
                <tr>
                  {/* <th>
                <Checkbox
                  indeterminate={indeterminatePcr}
                  checked={selectAllPcr}
                  onChange={changeSelectStatusPcr}
                ></Checkbox>
              </th> */}
                  <th>Test Name</th>
                  <th>Test Category</th>
                  <th>Critical</th>
                  <th>Status</th>
                  <th>Billed</th>
                  <th>Send Out</th>
                  <th>Print Report</th>
                </tr>
              </thead>
              <tbody>
                {detailsOf
                  ?.filter((f) => {
                    return f.isPCR === "Y";
                  })[0]
                  ?.list.map((item, index) => {
                    const {
                      status,
                      service_name,
                      category_name,
                      critical_status,
                      billed,
                      send_out_test,
                    } = item;

                    return (
                      <tr key={index}>
                        <td style={{ textAlign: "left", fontWeight: "bold" }}>
                          {service_name}
                        </td>
                        <td width="150">{category_name}</td>
                        <td width="20">
                          {critical_status === "Y" ? "Yes" : "No"}
                        </td>
                        <td width="120">
                          {status === "O"
                            ? "Ordered"
                            : status === "CL"
                            ? "Sample Collected"
                            : status === "CN"
                            ? "Test Cancelled"
                            : status === "CF"
                            ? "Confirmed"
                            : status === "V"
                            ? "Validated"
                            : "Validation Pending"}
                        </td>
                        <td width="20">{billed === "Y" ? "Yes" : "No"}</td>
                        <td width="70">
                          {send_out_test === "Y" ? "Yes" : "No"}
                        </td>
                        <td width="70">
                          <i
                            style={{ fontSize: 30 }}
                            className="fas fa-print fa-3x"
                            onClick={(e) => {
                              showReportPcr(e, item);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Spin>
        ) : null}
        {detailsOf?.filter((f) => {
          return f.isPCR === "MI";
        })[0]?.list ? (
          <Spin spinning={loadingPcr}>
            <table className="accrTable">
              <thead>
                <tr>
                  <th>Print</th>
                  <th>Test Name</th>
                  <th>Test Category</th>
                  <th>Critical</th>
                  <th>Status</th>
                  <th>Billed</th>
                  <th>Send Out</th>
                </tr>
              </thead>
              <tbody>
                {detailsOf
                  ?.filter((f) => {
                    return f.isPCR === "MI";
                  })[0]
                  ?.list.map((item, index) => {
                    const {
                      status,
                      service_name,
                      category_name,
                      critical_status,
                      billed,
                      send_out_test,
                    } = item;

                    return (
                      <tr key={index}>
                        <td width="70">
                          <i
                            style={{
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              borderRadius: "50%",
                              padding: "6px",
                            }}
                            className="fas fa-print fa-lg"
                            onClick={(e) => {
                              printMicroBiologyReport(e, item);
                            }}
                          ></i>
                        </td>

                        <td style={{ textAlign: "left", fontWeight: "bold" }}>
                          {service_name}
                        </td>
                        <td width="150">{category_name}</td>
                        <td width="20">
                          {critical_status === "Y" ? "Yes" : "No"}
                        </td>
                        <td width="120">
                          {status === "O"
                            ? "Ordered"
                            : status === "CL"
                            ? "Sample Collected"
                            : status === "CN"
                            ? "Test Cancelled"
                            : status === "CF"
                            ? "Confirmed"
                            : status === "V"
                            ? "Validated"
                            : "Validation Pending"}
                        </td>
                        <td width="20">{billed === "Y" ? "Yes" : "No"}</td>
                        <td width="70">
                          {send_out_test === "Y" ? "Yes" : "No"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Spin>
        ) : null}
      </Panel>
    </Collapse>
  );
});

function CheckBoxCheck({
  item,
  setSelectAll,
  setIndeterminate,
  items,
  setEnablePrintButton,
}) {
  const [checkState, setCheckState] = useState(item.checked);
  useEffect(() => {
    setCheckState(item.checked);
  }, [item.checked]);
  function onChangeHandler(event) {
    const tarCheck = event.target.checked;
    item.checked = tarCheck;
    setCheckState(tarCheck);
    const checked = items.filter((item) => {
      return item.checked || item.checked === true;
    });
    if (checked.length < items.length) {
      setSelectAll(false);
      setIndeterminate(true);
    } else {
      setSelectAll(true);
      setIndeterminate(false);
    }

    if (checked.length > 0) {
      setEnablePrintButton(false);
    } else {
      setEnablePrintButton(true);
      setIndeterminate(false);
    }
  }
  return (
    <Checkbox
      disabled={item.status !== "V" ? true : false}
      name={item.hims_f_lab_order_id}
      checked={checkState}
      onChange={onChangeHandler}
    />
  );
}
