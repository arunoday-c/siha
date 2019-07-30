import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  LoadBills,
  datehandle,
  ClearData,
  CalculateCommission,
  AdjustAmountCalculate,
  dateValidate
} from "./DoctorCommissionEvents";
import "./DoctorCommission.css";
import "../../styles/site.css";
import { AlgaehActions } from "../../actions/algaehActions";

import GlobalVariables from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";

import { getAmountFormart } from "../../utils/GlobalFunctions";

class DoctorCommission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      providers: [],
      select_type: "AS",
      doctor_id: null,
      from_date: null,
      to_date: null,
      select_service: null,
      case_type: "OP",
      adjust_amount: 0,
      billscommission: [],
      op_commision: 0,
      op_credit_comission: 0,
      gross_comission: 0,
      comission_payable: 0
    };
  }

  componentDidMount() {
    this.props.getProviderDetails({
      uri: "/employee/get",
      module: "hrManagement",
      method: "GET",
      redux: {
        type: "DOCTOR_GET_DATA",
        mappingName: "providers"
      },
      afterSuccess: data => {
        let providers = Enumerable.from(data)
          .where(w => w.isdoctor === "Y")
          .toArray();
        this.setState({ providers: providers });
      }
    });

    this.props.getServiceTypes({
      uri: "/serviceType",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetype"
      }
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "services"
      }
    });
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Doctor's Commission", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            //breadWidth={this.props.breadWidth}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Doctor's Commission", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Commission Number", returnText: true }}
                />
              ),
              value: this.state.commission_number,
              selectValue: "commission_number",
              events: {
                onChange: null
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "DoctorCommission.doccpmmission"
              },
              searchName: "DoctorCommission"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: "Commision Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date"
                }}
                disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.doctoCommGrid_date}
              />
            }
            selectedLang={this.state.selectedLang}
          />

          <div className="hptl-phase1-doctor-commission-form">
            <div
              className="row inner-top-search"
              style={{ marginTop: 76, paddingBottom: 10 }}
              data-validate="DoctorData"
            >
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true
                }}
                selector={{
                  name: "doctor_id",
                  className: "select-fld",
                  value: this.state.doctor_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "hims_d_employee_id",
                    data: this.state.providers
                  },

                  onChange: changeTexts.bind(this, this)
                }}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "Form Date", isImp: true }}
                textBox={{ className: "txt-fld", name: "from_date" }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this)
                }}
                value={this.state.from_date}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Date", isImp: true }}
                textBox={{ className: "txt-fld", name: "to_date" }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this)
                }}
                value={this.state.to_date}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select Type",
                  isImp: true
                }}
                selector={{
                  name: "select_type",
                  className: "select-fld",
                  value: this.state.select_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.SERVICE_COMMISSION
                  },

                  onChange: changeTexts.bind(this, this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Service Type"
                }}
                selector={{
                  name: "select_service",
                  className: "select-fld",
                  value: this.state.select_service,
                  dataSource: {
                    textField: "service_type",
                    valueField: "hims_d_service_type_id",
                    data: this.props.servicetype
                  },
                  others: {
                    disabled: this.state.select_type === "AS" ? true : false
                  },
                  onChange: changeTexts.bind(this, this)
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Case Type"
                }}
                selector={{
                  name: "case_type",
                  className: "select-fld",
                  value: this.state.case_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.CASE_TYPE
                  },
                  others: {
                    disabled: true
                  },
                  onChange: changeTexts.bind(this, this)
                }}
              />

              <div className="col">
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "24px" }}
                  onClick={LoadBills.bind(this, this)}
                >
                  Load Bills
                </button>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Bill Lists</h3>
                </div>
                <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    onClick={CalculateCommission.bind(this, this)}
                  >
                    <i className="fas fa-calculator" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="Doc_Com_grid_cntr">
                    <AlgaehDataGrid
                      id="doctoCommGrid"
                      columns={[
                        {
                          fieldName: "bill_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Bill Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "bill_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Bill Date" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{this.dateFormater(row.bill_date)}</span>
                            );
                          }
                        },
                        {
                          fieldName: "servtype_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.servicetype === undefined
                                ? []
                                : this.props.servicetype.filter(
                                    f =>
                                      f.hims_d_service_type_id ===
                                      row.servtype_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].service_type
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "service_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Service" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.services === undefined
                                ? []
                                : this.props.services.filter(
                                    f => f.hims_d_services_id === row.service_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].service_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                          )
                        },
                        {
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                          )
                        },
                        {
                          fieldName: "extended_cost",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extended Cost" }}
                            />
                          )
                        },
                        {
                          fieldName: "discount_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Discount Amount" }}
                            />
                          )
                        },

                        {
                          fieldName: "patient_share",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Patient Share" }}
                            />
                          )
                        },
                        {
                          fieldName: "company_share",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Co. Share" }} />
                          )
                        },
                        {
                          fieldName: "net_amount",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Net Amount" }} />
                          )
                        },
                        // {
                        //   fieldName: "op_cash_comission_type",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "OP Cash Comm. Type" }}
                        //     />
                        //   )
                        // },
                        {
                          fieldName: "op_cash_comission_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm. %" }}
                            />
                          )
                        },

                        {
                          fieldName: "op_cash_comission_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm. Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "op_cash_comission",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm." }}
                            />
                          )
                        },
                        // {
                        //   fieldName: "op_crd_comission_type",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "OP Criedt Comm. Type" }}
                        //     />
                        //   )
                        // },
                        {
                          fieldName: "op_crd_comission_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm. %" }}
                            />
                          )
                        },
                        {
                          fieldName: "op_crd_comission_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm. Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "op_crd_comission",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm." }}
                            />
                          )
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data: this.state.billscommission
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        //   onDelete: deleteServices.bind(this, this),
                        onEdit: row => {}
                        // onDone: this.updateBillDetail.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "OP Commision"
                  }}
                />
                <h6>{getAmountFormart(this.state.op_commision)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "OP Credit Comission"
                  }}
                />
                <h6>{getAmountFormart(this.state.op_credit_comission)}</h6>
              </div>

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Gross Comission"
                  }}
                />
                <h6>{getAmountFormart(this.state.gross_comission)}</h6>

                {/* adjust_amount */}
              </div>

              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Adjust Amount"
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.adjust_amount,
                  className: "txt-fld",
                  name: "adjust_amount",

                  events: {
                    onChange: AdjustAmountCalculate.bind(this, this)
                  },
                  others: {
                    placeholder: "0.00"
                  }
                }}
              />

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Comission Payable"
                  }}
                />
                <h6>{getAmountFormart(this.state.comission_payable)}</h6>
              </div>
            </div>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={SaveDoctorCommission.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-other"
                    //   onClick={PostDoctorCommission.bind(this, this)}
                    disabled={this.state.postEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Generate Payment",
                        returnText: true
                      }}
                    />
                  </button>
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
    providers: state.providers,
    servicetype: state.servicetype,
    doctorcommission: state.doctorcommission,
    billscommission: state.billscommission,
    services: state.services,
    headercommission: state.headercommission
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProviderDetails: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getDoctorCommission: AlgaehActions,
      getDoctorsCommission: AlgaehActions,
      getServices: AlgaehActions,
      CalculateCommission: AlgaehActions,
      calculateCommission: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DoctorCommission)
);
