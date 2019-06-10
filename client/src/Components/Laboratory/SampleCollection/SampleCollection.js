import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./SampleCollection.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getSampleCollectionDetails,
  Refresh
} from "./SampleCollectionHandaler";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import {
  FORMAT_PRIORITY,
  FORMAT_TEST_STATUS
} from "../../../utils/GlobalVariables.json";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import SampleCollectionModal from "../SampleCollections/SampleCollections";
import MyContext from "../../../utils/MyContext.js";

class SampleCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      to_date: new Date(),
      // from_date: moment("01" + month + year, "DDMMYYYY")._d,
      from_date: new Date(),
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      status: null,
      isOpen: false,
      proiorty: null
    };
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  changeTimeFormat = date => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };

  ShowCollectionModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_patient: row
    });
  }
  CloseCollectionModel(e) {
    this.setState(
      {
        isOpen: !this.state.isOpen
      },
      () => {
        getSampleCollectionDetails(this, this);
      }
    );
  }

  componentDidMount() {
    getSampleCollectionDetails(this, this);
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <BreadCrumb
            title={
              <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      fieldName: "form_home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ fieldName: "form_name", align: "ltr" }}
                  />
                )
              }
            ]}
          />
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-6">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "from_date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "to_date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.to_date}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "patient_code"
                  }}
                  textBox={{
                    value: this.state.patient_code,
                    className: "txt-fld",
                    name: "patient_code",

                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <div className="col-lg-1 form-group">
                  <span
                    className="fas fa-search fa-2x"
                    style={{
                      fontSize: " 1.2rem",
                      marginTop: "6px",
                      paddingBottom: "10px"
                    }}
                    onClick={PatientSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "proiorty",
                    isImp: false
                  }}
                  selector={{
                    name: "proiorty",
                    className: "select-fld",
                    value: this.state.proiorty,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_PRIORITY
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          proiorty: null
                        },
                        () => {
                          getSampleCollectionDetails(this, this);
                        }
                      );
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "status",
                    isImp: false
                  }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_TEST_STATUS
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          status: null
                        },
                        () => {
                          getSampleCollectionDetails(this, this);
                        }
                      );
                    }
                  }}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "location_id",
                    isImp: false
                  }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_TEST_STATUS
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                /> */}
                <div className="col" style={{ paddingTop: "21px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={getSampleCollectionDetails.bind(this, this)}
                  >
                    Load
                  </button>
                  <button
                    className="btn btn-default btn-sm"
                    style={{ marginLeft: "10px" }}
                    type="button"
                    onClick={Refresh.bind(this, this)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Specimen Collection List
                    </h3>
                  </div>
                </div>

                <div className="portlet-body" id="samplecollectionGrid_cntr">
                  <AlgaehDataGrid
                    id="samplecollection_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-flask"
                                onClick={this.ShowCollectionModel.bind(
                                  this,
                                  row
                                )}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 70,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ fieldName: "status" }} />,
                        displayTemplate: row => {
                          return row.status === "O" ? (
                            <span className="badge badge-light">Ordered</span>
                          ) : row.status === "CL" ? (
                            <span className="badge badge-primary">
                              Collected
                            </span>
                          ) : row.status === "CN" ? (
                            <span className="badge badge-danger">
                              Cancelled
                            </span>
                          ) : row.status === "CF" ? (
                            <span className="badge badge-success">
                              Confirmed
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              Validated
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "visit_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_code" }} />
                        ),
                        disabled: false,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_code" }} />
                        ),
                        disabled: false,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_name" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "test_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "proiorty" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.test_type === "S" ? "Stat" : "Routine"}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "ordered_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                        ),
                        // displayTemplate: row => {
                        //   return (
                        //     <span>
                        //       {this.changeDateFormat(row.ordered_date)}
                        //     </span>
                        //   );
                        // },
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "number_of_tests",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "number_of_tests" }}
                          />
                        ),
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: this.state.sample_collection
                    }}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...obj });
              }
            }}
          >
            <SampleCollectionModal
              HeaderCaption={
                <AlgaehLabel
                  label={{
                    fieldName: "sample_collection",
                    align: "ltr"
                  }}
                />
              }
              open={this.state.isOpen}
              onClose={this.CloseCollectionModel.bind(this)}
              selected_patient={this.state.selected_patient}
            />
          </MyContext.Provider>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    samplecollection: state.samplecollection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSampleCollection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SampleCollection)
);
