import React, { memo, useState, useEffect } from "react";
import "../ResultDispatch.scss";
import { Collapse, Checkbox, AlgaehButton } from "algaeh-react-components";
import moment from "moment";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
// import _ from "lodash";
const { Panel } = Collapse;
export default memo(function ({ details }) {
  const { visit_date, doc_name, mlc_accident_reg_no, list } = details;
  const [selectAll, setSelectAll] = useState(false);
  const [listOfDetails, setListOfDetails] = useState(list);
  const [enablePrintButton, setEnablePrintButton] = useState(true);
  const [loading, setLoading] = useState(false);
  function changeSelectStatus(event) {
    const checkState = event.target.checked;

    const test = listOfDetails
      // .filter((item) => {
      //   return item.checked === undefined || item.checked === false;
      // })
      .map((item) => {
        setEnablePrintButton(item.status === "V" && checkState ? false : true);
        setSelectAll(item.status === "V" && checkState ? checkState : false);
        return { ...item, checked: item.status === "V" ? checkState : false };
      });
    setListOfDetails(test);

    // setCheckState(event.target.checked);
  }

  function showReport(e) {
    setLoading(true);
    const reportType = e.currentTarget.getAttribute("report");
    let reportExtraParams = {};
    console.log("reportType", reportType);
    let sentItems = [];
    const recordCheckList = listOfDetails.filter((f) => f.checked === true);
    let reportName = "labMerge";
    if (reportType === "merge") {
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
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Visit wise lab report`;
        window.open(origin);
      },
      onCatch: () => {
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
        <table className="accrTable">
          <thead>
            <tr>
              <th>
                {" "}
                <Checkbox
                  checked={selectAll}
                  onChange={changeSelectStatus}
                ></Checkbox>
              </th>
              <th>Test Name</th>
              <th>Critical</th>
              <th>Status</th>
              <th>Billed</th>
              <th>Send Out</th>
            </tr>
          </thead>
          <tbody>
            {listOfDetails.map((item, index) => {
              const {
                status,
                service_name,
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
                      items={listOfDetails}
                      setEnablePrintButton={setEnablePrintButton}
                    />
                  </td>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    {service_name}
                  </td>
                  <td width="20">{critical_status === "Y" ? "Yes" : "No"}</td>
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
            className="btn btn-default btn-sm"
            report="merge"
            onClick={showReport}
            disabled={enablePrintButton}
            loading={loading}
          >
            Print Selected Reports
          </AlgaehButton>
          <AlgaehButton
            className="btn btn-default btn-sm"
            report="single"
            onClick={showReport}
            disabled={enablePrintButton}
            loading={loading}
          >
            Print All in one Selected Reports
          </AlgaehButton>
        </div>
      </Panel>
    </Collapse>
  );
});

function CheckBoxCheck({ item, setSelectAll, items, setEnablePrintButton }) {
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
    checked.length < items.length ? setSelectAll(false) : setSelectAll(true);

    if (checked.length > 0) {
      setEnablePrintButton(false);
    } else {
      setEnablePrintButton(true);
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
