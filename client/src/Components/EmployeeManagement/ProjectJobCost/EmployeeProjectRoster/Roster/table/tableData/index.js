import React, { useContext } from "react";
import { ProjectRosterContext } from "../../index";
import TD from "../td";
export default React.memo(function(props) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { employees } = getProjectRosterState();
  return (
    <tbody>
      {employees.map((row, index) => (
        <tr key={row.hims_d_employee_id}>
          <td>
            <b> {row.employee_name} </b>
            <br></br>
            {row.employee_code}
            <br></br>
            <small>{row.designation}</small>
          </td>
          <TD {...row} />
          <td>{row.date_of_joining} </td>
          <td>{row.exit_date}</td>
        </tr>
      ))}
    </tbody>
  );
});
