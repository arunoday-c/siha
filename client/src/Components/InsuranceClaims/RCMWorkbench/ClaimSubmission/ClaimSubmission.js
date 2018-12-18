import React, { Component } from "react";
import "./ClaimSubmission.css";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

class ClaimSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en"
    };
    this.baseState = this.state;
  }

  submitClaims() {}

  componentWillReceiveProps(nextProps) {
    //console.log("Data", nextProps.data !== undefined ? nextProps.data : "wait");
    this.setState({
      submit_invoices: nextProps.data !== undefined ? nextProps.data : []
    });
  }

  componentWillUnmount() {
    this.setState(this.baseState);
  }

  downloadXmlHandler() {
    debugger;
    let _win = window;
    _win.open(
      "data:text/xml;charset=ISO-8859-1," +
        "<?xml version='1.0' encoding='iso-8859-1'?> <Claim.Submission xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xsi:noNamespaceSchemaLocation='http://www.eclaimlinks.ae/DataDictionary/CommonTypes/DataDictionary.xsd'> <Header> <SenderID>MF3222</SenderID> <ReceiverID>C019</ReceiverID> <TransactionDate>01-12-2018 13:33</TransactionDate> <RecordCount>1</RecordCount> <DispositionFlag>TEST</DispositionFlag> </Header> <Claim> <ID>OPB0002596</ID> <MemberID>097110040110646901</MemberID> <PayerID>A012</PayerID> <ProviderID>MF3222</ProviderID> <EmiratesIDNumber>784-1982-3530290-2</EmiratesIDNumber> <Gross>28.60</Gross> <PatientShare>0.00</PatientShare> <Net>28.60</Net> <Encounter> <FacilityID>MF3222</FacilityID> <Type>1</Type> <PatientID>NH001044</PatientID> <Start>04-02-2018 00:00</Start> <End>04-02-2018 00:00</End> <StartType>1</StartType> <EndType>1</EndType> </Encounter> <Diagnosis> <Type>ReasonForVisit</Type> <Code>M54.5</Code> </Diagnosis> <Diagnosis> <Type>ReasonForVisit</Type> <Code>K29.70</Code> </Diagnosis> <Activity> <ID>1</ID> <Start>04-02-2018 00:00</Start> <Type>3</Type> <Code>81001</Code> <Quantity>1</Quantity> <Net>28.60</Net> <OrderingClinician>GD5799</OrderingClinician> <Clinician>GD5799</Clinician> <PriorAuthorizationID></PriorAuthorizationID> </Activity> </Claim> </Claim.Submission>"
    );
    _win.close();
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
        <div className="col-lg-12 popupInner">
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
                label: <AlgaehLabel label={{ forceLabel: "Invoice Number" }} />,
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
                label: <AlgaehLabel label={{ forceLabel: "Discount Amount" }} />
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
                label: <AlgaehLabel label={{ forceLabel: "Patient Payable" }} />
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
                label: <AlgaehLabel label={{ forceLabel: "Company Payable" }} />
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
                      <AlgaehLabel label={{ forceLabel: "Discount Amount" }} />
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
                      <AlgaehLabel label={{ forceLabel: "Patient Payable" }} />
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
                      <AlgaehLabel label={{ forceLabel: "Company Payable" }} />
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
                    label: <AlgaehLabel label={{ forceLabel: "Description" }} />
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
        <div className="popupFooter">
          <button
            // onClick={this.submitClaims.bind(this)}
            className="btn btn-primary"
          >
            Submit
          </button>

          <button
            //onClick={this.submitClaims.bind(this)}
            className="btn btn-primary"
          >
            <a onClick={this.downloadXmlHandler.bind(this)}>Generate XML</a>
          </button>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ClaimSubmission;
