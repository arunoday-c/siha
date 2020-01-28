import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabInvestigation.scss";
import "./../../../styles/site.scss";
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
  deleteLabAnalyte,
  onchangegridcol,
  ageValidater
} from "./LabInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
import { swalMessage } from "../../../utils/algaehApiCall";

class LabInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.InvestigationIOputs;
    this.setState({ ...this.state, ...InputOutput });
    // this.clearInputState();
  }

  componentDidMount() {
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
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes"
        }
      });
    }
    if (
      this.props.labcontainer === undefined ||
      this.props.labcontainer.length === 0
    ) {
      this.props.getLabContainer({
        uri: "/labmasters/selectContainer",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "CONTAINER_GET_DATA",
          mappingName: "labcontainer"
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState(newProps.InvestigationIOputs);
  }

  // componentWillUnmount() {
  //   this.clearInputState();
  // }

  // clearInputState() {
  //   this.setState({
  //     analyte_id: "",
  //     analyte_type: "",
  //     result_unit: "",
  //     gender: "",
  //     from_age: "",
  //     to_age: "",
  //     critical_low: "",
  //     critical_high: "",
  //     normal_low: "",
  //     normal_high: ""
  //   });
  // }

  genderHandle(context, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({
      [name]: value
    });

    if (context !== undefined) {
      context.updateState({
        [name]: value
      });
    }
  }

  ageTypeHandle(context, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    let isError = false;

    if (value === "D" && parseFloat(this.state.to_age) > 30) {
      swalMessage({
        type: "warning",
        title: "To Age cannot be greater than 30 Days"
      });
      isError = true;
    } else if (value === "M" && parseFloat(this.state.to_age) > 12) {
      swalMessage({
        type: "warning",
        title: "To Age cannot be greater than 12 Months"
      });
      isError = true;
    }

    if (isError === true) {
      this.setState({
        [name]: null
      });
      context.updateState({
        [name]: null
      });
    } else {
      this.setState({
        [name]: value
      });

      if (context !== undefined) {
        context.updateState({
          [name]: value
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="row">
              <div className="col-3">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 mandatory form-group" }}
                    label={{
                      fieldName: "specimen_id",
                      isImp: true
                    }}
                    selector={{
                      name: "specimen_id",
                      className: "select-fld",
                      value: this.state.specimen_id,
                      dataSource: {
                        textField: "SpeDescription",
                        valueField: "hims_d_lab_specimen_id",
                        data: this.props.labspecimen
                      },
                      onChange: texthandle.bind(this, this, context),
                      others: {
                        tabIndex: "5"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 mandatory form-group" }}
                    label={{
                      fieldName: "container_id",
                      isImp: true
                    }}
                    selector={{
                      name: "container_id",
                      className: "select-fld",
                      value: this.state.container_id,
                      dataSource: {
                        textField: "ConDescription",
                        valueField: "hims_d_lab_container_id",
                        data: this.props.labcontainer
                      },
                      onChange: containeridhandle.bind(this, this, context),
                      others: {
                        tabIndex: "6"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 mandatory form-group" }}
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
                      onChange: texthandle.bind(this, this, context),
                      others: {
                        tabIndex: "7"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
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
              </div>
              <div
                className="col-9"
                style={{ borderLeft: "1px solid rgba(0,0,0,.1)" }}
              >
                {this.state.analytes_required === true ? (
                  <div>
                    <div className="row" data-validate="analyte_details">
                      <AlagehAutoComplete
                        div={{ className: "col-8 mandatory" }}
                        label={{
                          fieldName: "analyte_id",
                          isImp: true
                        }}
                        selector={{
                          name: "analyte_id",
                          className: "select-fld",
                          value: this.state.analyte_id,
                          dataSource: {
                            textField: "AnaDescription",
                            valueField: "hims_d_lab_analytes_id",
                            data: this.props.labanalytes
                          },
                          onChange: analyteidhandle.bind(this, this, context)
                        }}
                      />

                      <div className="col" style={{ padding: 0 }}>
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: 19 }}
                          onClick={AddAnalytes.bind(this, this, context)}
                        >
                          Add
                        </button>
                      </div>

                      <div className="col-12" id="analyte_grid_cntr">
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
                              }
                            }
                          ]}
                          keyId="analyte_id"
                          dataSource={{
                            data: this.state.analytes
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteLabAnalyte.bind(
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
                ) : null}
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
  connect(mapStateToProps, mapDispatchToProps)(LabInvestigation)
);
