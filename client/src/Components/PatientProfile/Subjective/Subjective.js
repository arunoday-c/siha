import React, { Component } from "react";
import "./subjective.css";
import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

import Vitals from "../Vitals/Vitals";
class Subjective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      significant_signs: null
    };
    this.getPatientEncounterDetails();
  }

  significantSing(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window.global.encounter_id
      },
      onSuccess: response => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            significant_signs: data.significant_signs
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

  componentWillUnmount() {
    if (this.state.significant_signs !== null) {
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientEncounter",
        method: "PUT",
        data: {
          significant_signs: this.state.significant_signs,
          encounter_id: Window.global.encounter_id
        }
      });
    }
  }
  render() {
    return (
      <div className="subjective">
        <div className="row margin-top-15">
          <div className="col-lg-3">
            <Vitals />
          </div>

          <div className="col-lg-9">
            <ChiefComplaints />
            <div className="row">
              <div className="col-lg-6">
                {/* <Allergies /> */}

                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Significant Signs</h3>
                    </div>
                    {/* <div className="actions">
              <a className="btn btn-primary btn-circle active">
              <i className="fas fa-pen" />
              </a>
              </div> */}
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <AlagehFormGroup
                          div={{ className: "col-lg-12 textArea" }}
                          label={{
                            forceLabel: "",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "significant_signs",
                            value: this.state.significant_signs,
                            others: {
                              multiline: true,
                              rows: "6",
                              style: {
                                height: "25vh"
                              }
                            },
                            options: {},
                            events: {
                              onChange: this.significantSing.bind(this)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <ReviewofSystems />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Subjective;

// <AlagehAutoComplete
// div={{ className: "col-lg-10 displayInlineBlock" }}
// label={{
//   forceLabel: "Chief Complaint",
//   fieldName: "sample"
// }}
// selector={{
//   name: "chief_complaint_id",
//   className: "select-fld",
//   value: this.state.chief_complaint_id,
//   dataSource: {
//     textField: "hpi_description",
//     valueField: "hims_d_hpi_header_id",
//     data:
//       this.state.chiefComplainList.length !== 0
//         ? this.state.chiefComplainList
//         : null
//   },
//   onChange: this.dropDownHandle.bind(this),
//   userList: list => {
//     //TODO need to change with appropriate service call --noor
//
//     alert(JSON.stringify(list));
//   }
// }}
// />
