import React, { Component } from "react";
import "./PatientHistory.css";
import { AlagehFormGroup, AlgaehModalPopUp } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getPatientHistory } from "../PatientProfileHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patHistory: [],
      social_history: [],
      surgical_history: [],
      medical_history: [],
      openAddModal: false,
      history: ""
    };
    getPatientHistory(this);
  }

  savePatientHistory() {
    let his_array = [];

    this.state.history.length !== 0
      ? his_array.push({
          history_type: this.state.type,
          remarks: this.state.history
        })
      : swalMessage({
          title: "Please Enter History to save",
          type: "warning"
        });

    let send_obj = {
      patient_id: Window.global["current_patient"],
      provider_id: Window.global["provider_id"],
      patient_history: his_array
    };

    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientHistory",
      method: "POST",
      data: send_obj,
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success"
          });

          this.setState({
            openAddModal: false,
            history: ""
          });
          getPatientHistory(this);
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

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    this.accordianHistory();
  }

  accordianHistory() {
    const acc = document.getElementsByClassName("accordion-btn");
    let i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  addHistory(type) {
    this.setState({
      type: type,
      openAddModal: true
    });
  }

  render() {
    let _pat_socialHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.social
        : [];

    let _pat_medicalHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.medical
        : [];

    let _pat_surgicalHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.surgical
        : [];

    let _pat_familyHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.family
        : [];

    let _pat_birthHistory =
      this.props.patient_history !== undefined
        ? this.props.patient_history.birth
        : [];

    return (
      <div
        className="portlet portlet-bordered box-shadow-normal margin-top-15"
        style={{ padding: "0 15px" }}
      >
        <AlgaehModalPopUp
          openPopup={this.state.openAddModal}
          title={"Add History"}
        >
          <div className="col-lg-12">
            <AlagehFormGroup
              div={{}}
              label={{
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "history",
                value: this.state.history,
                others: {
                  multiline: true,
                  rows: "6",
                  placeholder: "Enter History, If any"
                },
                events: {
                  onChange: this.textHandle.bind(this)
                }
              }}
            />
            <div style={{ textAlign: "center" }}>
              <button
                onClick={this.savePatientHistory.bind(this)}
                className="btn btn-primary"
              >
                SAVE
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div id="subjectAccordian" className="row">
          <div className="actions">
            <a
              onClick={this.addHistory.bind(this, "SOH")}
              className="btn btn-primary btn-circle"
            >
              <i className="fas fa-pen" />
            </a>
          </div>
          <div className="accordion-btn">Social History</div>
          <div className="panel">
            <table
              className="table table-sm table-bordered customTable"
              style={{ marginTop: 10 }}
            >
              <thead className="table-primary">
                <tr>
                  <th>History</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {_pat_socialHistory.map((data, index) => (
                  <tr key={index}>
                    <td>{data.remarks}</td>
                    <td>{"Dr. " + data.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions">
            <a
              onClick={this.addHistory.bind(this, "MEH")}
              className="btn btn-primary btn-circle"
            >
              <i className="fas fa-pen" />
            </a>
          </div>
          <div className="accordion-btn">Medical History</div>
          <div className="panel">
            <table
              className="table table-sm table-bordered customTable"
              style={{ marginTop: 10 }}
            >
              <thead className="table-primary">
                <tr>
                  <th>History</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {_pat_medicalHistory.map((data, index) => (
                  <tr key={index}>
                    <td>{data.remarks}</td>
                    <td>{"Dr. " + data.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions">
            <a
              onClick={this.addHistory.bind(this, "SGH")}
              className="btn btn-primary btn-circle"
            >
              <i className="fas fa-pen" />
            </a>
          </div>
          <div className="accordion-btn">Surgical History</div>
          <div className="panel">
            <table
              className="table table-sm table-bordered customTable"
              style={{ marginTop: 10 }}
            >
              <thead className="table-primary">
                <tr>
                  <th>History</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {_pat_surgicalHistory.map((data, index) => (
                  <tr key={index}>
                    <td>{data.remarks}</td>
                    <td>{"Dr " + data.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <a
              onClick={this.addHistory.bind(this, "FMH")}
              className="btn btn-primary btn-circle"
            >
              <i className="fas fa-pen" />
            </a>
          </div>
          <div className="accordion-btn">Family History</div>
          <div className="panel">
            <table
              className="table table-sm table-bordered customTable"
              style={{ marginTop: 10 }}
            >
              <thead className="table-primary">
                <tr>
                  <th>History</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {_pat_familyHistory.map((data, index) => (
                  <tr key={index}>
                    <td>{data.remarks}</td>
                    <td>{"Dr. " + data.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="actions">
            <a
              onClick={this.addHistory.bind(this, "BRH")}
              className="btn btn-primary btn-circle"
            >
              <i className="fas fa-pen" />
            </a>
          </div>
          <div className="accordion-btn">Birth History</div>

          <div className="panel">
            <table
              className="table table-sm table-bordered customTable"
              style={{ marginTop: 10 }}
            >
              <thead className="table-primary">
                <tr>
                  <th>History</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                {_pat_birthHistory.map((data, index) => (
                  <tr key={index}>
                    <td>{data.remarks}</td>
                    <td>{"Dr. " + data.provider_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_history: state.patient_history
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientHistory)
);
