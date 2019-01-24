import React, { Component } from "react";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import { AlgaehLabel, AlgaehDataGrid } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

class YearlyLeaveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getLeaveData(this.props.year, this.props.employee_id);
  }

  componentWillReceiveProps(nextProps) {
    this.getLeaveData(nextProps.year, nextProps.employee_id);
  }

  getLeaveData(year, id) {
    this.setState({
      loading: true
    });
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
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
              <div className="col-12" id="LeaveYearlyProcessGrid_Cntr">
                <AlgaehDataGrid
                  id="LeaveYearlyProcessGrid"
                  datavalidate="LeaveYearlyProcessGrid"
                  columns={[
                    {
                      fieldName: "year",
                      label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
                      filter: false
                    },
                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                      )
                    },
                    {
                      fieldName: "employee_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      )
                    },
                    {
                      fieldName: "leave_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                      )
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
                    }
                  ]}
                  keyId="hims_f_employee_monthly_leave_id"
                  dataSource={{ data: this.state.leave_data }}
                  isEditable={false}
                  filter={true}
                  loading={this.state.loading}
                  paging={{ page: 0, rowsPerPage: 10 }}
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
