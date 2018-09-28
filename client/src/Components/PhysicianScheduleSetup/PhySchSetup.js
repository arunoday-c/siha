import React, { Component } from "react";
import "./phy_sch_setup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel
} from "../Wrapper/algaehWrapper";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";
import Enumerable from "linq";
import { algaehApiCall } from "../../utils/algaehApiCall";
import swal from "sweetalert";
import moment from "moment";
import Modal from "@material-ui/core/Modal";
const provider_array = [];

class PhySchSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: [],
      scheduleList: [],
      scheduleDoctors: [],
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
      openScheduler: false,
      openModifier: true,
      send_obj: {},
      slot: "",
      schedule_status: "Y",
      from_work_hr: "",
      to_work_hr: "",
      work_break1: "",
      work_break2: "",
      from_break_hr1: "",
      to_break_hr1: "",
      from_break_hr2: "",
      to_break_hr2: "",
      disable: true,
      description_error: false,
      description_error_text: "",
      description: "",
      days: []
    };
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value,
      disable: false
    });
  }

  resetSaveState() {
    this.setState({
      description: "",
      all: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      slot: "",
      year: moment().year(),
      month: moment(new Date()).format("M"),
      schedule_status: "Y",
      from_work_hr: "",
      to_work_hr: "",
      work_break1: "",
      work_break2: "",
      from_break_hr1: "",
      to_break_hr1: "",
      from_break_hr2: "",
      to_break_hr2: ""
    });
  }

  checkHandle(e) {
    let myRow = JSON.parse(e.currentTarget.getAttribute("row"));
    myRow.schedule_status = this.state.schedule_status;
    myRow.default_slot = this.state.slot;
    myRow.from_work_hr = this.state.from_work_hr;
    myRow.to_work_hr = this.state.to_work_hr;
    myRow.work_break1 = this.state.work_break1;
    myRow.work_break2 = this.state.work_break2;
    myRow.from_break_hr1 = this.state.from_break_hr1;
    myRow.to_break_hr1 = this.state.to_break_hr1;
    myRow.from_break_hr2 = this.state.from_break_hr2;
    myRow.to_break_hr2 = this.state.to_break_hr2;

    const item = Enumerable.from(provider_array)
      .where(w => w.provider_id === myRow.provider_id)
      .firstOrDefault();
    if (item !== undefined) {
      provider_array.splice(provider_array.indexOf(item), 1);
    } else {
      provider_array.push(myRow);
    }

    console.log("Pushed:", provider_array);
  }

  saveApptSchedule(e) {
    e.preventDefault();
    if (this.state.description.length === 0) {
      this.setState({
        description_error: true,
        description_error_text: "Please Enter the Description"
      });
    } else {
      const myObj = {};
      myObj.sub_dept_id = this.state.sub_department_id;
      myObj.schedule_description = this.state.description;
      myObj.month = this.state.month;
      myObj.year = this.state.year;
      myObj.monday = this.state.monday ? "Y" : "N";
      myObj.tuesday = this.state.tuesday ? "Y" : "N";
      myObj.wednesday = this.state.wednesday ? "Y" : "N";
      myObj.thursday = this.state.thursday ? "Y" : "N";
      myObj.friday = this.state.friday ? "Y" : "N";
      myObj.saturday = this.state.saturday ? "Y" : "N";
      myObj.sunday = this.state.sunday ? "Y" : "N";
      myObj.from_work_hr = this.state.from_work_hr;
      myObj.to_work_hr = this.state.to_work_hr;
      myObj.work_break1 = this.state.from_break_hr1 ? "Y" : "N";
      myObj.from_break_hr1 = this.state.from_break_hr1;
      myObj.to_break_hr1 = this.state.to_break_hr1;
      myObj.work_break2 = this.state.from_break_hr2 ? "Y" : "N";
      myObj.from_break_hr2 = this.state.from_break_hr2;
      myObj.to_break_hr2 = this.state.to_break_hr2;
      myObj.from_date = this.state.from_date;
      myObj.to_date = this.state.to_date;

      for (let i = 0; i < provider_array.length; i++) {
        provider_array[i].slot = this.state.slot;
      }

      myObj.schedule_detail = provider_array;

      this.setState({ send_obj: myObj }, () => {
        console.log("ABC:", this.state.send_obj);

        algaehApiCall({
          uri: "/appointment/addAppointmentSchedule",
          methid: "POST",
          data: this.state.send_obj,
          onSuccess: response => {
            if (response.data.success) {
              this.resetSaveState();
              swal("Schedule Added Successfully", {
                buttons: false,
                icon: "success",
                timer: 2000
              });
              console.log("Save Response:", response.data.records);
            }
          },
          onFailure: error => {}
        });
      });
    }
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
                sunday: true,
                days: [0, 1, 2, 3, 4, 5, 6]
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
      this.setState({
        [e.target.name]: e.target.checked
      });
    }
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors }, () => {
        console.log("Docs", this.state.doctors);
      });
    });
  }

  loadDetails(e) {
    debugger;
    let header_id = e.currentTarget.getAttribute("id");

    let docs = Enumerable.from(this.state.scheduleList)
      .where(
        w => w.hims_d_appointment_schedule_header_id === parseInt(header_id)
      )
      .firstOrDefault();

    this.setState({
      scheduleDoctors: docs.detail
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
                scheduleDoctors: response.data.records.detail,
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
      uri: "/department/selectDoctorsAndClinic",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("New Depts:", response.data.records);
          this.setState({
            departments: response.data.records.departmets
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
    this.setState({ openScheduler: false, openModifier: false });
  }

  render() {
    return (
      <div className="phy-sch-setup">
        {/* Modify Modal Start */}
        <Modal open={this.state.openModifier}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Modify Working Hours</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12 margin-top-15">
                <div className="col-lg-12 card box-shadow-normal">
                  <div className="row ">
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        forceLabel: "Selected Doctor",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_time",
                        value: this.state.from_time,
                        events: {
                          onChange: null
                        },
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Selected From Date", isImp: true }}
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
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Selected To Date", isImp: true }}
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
                    <div className="col-lg-1 form-group margin-top-15">
                      <span className="fas fa-search fa-2x" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Appointment Dates</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlgaehDataGrid
                  id="sch-modify-grid"
                  columns={[
                    {
                      fieldName: "appt_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Appointment Date" }}
                        />
                      )
                    },
                    {
                      fieldName: "from_work_hr",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "From Work Hour" }} />
                      )
                    },
                    {
                      fieldName: "to_work_hr",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Work Hour" }} />
                      )
                    },
                    {
                      fieldName: "from_break_hr1",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Work Break 1" }} />
                      )
                    },
                    {
                      fieldName: "to_break_hr1",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Work Break 2" }} />
                      )
                    },
                    {
                      fieldName: "days",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Working Days" }} />
                      )
                    }
                  ]}
                  keyId="hims_d_appointment_status_id"
                  dataSource={{
                    data: []
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: () => {},
                    onDone: () => {}
                    // onDelete: this.deleteAppointmentStatus.bind(this),
                    // onDone: this.updateAppointmentStatus.bind(this)
                  }}
                />
              </div>
            </div>
            <div className="popupFooter">
              <button
                type="button"
                className="btn btn-primary"
                //onClick={this.handleClose}
              >
                Amend Timeslot
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
        {/* End of Modify Modal */}

        {/* New Schedule Modal Start */}
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
                          valueField: "sub_dept_id",
                          data: this.state.departments
                        },
                        onChange: this.deptDropDownHandler.bind(this)
                      }}
                      error={this.state.department_error}
                      helperText={this.state.department_error_text}
                    />
                    <label>Doctors</label>
                    <div className="bordered-layout">
                      <ul
                        style={
                          {
                            //  pointerEvents: this.state.disable ? "none" : ""
                          }
                        }
                      >
                        {this.state.doctors.map((data, index) => (
                          <li key={index}>
                            <input
                              row={JSON.stringify(data)}
                              onChange={this.checkHandle.bind(this)}
                              type="checkbox"
                            />
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
                      <AlagehFormGroup
                        div={{ className: "col-4" }}
                        label={{
                          forceLabel: "Schedule Description",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "description",
                          value: this.state.description,
                          events: {
                            onChange: this.changeTexts.bind(this)
                          },
                          error: this.state.description_error,
                          helperText: this.state.description_error_text
                        }}
                      />
                      {/* <div className="col">
                        <input type="checkbox" id="default_slot" />
                        <span>Set Default Slot</span>
                      </div> */}
                      <AlagehAutoComplete
                        div={{ className: "col-5" }}
                        label={{
                          forceLabel: "Select Slot Time"
                        }}
                        selector={{
                          name: "slot",
                          className: "select-fld",
                          value: this.state.slot,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.SLOTS
                          },
                          onChange: this.dropDownHandler.bind(this)
                        }}
                        //  error={this.state.department_error}
                        //  helperText={this.state.department_error_text}
                      />
                    </div>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-3" }}
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
                        div={{ className: "col-3" }}
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
                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
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
                        div={{ className: "col-lg-3" }}
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
                    <div className="row">
                      <label className="margin-top-15 col-12">
                        Working Hours
                      </label>
                      <AlagehFormGroup
                        div={{ className: "col-3" }}
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
                        div={{ className: "col-3" }}
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
            <div className="popupFooter">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.saveApptSchedule.bind(this)}
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
        {/* Schedule Modal End */}
        {/* Top Filter Start */}
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
                  valueField: "sub_dept_id",
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
        {/* Top Filter End */}

        <div className="card box-shadow-normal">
          <div className="col-lg-12 divInner">
            <div className="row">
              <div className="col-lg-3 divInnerLeft">
                <div className="row">
                  <div className="col-lg-12">
                    <label>Available Schedules</label>
                    <div className="bordered-layout">
                      <ul>
                        {this.state.scheduleList.length !== 0
                          ? this.state.scheduleList.map((data, index) => (
                              <li
                                id={data.hims_d_appointment_schedule_header_id}
                                key={index}
                                onClick={this.loadDetails.bind(this)}
                              >
                                <span
                                  style={{
                                    width: "80%"
                                  }}
                                >
                                  {data.schedule_description}
                                </span>
                                <i
                                  id={
                                    data.hims_d_appointment_schedule_header_id
                                  }
                                  className="fas fa-edit fa-1x float-right"
                                  style={{
                                    cursor: "pointer"
                                  }}
                                />
                              </li>
                            ))
                          : "No Schedules Avialable"}
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
                              name: "from_work_hr",
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
                              name: "to_work_hr",
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
                    <label>Doctors in the Schedule</label>
                    <div className="bordered-layout">
                      <ul>
                        {this.state.scheduleDoctors !== undefined
                          ? this.state.scheduleDoctors.map((data, index) => (
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
                            ))
                          : "No Doctors Available"}
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
