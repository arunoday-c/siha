import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import {
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import "./FollowUp.scss";
import "../../../../styles/site.scss";

import {
  texthandle,
  addFollowUp,
  datehandle,
  radioChange,
  dateValidate
} from "./FollowUpEvents";

class FollowUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followup_comments: null,
      followup_type: "OP",
      followup_days: 0,
      followup_date: null,

      radioOP: true,
      radioIP: false
    };
  }

  render() {
    return (
      <div className="hptl-follow-up-form">
        <div className="col-lg-12">
          <div className="row">
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  name="followup_type"
                  value="OP"
                  checked={this.state.radioOP}
                  onChange={radioChange.bind(this, this)}
                />
                <span>OP Patient</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  name="followup_type"
                  value="IP"
                  checked={this.state.radioIP}
                  onChange={radioChange.bind(this, this)}
                />
                <span>IP Patient</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row" style={{ paddingBottom: "10px" }}>
          <AlagehFormGroup
            div={{ className: "col-lg-12" }}
            label={{
              forceLabel: "Reason"
            }}
            textBox={{
              className: "txt-fld",
              name: "followup_comments",
              value: this.state.followup_comments,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col-lg-4" }}
            label={{
              forceLabel: "Next Visit After"
            }}
            textBox={{
              className: "txt-fld",
              name: "followup_days",
              value: this.state.followup_days,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
          <span style={{ paddingTop: "4vh" }}>Days</span>
          <AlgaehDateHandler
            div={{ className: "col-lg-5" }}
            label={{ forceLabel: "New Visit Date" }}
            textBox={{ className: "txt-fld", name: "followup_date" }}
            minDate={new Date()}
            events={{
              onChange: datehandle.bind(this, this),
              onBlur: dateValidate.bind(this, this)
            }}
            value={this.state.followup_date}
          />
          <div className="actions" style={{ paddingTop: "3.5vh" }}>
            <button
              className="btn btn-primary btn-circle active"
              onClick={addFollowUp.bind(this, this)}
            >
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FollowUp)
);
