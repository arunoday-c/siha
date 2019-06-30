import React, { Component } from "react";
import "./patient_type.css";

import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall.js";

class PatientType extends Component {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      hims_d_patient_type_id: "",
      patient_type_code: "",
      patitent_type_desc: "",
      arabic_patitent_type_desc: "",
      row: [],
      gridrefresh: true
    };
    this.baseState = this.state;
  }

      initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "patient_type_code",
        tableName: "hims_d_patient_type",
        keyFieldName: "hims_d_patient_type_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
         patient_type_code_placeHolder: placeHolder.patient_type_code
          });
        }
      }
    });
  }

  componentDidMount() {
    if (
      this.props.patienttypes === undefined ||
      this.props.patienttypes.length === 0
    ) {
      this.props.getPatienttypes({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "PAT_TYP_GET_DATA",
          mappingName: "patienttypes"
        }
      });
    }
  }
  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this ID Types?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        let data = { hims_d_patient_type_id: id };
        algaehApiCall({
          uri: "/patientType/delete",
          module: "masterSettings",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.props.getPatienttypes({
                uri: "/patientType/getPatientType",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "PAT_TYP_GET_DATA",
                  mappingName: "patienttypes"
                }
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  deletePatientType(row) {
    this.showconfirmDialog(row.hims_d_patient_type_id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.patienttypes !== nextProps.patienttypes) {
      return true;
    }
    return true;
  }

  addPatientType(e) {
    e.preventDefault();

    AlgaehValidation({
      alerTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/patientType/add",
          module: "masterSettings",
          data: this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              this.props.getPatienttypes({
                uri: "/patientType/getPatientType",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "PAT_TYP_GET_DATA",
                  mappingName: "patienttypes"
                }
              });
              this.resetState();
              swalMessage({
                title: "Patient Type added successfully",
                type: "success"
              });
            } else {
              //Handle unsuccessful Add here.
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  updatePatientType(data) {
    algaehApiCall({
      uri: "/patientType/update",
      module: "masterSettings",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          // data.onDoneFinish();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  resetState() {
    this.setState(this.baseState);
  }
  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
    //this.resetState();
  }

  render() {
    return (
      <div className="patient_type">
        <div className="container-fluid">
          <form>
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "type_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_type_code",
                  value: this.state.patient_type_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },   others: {
                          tabIndex: "1",
                            placeholder: this.state.patient_type_code_placeHolder
                        }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patitent_type_desc",
                  value: this.state.patitent_type_desc,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-3 arabic-txt-fld" }}
                label={{
                  fieldName: "arabic_type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "arabic_patitent_type_desc",
                  value: this.state.arabic_patitent_type_desc,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
                <button
                  onClick={this.addPatientType.bind(this)}
                  className="btn btn-primary"
                >
                  Add to list
                </button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col" data-validate="patTypeDiv">
              <AlgaehDataGrid
                datavalidate="data-validate='patTypeDiv'"
                id="patient_type_grd"
                columns={[
                  {
                    fieldName: "patient_type_code",
                    label: <AlgaehLabel label={{ fieldName: "type_code" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "patitent_type_desc",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.patitent_type_desc,
                            className: "txt-fld",
                            name: "patitent_type_desc",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            },
                            others: {
                              errormessage: "Description - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "arabic_patitent_type_desc",
                    label: (
                      <AlgaehLabel label={{ fieldName: "arabic_type_desc" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.arabic_patitent_type_desc,
                            className: "txt-fld",
                            name: "arabic_patitent_type_desc",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            },
                            others: {
                              errormessage: "Arabic Name - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.userdrtails === undefined
                          ? []
                          : this.props.userdrtails.filter(
                              f => f.algaeh_d_app_user_id === row.created_by
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].username
                            : ""}
                        </span>
                      );
                    },
                    editorTemplate: row => {
                      let display =
                        this.props.userdrtails === undefined
                          ? []
                          : this.props.userdrtails.filter(
                              f => f.algaeh_d_app_user_id === row.created_by
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].username
                            : ""}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "created_date",

                    label: <AlgaehLabel label={{ forceLabel: "Added Date" }} />,
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    editorTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                  },
                  {
                    fieldName: "patient_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.patient_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "patient_status",
                            className: "select-fld",
                            value: row.patient_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: this.onchangegridcol.bind(this, row),
                            others: {
                              errormessage: "Status - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="patient_type_code"
                dataSource={{
                  data:
                    this.props.patienttypes === undefined
                      ? []
                      : this.props.patienttypes
                }}
                filter={true}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: this.deletePatientType.bind(this),
                  onEdit: row => {},
                  onDone: this.updatePatientType.bind(this)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patienttypes: state.patienttypes,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatienttypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientType)
);
