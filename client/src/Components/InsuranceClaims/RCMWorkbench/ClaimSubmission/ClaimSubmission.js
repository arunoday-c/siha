import React, { Component } from "react";
import "./ClaimSubmission.css";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import js2xml from "js2xmlparser";

var obj = {
  "@": {
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:noNamespaceSchemaLocation":
      "http://www.eclaimlinks.ae/DataDictionary/CommonTypes/DataDictionary.xsd"
  },
  Header: {
    SenderID: "MF3222",
    ReceiverID: "C019",
    TransactionDate: "01-12-2018 13:33",
    RecordCount: "1",
    DispositionFlag: "TEST"
  },
  Claim: {
    ID: "OPB0002596",
    MemberID: "097110040110646901",
    PayerID: "A012",
    ProviderID: "MF3222",
    EmiratesIDNumber: "784-1982-3530290-2",
    Gross: "28.60",
    PatientShare: "0.00",
    Net: "28.60",
    Encounter: {
      FacilityID: "MF3222",
      Type: "1",
      PatientID: "NH001044",
      Start: "04-02-2018 00:00",
      End: "04-02-2018 00:00",
      StartType: "1",
      EndType: "1"
    },
    Diagnosis: [
      {
        Type: "ReasonForVisit",
        Code: "M54.5"
      },
      {
        Type: "ReasonForVisit",
        Code: "K29.70"
      }
    ],
    Activity: {
      ID: "1",
      Start: "04-02-2018 00:00",
      Type: "3",
      Code: "81001",
      Quantity: "1",
      Net: "28.60",
      OrderingClinician: "GD5799",
      Clinician: "GD5799",
      PriorAuthorizationID: ""
    }
  }
};

class ClaimSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en"
    };
    this.baseState = this.state;
  }

  submitClaims() {
    console.log("State: ", this.state);

    console.log(
      js2xml.parse("Claim.Submission", obj, {
        declaration: { encoding: "iso-8859-1", version: "1.1" }
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      submit_invoices: nextProps.data !== undefined ? nextProps.data : []
    });
  }

  componentWillUnmount() {
    this.setState(this.baseState);
  }

  downloadXmlHandler() {
    let _win = window;
    _win.open(
      "data:text/plain;charset=utf-8," +
        "<?xml version='1.0' encoding='iso-8859-1'?>"
    );
    _win.close();
  }

  downloadXml(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  loadInvoiceDetails(row) {
    algaehApiCall({
      uri: "/invoiceGeneration/getPatientIcdForInvoice",
      data: {
        invoice_header_id: row.hims_f_invoice_header_id
      },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            icds: res.data.records
          });
        }
      },
      onFailure: err => {}
    });

    this.setState({
      invoice_details: row.invoiceDetails
    });
  }

  render() {
    return (
      <AlgaehModalPopUp
        title="Claim Submission"
        events={{
          onClose: this.props.closeSubmissionModal
        }}
        openPopup={this.props.claimSubmission}
      >
        <div className="popupInner">
          <div className="popRightDiv">
            <AlgaehDataGrid
              id="claim-submit-grid"
              columns={[
                // {
                //   fieldName: "claim_validated",
                //   label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                //   displayTemplate: row => {
                //     return (
                //       <span>
                //         {row.claim_validated === "V"
                //           ? "Validated"
                //           : row.claim_validated === "E"
                //           ? "Error"
                //           : row.claim_validated === "X"
                //           ? "XML Generated"
                //           : row.claim_validated === "P"
                //           ? "Pending"
                //           : "----"}
                //       </span>
                //     );
                //   }
                // },
                {
                  fieldName: "patient_name",
                  label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                },
                {
                  fieldName: "invoice_number",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Invoice Number" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span
                        onClick={this.loadInvoiceDetails.bind(this, row)}
                        className="pat-code"
                      >
                        {row.invoice_number}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <span
                        onClick={this.loadInvoiceDetails.bind(this, row)}
                        className="pat-code"
                      >
                        {row.invoice_number}
                      </span>
                    );
                  },
                  className: drow => {
                    return "greenCell";
                  }
                },
                {
                  fieldName: "visit_code",
                  label: <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                },
                {
                  fieldName: "gross_amount",
                  label: <AlgaehLabel label={{ forceLabel: "Gross Amount" }} />
                },
                {
                  fieldName: "discount_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Discount Amount" }} />
                  )
                },
                {
                  fieldName: "patient_resp",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Patient Responsibility" }}
                    />
                  )
                },
                {
                  fieldName: "patient_tax",
                  label: <AlgaehLabel label={{ forceLabel: "Patient Tax" }} />
                },
                {
                  fieldName: "patient_payable",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Patient Payable" }} />
                  )
                },
                {
                  fieldName: "company_resp",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Company Responsibility" }}
                    />
                  )
                },
                {
                  fieldName: "company_tax",
                  label: <AlgaehLabel label={{ forceLabel: "Company Tax" }} />
                },
                {
                  fieldName: "company_payable",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Company Payable" }} />
                  )
                }
              ]}
              keyId=""
              dataSource={{
                data: this.state.submit_invoices
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 5 }}
              events={{
                onDelete: row => {},
                onEdit: row => {},
                onDone: row => {}
              }}
            />

            <div className="row margin-top-15">
              <div className="col-lg-8">
                {/*             
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Service Type",
                    isImp: true
                  }}
                  selector={{
                    name: "hims_d_service_type_id",
                    className: "select-fld",
                    value: this.state.hims_d_service_type_id,
                    dataSource: {
                      textField: "service_type",
                      valueField: "hims_d_service_type_id",
                      data: this.state.service_types
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        hims_d_service_type_id: null,
                        hims_d_services_id: null
                      });
                    },
                    others: {
                      //tabIndex: "4"
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Service",
                    isImp: true
                  }}
                  selector={{
                    name: "hims_d_services_id",
                    className: "select-fld",
                    value: this.state.hims_d_services_id,
                    dataSource: {
                      textField: "service_name",
                      valueField: "hims_d_services_id",
                      data: this.state.services
                    },
                    onChange: this.dropDownHandler.bind(this),
                    onClear: () => {
                      this.setState({
                        hims_d_services_id: null
                      });
                    },
                    others: {
                      //tabIndex: "4"
                    }
                  }}
                />

                <div className="col-lg-3 margin-top-15">
                  <button
                    onClick={this.addServiceToInvoice.bind(this)}
                    className="btn btn-primary"
                  >
                    ADD
                  </button>
                </div>
              </div>
             */}
                <AlgaehDataGrid
                  id="validate-bills-grid"
                  columns={[
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "cpt_code",
                      label: <AlgaehLabel label={{ forceLabel: "CPT Code" }} />,
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            textBox={{
                              value: row.cpt_code,
                              className: "txt-fld",
                              name: "cpt_code",
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              }
                              // others: {
                              //   errormessage: "Description - cannot be blank",
                              //   required: true
                              // }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "service_type_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Code" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "service_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Type" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Name" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "gross_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Gross Amount" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "discount_amount",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Discount Amount" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "patient_resp",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Patient Responsibility" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "patient_tax",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Tax" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "patient_payable",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Patient Payable" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "company_resp",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Company Responsibility" }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "company_tax",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Company Tax" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "company_payable",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Company Payable" }}
                        />
                      ),
                      disabled: true
                    }
                  ]}
                  keyId="id"
                  dataSource={{
                    data: this.state.invoice_details
                    // data: this.state.invoice_details
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>

              <div className="col-lg-4">
                <AlgaehDataGrid
                  id="validate-bills-grid"
                  columns={[
                    // {
                    //   fieldName: "actions",
                    //   label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                    //   displayTemplate: row => {
                    //     return (
                    //       <span
                    //       //onClick={this.deleteICDfromInvoice.bind(this, row)}
                    //       >
                    //         <i className="fas fa-trash-alt" />
                    //       </span>
                    //     );
                    //   },
                    //   editorTemplate: row => {
                    //     return (
                    //       <span
                    //       // onClick={this.deleteICDfromInvoice.bind(this, row)}
                    //       >
                    //         <i className="fas fa-trash-alt" />
                    //       </span>
                    //     );
                    //   }
                    // },
                    {
                      fieldName: "icd_type",
                      label: <AlgaehLabel label={{ forceLabel: "Type" }} />
                    },
                    {
                      fieldName: "icd_code",
                      label: <AlgaehLabel label={{ forceLabel: "Code" }} />
                    },
                    {
                      fieldName: "icd_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Description" }} />
                      )
                    }
                  ]}
                  keyId="id"
                  dataSource={{
                    data: this.state.icds
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-12">
                <button
                  onClick={this.submitClaims.bind(this)}
                  className="btn btn-primary"
                >
                  Submit
                </button>

                <button
                  onClick={this.downloadXml.bind(
                    this,
                    "Test.xml",
                    js2xml.parse("Claim.Submission", obj, {
                      declaration: { encoding: "iso-8859-1", version: "1.1" }
                    })
                  )}
                  className="btn btn-default"
                >
                  Generate Test XML
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ClaimSubmission;
