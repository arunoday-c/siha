import React, { PureComponent } from "react";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../../hooks";
import RangeInput from "./RangeInput";
import variableJson from "../../../../utils/GlobalVariables.json";

class AnalytesRange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      analyteDetail: []
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.active &&
        this.props.active.hims_d_lab_analytes_id !==
          prevProps.active.hims_d_lab_analytes_id) ||
      this.state.refresh
    ) {
      const { hims_d_lab_analytes_id } = this.props.active;
      try {
        const result = await this.getAnalyteDetail(hims_d_lab_analytes_id);
        this.setState({ analyteDetail: result.data.records, refresh: false });
      } catch (e) {
        this.setState({ refresh: false });
        swalMessage({
          type: "error",
          title: e.message
        });
      }
    }
  }

  getAnalyteDetail = analyte_id => {
    return newAlgaehApi({
      uri: "/labmasters/getAnalyteRages",
      module: "laboratory",
      method: "GET",
      data: {
        analyte_id: analyte_id
      }
    });
  };

  addAnalyte = async input => {
    const { hims_d_lab_analytes_id } = this.props.active;
    input.analyte_id = hims_d_lab_analytes_id;
    try {
      const res = await newAlgaehApi({
        uri: "/labmasters/addAnalyteRages",
        module: "laboratory",
        method: "POST",
        data: [input]
      });
      if (res.data.success) {
        this.setState({ refresh: true });
      }
    } catch (e) {
      swalMessage({
        type: "error",
        title: e.message
      });
    }
  };

  updateAnalyte = async (row, another, hello) => {
    try {
      const res = await newAlgaehApi({
        uri: "/labmasters/updateAnalyteRage",
        module: "laboratory",
        data: row,
        method: "PUT"
      });
      if (res.data.success) {
        this.setState({ refresh: true });
      }
    } catch (e) {
      swalMessage({
        type: "error",
        title: e.message
      });
    }
  };

  onClose = e => {
    this.props.onClose && this.props.onClose(true);
  };

  handleChange = (row, e) => {
    console.log(row, "inputs");
    const name = e.name || e.target.name;
    const value = e.value || e.target.value;
    row[name] = value;
    row.update({ ...row });
  };

  render() {
    const { active } = this.props;
    return (
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
                  <h6>{active.description}</h6>
                </div>
              </div>
              <RangeInput addAnalyte={this.addAnalyte} />
              <div className="row">
                <div className="col-12" id="analyteRangeGridCntr">
                  {" "}
                  <AlgaehDataGrid
                    id="analyteRangeGrid"
                    columns={[
                      {
                        fieldName: "gender",
                        label: <AlgaehLabel label={{ forceLabel: "Gender" }} />,
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
                                },
                                onChange: e => this.handleChange(row, e)
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
                                },
                                onChange: e => this.handleChange(row, e)
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
                                  onChangeonChange: e =>
                                    this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "age_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Age Type" }} />
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
                                onChange: e => this.handleChange(row, e)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "to_age",
                        label: <AlgaehLabel label={{ forceLabel: "Age to" }} />,
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
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "normal_low",
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
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "normal_high",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "normal_high" }} />
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
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "critical_low",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "critical_low" }} />
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
                                  onChange: e => this.handleChange(row, e)
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
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="analyte_id"
                    dataSource={{
                      data: this.state.analyteDetail
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      // onDelete: deleteLabAnalyte.bind(this, this, context),
                      onEdit: row => {},

                      onDone: this.updateAnalyte
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
    );
  }
}

export default AnalytesRange;
