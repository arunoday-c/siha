import React, { Component } from "react";
import "./shift.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";

class Shift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      break: "N",
      shift_end_day: "SD"
    };
  }

  clearState() {
    this.setState({
      shift_code: "",
      shift_description: "",
      arabic_name: "",
      in_time1: null,
      in_time2: null,
      out_time1: null,
      out_time2: null,
      shift_abbreviation: "",
      shift_end_day: "SD",
      break_start: null,
      break_end: null
    });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ shifts: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  componentDidMount() {
    this.getShifts();
  }

  addShift(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/shiftAndCounter/addShiftMaster",
          module: "masterSettings",
          method: "POST",
          data: {
            shift_code: this.state.shift_code,
            shift_description: this.state.shift_description,
            arabic_name: this.state.arabic_name,
            in_time1: this.state.in_time1,
            out_time1: this.state.out_time1,
            in_time2: this.state.in_time2,
            out_time2: this.state.out_time2,
            break: this.state.break,
            break_start: this.state.break_start,
            break_end: this.state.break_end,
            shift_abbreviation: this.state.shift_abbreviation,
            shift_end_day: this.state.shift_end_day
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Shift added Successfully",
                type: "success"
              });

              this.getShifts();
              this.clearState();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  deleteShifts(data) {
    swal({
      title: "Delete the Shift " + data.shift_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shiftAndCounter/updateShiftMaster",
          module: "masterSettings",
          data: {
            shift_code: data.shift_code,
            record_status: "I",
            shift_description: data.shift_description,
            arabic_name: data.arabic_name,
            shift_status: data.shift_status,
            hims_d_shift_id: data.hims_d_shift_id,
            shift_end_day: data.shift_end_day
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getShifts();
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
          type: "warning"
        });
      }
    });
  }

  updateShifts(data) {
    algaehApiCall({
      uri: "/shiftAndCounter/updateShiftMaster",
      module: "masterSettings",
      data: {
        shift_code: data.shift_code,
        record_status: "A",
        shift_description: data.shift_description,
        arabic_name: data.arabic_name,
        shift_status: data.shift_status,
        hims_d_shift_id: data.hims_d_shift_id,
        in_time1: data.in_time1,
        out_time1: data.out_time1,
        in_time2: data.in_time2,
        out_time2: data.out_time2,
        break: data.break,
        break_start: data.break_start,
        break_end: data.break_end,
        shift_abbreviation: data.shift_abbreviation,
        shift_end_day: data.shift_end_day
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.getShifts();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="shift">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                fieldName: "shift_code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "shift_code",
                value: this.state.shift_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                fieldName: "shift_description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "shift_description",
                value: this.state.shift_description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group arabic-txt-fld" }}
              label={{
                fieldName: "arabic_name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "arabic_name",
                value: this.state.arabic_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Abbreviation",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "shift_abbreviation",
                value: this.state.shift_abbreviation,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "In Time 1",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "in_time1",
                value: this.state.in_time1,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "time"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Out Time 1",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "out_time1",
                value: this.state.out_time1,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "time"
                }
              }}
            />
          </div>
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "In Time 2",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "in_time2",
                value: this.state.in_time2,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "time"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Out Time 2",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "out_time2",
                value: this.state.out_time2,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "time"
                }
              }}
            />

            <div className="col-2">
              <label>Break</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="SD"
                    name="shift_end_day"
                    checked={this.state.shift_end_day === "SD"}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <span>Same Day</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="ND"
                    name="shift_end_day"
                    checked={this.state.shift_end_day === "ND"}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <span>Next Day</span>
                </label>
              </div>
            </div>

            <div className="col-2">
              <label>Break</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="Y"
                    name="break"
                    checked={this.state.break === "Y"}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <span>Yes</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="N"
                    name="break"
                    checked={this.state.break === "N"}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {this.state.break === "Y" ? (
              <React.Fragment>
                <AlagehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Break Start",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "break_start",
                    value: this.state.break_start,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "time"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{
                    forceLabel: "Break End",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "break_end",
                    value: this.state.break_end,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "time"
                    }
                  }}
                />
              </React.Fragment>
            ) : null}

            <div className="col form-group">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addShift.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div data-validate="shiftDiv" id="shiftGridCntr">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "shift_code",
                  label: <AlgaehLabel label={{ fieldName: "shift_code" }} />,
                  disabled: true
                },
                {
                  fieldName: "shift_description",
                  label: (
                    <AlgaehLabel label={{ fieldName: "shift_description" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "shift_description",
                          value: row.shift_description,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Description - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "arabic_name",
                  label: <AlgaehLabel label={{ fieldName: "arabic_name" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          value: row.arabic_name,
                          className: "txt-fld",
                          name: "arabic_name",
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Arabic Name - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "in_time1",
                  label: <AlgaehLabel label={{ forceLabel: "In Time 1" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.in_time1 !== null
                          ? moment(row.in_time1, "HH:mm:ss").format("hh:mm a")
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "in_time1",
                          value: row.in_time1,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "In Time 1 - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "out_time1",
                  label: <AlgaehLabel label={{ forceLabel: "Out Time 1" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.out_time1 !== null
                          ? moment(row.out_time1, "HH:mm:ss").format("hh:mm a")
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "out_time1",
                          value: row.out_time1,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Out Time 1 - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "in_time2",
                  label: <AlgaehLabel label={{ forceLabel: "In Time 2" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.in_time2 !== null
                          ? moment(row.in_time2, "HH:mm:ss").format("hh:mm a")
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "in_time2",
                          value: row.in_time2,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "In Time 2 - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "out_time2",
                  label: <AlgaehLabel label={{ forceLabel: "Out Time 2" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.out_time2 !== null
                          ? moment(row.out_time2, "HH:mm:ss").format("hh:mm a")
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "out_time2",
                          value: row.out_time2,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Out Time 2 - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "shift_end_day",

                  label: (
                    <AlgaehLabel label={{ forceLabel: "Shift End Date" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.shift_end_day === "SD"
                          ? "Same Date"
                          : row.shift_end_day === "ND"
                          ? "Next Date"
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "shift_end_day",
                          className: "select-fld",
                          value: row.shift_end_day,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.SHIFT_END
                          },
                          others: {
                            errormessage: "Status - cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "break",
                  label: <AlgaehLabel label={{ forceLabel: "Break" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.break === "Y"
                          ? "YES"
                          : row.break === "N"
                          ? "NO"
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "break",
                          className: "select-fld",
                          value: row.break,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_YESNO
                          },
                          others: {
                            errormessage: "Status - cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "break_start",
                  label: <AlgaehLabel label={{ forceLabel: "Break Start" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.break_start !== null
                          ? moment(row.break_start, "HH:mm:ss").format(
                              "hh:mm a"
                            )
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "break_start",
                          value: row.break_start,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Break Start - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "break_end",
                  label: <AlgaehLabel label={{ forceLabel: "Break End" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.break_end !== null
                          ? moment(row.break_end, "HH:mm:ss").format("hh:mm a")
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "break_end",
                          value: row.break_end,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Break End - cannot be blank",
                            required: true,
                            type: "time"
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "shift_abbreviation",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Shift Abbreviation" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "shift_abbreviation",
                          value: row.shift_abbreviation,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage:
                              "Shift Abbreviation - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "shift_status",
                  label: <AlgaehLabel label={{ fieldName: "shift_status" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.shift_status === "A" ? "Active" : "Inactive"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "shift_status",
                          className: "select-fld",
                          value: row.shift_status,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_STATUS
                          },
                          others: {
                            errormessage: "Status - cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="hims_d_shift_id"
              dataSource={{
                data: this.state.shifts
              }}
              filter={true}
              isEditable={true}
              filter={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteShifts.bind(this),
                onDone: this.updateShifts.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Shift;
