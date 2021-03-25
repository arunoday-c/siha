import React, { useContext } from "react";
import { ProjectRosterContext } from "../../index";
import TD from "../td";
export default React.memo(function (props) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { employees, filterEmployees, filterTrue } = getProjectRosterState();
  const loadEmployees = filterTrue === false ? employees : filterEmployees;
  return (
    <tbody>
      {loadEmployees.map((row, index) => (
        <tr key={row.hims_d_employee_id}>
          <td>
            <b> {row.employee_name} </b>
            <small>{row.designation} </small>
            <small>
              {row.employee_code} / {row.identity_no} /{" "}
              {row.employee_type_description}
            </small>
          </td>
          <TD {...row} {...props} />
          <td>{row.date_of_joining} </td>
          <td>{row.exit_date}</td>
        </tr>
      ))}
    </tbody>
  );
});
