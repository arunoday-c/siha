import React, { Component } from "react";
import "./EmployeeReceipts.css";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
class EmployeeReceipts extends Component {
  render() {
    return (
      <div className="emp_receipts">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Receipt Type", isImp: true }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Loan Code", isImp: true }}
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
            </button>{" "}
            <button
              style={{ marginTop: 21, marginLeft: 10 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row">
          {" "}
          <div className="col-12">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Code"
                      }}
                    />
                    <h6>12345678</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Name"
                      }}
                    />
                    <h6>Employee Name</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Pending Amount"
                      }}
                    />
                    <h6>0.00</h6>
                  </div>
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Loan Write Off Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Mode of Recipt", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Cheque No.",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Amount Received",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "number"
                      }
                    }}
                  />
                  <div className="col form-group">
                    <button
                      style={{ marginTop: 21 }}
                      className="btn btn-primary"
                    >
                      Received
                    </button>
                    <button
                      style={{ marginTop: 21, marginLeft: 10 }}
                      className="btn btn-default"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Employee Receipts List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EmployeeReciptsGrid_Cntr">
                    <AlgaehDataGrid
                      id="EmployeeReciptsGrid"
                      datavalidate="EmployeeReciptsGrid"
                      columns={[
                        {
                          fieldName: "ReciptType",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type" }}
                            />
                          )
                        },
                        {
                          fieldName: "Recipt Type Code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type Code" }}
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
                          fieldName: "Pending Amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "LoanWriteAmount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Write off Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeRecipt",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeReciptNumber",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "AmountReceived",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Amount Received" }}
                            />
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
        </div>
      </div>
    );
  }
}

export default EmployeeReceipts;
