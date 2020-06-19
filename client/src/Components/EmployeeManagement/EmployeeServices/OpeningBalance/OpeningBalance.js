import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./OpeningBalance.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  // AlgaehDataGrid,
  // AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
// import AlgaehSearch from "../../../Wrapper/globalSearch";
// import spotlightSearch from "../../../../Search/spotlightSearch.json";
// import GlobalVariables from "../../../../utils/GlobalVariables.json";
// import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { getYears } from "../../../../utils/GlobalFunctions";
// import EmployeeSearch from "../../../common/EmployeeSearch";
import OpeningBalanceEvent from "./OpeningBalanceEvent";
import moment from "moment";
import AddEmployeeOpenBalance from "./SubModals/AddEmployeeOpenBalance";
import EmployeeLeaveOpenBal from "./EmployeeLeaveOpenBal";
import EmployeeLoanOpenBal from "./EmployeeLoanOpenBal";
import EmployeeGratuityOpenBal from "./EmployeeGratuityOpenBal";
import EmployeeLeaveSalaryOpenBal from "./EmployeeLeaveSalaryOpenBal";
import { MainContext } from "algaeh-react-components/context";
import { AlgaehSecurityElement } from "algaeh-react-components";

const all_functions = OpeningBalanceEvent();

class OpeningBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_group_id: null,
      hospital_id: "",
      employee_name: null,
      hims_d_employee_id: null,
      leave_dynamic_date: [],
      selected_type: "LE",
      rerender_items: true,
      leave_balance: [],
      year: moment().year(),
      leaves_data: [],
      openModal: false,
      application_leave: [],
      leave_id: null,
      error_upload: null,
      loan_master: [],
      download_enable: false,
      loan_dynamic_date: [],
      gratuity_dynamic_date: [],
      leave_salary_columns: [],
      props_enable: false,
    };
    all_functions.getLeaveMaster(this);
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
    if (
      this.props.emp_groups === undefined ||
      this.props.emp_groups.length === 0
    ) {
      this.props.getEmpGroups({
        uri: "/hrsettings/getEmployeeGroups",
        module: "hrManagement",
        method: "GET",
        data: { record_status: "A" },
        redux: {
          type: "EMP_GROUP_GET",
          mappingName: "emp_groups",
        },
      });
    }
  }

  clearState() {
    all_functions.getLeaveMaster(this);
    this.setState({
      employee_group_id: null,
      hospital_id: "",
      employee_name: null,
      hims_d_employee_id: null,
      leave_dynamic_date: [],
      selected_type: "LE",
      rerender_items: true,
      leave_id: null,
      year: moment().year(),
      leave_balance: [],
      error_upload: null,
    });
  }

  PreviewData() {
    all_functions.PreviewData(this);
  }

  texthandle(e) {
    all_functions.texthandle(this, e);
  }

  employeeSearch() {
    all_functions.employeeSearch(this);
  }

  UploadTimesheet(files) {
    all_functions.UploadTimesheet(this, files);
  }
  changeChecks(e) {
    all_functions.changeChecks(this, e);
  }

  updateEmployeeOpeningBalance(row) {
    all_functions.updateEmployeeOpeningBalance(this, row);
  }

  CloseModal(e) {
    this.setState({
      openModal: !this.state.openModal,
    });
  }
  showModal(HeaderCaption) {
    this.setState({
      openModal: !this.state.openModal,
      HeaderCaption: HeaderCaption,
    });
  }

  downloadExcel() {
    all_functions.downloadExcel(this);
  }

  render() {
    let allYears = getYears();
    let fileInput = React.createRef();

    return (
      <div className="openingBalanceScreen">
        <div className="row inner-top-search" style={{ marginTop: "-7px" }}>
          <div className="col-4 form-group">
            <label className="label">Enter Opening Balance For</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value="LE"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LE"}
                />
                <span>Leave</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="LO"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LO"}
                />
                <span>Loan</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="GR"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "GR"}
                />
                <span>Gratuity</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="LS"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LS"}
                />
                <span>Annual Leave Salary</span>
              </label>
            </div>
          </div>

          <AlagehAutoComplete
            div={{ className: "col-1 mandatory" }}
            label={{
              forceLabel: "Year.",
              isImp: true,
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears,
              },
              onChange: this.texthandle.bind(this),

              onClear: () => {
                this.setState({
                  year: null,
                });
              },
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              forceLabel: "Branch",
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
              onChange: this.texthandle.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null,
                });
              },
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Employee Group",
              isImp: false,
            }}
            selector={{
              name: "employee_group_id",
              className: "select-fld",
              value: this.state.employee_group_id,
              dataSource: {
                textField: "group_description",
                valueField: "hims_d_employee_group_id",
                data: this.props.emp_groups,
              },
              onChange: this.texthandle.bind(this),
              onClear: () => {
                this.setState({
                  employee_group_id: null,
                });
              },
            }}
          />
          <div className="col globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>

          <div className="col-12 form-group" style={{ textAlign: "right" }}>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
            >
              Clear
            </button>
            <button
              onClick={this.PreviewData.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
            >
              <i className="fas fa-eye"></i> Preview
            </button>
            <button
              onClick={this.downloadExcel.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
              disabled={this.state.download_enable}
            >
              <i className="fas fa-file-download"></i> Download
            </button>

            <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
              <div className="uploadManualDiv   btn-with-icon">
                <input
                  className="inputfile"
                  type="file"
                  name="manualTimeSheet"
                  ref={fileInput}
                  onChange={(e) => {
                    if (e.target.files.length > 0)
                      this.UploadTimesheet(e.target.files);
                  }}
                />
                <label onClick={() => fileInput.current.click()}>
                  <i className="fas fa-file-upload"></i> Upload
                </label>
              </div>
            </AlgaehSecurityElement>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {this.state.error_upload ? this.state.error_upload : ""}
            {this.state.selected_type === "LE" ? (
              <EmployeeLeaveOpenBal
                leave_dynamic_date={this.state.leave_dynamic_date}
                leave_balance={this.state.leave_balance}
                year={this.state.year}
                hospital_id={this.state.hospital_id}
              />
            ) : this.state.selected_type === "LO" ? (
              <EmployeeLoanOpenBal
                loan_dynamic_date={this.state.loan_dynamic_date}
                leave_balance={this.state.leave_balance}
                year={this.state.year}
                hospital_id={this.state.hospital_id}
                loan_master={this.state.loan_master}
              />
            ) : this.state.selected_type === "GR" ? (
              <EmployeeGratuityOpenBal
                gratuity_dynamic_date={this.state.gratuity_dynamic_date}
                leave_balance={this.state.leave_balance}
                year={this.state.year}
                hospital_id={this.state.hospital_id}
                loan_master={this.state.loan_master}
              />
            ) : this.state.selected_type === "LS" ? (
              <EmployeeLeaveSalaryOpenBal
                leave_salary_columns={this.state.leave_salary_columns}
                leave_balance={this.state.leave_balance}
                year={this.state.year}
                hospital_id={this.state.hospital_id}
                loan_master={this.state.loan_master}
              />
            ) : null}
          </div>
        </div>

        <AddEmployeeOpenBalance
          show={this.state.openModal}
          onClose={this.CloseModal.bind(this)}
          HeaderCaption={this.state.HeaderCaption}
          selected_type={this.state.selected_type}
          year={this.state.year}
          hospital_id={this.state.hospital_id}
          loan_master={this.state.loan_master}
        />
        {/* </div> */}
        {/* <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Download Report", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
    emp_groups: state.emp_groups,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getEmpGroups: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OpeningBalance)
);
