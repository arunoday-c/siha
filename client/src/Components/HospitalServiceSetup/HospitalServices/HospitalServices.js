import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./HospitalServices.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  VatAppilicable,
  InsertServices,
  CptCodesSearch,
  clearData,
  numberEventHandaler
} from "./HospitalServicesEvent";
import { AlgaehActions } from "../../../actions/algaehActions";

// import { successfulMessage } from "../../../utils/GlobalFunctions";
import { getCookie, algaehApiCall } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";

class HospitalServices extends PureComponent {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      open: false,

      selectedLang: "en",
      Applicable: false,

      hims_d_services_id: null,
      service_code: null,
      cpt_code: null,
      service_name: null,
      hospital_id: null,
      service_type_id: null,

      standard_fee: 0,
      vat_applicable: "N",
      vat_percent: 0,
      cpt_code_data: null,
      sub_department_id: null,
      record_status: "A"
    };
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "service_code",
        tableName: "hims_d_services",
        keyFieldName: "hims_d_services_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            service_code_placeHolder: placeHolder.service_code
          });
        }
      }
    });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.servicePop.hims_d_services_id !== undefined) {
      let IOputs = newProps.servicePop;

      if (IOputs.vat_applicable === "Y") {
        IOputs.Applicable = true;
      } else {
        IOputs.Applicable = false;
      }

      this.setState({ ...this.state, ...IOputs });
    } else {
      clearData(this, this);
    }
  }
  onClose = e => {
    clearData(this, this);
    this.props.onClose && this.props.onClose(false);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-hospitalservies-form">
          <AlgaehModalPopUp
            title={this.props.HeaderCaption}
            class="HospitalServicesPopup"
            openPopup={this.props.open}
            events={{
              onClose: this.onClose.bind(this)
            }}
            className="popUpHospitalServices"
          >
            {/* <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </div> */}

            {/* <div className="popupInner"> */}
            <div
              className="col-12 popRightDiv margin-top-15 margin-bottom-15"
              data-validate="HospitalServices"
            >
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "service_code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "service_code",
                    value: this.state.service_code,
                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      tabIndex: "1",
                      placeholder: this.state.service_code_placeHolder
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "service_name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "service_name",
                    value: this.state.service_name,
                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-10 form-group" }}
                  label={{
                    fieldName: "cpt_code"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "cpt_code",
                    value: this.state.cpt_code_data,
                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <div className="col-1 form-group">
                  <i
                    className="fas fa-search"
                    onClick={CptCodesSearch.bind(this, this)}
                    style={{ marginTop: 25, fontSize: "1.4rem" }}
                  />
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "hospital_id",
                    isImp: true
                  }}
                  selector={{
                    name: "hospital_id",
                    className: "select-fld",
                    value: this.state.hospital_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "hospital_name"
                          : "arabic_hospital_name",
                      valueField: "hims_d_hospital_id",
                      data: this.props.hospitaldetails
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "sub_department_id"
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: this.state.sub_department_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "sub_department_name"
                          : "arabic_sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.props.subdepartments
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "service_type_id",
                    isImp: true
                  }}
                  selector={{
                    name: "service_type_id",
                    className: "select-fld",
                    value: this.state.service_type_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "service_type"
                          : "arabic_service_type",
                      valueField: "hims_d_service_type_id",
                      data: this.props.servicetype
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-6 form-group" }}
                  label={{
                    fieldName: "standard_fee",
                    isImp: true
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    className: "txt-fld",
                    name: "standard_fee",
                    value: this.state.standard_fee,
                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <div className="col-12 form-group">
                  <div className="row">
                    <div
                      className="col-6 customCheckbox"
                      style={{ paddingTop: "10px" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="vat_applicable"
                          value="Y"
                          checked={this.state.Applicable}
                          onChange={VatAppilicable.bind(this, this)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ fieldName: "vat_applicable" }}
                          />
                        </span>
                      </label>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        fieldName: "vat_percent"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "vat_percent",
                        value: this.state.vat_percent,
                        events: {
                          onChange: numberEventHandaler.bind(this, this)
                        },
                        others: {
                          disabled:
                            this.state.Applicable === true ? false : true,
                          type: "number"
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      // addServices
                      onClick={InsertServices.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.state.hims_d_services_id === null ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      <AlgaehLabel label={{ fieldName: "btnCancel" }} />
                    </button>

                    {this.state.hims_d_services_id === null ? (
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={clearData.bind(this, this)}
                      >
                        <AlgaehLabel label={{ fieldName: "btn_clear" }} />
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    subdepartments: state.subdepartments,
    hospitaldetails: state.hospitaldetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getSubDepatments: AlgaehActions,
      getHospitalDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HospitalServices)
);
