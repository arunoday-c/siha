import React, { Component } from "react";
import "./RejoinAnnualLeave.scss";
import "../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

import moment from "moment";
import Options from "../../../../Options.json";
import { AlgaehButton, MainContext } from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";

export default class RejoinAnnualLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_data: [],
      organisations: [],
      // hospital_name: "",
      hospital_id: "",
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
        // hospital_name: userToken.hospital_name,
      },
      () => {
        this.getOrganizations();
        this.getAnnualLeaveEmployees();
      }
    );
  }
  getOrganizations() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            organisations: res.data.records,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }
  dropDownHandler(e) {
    this.setState({ [e.name]: e.value });
  }
  getAnnualLeaveEmployees() {
    console.log("this.state", this.state);
    algaehApiCall({
      uri: "/selfService/getRejoinAnnualLeave",
      module: "hrManagement",
      method: "GET",
      data: {
        hospital_id: this.state.hospital_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_data: res.data.records,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  UpdateEmployeeRejoined(row) {
    swal({
      title: "Are you sure want to Proceed?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      let dates_equal = moment(
        row.last_salary_process_date,
        "DD-MM-YYYY"
      ).isSame(row.to_date, "DD-MM-YYYY");

      if (willProceed.value) {
        let inputObj = {
          hims_d_employee_id: row.hims_d_employee_id,
          last_salary_process_date: row.last_salary_process_date,
          dates_equal: dates_equal,
          early_rejoin:
            new Date(row.last_salary_process_date) <
            new Date(row.actual_to_date)
              ? "Y"
              : "N",
          hims_f_leave_application_id: row.hims_f_leave_application_id,
        };
        algaehApiCall({
          uri: "/employee/UpdateEmployeeRejoined",
          module: "hrManagement",
          method: "PUT",
          data: inputObj,
          onSuccess: (res) => {
            if (res.data.success) {
              swalMessage({
                title: "Done Successfully...",
                type: "success",
              });
              this.getAnnualLeaveEmployees();
            }
          },
          onFailure: (err) => {
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      }
    });
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  gridOndateHandler(row, e) {
    let employee_data = this.state.employee_data;
    let _index = employee_data.indexOf(row);

    row["last_salary_process_date"] = moment(e)._d;
    employee_data[_index] = row;
    this.setState({
      employee_data: employee_data,
    });
  }

  render() {
    return (
      <div className="hims_hospitalservices">
        <div
          className="portlet portlet-bordered margin-bottom-15"
          style={{ marginTop: 15 }}
        >
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-3 form-group mandatory" }}
              label={{
                forceLabel: "Select Branch",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.organisations,
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
              }}
            />
            <AlgaehButton
              className="btn btn-primary"
              onClick={() => {
                this.getAnnualLeaveEmployees();
              }}
            >
              LOAD
            </AlgaehButton>
          </div>

          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="employeeIndexGrid">
                <AlgaehDataGrid
                  id="employee_rejoin_grid"
                  columns={[
                    {
                      fieldName: "action",

                      label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                      displayTemplate: (row) => {
                        return row.employee_joined === "N" ? (
                          <span>
                            <i
                              className="fa fa-check"
                              onClick={this.UpdateEmployeeRejoined.bind(
                                this,
                                row
                              )}
                            />
                          </span>
                        ) : null;
                      },
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "last_salary_process_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Rejoin Date" }} />
                      ),
                      // displayTemplate: row => {
                      //   return (
                      //     <span>
                      //       {this.dateFormater(row.last_salary_process_date)}
                      //     </span>
                      //   );
                      // },
                      displayTemplate: (row) => {
                        return (
                          <AlgaehDateHandler
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "last_salary_process_date",
                            }}
                            events={{
                              onChange: this.gridOndateHandler.bind(this, row),
                            }}
                            value={row.last_salary_process_date}
                          />
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    // {
                    //   fieldName: "to_date",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Expected Rejoin Date" }}
                    //     />
                    //   ),
                    //   displayTemplate: (row) => {
                    //     return <span>{this.dateFormater(row.to_date)}</span>;
                    //   },
                    //   others: {
                    //     maxWidth: 150,
                    //     resizable: false,
                    //     style: { textAlign: "center" },
                    //   },
                    // },
                    {
                      fieldName: "early_rejoin",
                      label: <AlgaehLabel label={{ forceLabel: "Rejoined" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>{row.early_rejoin === "Y" ? "YES" : "NO"}</span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "employee_joined",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Employee early rejoined" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.employee_joined === "Y" ? "YES" : "NO"}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                      ),
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      ),
                      others: {
                        // minWidth: 200,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "group_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Group" }} />
                      ),

                      others: {
                        maxWidth: 200,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },

                    {
                      fieldName: "department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sub Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "from_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Leave From Date" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return <span>{this.dateFormater(row.from_date)}</span>;
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "to_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Leave To Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return <span>{this.dateFormater(row.to_date)}</span>;
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  keyId="re_join_code"
                  dataSource={{
                    data: this.state.employee_data,
                  }}
                  filter={true}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 50 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
