import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./patient_type.css";
import Button from "@material-ui/core/Button";
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
// import { getCookie } from "../../../utils/algaehApiCall.js";

class PatientType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_patient_type_id: "",
      patient_type_code: "",
      patitent_type_desc: "",
      arabic_patitent_type_desc: "",
      row: [],

      patient_type_code_error: false,
      patient_type_code_error_txt: "",

      patient_type_error: false,
      patient_type_error_txt: "",

      patient_type_arabic_error: false,
      patient_type_arabic_error_txt: "",

      gridrefresh: true
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    if (
      this.props.patienttypes === undefined ||
      this.props.patienttypes.length === 0
    ) {
      this.props.getPatienttypes({
        uri: "/patientType/getPatientType",
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
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = { hims_d_identity_document_id: id };
        algaehApiCall({
          uri: "/patientType/delete",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.props.getPatienttypes({
                uri: "/patientType/get",
                method: "GET",
                redux: {
                  type: "PAT_TYP_GET_DATA",
                  mappingName: "patienttypes"
                }
              });
            }
          },
          onFailure: error => {}
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "success"
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
    if (this.state.patient_type_code.length == 0) {
      this.setState({
        patient_type_code_error: true,
        patient_type_code_error_txt: "Code cannot be empty"
      });
    } else if (this.state.patitent_type_desc.length == 0) {
      this.setState({
        patient_type_error: true,
        patient_type_error_txt: "Name cannot be empty"
      });
    } else if (this.state.patitent_type_desc.length == 0) {
      this.setState({
        patient_type_arabic_error: true,
        patient_type_arabic_error_txt: "Arabic Name cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/patientType/add",
        data: this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              title: "Patient Type added successfully",
              type: "success"
            });

            this.resetState();
          } else {
            //Handle unsuccessful Add here.
          }
        },
        onFailure: error => {
          // Handle network error here.
        }
      });
    }
  }

  updatePatientType(data) {
    algaehApiCall({
      uri: "/patientType/update",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          data.onDoneFinish();
        }
      },
      onFailure: error => {}
    });
  }

  resetState() {
    this.setState(this.baseState);
  }
  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.onChangeFinish(row);
  }

  render() {
    return (
      <div className="patient_type">
        <Paper className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                padding: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
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
                  },
                  error: this.state.patient_type_code_error,
                  helperText: this.state.patient_type_code_error_txt
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
                  },
                  error: this.state.patient_type_error,
                  helperText: this.state.patient_type_error_txt
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
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
                  },
                  error: this.state.patient_type_arabic_error,
                  helperText: this.state.patient_type_arabic_error_txt
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addPatientType.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  ADD TO LIST
                </Button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
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
                            ? display[0].user_displayname
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "created_date",
                    label: "Added Date",
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    disabled: true
                  },
                  {
                    fieldName: "identity_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.identity_status === "A"
                        ? "Active"
                        : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "identity_status",
                            className: "select-fld",
                            value: row.identity_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: this.onchangegridcol.bind(this, row)
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
        </Paper>
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
