import React, { Component } from "react";
import "./phy_sch_setup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";
import Enumerable from "linq";
import { algaehApiCall } from "../../utils/algaehApiCall";
import swal from "sweetalert";
import moment from "moment";
import Modal from "@material-ui/core/Modal";

class PhySchSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: [],
      scheduleList: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      from_date: new Date(),
      to_date: new Date(),
      all: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      sub_department_id: null,
      department_error: false,
      department_error_text: "",
      openScheduler: false
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeChecks(e) {
    if (e.target.name === "All") {
      this.setState(
        {
          all: !this.state.all
        },
        () => {
          this.state.all
            ? this.setState({
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true
              })
            : this.setState({
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
              });
        }
      );
    } else {
      this.setState({ [e.target.name]: e.target.checked });
    }
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_department_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors }, () => {
        console.log("Docs", this.state.doctors);
      });
    });
  }

  getApptSchedule(e) {
    e.preventDefault();
    if (this.state.sub_department_id === null) {
      this.setState({
        department_error: true,
        department_error_text: "Please Select a department"
      });
    } else {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/appointment/getAppointmentSchedule",
        method: "GET",
        data: {
          sub_dept_id: this.state.sub_department_id,
          month: this.state.month,
          year: this.state.year
        },
        onSuccess: response => {
          if (response.data.success) {
            AlgaehLoader({ show: false });
            //console.log("RRRRR Data:", response.data.records);
            this.setState(
              {
                scheduleList: response.data.records,
                department_error_text: "",
                department_error: false
              },
              () => {
                console.log("Schedule List:", this.state.scheduleList);
              }
            );
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swal(error.message, {
            buttons: false,
            icon: "error",
            timer: 2000
          });
        }
      });
    }
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets,
            doctors: response.data.records.doctors
          });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  handleClose() {
    this.setState({ openScheduler: false });
  }

  render() {
    return (
      <div className="phy-sch-setup">
        <Modal open={this.state.openScheduler}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Scheduler</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12 divInner">
                <div className="row">
                  <div className="col-lg-3 divInnerLeft">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "department_name"
                      }}
                      selector={{
                        name: "sub_department_id",
                        className: "select-fld",
                        value: this.state.sub_department_id,
                        dataSource: {
                          textField: "sub_department_name",
                          valueField: "sub_department_id",
                          data: this.state.departments
                        },
                        onChange: this.deptDropDownHandler.bind(this)
                      }}
                      error={this.state.department_error}
                      helperText={this.state.department_error_text}
                    />
                    <label>Doctors</label>
                    <div className="bordered-layout">
                      <ul>
                        {this.state.doctors.map((data, index) => (
                          <li key={index}>
                            <input type="checkbox" />
                            <span
                              style={{
                                width: "80%"
                              }}
                            >
                              {data.full_name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-9 divInnerRight">
                    <div className="row">
                      <div className="col">
                        <div className="row">
                          <div className="col-lg-6">
                            <label>Date Range</label>
                            <div className="row">
                              <AlgaehDateHandler
                                div={{ className: "col-lg-6" }}
                                label={{ forceLabel: "From Date", isImp: true }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "from_date"
                                }}
                                events={{
                                  onChange: selectedDate => {
                                    this.setState({ from_date: selectedDate });
                                  }
                                }}
                                value={this.state.from_date}
                              />
                              <AlgaehDateHandler
                                div={{ className: "col-lg-6" }}
                                label={{ forceLabel: "To Date", isImp: true }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "to_date"
                                }}
                                events={{
                                  onChange: selectedDate => {
                                    this.setState({ to_date: selectedDate });
                                  }
                                }}
                                value={this.state.to_date}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <label>Working Hours</label>
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "From Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "from_time",
                                  value: this.state.from_time,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }

                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "To Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "to_time",
                                  value: this.state.to_time,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }

                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-6">
                            <label className="margin-top-15">Day Break 1</label>
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "From Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "from_break_hr1",
                                  value: this.state.from_break_hr1,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }
                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "To Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "to_break_hr1",
                                  value: this.state.to_break_hr1,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }

                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <label className="margin-top-15">Day Break 2</label>
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "From Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "from_break_hr2",
                                  value: this.state.from_break_hr2,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }
                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "To Time",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "to_break_hr2",
                                  value: this.state.to_break_hr2,
                                  events: {
                                    onChange: this.changeTexts.bind(this)
                                  },
                                  others: {
                                    type: "time"
                                  }
                                  // error: this.state.description_error,
                                  // helperText: this.state.description_error_text
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row margin-top-15">
                          <div className="col-lg-12">
                            <label>Working Days</label>
                            <div className="customCheckbox">
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="All"
                                  checked={this.state.all}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>All</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="sunday"
                                  checked={this.state.sunday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Sunday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="monday"
                                  checked={this.state.monday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Monday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="tuesday"
                                  checked={this.state.tuesday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Tuesday</span>
                              </label>

                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="wednesday"
                                  checked={this.state.wednesday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Wednesday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="thursday"
                                  checked={this.state.thursday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Thursday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="friday"
                                  checked={this.state.friday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Friday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="saturday"
                                  checked={this.state.saturday}
                                  onClick={this.changeChecks.bind(this)}
                                />
                                <span>Saturday</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <button
                type="button"
                className="btn btn-primary"
                //onClick={this.handleClose}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={this.handleClose.bind(this)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
        <div className="col-lg-12 card box-shadow-normal">
          <div className="row ">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_name"
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "sub_department_id",
                  data: this.state.departments
                },
                onChange: this.deptDropDownHandler.bind(this)
              }}
              error={this.state.department_error}
              helperText={this.state.department_error_text}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Select Month"
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-1" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />

            <div className="col-lg-1 form-group margin-top-15">
              <span
                style={{ cursor: "pointer" }}
                onClick={this.getApptSchedule.bind(this)}
                className="fas fa-search fa-2x"
              />
            </div>
          </div>
        </div>

        <div className="card box-shadow-normal">
          <div className="col-lg-12 divInner">
            <div className="row">
              <div className="col-lg-3 divInnerLeft">
                <div className="row">
                  <div className="col-lg-12">
                    <label>Available Schedules</label>
                    <div className="bordered-layout">
                      <ul>
                        {this.state.scheduleList.map((data, index) => (
                          <li key={index}>
                            <span
                              style={{
                                width: "80%"
                              }}
                            >
                              {data.schedule_description}
                            </span>
                            <i
                              id={data.appointment_schedule_header_id}
                              className="fas fa-edit fa-1x float-right"
                              style={{
                                cursor: "pointer"
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduler Start */}
              <div className="col-lg-9 divInnerRight">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="row">
                      <div className="col-lg-6">
                        <label>Date Range</label>
                        <div className="row">
                          <AlgaehDateHandler
                            div={{ className: "col-lg-6" }}
                            label={{ forceLabel: "From Date", isImp: true }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_date"
                            }}
                            events={{
                              onChange: selectedDate => {
                                this.setState({ from_date: selectedDate });
                              }
                            }}
                            value={this.state.from_date}
                          />
                          <AlgaehDateHandler
                            div={{ className: "col-lg-6" }}
                            label={{ forceLabel: "To Date", isImp: true }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_date"
                            }}
                            events={{
                              onChange: selectedDate => {
                                this.setState({ to_date: selectedDate });
                              }
                            }}
                            value={this.state.to_date}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label>Working Hours</label>
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "From Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_time",
                              value: this.state.from_time,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "To Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_time",
                              value: this.state.to_time,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <label className="margin-top-15">Day Break 1</label>
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "From Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_break_hr1",
                              value: this.state.from_break_hr1,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "To Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_break_hr1",
                              value: this.state.to_break_hr1,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label className="margin-top-15">Day Break 2</label>
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "From Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_break_hr2",
                              value: this.state.from_break_hr2,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "To Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_break_hr2",
                              value: this.state.to_break_hr2,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time"
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-15">
                      <div className="col-lg-12">
                        <label>Working Days</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="All"
                              checked={this.state.all}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>All</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="sunday"
                              checked={this.state.sunday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Sunday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="monday"
                              checked={this.state.monday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Monday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="tuesday"
                              checked={this.state.tuesday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Tuesday</span>
                          </label>

                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="wednesday"
                              checked={this.state.wednesday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Wednesday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="thursday"
                              checked={this.state.thursday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Thursday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="friday"
                              checked={this.state.friday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Friday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="saturday"
                              checked={this.state.saturday}
                              onClick={this.changeChecks.bind(this)}
                            />
                            <span>Saturday</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label>Selected Doctors</label>
                    <div className="bordered-layout">
                      <ul>
                        {this.state.scheduleList.map((data, index) => (
                          <li key={index}>
                            <span
                              style={{
                                width: "80%"
                              }}
                            >
                              {data.first_name + " " + data.last_name}
                            </span>
                            <i
                              id={data.appointment_schedule_header_id}
                              className="fas fa-edit fa-1x float-right"
                              style={{
                                cursor: "pointer"
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row float-right">
          <div className="col">
            <button className="btn btn-primary">Copy Current Schedule</button>
          </div>
          <div className="col">
            <button
              onClick={() => {
                this.setState({ openScheduler: true });
              }}
              className="btn btn-primary"
            >
              Create New
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PhySchSetup;
