import React from "react";

function InvestigationTable({ columnsArray, columnData }) {
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
              {/* <td>{rad_billed}</td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default InvestigationTable;
