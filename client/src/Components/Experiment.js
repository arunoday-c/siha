import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import {
  getDepartments,
  getSubDepartments
} from "../actions/CommonSetup/Department.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "material-ui/Button";
import SuccessDialog from "../utils/SuccessDialog.js";
import { AlgaehDateHandler } from "../Components/Wrapper/algaehWrapper";
class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date_of_birth: null
    };
  }

  calculateAge(c, x) {}

  render() {
    return (
      <Fragment>
        <AlgaehDateHandler
          div={{ className: "col-lg-6" }}
          label={{ fieldName: "date_of_birth", isImp: true }}
          textBox={{ className: "txt-fld" }}
          maxDate={new Date()}
          events={{
            onChange: this.calculateAge.bind(this, this)
          }}
          value={this.state.date_of_birth}
        />
        <br />
      </Fragment>
    );
  }
}
export default Experiment;
