import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./AccessionAcknowledgement.css";
import "./../../../styles/site.css";

import { texthandle, PatientSearch } from "./AccessionAcknowledgementHandaler";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../actions/algaehActions";
import variableJson from "../../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../../Options.json";

class AccessionAcknowledgement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_code: null,
      patient_name: null,
      gender: null,
      date_of_birth: 0,
      age: null,
      ordered_date: null,
      ordered_by: null,
      selectedLang: "en"
    };
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };
  render() {
    let sampleCollection =
      this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-accession-acknowledgement-form">
          <div className="container-fluid">
            <div className="row">
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
                  onClick={PatientSearch.bind(this, this)}
                  // onClick={this.PatientSearch.bind(this)}
                />
              </div>

              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ fieldName: "ordered_date" }}
                textBox={{ className: "txt-fld" }}
                events={{
                  onChange: null
                }}
                value={this.state.ordered_date}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "ordered_by"
                }}
                selector={{
                  name: "ordered_by",
                  className: "select-fld",
                  value: this.state.ordered_by,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_GENDER
                  },
                  onChange: null
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "test_name"
                }}
                selector={{
                  name: "test_name",
                  className: "select-fld",
                  value: this.state.test_name,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_GENDER
                  },
                  onChange: null
                }}
              />

              {/* <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "patient_name"
                }}
                textBox={{
                  value: this.state.patient_name,
                  className: "txt-fld",
                  name: "patient_name",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "gender",
                  isImp: true
                }}
                selector={{
                  name: "gender",
                  className: "select-fld",
                  value: this.state.gender,
                  dataSource: {
                    textField:
                      this.state.selectedLang == "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_GENDER
                  },
                  onChange: null,
                  others: {
                    disabled: true
                  }
                }}
              />
              <AlgaehDateHandler
                div={{ className: "col-lg-s" }}
                label={{ fieldName: "date_of_birth" }}
                textBox={{ className: "txt-fld" }}
                events={{
                  onChange: null
                }}
                disabled={true}
                value={this.state.date_of_birth}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "age"
                }}
                textBox={{
                  value: this.state.age,
                  className: "txt-fld",
                  name: "age",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              /> */}
            </div>
            {/* <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ fieldName: "ordered_date" }}
                textBox={{ className: "txt-fld" }}
                events={{
                  onChange: null
                }}
                disabled={true}
                value={this.state.ordered_date}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "ordered_by"
                }}
                textBox={{
                  value: this.state.ordered_by,
                  className: "txt-fld",
                  name: "ordered_by",

                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  others: {
                    disabled: true
                  }
                }}
              />
            </div> */}
            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="samplecollection_grid"
                  columns={[
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      )
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      )
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
                      }
                    },
                    {
                      fieldName: "ordered_by",
                      label: <AlgaehLabel label={{ fieldName: "ordered_by" }} />
                    },
                    {
                      fieldName: "sample_id",
                      label: <AlgaehLabel label={{ fieldName: "sample_id" }} />
                    },
                    {
                      fieldName: "lab_id_no",
                      label: <AlgaehLabel label={{ fieldName: "lab_id_no" }} />
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data:
                      this.props.samplecollection === undefined
                        ? []
                        : this.props.samplecollection
                  }}
                  paging={{ page: 0, rowsPerPage: 5 }}
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
  )(AccessionAcknowledgement)
);
