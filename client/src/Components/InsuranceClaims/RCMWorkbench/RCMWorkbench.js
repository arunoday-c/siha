import React, { Component } from "react";
import "./RCMWorkbench.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import FrontDesk from "../../../Search/FrontDesk.json";
// import AlgaehLoader from "../../Wrapper/fullPageLoader";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../Wrapper/globalSearch";

const myData = [
  {
    ClaimID: "123",
    ins_company: "Bupa",
    name: "ABC",
    policy_group: "Policy",
    desc: "Description",
    bill_date: "20-11-2018",
    patient_code: "PAT-A-0000545",
    patientName: "Khalid",
    submitAmt: "100",
    remitAmt: "100",
    receipt_amt: "100",
    reciptStatus: "Paid"
  }
];

class RCMWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      claims: []
    };
    this.getIncoices();
  }

  getIncoices() {
    algaehApiCall({
      uri: "/invoiceGeneration/getInvoiceGeneration",
      method: "GET",
      data: { invoice_number: null },
      onSuccess: response => {
        debugger;
        this.setState({
          claims: [response.data.records]
        });
      },
      onError: error => {}
    });
  }

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
        //console.log("Selected Row:", row);
        this.setState({
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id,
          patient_name: row.full_name,
          age: row.age,
          date_of_birth: row.date_of_birth,
          gender: row.gender,
          contact_number: row.contact_number,
          email: row.email,
          arabic_name: row.arabic_name,
          title_id: row.title_id
        });
      }
    });
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
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
              div={{ className: "col" }}
              label={{ forceLabel: "Company Name" }}
              selector={{
                name: "location_id",
                className: "select-fld",
                value: this.state.location_id,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locations
                },
                onChange: null,
                onClear: null
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Sub Company Name" }}
              selector={{
                name: "location_id",
                className: "select-fld",
                value: this.state.location_id,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locations
                },

                onChange: null,
                onClear: null
              }}
            />
            <AlagehFormGroup
              div={{ className: "col  margin-top-15 " }}
              label={{
                fieldName: "patient_code",
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

            <div className="col-lg-1" style={{ paddingTop: "40px" }}>
              <i
                //onClick={this.getPatient.bind(this)}
                onClick={this.patientSearch.bind(this)}
                className="fas fa-search"
                style={{
                  marginLeft: "-75%",
                  cursor: "pointer"
                }}
              />
            </div>

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "From Date" }}
              textBox={{
                className: "txt-fld",
                name: "expiry_date"
              }}
              minDate={new Date()}
              //disabled={true}
              events={{
                onChange: null
              }}
              value={this.state.expiry_date}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "To Date" }}
              textBox={{
                className: "txt-fld",
                name: "expiry_date"
              }}
              minDate={new Date()}
              //disabled={true}
              events={{
                onChange: null
              }}
              value={this.state.expiry_date}
            />
            <div className="col">
              <button className="btn btn-default" style={{ marginTop: 21 }}>
                Clear
              </button>
            </div>
            <div className="col">
              <button className="btn btn-primary" style={{ marginTop: 21 }}>
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
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return <i className="fas fa-check" />;
                        },
                        other: {
                          maxWidth: 55
                        }
                      },
                      {
                        fieldName: "invoice_number",
                        label: <AlgaehLabel label={{ forceLabel: "ClaimID" }} />
                      },

                      {
                        fieldName: "ins_company",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Ins. Company" }} />
                        )
                      },
                      {
                        fieldName: "name",
                        label: <AlgaehLabel label={{ forceLabel: "Name" }} />,
                        disabled: true
                      },
                      {
                        fieldName: "policy_group",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Policy Group" }} />
                        )
                      },
                      {
                        fieldName: "desc",
                        label: <AlgaehLabel label={{ forceLabel: "Desc." }} />,
                        disabled: true
                      },
                      {
                        fieldName: "plan",
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
                          <AlgaehLabel label={{ forceLabel: "Patient Id" }} />
                        )
                      },

                      {
                        fieldName: "patientName",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "submitAmt",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Submit Amt."
                            }}
                          />
                        )
                      },
                      {
                        fieldName: "submitDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Submit Date" }} />
                        )
                      },

                      {
                        fieldName: "remitAmt.",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Remit Amt." }} />
                        ),
                        disabled: true
                      },

                      {
                        fieldName: "remitDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Remit Date" }} />
                        ),
                        disabled: true
                      },

                      {
                        fieldName: "receipt_amt.",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Remit Amt." }} />
                        ),
                        disabled: true
                      },

                      {
                        fieldName: "reciptStatus",
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
