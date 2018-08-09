import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./visatype.css";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { algaehApiCall } from "../../../utils/algaehApiCall";

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
import swal from "sweetalert";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";

class VisaType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_visa_type_id: "",
      visa_type: "",
      visa_status: "A",
      visa_type_code_error: false,
      visa_type_code_error_txt: "",
      visa_type_error: false,
      visa_type_error_txt: "",
      visa_type_code: "",
      visa_desc: "",
      record_Status: "",
      arabic_visa_type: "",
      created_by: getCookie("UserID"),
      row: [],
      id: "",
      openDialog: false,
      buttonText: "ADD TO LIST",

      visa_type_arabic_error: false,
      visa_type_arabic_error_txt: ""
    };
    this.baseState = this.state;
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
    if (this.state.visa_type_code.length == 0) {
      this.setState({
        visa_type_code_error: true,
        visa_type_code_error_txt: "Code cannot be empty"
      });
    } else if (this.state.visa_type.length == 0) {
      this.setState({
        visa_type_error: true,
        visa_type_error_txt: "Name cannot be empty"
      });
    } else if (this.state.arabic_visa_type.length == 0) {
      this.setState({
        visa_type_arabic_error: true,
        visa_type_arabic_error_txt: "Arabic Name cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/masters/set/add/visa",
        data: this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            //Handle Successful Add here
            this.props.getVisatypes({
              uri: "/masters/get/visa",
              method: "GET",
              redux: {
                type: "VISA_GET_DATA",
                mappingName: "visatypes"
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

  updateVisaTypes(data) {
    data.updated_by = getCookie("UserID");
    algaehApiCall({
      uri: "/masters/set/update/visa",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swal("Record updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          this.props.getVisatypes({
            uri: "/masters/get/visa",
            method: "GET",
            redux: {
              type: "VISA_GET_DATA",
              mappingName: "visatypes"
            }
          });
        }
      },
      onFailure: error => {}
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
        uri: "/masters/get/visa",
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

  //   if (status.value == "A")
  //     this.setState({ effective_end_date: "9999-12-31" });
  //   else if (status.value == "I") {
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
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = { hims_d_visa_type_id: id };
        algaehApiCall({
          uri: "/masters/set/delete/visa",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });

              this.props.getVisatypes({
                uri: "/masters/get/visa",
                method: "GET",
                redux: {
                  type: "VISA_GET_DATA",
                  mappingName: "visatypes"
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

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.resetState();
  }

  render() {
    return (
      <div className="visa_type">
        <LinearProgress id="myProg" style={{ display: "none" }} />
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
                  value: this.state.visa_status,
                  controls: [
                    { label: "Active", value: "A" },
                    { label: "Inactive", value: "I" }
                  ],
                  events: { onChange: this.changeStatus.bind(this) }
                }}
              /> */}

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
                  error: this.state.visa_type_code_error,
                  helperText: this.state.visa_type_code_error_txt
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
                  },
                  error: this.state.visa_type_error,
                  helperText: this.state.visa_type_error_txt
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
                  name: "arabic_visa_type",
                  value: this.state.arabic_visa_type,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  error: this.state.visa_type_arabic_error,
                  helperText: this.state.visa_type_arabic_error_txt
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addVisaType.bind(this)}
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
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    disabled: true
                  },
                  {
                    fieldName: "visa_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.visa_status == "A" ? "Active" : "Inactive";
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
                            onChange: this.onchangegridcol.bind(this, row)
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
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  onDelete: this.deleteVisaType.bind(this),
                  onEdit: row => {},
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  onDone: this.updateVisaTypes.bind(this)
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
    visatypes: state.visatypes
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
