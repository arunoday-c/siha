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
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import swal from "sweetalert2";
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
      month: moment().format("M"),
      from_date: "",
      to_date: "",
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
      openModifier: false,
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
      days: [],
      selected_doctor: "",
      modify: [],
      scheduleDisable: true,
      leave: false
    };
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
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
    provider_array.length = 0;
  }

  updateDoctorScheduleDateWise(data) {
    let send_data = {};
    if (data.hims_d_appointment_schedule_modify_id !== undefined) {
      send_data = {
        hims_d_appointment_schedule_detail_id:
          data.appointment_schedule_detail_id,
        hims_d_appointment_schedule_modify_id:
          data.hims_d_appointment_schedule_modify_id,
        to_date: data.schedule_date,
        slot: data.slot,
        from_work_hr: data.from_work_hr,
        to_work_hr: data.to_work_hr,
        work_break1: "Y",
        from_break_hr1: data.from_break_hr1,
        to_break_hr1: data.to_break_hr1,
        work_break2: data.work_break2,
        from_break_hr2: data.from_break_hr2,
        to_break_hr2: data.to_break_hr2,
        modified: data.modified
      };
    } else {
      send_data = {
        appointment_schedule_detail_id:
          data.hims_d_appointment_schedule_detail_id,
        to_date: data.schedule_date,
        slot: data.slot,
        from_work_hr: data.from_work_hr,
        to_work_hr: data.to_work_hr,
        work_break1: "Y",
        from_break_hr1: data.from_break_hr1,
        to_break_hr1: data.to_break_hr1,
        work_break2: data.work_break2,
        from_break_hr2: data.from_break_hr2,
        to_break_hr2: data.to_break_hr2,
        modified: data.modified,
        hims_d_appointment_schedule_detail_id:
          data.hims_d_appointment_schedule_detail_id
      };
    }

    algaehApiCall({
      uri: "/appointment/updateDoctorScheduleDateWise",
      method: "PUT",
      data: send_data,
      onSuccess: response => {
        if (response.data.success) {
          this.getDoctorScheduleToModify(
            data.hims_d_appointment_schedule_header_id,
            data.provider_id
          );
          swalMessage({
            title: "Schedule updated successfully . .",
            type: "success"
          });
        }
      }
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
  }

  saveApptSchedule(e) {
    e.preventDefault();
    if (this.state.description.length === 0) {
      this.setState({
        description_error: true,
        description_error_text: "Please Enter the Description"
      });
    } else if (provider_array.length === 0) {
      swalMessage({
        title: "Please Select Doctors to add to this schedule.",
        type: "success"
      });
    } else if (this.state.from_date > this.state.to_date) {
      swalMessage({
        title: "Please Select a proper date range",
        type: "warning"
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
      myObj.from_date = moment(this.state.from_date).format("YYYY-MM-DD");
      myObj.to_date = moment(this.state.to_date).format("YYYY-MM-DD");

      for (let i = 0; i < provider_array.length; i++) {
        provider_array[i].slot = this.state.slot;
      }

      myObj.schedule_detail = provider_array;

      this.setState({ send_obj: myObj }, () => {
        //  console.log("ABC:", JSON.stringify(this.state.send_obj));

        algaehApiCall({
          uri: "/appointment/addDoctorsSchedule",
          methid: "POST",
          data: this.state.send_obj,
          onSuccess: response => {
            if (response.data.success) {
              this.resetSaveState();
              swalMessage({
                title: "Schedule added successfully . .",
                type: "success"
              });
            }
          }
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

  refreshState() {
    this.setState({ ...this.state });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row["modified"] = "M";
    this.refreshState();
  }
  changeCheckBox(row, e) {
    if (row.modified !== undefined) {
      if (row.modified === "L") row.modified = "N";
      else row.modified = "L";
    } else {
      row.modified = "L";
    }
    this.refreshState();
  }

  openModifierPopup(e) {
    let provider_id = e.currentTarget.getAttribute("provider-id");
    let header_id = e.currentTarget.getAttribute("id");
    let provider_name = e.currentTarget.getAttribute("provider-name");
    this.getDoctorScheduleToModify(header_id, provider_id);
    this.setState({ openModifier: true, selected_doctor: provider_name });
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors });
    });
  }

  loadDetails(e) {
    var element = document.querySelectorAll("[schedules]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    let header_id = e.currentTarget.getAttribute("header-id");

    let docs = Enumerable.from(this.state.scheduleList)
      .where(
        w => w.hims_d_appointment_schedule_header_id === parseInt(header_id)
      )
      .firstOrDefault();

    this.setState({
      description: docs.schedule_description,
      scheduleDoctors: docs.doctorsList,
      from_break_hr1: docs.from_break_hr1,
      to_break_hr1: docs.to_break_hr1,
      from_break_hr2: docs.from_break_hr2,
      to_break_hr2: docs.to_break_hr2,
      from_work_hr: docs.from_work_hr,
      to_work_hr: docs.to_work_hr,
      sunday: docs.sunday === "Y" ? true : false,
      monday: docs.monday === "Y" ? true : false,
      tuesday: docs.tuesday === "Y" ? true : false,
      wednesday: docs.wednesday === "Y" ? true : false,
      thursday: docs.thursday === "Y" ? true : false,
      friday: docs.friday === "Y" ? true : false,
      saturday: docs.saturday === "Y" ? true : false,
      from_date: docs.from_date,
      to_date: docs.to_date
    });
  }

  deleteDocFromSchedule(e) {
    let header_id = e.currentTarget.getAttribute("id");
    let provider_id = e.currentTarget.getAttribute("provider-id");

    let send_data = {
      appointment_schedule_header_id: header_id,
      provider_id: provider_id
    };

    swal({
      title: "Are you sure you want to delete this Doctor?",
      type: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        algaehApiCall({
          uri: "/appointment/deleteDoctorFromSchedule",
          method: "PUT",
          data: send_data,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Doctor deleted successfully . .",
                type: "success"
              });
              document.getElementById("srch-sch").click();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "warning"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled.",
          type: "warning"
        });
      }
    });
  }

  getApptSchedule(e) {
    this.resetSaveState();
    e.preventDefault();
    if (this.state.sub_department_id === null) {
      this.setState({
        department_error: true,
        department_error_text: "Please Select a department"
      });
    } else {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/appointment/getDoctorsScheduledList",
        method: "GET",
        data: {
          sub_dept_id: this.state.sub_department_id,
          month: this.state.month,
          year: this.state.year,
          provider_id: null
        },
        onSuccess: response => {
          if (response.data.success) {
            AlgaehLoader({ show: false });

            this.setState(
              {
                scheduleList: response.data.records,
                scheduleDoctors: response.data.records.detail,
                department_error_text: "",
                department_error: false
              },
              () => {
                if (
                  document.querySelectorAll("#schedule-ul li.active")[0] !==
                  undefined
                ) {
                  document
                    .querySelectorAll("#schedule-ul li.active")[0]
                    .click();
                }
              }
            );
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }

  dropDownHandler(value) {
    if (value.name === "month") {
      let dateToday = this.state.year + this.state.month + "01";
      this.setState({
        from_date: this.state.year + this.state.month + "01"
      });
    }
    this.setState({ [value.name]: value.value });
  }

  getDoctorScheduleToModify(header_id, provider_id) {
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleToModify",
      method: "GET",
      data: {
        appointment_schedule_header_id: header_id,
        provider_id: provider_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            modify: response.data.records
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
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
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
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  handleClose() {
    this.setState({ openScheduler: false, openModifier: false });
    provider_array.length = 0;
  }

  render() {
    return (
      <div className="phy-sch-setup">
        {/* Modify Modal Start */}
        <Modal open={this.state.openModifier}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Modify Working Hours</h4>
                </div>

                <div className="col-lg-4">
                  <button type="button" onClick={this.handleClose.bind(this)}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div className="popupInner">
              <div className="col-lg-12 margin-top-15">
                <div className="col-lg-12 card box-shadow-normal">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        forceLabel: "Selected Doctor",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "selected_doctor",
                        value: this.state.selected_doctor,
                        events: {
                          onChange: null
                        },
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    {/* <AlgaehDateHandler
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
                    </div> */}
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
                      fieldName: "schedule_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Appointment Date" }}
                        />
                      ),
                      disabled: true,
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.schedule_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {moment(row.schedule_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "modified",
                      label: <AlgaehLabel label={{ forceLabel: "Leave" }} />,
                      displayTemplate: row => {
                        return (
                          <input
                            style={{ pointerEvents: "none" }}
                            type="checkbox"
                            checked={row.modified === "L" ? true : false}
                            onChange={null}
                          />
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <input
                            type="checkbox"
                            name="modified"
                            checked={row.modified === "L" ? true : false}
                            onChange={this.changeCheckBox.bind(this, row)}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "from_work_hr",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "From Work Hour" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.from_work_hr, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_work_hr",
                              value: row.from_work_hr,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "to_work_hr",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Work Hour" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.to_work_hr, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_work_hr",
                              value: row.to_work_hr,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "from_break_hr1",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "From Work Break 1" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.from_break_hr1, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_break_hr1",
                              value: row.from_break_hr1,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "to_break_hr1",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "To Work Break 1" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.to_break_hr1, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_break_hr1",
                              value: row.to_break_hr1,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "from_break_hr2",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "From Work Break 2" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.from_break_hr2, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_break_hr2",
                              value: row.from_break_hr2,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "to_break_hr2",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "To Work Break 2" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.to_break_hr2, "hh:mm:ss").format(
                              "hh:mm A"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_break_hr2",
                              value: row.to_break_hr2,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "time"
                              }
                            }}
                          />
                        );
                      }
                    }
                  ]}
                  keyId="hims_d_appointment_status_id"
                  dataSource={{
                    data: this.state.modify
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => {},
                    onDelete: () => {},
                    onDone: this.updateDoctorScheduleDateWise.bind(this)
                  }}
                />
              </div>
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
                            type: "number",
                            min: moment().year()
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
                            debugger;
                            this.setState({
                              from_date: selectedDate
                            });
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
                          name: "from_work_hr",
                          value: this.state.from_work_hr,
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
                          name: "to_work_hr",
                          value: this.state.to_work_hr,
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
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>All</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="sunday"
                              checked={this.state.sunday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Sunday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="monday"
                              checked={this.state.monday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Monday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="tuesday"
                              checked={this.state.tuesday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Tuesday</span>
                          </label>

                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="wednesday"
                              checked={this.state.wednesday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Wednesday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="thursday"
                              checked={this.state.thursday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Thursday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="friday"
                              checked={this.state.friday}
                              onChange={this.changeChecks.bind(this)}
                            />
                            <span>Friday</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="saturday"
                              checked={this.state.saturday}
                              onChange={this.changeChecks.bind(this)}
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
        <div className="row  inner-top-search">
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
                type: "number",
                min: moment().year()
              }
            }}
          />

          <div className="col-lg-1 form-group margin-top-15">
            <span
              id="srch-sch"
              style={{ cursor: "pointer" }}
              onClick={this.getApptSchedule.bind(this)}
              className="fas fa-search fa-2x"
            />
          </div>
        </div>
        {/* Top Filter End */}

        <div className="row">
          <div className="col-lg-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Available Schedules</h3>
                </div>
                <div className="actions">
                  <span
                    className="btn btn-green btn-circle active"
                    onClick={() => {
                      this.setState({ openScheduler: true });
                    }}
                  >
                    <i className="fas fa-plus" />
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="bordered-layout-radius">
                  <ul id="schedule-ul" style={{ height: "53vh" }}>
                    {this.state.scheduleList.length !== 0 ? (
                      this.state.scheduleList.map((data, index) => (
                        <li
                          schedules={data.schedule_description}
                          header-id={data.hims_d_appointment_schedule_header_id}
                          key={index}
                          onClick={this.loadDetails.bind(this)}
                        >
                          <span>{data.schedule_description}</span>
                          {/* <span className="fas fa-trash" /> */}
                          {/* <i
                            id={data.appointment_schedule_header_id}
                            className="fas fa-pen"
                            onClick={() => {
                              this.setState({
                                scheduleDisable: false
                              });
                            }}
                          /> */}
                        </li>
                      ))
                    ) : (
                      <span className="noDataStyle">
                        Select Dept. and month to view available schedules
                      </span>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">{this.state.description}</h3>
                </div>

                {this.state.description ? (
                  <div className="actions">
                    <span className="btn btn-green btn-circle">
                      <i className="fas fa-copy" />
                    </span>
                    <span className="btn btn-green btn-circle">
                      <i className="fas fa-trash-alt" />
                    </span>
                    <span className="btn btn-green btn-circle active">
                      <i className="fas fa-pen" />
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="row">
                      <div className="col-lg-6">
                        <label className="algaehLabelGroup">Date Range</label>
                        <div className="row">
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "From Date",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.from_date
                                ? moment(this.state.from_date).format(
                                    "DD-MM-YYYY"
                                  )
                                : "DD/MM/YYYY"}
                            </h6>
                          </div>
                          {/* <AlgaehDateHandler
                            div={{ className: "col-lg-6" }}
                            label={{ forceLabel: "From Date", isImp: true }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_date",
                              others: {
                                disabled: this.state.scheduleDisable
                              }
                            }}
                            events={{
                              onChange: selectedDate => {
                                this.setState({ from_date: selectedDate });
                              }
                            }}
                            value={this.state.from_date}
                          /> */}

                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "To Date",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.to_date
                                ? moment(this.state.to_date).format(
                                    "DD-MM-YYYY"
                                  )
                                : "DD/MM/YYYY"}
                            </h6>
                          </div>
                          {/* <AlgaehDateHandler
                            div={{ className: "col-lg-6" }}
                            label={{ forceLabel: "To Date", isImp: true }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_date",
                              others: {
                                disabled: this.state.scheduleDisable
                              }
                            }}
                            events={{
                              onChange: selectedDate => {
                                this.setState({ to_date: selectedDate });
                              }
                            }}
                            value={this.state.to_date}
                          /> */}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label className="algaehLabelGroup">
                          Working Hours
                        </label>
                        <div className="row">
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "From Time",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.from_work_hr
                                ? moment(
                                    this.state.from_work_hr,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>

                          {/* <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "From Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_work_hr",
                              value: this.state.from_work_hr,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}

                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "To Time",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.to_work_hr
                                ? moment(
                                    this.state.to_work_hr,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>

                          {/* <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "To Time",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_work_hr",
                              value: this.state.to_work_hr,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <label className="algaehLabelGroup">Day Break 1</label>
                        <div className="row">
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "From Time",
                                isImp: true
                              }}
                            />
                            <h6>
                              {this.state.from_break_hr1
                                ? moment(
                                    this.state.from_break_hr1,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>
                          {/* <AlagehFormGroup
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
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}

                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "To Time",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.to_break_hr1
                                ? moment(
                                    this.state.to_break_hr1,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>
                          {/* <AlagehFormGroup
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
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }

                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <label className="algaehLabelGroup">Day Break 2</label>
                        <div className="row">
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "From Time",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.from_break_hr2
                                ? moment(
                                    this.state.from_break_hr2,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>

                          {/* <AlagehFormGroup
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
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}

                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "To Time",
                                isImp: true
                              }}
                            />

                            <h6>
                              {this.state.to_break_hr2
                                ? moment(
                                    this.state.to_break_hr2,
                                    "hh:mm:ss"
                                  ).format("hh:mm a")
                                : "00:00"}
                            </h6>
                          </div>

                          {/* <AlagehFormGroup
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
                                type: "time",
                                disabled: this.state.scheduleDisable
                              }
                              // error: this.state.description_error,
                              // helperText: this.state.description_error_text
                            }}
                          /> */}
                        </div>
                      </div>
                    </div>

                    <div className="row margin-top-15">
                      <div className="col-lg-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Working Days",
                            isImp: true
                          }}
                        />

                        <h6>
                          {this.state.sunday ? "SUN" : ""}
                          {this.state.monday ? " MON" : ""}
                          {this.state.tuesday ? " TUE" : ""}
                          {this.state.wednesday ? " WED" : ""}
                          {this.state.thursday ? " THU" : ""}
                          {this.state.friday ? " FRI" : ""}
                          {this.state.saturday ? " SAT" : ""}
                        </h6>
                      </div>

                      {/* <div className="col-lg-12">
                        <label>Working Days</label>
                          

                        <div
                          className="customCheckbox"
                          style={{
                            border: "none",
                            pointerEvents: this.state.scheduleDisable
                              ? "none"
                              : ""
                          }}
                        >
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
                      </div> */}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label>Doctors in the Schedule</label>
                    <div className="bordered-layout-radius">
                      <ul style={{ height: "50vh" }}>
                        {this.state.scheduleDoctors !== undefined ? (
                          this.state.scheduleDoctors.map((data, index) => (
                            <li key={index}>
                              {data.first_name + " " + data.last_name}
                              <i
                                provider-name={
                                  data.first_name + " " + data.last_name
                                }
                                provider-id={data.provider_id}
                                id={data.appointment_schedule_header_id}
                                onClick={this.openModifierPopup.bind(this)}
                                className="fas fa-pen"
                              />
                              <i
                                onClick={this.deleteDocFromSchedule.bind(this)}
                                provider-id={data.provider_id}
                                id={data.appointment_schedule_header_id}
                                className="fas fa-trash-alt"
                              />
                            </li>
                          ))
                        ) : (
                          <span className="noDataStyle">
                            Select schedule to view doctors
                          </span>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhySchSetup;
