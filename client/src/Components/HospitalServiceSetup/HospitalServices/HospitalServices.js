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
  Modal
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  VatAppilicable,
  InsertServices,
  CptCodesSearch,
  clearData
} from "./HospitalServicesEvent";
import { AlgaehActions } from "../../../actions/algaehActions";

// import { successfulMessage } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";

import AHSnackbar from "../../common/Inputs/AHSnackbar.js";

class HospitalServices extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      MandatoryMsg: "",
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
      changesDone: false
    };
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
      }

      this.setState({ ...this.state, ...IOputs });
    } else {
      clearData(this, this);
    }
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(this.state.changesDone);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-hospitalservies-form">
          <Modal open={this.props.open}>
            <div className="algaeh-modal" data-validate="HospitalServices">
              <div className="popupHeader">
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
              </div>

              <div className="popupInner">
                <div
                  className="col-12 popRightDiv"
                  style={{ minHeight: "60vh" }}
                >
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
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
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
                      label={{
                        fieldName: "cpt_code",
                        isImp: true
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
                    {/* <AlagehAutoComplete
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "cpt_code",
                        isImp: true
                      }}
                      selector={{
                        name: "cpt_code",
                        className: "select-fld",
                        value: this.state.cpt_code,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "cpt_code"
                              : "cpt_code",
                          valueField: "hims_d_cpt_code_id",
                          data: this.props.cptcodes
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    /> */}

                    <div className="col">
                      <i
                        className="fas fa-search"
                        onClick={CptCodesSearch.bind(this, this)}
                        style={{ marginTop: 25, fontSize: "1.4rem" }}
                      />
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "sub_department_id",
                        isImp: true
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
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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

                    <div className="col">
                      <div className="row">
                        <div
                          className="col-lg-5 customCheckbox"
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
                          div={{ className: "col-lg-7" }}
                          label={{
                            fieldName: "vat_percent"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "vat_percent",
                            value: this.state.vat_percent,
                            events: {
                              onChange: texthandle.bind(this, this)
                            },
                            others: {
                              disabled:
                                this.state.Applicable === true ? false : true
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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

                      <AHSnackbar
                        open={this.state.open}
                        handleClose={this.handleClose}
                        MandatoryMsg={this.state.MandatoryMsg}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
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
