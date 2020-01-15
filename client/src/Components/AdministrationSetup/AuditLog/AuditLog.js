import React, { Component } from "react";
import "./AuditLog.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import Enumerable from "linq";
import swal from "sweetalert2";
import AlgaehSearch from "../../Wrapper/globalSearch";

export default class AuditLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      hospitalList: []
    };
  }

  componentDidMount() {
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

  dropDownHandle = e => {
    console.log(e, "handle");
    const { name, value } = e;
    this.setState({ [name]: value });
  };

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
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "From Date",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              others: {}
            }}
            value=""
            //minDate={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "To Date",
              isImp: false
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              others: {}
            }}
            value=""
            //minDate={this.state.from_date}
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
                          fieldName: "auditTime",
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
                          fieldName: "auditModule",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Module Name" }}
                            />
                          ),
                          others: {
                            maxWidth: 250
                          }
                        },
                        {
                          fieldName: "auditAction",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          others: {
                            maxWidth: 120
                          }
                        },
                        {
                          fieldName: "auditUser",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Username" }} />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "auditEmployee",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Name" }} />
                          ),
                          others: {
                            maxWidth: 250
                          }
                        },
                        {
                          fieldName: "auditParameter",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Parameter" }} />
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
