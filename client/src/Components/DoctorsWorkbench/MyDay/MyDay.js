import React, { Component } from "react";
import "./myday.css";
import Paper from "@material-ui/core/Paper";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";

class MyDay extends Component {
  render() {
    return (
      <div className="myday">
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ width: "calc(100% - 185px)", height: "34px" }}>
              <div className="arrow-box arrow-box-left">
                <i class="fas fa-angle-left fa-2x" />
              </div>
              <div className="arrow-box arrow-box-right">
                <i class="fas fa-angle-right fa-2x" />
              </div>
              <div className="myDay_date">
                <input type="month" />
              </div>
            </div>
            <div class="calendar">
              <ol>
                <li>
                  1<span>Wed</span>
                </li>
                <li>
                  2<span>Thu</span>
                </li>
                <li>
                  3<span>Fri</span>
                </li>
                <li>
                  4<span>Sat</span>
                </li>
                <li>
                  5<span>Sun</span>
                </li>
                <li>
                  6<span>Mon</span>
                </li>
                <li>
                  7<span>Tue</span>
                </li>
                <li>
                  8<span>Wed</span>
                </li>
                <li>
                  9<span>Thu</span>
                </li>
                <li>
                  10
                  <span>Fri</span>
                </li>
                <li>
                  11
                  <span>Sat</span>
                </li>
                <li>
                  12
                  <span>Sun</span>
                </li>
                <li className="selectedDate">
                  13
                  <span>Mon</span>
                </li>
                <li>
                  14
                  <span>Tue</span>
                </li>
                <li>
                  15
                  <span>Wed</span>
                </li>
                <li>
                  16
                  <span>Thu</span>
                </li>
                <li>
                  17
                  <span>Fri</span>
                </li>
                <li>
                  18
                  <span>Sat</span>
                </li>
                <li>
                  19
                  <span>Sun</span>
                </li>
                <li>
                  20
                  <span>Mon</span>
                </li>
                <li>
                  21
                  <span>Tue</span>
                </li>
                <li>
                  22
                  <span>Wed</span>
                </li>
                <li>
                  23
                  <span>Thu</span>
                </li>
                <li>
                  24
                  <span>Fri</span>
                </li>
                <li>
                  25
                  <span>Sat</span>
                </li>
                <li>
                  26
                  <span>Sun</span>
                </li>
                <li>
                  27
                  <span>Mon</span>
                </li>
                <li>
                  28
                  <span>Tue</span>
                </li>
                <li>
                  29
                  <span>Wed</span>
                </li>
                <li>
                  30
                  <span>Thu</span>
                </li>
                <li>
                  31
                  <span>Fri</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row card-deck panel-layout">
          {/* Left Pane Start */}
          <div className="col-lg-4 card box-shadow-normal">
            <AlgaehLabel label={{ fieldName: "patients_list" }} />
            <div className="opPatientList">
              <ul className="opList">
                <li>
                  <span className="op-sec-1">
                    <i className="walking-icon" />
                    <span className="opTime">11:44:00</span>
                  </span>
                  <span className="op-sec-2">
                    <span className="opPatientName">Laura Zahra Bayokhi</span>
                    <span className="opStatus nursing">Nursing Done</span>
                  </span>
                  <span className="op-sec-3">
                    <span className="opPatientStatus newVisit">New Visit</span>
                  </span>
                </li>
                <li>
                  <span className="op-sec-1">
                    <i className="walking-icon" />
                    <span className="opTime">11:44:00</span>
                  </span>
                  <span className="op-sec-2">
                    <span className="opPatientName">Laura Zahra Bayokhi</span>
                    <span className="opStatus nursing">Nursing Done</span>
                  </span>
                  <span className="op-sec-3">
                    <span className="opPatientStatus newVisit">New Visit</span>
                  </span>
                </li>
                <li>
                  <span className="op-sec-1">
                    <i className="appointment-icon" />
                    <span className="opTime">11:44:00</span>
                  </span>
                  <span className="op-sec-2">
                    <span className="opPatientName">Laura Zahra Bayokhi</span>
                    <span className="opStatus nursing">Nursing Done</span>
                  </span>
                  <span className="op-sec-3">
                    <span className="opPatientStatus followUp">Follow Up</span>
                  </span>
                </li>
                <li>
                  <span className="op-sec-1">
                    <i className="walking-icon" />
                    <span className="opTime">11:44:00</span>
                  </span>
                  <span className="op-sec-2">
                    <span className="opPatientName">Laura Zahra Bayokhi</span>
                    <span className="opStatus checkedIn">Checked In</span>
                  </span>
                  <span className="op-sec-3">
                    <span className="opPatientStatus followUp">Follow Up</span>
                  </span>
                </li>
                <li>
                  <span className="op-sec-1">
                    <i className="walking-icon" />
                    <span className="opTime">11:44:00</span>
                  </span>
                  <span className="op-sec-2">
                    <span className="opPatientName">Laura Zahra Bayokhi</span>
                    <span className="opStatus checkedIn">Checked In</span>
                  </span>
                  <span className="op-sec-3">
                    <span className="opPatientStatus newVisit">New Visit</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          {/* Left Pane End */}

          {/* Right Pane Start */}
          <div className="col-lg-8 card box-shadow-normal encounters-panel">
            <div className="row">
              <div className="col-lg-3">
                {" "}
                <AlgaehLabel label={{ fieldName: "encounter_list" }} />{" "}
              </div>
              <div className="col-lg-5">
                {" "}
                <AlgaehLabel label={{ fieldName: "total_encounters" }} /> : 5{" "}
              </div>
            </div>
            <div className="row">
              <div> </div>
            </div>
            <AlgaehDataGrid
              className=""
              id="encounter_table"
              columns={[
                {
                  fieldName: "encounter_code",
                  label: <AlgaehLabel label={{ fieldName: "status" }} />,
                  disabled: true
                },
                {
                  fieldName: "patient_code",
                  label: <AlgaehLabel label={{ fieldName: "patient_code" }} />
                },
                {
                  fieldName: "patient_name",
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
                data:
                  this.props.encounterlist === undefined
                    ? []
                    : this.props.encounterlist
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
          {/* Right Pane End */}
        </div>
      </div>
    );
  }
}

export default MyDay;
