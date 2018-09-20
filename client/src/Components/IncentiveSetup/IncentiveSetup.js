import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
// import AddCircle from "@material-ui/icons/AddCircle";
// import Update from "@material-ui/icons/Update";
import Enumerable from "linq";
import "./InvestigationSetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import {
  texthandle,
  getInvestigations,
  EditInvestigationTest
} from "./InvestigationSetupEvent";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { FORMAT_LAB_RAD } from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";
import NewInvestigation from "./NewInvestigation/NewInvestigation";
import AppBar from "@material-ui/core/AppBar";

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      InvestigationPop: {}
    });
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      isOpen: true
    });
  }

  render() {
    return (
      <div className="hims_incentive_setup">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "incentive_setup", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "investigation_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "incentive_setup", align: "ltr" }}
                />
              )
            }
          ]}
        />
        <div className="row">
          <div className="col-lg-12" style={{ marginTop: "75px" }}>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "employee_name"
                }}
                selector={{
                  name: "employee_name",
                  className: "select-fld",
                  value: this.state.employee_name,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: FORMAT_LAB_RAD
                  },
                  onChange: null
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "test_name"
                }}
                selector={{
                  name: "test_id",
                  className: "select-fld",
                  value: this.state.test_id,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: FORMAT_LAB_RAD
                  },
                  onChange: null
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "category_id"
                }}
                selector={{
                  name: "category_id",
                  className: "select-fld",
                  value: this.state.category_id,
                  dataSource: {
                    textField: "category_name",
                    valueField: "hims_d_test_category_id",
                    data: this.props.testcategory
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "lab_section_id"
                }}
                selector={{
                  name: "lab_section_id",
                  className: "select-fld",
                  value: this.state.lab_section_id,
                  dataSource: {
                    textField: "description",
                    valueField: "hims_d_lab_section_id",
                    data: this.props.labsection
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "specimen_id"
                }}
                selector={{
                  name: "specimen_id",
                  className: "select-fld",
                  value: this.state.specimen_id,
                  dataSource: {
                    textField: "description",
                    valueField: "hims_d_lab_specimen_id",
                    data: this.props.labspecimen
                  },
                  onChange: texthandle.bind(this, this)
                }}
              />
            </div>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="investigation_grid"
                  columns={[
                    {
                      fieldName: "investigation_type",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "investigation_type" }}
                        />
                      ),
                      displayTemplate: row => {
                        return row.investigation_type === "L"
                          ? "Lab"
                          : "Radiology";
                      }
                    },
                    {
                      fieldName: "description",
                      label: <AlgaehLabel label={{ fieldName: "test_name" }} />
                    },
                    {
                      fieldName: "category_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "category_id" }} />
                      ),

                      displayTemplate: row => {
                        let display =
                          this.props.testcategory === undefined
                            ? []
                            : this.props.testcategory.filter(
                                f =>
                                  f.hims_d_test_category_id === row.category_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].category_name
                                : display[0].category_name
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "lab_section_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "lab_section_id" }} />
                      ),

                      displayTemplate: row => {
                        let display =
                          this.props.labsection === undefined
                            ? []
                            : this.props.labsection.filter(
                                f =>
                                  f.hims_d_lab_section_id === row.lab_section_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].description
                                : display[0].description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "specimen_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "specimen_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.labspecimen === undefined
                            ? []
                            : this.props.labspecimen.filter(
                                f =>
                                  f.hims_d_lab_specimen_id === row.specimen_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].description
                                : display[0].description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="Add Template"
                              style={{ maxHeight: "4vh" }}
                            >
                              <Edit
                                onClick={EditInvestigationTest.bind(
                                  this,
                                  this,
                                  row
                                )}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="investigation_code"
                  dataSource={{
                    data: this.state.Investigations
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Start */}

        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.ShowModel.bind(this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_save", returnText: true }}
                  /> */}
                  Add New
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.clearData.bind(this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_save", returnText: true }}
                  /> */}
                  Clear
                </button>

                <NewInvestigation
                  HeaderCaption={
                    <AlgaehLabel
                      label={{
                        fieldName: "investigation_setup",
                        align: "ltr"
                      }}
                    />
                  }
                  open={this.state.isOpen}
                  onClose={this.ShowModel.bind(this)}
                  InvestigationPop={this.state.InvestigationPop}
                />
              </div>
            </div>
          </AppBar>
        </div>
        {/* Footer End */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    investigationdetails: state.investigationdetails,
    testcategory: state.testcategory,
    labspecimen: state.labspecimen,
    labsection: state.labsection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInvestigationDetails: AlgaehActions,
      getTestCategory: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabsection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvestigationSetup)
);
