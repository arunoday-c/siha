import React, { Component } from "react";
import "./phy_sch_setup.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";
import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import swal from "sweetalert2";
import moment from "moment";
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
      leave: false,
      openEdit: false
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
      // month: moment(new Date()).format("M"),
      schedule_status: "Y",
      from_work_hr: "",
      to_work_hr: "",
      work_break1: "",
      work_break2: "",
      from_break_hr1: "",
      to_break_hr1: "",
      from_break_hr2: "",
      to_break_hr2: "",
      openScheduler: false
    });
    provider_array.length = 0;
  }

  clearState() {
    this.setState({
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
      leave: false,
      openEdit: false
    });
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
      module: "frontDesk",
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

  deleteSchedule(data) {
    const docs = Enumerable.from(this.state.scheduleDoctors)
      .where(
        w =>
          w.appointment_schedule_header_id ==
          data.hims_d_appointment_schedule_header_id
      )
      .select(s => {
        return s.provider_id;
      })
      .toArray();

    swal({
      title: "Do you want to Delete Schedule: " + data.description,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/appointment/deleteSchedule",
          method: "DELETE",
          module: "frontDesk",
          data: {
            providers: docs,
            appointment_schedule_header_id:
              data.hims_d_appointment_schedule_header_id,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            sub_department_id: this.state.sub_department_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.clearState();
            } else {
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
        type: "warning"
      });
    } else if (this.state.slot.length === 0) {
      swalMessage({
        title: "Please Select a Slot.",
        type: "warning"
      });
    } else if (this.state.from_date > this.state.to_date) {
      swalMessage({
        title: "Please Select a proper date range",
        type: "warning"
      });
    } else {
      const myObj = {};
      myObj.hims_d_appointment_schedule_header_id = this.state.hims_d_appointment_schedule_header_id;
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

      let _uri = "/appointment/addDoctorsSchedule";
      if (e.target.innerText === "UPDATE") {
        _uri = "/appointment/addDoctorToExistingSchedule";
      }

      this.setState({ send_obj: myObj }, () => {
        algaehApiCall({
          uri: _uri,
          module: "frontDesk",
          methid: "POST",
          data: this.state.send_obj,
          onSuccess: response => {
            if (response.data.success) {
              document.getElementById("srch-sch").click();
              this.resetSaveState();

              swalMessage({
                title: "Schedule added successfully . .",
                type: "success"
              });
            } else if (response.data.success === false) {
              swalMessage({
                title: response.data.records.message,
                type: "warning"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      });
    }
  }

  changeChecks(e) {
    switch (e.target.name) {
      case "sunday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "monday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "tuesday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "wednesday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "thursday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "friday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
      case "saturday":
        if (!e.target.checked) {
          this.setState({ all: false });
        }
        break;
    }
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row["modified"] = "M";
    row.update();
  }
  changeCheckBox(row, e) {
    if (row.modified !== undefined) {
      if (row.modified === "L") row.modified = "N";
      else row.modified = "L";
    } else {
      row.modified = "L";
    }
    row.update();
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
        w => w.hims_d_appointment_schedule_header_id === parseInt(header_id, 10)
      )
      .firstOrDefault();

    this.setState({
      hims_d_appointment_schedule_header_id: header_id,
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
      provider_id: provider_id,
      from_date: this.state.from_date,
      to_date: this.state.from_date,
      sub_department_id: this.state.sub_department_id
    };

    swal({
      title: "Are you sure you want to delete this Doctor?",
      type: "warning",
      confirmButtonText: "Yes!",
      showCancelButton: true,
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/appointment/deleteDoctorFromSchedule",
          module: "frontDesk",
          method: "DELETE",
          data: send_data,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Doctor deleted successfully . .",
                type: "success"
              });
              document.getElementById("srch-sch").click();
            } else {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
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
        module: "frontDesk",
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
    this.setState({ [value.name]: value.value });
    if (value.name === "month") {
      // let dateToday = this.state.year + this.state.month + "01";
      // this.setState({
      //   from_date: this.state.year + this.state.month + "01"
      // });

      let dateToday = moment().format("YYYY-MM-DD");
      let startOf_mon = moment(this.state.year + "-" + value.value)
        .startOf("month")
        .format("YYYY-MM-DD");

      let frm_date =
        dateToday > startOf_mon
          ? new Date()
          : moment(startOf_mon).format("MM-DD-YYYY");

      let to_dte = moment(frm_date)
        .endOf("month")
        .format("MM-DD-YYYY");

      this.setState({
        from_date: frm_date,
        to_date: to_dte
      });
    }
  }

  getDoctorScheduleToModify(header_id, provider_id) {
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleToModify",
      module: "frontDesk",
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
      module: "masterSettings",
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
    this.setState({
      openScheduler: false,
      openModifier: false,
      openEdit: false
    });
    provider_array.length = 0;
  }

  render() {
    return (
      <div className="phy-sch-setup">
        {/* Doctor Schedule Modify Modal Start */}
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title="Modify Working Hours"
          openPopup={this.state.openModifier}
        >
          <div className="popupInner">
            <div className="col-lg-12 margin-top-15">
              <div className="col-lg-12 card">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "selected_doctor",
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
                      label={{ fieldName: "Selected From Date", isImp: true }}
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
                      label={{ fieldName: "Selected To Date", isImp: true }}
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

          <div className="col portlet portlet-bordered">
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
                    label: <AlgaehLabel label={{ fieldName: "appt_date" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "leave" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "from_wrk_hr" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "to_wrk_hr" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {moment(row.to_work_hr, "hh:mm:ss").format("hh:mm A")}
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
                    label: <AlgaehLabel label={{ fieldName: "frm_brk_1" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "to_brk_1" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "frm_brk_2" }} />,
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
                    label: <AlgaehLabel label={{ fieldName: "to_brk_2" }} />,
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
        </AlgaehModalPopUp>
        {/* Doctor Schedule Modify Modal End */}

        {/*Edit Existing Schedule Modal Start */}
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title="Edit Schedule"
          openPopup={this.state.openEdit}
        >
          <div className="popupInner">
            <div className="col-lg-12 divInner">
              <div className="row">
                <div className="col-lg-3 divInnerLeft">
                  <div className="row">
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
                    <div className="col">
                      <label>Doctors</label>
                      <div className="bordered-layout physicianList">
                        <ul
                          style={
                            {
                              //  pointerEvents: this.state.disable ? "none" : ""
                            }
                          }
                        >
                          {this.state.doctors.map((data, index) => {
                            const _alreadyExists = Enumerable.from(
                              this.state.scheduleDoctors
                            )
                              .where(w => w.provider_id === data.provider_id)
                              .firstOrDefault();
                            const _checked =
                              _alreadyExists === undefined
                                ? {}
                                : { checked: true };
                            return (
                              <li key={index}>
                                <input
                                  row={JSON.stringify(data)}
                                  onChange={this.checkHandle.bind(this)}
                                  type="checkbox"
                                  {..._checked}
                                />
                                <span
                                  style={{
                                    width: "80%"
                                  }}
                                >
                                  {data.full_name}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 divInnerRight">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "sch_desc",
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
                        fieldName: "sel_slot_time",
                        isImp: true
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
                        fieldName: "sel_month"
                      }}
                      selector={{
                        sort: "off",
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
                        fieldName: "year",
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
                      label={{ fieldName: "frm_date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_date"
                      }}
                      events={{
                        onChange: selectedDate => {
                          this.setState({
                            from_date: selectedDate
                          });
                        }
                      }}
                      value={this.state.from_date}
                      minDate={new Date()}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ fieldName: "to_date", isImp: true }}
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
                        fieldName: "from_time",
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
                        fieldName: "to_time",
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
                            fieldName: "from_time",
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
                            fieldName: "to_time",
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
                            fieldName: "from_time",
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
                            fieldName: "to_time",
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
              Update
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={this.handleClose.bind(this)}
            >
              Close
            </button>
          </div>
        </AlgaehModalPopUp>

        {/*Edit Existing Schedule Modal End */}

        {/* New Schedule Modal Start */}
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title="Scheduler"
          openPopup={this.state.openScheduler}
        >
          <div className="popupInner">
            <div className="col-lg-12 divInner">
              <div className="row">
                <div className="col-lg-3 divInnerLeft">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-12" }}
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
                    <div className="col-12">
                      <label>Doctors</label>
                      <div className="bordered-layout physicianList">
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
                  </div>
                </div>
                <div className="col-lg-9 divInnerRight">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "sch_desc",
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
                        fieldName: "sel_slot_time",
                        isImp: true
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
                        fieldName: "sel_month"
                      }}
                      selector={{
                        sort: "off",
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
                        fieldName: "year",
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
                      label={{ fieldName: "frm_date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_date"
                      }}
                      events={{
                        onChange: selectedDate => {
                          this.setState({
                            from_date: selectedDate
                          });
                        }
                      }}
                      value={this.state.from_date}
                      minDate={new Date()}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ fieldName: "to_date", isImp: true }}
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
                        fieldName: "frm_time",
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
                        fieldName: "to_time",
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
                            fieldName: "frm_time",
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
                            fieldName: "to_time",
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
                            fieldName: "frm_time",
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
                            fieldName: "to_time",
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
          <div className="col-12 popupFooter">
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
        </AlgaehModalPopUp>
        {/* Schedule Modal End */}

        {/* Top Filter Start */}
        <div className="row inner-top-search">
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

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              fieldName: "sel_month"
            }}
            selector={{
              sort: "off",
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
            div={{ className: "col-2" }}
            label={{
              fieldName: "year",
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

          <div className="col form-group">
            <button
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              id="srch-sch"
              onClick={this.getApptSchedule.bind(this)}
            >
              Search
            </button>
          </div>
        </div>
        {/* Top Filter End */}

        <div className="row">
          <div className="col-lg-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Available Schedules</h3>
                </div>
                <div className="actions">
                  <span
                    className="btn btn-green btn-circle active"
                    onClick={() => {
                      this.setState({
                        ...this.resetSaveState(),
                        openScheduler: true
                      });
                    }}
                  >
                    <i className="fas fa-plus" />
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="bordered-layout-radius">
                  <ul id="schedule-ul" style={{ height: "65vh" }}>
                    {this.state.scheduleList.length !== 0 ? (
                      this.state.scheduleList.map((data, index) => (
                        <li
                          schedules={data.schedule_description}
                          header-id={data.hims_d_appointment_schedule_header_id}
                          key={index}
                          onClick={this.loadDetails.bind(this)}
                          style={{ paddingRight: 25 }}
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
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    {this.state.description
                      ? this.state.description
                      : "Selected Schedule Name"}
                  </h3>
                </div>

                {this.state.description ? (
                  <div className="actions">
                    <span className="btn btn-green btn-circle">
                      <i className="fas fa-copy" />
                    </span>
                    <span className="btn btn-green btn-circle">
                      <i
                        onClick={() => {
                          this.deleteSchedule({
                            hims_d_appointment_schedule_header_id: this.state
                              .hims_d_appointment_schedule_header_id,
                            description: this.state.description
                          });
                        }}
                        className="fas fa-trash-alt"
                      />
                    </span>
                    <span className="btn btn-green btn-circle active">
                      <i
                        onClick={() => {
                          this.setState({ openEdit: true });
                        }}
                        className="fas fa-pen"
                      />
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-8" style={{ paddingTop: 15 }}>
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-6 algaehLabelFormGroup">
                          <label className="algaehLabelGroup">Date Range</label>
                          <div className="row">
                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "frm_date",
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

                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "to_date",
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
                          </div>
                        </div>
                        <div className="col-lg-6 algaehLabelFormGroup">
                          <label className="algaehLabelGroup">
                            Working Hours
                          </label>
                          <div className="row">
                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "frm_time",
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

                            <div className="col-lg-6 ">
                              <AlgaehLabel
                                label={{
                                  fieldName: "to_time",
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
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 algaehLabelFormGroup">
                          <label className="algaehLabelGroup">
                            Day Break 1
                          </label>
                          <div className="row">
                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "frm_time",
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

                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "to_time",
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
                          </div>
                        </div>
                        <div className="col-lg-6 algaehLabelFormGroup">
                          <label className="algaehLabelGroup">
                            Day Break 2
                          </label>
                          <div className="row">
                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "frm_time",
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

                            <div className="col-lg-6">
                              <AlgaehLabel
                                label={{
                                  fieldName: "to_time",
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
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row margin-top-15">
                      <div className="col-lg-12">
                        <AlgaehLabel
                          label={{
                            fieldName: "wrkng_days",
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

                        {/* <h6>Weekdays</h6> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4" style={{ marginTop: 15 }}>
                    <label className="algaehLabelGroup" style={{ left: 22 }}>
                      Doctors in the Schedule
                    </label>
                    <div className="bordered-layout-radius">
                      <ul style={{ height: "63vh", paddingTop: 3 }}>
                        {this.state.scheduleDoctors !== undefined ? (
                          this.state.scheduleDoctors.map((data, index) => (
                            <li key={index}>
                              {data.full_name}
                              <i
                                provider-name={data.full_name}
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
