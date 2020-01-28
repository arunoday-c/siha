import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./Analyte.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";

import {
  texthandle,
  analyteidhandle,
  containeridhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabAnalyte,
  onchangegridcol,
  ageValidater
} from "./AnalytesRangeEvent";
import MyContext from "../../../utils/MyContext.js";
import { AlgaehActions } from "../../../actions/algaehActions";
import variableJson from "../../../utils/GlobalVariables.json";

class AnalytesRange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      InvestigationtypeEnable: false
    };
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

  onClose = e => {
    this.props.onClose && this.props.onClose(true);
    // let IOputs = InvestigationIOputs.inputParam();
    // IOputs.InvestigationtypeEnable = false;
    // this.setState({ ...this.state, ...IOputs }, () => {
    //   this.props.onClose && this.props.onClose(true);
    // });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    debugger;
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.open}
          >
            <div className="popupInner">
              <div className="col-12">
                <div className="row">
                  <div className="col margin-top-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Selected Analyte"
                      }}
                    />
                    <h6>Analyte Name</h6>
                  </div>
                </div>

                <div className="row" data-validate="analyte_range_details">
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Gender",
                      isImp: false
                    }}
                    selector={{
                      name: "gender",
                      className: "select-fld",
                      value: this.state.gender,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: variableJson.FORMAT_GENDER
                      }
                      // onChange: e => this.genderHandle(context, e)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "From Age Type",
                      isImp: false
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
                      // onChange: e => this.ageTypeHandle(context, e),
                      others: {
                        onBlur: ageValidater.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Age From",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_age",
                      value: this.state.from_age,
                      number: {
                        allowNegative: false
                      },
                      events: {
                        // onChange: texthandle.bind(this, this)
                      },
                      others: {
                        onBlur: ageValidater.bind(this, this)
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "To Age Type",
                      isImp: false
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
                      // onChange: e => this.ageTypeHandle(context, e),
                      others: {
                        onBlur: ageValidater.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Age To",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_age",
                      number: {
                        allowNegative: false
                      },
                      value: this.state.to_age,
                      events: {
                        // onChange: texthandle.bind(this, this)
                      },
                      others: {
                        onBlur: ageValidater.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "normal_low"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "normal_low",
                      value: this.state.normal_low,
                      events: {
                        // onChange: texthandle.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "normal_high"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "normal_high",
                      value: this.state.normal_high,
                      events: {
                        // onChange: texthandle.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "critical_low"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "critical_low",
                      value: this.state.critical_low,
                      events: {
                        // onChange: texthandle.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "critical_high"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "critical_high",
                      value: this.state.critical_high,
                      events: {
                        // onChange: texthandle.bind(this, this)
                      }
                    }}
                  />

                  <div className="col" style={{ padding: 0 }}>
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={AddAnalytes.bind(this, this)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12" id="analyteRangeGridCntr">
                    {" "}
                    <AlgaehDataGrid
                      id="analyteRangeGrid"
                      columns={[
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
                                    data: variableJson.EMP_FORMAT_GENDER
                                  }
                                  // onChange: onchangegridcol.bind(
                                  //   this,
                                  //   this,
                                  //   row
                                  // )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "age_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "From Age Type" }}
                            />
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
                                  }
                                  // onChange: onchangegridcol.bind(
                                  //   this,
                                  //   this,
                                  //   row
                                  // )
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
                                    // onChangeonChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "age_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "To Age Type" }}
                            />
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
                                  }
                                  // onChange: onchangegridcol.bind(
                                  //   this,
                                  //   this,
                                  //   row
                                  // )
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
                                    // onChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          forceLabel: "normal_low",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "normal_low" }} />
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
                                    // onChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
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
                              label={{ forceLabel: "normal_high" }}
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
                                    // onChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
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
                              label={{ forceLabel: "critical_low" }}
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
                                    // onChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
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
                              label={{ forceLabel: "critical_high" }}
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
                                    // onChange: onchangegridcol.bind(
                                    //   this,
                                    //   this,
                                    //   row
                                    // )
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
                        // onDelete: deleteLabAnalyte.bind(this, this, context),
                        onEdit: row => {}

                        // onDone: updateLabInvestigation.bind(this, this, context)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      //   onClick={InsertLabTest.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.state.hims_d_investigation_test_id === null ? (
                        <AlgaehLabel label={{ forceLabel: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ forceLabel: "btnUpdate" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    ingservices: state.ingservices,
    testcategory: state.testcategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getTestCategory: AlgaehActions,
      getLabsection: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getLabContainer: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AnalytesRange)
);
