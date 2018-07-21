import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";

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
      ordered_by: null
    };
  }

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

              <AlagehFormGroup
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
              />
            </div>
            <div className="row">
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
            </div>
            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="samplecollection_grid"
                  columns={[
                    {
                      fieldName: "collect",
                      label: <AlgaehLabel label={{ fieldName: "collect" }} />,
                      disabled: false
                    },
                    {
                      fieldName: "reject",
                      label: <AlgaehLabel label={{ fieldName: "reject" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "speciman_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "speciman_status" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "speciman",
                      label: <AlgaehLabel label={{ fieldName: "speciman" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "speciman_instruction",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "speciman_instruction" }}
                        />
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
