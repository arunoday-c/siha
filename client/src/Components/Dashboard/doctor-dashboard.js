import React, { Component } from "react";
import "./dashboard.css";
// import { Bar } from "react-chartjs-2";
import { HorizontalBar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import { getAmountFormart } from "../../utils/GlobalFunctions";

const DoctorExplained = {
  labels: [
    "Fully Agree",
    "Rather Agree",
    "Rather Disagree",
    "Fully Disagree",
    "Don't Know"
  ],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 45],
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const DoctorExplainedDataOptions = {
  responsive: true,
  legend: {
    display: false
  }
};

const TreatingPhysician = {
  labels: [
    "Fully Agree",
    "Rather Agree",
    "Rather Disagree",
    "Fully Disagree",
    "Don't Know"
  ],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 45],
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const TreatingPhysicianDataOptions = {
  responsive: true,
  legend: {
    display: false
  }
};
// const plugins = [
//   {
//     afterDraw: (chartInstance, easing) => {
//       const ctx = chartInstance.chart.ctx;
//       ctx.fillText("This text drawn by a plugin", 100, 100);
//     }
//   }
// ];

const PieData = {
  labels: ["Excellent", "Good", "Neutral/Negative"],
  datasets: [
    {
      data: [24, 40, 35],
      backgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"],
      hoverBackgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"]
    }
  ]
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
      today_list: []
    };
    this.loadListofData();
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block"
    });
  }

  loadListofData() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getMyDay",
      data: {
        fromDate: new Date(),
        toDate: new Date()
      },
      method: "GET",
      cancelRequestId: "getMyDay",
      onSuccess: response => {
        console.log("getMyday");
        if (response.data.success) {
          this.setState({
            today_list: response.data.records
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

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    return (
      <div className="dashboard ">
        <div className="row card-deck">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-calendar-check" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today's Appointments</p>4
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
                    <i className="fas fa-award" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>New Visit</p>4
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
                    <i className="fas fa-walking" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Follow Up</p>0
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
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Total Commission</p>

                    {getAmountFormart("1378.00")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12">
            <div className="row" />
            <div className="row">
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>Overall Patient Satisfacation</h6>
                  <div className="dashboardChartsCntr">
                    <Doughnut
                      data={PieData}
                      //options={AdmissionsReadmissionDataOptions}
                    />
                  </div>
                  <hr />
                  <div className="dashboardChartsCntr">
                    <p>The doctor explained the treatment understandably.</p>
                    <HorizontalBar
                      data={DoctorExplained}
                      options={DoctorExplainedDataOptions}
                    />
                  </div>
                  <hr />

                  <div className="dashboardChartsCntr">
                    <p>I had confidence and trust in the treating physician.</p>
                    <HorizontalBar
                      data={TreatingPhysician}
                      options={TreatingPhysicianDataOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="row">
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>Todays Patients</h6>
                  <div className="dashboardGridCntr table-responsive">
                    <table className="table table-bordered table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Patient Code</th>
                          <th>Patient Name</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Appointment Type</th>
                          <th>Visit Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* today_list */}

                        {this.state.today_list.map((patient_data, index) => (
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>Ordered Service Status</h6>
                  <div className="dashboardGridCntr table-responsive">
                    <table className="table table-bordered table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Patient Code</th>
                          <th>Patient Name</th>
                          <th>Service Ordered</th>
                          <th>Ordered Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>PAT-A-0000693</td>
                          <td>Gulam Mustafa</td>
                          <td>Acetylcholine receptor antibody</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>PAT-A-0000691</td>
                          <td>Kamalnath Singh</td>
                          <td>CBC</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>PAT-A-0000682</td>
                          <td>Rehmat Fatima</td>
                          <td>Activated Protein C Resistance (APCR)</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>PAT-A-0000654</td>
                          <td>Syed Al-Hameed</td>
                          <td>Acute Hepatitis Panel</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>PAT-A-0000682</td>
                          <td>Rehmat Fatima</td>
                          <td>Acid Fast Bacilli (AFB) Smear</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>PAT-A-0000682</td>
                          <td>Hakeem Usmani</td>
                          <td>17-Ketosteroids</td>
                          <td>19-04-2018</td>
                          <td>Pending</td>
                          <td>-</td>
                        </tr>
                      </tbody>
                    </table>
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
    hospitaldetails: state.hospitaldetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
