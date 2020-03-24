import React, { Component } from "react";
import "./AuditLog.scss";
import moment from "moment";

import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { algaehApiCall } from "../../../utils/algaehApiCall";

import AlgaehSearch from "../../Wrapper/globalSearch";
import { MainContext } from "algaeh-react-components/context";
export default class AuditLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: "",
      hospitalList: [],
      levels: []
    };
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({ hospital_id: userToken.hims_d_hospital_id });
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({ hospitalList: res.data.records });
        }
      }
    });
  }

  clearSearch = () => {
    this.setState({ hospital_id: "", employee_id: "" });
  };

  datehandle(ctrl, e) {
    this.setState({
      [e]: moment(ctrl)._d
    });
  }

  dropDownHandle = e => {
    console.log(e, "handle");
    const { name, value } = e;
    this.setState({ [name]: value });
  };
  auditlogData() {
    algaehApiCall({
      uri: "/getLogs",
      module: "documentManagement",
      data: {
        hims_d_hospital_id: this.state.hospital_id,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
        employee_id: this.state.employee_id,

        level: this.state.levels
      },
      method: "GET",

      onSuccess: response => {
        if (response.data.success === true) {
          new Promise((resolve, reject) => {
            resolve(response.data.records);
            // }).then(data => {
            //   if (Array.isArray(data)) {
            //     if (data.length > 0) {
            //     }
            //   } else if (data !== null || data !== undefined) {
            //   }
          });
        }
      }
    });
  }
  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        console.log("row", row);
        this.setState({
          employee_name: row.full_name,
          employee_id: row.hims_d_employee_id
        });
      }
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
              isImp: true
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.hospitalList
              },
              onChange: this.dropDownHandle,
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ forceLabel: "From Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "from_date" }}
            events={{
              onChange: this.datehandle.bind(this)
            }}
            value={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ forceLabel: "To Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "to_date" }}
            events={{
              onChange: this.datehandle.bind(this)
            }}
            value={this.state.to_date}
          />

          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Levels",
              isImp: false
            }}
            selector={{
              name: "Level",
              className: "select-fld",
              value: this.state.levels,
              multiselect: true,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [
                  { name: "Warning", value: "warning" },
                  { name: "Information", value: "info" },
                  { name: "Error", value: "error" }
                ]
              },
              onChange: this.dropDownHandle,
              onClear: () => {
                this.setState({
                  value: null
                });
              }
            }}
          />

          <div className="col-3 globalSearchCntr form-group mandatory">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>
          <div className="col">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              // onClick={this.auditlogData.bind(this)}
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
                          fieldName: "audit_time",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Date & Time" }}
                            />
                          ),
                          others: {
                            maxWidth: 200
                          }
                        },
                        {
                          fieldName: "audit_Level",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Level" }} />
                          ),
                          others: {
                            maxWidth: 250
                          }
                        },
                        {
                          fieldName: "audit_url",
                          label: <AlgaehLabel label={{ forceLabel: "URL" }} />,
                          others: {
                            maxWidth: 120
                          }
                        },
                        {
                          fieldName: "audit_method",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Method" }} />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "audit_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "UserName" }} />
                          ),
                          others: {
                            maxWidth: 250
                          }
                        },
                        {
                          fieldName: "audit_role",
                          label: <AlgaehLabel label={{ forceLabel: "Role" }} />
                        },
                        {
                          fieldName: "audit_machine_details",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Machine Details" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{}}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 20 }}
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
