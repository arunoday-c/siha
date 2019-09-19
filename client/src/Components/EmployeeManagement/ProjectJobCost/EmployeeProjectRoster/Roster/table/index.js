import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import { ProjectRosterContext } from "../index";
import TableData from "./tableData";
export default function(props) {
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const [tableState, setTableState] = useState({
    dates: [],
    onlyDates: []
  });
  const { inputs } = getProjectRosterState();

  useEffect(() => {
    let local = getDaysOfMonth(inputs);
    local.localDates.push(<th>Joining Date</th>, <th>Exit Date</th>);
    setTableState({ dates: local.localDates, onlyDates: local.onlyDates });
  }, []);

  function getDaysOfMonth(inputs) {
    let localDates = [<th>Employee Name</th>];
    let onlyDates = [];
    let yearMonth = inputs.year + "-" + inputs.month + "-01";

    let currDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    let lastDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    let now = moment(currDate).clone();

    while (now.isSameOrBefore(lastDate)) {
      onlyDates.push(now.format("YYYYMMDD"));
      localDates.push(
        <th key={now.format("YYYYMMDD")}>
          <span> {now.format("ddd")}</span>
          <br />
          <span>{now.format("DD/MMM")}</span>
        </th>
      );
      now.add(1, "days");
    }
    return { localDates, onlyDates };
  }
  return (
    <table>
      <thead>{tableState.dates.length === 0 ? null : tableState.dates}</thead>
      <TableData dates={tableState.onlyDates} />
    </table>
  );
}
