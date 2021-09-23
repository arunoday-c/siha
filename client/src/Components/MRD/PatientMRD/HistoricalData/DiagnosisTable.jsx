import React from "react";

function DiagnosisTable({ columnsArray, columnData }) {
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
            daignosis_description,
            daignosis_code,
            diagnosis_type,
            final_daignosis,
          } = item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {daignosis_description}
              </td>
              <td width="150">{daignosis_code}</td>
              <td width="20">
                {diagnosis_type === "S" ? "Secondary" : "Primary"}
              </td>
              <td width="120">{final_daignosis === "Y" ? "Yes" : "No"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DiagnosisTable;
