import React, { Component } from "react";
import "./myday.css";
import Paper from "@material-ui/core/Paper";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { AlgaehDataGrid } from "../../Wrapper/algaehWrapper";

class MyDay extends Component {
  render() {
    return (
      <div className="myday">
        <div className="row top-bar">
          <div className="my-calendar">
            <div className="row">
              <div className="col month">
                <ul style={{ listStyle: "none" }}>
                  <li className="prev">&#10094;</li>
                  <li className="next">&#10095;</li>
                  <li>
                    July <br />
                    <span style={{ fontSize: "9px" }}>2018</span> <br />
                  </li>
                </ul>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#ffffff",
                    paddingTop: "20px"
                  }}
                >
                  22 Patients Today
                </span>
              </div>

              <div className="col">
                <ul className="weekdays">
                  <li>Mo</li>
                  <li>Tu</li>
                  <li>We</li>
                  <li>Th</li>
                  <li>Fr</li>
                  <li>Sa</li>
                  <li>Su</li>
                </ul>

                <ul className="days">
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                  <li>6</li>
                  <li>7</li>
                  <li>8</li>
                  <li>9</li>
                  <li>10</li>
                  <li>11</li>
                  <li>12</li>
                  <li>13</li>
                  <li>14</li>
                  <li>15</li>
                  <li>16</li>
                  <li>17</li>
                  <li>18</li>
                  <li>19</li>
                  <li>20</li>
                  <li>
                    <span className="active">21</span>
                  </li>
                  <li>22</li>
                  <li>23</li>
                  <li>24</li>
                  <li>25</li>
                  <li>26</li>
                  <li>27</li>
                  <li>28</li>
                  <li>29</li>
                  <li>30</li>
                  <li>31</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Layout Starts */}
        <div className="row bottom-layout">
          {/* Appointment Panel Starts */}
          <div className="col-lg-4 appointment-panel">
            <Paper style={{ height: "470px", overflow: "scroll" }}>
              <div
                className="sticky-top"
                style={{ backgroundColor: "#ffffff" }}
              >
                <label className="grey-label"> Scheduled Appointments</label>
                {/* <label className="grey-label-right float-right">
                  {" "}
                  Walk In Appointments
                </label> */}
              </div>

              {/* Timeline Starts */}
              <Timeline>
                <TimelineEvent
                  title="Completed"
                  createdAt="10:00 - 10:15"
                  icon="S"
                >
                  Peter
                </TimelineEvent>
                <TimelineEvent
                  title="Treating Now"
                  createdAt="10:15 - 10:30"
                  icon="T"
                  orientation="left"
                  iconColor="blue"
                >
                  <span> James Marry </span>
                </TimelineEvent>
                <TimelineEvent
                  title="Nursing Done"
                  createdAt="10:30 - 10:45"
                  icon="W"
                  orientation="left"
                  iconColor="#2f2f2f"
                >
                  <span> James Marry </span>
                </TimelineEvent>
                <TimelineEvent
                  title="Waiting"
                  createdAt="10:45 - 11:00"
                  icon="W"
                  orientation="left"
                  iconColor="#2f2f2f"
                >
                  <span> James Marry </span>
                </TimelineEvent>
                <TimelineEvent
                  title="Completed"
                  createdAt="11:00 - 11:15"
                  icon="S"
                >
                  Peter
                </TimelineEvent>
                <TimelineEvent
                  title="Treating Now"
                  createdAt="11:15 - 11:30"
                  icon="T"
                  orientation="left"
                  iconColor="blue"
                >
                  <span> James Marry </span>
                </TimelineEvent>
                <TimelineEvent
                  title="Nursing Done"
                  createdAt="11:45 - 12:00"
                  icon="W"
                  orientation="left"
                  iconColor="#2f2f2f"
                >
                  <span> James Marry </span>
                </TimelineEvent>
                <TimelineEvent
                  title="Waiting"
                  createdAt="12:00 - 12:15"
                  icon="W"
                  orientation="left"
                  iconColor="#2f2f2f"
                >
                  <span> James Marry </span>
                </TimelineEvent>
              </Timeline>
              {/* Timeline Ends */}
            </Paper>
          </div>
          {/* Appointment Panel Ends */}

          <div className="col-lg-8 encounters-panel">
            <Paper style={{ height: "300px" }}>
              <label className="grey-label">Encounters</label>
              {/*  Grid  */}
              <AlgaehDataGrid
                id="speciality_grd"
                columns={[
                  {
                    fieldName: "status",
                    label: "Status",
                    disabled: true
                  },
                  {
                    fieldName: "date",
                    label: "Date"
                  },
                  {
                    fieldName: "first_name",
                    label: "Patient Name"
                  },
                  {
                    fieldName: "patient_id",
                    label: "Patient ID"
                  },
                  {
                    fieldName: "time",
                    label: "Time"
                  },
                  {
                    fieldName: "patient_type",
                    label: "Patient Type"
                  }
                ]}
                keyId="code"
                dataSource={{
                  data:
                    this.props.visatypes === undefined
                      ? []
                      : this.props.visatypes
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 3 }}
                events={
                  {
                    // onDelete: this.deleteVisaType.bind(this),
                    // onEdit: row => {},
                    // onDone: row => {
                    //   alert(JSON.stringify(row));
                    // }
                    // onDone: this.updateVisaTypes.bind(this)
                  }
                }
              />
            </Paper>

            <div className="right-bottom-panel row">
              <div className="col">
                <Paper style={{ height: "150px" }}>
                  <label className="grey-label">Others</label>
                </Paper>
              </div>
              <div className="col">
                <Paper style={{ height: "150px" }}>
                  <label className="grey-label">Scheduled Surgeries</label>
                </Paper>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom layout Ends */}
      </div>
    );
  }
}
