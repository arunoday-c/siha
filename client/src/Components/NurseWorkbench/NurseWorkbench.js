import React, { Component } from "react";
import "./nurse_workbench.scss";
import moment from "moment";
import { AlgaehLabel, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import Enumerable from "linq";
import algaehLoader from "../Wrapper/fullPageLoader";
import {
  algaehApiCall,
  swalMessage,
  maxCharactersLeft,
} from "../../utils/algaehApiCall";
import {
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehDateHandler,
} from "../Wrapper/algaehWrapper";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { setGlobal } from "../../utils/GlobalFunctions";
import config from "../../utils/config.json";
import {
  getAllChiefComplaints,
  getDepartmentVitals,
  temperatureConvertion,
  getFormula,
  datehandle,
  getPatientAllergies,
  texthandle,
  getAllAllergies,
  getPatientProfile,
  printPrescription,
  printSickleave,
} from "./NurseWorkbenchEvents";
import swal from "sweetalert2";
import Options from "../../Options.json";
import NursingWorkbenchHandler from "./NursingWorkbenchHandler";
import OrderedList from "../PatientProfile/Assessment/OrderedList/OrderedList";
import LabResults from "../PatientProfile/Assessment/LabResult/LabResult";
import RadResults from "../PatientProfile/Assessment/RadResult/RadResult";
import NursesNotes from "../PatientProfile/Examination/NursesNotes";
import { AlgaehSecurityComponent } from "algaeh-react-components";

class NurseWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      allAllergies: [],
      allergy_value: "F",
      patChiefComp: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d,
      recorded_date: new Date(),
      recorded_time: moment().format(config.formators.time),

      sub_department_id: null,
      provider_id: null,
      isPregnancy: true,

      chief_complaint: "",

      duration: null,

      interval: null,
      onset_date: null,
      pain: null,
      severity: null,
      chronic: null,
      complaint_type: null,
      pageDisplay: "Orders",
      patient_id: null,
    };

    this.baseState = this.state;
    this.chiefComplaintMaxLength = 200;

    this.loadListofData = this.loadListofData.bind(this);
    // this.isMale = String(Window["global"]["gender"]) === "Male" ? true : false;

    // if (
    //   this.props.allchiefcomplaints === undefined ||
    //   this.props.allchiefcomplaints.length === 0
    // ) {
    //   getAllChiefComplaints(this);
    // }
    this.isMale = false;

    this.complaintType = [];
  }

  componentDidMount() {
    this.loadListofData();
    getAllChiefComplaints(this);
    getDepartmentVitals(this);
    this.getDoctorsAndDepts();
    if (
      this.props.allallergies === undefined ||
      this.props.allallergies.length === 0
    ) {
      getAllAllergies(this, (data) => {
        this.setState({
          allSpecificAllergies: this.getPerticularAllergyList(data),
        });
      });
    }
    if (
      this.props.inventorylocations === undefined ||
      this.props.inventorylocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        module: "inventory",
        data: {
          location_status: "A",
        },
        method: "GET",
        redux: {
          type: "LOCATIONS_GET_DATA",
          mappingName: "inventorylocations",
        },
      });
    }
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified,
    });
  }

  allergyDropdownHandler(value) {
    let _filter_allergies = {};
    if (value.name === "allergy_value") {
      _filter_allergies = {
        allSpecificAllergies: this.getPerticularAllergyList(
          this.props.allallergies,
          value.value
        ),
      };
    }
    this.setState({ [value.name]: value.value, ..._filter_allergies });
  }

  getPerticularAllergyList(allergies, allergy_type) {
    allergy_type = allergy_type || this.state.allergy_value;
    return Enumerable.from(allergies)
      .where((w) => w.allergy_type === allergy_type)
      .toArray();
  }

  resetAllergies() {
    this.setState({
      hims_d_allergy_id: "",
      allergy_comment: "",
      allergy_inactive: "N",
      allergy_onset: "",
      allergy_severity: "",
      allergy_onset_date: null,
      //...this.baseState
    });
  }

  addAllergyToPatient(e) {
    e.preventDefault();
    if (this.state.hims_d_allergy_id === "") {
      this.setState({
        allergyNameError: true,
        allergyNameErrorText: "Required",
      });
    }
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientNewAllergy",
      method: "POST",
      data: {
        patient_id: this.state.patient_id,
        allergy_id: this.state.hims_d_allergy_id,
        onset: this.state.allergy_onset,
        onset_date: this.state.allergy_onset_date,
        severity: this.state.allergy_severity,
        comment: this.state.allergy_comment,
        allergy_inactive: this.state.allergy_inactive,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          getPatientAllergies(this);
          this.resetAllergies();
          swalMessage({
            title: "Allergy added successfully . .",
            type: "success",
          });
        }
      },
    });
  }

  resetSaveState() {
    this.setState({
      patChiefComp: [],
      nurse_notes: null,
      episode_id: null,
      patient_id: null,
      patient_code: null,
      patient_name: null,
      hims_d_hpi_header_id: null,
      onset_date: null,
      duration: null,
      interval: null,
      severity: null,
      score: null,
      pain: null,
      comment: null,
      chief_complaint_name: null,
      temperature_from: null,
      bp_position: null,
      complaint_type: null,
      chief_complaint: null,
      pageDisplay: "Orders",
    });

    const _resetElements = document.getElementById("vitals_recording");
    const _childs = _resetElements.querySelectorAll("[type='number']");
    for (let i = 0; i < _childs.length; i++) {
      let _name = _childs[i].name;
      this.setState({
        [_name]: "",
      });
    }
  }

  ChangeEventHandler(e) {
    NursingWorkbenchHandler().ChangeEventHandler(this, e);
  }

  addChiefComplainToPatient() {
    NursingWorkbenchHandler().addChiefComplainToPatient(this);
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });

    value.value === "PREGNANCY"
      ? this.setState({
          isPregnancy: false,
        })
      : this.setState({
          isPregnancy: true,
        });
  }
  dataLevelUpdate(e) {
    NursingWorkbenchHandler().dataLevelUpdate(this, e);
  }
  datehandle(e) {
    NursingWorkbenchHandler().datehandle(this, e);
  }
  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value === "" ? null : e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }

  updatePatientAllergy(data) {
    data.record_status = "A";

    algaehApiCall({
      uri: "/doctorsWorkbench/updatePatientAllergy",
      method: "PUT",
      data: data,
      onSuccess: (response) => {
        if (response.data.success) {
          getPatientAllergies(this);
          swalMessage({
            title: "Record updated successfully . .",
            type: "success",
          });
        }
      },
    });
  }

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  deleteAllergy(row) {
    swal({
      title: "Delete Allergy " + row.allergy_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        let data = {
          allergy_inactive: row.allergy_inactive,
          comment: row.comment,
          onset: row.onset,
          severity: row.severity,
          onset_date: row.onset_date,
          record_status: "I",
          hims_f_patient_allergy_id: row.hims_f_patient_allergy_id,
        };
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientAllergy",
          data: data,
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });
              getPatientAllergies(this);
            }
          },
          onFailure: (error) => {},
        });
      }
    });
  }

  savePatientExamn() {
    if (
      this.state.patient_name === undefined ||
      this.state.patient_name === null ||
      this.state.patient_name.length < 0
    ) {
      swalMessage({
        title: "Please Select a patient",
        type: "warning",
      });
      return;
    } else {
      let send_data = {};
      let bodyArray = [];
      const _elements = document.querySelectorAll("[vitalid]");

      for (let i = 0; i < _elements.length; i++) {
        if (_elements[i].value !== "") {
          const _isDepended = _elements[i].getAttribute("dependent");
          bodyArray.push({
            patient_id: this.state.patient_id,
            visit_id: this.state.visit_id,
            visit_date: this.state.recorded_date,
            visit_time: this.state.recorded_time,
            case_type: this.state.case_type,
            vital_id: _elements[i].getAttribute("vitalid"),
            vital_value: _elements[i].children[0].value
              ? _elements[i].children[0].value
              : 0.0,
            vital_value_one:
              _isDepended !== null
                ? document.getElementsByName(_isDepended)[0].value
                : null,
            formula_value: _elements[i].getAttribute("formula_value"),
          });
        }
      }
      send_data.nurse_notes = this.state.nurse_notes;
      send_data.chief_complaints = this.state.patChiefComp;
      send_data.patient_vitals = bodyArray;
      send_data.hims_f_patient_encounter_id = this.state.encounter_id;

      // AlgaehValidation({
      // querySelector: "data-validate='vitalsForm'",
      // alertTypeIcon: "warning",
      // onSuccess: () =>
      algaehApiCall({
        uri: "/nurseWorkBench/addPatientNurseChiefComplaints",
        method: "POST",
        data: send_data,
        onSuccess: (response) => {
          if (response.data.success) {
            swalMessage({
              title: "Recorded Successfully",
              type: "success",
            });
            // var element = document.querySelectorAll("[nursing_pat]");
            // for (var i = 0; i < element.length; i++) {
            //   element[i].classList.remove("active");
            // }
            this.resetSaveState();
            this.loadListofData();
          }
        },
        onError: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
      // });
    }
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where((w) => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState(
        {
          doctors: dept.doctors,
        },
        () => {
          this.loadListofData();
        }
      );
    });
  }

  dateDurationAndInterval(selectedDate) {
    let duration = 0;
    let interval = "D";
    if (moment().diff(selectedDate, "days") < 31) {
      duration = moment().diff(selectedDate, "days");
      interval = "D";
    } else if (moment().diff(selectedDate, "months") < 12) {
      duration = moment().diff(selectedDate, "months");
      interval = "M";
    } else if (moment().diff(selectedDate, "years")) {
      duration = moment().diff(selectedDate, "years");
      interval = "Y";
    }

    this.setState({
      onset_date: selectedDate,
      duration: duration,
      interval: interval,
    });
  }

  durationToDateAndInterval(duration, interval) {
    const _interval = Enumerable.from(GlobalVariables.PAIN_DURATION)
      .where((w) => w.value === interval)
      .firstOrDefault().name;
    const _date = moment().add(-duration, _interval.toLowerCase());
    return { interval, onset_date: _date._d };
  }

  dropDownHandle(value) {
    switch (value.name) {
      case "provider_id":
        this.setState(
          { [value.name]: value.value },

          () => {
            this.loadListofData();
          }
        );

        break;

      case "chief_complaint_id":
        if (
          this.state.patient_name === undefined ||
          this.state.patient_name === null
        ) {
          swalMessage({
            title: "Please Select a patient",
            type: "warning",
          });
        } else {
          this.setState({
            [value.name]: value.value,
            chief_complaint_name: value.selected.hpi_description,
          });
        }

        break;

      default:
        if (
          this.state.patient_name === undefined ||
          this.state.patient_name === null
        ) {
          swalMessage({
            title: "Please Select a patient",
            type: "error",
          });
        } else {
          this.setState({
            [value.name]: value.value,
          });
        }

        break;
    }
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
      module: "masterSettings",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  // addChiefComplainToPatient() {
  //   if (
  //     this.state.chief_complaint_id === null ||
  //     this.state.chief_complaint_id === undefined ||
  //     this.state.chief_complaint_id.length < 0
  //   ) {
  //     swalMessage({
  //       title: "Please select a chief complaint",
  //       type: "warning"
  //     });
  //   } else {
  //     this.state.patChiefComp.push({
  //       episode_id: this.state.episode_id,
  //       patient_id: this.state.patient_id,
  //       chief_complaint_id: this.state.chief_complaint_id,
  //       onset_date: this.state.onset_date,
  //       duration: this.state.duration,
  //       interval: this.state.interval,
  //       severity: this.state.severity,
  //       score: this.state.score,
  //       pain: this.state.pain,
  //       comment: this.state.comment,
  //       chief_complaint_name: this.state.chief_complaint_name
  //     });
  //
  //     this.setState({
  //       chief_complaint_id: null,
  //       onset_date: null,
  //       duration: null,
  //       interval: "D",
  //       severity: null,
  //       score: null,
  //       pain: null,
  //       comment: null,
  //       chief_complaint_name: null
  //     });
  //   }
  // }

  gridLevelUpdate(row, e) {
    e = e.name === undefined ? e.currentTarget : e;
    row[e.name] = e.value;
    if (e.name === "onset_date") {
      const _durat_interval = this.dateDurationAndInterval(e.value);
      row["duration"] = _durat_interval.duration;
      row["interval"] = _durat_interval.interval;
    } else if (e.name === "duration") {
      const _duration_Date_Interval = this.durationToDateAndInterval(
        e.value,
        row["interval"]
      );
      row["onset_date"] = _duration_Date_Interval.onset_date;
      row["interval"] = _duration_Date_Interval.interval;
    } else if (e.name === "interval") {
      const _dur_date_inter = this.durationToDateAndInterval(
        row["duration"],
        e.value
      );
      row["onset_date"] = _dur_date_inter.onset_date;
    } else if (e.name === "chronic") {
      row[e.name] = e.checked ? "Y" : "N";
    } else if (e.name === "complaint_inactive") {
      row[e.name] = e.checked ? "Y" : "N";
      if (e.checked) row["complaint_inactive_date"] = moment()._d;
      else row["complaint_inactive_date"] = null;
    }
    row.update();
  }

  // onChiefComplaintRowDone(row) {
  //   this.state.patChiefComp[row.rowIdx] = row;
  // }

  onChiefComplaintRowDelete(row) {
    swal({
      title: "Delete Complaint " + row.chief_complaint_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        this.state.patChiefComp.pop(row);

        this.setState({
          patChiefComp: this.state.patChiefComp,
        });
      }
    });
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({
      selectedHDate: dt,
      activeDateHeader: dt,
      patient_name: null,
    });
  }

  liGenerate() {
    let momDate = moment(this.state.selectedHDate);
    let initialDate = momDate._d;
    var date = initialDate,
      y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    let endDate = moment(lastDay)._d;

    let generatedLi = [];

    while (
      moment(initialDate).format("YYYYMMDD") <=
      moment(endDate).format("YYYYMMDD")
    ) {
      let dt = moment(initialDate);

      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd"),
      });

      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }
  onSelectedDateHandler(e) {
    const fromDate = e.currentTarget.getAttribute("date");
    this.setState(
      {
        activeDateHeader: e.currentTarget.getAttribute("date"),
        fromDate: e.currentTarget.getAttribute("date"),
        toDate: e.currentTarget.getAttribute("date"),
        patient_name: null,
      },
      () => {
        localStorage.setItem(
          "workbenchDateRange",
          JSON.stringify({
            fromDate: fromDate,
            toDate: fromDate,
            activeDateHeader: fromDate,
          })
        );
        this.loadListofData();
        this.resetSaveState();
      }
    );
  }

  changeOnsetEdit(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  moveToStation(data, e) {
    this.resetSaveState();

    this.isMale = data.gender === "Male" ? true : false;
    if (data.gender === "Male") {
      this.complaintType = Enumerable.from(GlobalVariables.COMPLAINT_TYPE)
        .where((w) => w["value"] !== "PREGNANCY")
        .toArray();
    } else {
      this.complaintType = GlobalVariables.COMPLAINT_TYPE;
    }
    setGlobal({
      current_patient: data.patient_id,
      episode_id: data.episode_id,
      visit_id: data.visit_id,
      encounter_id: data.hims_f_patient_encounter_id,
      provider_id: data.provider_id,
      sub_department_id: data.sub_department_id,
    });

    this.props.getOrderList({
      uri: "/orderAndPreApproval/selectOrderServicesbyDoctor",
      method: "GET",
      data: {
        visit_id: data.visit_id,
      },
      redux: {
        type: "ORDER_SERVICES_GET_DATA",
        mappingName: "orderedList",
      },
    });

    this.props.getConsumableOrderList({
      uri: "/orderAndPreApproval/getVisitConsumable",
      method: "GET",
      data: {
        visit_id: data.visit_id,
      },
      redux: {
        type: "ORDER_SERVICES_GET_DATA",
        mappingName: "consumableorderedList",
      },
    });

    this.props.getPakageList({
      uri: "/orderAndPreApproval/getPatientPackage",
      method: "GET",
      data: {
        patient_id: data.visit_id,
      },
      redux: {
        type: "PAIENT_PACKAGE_GET_DATA",
        mappingName: "pakageList",
      },
    });

    this.setState(
      {
        patient_name: data.full_name,
        patient_code: data.patient_code,
        current_patient: data.patient_id,
        episode_id: data.episode_id,
        encounter_id: data.hims_f_patient_encounter_id,
        patient_id: data.patient_id,
        visit_id: data.visit_id,
        inventory_location_id: data.inventory_location_id,
        location_type: data.location_type,
      },
      () => {
        getPatientAllergies(this);
        getPatientProfile(this);
        // else {
        let _allergies = Enumerable.from(this.props.patient_allergies)
          .groupBy("$.allergy_type", null, (k, g) => {
            return {
              allergy_type: k,
              allergy_type_desc:
                k === "F"
                  ? "Food"
                  : k === "A"
                  ? "Airborne"
                  : k === "AI"
                  ? "Animal  &  Insect"
                  : k === "C"
                  ? "Chemical & Others"
                  : "",
              allergyList: g.getSource(),
            };
          })
          .toArray();

        this.setState({
          allSpecificAllergies: this.getPerticularAllergyList(
            this.props.allallergies
          ),
          patientAllergies: _allergies,
          allPatientAllergies: this.props.patient_allergies,
        });
      }
    );

    var element = document.querySelectorAll("[nursing_pat]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  }

  generateHorizontalDateBlocks() {
    const act_date = new Date(this.state.activeDateHeader);
    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            <ul className="calendarDays">
              {this.liGenerate().map((row, index) => {
                const _currDate = moment(row.currentdate).format("YYYYMMDD");
                const _activeDate = moment(act_date).format("YYYYMMDD");
                return (
                  <li
                    // className="col"
                    key={index}
                    date={row.currentdate}
                    className={
                      _currDate === _activeDate
                        ? _currDate === moment().format("YYYYMMDD")
                          ? " activeDate CurrentDate"
                          : " activeDate"
                        : _currDate === moment().format("YYYYMMDD")
                        ? " CurrentDate"
                        : ""
                    }
                    onClick={this.onSelectedDateHandler.bind(this)}
                  >
                    {row.day}
                    <span>{row.dayName}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  loadListofData() {
    algaehLoader({ show: true });

    const dateRange =
      localStorage.getItem("workbenchDateRange") !== null
        ? JSON.parse(localStorage.getItem("workbenchDateRange"))
        : {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            activeDateHeader: this.state.fromDate,
          };

    let inputObj = {
      fromDate: moment(dateRange.fromDate).format("YYYY-MM-DD"),
      toDate: moment(dateRange.toDate).format("YYYY-MM-DD"),
    };
    if (this.state.sub_department_id !== null) {
      inputObj.sub_department_id = this.state.sub_department_id;
    }
    if (this.state.provider_id !== null) {
      inputObj.provider_id = this.state.provider_id;
      inputObj.doctor_id = this.state.provider_id;
    }

    algaehApiCall({
      uri: "/nurseWorkBench/getNurseMyDay",
      data: inputObj,
      method: "GET",
      cancelRequestId: "getNurseMyDay",
      onSuccess: (response) => {
        if (response.data.success) {
          const _selecDate = new Date(dateRange.activeDateHeader).setDate(1);

          this.setState(
            {
              selectedHDate: _selecDate,
              data: response.data.records,
              activeDateHeader: dateRange.activeDateHeader,
            },
            () => {
              algaehLoader({ show: false });
            }
          );
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  masterChiefComplaintsSortList(patChiefComplain, allmastercomplaints) {
    allmastercomplaints = allmastercomplaints || null;

    let allChiefComp =
      allmastercomplaints === null
        ? this.props.allchiefcomplaints
        : allmastercomplaints;
    for (let i = 0; i < patChiefComplain.length; i++) {
      let idex = Enumerable.from(allChiefComp)
        .where(
          (w) =>
            w.hims_d_hpi_header_id === patChiefComplain[i]["chief_complaint_id"]
        )
        .firstOrDefault();
      if (idex !== undefined)
        allChiefComp.splice(allChiefComp.indexOf(idex), 1);
    }
    return allChiefComp;
  }

  texthandle(e) {
    if (
      this.state.patient_name === undefined ||
      this.state.patient_name === null
    ) {
      swalMessage({
        title: "Please Select a patient",
        type: "warning",
      });
      return;
    } else if (parseFloat(e.target.value) < 0) {
      swalMessage({
        title: "Cannot be less than zero",
        type: "warning",
      });
      return;
    } else if (e.target.name === "o2 sat") {
      if (parseFloat(e.target.value) > 100) {
        swalMessage({
          title: "% Cannot be greater than 100",
          type: "warning",
        });
        return;
      }
    } else if (e.target.name === "weight") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: e.target.value,
        HEIGHT: this.state.height,
        onSuccess: (bmi) => {
          this.setState({ bmi: bmi });
        },
      });
    } else if (e.target.name === "height") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: this.state.weight,
        HEIGHT: e.target.value,
        onSuccess: (bmi) => {
          this.setState({ bmi: bmi });
        },
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    const _department_viatals =
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
        ? []
        : this.props.department_vitals;

    return (
      <div className="nurse_workbench">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ height: "34px" }}>
              <div className="myDay_date">
                <input
                  className="calender-date"
                  type="month"
                  onChange={this.monthChangeHandler.bind(this)}
                  value={moment(this.state.selectedHDate).format("YYYY-MM")}
                  max={moment(new Date()).format("YYYY-MM")}
                />
                {/* <button
                        onClick={() => {
                          this.setState({
                            activeDateHeader: new Date()
                          });
                        }}
                        className="btn btn-default btn-sm  todayBtn"
                      >
                        {getLabelFromLanguage({
                          fieldName: "today"
                        })}
                      </button> */}
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>

        <div className="row card-deck panel-layout">
          <div className="col-lg-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{ fieldName: "patients_list", returnText: "true" }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  <AlgaehLabel label={{ fieldName: "total_patients" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(
                          (w) => w.status === "V" && w.nurse_examine === "N"
                        )
                        .toArray().length
                    }
                  </span>
                </div>
              </div>

              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-6" }}
                  label={{
                    fieldName: "department_name",
                    isImp: false,
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: this.state.sub_department_id,
                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "sub_dept_id",
                      data: this.state.departments,
                    },
                    onChange: this.deptDropDownHandler.bind(this),
                    onClear: () => {
                      this.setState(
                        {
                          sub_department_id: null,
                          doctors: [],
                          provider_id: null,
                        },
                        () => {
                          this.loadListofData();
                        }
                      );
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6" }}
                  label={{
                    fieldName: "doctor_name",
                  }}
                  selector={{
                    name: "provider_id",
                    className: "select-fld",
                    value: this.state.provider_id,
                    dataSource: {
                      textField: "full_name",
                      valueField: "provider_id",
                      data: this.state.doctors,
                    },
                    onChange: this.dropDownHandle.bind(this),
                    onClear: () => {
                      this.setState(
                        {
                          provider_id: null,
                        },
                        () => {
                          this.loadListofData();
                        }
                      );
                    },
                  }}
                />
              </div>

              <div className="portlet-body">
                <div className="opPatientList">
                  <ul className="opList">
                    {this.state.data.length !== 0 ? (
                      this.state.data.map((data, index) => (
                        <li
                          nursing_pat={index}
                          key={index}
                          onClick={this.moveToStation.bind(this, data)}
                        >
                          <span className="op-sec-1">
                            <i
                              className={
                                data.appointment_patient === "Y"
                                  ? "appointment-icon"
                                  : "walking-icon"
                              }
                            />
                            <span className="opTime">
                              {moment(data.encountered_date).format("HH:mm A")}
                            </span>
                          </span>
                          <span className="op-sec-2">
                            <span className="opPatientName">
                              <small style={{ display: "block" }}>
                                {" "}
                                {data.patient_code}
                              </small>
                              {data.full_name}
                            </span>
                            <span className="opStatus nursing">
                              {data.nurse_examine === "Y"
                                ? "Nursing Done"
                                : "Nursing Pending"}
                            </span>
                            <span className="opPatientName">
                              {data.visit_type_desc}
                            </span>
                          </span>
                          <span className="op-sec-3">
                            <span className="opPatientStatus newVisit">
                              New Visit
                            </span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <div className="col noPatientDiv">
                        {/* <h4>Relax</h4> */}
                        <p>No Patients Available</p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8 opPatientDetails">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body" id="vitals_recording">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                    <h6>
                      {" "}
                      {this.state.patient_code !== undefined ? (
                        <span>{this.state.patient_code}</span>
                      ) : (
                        "----------"
                      )}
                    </h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                    <h6>
                      {" "}
                      {this.state.patient_name !== undefined ? (
                        <span>{this.state.patient_name}</span>
                      ) : (
                        "----------"
                      )}
                    </h6>
                  </div>

                  {this.state.patient_code !== undefined ? (
                    <div
                      className="col-5"
                      style={{ textAlign: "right", marginTop: 10 }}
                    >
                      <button
                        className="btn btn-small btn-default"
                        style={{ marginRight: 10 }}
                        onClick={printSickleave.bind(this, this)}
                      >
                        Print Sick Leave
                      </button>
                      <button
                        className="btn btn-small btn-default"
                        onClick={printPrescription.bind(this, this)}
                      >
                        Print Prescription
                      </button>
                    </div>
                  ) : null}
                </div>
                <hr></hr>

                <AlgaehSecurityComponent componentCode="NUR_PAT_VIT">
                  {/* Vitals Start */}
                  <div
                    className="row margin-bottom-15"
                    data-validate="vitalsForm"
                  >
                    {_department_viatals.map((item, index) => {
                      const _className =
                        item.hims_d_vitals_header_id === 1
                          ? "col-3"
                          : item.hims_d_vitals_header_id >= 3
                          ? "col-3 vitalTopFld15"
                          : item.hims_d_vitals_header_id === 5 ||
                            item.hims_d_vitals_header_id === 6
                          ? "col-3 vitalTopFld20"
                          : "col-3";
                      const _name = String(item.vitals_name)
                        .replace(/" "/g, "_")
                        .toLowerCase();
                      const _disable = _name === "bmi" ? true : false;
                      const _dependent =
                        item.hims_d_vitals_header_id === 8 ||
                        item.hims_d_vitals_header_id === 9
                          ? { dependent: "bp_position" }
                          : item.hims_d_vitals_header_id === 4
                          ? { dependent: "temperature_from" }
                          : {};
                      return (
                        <React.Fragment key={index}>
                          {item.hims_d_vitals_header_id === 4 ? (
                            <React.Fragment>
                              <AlagehAutoComplete
                                div={{ className: "col-3" }}
                                label={{
                                  fieldName: "temp_frm",
                                }}
                                selector={{
                                  name: "temperature_from",
                                  className: "select-fld",
                                  value: this.state.temperature_from,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.TEMP_FROM,
                                  },

                                  onChange: this.dropDownHandle.bind(this),
                                }}
                              />
                            </React.Fragment>
                          ) : item.hims_d_vitals_header_id === 8 ? (
                            <AlagehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "bp",
                                // fieldName: "BP_type"
                              }}
                              selector={{
                                name: "bp_position",
                                className: "select-fld",
                                value: this.state.bp_position,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.BP_POSITION,
                                },
                                onChange: this.dropDownHandle.bind(this),
                              }}
                            />
                          ) : null}

                          <AlagehFormGroup
                            div={{
                              className: _className,
                              others: { key: index },
                            }}
                            label={{
                              forceLabel:
                                item.uom === "C"
                                  ? "°C"
                                  : item.uom === "F"
                                  ? "°F"
                                  : item.vital_short_name +
                                    " (" +
                                    String(item.uom).trim() +
                                    ")",
                              isImp: item.mandatory === 0 ? false : true,
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: _name,
                              others: {
                                type: "number",
                                min: 0,
                                disabled: _disable,
                                vitalid: item.hims_d_vitals_header_id,
                                formula_value: String(item.uom).trim(),
                                ..._dependent,
                              },
                              value: this.state[_name],
                              events: {
                                onChange: this.texthandle.bind(this),
                              },
                            }}
                          />

                          {item.hims_d_vitals_header_id === 4 ? (
                            <AlagehFormGroup
                              div={{ className: "col-3" }}
                              label={{
                                forceLabel: item.uom === "C" ? "°F" : "°C",
                              }}
                              textBox={{
                                className: "txt-fld",
                                disabled: true,
                                value: temperatureConvertion(
                                  this.state[_name],
                                  item.uom
                                ),
                              }}
                            />
                          ) : null}
                          {/* {item.hims_d_vitals_header_id === 8 ? " / " : null} */}
                        </React.Fragment>
                      );
                    })}

                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{ fieldName: "rec_date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "recorded_date",
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: (selectedDate) => {
                          this.setState({ recorded_date: selectedDate });
                        },
                      }}
                      value={this.state.recorded_date}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        isImp: true,
                        fieldName: "rec_time",
                      }}
                      textBox={{
                        others: {
                          type: "time",
                        },
                        className: "txt-fld",
                        name: "recorded_time",
                        value: this.state.recorded_time,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                      }}
                    />
                  </div>
                  {/* Vitals End */}
                  <hr />
                </AlgaehSecurityComponent>

                <AlgaehSecurityComponent componentCode="NUR_PAT_ALRGY">
                  <h6>Enter Patient Allergies</h6>
                  <div className="row">
                    <div className="col-8">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-lg-6" }}
                          label={{
                            forceLabel: "Allergy Type",
                            fieldName: "sample",
                          }}
                          selector={{
                            name: "allergy_value",
                            className: "select-fld",
                            value: this.state.allergy_value,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.ALLERGY_TYPES,
                            },
                            onChange: this.allergyDropdownHandler.bind(this),
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-lg-6" }}
                          label={{
                            forceLabel: "Select an Allergy",
                            fieldName: "sample",
                          }}
                          selector={{
                            name: "hims_d_allergy_id",
                            className: "select-fld",
                            value: this.state.hims_d_allergy_id,
                            dataSource: {
                              textField: "allergy_name",
                              valueField: "hims_d_allergy_id",
                              data: this.state.allSpecificAllergies,
                            },
                            onChange: this.dropDownHandle.bind(this),
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Onset",
                          }}
                          selector={{
                            name: "allergy_onset",
                            className: "select-fld",
                            value: this.state.allergy_onset,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.ALLERGY_ONSET,
                            },
                            onChange: this.dropDownHandle.bind(this),
                          }}
                        />

                        {this.state.allergy_onset === "O" ? (
                          <AlgaehDateHandler
                            div={{ className: "col-lg-6 margin-top-15" }}
                            label={{
                              forceLabel: "Onset Date",
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "allergy_onset_date",
                            }}
                            maxDate={new Date()}
                            events={{
                              onChange: datehandle.bind(this, this),
                            }}
                            value={this.state.allergy_onset_date}
                          />
                        ) : null}

                        <AlagehAutoComplete
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Severity",
                            fieldName: "sample",
                          }}
                          selector={{
                            name: "allergy_severity",
                            className: "select-fld",
                            value: this.state.allergy_severity,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.PAIN_SEVERITY,
                            },
                            onChange: this.dropDownHandle.bind(this),
                          }}
                        />

                        {/* <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "allergy_comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.allergy_comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      /> */}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-12" }}
                          label={{
                            isImp: false,
                            fieldName: "comments",
                          }}
                          textBox={{
                            others: {
                              multiline: true,
                              rows: "2",
                            },
                            className: "txt-fld",
                            name: "allergy_comment",
                            value: this.state.allergy_comment,
                            events: {
                              onChange: this.texthandle.bind(this),
                            },
                          }}
                        />
                        <div className="col-12 margin-top-15">
                          <button
                            className="btn btn-primary"
                            onClick={this.addAllergyToPatient.bind(this)}
                          >
                            ADD ALLERGY
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div
                      className="col-12 patientAllergyGrid_Cntr"
                      id="hpi-grid-cntr"
                    >
                      <AlgaehDataGrid
                        id="patient-allergy-grid"
                        columns={[
                          {
                            fieldName: "allergy_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Allergy Type" }}
                              />
                            ),

                            displayTemplate: (data) => {
                              return (
                                <span>
                                  {data.allergy_type === "F" ? (
                                    <span> Food</span>
                                  ) : data.allergy_type === "A" ? (
                                    <span>Airborne </span>
                                  ) : data.allergy_type === "AI" ? (
                                    <span>Animal and Insect </span>
                                  ) : data.allergy_type === "C" ? (
                                    <span>Chemical and Others </span>
                                  ) : data.allergy_type === "N" ? (
                                    <span>NKA </span>
                                  ) : data.allergy_type === "D" ? (
                                    <span>Drug </span>
                                  ) : null}
                                </span>
                              );
                            },
                            editorTemplate: (data) => {
                              return (
                                <span>
                                  {data.allergy_type === "F" ? (
                                    <span> Food</span>
                                  ) : data.allergy_type === "A" ? (
                                    <span>Airborne </span>
                                  ) : data.allergy_type === "AI" ? (
                                    <span>Animal and Insect </span>
                                  ) : data.allergy_type === "C" ? (
                                    <span>Chemical and Others </span>
                                  ) : data.allergy_type === "N" ? (
                                    <span>NKA </span>
                                  ) : data.allergy_type === "D" ? (
                                    <span>Drug </span>
                                  ) : null}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "allergy_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Allergy Name" }}
                              />
                            ),
                            disabled: true,
                            editorTemplate: (data) => {
                              return <span>{data.allergy_name}</span>;
                            },
                          },
                          {
                            fieldName: "onset",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Onset" }} />
                            ),
                            displayTemplate: (data) => {
                              return data.onset === "A" ? (
                                <span>Adulthood</span>
                              ) : data.onset === "T" ? (
                                <span>Teenage</span>
                              ) : data.onset === "P" ? (
                                <span>Pre Terms</span>
                              ) : data.onset === "C" ? (
                                <span>Childhood</span>
                              ) : data.onset === "O" ? (
                                <span>Onset Date</span>
                              ) : (
                                ""
                              );
                            },
                            editorTemplate: (data) => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "onset",
                                    className: "select-fld",
                                    value: data.onset,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.ALLERGY_ONSET,
                                    },
                                    others: {
                                      disabled: true,
                                    },

                                    onChange: this.changeOnsetEdit.bind(
                                      this,
                                      data
                                    ),
                                  }}
                                />
                              );
                            },
                          },
                          {
                            fieldName: "onset_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Onset Date" }}
                              />
                            ),
                            displayTemplate: (data) => {
                              return (
                                <span>
                                  {this.changeDateFormat(data.onset_date)}
                                </span>
                              );
                            },
                            editorTemplate: (data) => {
                              return (
                                <AlgaehDateHandler
                                  div={{}}
                                  textBox={{
                                    className: "txt-fld hidden",
                                    name: "onset_date",
                                  }}
                                  minDate={new Date()}
                                  events={{
                                    onChange: datehandle.bind(this, this, data),
                                  }}
                                  // disabled={data.onset === "O" ? false : true}
                                  disabled={true}
                                  value={data.onset_date}
                                />
                              );
                            },
                          },
                          {
                            fieldName: "severity",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Severity" }} />
                            ),
                            displayTemplate: (data) => {
                              return data.severity === "MI" ? (
                                <span>Mild</span>
                              ) : data.severity === "MO" ? (
                                <span>Moderate</span>
                              ) : data.severity === "SE" ? (
                                <span>Severe</span>
                              ) : (
                                ""
                              );
                            },
                            editorTemplate: (data) => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "severity",
                                    className: "select-fld",
                                    value: data.severity,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.PAIN_SEVERITY,
                                    },
                                    onChange: texthandle.bind(this, this, data),
                                  }}
                                />
                              );
                            },
                          },
                          {
                            fieldName: "comment",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Comment" }} />
                            ),
                            editorTemplate: (data) => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "comment",
                                    value: data.comment,
                                    events: {
                                      onChange: texthandle.bind(
                                        this,
                                        this,
                                        data
                                      ),
                                    },
                                  }}
                                />
                              );
                            },
                          },
                        ]}
                        keyId="hims_f_patient_allergy_id"
                        dataSource={{
                          data: this.state.allPatientAllergies,
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onDelete: this.deleteAllergy.bind(this),
                          onEdit: (row) => {},
                          onDone: this.updatePatientAllergy.bind(this),
                        }}
                      />
                    </div>
                  </div>
                  <hr />
                </AlgaehSecurityComponent>

                <AlgaehSecurityComponent componentCode="NUR_PAT_CHF_COM">
                  <div className="row">
                    <div className="col-12">
                      <h6>Enter Chief Complaints</h6>
                      <div className="portlet portlet-bordered margin-bottom-15">
                        <div className="portlet-body">
                          <div className="row">
                            <div className="col-12">
                              <div className="row">
                                <div className="col-12">
                                  <textarea
                                    value={this.state.chief_complaint}
                                    name="chief_complaint"
                                    onChange={this.textAreaEvent.bind(this)}
                                    maxLength={this.chiefComplaintMaxLength}
                                  >
                                    {this.state.chief_complaint}
                                  </textarea>
                                  <small className="float-right">
                                    Max Char.{" "}
                                    {maxCharactersLeft(
                                      this.chiefComplaintMaxLength,
                                      this.state.chief_complaint
                                    )}
                                    /{this.chiefComplaintMaxLength}
                                  </small>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="row">
                                <AlgaehDateHandler
                                  div={{ className: "col-8" }}
                                  label={{
                                    forceLabel: "Onset Date",
                                  }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "onset_date",
                                  }}
                                  maxDate={new Date()}
                                  events={{
                                    onChange: this.datehandle.bind(this),
                                  }}
                                  value={this.state.onset_date}
                                />

                                <AlagehAutoComplete
                                  div={{ className: "col-4" }}
                                  label={{
                                    forceLabel: "Interval",
                                    isImp: false,
                                  }}
                                  selector={{
                                    name: "interval",
                                    className: "select-fld",
                                    value: this.state.interval,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.PAIN_DURATION,
                                    },
                                    onChange: this.dataLevelUpdate.bind(this),
                                  }}
                                />

                                <AlagehFormGroup
                                  div={{ className: "col-4" }}
                                  label={{
                                    forceLabel: "Duration",
                                    isImp: false,
                                  }}
                                  textBox={{
                                    number: {
                                      allowNegative: false,
                                    },
                                    dontAllowKeys: ["-", "e"],
                                    className: "txt-fld",
                                    name: "duration",
                                    value: this.state.duration,
                                    events: {
                                      onChange: this.dataLevelUpdate.bind(this),
                                    },
                                    others: {
                                      min: 0,
                                    },
                                  }}
                                />
                                <AlagehAutoComplete
                                  div={{ className: "col-4" }}
                                  label={{
                                    forceLabel: "Complaint Type",
                                    isImp: false,
                                  }}
                                  selector={{
                                    name: "complaint_type",
                                    className: "select-fld",
                                    value: this.state.complaint_type,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: this.complaintType,
                                    },
                                    onChange: this.dropDownHandler.bind(this),
                                  }}
                                />

                                {this.isMale ? null : (
                                  <AlagehFormGroup
                                    div={{ className: "col-4" }}
                                    label={{
                                      forceLabel: "LMP (Days)",
                                      isImp: false,
                                    }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "lmp_days",
                                      number: true,
                                      value: this.state.lmp_days,
                                      disabled: this.state.isPregnancy,
                                      events: {
                                        onChange: this.ChangeEventHandler.bind(
                                          this
                                        ),
                                      },
                                    }}
                                  />
                                )}

                                <div className="col-12 margin-top-15">
                                  <button
                                    className="btn btn-primary"
                                    onClick={this.addChiefComplainToPatient.bind(
                                      this
                                    )}
                                  >
                                    ADD
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Chief Complaint End */}
                    </div>
                  </div>
                </AlgaehSecurityComponent>

                <AlgaehSecurityComponent componentCode="NUR_PAT_NOTE">
                  <div className="row">
                    {" "}
                    <div className="col-12">
                      {/* Notes Start */}
                      {this.state.patient_id ? (
                        <NursesNotes
                          key={this.state.patient_id}
                          patient_id={this.state.patient_id}
                          episode_id={this.state.episode_id}
                          visit_id={this.state.visit_id}
                          visit_date={this.state.visit_date}
                        />
                      ) : (
                        <>
                          <h6>Enter Nurse Notes</h6>
                          <p>Please select a patient first</p>
                        </>
                      )}
                    </div>
                  </div>
                </AlgaehSecurityComponent>
                <AlgaehSecurityComponent componentCode="NUR_ORD_SERV">
                  <h6>Nurse Order Service</h6>
                  {this.state.patient_id !== null ? (
                    <div className="row">
                      <div className="col-12">
                        <div className="tab-container toggle-section">
                          <ul className="nav">
                            <li
                              algaehtabs={"Orders"}
                              className={"nav-item tab-button active"}
                              onClick={this.openTab.bind(this)}
                            >
                              {
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Order Investigation",
                                  }}
                                />
                              }
                            </li>

                            <li
                              algaehtabs={"OrderConsumable"}
                              className={"nav-item tab-button"}
                              onClick={this.openTab.bind(this)}
                            >
                              {
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Order Consumable",
                                  }}
                                />
                              }
                            </li>

                            <li
                              algaehtabs={"OrderPackage"}
                              className={"nav-item tab-button"}
                              onClick={this.openTab.bind(this)}
                            >
                              {
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Order Package",
                                  }}
                                />
                              }
                            </li>
                            <li
                              algaehtabs={"LabResults"}
                              className={"nav-item tab-button"}
                              onClick={this.openTab.bind(this)}
                            >
                              {
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Lab Results",
                                  }}
                                />
                              }
                            </li>
                            <li
                              algaehtabs={"RisResults"}
                              className={"nav-item tab-button"}
                              onClick={this.openTab.bind(this)}
                            >
                              {
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "RIS Results",
                                  }}
                                />
                              }
                            </li>
                          </ul>
                        </div>

                        <div className="grid-section">
                          {this.state.pageDisplay === "Orders" ? (
                            <OrderedList
                              vat_applicable={this.props.vat_applicable}
                              openData="Investigation"
                              key="Investigation"
                            />
                          ) : this.state.pageDisplay === "OrderConsumable" ? (
                            <OrderedList
                              vat_applicable={this.props.vat_applicable}
                              inventory_location_id={
                                this.state.inventory_location_id
                              }
                              location_type={this.state.location_type}
                              openData="Consumable"
                              key="Consumable"
                            />
                          ) : this.state.pageDisplay === "OrderPackage" ? (
                            <OrderedList
                              vat_applicable={this.props.vat_applicable}
                              openData="Package"
                              key="Package"
                            />
                          ) : this.state.pageDisplay === "LabResults" ? (
                            <LabResults />
                          ) : this.state.pageDisplay === "RisResults" ? (
                            <RadResults />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Please select a patient first</p>
                  )}
                </AlgaehSecurityComponent>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.savePatientExamn.bind(this)}
              >
                <AlgaehLabel label={{ forceLabel: "Save" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allchiefcomplaints: state.allchiefcomplaints,
    patient_chief_complaints: state.patient_chief_complaints,
    department_vitals: state.department_vitals,
    allallergies: state.allallergies,
    patient_allergies: state.patient_allergies,
    consumableorderedList: state.consumableorderedList,
    pakageList: state.pakageList,
    orderedList: state.orderedList,
    inventorylocations: state.inventorylocations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllChiefComplaints: AlgaehActions,
      getPatientChiefComplaints: AlgaehActions,
      getDepartmentVitals: AlgaehActions,
      getAllAllergies: AlgaehActions,
      getPatientAllergies: AlgaehActions,
      getOrderList: AlgaehActions,
      getConsumableOrderList: AlgaehActions,
      getPakageList: AlgaehActions,
      getPatientProfile: AlgaehActions,
      getLocation: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NurseWorkbench)
);
