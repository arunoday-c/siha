import React, { memo, useState } from "react";
import { Collapse, Checkbox } from "algaeh-react-components";
import moment from "moment";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import { useEffect } from "react";
const { Panel } = Collapse;
export default memo(function ({ details }) {
  const { visit_date, doc_name, mlc_accident_reg_no, list } = details;
  const [selectAll, setSelectAll] = useState(false);
  function changeSelectStatus(event) {
    const checkState = event.target.checked;
    setSelectAll(checkState);
  }
  function showReport() {
    let sentItems = [];
    list
      .filter((f) => f.checked === true)
      .forEach((m) => {
        let internal = [];
        internal.push({ name: "hims_d_patient_id", value: m.patient_id });
        internal.push({ name: "visit_id", value: m.hims_f_patient_visit_id });
        internal.push({
          name: "hims_f_lab_order_id",
          value: m.hims_f_lab_order_id,
        });
        sentItems.push(internal);
      });
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
          reportName: "hematologyTestReport",
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
          multiMerdgeReport: sentItems.length,
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Hematology Test Report`;
        window.open(origin);
      },
    });
  }
  return (
    <Collapse>
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
        <Checkbox defaultChecked={selectAll} onChange={changeSelectStatus}>
          Select All Validated Test
        </Checkbox>
        <button onClick={showReport}>Print Selected Reports</button>
        <table>
          <tr>
            <th>
              <td>Selector</td>
              <td>Test Name</td>
              <td>Critical</td>
              <td>Status</td>
              <td>Billed</td>
              <td>Send Out</td>
            </th>
          </tr>
          <tbody>
            {list.map((item, index) => {
              const {
                status,
                service_name,
                critical_status,
                billed,
                send_out_test,
              } = item;

              return (
                <tr key={index}>
                  <td>
                    <CheckBoxCheck item={item} />
                  </td>
                  <td>{service_name}</td>
                  <td>{critical_status === "Y" ? "Yes" : "No"}</td>
                  <td>
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
                  <td>{billed === "Y" ? "Yes" : "No"}</td>
                  <td>{send_out_test === "Y" ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </Collapse>
  );
});

function CheckBoxCheck({ item }) {
  const [checkState, setCheckState] = useState(item.checked);
  useEffect(() => {
    setCheckState(item.checked);
    console.log("Changed", item.checked);
  }, [item.checked]);
  function onChangeHandler(event) {
    const tarCheck = event.target.checked;
    item.checked = tarCheck;
    setCheckState(tarCheck);
  }
  return (
    <Checkbox
      disabled={item.status !== "V" ? true : false}
      defaultChecked={checkState}
      onChange={onChangeHandler}
    />
  );
}
