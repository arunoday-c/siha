import React, { Component } from "react";

import { AlagehAutoComplete } from "../../../Wrapper/algaehWrapper";
export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: ""
    };
  }
  onChangeAppointment(e) {
    debugger;
  }
  render() {
    return (
      <div>
        <AlagehAutoComplete
          div={{ className: "col-lg-12" }}
          label={{
            forceLabel: "Examination Type"
          }}
          selector={{
            name: "name",
            className: "select-fld",
            value: this.state.test,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: [
                { name: "Test Doctor", value: "1" },
                { name: "Test Doctor2", value: "2" },
                { name: "Test Doctor3", value: "3" },
                { name: "Test Doctor4", value: "4" },
                { name: "Test Doctor5", value: "5" }
              ]
            },
            onChange: this.onChangeAppointment.bind(this)
          }}
        />
      </div>
    );
  }
}
