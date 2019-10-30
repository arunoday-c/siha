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
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Encashment Details of:{" "}
                        <b>
                          {" "}
                          {this.state.emp_name
                            ? this.state.emp_name
                            : "--------"}
                        </b>
                      </h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="previousLeaveAppGrid_Cntr">
                        <AlgaehDataGrid
                          id="previousLeaveAppGrid"
                          datavalidate="previousLeaveAppGrid"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Action" }} />
                              ),
                              displayTemplate: row => {
                                return this.state.encash_authorized === "APR" ||
                                  this.state.encash_authorized === "REJ" ? (
                                  <span>
                                    <i
                                      style={{
                                        pointerEvents:
                                          this.state.encash_authorized === "SET"
                                            ? "none"
                                            : "",

                                        opacity:
                                          this.state.encash_authorized === "SET"
                                            ? "0.1"
                                            : ""
                                      }}
                                      className="fas fa-times"
                                      onClick={AuthorizeLEaveEncash.bind(
                                        this,
                                        this,
                                        "CAN",
                                        row
                                      )}
                                    />
                                  </span>
                                ) : (
                                  <span>
                                    <i
                                      className="fas fa-thumbs-up"
                                      onClick={AuthorizeLEaveEncash.bind(
                                        this,
                                        this,
                                        "APR",
                                        row
                                      )}
                                    />
                                    <i
                                      className="fas fa-thumbs-down"
                                      onClick={AuthorizeLEaveEncash.bind(
                                        this,
                                        this,
                                        "REJ",
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              others: { maxWidth: 90 }
                            },

                            {
                              fieldName: "leave_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Leave Description" }}
                                />
                              )
                            },
                            {
                              fieldName: "leave_days",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "No. of Leave" }}
                                />
                              )
                            },
                            {
                              fieldName: "leave_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Encashment Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.leave_amount)}
                                  </span>
                                );
                              }
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: this.state.EncashDetailPer }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-12">
            <button onClick={this.props.onClose} className="btn btn-default">
              Close
            </button>
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
