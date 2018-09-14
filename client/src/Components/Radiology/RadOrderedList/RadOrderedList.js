import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./RadOrderedList.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  UpdateRadOrder,
  Refresh
} from "./RadOrderedListEvents";

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

class RadOrderedList extends Component {
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
      category_id: null,
      test_status: null,
      rad_test_list: [],
      selected_patient: null,
      isOpen: false
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
    getRadTestList(this, this);
  }
  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-rad-list-form">
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

              <div className="col-lg-1" style={{ paddingTop: "4vh" }}>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={getRadTestList.bind(this, this)}
                >
                  Load Data
                </button>
              </div>

              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Refresh">
                  <IconButton className="go-button" color="primary">
                    <i
                      class="fas fa-sync-alt"
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
                  id="Oedered_list_grid"
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
                      fieldName: "status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "test_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.status === "O"
                          ? "Ordered"
                          : row.status === "S"
                            ? "Scheduled"
                            : row.status === "UP"
                              ? "Under Process"
                              : row.status === "CN"
                                ? "Cancelled"
                                : row.status === "RC"
                                  ? "Result Confirmed"
                                  : "Result Avaiable";
                      }
                    },
                    {
                      fieldName: "scheduled_date_time",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "scheduled_date_time" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {this.changeDateFormat(row.scheduled_date_time)}
                          </span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            {/* <Tooltip title="Arrived"> */}
                            <IconButton
                              color="primary"
                              title="Arrived"
                              style={{ maxHeight: "4vh" }}
                            >
                              <i
                                className="fas fa-walking"
                                onClick={UpdateRadOrder.bind(this, this, row)}
                              />
                            </IconButton>
                            {/* </Tooltip> */}
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.props.radtestlist
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
    testcategory: state.testcategory,
    radtestlist: state.radtestlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTestCategory: AlgaehActions,
      getRadiologyTestList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadOrderedList)
);
