import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./visit_type.css";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { getVisittypes } from "../../../actions/CommonSetup/VisitTypeactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehOptions,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import swal from "sweetalert";
import { AlgaehActions } from "../../../actions/algaehActions";

const VISIT_TYPE = [
  { name: "CONSULTATION", value: "CONSULTATION", key: "cn" },
  { name: "NON CONSULTATION", value: "NON CONSULTATION", key: "ncn" }
];

class VisitType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      visit_status: "A",
      visit_type_code: "",
      visit_type_code_error: false,
      visit_type_code_error_txt: "",
      visit_type: "",
      visit_type_error: false,
      visit_type_error_txt: "",
      hims_d_visit_type: "",
      hims_d_visit_type_error: false,
      hims_d_visit_type_error_txt: "",
      created_by: "1",
      buttonText: "ADD TO LIST",
      hims_d_visit_type_id: "",
      deleteId: ""
    };

    this.baseState = this.state;
  }

  onCommitChanges({ added, changed, deleted }) {
    if (added) {
    }
    if (changed) {
    }
    if (deleted) {
    }
  }

  changeStatus(row, status) {
    this.setState({ visit_status: status.value });
    //console.log("Status:", this.state.visit_status);
    if (status.value == "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (status.value == "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
    row.visit_status = status.value;
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Visit Type?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = { hims_d_visit_type_id: id };
        algaehApiCall({
          uri: "/visitType/delete",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.props.getVisittypes({
                uri: "/visitType/get",
                method: "GET",
                redux: {
                  type: "VISITTYPE_GET_DATA",
                  mappingName: "visittypes"
                }
              });
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  deleteVisitType(row) {
    //console.log("Delete Row ID: ", row.hims_d_visit_type_id);
    this.showconfirmDialog(row.hims_d_visit_type_id);
  }

  handleConfirmDelete() {
    const data = { hims_d_visit_type_id: this.state.deleteId };

    algaehApiCall({
      uri: "/visitType/delete",
      data: data,
      method: "DELETE",
      onSuccess: response => {
        this.setState({ open: false });
        window.location.reload();
      },
      onFailure: error => {
        this.setState({ open: false });
      }
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete(e) {
    const visit_id = JSON.parse(e.currentTarget.getAttribute("sltd_id"));
    this.setState({ open: true, deleteId: visit_id });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  selectedVisitType(visitType) {
    this.setState({ hims_d_visit_type: visitType });
  }

  componentDidMount() {
    this.props.getVisittypes({
      uri: "/visitType/get",
      method: "GET",
      redux: {
        type: "VISITTYPE_GET_DATA",
        mappingName: "visittypes"
      }
    });
  }

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  resetState() {
    this.setState(this.baseState);
  }

  addVisit(e) {
    e.preventDefault();
    if (this.state.visit_type_code.length == 0) {
      this.setState({
        visit_type_code_error: true,
        visit_type_code_error_txt: "Visit Code Cannot be Empty"
      });
    } else if (this.state.visit_type.length == 0) {
      this.setState({
        visit_type_error: true,
        visit_type_error_txt: "Visit Name Cannot be Empty"
      });
    } else {
      this.setState({
        visit_type_code_error: false,
        visit_type_code_error_txt: "",
        visit_type_error: false,
        visit_type_error_txt: ""
      });

      let uri = "";
      if (
        this.state.buttonText == "ADD TO LIST" &&
        this.state.hims_d_visit_type_id.length == 0
      ) {
        uri = "/visitType/add";
      } else if (
        this.state.buttonText == "UPDATE" &&
        this.state.hims_d_visit_type_id.length != 0
      ) {
        uri = "/visitType/update";
      }

      algaehApiCall({
        uri: uri,
        data: this.state,
        onSuccess: response => {
          window.location.reload();
          if (response.data.success == true) {
            //Handle Successful Add here
            this.props.getVisittypes({
              uri: "/visitType/get",
              method: "GET",
              redux: {
                type: "VISITTYPE_GET_DATA",
                mappingName: "visittypes"
              }
            });
            this.resetState();

            swal({
              title: "Success",
              text: "Visa Type added successfully",
              icon: "success",
              button: false,
              timer: 2500
            });
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

  editTexts(a, b) {
    debugger;
    // row[e.target.name] = e.target.value;
    // callback(row);
  }

  getFormatedDate(date) {
    return String(moment(date).format("YYYY-MM-DD"));
  }

  editVisitTypes(e) {
    const data = JSON.parse(e.currentTarget.getAttribute("current_edit"));

    this.setState({
      visit_type_code: data.visit_type_code,
      visit_type: data.visit_type,
      hims_d_visit_type: data.hims_d_visit_type,
      buttonText: "UPDATE",
      hims_d_visit_type_id: data.hims_d_visit_type_id
    });
  }

  updateVisitType(data) {
    algaehApiCall({
      uri: "/visitType/update",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swal("Record updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          this.props.getVisittypes({
            uri: "/visitType/get",
            method: "GET",
            redux: {
              type: "VISITTYPE_GET_DATA",
              mappingName: "visittypes"
            }
          });
        }
      },
      onFailure: error => {}
    });
  }

  getFullStatusText({ value }) {
    if (value === "A") {
      return "Active";
    } else if (value === "I") {
      return "Inactive";
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        <div className="visit_type">
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
                <AlgaehOptions
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "status",
                    isImp: true
                  }}
                  optionsType="radio"
                  group={{
                    name: "Status",
                    value: this.state.visit_status,
                    controls: [
                      { label: "Active", value: "A" },
                      { label: "Inactive", value: "I" }
                    ],
                    events: { onChange: this.changeStatus.bind(this) }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT CODE <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_code_error}
                    helperText={this.state.visit_type_code_error_txt}
                    name="visit_type_code"
                    value={this.state.visit_type_code}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "visit_type_code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type_code",
                    value: this.state.visit_type_code,
                    error: this.state.visit_type_code_error,
                    helperText: this.state.visit_type_code_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT NAME <span className="imp">*</span>
                  </label>
                  <br />
                  <TextField
                    error={this.state.visit_type_error}
                    helperText={this.state.visit_type_error_txt}
                    name="visit_type"
                    value={this.state.visit_type}
                    onChange={this.changeTexts.bind(this)}
                    className="txt-fld"
                  />
                </div> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "visit_type",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type",
                    value: this.state.visit_type,
                    error: this.state.visit_type_error,
                    helperText: this.state.visit_type_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                {/* <div className="col-lg-3">
                  <label>
                    VISIT TYPE <span className="imp">*</span>
                  </label>
                  <br />
                  <SelectField
                    displayValue={this.state.hims_d_visit_type}
                    selected={this.selectedVisitType.bind(this)}
                    children={VISIT_TYPE}
                  />
                </div> */}

                <div
                  className="col-lg-3 align-middle"
                  style={{ marginBottom: "2px" }}
                >
                  <br />
                  <Button
                    onClick={this.addVisit.bind(this)}
                    variant="raised"
                    color="primary"
                  >
                    {this.state.buttonText}
                  </Button>
                </div>
              </div>
            </form>

            <div className="row form-details">
              <div className="col">
                <Paper>
                  <AlgaehDataGrid
                    id="visit_grd"
                    columns={[
                      {
                        fieldName: "visit_type_code",
                        label: "Visit Type Code",
                        disabled: true
                      },
                      {
                        fieldName: "visit_type_desc",
                        label: "Visit Type Name"
                      },
                      {
                        fieldName: "created_date",
                        label: "Added Date",
                        displayTemplate: row => {
                          return (
                            <span>{this.dateFormater(row.created_date)}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlgaehDateHandler
                              div={{}}
                              textBox={{ className: "txt-fld" }}
                              events={{
                                onChange: selected => {
                                  row.created_date = selected._d;
                                }
                              }}
                              value={this.getFormatedDate(row.created_date)}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "visit_status",
                        label: "Visit Status",
                        displayTemplate: row => {
                          return row.visit_status == "A"
                            ? "Active"
                            : "Inactive";
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                className: "select-fld",
                                value: row.visit_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS
                                },
                                onChange: this.changeStatus.bind(this, row),
                                others: {
                                  disabled: this.state.existingPatient
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="visit_type_code"
                    dataSource={{
                      data:
                        this.props.visittypes === undefined
                          ? []
                          : this.props.visittypes
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onDelete: this.deleteVisitType.bind(this),
                      onEdit: row => {},
                      onDone: this.updateVisitType.bind(this)
                    }}
                  />
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VisitType)
);
