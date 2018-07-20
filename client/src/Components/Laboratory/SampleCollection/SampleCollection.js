import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";

import "./SampleCollection.css";
import "./../../../styles/site.css";

import { texthandle, PatientSearch } from "./SampleCollectionHandaler";

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

class SampleCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to_date: null,
      from_date: null,
      patient_code: null,
      patient_name: null
    };
  }

  render() {
    let sampleCollection =
      this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <div className="container-fluid">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "from_date" }}
                textBox={{ className: "txt-fld" }}
                events={{
                  onChange: null
                }}
                value={this.state.from_date}
              />

              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "to_date" }}
                textBox={{ className: "txt-fld" }}
                events={{
                  onChange: null
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
                  }
                }}
              />

              <div className="col-lg-1 form-group">
                <span
                  className="fas fa-search fa-2x"
                  onClick={PatientSearch.bind(this)}
                  // onClick={this.PatientSearch.bind(this)}
                />
              </div>

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "patient_name"
                }}
                textBox={{
                  value: this.state.patient_name,
                  className: "txt-fld",
                  name: "patient_name",

                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  others: {
                    disabled: true
                  }
                }}
              />
            </div>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
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
                  onChange: null
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
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
                  onChange: null
                }}
              />

              <div className="col-lg-3">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled />
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
                      fieldName: "patient_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "investigation_code",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "investigation_code" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "investigation_name",
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
                      disabled: true
                    },
                    {
                      fieldName: "ordered_time",
                      label: (
                        <AlgaehLabel label={{ fieldName: "ordered_time" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "test_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "test_status" }} />
                      ),
                      disabled: true
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
