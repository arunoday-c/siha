import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeeMaster.css";

import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";

import { AlgaehLabel, Modal } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import AHSnackbar from "../../../common/Inputs/AHSnackbar";

class EmployeeMaster extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "PersonalDetails", sidBarOpen: true };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  onClose = e => {
    // let IOputs = ItemSetup.inputParam();
    // this.setState({ ...this.state, ...IOputs }, () => {
    //   debugger;

    // });
    this.props.onClose && this.props.onClose(e);
  };

  componentDidMount() {
    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails"
      }
    });
  }

  render() {
    return (
      <div className="hims_employee_master">
        <Modal className="model-set" open={this.props.open}>
          <div className="hims_employee_master">
            <div className="algaeh-modal">
              <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="popupInner">
                <div className="tab-container toggle-section">
                  <ul className="nav">
                    <li
                      algaehtabs={"PersonalDetails"}
                      style={{ marginRight: 2 }}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "personal_details"
                          }}
                        />
                      }
                    </li>
                    <li
                      style={{ marginRight: 2 }}
                      algaehtabs={"CommissionSetup"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "commission_setup"
                          }}
                        />
                      }
                    </li>
                  </ul>
                </div>
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="employee-section">
                    {this.state.pageDisplay === "PersonalDetails" ? (
                      <PersonalDetails />
                    ) : this.state.pageDisplay === "CommissionSetup" ? (
                      <CommissionSetup />
                    ) : null}
                  </div>
                </MyContext.Provider>
              </div>

              <div className="popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4"> &nbsp;</div>

                    <div className="col-lg-8">
                      <button
                        // onClick={InsertUpdateItems.bind(this, this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        {this.state.hims_d_item_master_id === null ? (
                          <AlgaehLabel label={{ fieldName: "btnSave" }} />
                        ) : (
                          <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                        )}
                      </button>
                      <button
                        onClick={e => {
                          this.onClose(e);
                        }}
                        type="button"
                        className="btn btn-default"
                      >
                        Cancel
                      </button>
                      <AHSnackbar
                        open={this.state.open}
                        handleClose={this.handleClose}
                        MandatoryMsg={this.state.MandatoryMsg}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeMaster)
);
