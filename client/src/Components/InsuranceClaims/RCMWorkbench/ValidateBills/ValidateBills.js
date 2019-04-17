import React, { PureComponent } from "react";
import "./ValidateBills.css";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
  //AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Dropzone from "react-dropzone";
import noImage from "../../../../assets/images/images.webp";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";
//import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

class ValidateBills extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      invoice_details: []
    };
  }

  validateInvoice() {
    algaehApiCall({
      uri: "/invoiceGeneration/updateClaimValidatedStatus",
      data: {
        hims_f_invoice_header_id: this.state.invoices.hims_f_invoice_header_id,
        claim_validated: "V"
      },
      method: "PUT",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Invoice Validated Successfully",
            type: "success"
          });

          document.getElementById("load-claims").click();
        }
      },
      onError: error => {
        swalMessage({
          title: error.name,
          type: "error"
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    nextProps.data !== undefined
      ? this.setState(
          {
            invoices: nextProps.data
          },
          () => {
            this.getInvoiceICDs();
          }
        )
      : null;
  }

  addICDtoInvoice() {
    let invoice = this.state.invoices;

    this.state.icd_code !== null
      ? algaehApiCall({
          uri: "/invoiceGeneration/addInvoiceIcd",
          data: {
            invoice_header_id: invoice.hims_f_invoice_header_id,
            patient_id: invoice.patient_id,
            episode_id: invoice.episode_id,
            daignosis_id: this.state.hims_d_icd_id,
            diagnosis_type: "P",
            final_daignosis: "Y"
          },
          method: "POST",
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.setState({
                icd_code: null,
                hims_d_icd_id: null
              });
              this.getInvoiceICDs();
            }
          },
          onError: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        })
      : swalMessage({
          title: "Please select an ICD",
          type: "warning"
        });
  }

  //TODO
  // Reload ICD for invoice after deletion

  deleteICDfromInvoice(data) {
    swal({
      title: "Are you sure you want to delete the ICD from the Invoice?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/invoiceGeneration/deleteInvoiceIcd",
          data: {
            hims_f_invoice_icd_id: data.hims_f_invoice_icd_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getInvoiceICDs();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "warning"
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

  icdSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Diagnosis.IcdCodes
      },
      searchName: "IcdCodes",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState({
          icd_code: row.icd_code,
          hims_d_icd_id: row.hims_d_icd_id
        });
      }
    });
  }

  cptSearch(row, e) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Services.CptCodes
      },
      searchName: "CptCodes",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: data => {
        // this.setState({
        //   cpt_code: row.hims_d_cpt_code_id,
        //   cpt_code_data: row.cpt_code
        // });

        row["cpt_code"] = data.cpt_code;
        row.update();
      }
    });
  }

  getInvoiceICDs() {
    let id = this.state.invoices.hims_f_invoice_header_id;

    algaehApiCall({
      uri: "/invoiceGeneration/getPatientIcdForInvoice",
      data: { invoice_header_id: id },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            icds: res.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: "Sorry for the inconvenience , Please reload the page",
          type: "error"
        });
      }
    });
  }

  // getServices(id) {
  //   algaehApiCall({
  //     uri: "/serviceType/getService",
  //     module: "masterSettings",
  //     method: "GET",
  //     data: { service_type_id: id },
  //     onSuccess: res => {
  //       if (res.data.success) {
  //         this.setState({
  //           services: res.data.records
  //         });
  //       }
  //     },
  //     onError: error => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error"
  //       });
  //     }
  //   });
  // }

  // getServiceType() {
  //   algaehApiCall({
  //     uri: "/serviceType",
  //     module: "masterSettings",
  //     method: "GET",
  //     onSuccess: res => {
  //       if (res.data.success) {
  //         this.setState({
  //           service_types: res.data.records
  //         });
  //       }
  //     },
  //     onError: error => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error"
  //       });
  //     }
  //   });
  // }

  // dropDownHandler(value) {
  //   switch (value.name) {
  //     case "hims_d_service_type_id":
  //       this.setState(
  //         {
  //           [value.name]: value.value
  //         },
  //         () => {
  //           this.getServices(this.state.hims_d_service_type_id);
  //         }
  //       );
  //       break;
  //     default:
  //       this.setState({
  //         [value.name]: value.value
  //       });
  //       break;
  //   }
  // }

  // addServiceToInvoice() {
  //Add Service here
  // }

  updateInvoiceDetail(data) {
    algaehApiCall({
      uri: "/invoiceGeneration/updateInvoiceDetails",
      data: {
        hims_f_invoice_details_id: data.hims_f_invoice_details_id,
        cpt_code: data.cpt_code
      },
      method: "PUT",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated",
            type: "success"
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: "Cannot update, Please try again",
          type: "error"
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
    let invoices =
      this.state.invoices !== undefined ? [this.state.invoices] : [];
    let invoice_details =
      this.state.invoices !== undefined
        ? this.state.invoices.invoiceDetails
        : [];

    return (
      <AlgaehModalPopUp
        title="Claim Validation"
        events={{
          onClose: this.props.closeModal
        }}
        openPopup={this.props.openPopup}
      >
        <div className="popupInner ClaimValidationPopup">
          {/* {JSON.stringify(this.props.data)} */}
          <div
            className="popRightDiv"
            style={{ paddingTop: 15, paddingBottom: 15 }}
          >
            <div className="row ">
              <div className="col-lg-8">
                <div id="claimGrid_cntr">
                  <AlgaehDataGrid
                    id="validate-bills-grid"
                    columns={[
                      // {
                      //   fieldName: "actions",
                      //   label: "Select",
                      //   displayTemplate: row => {
                      //     return (
                      //       <div className="customCheckbox">
                      //         <input
                      //           type="checkbox"
                      //           onChange={() => {
                      //             this.setState({
                      //               invoice_details: row.invoiceDetails
                      //             });
                      //           }}
                      //         />
                      //       </div>
                      //     );
                      //   }
                      // },
                      {
                        fieldName: "claim_validated",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.claim_validated === "V"
                                ? "Validated"
                                : row.claim_validated === "E"
                                ? "Error"
                                : row.claim_validated === "X"
                                ? "XML Generated"
                                : row.claim_validated === "P"
                                ? "Pending"
                                : "----"}
                            </span>
                          );
                        }
                      },
                      // {
                      //   fieldName: "status",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "Bill Status" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return <span>Paid</span>;
                      //   }
                      // },
                      // {
                      //   fieldName: "claim_status",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "Claim Status" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return <span>Paid</span>;
                      //   }
                      // },
                      {
                        fieldName: "patient_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                        )
                      },
                      {
                        fieldName: "invoice_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Invoice Number" }}
                          />
                        )
                      },
                      {
                        fieldName: "visit_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                        )
                      },
                      {
                        fieldName: "gross_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Gross Amount" }} />
                        )
                      },
                      {
                        fieldName: "discount_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Discount Amount" }}
                          />
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
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Tax" }} />
                        )
                      },
                      {
                        fieldName: "patient_payable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Patient Payable" }}
                          />
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
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Company Tax" }} />
                        )
                      },
                      {
                        fieldName: "company_payable",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Company Payable" }}
                          />
                        )
                      }
                    ]}
                    keyId="id"
                    dataSource={{
                      data: invoices
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
                <div id="invoiceDetailGrid_Cntr">
                  <AlgaehDataGrid
                    id="validate-bills-grid"
                    columns={[
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "cpt_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "CPT Code" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col  margin-top-15" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "cpt_code",
                                  others: {
                                    disabled: true
                                  },
                                  value: row.cpt_code,
                                  events: {
                                    onChange: this.changeGridEditors.bind(this)
                                  }
                                }}
                              />

                              <div
                                className="col-lg-1"
                                style={{ paddingTop: "40px" }}
                              >
                                <i
                                  name="cpt_code"
                                  onClick={this.cptSearch.bind(this, row)}
                                  className="fas fa-search"
                                  style={{
                                    marginLeft: "-75%",
                                    cursor: "pointer"
                                  }}
                                />
                              </div>
                            </div>
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
                      data: invoice_details
                      // data: this.state.invoice_details
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: row => {},
                      onEdit: row => {},
                      onDone: this.updateInvoiceDetail.bind(this)
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-6  margin-top-15">
                    <div className="image-drop-area">
                      <Dropzone
                        onDrop={() => {}}
                        id="insurance"
                        className="dropzone"
                        accept="image/*"
                        multiple={false}
                        name="image"
                      >
                        <img
                          src={this.state.img}
                          alt="Insurance Image"
                          onError={e => {
                            e.target.src = noImage;
                          }}
                        />

                        <div className="attach-design text-center">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Photo"
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: this.state.percent + "%",
                            height: 3,
                            backgroundColor: "#E1AE54"
                          }}
                        />
                      </Dropzone>
                    </div>
                  </div>
                  <div className="col-lg-6 margin-top-15">
                    <div className="image-drop-area">
                      <Dropzone
                        onDrop={() => {}}
                        id="insurance"
                        className="dropzone"
                        accept="image/*"
                        multiple={false}
                        name="image"
                      >
                        <img
                          src={this.state.img}
                          alt="Report Image"
                          onError={e => {
                            e.target.src = noImage;
                          }}
                        />

                        <div className="attach-design text-center">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Photo"
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: this.state.percent + "%",
                            height: 3,
                            backgroundColor: "#E1AE54"
                          }}
                        />
                      </Dropzone>
                    </div>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col  margin-top-15 " }}
                    label={{
                      forceLabel: "ICD Code",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "icd_code",
                      others: {
                        disabled: true
                      },
                      value: this.state.icd_code,
                      events: {
                        // onChange: this.texthandle.bind(this)
                      }
                    }}
                  />

                  <div
                    className="col-2"
                    style={{ padding: 0, paddingTop: "40px" }}
                  >
                    <i
                      onClick={this.icdSearch.bind(this)}
                      className="fas fa-search"
                      style={{
                        cursor: "pointer"
                      }}
                    />
                  </div>

                  <div className="col-3">
                    <button
                      onClick={this.addICDtoInvoice.bind(this)}
                      className="btn btn-primary margin-top-15"
                      style={{ marginTop: 36 }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="col-12 margin-top-15" id="icd_bill_cntr">
                    <AlgaehDataGrid
                      id="validate-bills-grid"
                      columns={[
                        {
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span
                                onClick={this.deleteICDfromInvoice.bind(
                                  this,
                                  row
                                )}
                              >
                                <i className="fas fa-trash-alt" />
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span
                                onClick={this.deleteICDfromInvoice.bind(
                                  this,
                                  row
                                )}
                              >
                                <i className="fas fa-trash-alt" />
                              </span>
                            );
                          }
                        },
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
                            <AlgaehLabel
                              label={{ forceLabel: "Description" }}
                            />
                          )
                        }
                      ]}
                      keyId="id"
                      dataSource={{
                        data: this.state.icds
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 popupFooter">
          <button
            onClick={this.validateInvoice.bind(this)}
            className="btn btn-primary"
          >
            VALIDATE
          </button>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ValidateBills;
