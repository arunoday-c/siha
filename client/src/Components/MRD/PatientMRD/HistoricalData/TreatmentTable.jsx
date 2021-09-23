import React, { useEffect } from "react";

function TreatmentTable({ columnsArray, columnData }) {
  useEffect(() => {
    console.log("", columnData, columnsArray);
  }, []);
  return (
    <table className="accrTable">
      <thead>
        <tr>
          {columnsArray.map((item) => (
            <th>{item.name}</th>
          ))}
          {/* <th>
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={selectAll}
                        onChange={changeSelectStatus}
                      ></Checkbox>
                    </th>
                    <th>Test Name</th>
                    <th>Test Category</th>
                    <th>Critical</th>
                    <th>Status</th>
                    <th>Billed</th>
                    <th>Send Out</th> */}
        </tr>
      </thead>
      <tbody>
        {columnData?.map((item, index) => {
          const { doctor_name, service_name, service_desc, teeth_number } =
            item;

          return (
            <tr key={index}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                {doctor_name}
              </td>
              <td width="150">{service_name}</td>
              <td width="20">{service_desc}</td>
              <td width="120">{teeth_number}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TreatmentTable;
