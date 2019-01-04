import React, { Component } from "react";
import "./loan-adjustment.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
class LoanAdjustment extends Component {
  render() {
    return (
      <div className="laon-adjustment">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{ forceLabel: "Select and Employee", isImp: true }}
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
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Loan Adjustment</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="LoanAdjustGrid_Cntr">
                    <AlgaehDataGrid
                      id="LoanAdjustGrid"
                      datavalidate="LoanAdjustGrid"
                      columns={[
                        {
                          fieldName: "SkippingMonth",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Skipping Month" }}
                            />
                          )
                        },
                        {
                          fieldName: "PayMonthTogther",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Pay Month Togther" }}
                            />
                          )
                        },
                        {
                          fieldName: "StartYearSkipPayLoan",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Start Year of Skip/ Pay Loan"
                              }}
                            />
                          )
                        },
                        {
                          fieldName: "EmployeeCode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
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
                          fieldName: "LoanApplicationCode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Application Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "ApplicationDesc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Application Description" }}
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
      </div>
    );
  }
}

export default LoanAdjustment;
