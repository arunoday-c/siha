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
            lab_billed,
            rad_ord_status,
            rad_billed,
          } = item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {service_name}
              </td>
              <td width="150">{provider_name}</td>
              <td width="20">{lab_ord_status}</td>
              <td width="120">{lab_billed}</td>
              <td width="150">{rad_ord_status}</td>
              <td width="20">{rad_billed}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default InvestigationTable;
