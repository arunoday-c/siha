import React from "react";

function AllergyHistory({ columnsArray, columnData }) {
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
          const { start_date, generic_name, instructions } = item;

          return (
            <tr key={index}>
              {" "}
              <td width="100">{start_date}</td>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {generic_name}
              </td>
              <td style={{ textAlign: "left" }}>{instructions}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AllergyHistory;
