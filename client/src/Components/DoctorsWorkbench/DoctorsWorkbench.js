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
import { algaehApiCall } from "../../utils/algaehApiCall";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { getCookie } from "../../utils/algaehApiCall";
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
      fromDate: new Date(),
      toDate: new Date(),
      activeDateHeader: new Date()
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
        debugger;
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

  moveToPatientProfile() {}

  loadListofData() {
    algaehLoader({ show: true });
    this.props.getMyDay({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: this.state.fromDate,
        toDate: this.state.toDate
      },
      method: "GET",
      redux: {
        type: "MYDAY_LIST_GET_DATA",
        mappingName: "myday_list"
      },
      afterSuccess: data => {
        this.setState({ data: data }, () => {
          algaehLoader({ show: false });
        });

        let listofvisit = Enumerable.from(data)
          .where(w => w.status === "V")
          .toArray();
        let listofattanedvisit = Enumerable.from(data)
          .where(w => w.status === "W")
          .toArray();
      }
    });
  }

  componentWillMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
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

    let generatedLi = new Array();

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
    this.setState(
      {
        activeDateHeader: e.target.getAttribute("date"),
        fromDate: e.target.getAttribute("date"),
        toDate: e.target.getAttribute("date")
      },
      () => {
        this.loadListofData();
      }
    );
  }

  generateHorizontalDateBlocks() {
    let classesCurrentDate = moment().format("YYYYMMDD");

    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    moment(row.currentdate).format("YYYYMMDD") ===
                    moment(this.state.activeDateHeader).format("YYYYMMDD")
                      ? moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
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
          <div className="col-lg-4 card box-shadow-normal">
            <div className="portletHeader">
              <AlgaehLabel label={{ fieldName: "patients_list" }} />
            </div>
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
                            {moment(data.encountered_date).format("HH:mm A")}
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
          {/* Left Pane End */}

          {/* Right Pane Start */}

          <div className="col-lg-8 card box-shadow-normal encounters-panel">
            <div className="portletHeader">
              <AlgaehLabel label={{ fieldName: "encounter_list" }} />
              <div className="rightLabelCount">
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
            <div className="col-12">
              <div className="row">
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
                    maxDate={new Date()}
                    events={{
                      //onChange: datehandle.bind(this, this)
                      onChange: () => {}
                    }}
                    value={new Date()}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ fieldName: "to_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      //onChange: datehandle.bind(this, this)
                      onChange: () => {}
                    }}
                    value={new Date()}
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
                <div className="col-12 margin-top-15">
                  <AlgaehDataGrid
                    id="encounter_table"
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
                                debugger;
                                setGlobal({
                                  "EHR-STD": "PatientProfile",
                                  current_patient: data.patient_id,
                                  episode_id: data.episode_id,
                                  visit_id: data.visit_id,
                                  encounter_id: data.encounter_id
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
                              {moment(data.encountered_date).format(
                                "DD-MM-YYYY"
                              )}
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
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "policy_group_description" }}
                          />
                        ),
                        displayTemplate: data => {
                          return (
                            <span>
                              {data.payment_type === "I" ? "Insurance" : "Self"}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "transfer_status",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "transfer_status" }}
                          />
                        )
                      }
                    ]}
                    rowClassName={row => {
                      debugger;
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
          </div>
          {/* Right Pane End */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myday_list: state.myday_list
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getMyDay: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DoctorsWorkbench)
);
