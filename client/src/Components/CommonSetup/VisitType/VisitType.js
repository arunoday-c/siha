import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./visit_type.css";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel,
  Button
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import swal from "sweetalert";
import { AlgaehActions } from "../../../actions/algaehActions";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import { getCookie } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";
import Options from "../../../Options.json";

class VisitType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      visit_status: "A",
      visit_type_code: "",
      visit_type_code_error: false,
      visit_type_code_error_txt: "",
      visit_type_desc: "",
      visit_type_error: false,
      visit_type_error_txt: "",
      hims_d_visit_type_error: false,
      hims_d_visit_type_error_txt: "",
      arabic_visit_type_desc: "",
      buttonText: (
        <AlgaehLabel
          label={{
            fieldName: "Addbutton"
          }}
        />
      ),
      hims_d_visit_type_id: "",
      deleteId: "",
      selectedLang: "en",
      consultation: "N"
    };

    this.baseState = this.state;
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
      }
    });
  }

  deleteVisitType(row) {
    //console.log("Delete Row ID: ", row.hims_d_visit_type_id);
    this.showconfirmDialog(row.hims_d_visit_type_id);
  }

  // handleConfirmDelete() {
  //   const data = { hims_d_visit_type_id: this.state.deleteId };

  //   algaehApiCall({
  //     uri: "/visitType/delete",
  //     data: data,
  //     method: "DELETE",
  //     onSuccess: response => {
  //       this.setState({ open: false });
  //       window.location.reload();
  //     },
  //     onFailure: error => {
  //       this.setState({ open: false });
  //     }
  //   });
  // }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete(e) {
    const visit_id = JSON.parse(e.currentTarget.getAttribute("sltd_id"));
    this.setState({ open: true, deleteId: visit_id });
  }

  changeTexts(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  selectedVisitType(visitType) {
    this.setState({ hims_d_visit_type: visitType });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
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

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  resetState() {
    this.setState(this.baseState);
  }

  addVisit(e) {
    e.preventDefault();
    if (this.state.visit_type_code.length == 0) {
      this.setState({
        visit_type_code_error: true,
        visit_type_code_error_txt: "Code Cannot be Empty"
      });
    } else if (this.state.visit_type_desc.length == 0) {
      this.setState({
        visit_type_error: true,
        visit_type_error_txt: "Name Cannot be Empty"
      });
    } else if (this.state.arabic_visit_type_desc.length == 0) {
      this.setState({
        arabic_visit_type_error: true,
        arabic_visit_type_error_txt: "Arabic Name Cannot be Empty"
      });
    } else {
      this.setState({
        visit_type_code_error: false,
        visit_type_code_error_txt: "",
        visit_type_error: false,
        visit_type_error_txt: "",
        arabic_visit_type_error: false,
        arabic_visit_type_error_txt: ""
      });

      algaehApiCall({
        uri: "/visitType/add",
        data: this.state,
        onSuccess: response => {
          if (response.data.success == true) {
            this.resetState();
            //Handle Successful Add here
            this.props.getVisittypes({
              uri: "/visitType/get",
              method: "GET",
              redux: {
                type: "VISITTYPE_GET_DATA",
                mappingName: "visittypes"
              }
            });

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
    // row[e.target.name] = e.target.value;
    // callback(row);
  }

  editVisitTypes(e) {
    const data = JSON.parse(e.currentTarget.getAttribute("current_edit"));

    this.setState({
      visit_type_code: data.visit_type_code,
      visit_type: data.visit_type,
      hims_d_visit_type: data.hims_d_visit_type,
      buttonText: (
        <AlgaehLabel
          label={{
            fieldName: "Updatebutton"
          }}
        />
      ),
      hims_d_visit_type_id: data.hims_d_visit_type_id
    });
  }

  updateVisitType(data) {
    // data.updated_by = getCookie("UserID");

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

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.resetState();
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
                {/* <AlgaehOptions
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
                /> */}

                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "type_code",
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

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "type_desc",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type_desc",
                    value: this.state.visit_type_desc,
                    error: this.state.visit_type_error,
                    helperText: this.state.visit_type_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
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
                    name: "arabic_visit_type_desc",
                    value: this.state.arabic_visit_type_desc,
                    error: this.state.arabic_visit_type_error,
                    helperText: this.state.arabic_visit_type_error_txt,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "consultation"
                  }}
                  selector={{
                    name: "consultation",
                    className: "select-fld",
                    value: this.state.consultation,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "name"
                          : "arabic_name",
                      valueField: "value",
                      data: FORMAT_YESNO
                    },
                    onChange: this.changeTexts.bind(this)
                  }}
                />

                <div
                  className="col-lg-2 align-middle"
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
                <AlgaehDataGrid
                  id="visit_grd"
                  columns={[
                    {
                      fieldName: "visit_type_code",
                      label: <AlgaehLabel label={{ fieldName: "type_code" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "visit_type_desc",
                      label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.visit_type_desc,
                              className: "txt-fld",
                              name: "visit_type_desc",
                              events: {
                                onChange: this.onchangegridcol.bind(this, row)
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "arabic_visit_type_desc",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "arabic_type_desc" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.arabic_visit_type_desc,
                              className: "txt-fld",
                              name: "arabic_visit_type_desc",
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
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
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
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),

                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "visit_status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      displayTemplate: row => {
                        return row.visit_status == "A" ? "Active" : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "visit_status",
                              className: "select-fld",
                              value: row.visit_status,
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
                  keyId="visit_type_code"
                  dataSource={{
                    data:
                      this.props.visittypes === undefined
                        ? []
                        : this.props.visittypes
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: this.deleteVisitType.bind(this),
                    onEdit: row => {},
                    onDone: this.updateVisitType.bind(this)
                  }}
                />
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
    visittypes: state.visittypes,
    userdrtails: state.userdrtails
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
