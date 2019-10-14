import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import { AlgaehLabel, AlgaehDataGrid } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

class YearlyLeaveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leave_data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.year !== undefined && nextProps.employee_id !== undefined) {
      this.getLeaveData(nextProps.year, nextProps.employee_id);
    }
  }

  getLeaveData(year, id) {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      module: "hrManagement",
      data: {
        year: year,
        employee_id: id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leave_data: res.data.records,
            loading: false
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
        this.setState({
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        title="Employee Yearly Leave"
      >
        <div className="popupInner">
          <div className="popRightDiv">
            <div className="row margin-top-15 margin-bottom-15">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Name & ID"
                  }}
                />
                <h6>
                  {this.state.leave_data[0] !== undefined
                    ? this.state.leave_data[0].employee_name
                    : "-----------"}{" "}
                  -
                  <small>
                    {" "}
                    {this.state.leave_data[0] !== undefined
                      ? this.state.leave_data[0].employee_code
                      : "-----------"}
                  </small>
                </h6>
              </div>

              <div className="col-12" id="LeaveYearlyDetailsGrid_Cntr">
                <AlgaehDataGrid
                  id="LeaveYearlyDetailsGrid"
                  datavalidate="LeaveYearlyDetailsGrid"
                  columns={[
                    {
                      fieldName: "year",
                      label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
                      others: {
                        maxWidth: 70
                      }
                    },
                    // {
                    //   fieldName: "employee_code",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                    //   ),
                    //   others: {
                    //     maxWidth: 250
                    //   }
                    // },
                    // {
                    //   fieldName: "employee_name",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                    //   ),
                    //   others: {
                    //     style: { textAlign: "left" }
                    //   }
                    // },
                    {
                      fieldName: "leave_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                      ),
                      others: {
                        maxWidth: 120
                      }
                    },
                    {
                      fieldName: "leave_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Leave Description" }}
                        />
                      )
                    },
                    {
                      fieldName: "total_eligible",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Total Eligible" }} />
                      )
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Avail Till Date" }}
                        />
                      )
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Projected Leave" }}
                        />
                      )
                    },
                    {
                      fieldName: "leave_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Carry Forwaded Leave" }}
                        />
                      )
                    },
                    {
                      fieldName: "leave_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Closing Balance" }}
                        />
                      )
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Leave Closed" }} />
                      )
                    }
                  ]}
                  keyId="hims_f_employee_monthly_leave_id"
                  dataSource={{ data: this.state.leave_data }}
                  isEditable={false}
                  loading={this.state.loading}
                  paging={{ page: 0, rowsPerPage: 15 }}
                  events={{}}
                  others={{}}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-12">
            <button onClick={this.props.onClose} className="btn btn-default">
              Close
            </button>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default YearlyLeaveDetail;
