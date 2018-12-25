import React, { Component } from "react";
import "./leave_master.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class LeaveMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  addLeaveMaster() {}

  render() {
    return (
      <div className="leave_master">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "leave_code",
                value: this.state.leave_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "leave_description",
                value: this.state.leave_description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Leave Type",
                isImp: true
              }}
              selector={{
                name: "leave_type",
                className: "select-fld",
                value: this.state.leave_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_TYPE
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Leave Mode",
                isImp: true
              }}
              selector={{
                name: "leave_type",
                className: "select-fld",
                value: this.state.leave_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_MODE
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 21 }}
                className="btn btn-primary"
                id="srch-sch"
                onClick={this.addLeaveMaster.bind(this)}
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeaveMaster;
