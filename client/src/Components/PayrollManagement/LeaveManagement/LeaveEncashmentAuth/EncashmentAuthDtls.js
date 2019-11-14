import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentAuth.scss";
import { AuthorizeLEaveEncash } from "./LeaveEncashmentAuthEvents.js";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  getAmountFormart,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";

class EncashmentAuthDtls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EncashDetailPer: [],
      emp_name: null,
      leave_encash_level: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).leave_encash_level,
      encash_authorized: null
    };
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.EncashDetailPer.length > 0) {
      this.setState({
        EncashDetailPer: newProps.EncashDetailPer,
        emp_name: newProps.emp_name,
        auth_level: newProps.auth_level,
        encash_authorized: newProps.encash_authorized
      });
    }
  }

  render() {
    return (
      <AlgaehModalPopUp
        class="leaveEncashAuthModal"
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        <div className="popupInner LeaveAuthPopup">
          <div className="popRightDiv">
            <div className="leave_en_auth row">
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Date"
                  }}
                />
                <h6>{this.state.encashment_date}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment No."
                  }}
                />
                <h6>{this.state.encashment_number}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Code"
                  }}
                />
                <h6>{this.state.employee_code}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Name"
                  }}
                />
                <h6>{this.state.full_name}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Description"
                  }}
                />
                <h6>{this.state.leave_description}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Applied Days"
                  }}
                />
                <h6>{this.state.leave_description}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Balance Days"
                  }}
                />
                <h6>{this.state.leave_description}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Amount"
                  }}
                />
                <h6>{this.state.leave_description}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-12">
            {" "}
            <button onClick={this.props.onClose} className="btn btn-primary">
              Authorize
            </button>
            <button onClick={this.props.onClose} className="btn btn-default">
              Cancel
            </button>{" "}
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

function mapStateToProps(state) {
  return {
    all_employees: state.all_employees,
    leaveMaster: state.leaveMaster,
    encashAuth: state.encashAuth,
    organizations: state.organizations,
    all_departments: state.all_departments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployees: AlgaehActions,
      getLeaveMaster: AlgaehActions,
      getOrganizations: AlgaehActions,
      getLeaveEncashLevels: AlgaehActions,
      getDepartments: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EncashmentAuthDtls)
);
