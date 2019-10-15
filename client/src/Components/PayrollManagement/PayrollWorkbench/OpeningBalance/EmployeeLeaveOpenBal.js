import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
const all_functions = OpeningBalanceEvent();

class EmployeeLeaveOpenBal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leave_dynamic_date: [],
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
    // all_functions.getLeaveMaster(this);
  }

  CloseModal(e) {
    this.setState({
      openModal: !this.state.openModal
    });
  }

  updateEmployeeOpeningBalance(row) {
    all_functions.updateEmployeeOpeningBalance(this, row, "LE");
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.leave_dynamic_date.length > 0) {
      this.setState({
        leave_dynamic_date: newProps.leave_dynamic_date,
        leave_balance: newProps.leave_balance,
        year: newProps.year,
        hospital_id: newProps.hospital_id
      });
    }
  }
  render() {
    return (
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Opening balance for - Leave</h3>
          </div>
        </div>
        <div className="portlet-body">
          <div className="row">
            {this.state.leave_dynamic_date.length > 0 ? (
              <div className="col-12">
                <AlgaehDataGrid
                  id="leave_opening_balance"
                  columns={this.state.leave_dynamic_date}
                  keyId="leave_opening"
                  dataSource={{
                    data: this.state.leave_balance
                  }}
                  isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                  // forceRender={true}
                  events={{
                    onEdit: () => {},
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
    emp_groups: state.emp_groups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getEmpGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeLeaveOpenBal)
);
