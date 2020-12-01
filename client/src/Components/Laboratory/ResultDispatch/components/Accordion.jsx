import React, { memo, useState, useEffect } from "react";
import "../ResultDispatch.scss";
import { Collapse, Checkbox } from "algaeh-react-components";
import moment from "moment";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
// import _ from "lodash";
const { Panel } = Collapse;
export default memo(function ({ details }) {
  const { visit_date, doc_name, mlc_accident_reg_no, list } = details;
  const [selectAll, setSelectAll] = useState(false);
  const [listOfDetails, setListOfDetails] = useState(list);
  const [enablePrintButton, setEnablePrintButton] = useState(true);
  function changeSelectStatus(event) {
    const checkState = event.target.checked;
    setSelectAll(checkState);
    const test = list
      .filter((item) => {
        return item.checked === undefined || item.checked === false;
      })
      .map((item) => {
        return { ...item, checked: item.status === "V" ? checkState : false };
      });
    setListOfDetails(test);
    setEnablePrintButton(checkState ? false : true);
    // setCheckState(event.target.checked);
  }

  function showReport() {
    let sentItems = [];

    const records = list
      .filter((f) => f.checked === true)
      .map((m, index) => {
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
    console.log("sentItems", sentItems);

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
          reportName: "labMerge", //"hematologyTestReport",
          reportParams: sentItems,
          // reportParams: [
          //   { name: "hims_d_patient_id", value: data.patient_id },
          //   {
          //     name: "visit_id",
          //     value: data.visit_id,
          //   },
          //   {
          //     name: "hims_f_lab_order_id",
          //     value: data.hims_f_lab_order_id,
          //   },
          // ],

          outputFileType: "PDF",
          // multiMerdgeReport: sentItems.length,
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Visit wise lab report`;
        window.open(origin);
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
          <button
            className="btn btn-default btn-sm"
            onClick={showReport}
            disabled={enablePrintButton}
          >
            Print Selected Reports
          </button>
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

    // const hasUncheck = items.filter((item) => {
    //   return item.checked || item.checked === false;
    // });
    const checked = items.filter((item) => {
      return item.checked || item.checked === true;
    });
    checked.length < items.length ? setSelectAll(false) : setSelectAll(true);
    // if (hasUncheck.length <= items.length) {
    //   setSelectAll(false);
    // } else {
    //   setSelectAll(true);
    // }
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
