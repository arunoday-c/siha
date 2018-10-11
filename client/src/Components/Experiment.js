import React, { PureComponent } from "react";
import {
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "./Wrapper/algaehWrapper";
import "../Components/experiment.css";
export default class RadTemplate extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AlgaehDataGrid
        id="grd_test"
        columns={[
          {
            fieldName: "visit_type_code",
            label: <AlgaehLabel label={{ fieldName: "visit_code" }} />,
            displayTemplate: row => {
              return <label>{row.visit_type_code}</label>;
            },
            editorTemplate: row => {
              return (
                <AlagehAutoComplete
                  div={{}}
                  selector={{
                    name: "visit_status",
                    className: "select-fld",
                    value: row.visit_type_code,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: [
                        { name: "Editing1", value: 1 },
                        { name: "Editing2", value: 2 },
                        { name: "Editing3", value: 3 },
                        { name: "Editing4", value: 4 },
                        { name: "Editing5", value: 5 }
                      ]
                    },
                    onChange: slectedItem => {
                      debugger;
                      row["visit_type_code"] = slectedItem.value;
                    } //this.onchangegridcol.bind(this, row)
                  }}
                />
              );
            },
            className: drow => {
              if (drow.visit_type_code === 2) return "experiment";
            }
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          },
          {
            fieldName: "visit_desc",
            label: "Display Name"
          }
        ]}
        rowClassName={row => {
          debugger;
          return "greenCell";
        }}
        dataSource={{
          data: [
            {
              visit_type_code: 1,
              visit_desc: "Free Visit"
            },
            {
              visit_type_code: 2,
              visit_desc: "Current Visit"
            },
            {
              visit_type_code: 3,
              visit_desc: "Local Visit"
            },
            {
              visit_type_code: 4,
              visit_desc: "Non Consultation"
            },
            {
              visit_type_code: 5,
              visit_desc: "Lab Consultation"
            }
          ]
        }}
        isEditable={true}
        events={{
          onDone: row => {
            alert(JSON.stringify(row));
          }
        }}
      />
    );
  }
}
