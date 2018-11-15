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
    this.state = {
      isOpen: false,
      Investigations: [],
      InvestigationName: [],
      test_id: null,
      investigation_type: null,
      category_id: null,
      lab_section_id: null,
      specimen_id: null,
      hims_d_investigation_test_id: null,
      InvestigationPop: {}
    };
  }

  componentDidMount() {
    this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      method: "GET",
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });

    this.props.getLabSpecimen({
      uri: "/labmasters/selectSpecimen",
      method: "GET",
      redux: {
        type: "SPECIMEN_GET_DATA",
        mappingName: "labspecimen"
      }
    });

    this.props.getLabsection({
      uri: "/labmasters/selectSection",
      method: "GET",
      redux: {
        type: "SECTION_GET_DATA",
        mappingName: "labsection"
      }
    });

    this.props.getInvestigationDetails({
      uri: "/investigation/getInvestigTestList",
      method: "GET",
      redux: {
        type: "INSURANCE_PROVIDER_GET_DATA",
        mappingName: "investigationdetails"
      },
      afterSuccess: data => {
        let InvestigationName = Enumerable.from(data)
          .groupBy("$.hims_d_investigation_test_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              description: firstRecordSet.description,
              hims_d_investigation_test_id:
                firstRecordSet.hims_d_investigation_test_id
            };
          })
          .toArray();

        this.setState({ InvestigationName: InvestigationName });
      }
    });

    getInvestigations(this, this);
  }

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

  clearData(e) {
    this.setState(
      {
        test_id: null,
        investigation_type: null,
        category_id: null,
        lab_section_id: null,
        specimen_id: null
      },
      () => {
        getInvestigations(this, this);
      }
    );
  }

  render() {
    return (
      <div className="hims_investigationsetup">
        <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
          <div className="col-lg-12">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "investigation_type"
                }}
                selector={{
                  name: "investigation_type",
                  className: "select-fld",
                  value: this.state.investigation_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: FORMAT_LAB_RAD
                  },
                  onChange: texthandle.bind(this, this)
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
                    textField: "description",
                    valueField: "hims_d_investigation_test_id",
                    data: this.state.InvestigationName
                  },
                  onChange: texthandle.bind(this, this)
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
              <div className="col">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.clearData.bind(this)}
                  style={{ marginTop: 21 }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
              <a
                href="javascript:;"
                class="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i class="fas fa-plus" />
              </a>
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
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="investigationGridCntr">
                <AlgaehDataGrid
                  id="investigation_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={EditInvestigationTest.bind(
                                this,
                                this,
                                row
                              )}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
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
