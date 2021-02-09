import React, { Component } from "react";
import "./dashboard.scss";
import { Bar, HorizontalBar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  // AlgaehMessagePop,
} from "algaeh-react-components";

const patientIncomingHistory = {
  datasets: [
    {
      type: "line",
      label: "Patient Count",
      data: [12, 8, 17, 21, 20, 28],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      hoverBackgroundColor: "#71B37C",
      hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-1",
    },
  ],
};

const patientIncomingHistoryOptions = {
  responsive: true,
  legend: {
    position: "bottom",
    labels: {
      boxWidth: 10,
    },
  },
  tooltips: {
    mode: "label",
  },
  elements: {
    line: {
      fill: false,
    },
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        labels: [
          "Day 1",
          " Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
      },
    ],
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    ],
  },
};

const patientIncomingcategory = {
  datasets: [
    {
      type: "bar",
      label: "New Patient",
      data: [12, 8, 17, 21, 20, 28],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      hoverBackgroundColor: "#71B37C",
      hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-1",
    },
    {
      type: "bar",
      label: "Follow Up",
      data: [12, 8, 17, 21, 20, 28],
      fill: false,
      backgroundColor: "#EC932F",
      borderColor: "#EC932F",
      hoverBackgroundColor: "#EC932F",
      hoverBorderColor: "#EC932F",
      yAxisID: "y-axis-1",
    },
  ],
};

const patientIncomingcategoryOptions = {
  responsive: true,
  legend: {
    position: "bottom",
    labels: {
      boxWidth: 10,
    },
  },
  tooltips: {
    mode: "label",
  },
  elements: {
    line: {
      fill: false,
    },
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        display: true,
        gridLines: {
          display: false,
        },
        labels: [
          "Day 1",
          " Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ],
      },
    ],
    yAxes: [
      {
        stacked: true,
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    ],
  },
};

const RevenuebyDepartment = {
  labels: [
    "Surgery",
    "Gynaecology",
    "Dermatology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Cardiology",
  ],
  datasets: [
    {
      data: [95, 80, 73, 64, 56, 50, 48],
      label: "Revenue",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
    },
  ],
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
      sample_collection: [],
    };
    // DashBoardEvents().getSampleCollectionDetails(this);
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block",
    });
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block",
    });
  }

  loadListofData() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: new Date(),
        toDate: new Date(),
      },
      method: "GET",
      cancelRequestId: "getMyDay",
      onSuccess: (response) => {
        console.log("getMyday");
        if (response.data.success) {
          if (Array.isArray(response.data.records)) {
            this.setState({
              today_list: response.data.records,
            });
          } else {
            this.setState({
              today_list: [],
            });
          }
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

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
    });
  }

  render() {
    return (
      <div className="dashboard lab-dash">
        <div className="row card-deck">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Ordered</p>
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Collected</p>
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Confirmed</p>
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Rejected</p>
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Validated</p>
                    0.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="row">
              <div className="col-4">
                <div className="card animated fadeInUp faster">
                  <h6>
                    Order by Test Category{" "}
                    <span className="portletTopAction">
                      <AlgaehDateHandler
                        type={"week"}
                        size={"small"}
                        label={
                          {
                            // forceLabel: "View for Last ",
                          }
                        }
                        textBox={{
                          name: "selectRange",
                          value: this.state.dateRange,
                        }}
                        // maxDate={new date()}
                        events={{
                          onChange: (dateSelected) => {},
                        }}
                      />
                    </span>
                  </h6>

                  <div className="dashboardChartsCntr">
                    <Bar
                      data={patientIncomingHistory}
                      options={patientIncomingHistoryOptions}
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card animated fadeInUp faster">
                  <h6>
                    Send-In vs Send Out
                    <span className="portletTopAction">
                      <AlgaehDateHandler
                        type={"week"}
                        size={"small"}
                        label={
                          {
                            // forceLabel: "View for Last ",
                          }
                        }
                        textBox={{
                          name: "selectRange",
                          value: this.state.dateRange,
                        }}
                        // maxDate={new date()}
                        events={{
                          onChange: (dateSelected) => {
                            // const months = moment(dateSelected[1]).diff(
                            //   dateSelected[0],
                            //   "months"
                            // );
                            // if (months <= 11) {
                            // this.setState(
                            //   { dateRange: dateSelected },
                            //   () => {
                            //     dashEvents.getDocumentExpiryCurrentMonth(this);
                            //   }
                            // );
                          },
                        }}
                        // others={{
                        //   ...format,
                        // }}
                      />
                    </span>
                  </h6>

                  <div className="dashboardChartsCntr">
                    <Bar
                      data={patientIncomingcategory}
                      options={patientIncomingcategoryOptions}
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card animated fadeInUp faster">
                  <h6>Today Top 10 Orders</h6>
                  <div className="dashboardChartsCntr">
                    <HorizontalBar data={RevenuebyDepartment} />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>
                    Today's Order Status{" "}
                    <span className="portletTopAction">
                      <AlgaehDateHandler
                        type={"week"}
                        size={"small"}
                        label={
                          {
                            // forceLabel: "View for Last ",
                          }
                        }
                        textBox={{
                          name: "selectRange",
                          value: this.state.dateRange,
                        }}
                        // maxDate={new date()}
                        events={{
                          onChange: (dateSelected) => {},
                        }}
                      />
                    </span>
                  </h6>
                  <div className="col-12" id="patientIncomingcategoryCntr">
                    <AlgaehDataGrid
                      className="dashboardGrd"
                      columns={[
                        {
                          fieldName: "row_num",
                          label: (
                            <AlgaehLabel label={{ fieldName: "Sl No." }} />
                          ),
                          others: {
                            width: 80,
                          },
                        },
                        {
                          fieldName: "patient_code",
                          label: <AlgaehLabel label={{ fieldName: "Code" }} />,
                          others: {
                            width: 80,
                          },
                        },
                        {
                          fieldName: "patient_code",
                          label: <AlgaehLabel label={{ fieldName: "Name" }} />,
                          // others: {
                          //   minWidth: 150,
                          // },
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel label={{ fieldName: "Gender" }} />
                          ),
                          others: {
                            width: 80,
                          },
                        },
                        {
                          fieldName: "identity_document_name",
                          label: <AlgaehLabel label={{ fieldName: "Age" }} />,
                          others: {
                            width: 80,
                          },
                        },
                        {
                          fieldName: "valid_upto",
                          label: (
                            <AlgaehLabel label={{ fieldName: "Appo. Type" }} />
                          ),
                          others: {
                            width: 110,
                          },
                        },
                        {
                          fieldName: "valid_upto",
                          label: (
                            <AlgaehLabel label={{ fieldName: "Visit Type" }} />
                          ),
                          others: {
                            width: 80,
                          },
                        },
                      ]}
                      // height="40vh"
                      rowUnique="identity_documents_id"
                      data=""
                    />

                    {/*  {this.state.today_list.map((patient_data, index) => (
                          <tr key={index}>
                            <td>{patient_data.patient_code}</td>
                            <td>{patient_data.full_name}</td>
                            <td>{patient_data.gender}</td>
                            <td>{patient_data.age}</td>
                            <td>
                              {patient_data.appointment_patient === "N"
                                ? "Walk In"
                                : "Appoinment"}
                            </td>
                            <td>
                              {patient_data.new_visit_patient === "Y"
                                ? "New Visit"
                                : "Follow Up"}
                            </td>
                          </tr>
                        ))} */}
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

function mapStateToProps(state) {
  return {
    hospitaldetails: state.hospitaldetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
