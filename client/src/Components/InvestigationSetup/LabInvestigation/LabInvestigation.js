import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Paper from "@material-ui/core/Paper";

import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";

import "./LabInvestigation.css";
import "./../../../styles/site.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  analyteidhandle,
  containeridhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabInvestigation
} from "./LabInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";

class LabInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.InvestigationIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }
  componentDidMount() {
    this.props.getLabsection({
      uri: "/labmasters/selectSection",
      method: "GET",
      redux: {
        type: "SECTION_GET_DATA",
        mappingName: "labsection"
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

    this.props.getLabAnalytes({
      uri: "/labmasters/selectAnalytes",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "labanalytes"
      }
    });

    this.props.getLabContainer({
      uri: "/labmasters/selectContainer",
      method: "GET",
      redux: {
        type: "CONTAINER_GET_DATA",
        mappingName: "labcontainer"
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-lab-investigation-form">
              {/* <div className="hptl-phase1-add-advance-form"> */}
              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "lab_section_id",
                      isImp: true
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
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "specimen_id",
                      isImp: true
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
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "container_id",
                      isImp: true
                    }}
                    selector={{
                      name: "container_id",
                      className: "select-fld",
                      value: this.state.container_id,
                      dataSource: {
                        textField: "description",
                        valueField: "hims_d_lab_container_id",
                        data: this.props.labcontainer
                      },
                      onChange: containeridhandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "send_out_test"
                    }}
                    selector={{
                      name: "send_out_test",
                      className: "select-fld",
                      value: this.state.send_out_test,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>

                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "available_in_house",
                      isImp: true
                    }}
                    selector={{
                      name: "available_in_house",
                      className: "select-fld",
                      value: this.state.available_in_house,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "external_facility_required"
                    }}
                    selector={{
                      name: "external_facility_required",
                      className: "select-fld",
                      value: this.state.external_facility_required,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "priority"
                    }}
                    selector={{
                      name: "priority",
                      className: "select-fld",
                      value: this.state.priority,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_INVPRIORITY
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "facility_description"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "facility_description",
                      value: this.state.facility_description,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />
                </div>
                <Paper className="Paper">
                  <div className="row form-details">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "analyte_id"
                      }}
                      selector={{
                        name: "analyte_id",
                        className: "select-fld",
                        value: this.state.analyte_id,
                        dataSource: {
                          textField: "description",
                          valueField: "hims_d_lab_analytes_id",
                          data: this.props.labanalytes
                        },
                        onChange: analyteidhandle.bind(this, this, context)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "normal_low"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "normal_low",
                        value: this.state.normal_low,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "normal_high"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "normal_high",
                        value: this.state.normal_high,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "critical_low"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "critical_low",
                        value: this.state.critical_low,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "critical_high"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "critical_high",
                        value: this.state.critical_high,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />

                    <div className="col-lg-1">
                      <IconButton className="go-button" color="primary">
                        <PlayCircleFilled
                          onClick={AddAnalytes.bind(this, this, context)}
                        />
                      </IconButton>
                    </div>
                  </div>
                  <div className="row form-details">
                    <div className="col-lg-12">
                      <div className="analyte-section">
                        <AlgaehDataGrid
                          id="analyte_grid"
                          columns={[
                            {
                              fieldName: "analyte_id",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "analytes_id" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.labanalytes === undefined
                                    ? []
                                    : this.props.labanalytes.filter(
                                        f =>
                                          f.hims_d_lab_analytes_id ===
                                          row.analyte_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].description
                                      : ""}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "visit_status",
                                      className: "select-fld",
                                      value: row.analyte_id,
                                      dataSource: {
                                        textField: "description",
                                        valueField: "hims_d_lab_analytes_id",
                                        data: this.props.labanalytes
                                      },
                                      others: {
                                        disabled: true
                                      },
                                      onChange: null
                                    }}
                                  />
                                );
                              },
                              disabled: true
                            },
                            {
                              fieldName: "normal_low",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "normal_low" }}
                                />
                              )
                            },
                            ,
                            {
                              fieldName: "normal_high",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "normal_high" }}
                                />
                              )
                            },
                            {
                              fieldName: "critical_low",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "critical_low" }}
                                />
                              )
                            },
                            {
                              fieldName: "critical_high",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "critical_high" }}
                                />
                              )
                            }
                          ]}
                          keyId="analyte_id"
                          dataSource={{
                            data: this.state.analytes
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteLabInvestigation.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: row => {},

                            onDone: updateLabInvestigation.bind(
                              this,
                              this,
                              context
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Paper>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    labspecimen: state.labspecimen,
    labsection: state.labsection,
    labanalytes: state.labanalytes,
    labcontainer: state.labcontainer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabsection: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getLabContainer: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabInvestigation)
);
