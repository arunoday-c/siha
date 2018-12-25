import React, { Component } from "react";
import "./apply_leave.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import ReactTable from "react-table";

import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
const TreeTable = treeTableHOC(ReactTable);

class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };

    this.getLeaveTypes();
    this.getEmployees();
  }

  componentDidMount() {
    this.setState({
      employee_id: this.props.empData.hims_d_employee_id
    });
  }

  getLeaveTypes() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      onSuccess: res => {
        this.setState({
          leave_types: res.data.records
        });
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      method: "GET",
      onSuccess: res => {
        this.setState({
          employees: res.data.records
        });
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div className="col-3">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request Leave</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Employee",
                      isImp: true
                    }}
                    selector={{
                      name: "employee_id",
                      className: "select-fld",
                      value: this.state.employee_id,
                      dataSource: {
                        textField: "full_name",
                        valueField: "hims_d_employee_id",
                        data: this.state.employees
                      },
                      onChange: this.dropDownHandler.bind(this),
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Leave Type",
                      isImp: true
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "leave_description",
                        valueField: "hims_d_leave_id",
                        data: this.state.leave_types
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-6 margin-bottom-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Avialable Balance"
                      }}
                    />
                    <h6>0.0 days</h6>
                  </div>
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Date From",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_joining",
                      others: {
                        tabIndex: "6"
                      }
                    }}
                    maxDate={new Date()}
                  />{" "}
                  <AlgaehDateHandler
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Date To",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_joining",
                      others: {
                        tabIndex: "6"
                      }
                    }}
                    maxDate={new Date()}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Leave Session",
                      isImp: true
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: ""
                      }
                      //  onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 margin-bottom-15" }}
                    label={{
                      forceLabel: "Leave Session",
                      isImp: true
                    }}
                    selector={{
                      name: "component_type",
                      className: "select-fld",
                      value: this.state.component_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: ""
                      }
                      //  onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <div className="col-12 margin-bottom-15">
                    <AlgaehLabel
                      label={{
                        forceLabel: "No. of Days"
                      }}
                    />
                    <h6>0.0 days</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-12 margin-bottom-15" }}
                    label={{
                      forceLabel: "Reason for Leave",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      //decimal: { allowNegative: false },
                      name: "limit_amount",
                      value: this.state.limit_amount,
                      events: {
                        //  onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        // type: "number"
                      }
                    }}
                  />
                  <div className="col-3">
                    <button type="button" className="btn btn-primary">
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Leave Request List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="leaveRequestList_cntr">
                    <AlgaehDataGrid
                      id="leaveRequestList_grid"
                      columns={[
                        {
                          fieldName: "",
                          label: "Leave Requested On"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Leave Type"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Leave From"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Leave To"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "No. of Days"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Leave Reason"
                          //disabled: true
                        },
                        {
                          fieldName: "",
                          label: "Status"
                          //disabled: true
                        }
                      ]}
                      keyId="algaeh_d_module_id"
                      dataSource={{
                        data: []
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: () => {},
                        onDone: () => {}
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Leave Request List</h3>
                </div>
              </div> */}
              <div className="portlet-body">
                <div className="row leaveBalanceCntr">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Abscent"
                      }}
                    />
                    <h6>0/0 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sick Leave"
                      }}
                    />
                    <h6>0/3 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Casual Leave"
                      }}
                    />
                    <h6>0/3 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Commpensatory Off"
                      }}
                    />
                    <h6>0/0 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Earned Leave"
                      }}
                    />
                    <h6>0/7 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Paternity Leave"
                      }}
                    />
                    <h6>0/5 Day (s)</h6>
                  </div>{" "}
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Loss of Pay"
                      }}
                    />
                    <h6>0/0 Day (s)</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Hajj Leave"
                      }}
                    />
                    <h6>0/15 Day (s)</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ApplyLeave;
