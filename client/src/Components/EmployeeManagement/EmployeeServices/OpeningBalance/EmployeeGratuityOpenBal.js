import React, { Component } from "react";

import "./OpeningBalance.scss";
import { AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import OpeningBalanceEvent from "./OpeningBalanceEvent";
import moment from "moment";
import AddEmployeeOpenBalance from "./SubModals/AddEmployeeOpenBalance";
const all_functions = OpeningBalanceEvent();

export default class EmployeeGratuityOpenBal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gratuity_dynamic_date: [],

      leave_balance: [],
      year: moment().year(),
      leaves_data: [],
      openModal: false,
      application_leave: [],
      leave_id: null,
      error_upload: null,
      loan_master: [],
      download_enable: false
    };
  }

  CloseModal(e) {
    this.setState({
      openModal: !this.state.openModal
    });
  }
  showModal(HeaderCaption) {
    this.setState({
      openModal: !this.state.openModal,
      HeaderCaption: HeaderCaption
    });
  }

  updateEmployeeOpeningBalance(row) {
    all_functions.updateEmployeeOpeningBalance(this, row, "GR");
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.gratuity_dynamic_date.length > 0) {
      this.setState({
        gratuity_dynamic_date: newProps.gratuity_dynamic_date,
        leave_balance: newProps.leave_balance,
        year: newProps.year,
        hospital_id: newProps.hospital_id,
        loan_master: newProps.loan_master
      });
    }
  }
  render() {
    return (
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Opening balance for - Gratuity</h3>
          </div>
          <div className="actions">
            <button
              className="btn btn-primary"
              style={{ color: "#fff" }}
              onClick={this.showModal.bind(
                this,
                "Employee Gratuity Opening Balance"
              )}
            >
              Add Opening Balance
            </button>
          </div>
        </div>
        <div className="portlet-body">
          <div className="row">
            {this.state.gratuity_dynamic_date.length > 0 ? (
              <div className="col-12">
                <AlgaehDataGrid
                  id="leave_opening_balance"
                  columns={this.state.gratuity_dynamic_date}
                  keyId="leave_opening"
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
          selected_type="GR"
          year={this.state.year}
          hospital_id={this.state.hospital_id}
          loan_master={this.state.loan_master}
        />
      </div>
    );
  }
}
