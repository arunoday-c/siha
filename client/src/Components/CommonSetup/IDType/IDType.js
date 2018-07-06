import React, { Component } from "react";
import { Paper } from "material-ui";
import "./id_type.css";
import { Button } from "material-ui";
import moment from "moment";
import { getIDTypes } from "../../../actions/CommonSetup/IDType.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import DeleteDialog from "../../../utils/DeleteDialog";
import swal from "sweetalert";
import {
  AlagehFormGroup,
  AlgaehOptions,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";

class IDType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identity_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      arabic_identity_document_name: "",
      created_by: "1",
      currentRowID: "",
      id_code_error: false,
      id_code_error_txt: "",
      id_name_error: false,
      id_name_error_txt: ""
    };

    this.baseState = this.state;
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

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeStatus(row, status) {
    this.setState({ identity_status: status.value });

    if (status.value === "A")
      this.setState({ effective_end_date: "9999-12-31" });
    else if (status.value === "I") {
      this.setState({
        effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
      });
    }
    row.identity_status = status.value;
  }

  dateFormater({ value }) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  resetState() {
    this.setState(this.baseState);
  }

  addIDType(e) {
    e.preventDefault();
    if (this.state.identity_document_code.length === 0) {
      this.setState({
        id_code_error: true,
        id_code_error_txt: "ID Code cannot be empty"
      });
    } else if (this.state.identity_document_name.length === 0) {
      this.setState({
        id_name_error: true,
        id_name_error_txt: "ID Name cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/identity/add",
        data: this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            this.props.getIDTypes();
            this.resetState();

            swal({
              title: "Success",
              text: "ID Type added successfully",
              icon: "success",
              button: false,
              timer: 2500
            });
          }
        },
        onFailure: error => {
          console.log(error);
        }
      });
    }
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this ID Types?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = { hims_d_identity_document_id: id };
        algaehApiCall({
          uri: "/identity/delete",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.props.getIDTypes();
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  deleteIDType(row) {
    this.showconfirmDialog(row.hims_d_identity_document_id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.idtypes !== nextProps.idtypes) {
      return true;
    }
    return true;
  }

  componentDidMount() {
    this.props.getIDTypes();
  }

  updateIDtypes(data) {
    algaehApiCall({
      uri: "/identity/update",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swal("Record updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          this.props.getIDTypes();
        }
      },
      onFailure: error => {}
    });
  }

  getFormatedDate(date) {
    return String(moment(date).format("YYYY-MM-DD"));
  }

  render() {
    return (
      <div className="id_type">
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
                  value: this.state.identity_status,
                  controls: [
                    { label: "Active", value: "A" },
                    { label: "Inactive", value: "I" }
                  ],
                  events: { onChange: this.changeStatus.bind(this) }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "identity_document_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "identity_document_code",
                  value: this.state.identity_document_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },

                  error: this.state.id_code_error,
                  helperText: this.state.id_code_error_txt
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "identity_document_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "identity_document_name",
                  value: this.state.identity_document_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  error: this.state.id_name_error,
                  helperText: this.state.id_name_error_txt
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addIDType.bind(this)}
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
              <Paper>
                <AlgaehDataGrid
                  id="identity_grd"
                  columns={[
                    {
                      fieldName: "identity_document_code",
                      label: "ID Type Code",
                      disabled: true
                    },
                    {
                      fieldName: "identity_document_name",
                      label: "ID Type Name"
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
                                debugger;
                                row.created_date = selected._d;
                              }
                            }}
                            value={this.getFormatedDate(row.created_date)}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "identity_status",
                      label: "ID Type Status",
                      displayTemplate: row => {
                        return row.identity_status == "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              className: "select-fld",
                              value: row.identity_status,
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
                  keyId="identity_document_code"
                  dataSource={{
                    data: this.props.idtypes
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  events={{
                    onDelete: this.deleteIDType.bind(this),
                    onEdit: row => {},
                    // onDone: row => {
                    //   this.updateIDtypes.bind(this);
                    //   //  alert(JSON.stringify(row));
                    // }
                    onDone: this.updateIDtypes.bind(this)
                  }}
                />
              </Paper>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    idtypes: state.idtypes.idtypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: getIDTypes
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IDType)
);
