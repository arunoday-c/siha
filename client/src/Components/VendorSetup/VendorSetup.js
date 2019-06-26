import React, { Component } from "react";
import "./vendor_setup.css";
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
import swal from "sweetalert2";

//TODO
//Inactive Different API Call Integration

class VendorSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      vendors: [],
      countries: [],
      states: [],
      cities: [],
      vat_applicable: false,
      btn_txt: "ADD",
      hims_d_vendor_id: null
    };
    this.getAllVendors();
    this.getCountries();
  }

  resetSaveState() {
    this.setState({
      vendor_code: "",
      vendor_name: "",
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
      hims_d_vendor_id: null,
      openModal: false
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
  getAllVendors() {
    algaehApiCall({
      uri: "/vendor/getVendorMaster",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ vendors: response.data.records });
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

  addVendorMaster(e) {
    AlgaehValidation({
      querySelector: "data-validate='VendorDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let uri =
          this.state.hims_d_vendor_id === null
            ? "/vendor/addVendorMaster"
            : "/vendor/updateVendorMaster";
        let method = this.state.hims_d_vendor_id === null ? "POST" : "PUT";
        let success_msg =
          this.state.hims_d_vendor_id === null
            ? "Added Successfully"
            : "Updated Successfully";

        let sen_data = {
          hims_d_vendor_id: this.state.hims_d_vendor_id,
          vendor_code: this.state.vendor_code,
          vendor_name: this.state.vendor_name,
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
          vendor_status: "A"
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
              this.getAllVendors();
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

  editVendor(data, e) {
    this.setState({
      openModal: true,
      btn_txt: "Update",
      ...data
    });
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

  deleteVendor(data, e) {
    swal({
      title: "Delete Vendor " + data.vendor_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/vendor/deleteVendorMaster",
          module: "masterSettings",
          data: {
            hims_d_vendor_id: data.hims_d_vendor_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getAllVendors();
              this.resetSaveState();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
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
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="vendor_setup">
        <AlgaehModalPopUp
          events={{
            onClose: this.resetSaveState.bind(this)
          }}
          title="Add / Edit Vendor"
          openPopup={this.state.openModal}
        >
          <div className="popupInner">
            <div className="col-lg-12" style={{ minHeight: "60vh" }}>
              <div className="margin-top-15" data-validate="VendorDiv">
                <h6>Business Details</h6>
                <hr style={{ margin: 0 }} />
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "vendor_code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "vendor_code",
                      value: this.state.vendor_code,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        disabled:
                          this.state.hims_d_vendor_id === null ? false : true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "vendor_name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "vendor_name",
                      value: this.state.vendor_name,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      fieldName: "business_registration_no",
                      isImp: true
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
                  <AlagehFormGroup
                    div={{ className: "col-2" }}
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
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "email_id_1",
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
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "email_id_2",
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
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "website",
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
                  <AlagehFormGroup
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "address",
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
                  <AlagehAutoComplete
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "country",
                      isImp: true
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
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "state",
                      isImp: true
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
                    div={{ className: "col-3" }}
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
                    div={{ className: "col-2" }}
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
                </div>
                <h6 style={{ marginTop: 30 }}>Payment Details</h6>
                <hr style={{ margin: 0 }} />
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-2" }}
                    label={{
                      fieldName: "payment_terms",
                      isImp: true
                    }}
                    selector={{
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
                    div={{ className: "col-3" }}
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
                    div={{ className: "col-3" }}
                    label={{
                      fieldName: "bank_name",
                      isImp: true
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
                  <div className="col-2" style={{ marginTop: 21 }}>
                    <input
                      name="vat_applicable"
                      checked={this.state.vat_applicable}
                      type="checkbox"
                      style={{ marginRight: "5px" }}
                      onChange={this.changeChecks.bind(this)}
                    />
                    <label>VAT Applicable</label>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      fieldName: "vat_percentage",
                      isImp: this.state.vat_applicable
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "vat_percentage",
                      value: this.state.vat_percentage,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        min: 0,
                        max: 100,
                        type: "number",
                        disabled: !this.state.vat_applicable
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4">&nbsp;</div>
                <div className="col-lg-8">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.addVendorMaster.bind(this)}
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
              <h3 className="caption-subject">Vendors List</h3>
            </div>
            <div className="actions">
              <a
                className="btn btn-primary btn-circle active"
                onClick={() => {
                  this.setState({
                    openModal: true,
                    btn_txt: "ADD"
                  });
                }}
              >
                <i className="fas fa-plus" />
              </a>
            </div>
          </div>

          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="vendorGrid">
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
                                onClick={this.editVendor.bind(this, row)}
                              />
                              <i
                                className="fas fa-trash-alt"
                                onClick={this.deleteVendor.bind(this, row)}
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
                      fieldName: "vendor_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vendor_code" }} />
                      )
                    },
                    {
                      fieldName: "vendor_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vendor_name" }} />
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
                      fieldName: "email_id_1",
                      label: <AlgaehLabel label={{ fieldName: "email_id_1" }} />
                    },
                    {
                      fieldName: "contact_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_number" }} />
                      )
                    },
                    {
                      fieldName: "website",
                      label: <AlgaehLabel label={{ fieldName: "website" }} />
                    },

                    {
                      fieldName: "vendor_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vendor_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.vendor_status === "A"
                          ? "Active"
                          : "Inactive";
                      }
                    }
                  ]}
                  keyId="hims_d_vendor_id"
                  dataSource={{
                    data: this.state.vendors
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

export default VendorSetup;
