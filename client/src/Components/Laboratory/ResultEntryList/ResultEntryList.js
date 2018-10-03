import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./ResultEntryList.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getSampleCollectionDetails,
  ResultEntryModel,
  closeResultEntry,
  Refresh
} from "./ResultEntryListHandaler";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  Tooltip
} from "../../Wrapper/algaehWrapper";

import {
  FORMAT_PRIORITY,
  FORMAT_TEST_STATUS
} from "../../../utils/GlobalVariables.json";

import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import ResultEntry from "../ResultEntry/ResultEntry";

class ResultEntryList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      isOpen: false
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

  componentDidMount() {
    getSampleCollectionDetails(this, this);
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-result-entry-form">
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
            className="container-fluid"
            style={{ marginTop: "85px", minHeight: "80vh" }}
          >
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ fieldName: "from_date" }}
                textBox={{ className: "txt-fld", name: "from_date" }}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ fieldName: "to_date" }}
                textBox={{ className: "txt-fld", name: "to_date" }}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.to_date}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
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
                  onClick={PatientSearch.bind(this, this)}
                />
              </div>
              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
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
                  onChange: texthandle.bind(this, this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
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
                  onChange: texthandle.bind(this, this)
                }}
              />

              <div className="col-lg-1" style={{ paddingTop: "4vh" }}>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={getSampleCollectionDetails.bind(this, this)}
                >
                  Load Data
                </button>
              </div>

              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Refresh">
                  <IconButton className="go-button" color="primary">
                    <i
                      className="fas fa-sync-alt"
                      aria-hidden="true"
                      onClick={Refresh.bind(this, this)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="samplecollection_grid"
                  columns={[
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      ),
                      disabled: false
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.changeDateFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "test_type",
                      label: <AlgaehLabel label={{ fieldName: "proiorty" }} />,
                      displayTemplate: row => {
                        return row.test_type == "S" ? "Stat" : "Rotuine";
                      },
                      disabled: true
                    },
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      displayTemplate: row => {
                        return row.status == "O"
                          ? "Ordered"
                          : row.status == "CL"
                            ? "Collected"
                            : row.status == "CN"
                              ? "Cancelled"
                              : row.status == "CF"
                                ? "Confirmed"
                                : "Validated";
                      },
                      disabled: true
                    },
                    {
                      fieldName: "lab_id_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Lab ID Number" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "sample_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sample Status" }} />
                      ),
                      displayTemplate: row => {
                        return row.sample_status == "N"
                          ? "Not Done"
                          : row.sample_status == "A"
                            ? "Accepted"
                            : row.sample_status == "R"
                              ? "Rejected"
                              : null;
                      },
                      disabled: true
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="Accept"
                              style={{ maxHeight: "4vh" }}
                            >
                              <i
                                className="fas fa-file-signature"
                                aria-hidden="true"
                                onClick={ResultEntryModel.bind(this, this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.state.sample_collection
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
          <ResultEntry
            open={this.state.isOpen}
            onClose={closeResultEntry.bind(this, this)}
            selectedPatient={this.state.selectedPatient}
          />
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
  )(ResultEntryList)
);
