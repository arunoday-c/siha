import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./OpeningBalance.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import {
  AlgaehOpenContainer,
  getYears
} from "../../../../utils/GlobalFunctions";
import OpeningBalanceEvent from "./OpeningBalanceEvent";
import moment from "moment";
import AddEmployeeOpenBalance from "./SubModals/AddEmployeeOpenBalance";
const all_functions = OpeningBalanceEvent();

export default class EmployeeLeaveSalaryOpenBal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leave_salary_columns: [],
      leave_balance: [],
      year: moment().year(),
      leaves_data: [],
      openModal: false,
      application_leave: [],
      leave_id: null,
      error_upload: null,
      loan_master: []
    };
  }

  CloseModal(e) {
    this.setState({
      openModal: !this.state.openModal
    });
  }

  updateEmployeeOpeningBalance(row) {
    all_functions.updateEmployeeOpeningBalance(this, row, "LS");
  }

  showModal(HeaderCaption) {
    this.setState({
      openModal: !this.state.openModal,
      HeaderCaption: HeaderCaption
    });
  }

  componentWillReceiveProps(newProps) {
    debugger
    if (newProps.leave_salary_columns.length > 0) {
      this.setState({
        leave_salary_columns: newProps.leave_salary_columns,
        leave_balance: newProps.leave_balance,
        year: newProps.year,
        loan_master: newProps.loan_master
      });
    }
  }
  render() {
    return (
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">
              Opening balance for - Leave Salary
            </h3>
          </div>
          <div className="actions">
            <button
              className="btn btn-primary"
              style={{ color: "#fff" }}
              onClick={this.showModal.bind(
                this,
                "Employee Leave Salary Opening Balance"
              )}
            >
              Add Opening Balance
            </button>
          </div>
        </div>
        <div className="portlet-body">
          <div className="row">
            {this.state.leave_salary_columns.length > 0 ? (
              <div className="col-12">
                <AlgaehDataGrid
                  id="loan_opening_balance"
                  columns={this.state.leave_salary_columns}
                  keyId="loan_opening"
                  dataSource={{
                    data: this.state.leave_balance
                  }}
                  isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                  events={{
                    onEdit: () => { },
                    onDone: this.updateEmployeeOpeningBalance.bind(this)
                  }}
                  actions={{
                    allowDelete: false
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>

        <AddEmployeeOpenBalance
          show={this.state.openModal}
          onClose={this.CloseModal.bind(this)}
          HeaderCaption={this.state.HeaderCaption}
          selected_type="LS"
          year={this.state.year}
          loan_master={this.state.loan_master}
        />
      </div>
    );
  }
}
