import React, { Component } from "react";
import "./loan-auth.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

class LoanAuthorization extends Component {
  render() {
    return (
      <div className="row loanAuthScreen">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Authorization Level",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col mandatory" }}
              label={{ forceLabel: "From Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{}}
              others={{}}
            />
            <AlgaehDateHandler
              div={{ className: "col mandatory" }}
              label={{ forceLabel: "To Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "yearAndMonth"
              }}
              maxDate={new Date()}
              events={{}}
              others={{}}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Branch",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Departement",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Employee",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />

            <div className="col form-group">
              <button style={{ marginTop: 21 }} className="btn btn-primary">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Loan Requested</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                <i className="fas fa-pen" />
              </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LoanAuthGrid_Cntr">
                  <AlgaehDataGrid
                    id="LoanAuthGrid"
                    datavalidate="LoanAuthGrid"
                    columns={[
                      {
                        fieldName: "applicationCode",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "ApplicationDate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application Date" }}
                          />
                        )
                      },
                      {
                        fieldName: "LoanType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                        )
                      },
                      {
                        fieldName: "EmployeeCode",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "EmployeeCode" }} />
                        )
                      },
                      {
                        fieldName: "EmployeeName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "LoanStatus",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan Status" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Loan Requested by - <span>Employee Name</span>
                </h3>
              </div>
              <div className="actions" />
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="requestedLoanAppGrid_Cntr">
                  <AlgaehDataGrid
                    id="requestedLoanAppGrid"
                    datavalidate="requestedLoanAppGrid"
                    columns={[
                      {
                        fieldName: "Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "InterestPercentage",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Interest Percentage" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfEMI",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of EMI" }} />
                        )
                      },
                      {
                        fieldName: "installmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Installment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "totalPeriod",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Pending Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "startYear",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Start Year" }} />
                        )
                      },
                      {
                        fieldName: "startMonth",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Start Month" }} />
                        )
                      },
                      {
                        fieldName: "statusRemakrs",
                        label: <AlgaehLabel label={{ forceLabel: "Remakrs" }} />
                      },
                      {
                        fieldName: "LoanStatus",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan Status" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
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

export default LoanAuthorization;
