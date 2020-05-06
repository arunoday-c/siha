import React, { Component } from "react";
import "./AuditLog.scss";
import moment from "moment";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

import AlgaehSearch from "../../Wrapper/globalSearch";
import { MainContext } from "algaeh-react-components/context";
export default class AuditLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: "",
      hospitalList: [],
      levels: null,
      employee_id: undefined,
      auditdata: [],
    };
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({ hospital_id: userToken.hims_d_hospital_id });
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({ hospitalList: res.data.records });
        }
      },
    });
  }

  clearSearch = () => {
    this.setState({ hospital_id: "", employee_id: "" });
  };

  datehandle(ctrl, e) {
    this.setState({
      [e]: moment(ctrl)._d,
    });
  }
  handleClear() {
    this.setState({
      employee_name: undefined,
      from_date: undefined,
      to_date: undefined,
      levels: null,
      auditdata: [],
    });
  }

  dropDownHandle = (e) => {
    const { name, value } = e;
    this.setState({ [name]: value });
  };
  handleChange = (evnt) => {
    console.log(evnt);
    this.setState({
      levels: evnt.value,
    });
  };
  auditlogData() {
    if (this.state.from_date === undefined) {
      swalMessage({
        title: "Please Select From date first",
        type: "warning",
      });
      return;
    }
    if (this.state.to_date === undefined) {
      swalMessage({
        title: "Please Select to date first",
        type: "warning",
      });
      return;
    }
    const employee_id =
      this.state.employee_id === undefined
        ? {}
        : { employee_id: this.state.employee_id };
    const levels =
      this.state.levels === null ? {} : { level: this.state.levels };
    const input = {
      hims_d_hospital_id: this.state.hospital_id,
      from_date: moment(this.state.from_date).format("YYYY-MM-DD"),
      to_date: moment(this.state.to_date).format("YYYY-MM-DD"),
      ...employee_id,
      ...levels,
    };

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/getLogs",
      module: "documentManagement",
      data: input,

      method: "POST",

      onSuccess: (response) => {
        AlgaehLoader({ show: false });
        const { success, records } = response.data;
        if (success === true) {
          this.setState({ auditdata: records });
        }
      },
      onCatch: (error) => {
        AlgaehLoader({ show: false });
        console.error(error);
      },
    });
  }
  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        console.log("row", row);
        this.setState({
          employee_name: row.full_name,
          employee_id: row.hims_d_employee_id,
        });
      },
    });
  }

  render() {
    return (
      <div className="AuditLogScreen">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
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
                data: this.state.hospitalList,
              },
              onChange: this.dropDownHandle,
              onClear: () => {
                this.setState({
                  hospital_id: null,
                });
              },
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            isImp={true}
            label={{ forceLabel: "From Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "from_date" }}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            isImp={true}
            label={{ forceLabel: "To Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "to_date" }}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.to_date}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Levels",
              isImp: false,
            }}
            selector={{
              name: "Level",
              className: "select-fld",
              value: this.state.levels,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [
                  { name: "Warning", value: "warn" },
                  { name: "Information", value: "info" },
                  { name: "Error", value: "error" },
                ],
              },
              onChange: this.handleChange.bind(this),
              onClear: () => {
                this.setState({
                  value: null,
                });
              },
            }}
          />

          <div className="col globalSearchCntr form-group mandatory">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>
          <div className="col-2">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              onClick={this.handleClear.bind(this)}
              className="btn btn-default"
            >
              CLEAR
            </button>{" "}
            <button
              type="submit"
              style={{ marginTop: 19, marginLeft: 10 }}
              onClick={this.auditlogData.bind(this)}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Audit Log List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="auditLogGrid_Cntr">
                    <AlgaehDataGrid
                      id="auditLogGrid"
                      columns={[
                        {
                          fieldName: "dateTime",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Date & Time" }}
                            />
                          ),
                        },
                        {
                          fieldName: "level",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "LEVEL" }} />
                          ),
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "FULL NAME" }} />
                          ),
                        },
                        {
                          fieldName: "arabic_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "ARABIC NAME" }}
                            />
                          ),
                        },
                        {
                          fieldName: "stream",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "STREAM" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.stream === null ? "No" : row.stream;
                          },
                        },
                        {
                          fieldName: "role_discreption",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "ROLE DESCRIPTION" }}
                            />
                          ),
                        },
                        {
                          fieldName: "app_group_desc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "APP GROUP DESC" }}
                            />
                          ),
                        },

                        {
                          fieldName: "requestMethod",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "METHOD" }} />
                          ),
                        },
                        {
                          fieldName: "requestUrl",
                          label: <AlgaehLabel label={{ forceLabel: "URL" }} />,
                        },
                        {
                          fieldName: "requestClient",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "REQUEST CLIENT" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            if (typeof row.requestClient !== "string") {
                              return JSON.stringify(row.requestClient);
                            } else {
                              return row.requestClient;
                            }
                          },
                        },

                        {
                          fieldName: "product_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "PRODUCT TYPE" }}
                            />
                          ),
                        },

                        {
                          fieldName: "host",
                          label: <AlgaehLabel label={{ forceLabel: "HOST" }} />,
                        },
                        {
                          fieldName: "origin",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "ORIGIN" }} />
                          ),
                        },
                        {
                          fieldName: "user-agent",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "USER AGENT" }} />
                          ),
                        },
                        {
                          fieldName: "parameters",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "PARAMETERS" }} />
                          ),
                          displayTemplate: (row) => {
                            return JSON.stringify(row.parameters);
                          },
                        },
                      ]}
                      rowClassName={(row) => {
                        let className = "error";
                        switch (row.level) {
                          case "error":
                            className = "error";
                            break;
                          case "warning":
                            className = "warning";
                            break;
                          case "info":
                            className = "";
                            break;
                        }
                        return className;
                      }}
                      dataSource={{ data: this.state.auditdata }}
                      paging={{ page: 0, rowsPerPage: 20 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-default">
                <AlgaehLabel label={{ forceLabel: "Export as PDF" }} />
              </button>
              <button type="button" className="btn btn-default">
                <AlgaehLabel label={{ forceLabel: "Export as Excel" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
