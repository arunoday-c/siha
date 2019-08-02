import React, { Component } from "react";
import "./overtime_groups.css";
import {
  AlagehFormGroup,
  // AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";
// import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";

class OvertimeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overtime_groups: [],
      payment_type: "RT"
    };
    this.getOvertimeGroups();
  }

  changeTexts(e) {
    switch (e.target.name) {
      case "payment_type":
        this.setState({
          [e.target.name]: e.target.value,
          working_day_hour: null,
          weekoff_day_hour: null,
          holiday_hour: null,
          working_day_rate: null,
          weekoff_day_rate: null,
          holiday_rate: null
        });
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
    }
  }

  getOvertimeGroups() {
    algaehApiCall({
      uri: "/hrsettings/getOvertimeGroups",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          let pc = Enumerable.from(res.data.records)
            .where(w => w.payment_type === "PC")
            .toArray();
          let rt = Enumerable.from(res.data.records)
            .where(w => w.payment_type === "RT")
            .toArray();

          this.setState({
            percentage_otgroup: pc,
            rate_otgroup: rt
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  deleteOvertimeGroup(data) {
    swal({
      title:
        "Are you sure you want to delete " +
        data.overtime_group_description +
        " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/hrsettings/updateOvertimeGroups",
          module: "hrManagement",
          data: {
            hims_d_overtime_group_id: data.hims_d_overtime_group_id,
            overtime_group_code: data.overtime_group_code,
            overtime_group_description: data.overtime_group_description,
            overtime_group_status: data.overtime_group_status,
            working_day_hour: data.working_day_hour,
            weekoff_day_hour: data.weekoff_day_hour,
            holiday_hour: data.holiday_hour,
            working_day_rate: data.working_day_rate,
            weekoff_day_rate: data.weekoff_day_rate,
            holiday_rate: data.holiday_rate,
            payment_type: data.payment_type,
            record_status: "I"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getOvertimeGroups();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  updateOvertimeGroups(data) {
    algaehApiCall({
      uri: "/hrsettings/updateOvertimeGroups",
      module: "hrManagement",
      data: {
        hims_d_overtime_group_id: data.hims_d_overtime_group_id,
        overtime_group_code: data.overtime_group_code,
        overtime_group_description: data.overtime_group_description,
        overtime_group_status: data.overtime_group_status,
        working_day_hour: data.working_day_hour,
        weekoff_day_hour: data.weekoff_day_hour,
        holiday_hour: data.holiday_hour,
        working_day_rate: data.working_day_rate,
        weekoff_day_rate: data.weekoff_day_rate,
        holiday_rate: data.holiday_rate,
        payment_type: data.payment_type,
        record_status: "A"
      },
      method: "PUT",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
          this.getOvertimeGroups();
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  clearState() {
    this.setState({
      overtime_group_code: null,
      overtime_group_description: null,
      working_day_hour: null,
      weekoff_day_hour: null,
      holiday_hour: null,
      working_day_rate: null,
      weekoff_day_rate: null,
      holiday_rate: null,
      payment_type: null
    });
  }

  addOvertimeGroups() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        let data = {
          overtime_group_code: this.state.overtime_group_code,
          overtime_group_description: this.state.overtime_group_description,
          overtime_group_status: this.state.overtime_group_status,
          working_day_hour: this.state.working_day_hour,
          weekoff_day_hour: this.state.weekoff_day_hour,
          holiday_hour: this.state.holiday_hour,
          working_day_rate: this.state.working_day_rate,
          weekoff_day_rate: this.state.weekoff_day_rate,
          holiday_rate: this.state.holiday_rate,
          payment_type: this.state.payment_type
        };

        algaehApiCall({
          uri: "/hrsettings/addOvertimeGroups",
          module: "hrManagement",
          method: "POST",
          data: data,
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.clearState();
              this.getOvertimeGroups();
            } else {
              swalMessage({
                title: res.data.message,
                type: "error"
              });
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="overtime_groups margin-top-15">
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Overtime Group</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12">
                  <div className="row">
                    <div className="col slctYearBranchSec">
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Group Code",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "overtime_group_code",
                            value: this.state.overtime_group_code,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-8" }}
                          label={{
                            forceLabel: "Group Description",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "overtime_group_description",
                            value: this.state.overtime_group_description,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div
                      className="col-12 algaehLabelFormGroup"
                      style={{ marginBottom: 15, paddingBottom: 15 }}
                    >
                      <label className="algaehLabelGroup">Payment Type</label>
                      <div className="row">
                        <div className="col-12 margin-bottom-15">
                          {/* <label>Calculation Method</label> */}
                          <div className="customRadio">
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="RT"
                                name="payment_type"
                                checked={this.state.payment_type === "RT"}
                                onChange={this.changeTexts.bind(this)}
                              />
                              <span>Rate per Hour</span>
                            </label>

                            <label className="radio inline">
                              <input
                                type="radio"
                                value="PC"
                                name="payment_type"
                                checked={this.state.payment_type === "PC"}
                                onChange={this.changeTexts.bind(this)}
                              />
                              <span>% of Components</span>
                            </label>
                          </div>
                        </div>

                        {this.state.payment_type === "PC" ? (
                          <React.Fragment>
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Working Hour",
                                isImp: true
                              }}
                              textBox={{
                                allowNegative: false,
                                className: "txt-fld",
                                name: "working_day_hour",
                                value: this.state.working_day_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Week-off Hour",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_hour",
                                value: this.state.weekoff_day_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Holiday Hour",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_hour",
                                value: this.state.holiday_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                          </React.Fragment>
                        ) : this.state.payment_type === "RT" ? (
                          <React.Fragment>
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Working Hour",
                                isImp: true
                              }}
                              textBox={{
                                allowNegative: false,
                                className: "txt-fld",
                                name: "working_day_hour",
                                value: this.state.working_day_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Week-off Hour",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_hour",
                                value: this.state.weekoff_day_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Holiday Hour",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_hour",
                                value: this.state.holiday_hour,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Working Rate",
                                isImp: true
                              }}
                              textBox={{
                                allowNegative: false,
                                className: "txt-fld",
                                name: "working_day_rate",
                                value: this.state.working_day_rate,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Week-off Rate",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_rate",
                                value: this.state.weekoff_day_rate,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Holiday Rate",
                                isImp: true
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_rate",
                                value: this.state.holiday_rate,
                                events: {
                                  onChange: this.changeTexts.bind(this)
                                },
                                others: {
                                  type: "number",
                                  checkvalidation: "$value <= 0",
                                  errormessage: "Please Select a proper value"
                                }
                              }}
                            />
                          </React.Fragment>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        style={{
                          float: "right",
                          marginRight: -15
                        }}
                        onClick={this.addOvertimeGroups.bind(this)}
                        className="btn btn-primary"
                      >
                        Add to List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Rate per Hour</h3>
                </div>
              </div>
              <div className="portlet-body" data-validate="OTDiv">
                <div id="GroupListGrid_Cntr">
                  <AlgaehDataGrid
                    datavalidate="data-validate='OTDiv'"
                    columns={[
                      {
                        fieldName: "overtime_group_code",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                        disable: true
                      },
                      {
                        fieldName: "overtime_group_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "overtime_group_description",
                                value: row.overtime_group_description,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "payment_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.payment_type === "PC"
                                ? "% of Component"
                                : row.payment_type === "RT"
                                ? "Rate per Hour"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.payment_type === "PC"
                                ? "% of Component"
                                : row.payment_type === "RT"
                                ? "Rate per Hour"
                                : "------"}
                            </span>
                            // <AlagehAutoComplete
                            //   div={{ className: "col" }}
                            //   selector={{
                            //     name: "payment_type",
                            //     className: "select-fld",
                            //     value: row.payment_type,
                            //     dataSource: {
                            //       textField: "name",
                            //       valueField: "value",
                            //       data: GlobalVariables.OT_PAYMENT
                            //     },
                            //     others: {
                            //       errormessage: "Field cannot be blank",
                            //       required: true
                            //     },
                            //     onChange: this.changeGridEditors.bind(this, row)
                            //   }}
                            // />
                          );
                        }
                      },
                      {
                        fieldName: "working_day_hour",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Working Day Hour" }}
                          />
                        ),
                        displayTemplate: row => {
                          return <span> {row.working_day_hour}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "working_day_hour",
                                value: row.working_day_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "weekoff_day_hour",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Week Off Day Hour" }}
                          />
                        ),
                        displayTemplate: row => {
                          return <span>{row.weekoff_day_hour}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_hour",
                                value: row.weekoff_day_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "holiday_hour",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Hour" }} />
                        ),
                        displayTemplate: row => {
                          return <span> {row.holiday_hour}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_hour",
                                value: row.holiday_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "working_day_rate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Working Day Rate" }}
                          />
                        ),
                        displayTemplate: row => {
                          return <span>{row.working_day_rate}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "working_day_rate",
                                value: row.working_day_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "weekoff_day_rate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Week Off Rate" }}
                          />
                        ),
                        displayTemplate: row => {
                          return <span>{row.weekoff_day_rate}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_rate",
                                value: row.weekoff_day_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "holiday_rate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Rate" }} />
                        ),
                        displayTemplate: row => {
                          return <span> {row.holiday_rate}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_rate",
                                value: row.holiday_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_employee_group_id"
                    dataSource={{
                      data: this.state.rate_otgroup
                    }}
                    isEditable={true}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteOvertimeGroup.bind(this),
                      onDone: this.updateOvertimeGroups.bind(this)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">% of Components</h3>
                </div>
              </div>
              <div className="portlet-body" data-validate="OTDiv">
                <div id="GroupListGrid_Cntr">
                  <AlgaehDataGrid
                    datavalidate="data-validate='OTDiv'"
                    columns={[
                      {
                        fieldName: "overtime_group_code",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />
                        // others: {
                        //   filterable: true
                        // }
                      },
                      {
                        fieldName: "overtime_group_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "overtime_group_description",
                                value: row.overtime_group_description,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "payment_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.payment_type === "PC"
                                ? "% of Component"
                                : row.payment_type === "RT"
                                ? "Rate per Hour"
                                : "------"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.payment_type === "PC"
                                ? "% of Component"
                                : row.payment_type === "RT"
                                ? "Rate per Hour"
                                : "------"}
                            </span>
                            // <AlagehAutoComplete
                            //   div={{ className: "col" }}
                            //   selector={{
                            //     name: "payment_type",
                            //     className: "select-fld",
                            //     value: row.payment_type,
                            //     dataSource: {
                            //       textField: "name",
                            //       valueField: "value",
                            //       data: GlobalVariables.OT_PAYMENT
                            //     },
                            //     others: {
                            //       errormessage: "Field cannot be blank",
                            //       required: true
                            //     },
                            //     onChange: this.changeGridEditors.bind(this, row)
                            //   }}
                            // />
                          );
                        }
                      },
                      {
                        fieldName: "working_day_rate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Working Day" }} />
                        ),
                        displayTemplate: row => {
                          return row.payment_type === "RT" ? (
                            <span>{row.working_day_rate}</span>
                          ) : (
                            <span> {row.working_day_hour}</span>
                          );
                        },
                        editorTemplate: row => {
                          return row.payment_type === "RT" ? (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "working_day_rate",
                                value: row.working_day_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          ) : (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "working_day_hour",
                                value: row.working_day_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "weekoff_day_rate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Week Off" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.payment_type === "RT"
                                ? row.weekoff_day_rate
                                : row.weekoff_day_hour}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return row.payment_type === "RT" ? (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_rate",
                                value: row.weekoff_day_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          ) : (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "weekoff_day_hour",
                                value: row.weekoff_day_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "holiday_rate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {" "}
                              {row.payment_type === "RT"
                                ? row.holiday_rate
                                : row.holiday_hour}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return row.payment_type === "RT" ? (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_rate",
                                value: row.holiday_rate,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          ) : (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "holiday_hour",
                                value: row.holiday_hour,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Field - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_employee_group_id"
                    dataSource={{
                      data: this.state.percentage_otgroup
                    }}
                    isEditable={true}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteOvertimeGroup.bind(this),
                      onDone: this.updateOvertimeGroups.bind(this)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OvertimeGroups;
