import React, { Component } from "react";
import moment from "moment";
import swal from "sweetalert2";
import Enumerable from "linq";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";
import ScheduleModal from "./ScheduleModal";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import "./phy_sch_setup.scss";
import AddDoctorModal from "./AddDoctorModal";

class PhySchSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: [],
      scheduleList: [],
      scheduleDoctors: [],
      schedule_detail: [],
      availDoctors: [],
      year: moment().year(),
      month: null,
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

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  changeTexts(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  openCreateSchedule() {
    this.setState({
      ...this.resetSaveState(),
      hims_d_appointment_schedule_header_id: null,
      sub_department_id: null,
      openScheduler: true,
      scheduleDoctors: [],
      doctors: []
    });
  }

  openEditSchedule() {
    this.setState({
      openEdit: true,
      schedule_detail: this.state.scheduleDoctors
    });
  }

  openAddDoctorModal = () => {
    const { doctors, scheduleDoctors } = this.state;
    let docIds = scheduleDoctors.map(({ provider_id }) => provider_id);
    let availDoctors = doctors.filter(
      item => !docIds.includes(item.provider_id)
    );
    this.setState({
      openAddDoctor: true,
      availDoctors
    });
  };

  resetSaveState() {
    this.setState({
      description: "",
      openEdit: false,
      openScheduler: false,
      openAddDoctor: false,
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
      from_date: null,
      to_date: null,
      from_work_hr: "",
      to_work_hr: "",
      work_break1: "",
      work_break2: "",
      from_break_hr1: "",
      to_break_hr1: "",
      from_break_hr2: "",
      to_break_hr2: "",
      openScheduler: false,
      schedule_detail: []
    });
  }

  clearState() {
    this.setState(
      {
        doctors: [],
        scheduleList: [],
        scheduleDoctors: [],
        schedule_detail: [],
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
        from_date: null,
        to_date: null,
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
      },
      () => this.getApptSchedule()
    );
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
            title: "Schedule Updated Successfully",
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
      title: "Delete Schedule?",
      text: data.description,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel"
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
                title: "Schedule Deleted Successfully",
                type: "success"
              });
              this.clearState();
            } else {
              swalMessage({
                // title: response.data.records.message,
                title: "Network Error, Try Again",
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              // title: error.message,
              title: "Network Error, Try Again",
              type: "error"
            });
          }
        });
      } 
    });
  }

  checkHandle = (myRow, index) => {
    const { doctors } = this.state;
    let docsArray = this.state.schedule_detail;
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

    const item = Enumerable.from(this.state.schedule_detail)
      .where(w => w.provider_id === myRow.provider_id)
      .firstOrDefault();
    if (item !== undefined) {
      docsArray.splice(docsArray.indexOf(item), 1);
      doctors[index].isDocChecked = false;
    } else {
      docsArray.push(myRow);
      doctors[index].isDocChecked = true;
    }

    this.setState({
      schedule_detail: docsArray,
      doctors
    });
  };

  checkHandleAdd = (myRow, index) => {
    console.log(myRow);

    const { availDoctors } = this.state;
    let docsArray = this.state.schedule_detail;
    myRow.schedule_status = this.state.schedule_status;
    myRow.slot = this.state.sch_slot;
    myRow.from_work_hr = this.state.from_work_hr;
    myRow.to_work_hr = this.state.to_work_hr;
    myRow.work_break1 = this.state.work_break1;
    myRow.work_break2 = this.state.work_break2;
    myRow.from_break_hr1 = this.state.from_break_hr1;
    myRow.to_break_hr1 = this.state.to_break_hr1;
    myRow.from_break_hr2 = this.state.from_break_hr2;
    myRow.to_break_hr2 = this.state.to_break_hr2;

    const item = Enumerable.from(this.state.schedule_detail)
      .where(w => w.provider_id === myRow.provider_id)
      .firstOrDefault();
    if (item !== undefined) {
      docsArray.splice(docsArray.indexOf(item), 1);
      availDoctors[index].isDocChecked = false;
    } else {
      docsArray.push(myRow);
      availDoctors[index].isDocChecked = true;
    }

    this.setState({
      schedule_detail: docsArray,
      availDoctors
    });
  };

  addDoctorsToSchedule = () => {
    const {
      hims_d_appointment_schedule_header_id,
      schedule_detail
    } = this.state;
    if (!hims_d_appointment_schedule_header_id) {
      swalMessage({
        title: "Please select the correct schedule",
        type: "error"
      });
      return null;
    } else if (!Array.isArray(schedule_detail) && !schedule_detail.length) {
      swalMessage({
        title: "Please select doctors",
        type: "error"
      });
    } else {
      algaehApiCall({
        uri: "/appointment/addDoctorToExistingSchedule",
        module: "frontDesk",
        method: "POST",
        data: {
          hims_d_appointment_schedule_header_id,
          schedule_detail
        },
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Schedule added successfully . .",
              type: "success"
            });
            this.getApptSchedule();
          } else if (response.data.success === false) {
            swalMessage({
              title: response.data.records.message,
              type: "warning"
            });
          }
        },
        onFailure: response => {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      });
    }
  };

  //need to rewrite this function in future, coz it's not DRY!!
  formValidation = () => {
    const {
      sub_department_id,
      description,
      schedule_detail,
      slot,
      from_date,
      to_date,
      from_work_hr,
      to_work_hr,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      openEdit
    } = this.state;
    console.log(this.state, "from validation");
    const type = "warning";
    if (!sub_department_id) {
      swalMessage({
        title: "Please select a department",
        type
      });
      return false;
    } else if (!description) {
      swalMessage({
        title: "Please Enter the Description",
        type
      });
      return false;
    } else if (!schedule_detail.length) {
      swalMessage({
        title: "Please Select Doctors to add to this schedule.",
        type
      });
      return false;
    } else if (!openEdit && !slot) {
      swalMessage({
        title: "Please Select a Slot.",
        type
      });
      return false;
    } else if (!from_date) {
      swalMessage({
        title: "Please enter From Date",
        type
      });
      return false;
    } else if (!to_date) {
      swalMessage({
        title: "Please enter To Date",
        type
      });
      return false;
    } else if (moment(from_date).isSameOrAfter(moment(to_date), "day")) {
      swalMessage({
        title: "Please Select a proper date range",
        type
      });
      return false;
    } else if (!from_work_hr) {
      swalMessage({
        title: "Please enter From Time",
        type
      });
      return false;
    } else if (!to_work_hr) {
      swalMessage({
        title: "Please enter To Time",
        type
      });
      return false;
    } else if (
      !monday &&
      !tuesday &&
      !wednesday &&
      !thursday &&
      !friday &&
      !saturday &&
      !sunday
    ) {
      swalMessage({
        title: "Please Select Working days",
        type
      });
      return false;
    } else {
      return true;
    }
  };

  saveApptSchedule(e) {
    e.preventDefault();
    const validation = this.formValidation();
    if (validation) {
      let month =
        this.state.month ||
        moment(this.state.from_date, "YYYY-MM-DD").format("M");
      const myObj = {};
      myObj.hims_d_appointment_schedule_header_id = parseInt(
        this.state.hims_d_appointment_schedule_header_id,
        10
      );
      myObj.sub_dept_id = this.state.sub_department_id;
      myObj.schedule_description = this.state.description;
      myObj.month = parseInt(month, 10);
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

      myObj.work_break1 = this.state.from_break_hr1
        ? this.state.from_break_hr1 !== "00:00:00"
          ? "Y"
          : "N"
        : "N";

      myObj.from_break_hr1 = this.state.from_break_hr1;
      myObj.to_break_hr1 = this.state.to_break_hr1;

      myObj.work_break2 = this.state.from_break_hr2
        ? this.state.from_break_hr2 !== "00:00:00"
          ? "Y"
          : "N"
        : "N";

      myObj.from_break_hr2 = this.state.from_break_hr2;
      myObj.to_break_hr2 = this.state.to_break_hr2;
      myObj.from_date = moment(this.state.from_date).format("YYYY-MM-DD");
      myObj.to_date = moment(this.state.to_date).format("YYYY-MM-DD");

      const docsArray = [...this.state.schedule_detail];

      for (let i = 0; i < docsArray.length; i++) {
        docsArray[i].slot = this.state.slot;
      }

      myObj.schedule_detail = docsArray;
      myObj.record_status = "A";

      let _uri = "/appointment/addDoctorsSchedule";
      if (this.state.openEdit) {
        _uri = "/appointment/updateSchedule";
      }

      this.setState({ send_obj: myObj }, () => {
        algaehApiCall({
          uri: _uri,
          module: "frontDesk",
          method: this.state.openEdit ? "PUT" : "POST",
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

  changeDate(date, field) {
    this.setState({
      [field]: date
    });
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
        .where(w => w.sub_dept_id === this.state[value.name])
        .firstOrDefault();
      this.setState({ doctors: dept.doctors, schedule_detail: [] });
    });
  }

  loadDetails(e) {
    var element = document.querySelectorAll("[schedules]");
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    let header_id = e.currentTarget.getAttribute("header-id");

    const doctors = Enumerable.from(this.state.scheduleListf);

    let docs = Enumerable.from(this.state.scheduleList)
      .where(
        w => w.hims_d_appointment_schedule_header_id === parseInt(header_id, 10)
      )
      .firstOrDefault();

    const dept = Enumerable.from(this.state.departments)
      .where(w => w.sub_dept_id === docs.sub_dept_id)
      .firstOrDefault();

    this.setState(
      {
        doctors: dept.doctors,
        hims_d_appointment_schedule_header_id: header_id,
        sub_department_id: docs.sub_dept_id,
        description: docs.schedule_description,
        scheduleDoctors: docs.doctorsList,
        from_break_hr1: docs.work_break1 === "Y" ? docs.from_break_hr1 : null,
        to_break_hr1: docs.work_break1 === "Y" ? docs.to_break_hr1 : null,
        from_break_hr2: docs.work_break2 === "Y" ? docs.from_break_hr2 : null,
        to_break_hr2: docs.work_break2 === "Y" ? docs.to_break_hr2 : null,
        from_work_hr: docs.from_work_hr,
        sch_slot: docs.doctorsList[0].slot,
        to_work_hr: docs.to_work_hr,
        work_break1: docs.work_break1,
        work_break2: docs.work_break2,
        sunday: docs.sunday === "Y" ? true : false,
        monday: docs.monday === "Y" ? true : false,
        tuesday: docs.tuesday === "Y" ? true : false,
        wednesday: docs.wednesday === "Y" ? true : false,
        thursday: docs.thursday === "Y" ? true : false,
        friday: docs.friday === "Y" ? true : false,
        saturday: docs.saturday === "Y" ? true : false,
        from_date: docs.from_date,
        to_date: docs.to_date
      },
      () => this.isPastSchedule(docs)
    );
  }

  isPastSchedule(docs) {
    const { to_date } = docs;
    const result = moment(to_date).isBefore(moment().format("YYYY-MM-DD"));
    this.setState({
      pastSchedule: result
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
      title: "Delete this Doctor?",
      type: "warning",
      confirmButtonText: "Delete",
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
      }
    });
  }

  getApptSchedule(e) {
    this.resetSaveState();
    // e.preventDefault();
    if (this.state.portlet_sub_department === null) {
      this.setState(
        {
          department_error: true,
          department_error_text: "Please Select a department"
        },
        () =>
          swalMessage({
            title: this.state.department_error_text,
            type: "error"
          })
      );
    } else {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/appointment/getDoctorsScheduledList",
        module: "frontDesk",
        method: "GET",
        data: {
          sub_dept_id: this.state.portlet_sub_department,
          month: this.state.month,
          year: this.state.year,
          provider_id: null
        },
        onSuccess: response => {
          console.log(response.data.records, "From API");
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
    // if (value.name === "month") {
    //   // let dateToday = this.state.year + this.state.month + "01";
    //   // this.setState({
    //   //   from_date: this.state.year + this.state.month + "01"
    //   // });

    //   let dateToday = moment().format("YYYY-MM-DD");
    //   let startOf_mon = moment(this.state.year + "-" + value.value)
    //     .startOf("month")
    //     .format("YYYY-MM-DD");

    //   let frm_date =
    //     dateToday > startOf_mon
    //       ? new Date()
    //       : moment(startOf_mon).format("MM-DD-YYYY");

    //   let to_dte = moment(frm_date)
    //     .endOf("month")
    //     .format("MM-DD-YYYY");

    //   this.setState({
    //     from_date: frm_date,
    //     to_date: to_dte
    //   });
    // }
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

  handleClose() {
    this.setState(
      {
        openScheduler: false,
        openModifier: false,
        openEdit: false,
        openAddDoctor: false,
        schedule_detail: [],
        availDoctors: []
      },
      () => this.resetSaveState()
    );
  }

  render() {
    const toHide = this.state.pastSchedule ? "hide-feature" : "";
    return (
      <div className="phySchSetup">
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
                    div={{ className: "col-6" }}
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
                      div={{ className: "col-6" }}
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
                      div={{ className: "col-6" }}
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
                          {row.work_break1 === "Y"
                            ? moment(row.from_break_hr1, "hh:mm:ss").format(
                                "hh:mm A"
                              )
                            : "--"}
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
                          {row.work_break1 === "Y"
                            ? moment(row.to_break_hr1, "hh:mm:ss").format(
                                "hh:mm A"
                              )
                            : "--"}
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
                          {row.work_break2 === "Y"
                            ? moment(row.from_break_hr2, "hh:mm:ss").format(
                                "hh:mm A"
                              )
                            : "--"}
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
                          {row.work_break2 === "Y"
                            ? moment(row.to_break_hr2, "hh:mm:ss").format(
                                "hh:mm A"
                              )
                            : "--"}
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

        <ScheduleModal
          state={this.state}
          handleClose={this.handleClose.bind(this)}
          title={
            this.state.openEdit
              ? "Edit Schedule"
              : this.state.openScheduler
              ? "Create Schedule"
              : ""
          }
          deptDropDownHandler={this.deptDropDownHandler.bind(this)}
          changeTexts={this.changeTexts.bind(this)}
          dropDownHandler={this.dropDownHandler.bind(this)}
          changeDate={this.changeDate.bind(this)}
          changeChecks={this.changeChecks.bind(this)}
          checkHandle={this.checkHandle.bind(this)}
          saveApptSchedule={this.saveApptSchedule.bind(this)}
        />

        {/* Schedule Modal End */}
        <AddDoctorModal
          title="Select Doctors to add"
          isOpen={this.state.openAddDoctor}
          availDoctors={this.state.availDoctors}
          handleClose={this.handleClose.bind(this)}
          checkHandle={this.checkHandleAdd.bind(this)}
          addDoctorsToSchedule={this.addDoctorsToSchedule}
        />
        <div className="row margin-top-15">
          <div className="col-3" style={{ paddingRight: 0 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Available Schedules</h3>
                </div>
                <div className="actions">
                  <span
                    className="btn btn-green btn-circle"
                    onClick={this.openCreateSchedule.bind(this)}
                  >
                    <i className="fas fa-plus" />
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row" style={{ borderBottom: "1px solid #ccc" }}>
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Select Department",
                      isImp: true
                    }}
                    selector={{
                      name: "portlet_sub_department",
                      className: "select-fld",
                      value: this.state.portlet_sub_department,
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

                  <AlagehFormGroup
                    div={{ className: "col-4" }}
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
                  <AlagehAutoComplete
                    div={{ className: "col-5" }}
                    label={{
                      forceLabel: "Month",
                      isImp: false
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
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => this.setState({ month: "" })
                    }}
                  />

                  <div
                    className="col-3 form-group"
                    style={{ textAlign: "right", paddingLeft: 0 }}
                  >
                    <button
                      style={{ marginTop: 19 }}
                      className="btn btn-default"
                      id="srch-sch"
                      onClick={this.getApptSchedule.bind(this)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <div className="row">
                  <ul id="schedule-ul">
                    {this.state.scheduleList.length !== 0 ? (
                      this.state.scheduleList.map((data, index) => (
                        <li
                          schedules={data.schedule_description}
                          header-id={data.hims_d_appointment_schedule_header_id}
                          key={index}
                          onClick={this.loadDetails.bind(this)}
                        >
                          <h3>{data.schedule_description}</h3>
                          <p>
                            Sch. From:<span>{data.from_date}</span>
                          </p>
                          <p>
                            Work Start:<span>{data.from_work_hr}</span>
                          </p>
                          <p>
                            Sch. To:<span>{data.to_date}</span>
                          </p>
                          <p>
                            Work End:<span>{data.to_work_hr}</span>
                          </p>
                        </li>
                      ))
                    ) : (
                      <span className="noDataStyle">
                        <h1>
                          <i className="fas fa-calendar-check" />
                        </h1>
                        <p>
                          Select Year & Department to <br />
                          View Schedule List
                        </p>
                      </span>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15 viewScheduleDetails">
              {this.state.description ? (
                <div className="portlet-body">
                  <div className="row" style={{ marginBottom: 30 }}>
                    {" "}
                    <div className="col-6">
                      <label className="">Schedule Name</label>

                      <h2 style={{ marginTop: 5 }}>{this.state.description}</h2>
                    </div>
                    <div className="col" style={{ textAlign: "right" }}>
                      <button
                        className={`btn btn-default ${toHide}`}
                        onClick={() => {
                          this.deleteSchedule({
                            hims_d_appointment_schedule_header_id: this.state
                              .hims_d_appointment_schedule_header_id,
                            description: this.state.description
                          });
                        }}
                        disabled={this.state.pastSchedule}
                      >
                        Delete Schedule
                      </button>
                      <button
                        className={`btn btn-default ${toHide}`}
                        style={{ marginLeft: 15 }}
                        onClick={this.openEditSchedule.bind(this)}
                        disabled={this.state.pastSchedule}
                      >
                        Edit Schedule
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-6 algaehLabelFormGroup">
                            <label className="algaehLabelGroup">
                              Date Range
                            </label>
                            <div className="row">
                              <div className="col-6">
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

                              <div className="col-6">
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
                            </div>
                          </div>
                          <div className="col-6 algaehLabelFormGroup">
                            <label className="algaehLabelGroup">
                              Working Hours
                            </label>
                            <div className="row">
                              <div className="col-6">
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

                              <div className="col-6 ">
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
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6 algaehLabelFormGroup">
                            <label className="algaehLabelGroup">
                              Day Break 1
                            </label>
                            <div className="row">
                              <div className="col-6">
                                <AlgaehLabel
                                  label={{
                                    fieldName: "frm_time"
                                  }}
                                />
                                <h6>
                                  {this.state.work_break1 === "Y"
                                    ? moment(
                                        this.state.from_break_hr1,
                                        "hh:mm:ss"
                                      ).format("hh:mm a")
                                    : "--"}
                                </h6>
                              </div>

                              <div className="col-6">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "To Time"
                                  }}
                                />

                                <h6>
                                  {this.state.work_break1 === "Y"
                                    ? moment(
                                        this.state.to_break_hr1,
                                        "hh:mm:ss"
                                      ).format("hh:mm a")
                                    : "--"}
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 algaehLabelFormGroup">
                            <label className="algaehLabelGroup">
                              Day Break 2
                            </label>
                            <div className="row">
                              <div className="col-6">
                                <AlgaehLabel
                                  label={{
                                    fieldName: "frm_time"
                                  }}
                                />

                                <h6>
                                  {this.state.work_break2 === "Y"
                                    ? moment(
                                        this.state.from_break_hr2,
                                        "hh:mm:ss"
                                      ).format("hh:mm a")
                                    : "--"}
                                </h6>
                              </div>

                              <div className="col-6">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "To Time"
                                  }}
                                />

                                <h6>
                                  {this.state.work_break2 === "Y"
                                    ? moment(
                                        this.state.to_break_hr2,
                                        "hh:mm:ss"
                                      ).format("hh:mm a")
                                    : "--"}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row margin-top-15">
                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "wrkng_days",
                              isImp: true
                            }}
                          />

                          <h6 className="daysSpan">
                            <span>{this.state.sunday ? "SUN" : ""}</span>
                            <span>{this.state.monday ? "MON" : ""}</span>
                            <span>{this.state.tuesday ? "TUE" : ""}</span>
                            <span>{this.state.wednesday ? "WED" : ""}</span>
                            <span>{this.state.thursday ? "THU" : ""}</span>
                            <span>{this.state.friday ? "FRI" : ""}</span>
                            <span>{this.state.saturday ? "SAT" : ""}</span>
                          </h6>

                          {/* <h6>Weekdays</h6> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label className="algaehLabelGroup" style={{ left: 22 }}>
                        Doctors in the Schedule
                      </label>
                      <div className="scheduledDocList">
                        <ul>
                          {this.state.scheduleDoctors !== undefined ? (
                            this.state.scheduleDoctors.map((data, index) =>
                              this.state.pastSchedule ? (
                                <li>
                                  <span>{data.full_name}</span>
                                </li>
                              ) : (
                                <li key={index}>
                                  <i
                                    provider-name={data.full_name}
                                    provider-id={data.provider_id}
                                    id={data.appointment_schedule_header_id}
                                    onClick={this.openModifierPopup.bind(this)}
                                    className="fas fa-pen"
                                  />
                                  <i
                                    onClick={this.deleteDocFromSchedule.bind(
                                      this
                                    )}
                                    provider-id={data.provider_id}
                                    id={data.appointment_schedule_header_id}
                                    className="fas fa-trash-alt"
                                  />
                                  <span>{data.full_name}</span>
                                </li>
                              )
                            )
                          ) : (
                            <span className="noDataStyle">
                              Select schedule to view doctors
                            </span>
                          )}
                        </ul>
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ float: "right", marginTop: 10 }}
                        onClick={this.openAddDoctorModal}
                      >
                        Add Doctor
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="noDataStyle">
                  <h1>
                    <i className="fas fa-info-circle" />
                  </h1>
                  <p>Select a Schedule for more details</p>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhySchSetup;
