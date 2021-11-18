import React from "react";

function DietPlanHistory({ columnsArray, columnData }) {
  debugger;
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
          const { hims_d_diet_description, till_date } = item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {hims_d_diet_description}
              </td>
              <td style={{ textAlign: "center" }}>{till_date}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(DietPlanHistory);
