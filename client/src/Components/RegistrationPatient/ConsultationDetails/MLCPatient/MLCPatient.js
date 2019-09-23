import React, { Component } from "react";
import "./MLCPatient.scss";
import MyContext from "../../../../utils/MyContext.js";
import AlagehFormGroup from "../../../Wrapper/formGroup.js";
import AlgaehLabel from "../../../Wrapper/label.js";

export default class MLCPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MLCPATIENT: true
    };
  }

  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  CheckboxhandleChange(context, e) {
    if (e.target.checked === true) {
      this.setState(
        {
          MLCPATIENT: false,
          is_mlc: "N"
        },
        () => {
          if (context !== null) {
            context.updateState({ is_mlc: this.state.is_mlc });
          }
        }
      );
    } else {
      this.setState(
        {
          MLCPATIENT: true,
          is_mlc: "Y"
        },
        () => {
          if (context !== null) {
            context.updateState({ is_mlc: this.state.is_mlc });
          }
        }
      );
    }
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => (
          <div className="hptl-phase1-add-mlcpatient-form">
            <div className="col-lg-12">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "is_mlc"
                    }}
                  />
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        //value="ALL"
                        // name="hims_d_employee_id"
                        // checked={this.state.hims_d_employee_id === "ALL"}
                        onChange={this.CheckboxhandleChange.bind(this, context)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
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
                    },
                    disabled: this.state.MLCPATIENT
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
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
                    },
                    disabled: this.state.MLCPATIENT
                    // disabled: this.state.MLCPATIENT
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
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
                      ),
                      disabled: this.state.MLCPATIENT
                    },
                    disabled: this.state.MLCPATIENT
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

      if (context !== null) {
        context.updateState({ [e.target.name]: e.target.value });
      }
    }
  };
}
