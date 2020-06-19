import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./BankMaster.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { MainContext } from "algaeh-react-components/context";
import { AlgaehSecurityElement } from "algaeh-react-components";

class BankMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bank_name: null,
      bank_code: null,
      bank_short_name: null,
      address1: null,
      contact_person: null,
      contact_number: null,
      card_name: "",
      card_list: [],
      HIMS_Active: false,
    };
    if (this.props.banks === undefined || this.props.banks.length === 0) {
      this.getBankMaster();
    }
  }
  static contextType = MainContext;

  componentDidMount() {
    const userToken = this.context.userToken;
    const active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    if (active === true) {
      // this.getCardkMaster();
    }
    this.setState({
      HIMS_Active: active,
    });
  }

  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }

  clearState() {
    this.setState({
      bank_name: null,
      bank_code: null,
      bank_short_name: null,
      address1: null,
      contact_person: null,
      contact_number: null,
    });
  }

  getBankMaster() {
    this.props.getBanks({
      uri: "/bankmaster/getBank",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "BANK_GET_DATA",
        mappingName: "banks",
      },
    });
  }

  getCardkMaster() {
    algaehApiCall({
      uri: "/bankmaster/getBankCards",
      module: "masterSettings",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            card_list: response.data.records,
          });
        }
      },
      onCatch: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  addBank(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "id='bankMaster'",
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
            contact_number: this.state.contact_number,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Bank added Successfully",
                type: "success",
              });

              this.getBankMaster();
              this.clearState();
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.response.data.message,
              type: "error",
            });
          },
        });
      },
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
        contact_number: data.contact_number,
      },
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });

          this.getBankMaster();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
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
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/bankmaster/deleteBank",
          module: "masterSettings",
          data: {
            hims_d_bank_id: data.hims_d_bank_id,
          },
          method: "DELETE",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });

              this.getBankMaster();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error",
              });
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
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

  addCardMaster(e) {
    if (this.state.card_name === "") {
      swalMessage({
        type: "warning",
        title: "Card Number can't blank.",
      });
      return;
    }
    algaehApiCall({
      uri: "/bankmaster/addBankCards",
      module: "masterSettings",
      data: {
        card_name: this.state.card_name,
      },
      method: "POST",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
        } else {
          swalMessage({
            title: response.data.message,
            type: "error",
          });
        }
      },
      onCatch: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  render() {
    // const col_setup = this.state.HIMS_Active === true ? "col-8" : "col-12";
    return (
      <div className="row BankMasterScreen" style={{ paddingTop: 15 }}>
        <div className="col-12">
          <div
            id="bankMaster"
            className="portlet portlet-bordered margin-bottom-15"
          >
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Bank Full Name",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "bank_name",
                    value: this.state.bank_name,
                    events: { onChange: this.texthandle.bind(this) },
                    option: {
                      type: "text",
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Bank Short Name",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "bank_short_name",
                    value: this.state.bank_short_name,
                    events: { onChange: this.texthandle.bind(this) },
                    option: {
                      type: "text",
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "BIC (SWIFT) Code",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "bank_code",
                    value: this.state.bank_code,
                    events: { onChange: this.texthandle.bind(this) },
                    option: {
                      type: "text",
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-5" }}
                  label={{
                    forceLabel: "Address",
                    isImp: false,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "address1",
                    value: this.state.address1,
                    events: { onChange: this.texthandle.bind(this) },
                    option: {
                      type: "text",
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Contact Person",
                    isImp: false,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "contact_person",
                    value: this.state.contact_person,
                    events: { onChange: this.texthandle.bind(this) },
                    option: {
                      type: "text",
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Contact Number",
                  }}
                  textBox={{
                    value: this.state.contact_number,
                    className: "txt-fld",
                    name: "contact_number",

                    events: {
                      onChange: this.texthandle.bind(this),
                    },
                    others: {
                      placeholder: "(+01)123-456-7890",
                      type: "number",
                    },
                  }}
                />

                <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                  <div className="col">
                    <button
                      style={{ marginTop: 19 }}
                      className="btn btn-primary"
                      onClick={this.addBank.bind(this)}
                    >
                      Add to List
                    </button>
                  </div>
                </AlgaehSecurityElement>
              </div>
            </div>
          </div>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
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
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage: "Name - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "bank_short_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage:
                                      "Short Name - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "bank_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "BIC ( SWIFT)" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage: "BIC - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "address1",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Address" }} />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "contact_person",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Contact Person" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "contact_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Contact Number" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "active_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.active_status === "A"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            );
                          },
                          editorTemplate: (row) => {
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
                                    data: GlobalVariables.FORMAT_STATUS,
                                  },
                                  others: {
                                    errormessage: "Status - cannot be blank",
                                    required: true,
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                }}
                              />
                            );
                          },
                        },
                      ]}
                      keyId="BankMasterGrid"
                      dataSource={{
                        data:
                          this.props.banks === undefined
                            ? []
                            : this.props.banks,
                      }}
                      filter={true}
                      isEditable={true}
                      actions={{
                        allowDelete: false,
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteBankMaster.bind(this),
                        onDone: this.updateBankMaster.bind(this),
                      }}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {this.state.HIMS_Active === true ? (
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-8 mandatory" }}
                    label={{
                      forceLabel: "Card Name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_name",
                      value: this.state.card_name,
                      events: { onChange: this.texthandle.bind(this) },
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <div className="col-4">
                    <button
                      style={{ marginTop: 19 }}
                      className="btn btn-primary"
                      onClick={this.addCardMaster.bind(this)}
                    >
                      Add to Card List
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div data-validate="cardDiv" id="CardMasterGrid_Cntr">
                      <AlgaehDataGrid
                        id="CardMasterGrid"
                        datavalidate="data-validate='cardDiv'"
                        columns={[
                          {
                            fieldName: "card_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Card Name" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "card_name",
                                    value: row.bank_name,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      errormessage:
                                        "Card Name - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "card_format_no",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Card Format" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "card_format_no",
                                    value: row.bank_short_name,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      errormessage:
                                        "Card Format - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              );
                            }
                          }
                        ]}
                        keyId="CardMasterGrid"
                        dataSource={{
                          data: this.state.card_list
                        }}
                        filter={true}
                        isEditable={true}
                        actions={{
                          allowDelete: false
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onEdit: () => { },
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
        ) : null} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    banks: state.banks,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BankMaster)
);
