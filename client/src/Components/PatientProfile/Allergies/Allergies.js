import React, { Component } from "react";
import "./allergies.css";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import moment from "moment";
import {
  texthandle,
  datehandle,
  getAllAllergies,
  getPatientAllergies
} from "./AllergiesHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import Options from "../../../Options.json";

class Allergies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAllergyModal: false,
      allergy_value: "F",
      allAllergies: [],
      patientAllergies: [],
      allSpecificAllergies: [],
      allPatientAllergies: []
    };
    this.addAllergies = this.addAllergies.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.baseState = this.state;
  }

  componentDidMount() {
    // if (
    //   this.props.patient_allergies === undefined ||
    //   this.props.patient_allergies.length === 0
    // )
    getPatientAllergies(this);
    // else {
    getAllAllergies(this, data => {
      this.setState({
        allSpecificAllergies: this.getPerticularAllergyList(data)
      });
    });
    let _allergies = Enumerable.from(this.props.patient_allergies)
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

    this.setState({
      patientAllergies: _allergies,
      allPatientAllergies: this.props.patient_allergies
    });
    // }
  }

  handleClose(e) {
    this.props.onClose && this.props.onClose(e);
  }

  resetAllergies() {
    this.setState({
      hims_d_allergy_id: "",
      allergy_comment: "",
      allergy_inactive: "N",
      allergy_onset: "",
      allergy_severity: "",
      allergy_onset_date: null
      //...this.baseState
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
          getPatientAllergies(this);
          this.resetAllergies();
          swalMessage({
            title: "Allergy added successfully . .",
            type: "success"
          });
        }
      }
    });
  }

  addAllergies() {
    if (
      this.props.allallergies === undefined ||
      this.props.allallergies.length === 0
    ) {
      getAllAllergies(this, data => {
        this.setState({
          openAllergyModal: true,
          allSpecificAllergies: this.getPerticularAllergyList(data)
        });
      });
    } else {
      this.setState({
        openAllergyModal: true,
        allSpecificAllergies: this.getPerticularAllergyList(
          this.props.allallergies
        )
      });
    }
  }
  getPerticularAllergyList(allergies, allergy_type) {
    allergy_type = allergy_type || this.state.allergy_value;
    return Enumerable.from(allergies)
      .where(w => w.allergy_type === allergy_type)
      .toArray();
  }

  updatePatientAllergy(data) {
    data.record_status = "A";

    algaehApiCall({
      uri: "/doctorsWorkbench/updatePatientAllergy",
      method: "PUT",
      data: data,
      onSuccess: response => {
        if (response.data.success) {
          getPatientAllergies(this);
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });
        }
      }
    });
  }

  deleteAllergy(row) {
    swal({
      title: "Delete Allergy " + row.allergy_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
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
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
              getPatientAllergies(this);
            }
          },
          onFailure: error => {}
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  allergyDropdownHandler(value) {
    let _filter_allergies = {};
    if (value.name === "allergy_value") {
      _filter_allergies = {
        allSpecificAllergies: this.getPerticularAllergyList(
          this.props.allallergies,
          value.value
        )
      };
    }
    this.setState({ [value.name]: value.value, ..._filter_allergies });
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

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* Allergy Modal Start*/}
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openAllergyModal}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 popLeftDiv">
                  <div className="row">
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
                        onChange: this.allergyDropdownHandler.bind(this),
                        autoComplete: "off"
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
                          data: this.state.allSpecificAllergies
                        },
                        onChange: this.dropDownHandle.bind(this),
                        autoComplete: "off"
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
                        onChange: this.dropDownHandle.bind(this),
                        autoComplete: "off"
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
                          onChange: datehandle.bind(this, this)
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
                        onChange: this.dropDownHandle.bind(this),
                        autoComplete: "off"
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
                  <div id="patient-allergy-grod-cntr">
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
                          },
                          others: { minWidth: 150 }
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
                          },
                          others: { minWidth: 150 }
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
                                  others: {
                                    disabled: true
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
                                {this.changeDateFormat(data.onset_date)}
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
                                // disabled={data.onset === "O" ? false : true}
                                disabled={true}
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
                          },
                          others: { minWidth: 400 }
                        }
                      ]}
                      keyId="hims_f_patient_allergy_id"
                      dataSource={{
                        data: this.state.allPatientAllergies
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deleteAllergy.bind(this),
                        onEdit: row => {},
                        onDone: this.updatePatientAllergy.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
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
                    className="btn btn-default"
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
          </div>
        </AlgaehModalPopUp>

        {/* Allergy Modal End*/}

        {/* BEGIN Portlet PORTLET */}
        {/* <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Allergies</h3>
            </div>
            <div className="actions">
              <a
                className="btn btn-primary btn-circle active"
                onClick={this.addAllergies}
              >
                <i className="fas fa-plus" />
              </a>
            </div>
          </div>
          <div
            className="portlet-body"
            style={{ height: "25.3vh", overflow: "auto" }}
          >
            {this.state.patientAllergies.map((tables, index) => (
              <table
                key={index}
                className="table table-sm table-bordered customTable"
              >
                <thead className="table-primary">
                  <tr>
                    <th> {tables.allergy_type_desc} </th>
                    <th>Onset</th>
                    <th>Comment</th>
                    <th>Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.allergyList.map((rows, rIndex) => (
                    <tr key={rIndex}>
                      <td> {rows.allergy_name} </td>
                      <td>{this.decissionAllergyOnset(rows)}</td>
                      <td>{rows.comment}</td>
                      <td>{rows.allergy_inactive === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div> */}
        {/* END Portlet PORTLET */}
      </React.Fragment>
    );
  }
  decissionAllergyOnset(row) {
    const _onSet = Enumerable.from(GlobalVariables.ALLERGY_ONSET)
      .where(w => w.value === row.onset)
      .firstOrDefault();
    if (_onSet) {
      return _onSet.name;
    } else return "";
  }
}

function mapStateToProps(state) {
  return {
    allallergies: state.allallergies,
    patient_allergies: state.patient_allergies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllAllergies: AlgaehActions,
      getPatientAllergies: AlgaehActions
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
