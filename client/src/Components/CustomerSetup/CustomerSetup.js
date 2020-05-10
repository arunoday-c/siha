import React, { Component } from "react";
import "./CustomerSetup.scss";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import Enumerable from "linq";

class CustomerSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      customers: [],
      countries: [],
      states: [],
      cities: [],
      vat_applicable: false,
      btn_txt: "ADD",
      hims_d_customer_id: null,
      customer_status: "A",

      purchase_inch_name: null,
      purchase_inch_number: null,
      purchase_inch_emailid: null,

      project_inch_name: null,
      project_inch_number: null,
      project_inch_emailid: null,

      finance_inch_name: null,
      finance_inch_number: null,
      finance_inch_emailid: null
    };
  }

  componentDidMount() {
    this.getAllCustomers();
    this.getCountries();
  }

  resetSaveState() {
    this.setState({
      customer_code: "",
      customer_name: "",
      arabic_customer_name: "",
      vat_number: "",
      business_registration_no: "",
      email_id_1: "",
      email_id_2: "",
      website: "",
      contact_number: "",
      payment_terms: null,
      payment_mode: null,
      vat_applicable: false,
      vat_percentage: 0,
      country_id: null,
      state_id: null,
      city_id: null,
      postal_code: null,
      bank_name: null,
      address: "",
      hims_d_customer_id: null,
      openModal: false,

      purchase_inch_name: null,
      purchase_inch_number: null,
      purchase_inch_emailid: null,

      project_inch_name: null,
      project_inch_number: null,
      project_inch_emailid: null,

      finance_inch_name: null,
      finance_inch_number: null,
      finance_inch_emailid: null
    });
  }

  getCountries() {
    algaehApiCall({
      uri: "/masters/get/countryStateCity",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ countries: response.data.records });
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

  getAllCustomers() {
    algaehApiCall({
      uri: "/customer/getCustomerMaster",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ customers: response.data.records });
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

  addCustomerMaster(e) {
    AlgaehValidation({
      querySelector: "data-validate='CustomerDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let uri =
          this.state.hims_d_customer_id === null
            ? "/customer/addCustomerMaster"
            : "/customer/updateCustomerMaster";
        let method = this.state.hims_d_customer_id === null ? "POST" : "PUT";
        let success_msg =
          this.state.hims_d_customer_id === null
            ? "Added Successfully"
            : "Updated Successfully";

        let sen_data = {
          hims_d_customer_id: this.state.hims_d_customer_id,
          customer_code: this.state.customer_code,
          customer_name: this.state.customer_name,
          arabic_customer_name: this.state.arabic_customer_name,
          vat_number: this.state.vat_number,
          business_registration_no: this.state.business_registration_no,
          email_id_1: this.state.email_id_1,
          email_id_2: this.state.email_id_2,
          website: this.state.website,
          contact_number: this.state.contact_number,
          payment_terms: this.state.payment_terms,
          payment_mode: this.state.payment_mode,
          vat_applicable: this.state.vat_applicable === true ? "Y" : "N",
          vat_percentage:
            this.state.vat_applicable === false ? 0 : this.state.vat_percentage,
          country_id: this.state.country_id,
          state_id: this.state.state_id,
          city_id: this.state.city_id,
          postal_code: this.state.postal_code,
          bank_name: this.state.bank_name,
          address: this.state.address,
          customer_status: this.state.customer_status,

          purchase_inch_name: this.state.purchase_inch_name,
          purchase_inch_number: this.state.purchase_inch_number,
          purchase_inch_emailid: this.state.purchase_inch_emailid,

          project_inch_name: this.state.project_inch_name,
          project_inch_number: this.state.project_inch_number,
          project_inch_emailid: this.state.project_inch_emailid,

          finance_inch_name: this.state.finance_inch_name,
          finance_inch_number: this.state.finance_inch_number,
          finance_inch_emailid: this.state.finance_inch_emailid
        };

        algaehApiCall({
          uri: uri,
          module: "masterSettings",
          method: method,
          data: sen_data,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: success_msg,
                type: "success"
              });
              this.resetSaveState();
              this.getAllCustomers();
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

  editCustomer(data, e) {
    this.setState({
      openModal: true,
      btn_txt: "Update",
      ...data
    });

    this.getStateCity(data.country_id, data.state_id);
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: !this.state.vat_applicable
    });
  }

  getStateCity(country_id, state_id) {
    let country = Enumerable.from(this.state.countries)
      .where(w => w.hims_d_country_id === parseInt(country_id, 10))
      .firstOrDefault();
    let states = country !== undefined ? country.states : [];
    if (this.state.countries !== undefined && states.length !== 0) {
      let cities = Enumerable.from(states)
        .where(w => w.hims_d_state_id === parseInt(state_id, 10))
        .firstOrDefault();
      if (cities !== undefined) {
        this.setState({
          states: states,
          cities: cities.cities
        });
      } else {
        this.setState({
          states: states
        });
      }
    }
  }

  dropDownHandle(value) {
    switch (value.name) {
      case "country_id":
        this.setState({
          [value.name]: value.value,
          states: value.selected.states
        });

        break;

      case "state_id":
        this.setState({
          [value.name]: value.value,
          cities: value.selected.cities
        });
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  radioChange(e) {
    let customer_status = "A";
    if (e.target.value === "I") {
      customer_status = "I";
    }
    this.setState({
      customer_status: customer_status
    });
  }

  render() {
    return (
      <div className="customer_setup">
        <AlgaehModalPopUp
          class="createEditPopup"
          events={{
            onClose: this.resetSaveState.bind(this)
          }}
          title="Add / Edit Customer"
          openPopup={this.state.openModal}
        >
          <div className="popupInner">
            <div className="col-12">
              <div className="row" data-validate="CustomerDiv">
                <div className="col-8 popLeftDiv">
                  <h6>Business Details</h6>
                  <hr style={{ margin: 0 }} />
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-2 form-group mandatory" }}
                      label={{
                        fieldName: "customer_code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "customer_code",
                        value: this.state.customer_code,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          disabled:
                            this.state.hims_d_customer_id === null
                              ? false
                              : true
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-5 form-group mandatory" }}
                      label={{
                        fieldName: "customer_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "customer_name",
                        value: this.state.customer_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-5 form-group mandatory" }}
                      label={{
                        forceLabel: "Customer Name in Arabic",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_customer_name",
                        value: this.state.arabic_customer_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-3 form-group mandatory" }}
                      label={{
                        forceLabel: "Vat Number",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "vat_number",
                        value: this.state.vat_number,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group mandatory" }}
                      label={{
                        fieldName: "contact_number",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "contact_number",
                        value: this.state.contact_number,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          type: "number",
                          min: 0
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group mandatory" }}
                      label={{
                        fieldName: "primaryEmail",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "email_id_1",
                        value: this.state.email_id_1,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group " }}
                      label={{
                        fieldName: "secondaryEmail",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "email_id_2",
                        value: this.state.email_id_2,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        fieldName: "fullAddress",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "address",
                        value: this.state.address,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "business_registration_no",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "business_registration_no",
                        value: this.state.business_registration_no,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "country",
                        isImp: false
                      }}
                      selector={{
                        name: "country_id",
                        className: "select-fld",
                        value: this.state.country_id,
                        dataSource: {
                          textField: "country_name",
                          valueField: "hims_d_country_id",
                          data: this.state.countries
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "state",
                        isImp: false
                      }}
                      selector={{
                        name: "state_id",
                        className: "select-fld",
                        value: this.state.state_id,
                        dataSource: {
                          textField: "state_name",
                          valueField: "hims_d_state_id",
                          data: this.state.states
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "city"
                      }}
                      selector={{
                        name: "city_id",
                        className: "select-fld",
                        value: this.state.city_id,
                        dataSource: {
                          textField: "city_name",
                          valueField: "hims_d_city_id",
                          data: this.state.cities
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "postal_code",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "postal_code",
                        value: this.state.postal_code,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group " }}
                      label={{
                        fieldName: "websiteAddress",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "website",
                        value: this.state.website,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                    {this.state.hims_d_customer_id !== null ? (
                      <div className="col-3">
                        <label>Customer Status</label>
                        <div
                          className="customRadio"
                          style={{ borderBottom: 0 }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              value="A"
                              checked={
                                this.state.customer_status === "A"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>
                              <AlgaehLabel
                                label={{
                                  fieldName: "active"
                                }}
                              />
                            </span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              value="I"
                              checked={
                                this.state.customer_status === "I"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>
                              <AlgaehLabel
                                label={{
                                  fieldName: "inactive"
                                }}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>{" "}
                  <h6>Payment Details</h6>
                  <hr style={{ margin: 0 }} />
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-2 form-group mandatory" }}
                      label={{
                        fieldName: "payment_terms",
                        isImp: true
                      }}
                      selector={{
                        sort: "off",
                        name: "payment_terms",
                        className: "select-fld",
                        value: this.state.payment_terms,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAYMENT_TERMS
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "payment_mode",
                        isImp: true
                      }}
                      selector={{
                        name: "payment_mode",
                        className: "select-fld",
                        value: this.state.payment_mode,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.PAYMENT_MODE
                        },
                        onChange: this.dropDownHandle.bind(this)
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-3 form-group" }}
                      label={{
                        fieldName: "bank_name",
                        isImp: this.state.payment_mode === "BT" ? true : false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "bank_name",
                        value: this.state.bank_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                  </div>{" "}
                </div>{" "}
                <div className="col-4 popRightDiv">
                  <h6>Finance Incharge Details</h6>

                  <hr style={{ margin: 0 }} />
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-12 form-group " }}
                      label={{
                        fieldName: "inchargeName"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "finance_inch_name",
                        value: this.state.finance_inch_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group " }}
                      label={{
                        fieldName: "contact_number"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "finance_inch_number",
                        value: this.state.finance_inch_number,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          type: "number",
                          min: 0
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-6 form-group" }}
                      label={{
                        fieldName: "primaryEmail"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "finance_inch_emailid",
                        value: this.state.finance_inch_emailid,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                  </div>

                  <h6>Project Incharge Details</h6>

                  <hr style={{ margin: 0 }} />
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-12 form-group " }}
                      label={{
                        fieldName: "inchargeName"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "project_inch_name",
                        value: this.state.project_inch_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group " }}
                      label={{
                        fieldName: "contact_number"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "project_inch_number",
                        value: this.state.project_inch_number,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          type: "number",
                          min: 0
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-6 form-group " }}
                      label={{
                        fieldName: "primaryEmail"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "project_inch_emailid",
                        value: this.state.project_inch_emailid,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                  </div>

                  <h6>Purchase Incharge Details</h6>

                  <hr style={{ margin: 0 }} />
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-12 form-group " }}
                      label={{
                        fieldName: "inchargeName"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "purchase_inch_name",
                        value: this.state.purchase_inch_name,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group " }}
                      label={{
                        fieldName: "contact_number"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "purchase_inch_number",
                        value: this.state.purchase_inch_number,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        },
                        others: {
                          type: "number",
                          min: 0
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-6 form-group " }}
                      label={{
                        fieldName: "primaryEmail"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "purchase_inch_emailid",
                        value: this.state.purchase_inch_emailid,
                        events: {
                          onChange: this.changeTexts.bind(this)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.addCustomerMaster.bind(this)}
                  >
                    <label className="style_Label ">{this.state.btn_txt}</label>
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.resetSaveState.bind(this)}
                  >
                    <label className="style_Label ">Cancel</label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Customer Master</h3>
            </div>
            <div className="actions">
              <button
                className="btn btn-primary btn-circle active"
                onClick={() => {
                  this.setState({
                    openModal: true,
                    btn_txt: "ADD"
                  });
                }}
              >
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>

          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="customerGrid">
                <AlgaehDataGrid
                  id="item_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <div className="row">
                            <div className="col">
                              <i
                                className="fas fa-pen"
                                onClick={this.editCustomer.bind(this, row)}
                              />
                            </div>
                          </div>
                        );
                      },
                      others: {
                        maxWidth: 120,
                        style: {
                          textAlign: "center"
                        },
                        filterable: false
                      }
                    },

                    {
                      fieldName: "customer_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "customer_code" }} />
                      )
                    },
                    {
                      fieldName: "customer_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "customer_name" }} />
                      )
                    },
                    {
                      fieldName: "business_registration_no",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "business_registration_no" }}
                        />
                      )
                    },
                    {
                      fieldName: "contact_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_number" }} />
                      )
                    },
                    {
                      fieldName: "email_id_1",
                      label: (
                        <AlgaehLabel label={{ fieldName: "primaryEmail" }} />
                      )
                    },
                    {
                      fieldName: "payment_terms",
                      label: (
                        <AlgaehLabel label={{ fieldName: "payment_terms" }} />
                      ),
                      displayTemplate: row => {
                        return row.payment_terms + " Days";
                      }
                    },
                    {
                      fieldName: "payment_mode",
                      label: (
                        <AlgaehLabel label={{ fieldName: "payment_mode" }} />
                      ),
                      displayTemplate: row => {
                        let display = GlobalVariables.PAYMENT_MODE.filter(
                          f => f.value === row.payment_mode
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "customer_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "customer_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.customer_status === "A"
                          ? "Active"
                          : "Inactive";
                      }
                    }
                  ]}
                  keyId="hims_d_customer_id"
                  dataSource={{
                    data: this.state.customers
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerSetup;
