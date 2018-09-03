import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import IconButton from "@material-ui/core/IconButton";
import "./Assessment.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import {
  texthandle,
  insertInitialICDS,
  insertFinalICDS,
  selectdIcd,
  addFinalIcd
} from "./AssessmentEvents";
import OrderingServices from "./OrderingServices/OrderingServices";
import { AlgaehActions } from "../../../actions/algaehActions";

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Orders",
      sidBarOpen: true,
      diagnosis_type: null,
      InitialICDS: [],
      daignosis_id: null,
      icd_code: null,
      icd_description: null,
      finalICDS: [],
      f_icd_id: null,
      selectdIcd: []
    };
  }

  componentDidMount() {
    this.props.getIcdCodes({
      uri: "/icdcptcodes/selectIcdcptCodes",
      method: "GET",
      redux: {
        type: "ICDCODES_GET_DATA",
        mappingName: "icdcodes"
      }
    });
    debugger;
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
      <div className="hptl-ehr-assetment-details">
        <div className="col-lg-12">
          <div className="row margin-top-15">
            <div className="col-lg-6">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="row portlet-title">
                  <div className="col-lg-3 caption">
                    <h3 className="caption-subject">Initial Diagnosis</h3>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-lg-4" }}
                    label={{
                      fieldName: "daignosis_id"
                    }}
                    selector={{
                      name: "daignosis_id",
                      className: "select-fld",
                      value: this.state.daignosis_id,
                      dataSource: {
                        textField: "icd_description",
                        valueField: "hims_d_icd_id",
                        data: this.props.icdcodes
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <div className="col-lg-1 actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i
                        className="fas fa-plus"
                        onClick={insertInitialICDS.bind(this, this)}
                      />
                    </a>
                  </div>

                  <div className="col-lg-4 actions">
                    <Button
                      style={{ backgroundColor: "#D5D5D5" }}
                      size="small"
                      onClick={addFinalIcd.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Add to Final Diagnosis"
                        }}
                      />
                    </Button>
                  </div>
                </div>
                <div className="portlet-body">
                  <h4>
                    <AlgaehDataGrid
                      id="intial_icd"
                      columns={[
                        {
                          fieldName: "Actions",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Actions"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <Radio
                                  style={{ maxHeight: "10px" }}
                                  name="select"
                                  color="primary"
                                  onChange={selectdIcd.bind(this, this, row)}
                                  checked={row.radioselect == 1 ? true : false}
                                />
                                <IconButton
                                  color="primary"
                                  title="Delete"
                                  style={{ maxHeight: "4vh" }}
                                >
                                  <i class="fa fa-trash" />
                                </IconButton>
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "diagnosis_type",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Type"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.diagnosis_type === "P"
                              ? "Primary"
                              : "Secondary";
                          }
                        },
                        {
                          fieldName: "daignosis_id",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "ICD Code"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_code
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "icd_description",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Description"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_description
                                  : ""}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        data: this.state.InitialICDS
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 3 }}
                      events={
                        {
                          // onDelete: this.deleteVisaType.bind(this),
                          // onEdit: row => {},
                          // onDone: row => {
                          //   alert(JSON.stringify(row));
                          // }
                          // onDone: this.updateVisaTypes.bind(this)
                        }
                      }
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="row portlet-title">
                  <div className="col-lg-3 caption">
                    <h3 className="caption-subject">Final Diagnosis</h3>
                  </div>

                  <div className="col-lg-3">&nbsp;</div>
                  <AlagehAutoComplete
                    div={{ className: "col-lg-5" }}
                    label={{
                      fieldName: "icd_id"
                    }}
                    selector={{
                      name: "f_icd_id",
                      className: "select-fld",
                      value: this.state.f_icd_id,
                      dataSource: {
                        textField: "icd_description",
                        valueField: "hims_d_icd_id",
                        data: this.props.icdcodes
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />

                  <div className="col-lg-1 actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i
                        className="fas fa-plus"
                        onClick={insertFinalICDS.bind(this, this)}
                      />
                    </a>
                  </div>
                </div>
                <div className="portlet-body">
                  <h4>
                    <AlgaehDataGrid
                      id="intial_icd"
                      columns={[
                        {
                          fieldName: "Actions",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Actions"
                              }}
                            />
                          ),

                          displayTemplate: row => {
                            return (
                              <span>
                                <IconButton
                                  color="primary"
                                  title="Delete"
                                  style={{ maxHeight: "4vh" }}
                                >
                                  <i class="fa fa-trash" />
                                </IconButton>
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "diagnosis_type",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Type"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.diagnosis_type === "P"
                              ? "Primary"
                              : "Secondary";
                          }
                        },
                        {
                          fieldName: "daignosis_id",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "ICD Code"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_code
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "icd_description",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Description"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_description
                                  : ""}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        data: this.state.finalICDS
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 3 }}
                      events={
                        {
                          // onDelete: this.deleteVisaType.bind(this),
                          // onEdit: row => {},
                          // onDone: row => {
                          //   alert(JSON.stringify(row));
                          // }
                          // onDone: this.updateVisaTypes.bind(this)
                        }
                      }
                    />
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row margin-top-15">
            <div className="col-lg-12">
              <div className="tab-container toggle-section">
                <ul className="nav">
                  <li
                    algaehtabs={"Orders"}
                    style={{ marginRight: 2 }}
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
                    style={{ marginRight: 2 }}
                    algaehtabs={"Packages"}
                    className={"nav-item tab-button"}
                    onClick={this.openTab.bind(this)}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Packages"
                        }}
                      />
                    }
                  </li>
                  <li
                    style={{ marginRight: 2 }}
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
                    style={{ marginRight: 2 }}
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
                  <li
                    algaehtabs={"AssesmentsNotes"}
                    style={{ marginRight: 2 }}
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
                  </li>
                </ul>
              </div>
              <div className="grid-section">
                {this.state.pageDisplay === "Orders" ? (
                  <OrderingServices />
                ) : this.state.pageDisplay === "Packages" ? (
                  "Packages"
                ) : this.state.pageDisplay === "LabResults" ? (
                  "Lab Results"
                ) : this.state.pageDisplay === "RisResults" ? (
                  "Ris Results"
                ) : this.state.pageDisplay === "AssesmentsNotes" ? (
                  "Assesments Notes"
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    icdcodes: state.icdcodes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIcdCodes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Assessment)
);
