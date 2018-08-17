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
class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_daylist: [],
      selectedLang: "en",
      data: [],
      selectedHDate: new Date()
    };

    this.moveToEncounterList = this.moveToEncounterList.bind(this);
    this.loadListofData = this.loadListofData.bind(this);
  }

  moveToEncounterList(e) {
    let updated_by = getCookie("UserID");
    const patient_encounter_id = e.currentTarget.getAttribute(
      "data-encounterid"
    );

    console.log("Data to Update", updated_by + " ID" + patient_encounter_id);

    algaehApiCall({
      uri: "/doctorsWorkBench/updatdePatEncntrStatus",
      data: {
        patient_encounter_id: patient_encounter_id,
        updated_by: updated_by
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) this.loadListofData();
      },
      onFailure: error => {
        // this.setState({ open: false });
      }
    });
  }

  loadListofData() {
    this.props.getMyDay({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        provider_id: 2,
        fromDate: "2018-08-10",
        toDate: "2018-08-16"
      },
      method: "GET",
      redux: {
        type: "MYDAY_LIST_GET_DATA",
        mappingName: "myday_list"
      },
      afterSuccess: data => {
        this.setState({ data: data });

        console.log("Data Array:", data);

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
    let initialDate = moment(this.state.selectedHDate)._d;
    let endDate = moment(this.state.selectedHDate).add(30, "days")._d;

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
  generateHorizontalDateBlocks() {
    return (
      <div className="calendar">
        <ol>
          {this.liGenerate().map((row, index) => {
            return (
              <li key={index} currentdate={row.currentdate}>
                {row.day}
                <span>{row.dayName}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  monthChangeHandler(e) {
    let dt = e.target.value + "-01";
    this.setState({ selectedHDate: moment(dt, "YYYY-MM-DD")._d });
  }

  render() {
    return (
      <div className="doctor_workbench">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ width: "calc(100% - 185px)", height: "34px" }}>
              <div className="arrow-box arrow-box-left">
                <i className="fas fa-angle-left fa-2x" />
              </div>
              <div className="arrow-box arrow-box-right">
                <i className="fas fa-angle-right fa-2x" />
              </div>
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
            <AlgaehLabel label={{ fieldName: "patients_list" }} />
            <div className="opPatientList">
              <ul className="opList">
                {Enumerable.from(this.state.data)
                  .where(w => w.status === "V")
                  .toArray()
                  .map((data, index) => (
                    <li
                      key={index}
                      data-encounterid={String(
                        data.hims_f_patient_encounter_id
                      )}
                      onClick={this.moveToEncounterList}
                    >
                      <span className="op-sec-1">
                        <i className="appointment-icon" />
                        {/* <i className="walking-icon" /> */}
                        <span className="opTime">11:44:00</span>
                      </span>
                      <span className="op-sec-2">
                        <span className="opPatientName">{data.full_name}</span>
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
                  ))}
              </ul>
            </div>
          </div>
          {/* Left Pane End */}

          {/* Right Pane Start */}

          {/* <div className="col-lg-8 card encounters-panel">
            <div className="card-body box-shadow-normal">
              <h6 className="card-subtitle mb-2 text-muted">All Patients</h6> */}

          <div className="col-lg-8 card box-shadow-normal encounters-panel">
            <div className="row">
              <div className="col-lg-3">
                {" "}
                <AlgaehLabel label={{ fieldName: "encounter_list" }} />
              </div>
              <div className="col-lg-5">
                {" "}
                <AlgaehLabel label={{ fieldName: "total_encounters" }} /> :{" "}
                {
                  Enumerable.from(this.state.data)
                    .where(w => w.status !== "V")
                    .toArray().length
                }
              </div>
            </div>
            <div className="divider" />
            <div className="row">
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
                // value={this.state.receipt_date}
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
                // value={this.state.receipt_date}
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
              columns={[
                {
                  fieldName: "status",
                  label: <AlgaehLabel label={{ fieldName: "status" }} />,
                  disabled: true
                },
                {
                  fieldName: "patient_code",
                  label: <AlgaehLabel label={{ fieldName: "patient_code" }} />
                },
                {
                  fieldName: "full_name",
                  label: <AlgaehLabel label={{ fieldName: "patient_name" }} />
                },
                {
                  fieldName: "date",
                  label: <AlgaehLabel label={{ fieldName: "date" }} />
                },
                {
                  fieldName: "time",
                  label: <AlgaehLabel label={{ fieldName: "time" }} />
                },
                {
                  fieldName: "case_type",
                  label: <AlgaehLabel label={{ fieldName: "case_type" }} />
                },
                {
                  fieldName: "transfer_status",
                  label: (
                    <AlgaehLabel label={{ fieldName: "transfer_status" }} />
                  )
                },
                {
                  fieldName: "policy_group_description",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "policy_group_description" }}
                    />
                  )
                }
              ]}
              keyId="encounter_code"
              dataSource={{
                data: Enumerable.from(this.state.data)
                  .where(w => w.status !== "V")
                  .toArray()
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 5 }}
              events={{
                onDelete: row => {},
                onEdit: row => {},
                onDone: row => {}
              }}
            />
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
