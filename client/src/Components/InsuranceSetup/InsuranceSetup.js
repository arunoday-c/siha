import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./insurancesetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import InsuranceAdd from "./InsuranceAdd/InsuranceAdd";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import GlobalVariables from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";
import AppBar from "@material-ui/core/AppBar";
import { setGlobal } from "../../utils/GlobalFunctions";
import { getCookie } from "../../utils/algaehApiCall";

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
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({ selectedLang: prevLang });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      addfunctionality: true,
      buttonenable: false,
      insurance_provider_id: null,
      insurance_provider_name: null
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        addfunctionality: true,
        buttonenable: false,
        insurance_provider_id: null,
        insurance_provider_name: null
      },
      () => {
        this.props.getInsuranceProviders({
          uri: "/insurance/getListOfInsuranceProvider",
          method: "GET",
          redux: {
            type: "INSURANCE_PROVIDER_GET_DATA",
            mappingName: "insProviders"
          }
        });
      }
    );
  }

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

          <div className="col-lg-12" id="insuranceGridCntr">
            <AlgaehDataGrid
              id="insurance_grid"
              columns={[
                {
                  fieldName: "edit_option",
                  label: <AlgaehLabel label={{ fieldName: "edit_option" }} />,
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
                  },
                  others: {
                    filterable: false
                  }
                },
                {
                  fieldName: "insurance_type",
                  label: (
                    <AlgaehLabel label={{ fieldName: "insurance_type" }} />
                  ),
                  disabled: true,
                  displayTemplate: row => {
                    return row.insurance_type === "I"
                      ? "Insurance Company"
                      : "Inactive";
                  }
                },
                {
                  fieldName: "currency",
                  label: <AlgaehLabel label={{ fieldName: "currency" }} />,
                  disabled: true
                },
                {
                  fieldName: "insurance_provider_name",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "insurance_provider_name" }}
                    />
                  ),
                  disabled: true,
                  id: "insuranceProviderName"
                },
                {
                  fieldName: "insurance_provider_code",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "insurance_provider_code" }}
                    />
                  ),
                  disabled: true,
                  accessor: "providerID"
                },
                {
                  fieldName: "payment_type",
                  label: <AlgaehLabel label={{ fieldName: "payment_type" }} />,
                  disabled: true
                },
                {
                  fieldName: "credit_period",
                  label: <AlgaehLabel label={{ fieldName: "credit_period" }} />,
                  disabled: true
                },
                {
                  fieldName: "effective_start_date",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "effective_start_date" }}
                    />
                  ),
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
                  label: (
                    <AlgaehLabel label={{ fieldName: "effective_end_date" }} />
                  ),
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
              filter={true}
              // isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              others={{
                defaultSorted: [
                  {
                    id: "insuranceProviderName",
                    desc: false
                  }
                ]
              }}
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
                  Add New Insurance
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
                  onClose={this.CloseModel.bind(this)}
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
