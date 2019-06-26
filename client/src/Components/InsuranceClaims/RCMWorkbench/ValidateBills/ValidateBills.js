import React, { PureComponent } from "react";
import "./ValidateBills.css";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";
import AlgaehFileUploader from "../../../Wrapper/algaehFileUpload";

const UcafEditor = React.lazy(() => import("../../../ucafEditors/ucaf"));
const DcafEditor = React.lazy(() => import("../../../ucafEditors/dcaf"));
const OcafEditor = React.lazy(() => import("../../../ucafEditors/ocaf"));

class ValidateBills extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      invoice_details: [],
      invoices: [],
      openUCAF: false,
      UCAFData: undefined,
      openDCAF: false,
      DCAFData: undefined,
      openOCAF: false,
      OCAFData: []
    };
  }

  openUCAFReport(data, e) {
    let that = this;
    algaehApiCall({
      uri: "/ucaf/getPatientUCAF",
      method: "GET",
      data: {
        patient_id: this.state.invoices.patient_id,
        visit_id: this.state.invoices.visit_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({ openUCAF: true, UCAFData: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "warning"
        });
      }
    });
  }

  openDCAFReport(data, e) {
    let that = this;
    algaehApiCall({
      uri: "/dcaf/getPatientDCAF",
      method: "GET",
      data: {
        patient_id: this.state.invoices.patient_id,
        visit_id: this.state.invoices.visit_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({ openDCAF: true, DCAFData: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "warning"
        });
      }
    });
  }

  openOCAFReport(data, e) {
    let that = this;
    algaehApiCall({
      uri: "/ucaf/getPatientUCAF",
      method: "GET",
      data: {
        patient_id: this.state.invoices.patient_id,
        visit_id: this.state.invoices.visit_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({ openOCAF: true, OCAFData: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "warning"
        });
      }
    });
  }

  validateInvoice() {
    algaehApiCall({
      uri: "/invoiceGeneration/updateClaimValidatedStatus",
      data: {
        hims_f_invoice_header_id: this.state.invoices.hims_f_invoice_header_id,
        claim_validated: "V"
      },
      module: "insurance",
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
    if (nextProps.data !== undefined) {
      this.setState(
        {
          invoices: nextProps.data
        },
        () => {
          this.getInvoiceICDs();
          this.getSubDepts();
        }
      );
    }
  }

  getSubDepts() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      module: "masterSettings",
      data: {
        sub_department_status: "A"
      },
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            sub_depts: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  generatePharacyCreditInvoiceReport() {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "pharmacyCreditInvoice",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value:
                this.state.invoices.length !== 0
                  ? this.state.invoices.patient_id
                  : null
            },
            {
              name: "visit_id",
              value:
                this.state.invoices.length !== 0
                  ? this.state.invoices.visit_id
                  : null
            },
            {
              name: "visit_date",
              value: null
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = "";
      }
    });
  }
  generateReport(rpt_name, rpt_desc) {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: rpt_name,
          reportParams: [
            {
              name: "hims_d_patient_id",
              value:
                this.state.invoices.length !== 0
                  ? this.state.invoices.patient_id
                  : null
            },
            {
              name: "visit_id",
              value:
                this.state.invoices.length !== 0
                  ? this.state.invoices.visit_id
                  : null
            },
            {
              name: "visit_date",
              value: null
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = rpt_desc;
      }
    });
  }

  imageDetails(type) {
    // if (context !== undefined) {
    //   context.updateState({
    //     ...this.state,
    //     [type]: this[type]
    //   });
    // }
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
          module: "insurance",
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
      confirmButtonText: "Yes",
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
          module: "insurance",
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
      module: "insurance",
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

  renderDCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openDCAF}
        title="DCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openDCAF: false });
          }
        }}
      >
        <DcafEditor dataProps={this.state.DCAFData} />
      </AlgaehModalPopUp>
    );
  }
  renderOCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openOCAF}
        title="OCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openOCAF: false });
          }
        }}
      >
        <OcafEditor dataProps={this.state.OCAFData} />
      </AlgaehModalPopUp>
    );
  }
  renderUCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openUCAF}
        title="UCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openUCAF: false });
          }
        }}
      >
        <UcafEditor dataProps={this.state.UCAFData} />
      </AlgaehModalPopUp>
    );
  }

  updateInvoiceDetail(data) {
    algaehApiCall({
      uri: "/invoiceGeneration/updateInvoiceDetails",
      data: {
        hims_f_invoice_details_id: data.hims_f_invoice_details_id,
        cpt_code: data.cpt_code
      },
      module: "insurance",
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

    let claim_validated =
      this.state.invoices !== undefined
        ? this.state.invoices.claim_validated
        : null;
    let invoice_details =
      this.state.invoices !== undefined
        ? this.state.invoices.invoiceDetails
        : [];

    const card_number =
      this.state.invoices !== undefined
        ? this.state.invoices.card_number
        : null;
    return (
      <AlgaehModalPopUp
        title="Claim Validation"
        events={{
          onClose: this.props.closeModal
        }}
        openPopup={this.props.openPopup}
      >
        <div className="popupInner">
          {/* {JSON.stringify(this.props.data)} */}
          <div className="popRightDiv">
            <div className="row">
              <div className="col-8">
                <div id="ClaimGrid_Cntr">
                  <AlgaehDataGrid
                    id="ClaimGrid"
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
                        fieldName: "visit_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                        )
                      },
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
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onDelete: row => {},
                      onEdit: row => {},
                      onDone: row => {}
                    }}
                  />
                </div>
                <div id="invoiceDetailGrid_Cntr">
                  <AlgaehDataGrid
                    id="invoiceDetailGrid"
                    columns={[
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
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
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
                    isEditable={claim_validated === "P" ? true : false}
                    actions={{ allowDelete: false }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: row => {},
                      onEdit: row => {},
                      onDone: this.updateInvoiceDetail.bind(this)
                    }}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="row">
                  <div className="col-12  margin-top-15">
                    <div className="row">
                      <div className="col-lg-6 insurCrdImg">
                        <AlgaehFileUploader
                          ref={patInsuranceFrontImg => {
                            this.patInsuranceFrontImg = patInsuranceFrontImg;
                          }}
                          noImage="insurance-card-front"
                          name="patInsuranceFrontImg"
                          accept="image/*"
                          textAltMessage="Front Side"
                          serviceParameters={{
                            uniqueID: card_number + "_front",
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              "patInsuranceFrontImg"
                            )
                          }}
                          renderPrevState={this.state.patInsuranceFrontImg}
                          // forceRefresh={this.state.forceRefresh}
                        />
                      </div>

                      <div className="col-lg-6 insurCrdImg">
                        <AlgaehFileUploader
                          ref={patInsuranceBackImg => {
                            this.patInsuranceBackImg = patInsuranceBackImg;
                          }}
                          noImage="insurance-card-back"
                          name="patInsuranceBackImg"
                          accept="image/*"
                          textAltMessage="Back Side"
                          serviceParameters={{
                            uniqueID: card_number + "_back",
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              "patInsuranceBackImg"
                            )
                          }}
                          renderPrevState={this.state.patInsuranceBackImg}
                          forceRefresh={this.state.forceRefresh}
                        />
                        <div />
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-12 margin-top-15">
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
                  </div> */}
                  {claim_validated === "P" ? (
                    <div className="row">
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
                        style={{ padding: 0, paddingTop: "39px" }}
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
                          style={{ marginTop: 32 }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="col-12 margin-top-15" id="icd_bill_cntr">
                    <AlgaehDataGrid
                      id="icd_bill_Grid"
                      columns={[
                        {
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  style={{
                                    pointerEvents:
                                      claim_validated === "P" ? "" : "none",
                                    opacity:
                                      claim_validated === "P" ? "" : "0.1"
                                  }}
                                  className="fas fa-trash-alt"
                                  onClick={this.deleteICDfromInvoice.bind(
                                    this,
                                    row
                                  )}
                                />
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
            disabled={
              this.state.invoices.claim_validated === "V" ||
              this.state.invoices.claim_validated === "X"
                ? true
                : false
            }
          >
            VALIDATE
          </button>

          <button
            onClick={this.generateReport.bind(
              this,
              "cashInvoice",
              "Cash Invoice"
            )}
            className="btn btn-default"
          >
            Cash Invoice
          </button>

          <button
            className="btn btn-default"
            onClick={this.generateReport.bind(
              this,
              "creditInvoice",
              "Credit Invoice"
            )}
          >
            Credit Invoice
          </button>
          {/* <button
            className="btn btn-default"
            onClick={this.generatePharacyCreditInvoiceReport.bind(
              this,
              "creditInvoice",
              "Credit Invoice"
            )}
          >
            Pharmacy Credit Invoice
          </button> */}

          <button
            onClick={this.generateReport.bind(
              this,
              "pharmacyCashInvoice",
              "Pharmacy Cash Invoice"
            )}
            className="btn btn-default"
          >
            POS Cash Invoice
          </button>

          <button
            className="btn btn-default"
            onClick={this.generateReport.bind(
              this,
              "pharmacyCreditInvoice",
              "Pharmacy Credit Invoice"
            )}
          >
            POS Credit Invoice
          </button>

          {this.state.invoices.chart_type === "N" ? (
            <button
              onClick={this.openUCAFReport.bind(this)}
              className="btn btn-default"
            >
              UCAF
            </button>
          ) : this.state.invoices.chart_type === "O" ? (
            <button
              className="btn btn-default"
              onClick={this.openOCAFReport.bind(this)}
            >
              OCAF
            </button>
          ) : this.state.invoices.chart_type === "D" ? (
            <button
              className="btn btn-default"
              onClick={this.openDCAFReport.bind(this)}
            >
              DCAF
            </button>
          ) : null}
        </div>
        {this.renderUCAFReport()}
        {this.renderDCAFReport()}
        {this.renderOCAFReport()}
      </AlgaehModalPopUp>
    );
  }
}

export default ValidateBills;
