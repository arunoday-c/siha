import React, { useContext } from "react";
import { ProjectRosterContext } from "../../index";
import TD from "../td";
export default React.memo(function(props) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { employees, filterEmployees } = getProjectRosterState();
  const loadEmployees =
    filterEmployees.length === 0 ? employees : filterEmployees;
  return (
    <tbody>
      {loadEmployees.map((row, index) => (
        <tr key={row.hims_d_employee_id}>
          <td>
            <b> {row.employee_name} </b>
            <br></br>
            {row.employee_code}
            <br></br>
            <small>{row.designation}</small>
          </td>
          <TD {...row} {...props} />
          <td>{row.date_of_joining} </td>
          <td>{row.exit_date}</td>
        </tr>
      ))}
    </tbody>
  );
});
