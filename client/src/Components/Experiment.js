import React, { PureComponent } from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

// pull in the HOC
import treeTableHOC from "react-table/lib/hoc/treeTable";

// wrap ReacTable in it
// the HOC provides the configuration for the TreeTable
const TreeTable = treeTableHOC(ReactTable);
const _data = [
  {
    date: "2018-01-01 06:00 AM",
    oral: 36.8,
    bpSystole: 120,
    bpdyastole: 70,
    pulse: 84,
    resp: 20,
    bloodsugar: 98.81,
    height: 78,
    weight: 87,
    bmi: 36.3,
    duration: "2 week agao",
    doctor: "Dr. Amina Nazir Hussain",
    date_doctor: "2018-01-01 06:00 AM - Dr. Amina Nazir Hussain"
  },
  {
    date: "2018-01-01 07:00 AM",
    oral: 36.8,
    bpSystole: 120,
    bpdyastole: 70,
    pulse: 70,
    resp: 22,
    bloodsugar: 100,
    height: 78,
    weight: 87,
    bmi: 36,
    duration: "2 week agao",
    doctor: "Dr. Amina Nazir Hussain",
    date_doctor: "2018-01-01 07:00 AM - Dr. Amina Nazir Hussain"
  },
  {
    date: "2018-01-01 12:00 PM",
    oral: 36,
    bpSystole: 100,
    bpdyastole: 33,
    pulse: 87,
    resp: 21,
    bloodsugar: 60,
    height: 78,
    weight: 87,
    bmi: 36,
    duration: "2 week agao",
    doctor: "Dr. Ahmad Mustafa",
    date_doctor: "2018-01-01 12:00 PM - Dr. Ahmad Mustafa"
  }
];

export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TreeTable
        //Most recent 3 rows are expanded
        //expanded={{ 0: true, 1: true, 2: true, 3: true }}
        data={_data}
        pivotBy={["date_doctor"]}
        columns={[
          {
            accessor: "date_doctor",
            Cell: props => <span>{props.date_doctor + "Hal lalalalalala"}</span>
          },

          {
            Header: "Temp. Oral",
            accessor: "oral"
          },
          {
            Header: "BP Systole",
            accessor: "bpSystole"
          },
          {
            Header: "bp Dyastole",
            accessor: "bpdyastole"
          },
          {
            Header: "Pulse",
            accessor: "pulse"
          },
          {
            Header: "Respiratory",
            accessor: "resp"
          },
          {
            Header: "Blood Sugar",
            accessor: "bloodsugar"
          },
          {
            Header: "Height",
            accessor: "height"
          },
          {
            Header: "Weight",
            accessor: "weight"
          },
          {
            Header: "BMI",
            accessor: "bmi"
          },
          {
            Header: "Duration",
            accessor: "duration"
          }
        ]}
        defaultPageSize={10}
      />
    );
  }
}
