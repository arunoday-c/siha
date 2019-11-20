import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import Enumerable from "linq";
import "./InvestigationSetup.scss";
import "../../styles/site.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import {
  getInvestigations,
  EditInvestigationTest
} from "./InvestigationSetupEvent";

import moment from "moment";
import Options from "../../Options.json";
import NewInvestigation from "./NewInvestigation/NewInvestigation";
import InvestigationComments from "./InvestigationComments/InvestigationComments"
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      // Investigations: [],
      InvestigationName: [],
      test_id: null,
      investigation_type: null,
      category_id: null,
      lab_section_id: null,
      specimen_id: null,
      hims_d_investigation_test_id: null,
      InvestigationPop: {},
      investigations_data: [],
      isCommentsOpen: false,
      investigation_test_id: null,
      test_name: null,
      comments_data: []
    };
  }

  componentDidMount() {
    if (
      this.props.invtestcategory === undefined ||
      this.props.invtestcategory.length === 0
    ) {
      this.props.getTestCategory({
        uri: "/labmasters/selectTestCategory",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "INVTESTCATEGORY_GET_DATA",
          mappingName: "invtestcategory"
        }
      });
    }
    if (
      this.props.labspecimen === undefined ||
      this.props.labspecimen.length === 0
    ) {
      this.props.getLabSpecimen({
        uri: "/labmasters/selectSpecimen",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SPECIMEN_GET_DATA",
          mappingName: "labspecimen"
        }
      });
    }
    if (
      this.props.labsection === undefined ||
      this.props.labsection.length === 0
    ) {
      this.props.getLabsection({
        uri: "/labmasters/selectSection",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SECTION_GET_DATA",
          mappingName: "labsection"
        }
      });
    }
    getInvestigations(this, this);

  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      InvestigationPop: {}
    });

    this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      module: "laboratory",
      method: "GET",
      data: { investigation_type: "L" },
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
      },
      () => {
        if (e === true) {
          getInvestigations(this, this);
        }
      }
    );
  }

  CloseCommentModel(e) {
    this.setState({
      isCommentsOpen: !this.state.isCommentsOpen,
      investigation_test_id: null,
      test_name: null,
      comments_data: []
    });
  }

  OpenComments(row) {
    debugger
    algaehApiCall({
      uri: "/investigation/getTestComments",
      module: "laboratory",
      data: { investigation_test_id: row.hims_d_investigation_test_id },
      method: "GET",
      onSuccess: response => {
        debugger
        if (response.data.success === true) {
          this.setState({
            isCommentsOpen: !this.state.isCommentsOpen,
            investigation_test_id: row.hims_d_investigation_test_id,
            test_name: row.description,
            comments_data: response.data.records
          });
        }
      }
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
    // let _Investigations = Enumerable.from(this.props.investigationdetails)
    //   .groupBy("$.hims_d_investigation_test_id", null, (k, g) => {
    //     let firstRecordSet = Enumerable.from(g).firstOrDefault();
    //     return {
    //       available_in_house: firstRecordSet.available_in_house,
    //       category_id: firstRecordSet.category_id,
    //       cpt_id: firstRecordSet.cpt_id,
    //       description: firstRecordSet.description,
    //       external_facility_required: firstRecordSet.external_facility_required,
    //       facility_description: firstRecordSet.facility_description,
    //       film_category: firstRecordSet.film_category,
    //       film_used: firstRecordSet.film_used,
    //       hims_d_investigation_test_id:
    //         firstRecordSet.hims_d_investigation_test_id,
    //       investigation_type: firstRecordSet.investigation_type,
    //       lab_section_id: firstRecordSet.lab_section_id,
    //       priority: firstRecordSet.priority,
    //       restrict_by: firstRecordSet.restrict_by,
    //       restrict_order: firstRecordSet.restrict_order,
    //       screening_test: firstRecordSet.screening_test,
    //       send_out_test: firstRecordSet.send_out_test,
    //       short_description: firstRecordSet.short_description,
    //       specimen_id: firstRecordSet.specimen_id,
    //       services_id: firstRecordSet.services_id,
    //       hims_m_lab_specimen_id: firstRecordSet.hims_m_lab_specimen_id,
    //       analytes_required: firstRecordSet.test_section === "M" ? false : true,
    //       container_id: firstRecordSet.container_id,
    //       analytes: g.getSource(),
    //       RadTemplate: g.getSource()
    //     };
    //   })
    //   .toArray();
    return (
      <div className="hims_investigationsetup">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
              <a
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
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
                onClose={this.CloseModel.bind(this)}
                InvestigationPop={this.state.InvestigationPop}
              />

              <InvestigationComments
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      forceLabel: "Test Comments",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isCommentsOpen}
                onClose={this.CloseCommentModel.bind(this)}
                investigation_test_id={this.state.investigation_test_id}
                test_name={this.state.test_name}
                comments_data={this.state.comments_data}
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
                            <i
                              className="fas fa-plus"
                              style={{
                                pointerEvents:
                                  row.investigation_type === "R"
                                    ? "none"
                                    : "",
                                opacity:
                                  row.investigation_type === "R"
                                    ? "0.1"
                                    : ""
                              }}
                              onClick={this.OpenComments.bind(this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        filterable: false,
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
                          this.props.invtestcategory === undefined
                            ? []
                            : this.props.invtestcategory.filter(
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
                              ? display[0].SpeDescription
                              : ""}
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="investigation_code"
                  dataSource={{
                    data: this.state.investigations_data
                  }}
                  // isEditable={true}
                  filter={true}
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
    invtestcategory: state.invtestcategory,
    labspecimen: state.labspecimen,
    labsection: state.labsection,
    testcategory: state.testcategory
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
