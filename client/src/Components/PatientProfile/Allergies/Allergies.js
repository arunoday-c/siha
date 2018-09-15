import React, { Component } from "react";
import "./allergies.css";
import Modal from "@material-ui/core/Modal";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import moment from "moment";
import {
  texthandle,
  datehandle,
  updatePatientAllergy,
  getAllAllergies
} from "./AllergiesHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import algaehLoader from "../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import { setGlobal } from "../../../utils/GlobalFunctions.js";

class Allergies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAllergyModal: false,
      allergy_value: "F",
      allAllergies: [],
      patientAllergies: []
    };
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    getAllAllergies(this, this.state.allergy_value);
    this.getPatientAllergies();
  }

  handleClose() {
    this.setState({
      openAllergyModal: false
    });
  }
  resetAllergies() {
    this.setState({
      hims_d_allergy_id: "",
      allergy_comment: "",
      allergy_inactive: "",
      allergy_onset: "",
      allergy_severity: "",
      allergy_onset_date: ""
    });
  }

  addAllergyToPatient(e) {
    e.preventDefault();
    if (this.state.hims_d_allergy_id === "") {
      this.setState({
        allergyNameError: true,
        allergyNameErrorText: "Required"
      });
    }
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientNewAllergy",
      method: "POST",
      data: {
        patient_id: Window.global["current_patient"],
        allergy_id: this.state.hims_d_allergy_id,
        onset: this.state.allergy_onset,
        onset_date: this.state.allergy_onset_date,
        severity: this.state.allergy_severity,
        comment: this.state.allergy_comment,
        allergy_inactive: this.state.allergy_inactive
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getPatientAllergies();
          this.resetAllergies();
          swal("Allergy added successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });

          //this.setState({ patientChiefComplains: response.data.records });
          //console.log("Add Allergy Success:", response.data.records);
        }
      },
      onFailure: error => {}
    });
  }

  addAllergies() {
    this.setState({
      openAllergyModal: true
    });
  }

  getPatientAllergies() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientAllergy",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"]
      },
      onSuccess: response => {
        debugger;
        if (response.data.success) {
          this.setState({ allAllergies: response.data.records });

          let _allergies = Enumerable.from(response.data.records)
            .groupBy("$.allergy_type", null, (k, g) => {
              return {
                allergy_type: k,
                allergy_type_desc:
                  k === "F"
                    ? "Food"
                    : k === "A"
                      ? "Airborne"
                      : k === "AI"
                        ? "Animal  &  Insect"
                        : k === "C"
                          ? "Chemical & Others"
                          : "",
                allergyList: g.getSource()
              };
            })
            .toArray();
          setGlobal({ patientAllergies: _allergies });
          this.setState({ patientAllergies: _allergies }, () => {
            algaehLoader({ show: false });
            document.getElementById("btn-outer-component-load").click();
          });
        }
      },
      onFailure: error => {}
    });
  }

  deleteAllergy(row) {
    // console.log("delete Allergy row:", row);

    swal({
      title: "Are you sure you want to delete this Allergy?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = {
          allergy_inactive: row.allergy_inactive,
          comment: row.comment,
          onset: row.onset,
          severity: row.severity,
          onset_date: row.onset_date,
          record_status: "I",
          hims_f_patient_allergy_id: row.hims_f_patient_allergy_id
        };
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientAllergy",
          data: data,
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.getPatientAllergies();
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  allergyDropdownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      getAllAllergies(this, this.state.allergy_value);
    });
  }
  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }
  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  reloadState() {
    this.setState({ ...this.state });
  }

  changeOnsetEdit(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.reloadState();
  }

  render() {
    return (
      <React.Fragment>
        {/* Allergy Modal Start*/}
        <Modal open={this.state.openAllergyModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Allergy</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Allergy Type",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "allergy_value",
                          className: "select-fld",
                          value: this.state.allergy_value,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ALLERGY_TYPES
                          },
                          onChange: this.allergyDropdownHandler.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Select a Alergy",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_d_allergy_id",
                          className: "select-fld",
                          value: this.state.hims_d_allergy_id,
                          dataSource: {
                            textField: "allergy_name",
                            valueField: "hims_d_allergy_id",
                            data: this.props.allallergies
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Onset"
                        }}
                        selector={{
                          name: "allergy_onset",
                          className: "select-fld",
                          value: this.state.allergy_onset,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.ALLERGY_ONSET
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      {this.state.allergy_onset === "O" ? (
                        <AlgaehDateHandler
                          div={{ className: "col-lg-12 margin-top-15" }}
                          label={{
                            forceLabel: "Onset Date"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "allergy_onset_date"
                          }}
                          maxDate={new Date()}
                          events={{
                            onChange: selectedDate => {
                              this.setState({
                                allergy_onset_date: selectedDate
                              });
                            }
                          }}
                          value={this.state.allergy_onset_date}
                        />
                      ) : null}

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Severity",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "allergy_severity",
                          className: "select-fld",
                          value: this.state.allergy_severity,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_SEVERITY
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "allergy_comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.allergy_comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Allergies</h6>
                    <hr />
                    <AlgaehDataGrid
                      id="patient-allergy-grid"
                      columns={[
                        {
                          fieldName: "allergy_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Allergy Type" }}
                            />
                          ),
                          disabled: true,
                          displayTemplate: data => {
                            return (
                              <span>
                                {data.allergy_type === "F" ? (
                                  <span> Food</span>
                                ) : data.allergy_type === "A" ? (
                                  <span>Airborne </span>
                                ) : data.allergy_type === "AI" ? (
                                  <span>Animal and Insect </span>
                                ) : data.allergy_type === "C" ? (
                                  <span>Chemical and Others </span>
                                ) : data.allergy_type === "N" ? (
                                  <span>NKA </span>
                                ) : data.allergy_type === "D" ? (
                                  <span>Drug </span>
                                ) : null}
                              </span>
                            );
                          },
                          editorTemplate: data => {
                            return (
                              <span>
                                {data.allergy_type === "F" ? (
                                  <span> Food</span>
                                ) : data.allergy_type === "A" ? (
                                  <span>Airborne </span>
                                ) : data.allergy_type === "AI" ? (
                                  <span>Animal and Insect </span>
                                ) : data.allergy_type === "C" ? (
                                  <span>Chemical and Others </span>
                                ) : data.allergy_type === "N" ? (
                                  <span>NKA </span>
                                ) : data.allergy_type === "D" ? (
                                  <span>Drug </span>
                                ) : null}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "allergy_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Allergy Name" }}
                            />
                          ),
                          disabled: true,
                          editorTemplate: data => {
                            return <span>{data.allergy_name}</span>;
                          }
                        },
                        {
                          fieldName: "onset",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Onset" }} />
                          ),
                          displayTemplate: data => {
                            return data.onset === "A" ? (
                              <span>Adulthood</span>
                            ) : data.onset === "T" ? (
                              <span>Teenage</span>
                            ) : data.onset === "P" ? (
                              <span>Pre Terms</span>
                            ) : data.onset === "C" ? (
                              <span>Childhood</span>
                            ) : data.onset === "O" ? (
                              <span>Onset Date</span>
                            ) : (
                              ""
                            );
                          },
                          editorTemplate: data => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "onset",
                                  className: "select-fld",
                                  value: data.onset,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.ALLERGY_ONSET
                                  },
                                  onChange: this.changeOnsetEdit.bind(
                                    this,
                                    data
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "onset_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Onset Date" }} />
                          ),
                          displayTemplate: data => {
                            return (
                              <span>
                                {data.onset_date !== null
                                  ? moment(data.onset_date).format("DD-MM-YYYY")
                                  : ""}
                              </span>
                            );
                          },
                          editorTemplate: data => {
                            return (
                              <AlgaehDateHandler
                                div={{}}
                                textBox={{
                                  className: "txt-fld hidden",
                                  name: "onset_date"
                                }}
                                minDate={new Date()}
                                events={{
                                  onChange: datehandle.bind(this, this, data)
                                }}
                                value={data.onset_date}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "severity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Severity" }} />
                          ),
                          displayTemplate: data => {
                            return data.severity === "MI" ? (
                              <span>Mild</span>
                            ) : data.severity === "MO" ? (
                              <span>Moderate</span>
                            ) : data.severity === "SE" ? (
                              <span>Severe</span>
                            ) : (
                              ""
                            );
                          },
                          editorTemplate: data => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "severity",
                                  className: "select-fld",
                                  value: data.severity,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.PAIN_SEVERITY
                                  },
                                  onChange: texthandle.bind(this, this, data)
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "comment",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Comment" }} />
                          ),
                          editorTemplate: data => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  className: "txt-fld",
                                  name: "comment",
                                  value: data.comment,
                                  events: {
                                    onChange: texthandle.bind(this, this, data)
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_f_patient_allergy_id"
                      dataSource={{
                        data: this.state.allAllergies
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deleteAllergy.bind(this),
                        onEdit: row => {},
                        onDone: updatePatientAllergy.bind(this, this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button
                  onClick={this.addAllergyToPatient.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Add to Alergy List
                </button>
                <button
                  onClick={this.resetAllergies.bind(this)}
                  type="button"
                  className="btn btn-other"
                >
                  Clear
                </button>
              </div>
              <div className="col-lg-8">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Allergy Modal End*/}

        {/* BEGIN Portlet PORTLET */}
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Allergies</h3>
            </div>
            <div className="actions">
              <a
                href="javascript:;"
                className="btn btn-primary btn-circle active"
                onClick={this.addAllergies}
              >
                <i className="fas fa-edit" />
              </a>
            </div>
          </div>
          <div
            className="portlet-body"
            style={{ maxHeight: "25vh", overflow: "auto" }}
          >
            {this.state.patientAllergies.map((tables, index) => (
              <table
                key={index}
                className="table table-sm table-bordered customTable"
              >
                <thead className="table-primary">
                  <tr>
                    <th> {tables.allergy_type_desc} </th>
                    <th>Onset Date</th>
                    <th>Comment</th>
                    <th>Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.allergyList.map((rows, rIndex) => (
                    <tr key={rIndex}>
                      <td> {rows.allergy_name} </td>
                      <td>{rows.onset_date}</td>
                      <td>{rows.comment}</td>
                      <td>{rows.allergy_inactive === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div>
        {/* END Portlet PORTLET */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allallergies: state.allallergies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllAllergies: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Allergies)
);
