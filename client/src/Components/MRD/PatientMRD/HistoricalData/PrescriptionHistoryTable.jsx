import React from "react";

function PrescriptionHistory({ columnsArray, columnData }) {
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
          const { generic_name, start_date, instructions } = item;

          return (
            <tr key={index}>
              {/* <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {item_description}
              </td>{" "} */}
              <td width="350" style={{ textAlign: "left", fontWeight: "bold" }}>
                {generic_name}
              </td>
              <td width="100">{start_date}</td>
              <td style={{ textAlign: "left" }}>{instructions}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PrescriptionHistory;
