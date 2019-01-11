import React, { Component } from "react";
import "./LeaveYearlyProcess.css";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class LeaveYearlyProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year()
    };
  }

  processYearlyLeave() {
    algaehApiCall({
      uri: "/leave/processYearlyLeave",
      method: "GET",
      data: {
        year: this.state.year
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Leaves processed successfully",
            type: "success"
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

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.textHandler.bind(this)
                },
                others: {
                  type: "number",
                  min: moment().year(),
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Filter by Branch",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Select an Employee Type",
                isImp: true
              }}
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

            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Select an Leave Type",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <div className="col form-group">
              <button
                onClick={this.processYearlyLeave.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-primary"
              >
                Process
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Process Details</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveYearlyProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="LeaveYearlyProcessGrid"
                    datavalidate="LeaveYearlyProcessGrid"
                    columns={[
                      {
                        fieldName: "Year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />
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
