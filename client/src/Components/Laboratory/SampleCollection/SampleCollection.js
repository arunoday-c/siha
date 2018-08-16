import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Collections from "@material-ui/icons/Collections";

import "./SampleCollection.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getSampleCollectionDetails
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

import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

class SampleCollection extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      patient_code: null,
      patient_name: null,
      patient_id: null
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

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <div className="container-fluid">
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

              <div className="col-lg-1">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled
                    onClick={getSampleCollectionDetails.bind(this, this)}
                  />
                </IconButton>
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
                      fieldName: "service_code",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "investigation_code" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "investigation_name" }}
                        />
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
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "ordered_time" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.changeTimeFormat(row.ordered_date)}</span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "test_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.status === "O"
                          ? "Ordered"
                          : row.status === "CL"
                            ? "Collected"
                            : row.status === "CN"
                              ? "Cancelled"
                              : row.status === "CF"
                                ? "Confirmed"
                                : "Validated";
                      },
                      disabled: true
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton color="primary" title="Collection">
                              <Collections
                              // onClick={this.ShowEditModel.bind(this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.samplecollection === undefined
                        ? []
                        : this.props.samplecollection
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
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
