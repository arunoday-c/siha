import React, { Component } from "react";

import "./visit_type.css";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import swal from "sweetalert2";
import { AlgaehActions } from "../../../actions/algaehActions";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
import { setGlobal, AlgaehValidation } from "../../../utils/GlobalFunctions";
import Options from "../../../Options.json";
import _ from "lodash";

class VisitType extends Component {
  constructor(props) {
    super(props);
    this.initCall();

    this.state = {
      isEditable: true,
      open: false,
      visit_status: "A",
      visit_type_code: "",

      visit_type_desc: "",

      arabic_visit_type_desc: "",
      buttonText: <span>Add to List</span>,
      hims_d_visit_type_id: "",
      deleteId: "",
      selectedLang: "en",
      consultation: "N"
    };

    this.baseState = this.state;
  }
  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "visit_type_code",
        tableName: "hims_d_visit_type",
        keyFieldName: "hims_d_visit_type_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            visit_type_code_placeHolder: placeHolder.visit_type_code
          });
        }
      }
    });
  }
  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Visit Type?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        let data = { hims_d_visit_type_id: id };
        algaehApiCall({
          uri: "/visitType/delete",
          module: "masterSettings",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.props.getVisittypes({
                uri: "/visitType/get",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "VISITTYPE_GET_DATA",
                  mappingName: "visittypes"
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

  deleteVisitType(row) {
    this.showconfirmDialog(row.hims_d_visit_type_id);
  }

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
    if (
      this.props.visittypes === undefined ||
      this.props.visittypes.length === 0
    ) {
      this.props.getVisittypes({
        uri: "/visitType/get",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "VISITTYPE_GET_DATA",
          mappingName: "visittypes"
        }
      });
    }
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  resetState() {
    this.setState(this.baseState);
  }

  addVisit(e) {
    e.preventDefault();

    const exit_consultation = _.filter(this.props.visittypes, f => {
      return f.consultation == "Y";
    });
    if (exit_consultation.length > 0) {
      swalMessage({
        title: "Consultation already exists, Only one Consultation can add",
        type: "warning"
      });
      return;
    }

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/visitType/add",
          module: "masterSettings",
          data: this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              this.resetState();
              //Handle Successful Add here
              this.props.getVisittypes({
                uri: "/visitType/get",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "VISITTYPE_GET_DATA",
                  mappingName: "visittypes"
                }
              });
              swalMessage({
                title: "Visa Type added successfully",
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
    algaehApiCall({
      uri: "/visitType/update",
      module: "masterSettings",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.props.getVisittypes({
            uri: "/visitType/get",
            module: "masterSettings",
            method: "GET",
            redux: {
              type: "VISITTYPE_GET_DATA",
              mappingName: "visittypes"
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
    row.update();
  }
  // tedting() {
  //   this.setState({
  //     isEditable: !this.state.isEditable
  //   });
  // }
  render() {
    return (
      <div>
        <div className="visit_type">
          <div className="container-fluid">
            <form>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "type_code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type_code",
                    value: this.state.visit_type_code,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      tabIndex: "1",
                      placeholder: this.state.visit_type_code_placeHolder
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "type_desc",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_type_desc",
                    value: this.state.visit_type_desc,

                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col arabic-txt-fld" }}
                  label={{
                    fieldName: "arabic_type_desc",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "arabic_visit_type_desc",
                    value: this.state.arabic_visit_type_desc,

                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
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
                  style={{ paddingTop: 21 }}
                >
                  <button
                    onClick={this.addVisit.bind(this)}
                    className="btn btn-primary"
                  >
                    {this.state.buttonText}
                  </button>
                </div>
              </div>
            </form>
            {/* <button className="d-none" onClick={this.tedting.bind(this)}>
              {" "}
              testing{" "}
            </button> */}
            <div className="row form-details" data-validate="visitDiv">
              <div className="col">
                <AlgaehDataGrid
                  datavalidate="data-validate='visitDiv'"
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
                      fieldName: "consultation",
                      label: (
                        <AlgaehLabel label={{ fieldName: "consultation" }} />
                      ),
                      displayTemplate: row => {
                        return row.consultation === "N" ? "No" : "Yes";
                      },
                      editorTemplate: row => {
                        return row.consultation === "N" ? "No" : "Yes";
                        // return (
                        //   <AlagehAutoComplete
                        //     div={{}}
                        //     selector={{
                        //       name: "consultation",
                        //       className: "select-fld",
                        //       value: row.consultation,
                        //       dataSource: {
                        //         textField: "name",
                        //         valueField: "value",
                        //         data: GlobalVariables.FORMAT_YESNO
                        //       },
                        //       onChange: this.onchangegridcol.bind(this, row),
                        //       others: {
                        //         errormessage:
                        //           "Urine Specimen - cannot be blank",
                        //         required: true
                        //       }
                        //     }}
                        //   />
                        // );
                      },
                      others: { maxWidth: 100 }
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
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      }
                    },
                    {
                      fieldName: "visit_status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      displayTemplate: row => {
                        return row.visit_status === "A" ? "Active" : "Inactive";
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
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
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
                  filter={true}
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
          </div>
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
