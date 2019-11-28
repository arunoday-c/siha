import React, { Component } from "react";
import "./visatype.scss";

import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

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
import { getCookie } from "../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class VisaType extends Component {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      hims_d_visa_type_id: "",
      visa_type: "",
      visa_status: "A",

      visa_type_code: "",
      visa_desc: "",
      record_Status: "",
      arabic_visa_type: "",
      row: [],
      id: "",
      openDialog: false,
      buttonText: "ADD TO LIST"
    };
    this.baseState = this.state;
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "visa_type_code",
        tableName: "hims_d_visa_type",
        keyFieldName: "hims_d_visa_type_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            visa_type_code_placeHolder: placeHolder.visa_type_code
          });
        }
      }
    });
  }

  resetState() {
    this.setState(this.baseState);
  }

  // getFullStatusText({ value }) {
  //   if (value === "A") {
  //     return "Active";
  //   } else if (value === "I") {
  //     return "Inactive";
  //   } else {
  //     return "";
  //   }
  // }

  addVisaType(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/visaType/addVisa",
          module: "masterSettings",
          data: this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              //Handle Successful Add here
              this.props.getVisatypes({
                uri: "/visaType/getVisaMaster",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "VISA_GET_DATA",
                  mappingName: "visatypes"
                }
              });
              this.resetState();
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

  updateVisaTypes(data) {
    data.updated_by = getCookie("UserID");
    algaehApiCall({
      uri: "/visaType/updateVisa",
      module: "masterSettings",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.props.getVisatypes({
            uri: "/visaType/getVisaMaster",
            module: "masterSettings",
            method: "GET",
            redux: {
              type: "VISA_GET_DATA",
              mappingName: "visatypes"
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

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    if (
      this.props.visatypes === undefined ||
      this.props.visatypes.length === 0
    ) {
      this.props.getVisatypes({
        uri: "/visaType/getVisaMaster",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "VISA_GET_DATA",
          mappingName: "visatypes"
        }
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.visatypes !== nextProps.visatypes) {
      return true;
    }
    return true;
  }

  // changeStatus(row, status) {
  //   this.setState({ visa_status: status.value });

  //   if (status.value === "A")
  //     this.setState({ effective_end_date: "9999-12-31" });
  //   else if (status.value === "I") {
  //     this.setState({
  //       effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
  //     });
  //   }
  //   row.visa_status = status.value;
  // }

  deleteVisaType(row) {
    this.showconfirmDialog(row.hims_d_visa_type_id);
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Visa Type?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        let data = { hims_d_visa_type_id: id };
        algaehApiCall({
          uri: "/visaType/deleteVisa",
          module: "masterSettings",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.props.getVisatypes({
                uri: "/visaType/getVisaMaster",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "VISA_GET_DATA",
                  mappingName: "visatypes"
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
    });
  }

  dateFormater(value) {
    return String(moment(value).format("DD-MM-YYYY"));
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
      <div className="visa_type">
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
                  name: "visa_type_code",
                  value: this.state.visa_type_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  others: {
                    tabIndex: "1",
                    placeholder: this.state.visa_type_code_placeHolder
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
                  name: "visa_type",
                  value: this.state.visa_type,
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
                  name: "arabic_visa_type",
                  value: this.state.arabic_visa_type,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
                <button
                  onClick={this.addVisaType.bind(this)}
                  className="btn btn-primary"
                >
                  {this.state.buttonText}
                </button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col" data-validate="visaDiv">
              <AlgaehDataGrid
                datavalidate="data-validate='visaDiv'"
                id="visa_grd"
                columns={[
                  {
                    fieldName: "visa_type_code",
                    label: <AlgaehLabel label={{ fieldName: "type_code" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "visa_type",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.visa_type,
                            className: "txt-fld",
                            name: "visa_type",
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
                    fieldName: "arabic_visa_type",
                    label: (
                      <AlgaehLabel label={{ fieldName: "arabic_type_desc" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.arabic_visa_type,
                            className: "txt-fld",
                            name: "arabic_visa_type",
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
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    editorTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                  },
                  {
                    fieldName: "visa_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.visa_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "visa_status",
                            className: "select-fld",
                            value: row.visa_status,
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
                keyId="visa_type_code"
                dataSource={{
                  data:
                    this.props.visatypes === undefined
                      ? []
                      : this.props.visatypes
                }}
                filter={true}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: this.deleteVisaType.bind(this),
                  onEdit: row => { },
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  onDone: this.updateVisaTypes.bind(this)
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
    visatypes: state.visatypes,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisatypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VisaType)
);
