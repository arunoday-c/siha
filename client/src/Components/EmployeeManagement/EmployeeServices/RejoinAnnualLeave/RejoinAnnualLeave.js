import React, { Component } from "react";
import "./RejoinAnnualLeave.scss";
import "../../../../styles/site.scss";
import {
  AlgaehLabel,
  // AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

import moment from "moment";
import Options from "../../../../Options.json";
import { MainContext, AlgaehDataGrid } from "algaeh-react-components";
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
        debugger;
        let inputObj = {
          hims_d_employee_id: row.hims_d_employee_id,
          last_salary_process_date: moment(row.to_date, "YYYY-MM-DD")
            .add(-1, "days")
            .format("YYYY-MM-DD"),
          to_date: row.to_date,
          dates_equal: dates_equal,
          early_rejoin:
            new Date(row.to_date) < new Date(row.actual_to_date) ? "Y" : "N",
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
    let inRange = moment(e).isAfter(
      moment(row["expectedDate"]).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Rejoin Date cannot be gretsre than Expected Rejoin Date.",
        type: "warning",
      });
    } else {
      let employee_data = this.state.employee_data;
      let _index = employee_data.indexOf(row);

      row["to_date"] = moment(e)._d;
      employee_data[_index] = row;
      this.setState({
        employee_data: employee_data,
      });
    }
  }

  generateRejoinReport() {
    // const { episode_id, current_patient, visit_id } = Window.global;
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "rejoinReport",
          pageSize: "A4",
          pageOrentation: "portrait",
          reportParams: [
            {
              name: "hospital_id",
              value: this.state.hospital_id, // Window.global["episode_id"]
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Rejoin Report`;
        window.open(origin);
        // window.document.title = "";
      },

      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  render() {
    return (
      <div className="hims_hospitalservices" style={{ marginTop: -12 }}>
        <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
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

          <div className="col">
            <button
              onClick={() => {
                this.getAnnualLeaveEmployees();
              }}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Load
            </button>{" "}
          </div>

          <div className="col" style={{ textAlign: "right" }}>
            <button
              onClick={this.generateRejoinReport.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-default"
            >
              Download Report
            </button>{" "}
          </div>
        </div>

        <div
          className="portlet portlet-bordered margin-bottom-15"
          style={{ marginTop: 15 }}
        >
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
                        return (
                          <span>
                            <i
                              className="fa fa-check"
                              onClick={this.UpdateEmployeeRejoined.bind(
                                this,
                                row
                              )}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "expectedDate",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Expected Rejoin Date" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{this.dateFormater(row.expectedDate)}</span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "date",
                    },

                    {
                      fieldName: "to_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Actual Rejoined Date" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <AlgaehDateHandler
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld",
                              name: "to_date",
                            }}
                            // others={{ disabled:true }}
                            events={{
                              onChange: this.gridOndateHandler.bind(this, row),
                            }}
                            value={row.to_date}
                          />
                        );
                      },
                      others: {
                        maxWidth: 130,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "date",
                    },
                    {
                      fieldName: "employee_joined",
                      label: <AlgaehLabel label={{ forceLabel: "Rejoined" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.employee_joined === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-warning">No</span>
                            )}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 80,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Yes",
                          value: "Y",
                        },
                        {
                          name: "No",
                          value: "N",
                        },
                      ],
                    },
                    {
                      fieldName: "early_rejoin",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Early rejoined" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.early_rejoin === "Y" ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-warning">No</span>
                            )}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 80,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Yes",
                          value: "Y",
                        },
                        {
                          name: "No",
                          value: "N",
                        },
                      ],
                    },
                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                      ),
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      ),
                      others: {
                        // minWidth: 200,
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                      filterable: true,
                    },

                    {
                      fieldName: "group_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Group" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },

                    // {
                    //   fieldName: "department_name",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Department" }} />
                    //   ),

                    //   others: {
                    //     maxWidth: 150,
                    //     resizable: false,
                    //     style: { textAlign: "center" },
                    //   },
                    // },
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
                      filterable: true,
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
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "to_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Leave To Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{this.dateFormater(row.actual_to_date)}</span>
                        );
                      },
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "date",
                    },
                  ]}
                  keyId="re_join_code"
                  data={this.state.employee_data}
                  pagination={true}
                  isFilterable={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
