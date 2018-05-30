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

class Experiment extends Component {
  constructor(props) {
    super(props);

    this.state = null;
  }

  rowGetter = i => {
    return this.props.departments;
  };
  componentDidMount() {
    this.props.getDepartments();
  }

  render() {
    return (
      <div>

          I Carry out my experiments on react here
        {/* <ReactDataGrid
          columns={[
            { name: "department_code", title: "Department Code" },
            { name: "department_name", title: "Department Name" },
            { name: "department_type", title: "Department Type" },
            { name: "created_date", title: "Department Date" },
            { name: "department_status", title: "STATUS" }
          ]}
          rowGetter={this.rowGetter}
          rowsCount={this.props.departments.length}
          minHeight={500}
        /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("in mapStateToProps");
  return {
    departments: state.departments.departments,

    subdepartments: state.subdepartments.subdepartments
  };
}

function mapDispatchToProps(dispatch) {
  console.log("in mapDispatchToProps");
  return bindActionCreators(
    {
      getDepartments: getDepartments,

      getSubDepartments: getSubDepartments
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Experiment)
);
