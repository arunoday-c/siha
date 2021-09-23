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
          const {
            start_date,
            generic_name,
            item_description,
            dosage,
            med_units,
            frequency,
            no_of_days,
          } = item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {start_date}
              </td>
              <td width="150">{generic_name}</td>
              <td width="20">{item_description}</td>
              <td width="120">{dosage}</td>
              <td width="150">{med_units}</td>
              <td width="20">{frequency}</td>
              <td width="120">{no_of_days}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PrescriptionHistory;
