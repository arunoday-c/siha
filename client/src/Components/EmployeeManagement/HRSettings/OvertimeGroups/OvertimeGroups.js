import React, { Component } from "react";
import "./overtime_groups.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

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
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getOvertimeGroups() {
    algaehApiCall({
      uri: "/employeesetups/getOvertimeGroups",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            overtime_groups: res.data.records
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
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employeesetups/deleteOvertimeGroups",
          data: {
            hims_d_overtime_group_id: data.hims_d_overtime_group_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getOvertimeGroups();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
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
      uri: "/employeesetups/updateOvertimeGroups",
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
        payment_type: data.payment_type
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
          uri: "/employeesetups/addOvertimeGroups",
          method: "POST",
          data: data,
          onSuccess: res => {
            debugger;
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
            debugger;
            swalMessage({
              title: err.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  changeChecks(e) {
    switch (e.target.name) {
      case "roc":
        this.setState({
          payment_type: "RT"
        });

        break;

      case "poc":
        this.setState({
          payment_type: "PC"
        });
        break;

      default:
        this.setState({
          payment_type: null
        });
        return;
    }
  }

  render() {
    return (
      <div className="overtime_groups">
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
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
                        <div className="col-12">
                          {/* <label>Calculation Method</label> */}
                          <div className="customRadio">
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="Rate per Hour"
                                name="roc"
                                checked={this.state.payment_type === "RT"}
                                onChange={this.changeChecks.bind(this)}
                              />
                              <span>Rate per Hour</span>
                            </label>

                            <label className="radio inline">
                              <input
                                type="radio"
                                value="% of Components"
                                name="poc"
                                checked={this.state.payment_type === "PC"}
                                onChange={this.changeChecks.bind(this)}
                              />
                              <span>% of Components</span>
                            </label>
                          </div>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Working Day",
                            isImp: true
                          }}
                          textBox={{
                            allowNegative: false,
                            className: "txt-fld",
                            name:
                              this.state.payment_type === "RT"
                                ? "working_day_rate"
                                : "working_day_hour",
                            value:
                              this.state.payment_type === "RT"
                                ? this.state.working_day_rate
                                : this.state.working_day_hour,
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
                            forceLabel: "Week Off",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name:
                              this.state.payment_type === "RT"
                                ? "weekoff_day_rate"
                                : "weekoff_day_hour",
                            value:
                              this.state.payment_type === "RT"
                                ? this.state.weekoff_day_rate
                                : this.state.weekoff_day_hour,
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
                            forceLabel: "Holiday",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name:
                              this.state.payment_type === "RT"
                                ? "holiday_rate"
                                : "holiday_hour",
                            value:
                              this.state.payment_type === "RT"
                                ? this.state.holiday_rate
                                : this.state.holiday_hour,
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
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Overtime Group List</h3>
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
                        )
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
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "payment_type",
                                className: "select-fld",
                                value: row.payment_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.OT_PAYMENT
                                },
                                others: {
                                  errormessage: "Field cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
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
                      data: this.state.overtime_groups
                    }}
                    isEditable={true}
                    filterable
                    paging={{ page: 0, rowsPerPage: 10 }}
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
