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
      analyteDetail: [],
      loading: false,
      refresh: false
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
        if (hims_d_lab_analytes_id) {
          const result = await this.getAnalyteDetail(hims_d_lab_analytes_id);
          console.log("result.data.records", result.data.records);
          this.setState({
            analyteDetail: result.data.records,
            refresh: false,
            loading: false
          });
        }
      } catch (e) {
        this.setState({ refresh: false, loading: false });
        swalMessage({
          type: "error",
          title: e.message
        });
      }
    }
  }

  getAnalyteDetail = analyte_id => {
    this.setState({ loading: true });
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
    this.setState({ loading: true });
    const { hims_d_lab_analytes_id } = this.props.active;
    input.analyte_id = hims_d_lab_analytes_id;
    input.from_oprator =
      input.from_oprator === "notselected" ? null : input.from_oprator;
    input.to_operator =
      input.to_operator === "notselected" ? null : input.to_operator;
    input.low_operator =
      input.low_operator === "notselected" ? null : input.low_operator;
    input.high_operator =
      input.high_operator === "notselected" ? null : input.high_operator;
    try {
      const res = await newAlgaehApi({
        uri: "/labmasters/addAnalyteRages",
        module: "laboratory",
        method: "POST",
        data: [input]
      });
      if (res.data.success) {
        this.setState({ refresh: true, loading: false });
      }
    } catch (e) {
      this.setState({ loading: false });
      swalMessage({
        type: "error",
        title: e.message
      });
    }
  };

  updateAnalyte = async row => {
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

  deleteAnalyte = async row => {
    try {
      this.setState({ loading: true });
      const { hims_d_lab_analytes_range_id } = row;
      const res = await newAlgaehApi({
        uri: "/labmasters/deleteAnalyteRage",
        module: "laboratory",
        method: "DELETE",
        data: { hims_d_lab_analytes_range_id }
      });
      if (res.data.success) {
        this.setState({
          refresh: true,
          loading: false
        });
      }
      swalMessage({ type: "Success", title: "Deleted Successfully" });
    } catch (e) {
      this.setState({
        loading: false
      });
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
    const name = e.name || e.target.name;
    const value = e.value || e.target.value;
    if (
      name === "from_oprator" ||
      name === "to_operator" ||
      name === "low_operator" ||
      name === "high_operator"
    ) {
      row[name] = value === "notselected" ? null : value;
    } else {
      row[name] = value;
    }

    row.update({ ...row });
  };

  render() {
    const { active } = this.props;
    const isQuality = active.analyte_type === "QU";
    const isQuantity = active.analyte_type === "QN";
    const isText = active.analyte_type === "T";
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
              {/* Range Input */}
              <RangeInput
                addAnalyte={this.addAnalyte}
                analyteType={active.analyte_type}
              />
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
                                  data: variableJson.LEAVE_GENDER
                                },
                                onChange: e => this.handleChange(row, e)
                              }}
                            />
                          );
                        }
                      },
                      // {
                      //   fieldName: "from_oprator",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "From Operator" }}
                      //     />
                      //   ),
                      //   displayTemplate: row => {
                      //     return row.from_oprator === null
                      //       ? "Not Selected"
                      //       : row.from_oprator;
                      //   },
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehAutoComplete
                      //         div={{}}
                      //         selector={{
                      //           sort: "off",
                      //           name: "from_oprator",
                      //           className: "select-fld",
                      //           value:
                      //             row["from_oprator"] === null
                      //               ? "notselected"
                      //               : row["from_oprator"],
                      //           dataSource: {
                      //             textField: "name",
                      //             valueField: "value",
                      //             data: [
                      //               {
                      //                 name: "Not selected",
                      //                 value: "notselected"
                      //               },
                      //               { name: "=", value: "=" },
                      //               { name: "<", value: "<" },
                      //               { name: ">", value: ">" },
                      //               { name: ">=", value: ">=" },
                      //               { name: "<=", value: "<=" }
                      //             ]
                      //           },
                      //           onChange: e => this.handleChange(row, e)
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },
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
                      // {
                      //   fieldName: "to_operator",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "To Operator" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return row.to_operator === null
                      //       ? "Not Selected"
                      //       : row.to_operator;
                      //   },
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehAutoComplete
                      //         div={{}}
                      //         selector={{
                      //           sort: "off",
                      //           name: "to_operator",
                      //           className: "select-fld",
                      //           value:
                      //             row["to_operator"] === null
                      //               ? "notselected"
                      //               : row["to_operator"],
                      //           dataSource: {
                      //             textField: "name",
                      //             valueField: "value",
                      //             data: [
                      //               {
                      //                 name: "Not selected",
                      //                 value: "notselected"
                      //               },
                      //               { name: "=", value: "=" },
                      //               { name: "<", value: "<" },
                      //               { name: ">", value: ">" },
                      //               { name: ">=", value: ">=" },
                      //               { name: "<=", value: "<=" }
                      //             ]
                      //           },
                      //           onChange: e => this.handleChange(row, e)
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },
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
                                onChange: e => this.handleChange(row, e)
                              }}
                            />
                          );
                        }
                      },
                      // {
                      //   fieldName: "low_operator",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "Low Operator" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return row.low_operator === null
                      //       ? "Not Selected"
                      //       : row.low_operator;
                      //   },
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehAutoComplete
                      //         div={{}}
                      //         selector={{
                      //           sort: "off",
                      //           name: "low_operator",
                      //           className: "select-fld",
                      //           value:
                      //             row["low_operator"] === null
                      //               ? "notselected"
                      //               : row["low_operator"],
                      //           dataSource: {
                      //             textField: "name",
                      //             valueField: "value",
                      //             data: [
                      //               {
                      //                 name: "Not selected",
                      //                 value: "notselected"
                      //               },
                      //               { name: "=", value: "=" },
                      //               { name: "<", value: "<" },
                      //               { name: ">", value: ">" },
                      //               { name: ">=", value: ">=" },
                      //               { name: "<=", value: "<=" }
                      //             ]
                      //           },
                      //           onChange: e => this.handleChange(row, e)
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },

                      {
                        fieldName: "normal_low",
                        label: <AlgaehLabel label={{ forceLabel: "Low" }} />,
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
                        },
                        others: {
                          show: isQuantity
                        }
                      },
                      // {
                      //   fieldName: "high_operator",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "High Operator" }}
                      //     />
                      //   ),
                      //   displayTemplate: row => {
                      //     return row.high_operator === null
                      //       ? "Not Selected"
                      //       : row.high_operator;
                      //   },
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehAutoComplete
                      //         div={{}}
                      //         selector={{
                      //           sort: "off",
                      //           name: "high_operator",
                      //           className: "select-fld",
                      //           value:
                      //             row["high_operator"] === null
                      //               ? "notselected"
                      //               : row["high_operator"],
                      //           dataSource: {
                      //             textField: "name",
                      //             valueField: "value",
                      //             data: [
                      //               {
                      //                 name: "Not selected",
                      //                 value: "notselected"
                      //               },
                      //               { name: "=", value: "=" },
                      //               { name: "<", value: "<" },
                      //               { name: ">", value: ">" },
                      //               { name: ">=", value: ">=" },
                      //               { name: "<=", value: "<=" }
                      //             ]
                      //           },
                      //           onChange: e => this.handleChange(row, e)
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },
                      {
                        fieldName: "normal_high",
                        label: <AlgaehLabel label={{ forceLabel: "High" }} />,
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
                        },
                        others: {
                          show: isQuantity
                        }
                      },

                      {
                        fieldName: "text_value",
                        label: <AlgaehLabel label={{ forceLabel: "Text" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.text_value,
                                className: "txt-fld",
                                name: "text_value",
                                events: {
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          show: isText
                        }
                      },
                      {
                        fieldName: "normal_qualitative_value",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Qualitative Value" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.normal_qualitative_value,
                                className: "txt-fld",
                                name: "normal_qualitative_value",
                                events: {
                                  onChange: e => this.handleChange(row, e)
                                }
                              }}
                            />
                          );
                        },
                        others: {
                          show: isQuality
                        }
                      }
                    ]}
                    keyId="analyte_id"
                    dataSource={{
                      data: this.state.analyteDetail
                    }}
                    loading={this.state.loading}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: this.deleteAnalyte,
                      onEdit: row => { },
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
                    Close
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
