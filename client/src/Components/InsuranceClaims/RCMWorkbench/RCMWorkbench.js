import React, { Component } from "react";
import "./RCMWorkbench.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import FrontDesk from "../../../Search/FrontDesk.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../Wrapper/globalSearch";
import ValidateBills from "./ValidateBills/ValidateBills";

class RCMWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      claims: [],
      openClaims: false
    };
    this.dropDownHandler = this.dropDownHandler.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.getInvoicesForClaims = this.getInvoicesForClaims.bind(this);
    this.getInsuranceProviders();
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "insurance_provider_id":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            algaehApiCall({
              uri: "/insurance/getSubInsuraces",
              method: "GET",
              data: {
                insurance_provider_id: this.state.insurance_provider_id
              },
              onSuccess: response => {
                if (response.data.success) {
                  this.setState({
                    sub_ins_companies: response.data.records
                  });
                }
              },
              onError: error => {}
            });
          }
        );
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  getInvoicesForClaims() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        let send_data = {
          patient_id: this.state.patient_id ? this.state.patient_id : null,
          from_date: this.state.from_date ? this.state.from_date : null,
          to_date: this.state.to_date ? this.state.to_date : null,
          insurance_provider_id: this.state.insurance_provider_id
            ? this.state.insurance_provider_id
            : null,
          sub_insurance_id: this.state.sub_insurance_id
            ? this.state.sub_insurance_id
            : null
        };

        AlgaehLoader({ show: true });

        algaehApiCall({
          uri: "/invoiceGeneration/getInvoicesForClaims",
          method: "GET",
          data: send_data,
          onSuccess: response => {
            this.setState({
              claims: response.data.records
            });
            AlgaehLoader({ show: false });
          },
          onError: error => {
            AlgaehLoader({ show: false });
          }
        });
      }
    });
  }

  getInsuranceProviders() {
    algaehApiCall({
      uri: "/insurance/getInsuranceProviders",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            insurance_providers: response.data.records
          });
        }
      },
      onError: error => {}
    });
  }

  clearSearch() {
    this.setState({
      from_date: null,
      to_date: null,
      patient_code: null,
      insurance_provider_id: null,
      sub_insurance_id: null,
      patient_id: null,
      claims: []
    });
  }

  getInvoices() {}

  patientSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: FrontDesk
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState({
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id
        });
      }
    });
  }

  handleClose() {
    this.setState({
      openClaims: false
    });
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <ValidateBills
          data={this.state.sendProps}
          closeModal={this.handleClose.bind(this)}
          openPopup={this.state.openClaims}
        />
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "RCM Workbench", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "RCM Workbench",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            }
          ]}
          // soptlightSearch={{
          //   label: (
          //     <AlgaehLabel
          //       label={{ forceLabel: "Claim ID", returnText: true }}
          //     />
          //   ),
          //   value: this.state.invoice_number,
          //   selectValue: "invoice_number",
          //   events: {
          //     onChange: this.getCtrlCode.bind(this)
          //   },
          //   jsonFile: {
          //     fileName: "spotlightSearch",
          //     fieldName: "Invoice.InvoiceGen"
          //   },
          //   searchName: "InvoiceGen"
          // }}
        />

        <div
          className="portlet portlet-bordered box-shadow-normal margin-bottom-15"
          style={{ marginTop: 90 }}
        >
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{ isImp: false, forceLabel: "Company Name" }}
              selector={{
                name: "insurance_provider_id",
                className: "select-fld",
                value: this.state.insurance_provider_id,
                dataSource: {
                  textField: "insurance_provider_name",
                  valueField: "hims_d_insurance_provider_id",
                  data: this.state.insurance_providers
                },
                onChange: this.dropDownHandler,
                onClear: () => {
                  this.setState({
                    insurance_provider_id: null,
                    sub_insurance_id: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{ isImp: false, forceLabel: "Sub Company Name" }}
              selector={{
                name: "sub_insurance_id",
                className: "select-fld",
                value: this.state.sub_insurance_id,
                dataSource: {
                  textField: "insurance_sub_name",
                  valueField: "hims_d_insurance_sub_id",
                  data: this.state.sub_ins_companies
                },
                onChange: this.dropDownHandler,
                onClear: () => {
                  this.setState({
                    sub_insurance_id: null
                  });
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Patient Code",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "patient_code",
                others: {
                  disabled: true
                },
                value: this.state.patient_code,
                events: {
                  // onChange: this.texthandle.bind(this)
                }
              }}
            />

            <div className="col-lg-1 margin-top-15">
              <i
                onClick={this.patientSearch.bind(this)}
                className="fas fa-search"
                style={{
                  cursor: "pointer"
                }}
              />
            </div>

            <AlgaehDateHandler
              div={{ className: "col-lg-2" }}
              label={{ isImp: false, forceLabel: "From Date" }}
              textBox={{
                className: "txt-fld",
                name: "from_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    from_date: selDate
                  });
                }
              }}
              value={this.state.from_date}
            />

            <AlgaehDateHandler
              div={{ className: "col-lg-2" }}
              label={{ isImp: false, forceLabel: "To Date" }}
              textBox={{
                className: "txt-fld",
                name: "to_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    to_date: selDate
                  });
                }
              }}
              value={this.state.to_date}
            />
            <div className="col-lg-1">
              <button
                onClick={this.clearSearch}
                className="btn btn-default"
                style={{ marginTop: 21 }}
              >
                Clear
              </button>
            </div>
            <div className="col-lg-1">
              <button
                onClick={this.getInvoicesForClaims}
                className="btn btn-primary"
                style={{ marginTop: 21 }}
              >
                Load Claims
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="row">
                <div className="col-lg-12" id="rcm_desktop_cntr">
                  <AlgaehDataGrid
                    id="rcm_desktop"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <i
                              onClick={() => {
                                this.setState({
                                  openClaims: true,
                                  sendProps: row
                                });
                              }}
                              className="fas fa-eye"
                            />
                          );
                        },
                        others: {
                          maxWidth: 55,
                          fixed: "left"
                        }
                      },
                      {
                        fieldName: "invoice_number",
                        label: <AlgaehLabel label={{ forceLabel: "ClaimID" }} />
                      },

                      {
                        fieldName: "insurance_provider_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Ins. Company" }} />
                        )
                      },
                      {
                        fieldName: "network_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Policy Group" }} />
                        )
                      },
                      {
                        fieldName: "network_type",
                        label: <AlgaehLabel label={{ forceLabel: "Plan" }} />
                      },
                      {
                        fieldName: "bill_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Bill Date" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                        )
                      },
                      {
                        fieldName: "patient_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "submission_ammount",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Submit Amt."
                            }}
                          />
                        )
                      },
                      {
                        fieldName: "submission_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Submit Date" }} />
                        )
                      },

                      {
                        fieldName: "remittance_ammount.",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Remit Amt." }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "remittance_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Remit Date" }} />
                        ),
                        disabled: true
                      },

                      {
                        fieldName: "denial_ammount.",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Denial Amt." }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "receipt_status",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Recipt Status" }}
                          />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.claims
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    // events={{
                    //   onDelete: deletePosDetail.bind(this, this, context),
                    //   onEdit: row => {},
                    //   onDone: updatePosDetail.bind(this, this)
                    // }}
                    // onRowSelect={row => {
                    //   getItemLocationStock(this, row);
                    // }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel
                  label={{
                    forceLabel: "Validate",
                    returnText: true
                  }}
                />
              </button>

              <button type="button" className="btn btn-default">
                <AlgaehLabel
                  label={{
                    forceLabel: "Post",
                    returnText: true
                  }}
                />
              </button>

              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Re-Submit",
                    returnText: true
                  }}
                />
              </button>

              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Submit",
                    returnText: true
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RCMWorkbench;
