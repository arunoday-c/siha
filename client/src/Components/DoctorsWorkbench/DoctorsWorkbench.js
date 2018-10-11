import React, { Component } from "react";
import "./doctor_workbench.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  Tooltip,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../Wrapper/algaehWrapper";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Search from "@material-ui/icons/Search";
import GlobalVariables from "../../utils/GlobalVariables.json";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../utils/algaehApiCall";
import { setGlobal } from "../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
import algaehLoader from "../Wrapper/fullPageLoader";

class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: moment()._d,
      toDate: moment()._d,
      activeDateHeader: moment()._d
    };

    this.moveToEncounterList = this.moveToEncounterList.bind(this);
    this.loadListofData = this.loadListofData.bind(this);
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  dateHandle(value) {
    let dob = moment(value)._d;
    this.setState({ date_of_birth: value, client_date: dob });

    let age = moment().diff(dob, "years");
    this.setState({ age: age });
  }

  moveToEncounterList(e) {
    const patient_encounter_id = e.currentTarget.getAttribute(
      "data-encounterid"
    );
    const patient_id = e.currentTarget.getAttribute("data-patientid");

    algaehApiCall({
      uri: "/doctorsWorkBench/updatdePatEncntrStatus",
      data: {
        patient_encounter_id: patient_encounter_id
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          this.loadListofData();

          setGlobal(
            {
              "EHR-STD": "PatientProfile",
              current_patient: patient_id,
              episode_id: patient_encounter_id
            },
            () => {
              document.getElementById("ehr-router").click();
            }
          );
        }
      },
      onFailure: error => {}
    });
  }

  loadListofData() {
    debugger;
    algaehLoader({ show: true });
    const dateRange =
      localStorage.getItem("workbenchDateRange") !== null
        ? JSON.parse(localStorage.getItem("workbenchDateRange"))
        : {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            activeDateHeader: this.state.fromDate
          };

    algaehApiCall({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
      },
      method: "GET",
      cancelRequestId: "getMyDay",
      onSuccess: response => {
        if (response.data.success) {
          this.setState(
            {
              data: response.data.records,
              activeDateHeader: dateRange.activeDateHeader
            },
            () => {
              algaehLoader({ show: false });
            }
          );
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  componentWillUnmount() {
    cancelRequest("getMyDay");
  }

  componentDidMount() {
    this.loadListofData();
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

    while (initialDate <= endDate) {
      let dt = moment(initialDate);
      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd")
      });

      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }
  onSelectedDateHandler(e) {
    const fromDate = e.target.getAttribute("date");
    this.setState(
      {
        activeDateHeader: e.target.getAttribute("date"),
        fromDate: e.target.getAttribute("date"),
        toDate: e.target.getAttribute("date")
      },
      () => {
        localStorage.setItem(
          "workbenchDateRange",
          JSON.stringify({
            fromDate: fromDate,
            toDate: fromDate,
            activeDateHeader: fromDate
          })
        );
        this.loadListofData();
      }
    );
  }

  generateHorizontalDateBlocks() {
    const act_date = new Date(this.state.activeDateHeader);
    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              const _currDate = moment(row.currentdate).format("YYYYMMDD");
              const _activeDate = moment(act_date).format("YYYYMMDD");
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    _currDate === _activeDate
                      ? _currDate === moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : _currDate === moment().format("YYYYMMDD")
                        ? "col CurrentDate"
                        : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span>{row.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  render() {
    return (
      <div className="doctor_workbench">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ height: "34px" }}>
              <div className="myDay_date">
                <input
                  className="calender-date"
                  type="month"
                  onChange={this.monthChangeHandler.bind(this)}
                  value={moment(this.state.selectedHDate).format("YYYY-MM")}
                />
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>

        <div className="row card-deck panel-layout">
          {/* Left Pane Start */}
          <div className="col-lg-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{ fieldName: "patients_list", returnText: "true" }}
                    />
                  </h3>
                </div>
                <div className="actions" />
              </div>

              <div className="portlet-body">
                <div className="opPatientList">
                  <ul className="opList">
                    {Enumerable.from(this.state.data)
                      .where(w => w.status === "V")
                      .toArray().length !== 0 ? (
                      Enumerable.from(this.state.data)
                        .where(w => w.status === "V")
                        .toArray()
                        .map((data, index) => (
                          <li
                            key={index}
                            data-encounterid={String(
                              data.hims_f_patient_encounter_id
                            )}
                            data-patientid={String(data.patient_id)}
                            onClick={this.moveToEncounterList}
                          >
                            <span className="op-sec-1">
                              {/* <i className="appointment-icon" /> */}
                              <i className="walking-icon" />
                              <span className="opTime">
                                {moment(data.encountered_date).format(
                                  "HH:mm A"
                                )}
                              </span>
                            </span>
                            <span className="op-sec-2">
                              <span className="opPatientName">
                                {data.full_name}
                              </span>
                              <span className="opStatus nursing">
                                {data.nurse_examine === "Y"
                                  ? "Nursing Done"
                                  : "Nursing Pending"}
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
                        <p>No Out Patients Available</p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Left Pane End */}

          {/* Right Pane Start */}

          <div className="col-lg-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    <AlgaehLabel
                      label={{
                        fieldName: "encounter_list",
                        returnText: "true"
                      }}
                    />
                  </h3>
                </div>
                <div className="actions rightLabelCount">
                  <AlgaehLabel label={{ fieldName: "total_encounters" }} />
                  <span className="countNo">
                    {
                      Enumerable.from(this.state.data)
                        .where(w => w.status !== "V")
                        .toArray().length
                    }
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row" hidden={true} style={{ margin: "auto" }}>
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{
                      fieldName: "status"
                    }}
                    selector={{
                      name: "status",
                      className: "select-fld",
                      //value: this.state.consultation,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.DOC_WRK_BNCH_FILTER_CONDITIONS
                      },
                      //onChange: this.changeTexts.bind(this)
                      onChange: () => {}
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ fieldName: "from_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date"
                    }}
                    maxDate={moment()._d}
                    events={{
                      //onChange: datehandle.bind(this, this)
                      onChange: () => {}
                    }}
                    value={moment()._d}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ fieldName: "to_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date"
                    }}
                    maxDate={moment()._d}
                    events={{
                      //onChange: datehandle.bind(this, this)
                      onChange: () => {}
                    }}
                    value={moment()._d}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "patient_code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "patient_code",
                      // value: this.state.visit_type_code,
                      //error: this.state.visit_type_code_error,
                      //helperText: this.state.visit_type_code_error_txt,
                      events: {
                        //onChange: this.changeTexts.bind(this)
                        onChange: () => {}
                      }
                    }}
                  />
                  <div className="col-lg-1">
                    <Tooltip id="tooltip-icon" title="Search">
                      <IconButton className="go-button">
                        <Search onClick={() => {}} />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <div className="col-lg-1">
                    <Tooltip id="tooltip-icon" title="Go">
                      <IconButton className="go-button" color="primary">
                        <PlayCircleFilled onClick={() => {}} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                <AlgaehDataGrid
                  id="encounter_table"
                  //filter={true}
                  columns={[
                    {
                      fieldName: "status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      disabled: true,
                      displayTemplate: data => {
                        return (
                          <span>
                            {data.status === "W" ? <span>WIP </span> : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      ),
                      displayTemplate: data => {
                        return (
                          <span
                            className="pat-code"
                            onClick={() => {
                              setGlobal({
                                "EHR-STD": "PatientProfile",
                                current_patient: data.patient_id,
                                episode_id: data.episode_id,
                                visit_id: data.visit_id,
                                encounter_id: data.encounter_id,
                                provider_id: data.provider_id
                              });
                              document.getElementById("ehr-router").click();
                            }}
                          >
                            {data.patient_code}
                          </span>
                        );
                      },
                      className: drow => {
                        if (drow.checked_in === "N") return "testColor";
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "patient_name" }} />
                      )
                    },
                    {
                      fieldName: "encountered_date",
                      label: <AlgaehLabel label={{ fieldName: "date" }} />,
                      displayTemplate: data => {
                        return (
                          <span>
                            {moment(data.encountered_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "encountered_date",
                      label: <AlgaehLabel label={{ fieldName: "time" }} />,
                      displayTemplate: data => {
                        return (
                          <span>
                            {moment(data.encountered_date).format("HH:mm A")}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "patient_type",
                      label: <AlgaehLabel label={{ forceLabel: "Pay Type" }} />,
                      displayTemplate: data => {
                        return (
                          <span>
                            {data.payment_type === "I" ? "Insurance" : "Self"}
                          </span>
                        );
                      }
                    }
                    // ,
                    // {
                    //   fieldName: "transfer_status",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ fieldName: "transfer_status" }}
                    //     />
                    //   )
                    // }
                  ]}
                  rowClassName={row => {
                    //return "testColor";
                  }}
                  keyId="encounter_code"
                  dataSource={{
                    data: Enumerable.from(this.state.data)
                      .where(w => w.status !== "V")
                      .toArray()
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>
            </div>
          </div>
          {/* Right Pane End */}
        </div>
      </div>
    );
  }
}

export default DoctorsWorkbench;
