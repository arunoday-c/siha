import React, { Component } from "react";
import styles from "./MLCPatient.css";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from 'material-ui/TextField';
import Checkbox from "material-ui/Checkbox";
import MyContext from "../../../../utils/MyContext.js";
import frontLanguage from "../../Language.json";


export default class MLCPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MLCPATIENT: true
    };
  }

  handle(val) {
    debugger;
    this.setState({
      value: val
    });
    console.log("Pat Title", val);
  }

  CheckboxhandleChange(e) {
    debugger;
    console.log("Pat Title", e.target.checked);
    if (e.target.checked === true)
    {
      this.setState({
        MLCPATIENT: false
      });
    }
    else{
      this.setState({
        MLCPATIENT: true
      });
    }    
    console.log("Pat Title", this.state.MLCPATIENT);
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
                  <label>Is MLC</label>
                </div>

                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <label>
                    ACCIDENT REGISTRATION NUMBER<mark>*</mark>
                  </label>
                  <br />
                  <TextField disabled={this.state.MLCPATIENT} />
                </div>

                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                  <label>
                    POLICE STATION NAME<mark>*</mark>
                  </label>
                  <br />
                  <TextField disabled={this.state.MLCPATIENT} />
                </div>

                <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                  <label>
                    WOUND CERTIFIED DATE<mark>*</mark>
                  </label>
                  <br />
                  <TextField type="date" disabled={this.state.MLCPATIENT} />
                </div>
              </div>
              <br />
            </div>
          </div>
        )}
			</MyContext.Consumer>	
    );
  }
}
