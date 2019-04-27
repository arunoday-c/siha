import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./subjective.css";
// import Allergies from "../Allergies/Allergies";
// import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
// import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Vitals from "../Vitals/Vitals";
import LabResults from "../Assessment/LabResult/LabResult";
import RadResults from "../Assessment/RadResult/RadResult";

import { AlgaehActions } from "../../../actions/algaehActions";
import OrderedList from "../Assessment/OrderedList/OrderedList";

// import { assnotetexthandle } from "./SubjectiveHandler";

class BasicSubjective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Orders"
    };
    this.getMasters();
  }

  getMasters() {
    if (
      this.props.assdeptanddoctors === undefined ||
      this.props.assdeptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        method: "GET",
        redux: {
          type: "LAB_DEPT_DOCTOR_GET_DATA",
          mappingName: "assdeptanddoctors"
        }
      });
    }

    if (
      this.props.assservices === undefined ||
      this.props.assservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "assservices"
        }
      });
    }
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

  render() {
    return (
      <div className="subjective">
        <div className="row margin-top-15">
          {/* <div className="col-lg-3">
            <Vitals />
          </div> */}
          <div className="col">
            <div className="row">
              <div className="col-8">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Enter Chief Complaint",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {},
                              option: {
                                type: "textarea"
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Pain Level", isImp: false }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Severity Level",
                              isImp: false
                            }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlgaehDateHandler
                            div={{ className: "col-4" }}
                            label={{ forceLabel: "Onset Date", isImp: false }}
                            textBox={{
                              className: "txt-fld",
                              name: ""
                            }}
                            maxDate={new Date()}
                            events={{}}
                          />
                          <AlagehFormGroup
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Duration",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {},
                              option: {
                                type: "text"
                              }
                            }}
                          />
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Interval", isImp: false }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Chronic", isImp: false }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {/* <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Significant Signs</h3>
                    </div>
                  </div> */}
                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Enter Significant Signs",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {/* <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Order Service</h3>
                    </div>
                  </div> */}
                  <div className="portlet-body">Final Diag.</div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="tab-container toggle-section">
                  <ul className="nav">
                    <li
                      algaehtabs={"Orders"}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Orders"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"LabResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Lab Results"
                          }}
                        />
                      }
                    </li>
                    <li
                      algaehtabs={"RisResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "RIS Results"
                          }}
                        />
                      }
                    </li>
                    {/* <li
                            algaehtabs={"AssesmentsNotes"}
                            className={"nav-item tab-button"}
                            onClick={this.openTab.bind(this)}
                          >
                            {
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Assesments Notes"
                                }}
                              />
                            }
                          </li> */}
                  </ul>
                </div>

                <div className="grid-section">
                  {this.state.pageDisplay === "Orders" ? (
                    <OrderedList vat_applicable={this.props.vat_applicable} />
                  ) : this.state.pageDisplay === "LabResults" ? (
                    <LabResults />
                  ) : this.state.pageDisplay === "RisResults" ? (
                    <RadResults />
                  ) : null}
                  {/* this.state.pageDisplay === "AssesmentsNotes" ? (
                          <div className="row">
                            <div className="container-fluid">
                              <AlagehFormGroup
                                div={{ className: "col-lg-12 form-details" }}
                                label={{
                                  forceLabel: "Assesment Notes",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "assesment_notes",
                                  value: this.state.assesment_notes,
                                  others: {
                                    multiline: true,
                                    rows: "4",
                                    style: {
                                      height: "25vh"
                                    }
                                  },
                                  events: {
                                    onChange: assnotetexthandle.bind(this, this)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ) : null */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-1">
            <ul className="rightActionIcon">
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>{" "}
              <li>
                <i className="fas fa-pen" />
              </li>
            </ul>
          </div>
          {/* 
          <div className="col-lg-9">
            <ChiefComplaints />
            <div className="row">
              <div className="col-lg-6">
                <Allergies />
              </div>
              <div className="col-lg-6">
                <ReviewofSystems />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assdeptanddoctors: state.assdeptanddoctors,
    assservices: state.assservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BasicSubjective)
);
