import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./IssueCertificate.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
// import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components/context";

import AlgaehSearch from "../../../Wrapper/globalSearch";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

class IssueCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: null,

      employee_name: null,
      certificate_type: null,
      certificate_types: [],
      kpi_parameters: [],
      hims_d_employee_id: null,
    };
  }

  componentWillUnmount() {
    this.clearState();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
      });
    }
    algaehApiCall({
      uri: "/Document/getKPI",
      method: "GET",
      module: "documentManagement",
      onSuccess: (response) => {
        const { data } = response;
        this.setState({ certificate_types: data["result"] });
      },
      onCatch: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
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
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id,
        });
      },
    });
  }

  clearState() {
    this.setState({
      employee_name: null,
      certificate_type: null,
      certificate_types: [],
      kpi_parameters: [],
      hims_d_employee_id: null,
    });
  }

  searchSelect(data) {
    this.setState({
      employee_id: data.hims_d_employee_id,
      full_name: data.full_name,
      display_name: data.full_name,
      sub_department_id: data.sub_department_id,
    });
  }
  onChangeHandler(e) {
    const { name, value } = e;
    let certificate = {};
    if (name === "certificate_type") {
      certificate = { kpi_parameters: e.selected.kpi_parameters };
    }
    this.setState({ [name]: value, ...certificate });
  }
  generateCertificate() {
    algaehApiCall({
      uri: "/getDocsReports",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        parameters: { hims_d_employee_id: this.state.hims_d_employee_id },
        _id: this.state.certificate_type,
      },
      onSuccess: (response) => {
        const urlBlob = URL.createObjectURL(response.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },
      onCatch: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  render() {
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Issue Certificate Direct</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group  mandatory" }}
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
                        data: this.props.organizations,
                      },
                      onChange: this.onChangeHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          hospital_id: null,
                        });
                      },
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "Select Certificate Type",
                      isImp: true,
                    }}
                    selector={{
                      name: "certificate_type",
                      className: "select-fld",
                      value: this.state.certificate_type,
                      dataSource: {
                        valueField: "_id",
                        textField: "kpi_name",
                        data: this.state.certificate_types,
                      },
                      onChange: this.onChangeHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          certificate_type: null,
                          kpi_parameters: [],
                        });
                      },
                    }}
                  />
                  <div className="col-12 globalSearchCntr form-group mandatory">
                    <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                    <h6 onClick={this.employeeSearch.bind(this)}>
                      {this.state.employee_name
                        ? this.state.employee_name
                        : "Search Employee"}
                      <i className="fas fa-search fa-lg" />
                    </h6>
                  </div>
                  <div className="col-12" style={{ textAlign: "right" }}>
                    <button
                      // onClick={this.clearState.bind(this)}
                      type="button"
                      className="btn btn-default"
                      style={{ marginRight: 15 }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={this.generateCertificate.bind(this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={this.state.Request_enable}
                    >
                      Generate Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Issue Certificate on request
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" style={{ minHeight: "55vh" }}>
                    <AlgaehDataGrid
                      id="employeeFormTemplate"
                      columns={[
                        {
                          fieldName: "employee_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. ID" }} />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          others: {
                            style: {
                              textAlign: "left",
                            },
                          },
                        },
                        {
                          fieldName: "requestDate",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested Date" }}
                            />
                          ),
                          others: {
                            maxWidth: 150,
                          },
                        },
                        {
                          fieldName: "requestedFor",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested For" }}
                            />
                          ),
                        },
                        {
                          fieldName: "url",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Print / Issue" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <div>
                                {" "}
                                <button className="">Issue</button>/
                                <button className="">Print</button>
                              </div>
                            );
                          },
                          others: {
                            maxWidth: 150,
                          },
                        },
                      ]}
                      keyId=""
                      dataSource={{
                        data: [
                          {
                            employee_id: "10045",
                            employee_name: "Aboobacker Sidhiqe",
                            requestDate: "07-01-2020",
                            requestedFor: "Salary Certificate",
                            url: "https://google.com",
                          },
                        ],
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                    />
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

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IssueCertificate)
);
