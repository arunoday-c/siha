import React, { Component } from "react";
import "./RCMWorkbench.css";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";

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
      selectedLang: "en"
    };
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
              label={{ forceLabel: "Patient ID" }}
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
                        fieldName: "ClaimID",
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
                      data: myData
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
      </div>
    );
  }
}

export default RCMWorkbench;
