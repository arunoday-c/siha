import React from "react";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

function InvestigationTable({ columnsArray, columnData }) {
  const generateReport = (row, report_type) => {
    let inputObj = {};
    if (row.hims_f_rad_order_id > 0) {
      inputObj = {
        tab_name: "Radiology Report",
        reportName: "radiologyReport",
        data: [
          {
            name: "hims_f_rad_order_id",
            value: row.hims_f_rad_order_id,
          },
        ],
      };
    } else {
      inputObj = {
        tab_name: "Lab Report",
        reportName: "hematologyTestReport",
        data: [
          {
            name: "hims_d_patient_id",
            value: row.patient_id,
          },
          {
            name: "visit_id",
            value: row.visit_id,
          },
          {
            name: "hims_f_lab_order_id",
            value: row.hims_f_lab_order_id,
          },
        ],
      };
    }
    let tab_name = inputObj.tab_name;
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
          reportName: inputObj.reportName,
          reportParams: inputObj.data,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${tab_name}`;
        window.open(origin);
      },
    });
  };

  return (
    <table className="accrTable">
      <thead>
        <tr>
          {columnsArray.map((item) => (
            <th>{item.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {columnData?.map((item, index) => {
          const {
            service_name,
            provider_name,
            lab_ord_status,
            // lab_billed,
            rad_ord_status,
            // rad_billed,
          } = item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {service_name}
              </td>
              <td>{provider_name}</td>
              <td>
                {/* {lab_ord_status} */}

                {lab_ord_status === "O"
                  ? "Ordered"
                  : lab_ord_status === "CL"
                  ? "Specimen Collected"
                  : lab_ord_status === "CN"
                  ? "Test Cancelled"
                  : lab_ord_status === "CF"
                  ? "Result Confirmed "
                  : lab_ord_status === "V"
                  ? "Result Validated"
                  : "----"}
              </td>
              {/* <td>{lab_billed}</td> */}
              <td>
                {rad_ord_status === "O"
                  ? "Ordered"
                  : rad_ord_status === "S"
                  ? "Scheduled"
                  : rad_ord_status === "UP"
                  ? "Under Process"
                  : rad_ord_status === "CN"
                  ? "Cancelled"
                  : rad_ord_status === "RC"
                  ? "Result Confirmed"
                  : rad_ord_status === "RA"
                  ? "Result Available"
                  : "----"}
              </td>
              <td>
                {
                  <span
                    className="pat-code"
                    style={{ color: "#006699" }}
                    onClick={() => {
                      generateReport(item, "LAB");
                    }}
                  >
                    View Report
                  </span>
                }
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default InvestigationTable;
