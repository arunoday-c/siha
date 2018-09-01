import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./RadResultEntry.css";
import "./../../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";

class RadResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-rad-work-list-form">
          <div className="container-fluid" />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    radtestlist: state.radtestlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadiologyTestList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadResultEntry)
);
