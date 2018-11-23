import React, { Component } from "react";
import "./PatientHistory.css";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patHistory: []
    };
    this.getPatientHistory();
  }

  componentWillUnmount() {
    this.state.social_history.length === 0 &&
    this.state.surgical_history.length === 0 &&
    this.state.social_history.length === 0
      ? null
      : this.savePatientHistory();
  }

  savePatientHistory() {
    let his_array = [];

    this.state.social_history.length !== 0
      ? his_array.push({
          history_type: "SOH",
          remarks: this.state.social_history
        })
      : this.state.surgical_history.length !== 0
      ? his_array.push({
          history_type: "SGH",
          remarks: this.state.surgical_history
        })
      : this.state.medical_history.length !== 0
      ? his_array.push({
          history_type: "MEH",
          remarks: this.state.medical_history
        })
      : null;

    let send_obj = {
      patient_id: Window.global["current_patient"],
      provider_id: Window.global["provider_id"],
      patient_history: his_array
    };

    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientHistory",
      method: "POST",
      data: send_obj,
      onSuccess: response => {},
      onFailure: error => {}
    });
  }

  getPatientHistory() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientHistory",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"]
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState(
            {
              patHistory: response.data.records
            },
            () => {
              let soh = Enumerable.from(response.data.records)
                .where(w => w.history_type === "SOH")
                .firstOrDefault();
              let meh = Enumerable.from(response.data.records)
                .where(w => w.history_type === "MEH")
                .firstOrDefault();
              let sgh = Enumerable.from(response.data.records)
                .where(w => w.history_type === "SGH")
                .firstOrDefault();

              this.setState({
                social_history: soh !== undefined ? soh.remarks : "",
                medical_history: meh !== undefined ? meh.remarks : "",
                surgical_history: sgh !== undefined ? sgh.remarks : ""
              });
            }
          );
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

  render() {
    return (
      <React.Fragment>
        <div
          className="portlet portlet-bordered box-shadow-normal margin-top-15"
          style={{ padding: "0 15px" }}
        >
          <div id="subjectAccordian" className="row">
            <button className="accordion-btn">Social History</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "social_history",
                  value: this.state.social_history,
                  others: {
                    multiline: true,
                    rows: "6",
                    placeholder: "Enter Social History, If any"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>

            <button className="accordion-btn">Medical History</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "medical_history",
                  value: this.state.medical_history,
                  others: {
                    multiline: true,
                    rows: "6",
                    placeholder: "Enter Medical History, If any"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>

            <button className="accordion-btn">Surgical History</button>
            <div className="panel">
              <AlagehFormGroup
                div={{ className: "" }}
                label={{
                  forceLabel: "",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "surgical_history",
                  value: this.state.surgical_history,
                  others: {
                    multiline: true,
                    rows: "6",
                    placeholder: "Enter Surgical History, If any"
                  },
                  events: {
                    onChange: this.textHandle.bind(this)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PatientHistory;
