import React, { Component } from "react";
import "./ManualAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
export default class ManualAttendance extends Component {
  render() {
    return (
      <div id="ManualAttendanceScreen">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Year", isImp: true }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Month", isImp: true }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Branch", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Dept.", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Project", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-default">
              Load
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="ALL"
                          name="hims_d_employee_id"
                        />
                        <span>Apply to All</span>
                      </label>
                    </div>
                  </div>
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "Select Date", isImp: false }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Start Time",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "End Time",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Total Hours",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time",
                        disabled: "disabled"
                      }
                    }}
                  />{" "}
                  <div className="col">
                    <button
                      style={{ marginTop: 21 }}
                      className="btn btn-default"
                    >
                      Add to all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    <AlgaehDataGrid
                      id="EnterGridIdHere"
                      datavalidate="EnterGridIdHere"
                      columns={[
                        {
                          fieldName: "empName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "empCode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Selected Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "startTime",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Time" }} />
                          )
                        },
                        {
                          fieldName: "endTime",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Time" }} />
                          )
                        },
                        {
                          fieldName: "totalHr",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Hour" }} />
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
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button className="btn btn-primary">Process Attendance</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
