import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentProcess.css";
import { texthandler, LoadEncashment } from "./EncashmentProcessEvents.js";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class LeaveEncashmentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      encash_type: null,
      sel_employee_id: null
    };
  }

  componentDidMount() {
    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        method: "GET",

        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees"
        }
      });
    }
  }
  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search" data-validate="loadEncash">
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: texthandler.bind(this, this)
                },
                others: {
                  type: "number",
                  min: moment().year(),
                  disabled: this.state.lockEarnings
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Select an Employee",
                isImp: true
              }}
              selector={{
                name: "sel_employee_id",
                className: "select-fld",
                value: this.state.sel_employee_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "hims_d_employee_id",
                  data: this.props.all_employees
                },
                onChange: texthandler.bind(this, this),
                onClear: () => {
                  this.setState({
                    sel_employee_id: null
                  });
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Encashment Type",
                isImp: false
              }}
              selector={{
                name: "encash_type",
                className: "select-fld",
                value: this.state.encash_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.ENCASH_TYPE
                },
                onChange: texthandler.bind(this, this),

                onClear: () => {
                  this.setState({
                    sel_payment_type: null
                  });
                }
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 21 }}
                className="btn btn-primary"
                onClick={LoadEncashment.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Encashment Details</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveEncashProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveEncashProcessGrid"
                    datavalidate="leaveEncashProcessGrid"
                    columns={[
                      {
                        fieldName: "leaveType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDesc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfLeave",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
                      },
                      {
                        fieldName: "EncashmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "AirfareAmount" }}
                          />
                        )
                      },
                      {
                        fieldName: "AirfareTotalMonth",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Total Month" }}
                          />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              </button>

              <button type="button" className="btn btn-default">
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    all_employees: state.all_employees
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployees: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LeaveEncashmentProcess)
);
