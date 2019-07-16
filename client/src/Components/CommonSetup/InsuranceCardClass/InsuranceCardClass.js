import React, { Component } from "react";
import "./InsuranceCardClass.css";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class InsuranceCardClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_insurance_card_class_id: null,
      card_class_name: null,
      arabic_card_class_name: null
    };

    this.baseState = this.state;
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dateFormater(value) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  resetState() {
    this.setState(this.baseState);
  }

  addInsuranceCardClass(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/InsuranceCardClass/addInsuranceCardClass",
          module: "masterSettings",
          data: this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              this.getInsuranceCardClass();

              this.resetState();
              swalMessage({
                title: "Record added successfully...",
                type: "success"
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

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this Card?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        let data = { hims_d_insurance_card_class_id: id };
        algaehApiCall({
          uri: "/InsuranceCardClass/deleteInsuranceCardClass",
          module: "masterSettings",
          data: data,
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getInsuranceCardClass();
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

  deleteInsuranceCardClass(row) {
    this.showconfirmDialog(row.hims_d_insurance_card_class_id);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.insurancecardclass !== nextProps.insurancecardclass) {
      return true;
    }
    return true;
  }

  getInsuranceCardClass() {
    this.props.getInsuranceCardClass({
      uri: "/InsuranceCardClass/getInsuranceCardClass",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "INSURSNCE_CARD_CLASS_GET_DATA",
        mappingName: "insurancecardclass"
      }
    });
  }

  componentDidMount() {
    if (
      this.props.insurancecardclass === undefined ||
      this.props.insurancecardclass.length === 0
    ) {
      this.getInsuranceCardClass();
    }
  }

  updateInsuranceCardClass(data) {
    algaehApiCall({
      uri: "/InsuranceCardClass/updateInsuranceCardClass",
      module: "masterSettings",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.getInsuranceCardClass();
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

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="InsuranceCardClass">
        <div className="container-fluid">
          <form>
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "card_class_name",
                  value: this.state.card_class_name,
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
                  name: "arabic_card_class_name",
                  value: this.state.arabic_card_class_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
                <button
                  onClick={this.addInsuranceCardClass.bind(this)}
                  className="btn btn-primary"
                >
                  Add to List
                </button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col" data-validate="idDiv">
              <AlgaehDataGrid
                datavalidate="data-validate='idDiv'"
                id="card_grd"
                columns={[
                  {
                    fieldName: "card_class_name",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.card_class_name,
                            className: "txt-fld",
                            name: "card_class_name",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            },
                            others: {
                              errormessage: "Name - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "arabic_card_class_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "arabic_type_desc" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.arabic_card_class_name,
                            className: "txt-fld",
                            name: "arabic_card_class_name",
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
                    fieldName: "card_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return row.card_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "card_status",
                            className: "select-fld",
                            value: row.card_status,
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
                keyId="card_grd"
                dataSource={{
                  data:
                    this.props.insurancecardclass === undefined
                      ? []
                      : this.props.insurancecardclass
                }}
                filter={true}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: this.deleteInsuranceCardClass.bind(this),
                  onEdit: row => {},
                  onDone: this.updateInsuranceCardClass.bind(this)
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
    insurancecardclass: state.insurancecardclass,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceCardClass: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceCardClass)
);
