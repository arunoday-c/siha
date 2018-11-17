import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import IconButton from "@material-ui/core/IconButton";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  Tooltip
} from "../../Wrapper/algaehWrapper";

import {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  ProcessService,
  VisitSearch,
  deleteServices,
  SaveOrdersServices
} from "./OrderingServicesHandaler";
import "./OrderingServices.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";

class OrderingServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",

      patient_id: null,
      visit_id: null,
      doctor_id: null,

      insured: null,
      insurance_provider_id: null,
      hims_d_insurance_network_office_id: null,
      sub_insurance_provider_id: null,
      policy_number: null,
      network_id: null,
      sec_insured: null,
      secondary_insurance_provider_id: null,
      sec_sub_insurance_provider_id: null,
      sec_policy_number: null,
      secondary_network_id: null,
      secondary_network_office_id: null,
      orderservicesdata: [],
      approval_amt: 0,
      preapp_limit_amount: 0,
      preserviceInput: [],
      dummy_company_payble: 0,
      approval_limit_yesno: "N",
      insurance_service_name: null
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    if (this.props.services === undefined || this.props.services.length === 0) {
      this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "services"
        }
      });
    }

    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "serviceslist"
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      this.setState({ ...output });
    }
  }
  playclick() {
    
  }

  render() {
    let orderedList =
      this.state.orderservicesdata === undefined
        ? [{}]
        : this.state.orderservicesdata;

    return (
      <div className="hptl-phase1-ordering-services-form">
        {/* <div className="main-details" /> */}
        <div className="container-fluid">
          <div className="row form-details">
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "visit_code"
              }}
              textBox={{
                className: "txt-fld",
                name: "visit_code",
                value: this.state.visit_code,
                events: {
                  onChange: texthandle.bind(this, this)
                },
                error: this.state.open,
                helperText: this.state.userErrorText
              }}
            />

            <div className="col-lg-1 form-group print_actions">
              <span
                className="fas fa-search fa-2x"
                onClick={VisitSearch.bind(this, this)}
              />
            </div>

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "patient_code"
              }}
              textBox={{
                className: "txt-fld",
                name: "patient_code",
                value: this.state.patient_code,
                events: {
                  onChange: texthandle.bind(this, this)
                },
                disabled: true,
                error: this.state.open,
                helperText: this.state.userErrorText
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "full_name"
              }}
              textBox={{
                className: "txt-fld",
                name: "full_name",
                value: this.state.full_name,
                events: {
                  onChange: null
                },
                disabled: true
              }}
            />
          </div>
          <div className="row form-details">
            <div className="col-lg-1">
              <AlgaehLabel
                label={{
                  fieldName: "select_service"
                }}
              />
            </div>
            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              selector={{
                name: "s_service_type",
                className: "select-fld",
                value: this.state.s_service_type,
                dataSource: {
                  textField:
                    this.state.selectedLang === "en"
                      ? "service_type"
                      : "arabic_service_type",
                  valueField: "hims_d_service_type_id",
                  data: this.props.servicetype
                },
                onChange: serviceTypeHandeler.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              selector={{
                name: "s_service",
                className: "select-fld",
                value: this.state.s_service,
                dataSource: {
                  textField:
                    this.state.selectedLang === "en"
                      ? "service_name"
                      : "arabic_service_name",
                  valueField: "hims_d_services_id",
                  data: this.props.services
                },
                onChange: serviceHandeler.bind(this, this)
              }}
            />

            <div className="col-lg-2">
              <Tooltip id="tooltip-icon" title="Process">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled onClick={ProcessService.bind(this, this)} />
                </IconButton>
              </Tooltip>
            </div>

            <div className="col-lg-3"> &nbsp; </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <AlgaehDataGrid
                id="Services_Ordering"
                columns={[
                  {
                    fieldName: "service_type_id",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                    ),
                    displayTemplate: row => {
                      let display =
                        this.props.servicetype === undefined
                          ? []
                          : this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id === row.service_type_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? this.state.selectedLang === "en"
                              ? display[0].service_type
                              : display[0].arabic_service_type
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },

                  {
                    fieldName: "services_id",
                    label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.serviceslist === undefined
                          ? []
                          : this.props.serviceslist.filter(
                              f => f.hims_d_services_id === row.services_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? this.state.selectedLang === "en"
                              ? display[0].service_name
                              : display[0].arabic_service_name
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "quantity",
                    label: <AlgaehLabel label={{ fieldName: "quantity" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.quantity,
                            className: "txt-fld",
                            name: "quantity",
                            events: {
                              onChange: null
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "unit_cost",
                    label: <AlgaehLabel label={{ fieldName: "unit_cost" }} />,
                    disabled: true
                  },

                  {
                    fieldName: "gross_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "gross_amount" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "discount_percentage",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "discount_percentage" }}
                      />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: row.discount_percentage,
                            className: "txt-fld",
                            name: "discount_percentage",
                            events: {
                              onChange: null
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "discount_amout",
                    label: (
                      <AlgaehLabel label={{ fieldName: "discount_amout" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: row.discount_amout,
                            className: "txt-fld",
                            name: "discount_amout",
                            events: {
                              onChange: null
                            }
                          }}
                        />
                      );
                    }
                  },

                  {
                    fieldName: "net_amout",
                    label: <AlgaehLabel label={{ fieldName: "net_amout" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "insurance_yesno",
                    label: <AlgaehLabel label={{ fieldName: "insurance" }} />,
                    displayTemplate: row => {
                      return row.insurance_yesno === "Y"
                        ? "Covered"
                        : "Not Covered";
                    },
                    disabled: true
                  },
                  {
                    fieldName: "pre_approval",
                    label: (
                      <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pre_approval === "Y"
                            ? "Required"
                            : "Not Required"}
                          {row.pre_approval === "Y" ? (
                            <IconButton className="go-button" color="primary">
                              <PlayCircleFilled
                                onClick={this.playclick.bind(this)}
                              />
                            </IconButton>
                          ) : null}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "patient_payable",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "company_payble",
                    label: (
                      <AlgaehLabel label={{ fieldName: "company_payble" }} />
                    ),
                    disabled: true
                  }
                ]}
                keyId="service_type_id"
                dataSource={{
                  data: orderedList
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  onDelete: deleteServices.bind(this, this),
                  onEdit: row => {}
                  // onDone: this.updateBillDetail.bind(this)
                }}
              />
            </div>
          </div>
          <br />
        </div>

        <div className="row" position="fixed">
          <div className="col-lg-12">
            <span className="float-right">
              <button
                style={{ marginRight: "15px" }}
                className="htpl1-phase1-btn-primary"
                onClick={SaveOrdersServices.bind(this, this)}
              >
                <AlgaehLabel label={{ fieldName: "btnsave" }} />
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services,
    orderservices: state.orderservices,
    existinginsurance: state.existinginsurance,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderingServices)
);
