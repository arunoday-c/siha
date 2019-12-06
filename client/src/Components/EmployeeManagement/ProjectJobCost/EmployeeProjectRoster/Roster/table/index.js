import React, { useContext, forwardRef } from "react";
import moment from "moment";
import { ProjectRosterContext } from "../index";
import TableData from "./tableData";
export default forwardRef(function(props, ref) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { dates } = getProjectRosterState();

  return (
    <table className="rosterTableStyle" ref={ref}>
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
});
