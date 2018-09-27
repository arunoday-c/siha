import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";
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
  dateFormater,
  getCtrlCode,
  SaveDoctorCommission,
  deleteDoctorCommission,
  ClearData,
  PostDoctorCommission
} from "./DoctorCommissionEvents";
import "./DoctorCommission.css";
import "../../styles/site.css";
import { AlgaehActions } from "../../actions/algaehActions";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import GlobalVariables from "../../utils/GlobalVariables.json";

class DoctorCommission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SnackbarOpen: false,
      providers: [],
      select_type: "AS",
      doctor_id: null,
      from_date: null,
      to_date: null,
      select_service: null,
      case_type: "OP"
    };
  }

  componentDidMount() {
    this.props.getProviderDetails({
      uri: "/employee/get",
      method: "GET",
      redux: {
        type: "DOCTOR_GET_DATA",
        mappingName: "providers"
      },
      afterSuccess: data => {
        debugger;
        let providers = Enumerable.from(data)
          .where(w => w.isdoctor === "Y")
          .toArray();
        this.setState({ providers: providers });
      }
    });

    this.props.getServiceTypes({
      uri: "/serviceType",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetype"
      }
    });
  }

  handleClose = () => {
    this.setState({ SnackbarOpen: false });
  };

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
                fieldName: "doctorcommission.intstock"
              },
              searchName: "doctorcommission"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "Commission Date" }} />
                  ),
                  className: "internal-label"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date"
                }}
                disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.initial_stock_date}
              />
            }
            selectedLang={this.state.selectedLang}
          />

          <div className="hptl-phase1-initial-stock-form">
            {/* description */}
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    forceLabel: "Doctor"
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
                  div={{ className: "col-lg-2" }}
                  label={{ forceLabel: "Form Date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  maxDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />

                <AlgaehDateHandler
                  div={{ className: "col-lg-2" }}
                  label={{ forceLabel: "To Date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  maxDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.to_date}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    forceLabel: "Select Type"
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
                  div={{ className: "col-lg-1" }}
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

                <div className="col-lg-2">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "24px" }}
                    onClick={LoadBills.bind(this, this)}
                  >
                    Load Bills
                  </button>
                </div>
              </div>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
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

                <div className="col-lg-2">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "24px" }}
                    // onClick={AddItems.bind(this, this)}
                  >
                    Calculate Commission
                  </button>
                </div>

                <div className="col-lg-2">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "24px" }}
                    onClick={LoadBills.bind(this, this)}
                  >
                    Load Bills
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-12" style={{ maxWidth: "75%" }}>
              <div className="row form-group">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "bill_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Bill Number" }} />
                      )
                    },
                    {
                      fieldName: "bill_date",
                      label: <AlgaehLabel label={{ forceLabel: "Bill Date" }} />
                      //   displayTemplate: row => {
                      //     return <span>{dateFormater(row.bill_date)}</span>;
                      //   }
                    },
                    {
                      fieldName: "servtype_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Type" }} />
                      )
                    },
                    {
                      fieldName: "service_id",
                      label: <AlgaehLabel label={{ forceLabel: "Service" }} />
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                    },
                    {
                      fieldName: "unit_cost",
                      label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    },
                    {
                      fieldName: "extended_cost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Extended Cost" }} />
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
                        <AlgaehLabel label={{ forceLabel: "Patient Share" }} />
                      )
                    },
                    {
                      fieldName: "company_share",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Company Share" }} />
                      )
                    },
                    {
                      fieldName: "net_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Net Amount" }} />
                      )
                    },
                    {
                      fieldName: "op_cash_comission_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "OP Cash Comm. Type" }}
                        />
                      )
                    },
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
                        <AlgaehLabel label={{ forceLabel: "OP Cash Comm." }} />
                      )
                    },
                    {
                      fieldName: "op_crd_comission_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "OP Criedt Comm. Type" }}
                        />
                      )
                    },
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
                    data: this.props.billscommission
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

            <div className="hptl-phase1-footer">
              <AppBar position="static" className="main">
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

                    <AHSnackbar
                      open={this.state.SnackbarOpen}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
                    <button
                      type="button"
                      className="btn btn-default"
                      //   onClick={ClearData.bind(this, this)}
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
                          forceLabel: "Post",
                          returnText: true
                        }}
                      />
                    </button>
                  </div>
                </div>
              </AppBar>
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
    billscommission: state.billscommission
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProviderDetails: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getDoctorCommission: AlgaehActions,
      getDoctorsCommission: AlgaehActions
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
