import React, { Component } from "react";
import "./encounters.scss";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

import OPEncounterDetails from "./OpEncounterDetails";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";
class Encounters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientEncounters: [],

      episode_id: null,
      encounter_id: null,
      visit_id: null,
    };
  }

  setEncounterDetails(row, e) {
    const general_info = Enumerable.from(this.state.patientEncounters)
      .where((w) => w.encounter_id === parseInt(row.encounter_id, 10))
      .firstOrDefault();

    this.setState({
      generalInfo: general_info,
      episode_id: e.currentTarget.getAttribute("epi-id"),
      visit_id: e.currentTarget.getAttribute("visit-id"),
      encounter_id: row.encounter_id,
    });
  }

  componentDidMount() {
    this.getPatientEncounterDetails();
  }

  getPatientEncounterDetails() {
    algaehLoader({ show: true });

    algaehApiCall({
      uri: "/mrd/getPatientEncounterDetails",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"],
      },
      module: "MRD",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientEncounters: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  render() {
    return (
      <div className="encounters">
        <div className="row">
          <div className="col-5">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter List</h3>
                </div>
              </div>
              <div className="portlet-body encounterListCntr">
                <AlgaehDataGrid
                  id="index"
                  columns={[
                    {
                      fieldName: "encountered_date",

                      label: (
                        <AlgaehLabel label={{ forceLabel: "Date & Time" }} />
                      ),
                      className: (drow) => {
                        return "greenCell";
                      },
                      displayTemplate: (row) => {
                        return (
                          <span
                            enc-id={row.hims_f_patient_encounter_id}
                            epi-id={row.episode_id}
                            visit-id={row.visit_id}
                            onClick={this.setEncounterDetails.bind(this, row)}
                            className="pat-code2"
                          >
                            {moment(row.encountered_date).format(
                              "DD-MM-YYYY HH:mm A"
                            )}
                          </span>
                        );
                      },
                      others: {
                        // maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "visit_code",

                      label: (
                        <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                      ),
                      others: {
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "provider_name",

                      label: <AlgaehLabel label={{ forceLabel: "Doctor" }} />,
                      others: {
                        style: { textAlign: "left" },
                      },
                    },
                  ]}
                  // rowClassName={row => {
                  //   return "cursor-pointer";
                  // }}
                  keyId="index"
                  data={this.state.patientEncounters}
                  pagination={true}
                />
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="row">
              <OPEncounterDetails
                episode_id={this.state.episode_id}
                encounter_id={this.state.encounter_id}
                visit_id={this.state.visit_id}
                patient_id={Window.global["mrd_patient"]}
                generalInfo={this.state.generalInfo}
                key={Window.global["mrd_patient"]}
              />
            </div>
          </div>
        </div>
      </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}

export default Encounters;
