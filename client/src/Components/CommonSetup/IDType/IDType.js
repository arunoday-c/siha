import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./id_type.css";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
//import DeleteDialog from "../../../utils/DeleteDialog";
import swal from "sweetalert2";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";

class IDType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identity_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      arabic_identity_document_name: "",

      currentRowID: "",
      id_code_error: false,
      id_code_error_txt: "",
      id_name_error: false,
      id_name_error_txt: "",
      arabic_id_name_error: false,
      arabic_id_name_error_txt: ""
    };

    this.baseState = this.state;
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
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
        id_code_error_txt: "Code cannot be empty"
      });
    } else if (this.state.identity_document_name.length === 0) {
      this.setState({
        id_name_error: true,
        id_name_error_txt: "Name cannot be empty"
      });
    } else if (this.state.arabic_identity_document_name.length === 0) {
      this.setState({
        arabic_id_name_error: true,
        arabic_id_name_error_txt: "Arabic Name cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/identity/add",
        data: this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            // this.props.getIDTypes();

            this.props.getIDTypes({
              uri: "/identity/get",
              method: "GET",
              redux: {
                type: "IDTYPE_GET_DATA",
                mappingName: "idtypes"
              }
            });

            this.resetState();
            swalMessage({
              title: "ID Type added successfully",
              type: "success"
            });
          }
        },
        onFailure: error => {
          console.error(error);
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
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.props.getIDTypes({
                uri: "/identity/get",
                method: "GET",
                redux: {
                  type: "IDTYPE_GET_DATA",
                  mappingName: "idtypes"
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
    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes"
        }
      });
    }
  }

  updateIDtypes(data) {
    algaehApiCall({
      uri: "/identity/update",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.props.getIDTypes({
            uri: "/identity/get",
            method: "GET",
            redux: {
              type: "IDTYPE_GET_DATA",
              mappingName: "idtypes"
            }
          });
        }
      },
      onFailure: error => {}
    });
  }

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.resetState();
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
              {/* <AlgaehOptions
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
              /> */}

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "type_code",
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
                  fieldName: "type_desc",
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

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "arabic_type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "arabic_identity_document_name",
                  value: this.state.arabic_identity_document_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  },
                  error: this.state.visa_type_error,
                  helperText: this.state.visa_type_error_txt
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
              <AlgaehDataGrid
                id="identity_grd"
                columns={[
                  {
                    fieldName: "identity_document_code",
                    label: <AlgaehLabel label={{ fieldName: "type_code" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "identity_document_name",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.identity_document_name,
                            className: "txt-fld",
                            name: "identity_document_name",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "arabic_identity_document_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "arabic_type_desc" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.arabic_identity_document_name,
                            className: "txt-fld",
                            name: "arabic_identity_document_name",
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
                keyId="identity_document_code"
                dataSource={{
                  data:
                    this.props.idtypes === undefined ? [] : this.props.idtypes
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: this.deleteIDType.bind(this),
                  onEdit: row => {},
                  onDone: this.updateIDtypes.bind(this)
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
    idtypes: state.idtypes,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: AlgaehActions
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
