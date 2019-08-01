import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BankMaster.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class BankMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_name: null,
      bank_code: null,
      bank_short_name: null,
      address1: null,
      contact_person: null,
      contact_number: null
    };
    if (this.props.banks === undefined || this.props.banks.length === 0) {
      this.getBankMaster();
    }
  }

  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  clearState() {
    this.setState({
      bank_name: null,
      bank_code: null,
      bank_short_name: null,
      address1: null,
      contact_person: null,
      contact_number: null
    });
  }

  getBankMaster() {
    this.props.getBanks({
      uri: "/bankmaster/getBank",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "BANK_GET_DATA",
        mappingName: "banks"
      }
    });
  }
  addBank(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/bankmaster/addBank",
          module: "masterSettings",
          method: "POST",
          data: {
            bank_code: this.state.bank_code,
            bank_name: this.state.bank_name,
            bank_short_name: this.state.bank_short_name,
            address1: this.state.address1,
            contact_person: this.state.contact_person,
            contact_number: this.state.contact_number
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Bank added Successfully",
                type: "success"
              });

              this.getBankMaster();
              this.clearState();
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

  updateBankMaster(data) {
    algaehApiCall({
      uri: "/bankmaster/updateBank",
      module: "masterSettings",
      data: {
        hims_d_bank_id: data.hims_d_bank_id,
        bank_code: data.bank_code,
        bank_name: data.bank_name,
        bank_short_name: data.bank_short_name,
        address1: data.address1,
        contact_person: data.contact_person,
        contact_number: data.contact_number
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getBankMaster();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  deleteBankMaster(data) {
    swal({
      title: "Are you sure want to Delete " + data.bank_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/bankmaster/deleteBank",
          module: "masterSettings",
          data: {
            hims_d_bank_id: data.hims_d_bank_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getBankMaster();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }
  render() {
    return (
      <div className="BankMasterScreen">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Bank Full Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "bank_name",
              value: this.state.bank_name,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory" }}
            label={{
              forceLabel: "Bank Short Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "bank_short_name",
              value: this.state.bank_short_name,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory" }}
            label={{
              forceLabel: "BIC (SWIFT) Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "bank_code",
              value: this.state.bank_code,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3" }}
            label={{
              forceLabel: "Address",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "address1",
              value: this.state.address1,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2" }}
            label={{
              forceLabel: "Contact Person",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "contact_person",
              value: this.state.contact_person,
              events: { onChange: this.texthandle.bind(this) },
              option: {
                type: "text"
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Contact Number"
            }}
            textBox={{
              value: this.state.contact_number,
              className: "txt-fld",
              name: "contact_number",

              events: {
                onChange: this.texthandle.bind(this)
              },
              others: {
                placeholder: "(+01)123-456-7890",
                type: "number"
              }
            }}
          />

          <div className="col">
            <button
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              onClick={this.addBank.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div data-validate="bankDiv" id="BankMasterGrid_Cntr">
                  <AlgaehDataGrid
                    id="BankMasterGrid"
                    datavalidate="data-validate='bankDiv'"
                    columns={[
                      {
                        fieldName: "bank_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Bank Name" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "bank_name",
                                value: row.bank_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
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
                        fieldName: "bank_short_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "bank_short_name",
                                value: row.bank_short_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Short Name - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "bank_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "BIC ( SWIFT)" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "bank_code",
                                value: row.bank_code,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "BIC - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "address1",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Address" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "address1",
                                value: row.address1,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "contact_person",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Contact Person" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "contact_person",
                                value: row.contact_person,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "contact_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Contact Number" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "contact_number",
                                value: row.contact_number,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "active_status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.active_status === "A"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "active_status",
                                className: "select-fld",
                                value: row.active_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS
                                },
                                others: {
                                  errormessage: "Status - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="BankMasterGrid"
                    dataSource={{
                      data:
                        this.props.banks === undefined ? [] : this.props.banks
                    }}
                    filter={true}
                    isEditable={true}
                    actions={{
                      allowDelete: false
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteBankMaster.bind(this),
                      onDone: this.updateBankMaster.bind(this)
                    }}
                    others={{}}
                  />
                </div>
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
    banks: state.banks
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BankMaster)
);
