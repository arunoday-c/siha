import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./insurancesetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import InsuranceAdd from "./InsuranceAdd/InsuranceAdd";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import GlobalVariables from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";
import AppBar from "@material-ui/core/AppBar";

class InsuranceSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      opencomponent: 0,
      addfunctionality: true,
      buttonenable: false
    };
  }

  componentDidMount() {
    if (
      this.props.insProviders === undefined ||
      this.props.insProviders.length === 0
    ) {
      this.props.getInsuranceProviders({
        uri: "/insurance/getListOfInsuranceProvider",
        method: "GET",
        redux: {
          type: "INSURANCE_PROVIDER_GET_DATA",
          mappingName: "insProviders"
        }
      });
    }
  }

  ShowModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        addfunctionality: true,
        buttonenable: false,
        insurance_provider_id: null,
        insurance_provider_name: null
      },
      () => {}
    );
  }
  getCtrlCode(insCode) {}

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      opencomponent: e.value,
      buttonenable: true,
      insurance_provider_id: row.hims_d_insurance_provider_id,
      insurance_provider_name: row.insurance_provider_name,
      isOpen: true,
      addfunctionality: false
    });
  }

  render() {
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "form_home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            }
          ]}
        />
        <div className="row" style={{ marginTop: 90 }}>
          {/* <div className="tab-container toggle-section">
              <ul className="nav">
                <li className={"nav-item tab-button active"}>
                  <label class="style_Label ">Insurance Provider List</label>
                </li>
              </ul>
            </div> */}

          <div className="col-lg-12">
            <AlgaehDataGrid
              id="insurance_grid"
              columns={[
                {
                  fieldName: "edit_option",
                  label: "Actions",
                  disabled: false,
                  displayTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{}}
                        selector={{
                          name: "edit_option",
                          className: "select-fld",
                          value: row.edit_option,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_INSURANCE_EDIT_OPTION
                          },
                          onChange: this.setUpdateComponent.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "sl_no",
                  label: "#",
                  disabled: true
                },
                {
                  fieldName: "insurance_type",
                  label: "Type",
                  disabled: true,
                  displayTemplate: row => {
                    return row.insurance_type === "I"
                      ? "Insurance Company"
                      : "Inactive";
                  }
                },
                {
                  fieldName: "currency",
                  label: "Currency",
                  disabled: true
                },
                {
                  fieldName: "insurance_provider_name",
                  label: "Insurance Name",
                  disabled: true
                },
                {
                  fieldName: "insurance_provider_code",
                  label: "Provider ID",
                  disabled: true
                },
                {
                  fieldName: "payment_type",
                  label: "Payment Type",
                  disabled: true
                },
                {
                  fieldName: "credit_period",
                  label: "Credit Period",
                  disabled: true
                },
                {
                  fieldName: "effective_start_date",
                  label: "Active From",
                  displayTemplate: row => {
                    return (
                      <span>
                        {this.changeDateFormat(row.effective_start_date)}
                      </span>
                    );
                  },
                  disabled: true
                },
                {
                  fieldName: "effective_end_date",
                  label: "Valid Upto",
                  displayTemplate: row => {
                    return (
                      <span>
                        {this.changeDateFormat(row.effective_end_date)}
                      </span>
                    );
                  },
                  disabled: true
                }
              ]}
              keyId="identity_document_code"
              dataSource={{
                data:
                  this.props.insProviders === undefined
                    ? []
                    : this.props.insProviders
              }}
              // isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
            />
          </div>
        </div>
        {/* Footer Start */}

        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.ShowModel.bind(this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_save", returnText: true }}
                  /> */}
                  Add New
                </button>

                <InsuranceAdd
                  HeaderCaption={
                    <AlgaehLabel
                      label={{
                        fieldName: "add_insurance",
                        align: "ltr"
                      }}
                    />
                  }
                  open={this.state.isOpen}
                  onClose={this.ShowModel.bind(this)}
                  opencomponent={this.state.opencomponent}
                  addfunctionality={this.state.addfunctionality}
                  buttonenable={this.state.buttonenable}
                  insurance_provider_id={this.state.insurance_provider_id}
                  insurance_provider_name={this.state.insurance_provider_name}
                />
              </div>
            </div>
          </AppBar>
        </div>

        {/* Footer End */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    insProviders: state.insProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceProviders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceSetup)
);
