import React, { Component } from "react";
import "./RCMWorkbench.scss";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
  // AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";
import { texthandle } from "./RCMWorkbenchEvent";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../Wrapper/globalSearch";
import ValidateBills from "./ValidateBills/ValidateBills";
import moment from "moment";
import ClaimSubmission from "./ClaimSubmission/ClaimSubmission";
import _ from "lodash";
// let validatedClaims = [];

class RCMWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      claims: [],
      openClaims: false,
      generateReport: true,
      rcmMode: "C",
    };
    this.validatedClaims = [];
    this.select = true;
    this.dropDownHandler = this.dropDownHandler.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.getInvoicesForClaims = this.getInvoicesForClaims.bind(this);
    this.openReviewSubmit = this.openReviewSubmit.bind(this);
    this.getInsuranceProviders();
    this.preValidateReport = this.preValidateReport.bind(this);
    this.claimsReport = this.claimsReport.bind(this);
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "insurance_provider_id":
        this.setState(
          {
            [value.name]: value.value,
          },
          () => {
            algaehApiCall({
              uri: "/insurance/getSubInsurance",
              module: "insurance",
              method: "GET",
              data: {
                insurance_provider_id: this.state.insurance_provider_id,
              },
              onSuccess: (response) => {
                if (response.data.success) {
                  this.setState({
                    sub_ins_companies: response.data.records,
                  });
                }
              },
              onError: (error) => {},
            });
          }
        );
        break;

      default:
        this.setState({
          [value.name]: value.value,
        });
        break;
    }
  }

  addClaimsArray(row, e) {
    let generateReport = true;
    let claims = this.state.claims;
    let _index = claims.indexOf(row);
    if (row.claim_validated === "P") {
      // e.preventDefault();

      row.chkselect = 0;
      claims[_index] = row;

      generateReport = this.validatedClaims.length > 0 ? false : true;
      this.setState({
        generateReport: generateReport,
        claims: claims,
      });
      swalMessage({
        title: "Please Validate the bill first",
        type: "warning",
      });
    } else if (this.validatedClaims.includes(row)) {
      this.validatedClaims.pop(row);

      row.chkselect = 1;
      claims[_index] = row;

      generateReport = this.validatedClaims.length > 0 ? false : true;
      this.setState({
        generateReport: generateReport,
        claims: claims,
      });
    } else {
      this.validatedClaims.push(row);
      row.chkselect = 1;
      claims[_index] = row;

      generateReport = this.validatedClaims.length > 0 ? false : true;
      this.setState({
        generateReport: generateReport,
        claims: claims,
      });
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
            : null,
        };

        AlgaehLoader({ show: true });

        algaehApiCall({
          uri: "/invoiceGeneration/getInvoicesForClaims",
          module: "insurance",
          method: "GET",
          data: send_data,
          onSuccess: (response) => {
            if (response.data.success) {
              this.setState({
                claims: response.data.records,
              });
              AlgaehLoader({ show: false });
            } else {
              swalMessage({
                title: response.data.records,
                type: "error",
              });
              AlgaehLoader({ show: false });
            }
          },
          onError: (error) => {
            AlgaehLoader({ show: false });
          },
        });
      },
    });
  }

  getInsuranceProviders() {
    algaehApiCall({
      uri: "/insurance/getInsuranceProviders",
      module: "insurance",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            insurance_providers: response.data.records,
          });
        }
      },
      onError: (error) => {},
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
      claims: [],
    });
  }

  generateReports() {
    AlgaehLoader({ show: true });
    let rpt_paramenter = [];

    // validatedClaims
    for (let i = 0; i < this.validatedClaims.length; i++) {
      rpt_paramenter.push([
        { name: "hims_d_patient_id", value: this.state.claims[i].patient_id },
        {
          name: "visit_id",
          value: this.state.claims[i].visit_id,
        },
        {
          name: "visit_date",
          value: null,
        },
      ]);
    }

    algaehApiCall({
      uri: "/multireports", //"/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      timeout: 120000,
      others: {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (percentCompleted >= 100) {
            this.setState({ progressPercentage: 100 });
          } else {
            this.setState({ progressPercentage: percentCompleted });
          }
        },
      },
      data: {
        report: {
          reportName: [
            "creditInvoice",
            "pharmacyCreditInvoice",
            "ucaf",
            "haematologyReport",
            "radiologyReport",
          ],
          reportParams: rpt_paramenter,
          outputFileType: "PDF", //"EXCEL", //"PDF",
        },
      },
      onSuccess: (res) => {
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Algaeh Merdge`;
        window.open(origin);
        // window.document.title = "Algaeh Merdge";
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
      },
    });
  }

  patientSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.frontDesk.patients,
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState({
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id,
        });
      },
    });
  }

  openReviewSubmit() {
    this.validatedClaims.length === 0
      ? swalMessage({
          title: "please select atleast one invoice to submit",
          type: "warning",
        })
      : this.setState({
          openSubmit: true,
        });
  }

  handleClose() {
    this.setState({
      openClaims: false,
    });
  }

  handleSubmitClose() {
    this.setState({
      openSubmit: false,
    });
  }
  claimsReport(e) {
    if (this.state.insurance_provider_id === undefined) {
      swalMessage({
        type: "error",
        title: "Company Name can't blank",
      });
      return;
    }
    if (this.state.from_date === undefined) {
      swalMessage({
        type: "error",
        title: "From date can't blank",
      });
      return;
    }
    if (this.state.to_date === undefined) {
      swalMessage({
        type: "error",
        title: "To date can't blank",
      });
      return;
    }
    algaehApiCall({
      uri: "/excelReport",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "ClaimsSummary-PatientSQ",
          reportParams: [
            {
              name: "insurance_provider_id",
              value: this.state.insurance_provider_id,
            },
            {
              name: "invoice_from_date",
              value: new Date(this.state.from_date),
            },
            { name: "invoice_to_date", value: new Date(this.state.to_date) },
          ],
        },
      },
      onSuccess: (res) => {
        const url = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "claimSubmission.xlsx");
        link.click();
      },
    });
  }
  preValidateReport(e) {
    if (this.state.claims.length === 0) {
      swalMessage({
        type: "warning",
        title: "There is no data to validate !",
      });
      return;
    }

    const inputParams = _.chain(this.state.claims)
      .groupBy((g) => g.visit_id)
      .map((details, key) => {
        return key;
      })
      .value();

    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "prevalidation",
          reportParams: [{ name: "visit_id", value: inputParams }],
        },
      },
      onSuccess: (res) => {
        // const url = URL.createObjectURL(res.data);
        // const link = document.createElement("a");
        // link.setAttribute("href", url);
        // link.setAttribute("download", ".pdf");
        // link.click();
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= Prevalidation`;
        window.open(origin);
      },
    });
  }
  render() {
    return (
      <div className="row">
        <button
          id="load-claims"
          className="d-none"
          onClick={() => {
            this.getInvoicesForClaims();
            this.setState({
              openClaims: false,
            });
          }}
        />
        <ValidateBills
          data={this.state.sendProps}
          closeModal={this.handleClose.bind(this)}
          openPopup={this.state.openClaims}
        />
        <ClaimSubmission
          data={this.validatedClaims}
          claimSubmission={this.state.openSubmit}
          closeSubmissionModal={this.handleSubmitClose.bind(this)}
        />

        <div className="col-12">
          <div className="row inner-top-search">
            <div className="col-3">
              <label>Load By</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="C"
                    name="rcmMode"
                    checked={this.state.rcmMode === "C" ? true : false}
                    onChange={texthandle.bind(this)}
                  />
                  <span>Claim</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="S"
                    name="rcmMode"
                    checked={this.state.rcmMode === "S" ? true : false}
                    onChange={texthandle.bind(this)}
                  />
                  <span>Statement</span>
                </label>
              </div>
            </div>

            {this.state.rcmMode === "C" ? (
              <>
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ isImp: true, forceLabel: "Company Name" }}
                  selector={{
                    name: "insurance_provider_id",
                    className: "select-fld",
                    value: this.state.insurance_provider_id,
                    dataSource: {
                      textField: "insurance_provider_name",
                      valueField: "hims_d_insurance_provider_id",
                      data: this.state.insurance_providers,
                    },
                    onChange: this.dropDownHandler,
                    onClear: () => {
                      this.setState({
                        insurance_provider_id: null,
                        sub_insurance_id: null,
                      });
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ isImp: true, forceLabel: "Sub Company Name" }}
                  selector={{
                    name: "sub_insurance_id",
                    className: "select-fld",
                    value: this.state.sub_insurance_id,
                    dataSource: {
                      textField: "insurance_sub_name",
                      valueField: "hims_d_insurance_sub_id",
                      data: this.state.sub_ins_companies,
                    },
                    onChange: this.dropDownHandler,
                    onClear: () => {
                      this.setState({
                        sub_insurance_id: null,
                      });
                    },
                  }}
                />

                <div className="col-3 globalSearchCntr">
                  <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                  <h6 onClick={this.patientSearch.bind(this)}>
                    {/* {this.state.emp_name ? this.state.emp_name : "------"} */}
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "Search Patient"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>
                <AlgaehDateHandler
                  div={{ className: "col-2 form-group" }}
                  label={{ isImp: false, forceLabel: "From Date" }}
                  textBox={{
                    className: "txt-fld",
                    name: "from_date",
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (selDate) => {
                      this.setState({
                        from_date: selDate,
                      });
                    },
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-2 form-group" }}
                  label={{ isImp: false, forceLabel: "To Date" }}
                  textBox={{
                    className: "txt-fld",
                    name: "to_date",
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (selDate) => {
                      this.setState({
                        to_date: selDate,
                      });
                    },
                  }}
                  value={this.state.to_date}
                />
                <div className="col">
                  <button
                    onClick={this.getInvoicesForClaims}
                    className="btn btn-primary"
                    style={{ marginTop: 19, marginLeft: 5, float: "right" }}
                  >
                    Load
                  </button>
                  <button
                    onClick={this.clearSearch}
                    className="btn btn-default"
                    style={{ marginTop: 19, float: "right" }}
                  >
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="col-3 globalSearchCntr form-group">
                  <AlgaehLabel label={{ forceLabel: "Search Statement No" }} />
                  <h6>
                    {/* {this.state.emp_name ? this.state.emp_name : "------"} */}
                    {"Search Statement No"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>
                <div className="col-2">
                  <button
                    onClick={this.getInvoicesForClaims}
                    className="btn btn-primary"
                    style={{ marginTop: 19, marginLeft: 5, float: "right" }}
                  >
                    Load
                  </button>
                  <button
                    onClick={this.clearSearch}
                    className="btn btn-default"
                    style={{ marginTop: 19, float: "right" }}
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="row">
              <div className="col-12" id="rcmDesktopGrid_Cntr">
                <AlgaehDataGrid
                  id="rcmDesktopGrid"
                  columns={[
                    {
                      fieldName: "chkselect",
                      label: <AlgaehLabel label={{ forceLabel: "Select" }} />,
                      displayTemplate: (row) => {
                        return (
                          <input
                            type="checkbox"
                            checked={
                              parseFloat(row.chkselect) === 0 ? false : true
                            }
                            onChange={this.addClaimsArray.bind(this, row)}
                          />
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <input
                            type="checkbox"
                            checked={
                              parseFloat(row.chkselect) === 0 ? false : true
                            }
                            onChange={this.addClaimsArray.bind(this, row)}
                          />
                        );
                      },
                      others: {
                        // fixed: "left",
                        filterable: false,
                        maxWidth: 60,
                      },
                    },
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ forceLabel: "Details" }} />,
                      displayTemplate: (row) => {
                        return (
                          <i
                            onClick={() => {
                              // row.claim_validated === "V" ||
                              // row.claim_validated === "X"
                              //   ? swalMessage({
                              //       title:
                              //         "Invoice Already Validated, You can now submit the invoice for claims",
                              //       type: "warning"
                              //     })
                              //   :
                              this.setState({
                                openClaims: true,
                                sendProps: row,
                              });
                            }}
                            className="fas fa-eye"
                          />
                        );
                      },
                      others: {
                        // fixed: "left",
                        filterable: false,
                        maxWidth: 60,
                      },
                    },
                    {
                      fieldName: "invoice_number",
                      label: <AlgaehLabel label={{ forceLabel: "Claim ID" }} />,
                      others: {
                        minWidth: 130,
                      },
                    },
                    {
                      fieldName: "claim_validated",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.claim_validated === "V" ? (
                              <span className="badge badge-success">
                                Validated
                              </span>
                            ) : row.claim_validated === "E" ? (
                              <span className="badge badge-danger">Error</span>
                            ) : row.claim_validated === "X" ? (
                              <span className="badge badge-info">
                                XML Generated
                              </span>
                            ) : row.claim_validated === "P" ? (
                              <span className="badge badge-warning">
                                Pending
                              </span>
                            ) : (
                              "----"
                            )}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                    // {
                    //   fieldName: "insurance_provider_name",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Insurance Company" }}
                    //     />
                    //   ),
                    //   others: {
                    //     minWidth: 150,
                    //   },
                    // },
                    {
                      fieldName: "policy_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Policy No." }} />
                      ),
                    },
                    // {
                    //   fieldName: "network_type",
                    //   label: <AlgaehLabel label={{ forceLabel: "Plan" }} />,
                    //   others: {
                    //     minWidth: 150,
                    //   },
                    // },
                    {
                      fieldName: "card_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Card Number" }} />
                      ),
                      others: {
                        maxWidth: 150,
                      },
                    },
                    {
                      fieldName: "invoice_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Invoice Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.invoice_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      },
                      disabled: true,
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                      ),
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "patient_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),
                      disabled: true,
                      others: {
                        minWidth: 150,
                      },
                    },
                    {
                      fieldName: "submission_ammount",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Submit Amt.",
                          }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.submission_ammount
                              ? row.submission_ammount
                              : 0}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "submission_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Submit Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.submission_date
                              ? row.submission_date
                              : "------"}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "remittance_ammount.",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Remit Amt." }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.remittance_ammount
                              ? row.remittance_ammount
                              : 0}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "remittance_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Remit Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.remittance_date
                              ? row.remittance_date
                              : "------"}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                    {
                      fieldName: "denial_ammount.",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Denial Amt." }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.denial_ammount ? row.denial_ammount : 0}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                      },
                    },
                  ]}
                  keyId="service_type_id"
                  dataSource={{
                    data: this.state.claims,
                  }}
                  filter={true}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 20 }}
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
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-12">
              <button
                onClick={this.openReviewSubmit}
                type="button"
                className="btn btn-primary"
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Submit Claims",
                    returnText: true,
                  }}
                />
              </button>

              <button
                // onClick={this.openReviewSubmit}
                type="button"
                className="btn btn-other"
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Re-Submit",
                    returnText: true,
                  }}
                />
              </button>

              {/*<button
                onClick={this.generateReports.bind(this)}
                type="button"
                className="btn btn-other"
                disabled={this.state.generateReport}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Print",
                    returnText: true
                  }}
                />
              </button>*/}
              <button
                onClick={this.claimsReport.bind(this)}
                type="button"
                className="btn btn-other"
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Claims Report",
                    returnText: true,
                  }}
                />
              </button>
              <button
                onClick={this.preValidateReport.bind(this)}
                type="button"
                className="btn btn-other"
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Pre Validate Report",
                    returnText: true,
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
