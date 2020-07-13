import React, { Component } from "react";

import "./GratuityAccrual.scss";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import { getYears, GetAmountFormart } from "../../../../utils/GlobalFunctions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import {
  texthandle,
  LoadGratuityAccrual,
  employeeSearch,
  ClearData,
} from "./GratuityAccrualEvent";
import { MainContext } from "algaeh-react-components";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

export default class GratuityAccrual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment(new Date()).format("M"),
      hims_d_employee_id: null,
      employee_name: null,
      gratuity_details: [],
      total_gratuity_amount: null,
      hospital_id: null,
    };
    this.getHospitals();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records,
          });
        }
      },
    });
  }
  render() {
    let allYears = getYears();
    return (
      <div className="row GratuityAccrualScreen">
        <div className="col-12" data-validate="loadGratuityAccrual">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Select a Branch",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals,
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
                others: {
                  disabled: this.state.lockEarnings,
                },
              }}
            />

            <div className="col-3 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name ? this.state.employee_name : "------"}
                <i className="fas fa-search fa-lg" />
              </h6>
            </div>

            <AlagehAutoComplete
              div={{ className: "col-1 mandatory form-group" }}
              label={{
                forceLabel: "Year",
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
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    year: null,
                  });
                },
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                forceLabel: "Month",
                isImp: true,
              }}
              selector={{
                sort: "off",
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS,
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    month: null,
                  });
                },
              }}
            />

            <div className="col-2">
              <button
                className="btn btn-default"
                style={{ marginTop: 19, marginRight: 10 }}
                onClick={ClearData.bind(this, this)}
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                style={{ marginTop: 19 }}
                onClick={LoadGratuityAccrual.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-8">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Gratuity Accrual List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveSalaryAccral_Cntr">
                  <AlgaehDataGrid
                    id="LeaveSalaryAccral"
                    datavalidate="LeaveSalaryAccral"
                    columns={[
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        ),
                        others: {
                          maxWidth: 150,
                        },
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        ),
                      },
                      {
                        fieldName: "month",
                        label: <AlgaehLabel label={{ forceLabel: "Month" }} />,
                        others: {
                          filterable: false,
                          maxWidth: 60,
                        },
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
                        others: {
                          filterable: false,
                          maxWidth: 50,
                        },
                      },
                      {
                        fieldName: "gratuity_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Gratuity Amount" }}
                          />
                        ),
                        others: {
                          filterable: false,
                          maxWidth: 140,
                        },
                      },
                    ]}
                    keyId=""
                    filter={true}
                    dataSource={{ data: this.state.gratuity_details }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Gratuity Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.total_gratuity_amount)}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Print", returnText: true }}
                />
              </button>
              <button
                type="button"
                className="btn btn-default"
             
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
