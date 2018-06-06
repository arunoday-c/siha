import React, { Component } from "react";
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
import { AlagehAutoComplete } from "../Components/Wrapper/algaehWrapper";
class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true,
      title_id: ""
    };
  }

  titlehandle(x, c, e) {
    debugger;
  }

  render() {
    return (
      <AlagehAutoComplete
        div={{ className: "col-lg-3" }}
        label={{
          fieldName: "title_id",
          isImp: true
        }}
        selector={{
          name: "title_id",
          className: "select-fld",
          value: this.state.title_id,
          dataSource: {
            textField: "title",
            valueField: "his_d_title_id",
            data: [
              { title: "Mr", his_d_title_id: 1 },
              { title: "Mss", his_d_title_id: 2 },
              { title: "Doctor", his_d_title_id: 3 }
            ]
          },
          onChange: this.titlehandle.bind(this, this)
        }}
      />
    );
  }
}
export default Experiment;
