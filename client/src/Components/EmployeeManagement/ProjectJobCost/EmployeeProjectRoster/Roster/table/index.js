import React, { useContext } from "react";
import moment from "moment";
import { ProjectRosterContext } from "../index";
import TableData from "./tableData";
export default function(props) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { inputs, dates } = getProjectRosterState();

  return (
    <table>
      <thead>
        <tr>
          <th>Employee Name</th>
          {dates.map(head => (
            <th key={head}>
              <span>{moment(head).format("ddd")} </span>
              <br />
              <span> {moment(head).format("DD/MMM")} </span>
            </th>
          ))}
          <th>Joining Date</th>
          <th>Exit Date</th>
        </tr>
      </thead>
      <TableData {...props} />
    </table>
  );
}
