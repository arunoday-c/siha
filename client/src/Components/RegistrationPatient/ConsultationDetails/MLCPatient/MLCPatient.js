import React, { Component } from "react";
import styles from "./MLCPatient.css";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import MyContext from "../../../../utils/MyContext.js";

import AlagehFormGroup from "../../../Wrapper/formGroup.js";
import AlgaehLabel from "../../../Wrapper/label.js";
import extend from "extend";

export default class MLCPatient extends Component {
  constructor(props) {
    super(props);
    this.state = extend(
      {
        MLCPATIENT: true
      },
      this.props.PatRegIOputs
    );
  }

  texthandle(val) {
    this.setState({
      value: val
    });
  }

  CheckboxhandleChange(e) {
    if (e.target.checked === true) {
      this.setState({
        MLCPATIENT: false
      });
    } else {
      this.setState({
        MLCPATIENT: true
      });
    }
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => (
          <div className="hptl-phase1-add-mlcpatient-form">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                  <Checkbox onChange={this.CheckboxhandleChange.bind(this)} />
                  <AlgaehLabel
                    label={{
                      fieldName: "is_mlc"
                    }}
                  />
                </div>

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "mlc_accident_reg_no",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "mlc_accident_reg_no",
                    value: this.state.mlc_accident_reg_no,
                    events: {
                      onChange: AddMlcHandlers(this, context).texthandle.bind(
                        this
                      )
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "mlc_police_station",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "mlc_police_station",
                    value: this.state.mlc_police_station,
                    events: {
                      onChange: AddMlcHandlers(this, context).texthandle.bind(
                        this
                      )
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "mlc_wound_certified_date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "mlc_wound_certified_date",
                    value: this.state.mlc_wound_certified_date,
                    events: {
                      onChange: AddMlcHandlers(this, context).texthandle.bind(
                        this
                      )
                    }
                  }}
                />
              </div>
              <br />
            </div>
          </div>
        )}
      </MyContext.Consumer>
    );
  }
}

function AddMlcHandlers(state, context) {
  context = context || null;
  return {
    texthandle: e => {
      state.setState({
        [e.target.name]: e.target.value
      });

      if (context != null) {
        context.updateState({ [e.target.name]: e.target.value });
      }
    }
  };
}
