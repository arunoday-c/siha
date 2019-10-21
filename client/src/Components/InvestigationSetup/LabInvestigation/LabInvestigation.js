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
  onchangegridcol
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
    this.clearInputState();
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

  componentWillReceiveProps(newProps) {
    this.setState(newProps.InvestigationIOputs);
  }

  componentWillUnmount() {
    this.clearInputState();
  }

  clearInputState() {
    this.setState({
      analyte_id: "",
      analyte_type: "",
      result_unit: "",
      gender: "",
      from_age: "",
      to_age: "",
      critical_low: "",
      critical_high: "",
      normal_low: "",
      normal_high: ""
    });
  }

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

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-lab-investigation-form">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory" }}
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
                  div={{ className: "col-3 mandatory" }}
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
                  div={{ className: "col-3 mandatory" }}
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
                  div={{ className: "col-3" }}
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

              {this.state.analytes_required === true ? (
                <div className="Paper">
                  <div className="row" data-validate="analyte_details">
                    <AlagehAutoComplete
                      div={{ className: "col-3" }}
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
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Gender",
                        isImp: true
                      }}
                      selector={{
                        name: "gender",
                        className: "select-fld",
                        value: this.state.gender,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_GENDER
                        },
                        onChange: e => this.genderHandle(context, e)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Age From",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_age",
                        value: this.state.from_age,
                        number: {
                          allowNegative: false
                        },
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Age To",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_age",
                        number: {
                          allowNegative: false
                        },
                        value: this.state.to_age,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Age Type",
                        isImp: true
                      }}
                      selector={{
                        name: "age_type",
                        className: "select-fld",
                        value: this.state.age_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.LAB_AGE_TYPE
                        },
                        onChange: e => this.genderHandle(context, e)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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

                    <div className="col" style={{ padding: 0 }}>
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 19 }}
                        onClick={AddAnalytes.bind(this, this, context)}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="row">
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
                          },
                          {
                            fieldName: "gender",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Gender" }} />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "gender",
                                    className: "select-fld",
                                    value: row.gender.toUpperCase(),
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: variableJson.FORMAT_GENDER
                                    },
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "from_age",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Age from" }} />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "from_age",
                                    number: {
                                      allowNegative: false
                                    },
                                    value: row.from_age,
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "to_age",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Age to" }} />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "to_age",
                                    number: {
                                      allowNegative: false
                                    },
                                    others: {
                                      type: "number"
                                    },
                                    value: row.to_age,
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "age_type",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Age Type" }} />
                            ),
                            displayTemplate: row => {
                              let display = variableJson.LAB_AGE_TYPE.filter(
                                f => f.value === row.age_type
                              );

                              return (
                                <span>
                                  {display !== null && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "age_type",
                                    className: "select-fld",
                                    value: row.age_type,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: variableJson.LAB_AGE_TYPE
                                    },
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "normal_low",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "normal_low" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_low,
                                    className: "txt-fld",
                                    name: "normal_low",
                                    others: {
                                      type: "number"
                                    },
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "normal_high",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "normal_high" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_high,
                                    className: "txt-fld",
                                    name: "normal_high",
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "critical_low",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "critical_low" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.critical_low,
                                    className: "txt-fld",
                                    name: "critical_low",
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "critical_high",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "critical_high" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.critical_high,
                                    className: "txt-fld",
                                    name: "critical_high",
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
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
                          onDelete: deleteLabAnalyte.bind(this, this, context),
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
