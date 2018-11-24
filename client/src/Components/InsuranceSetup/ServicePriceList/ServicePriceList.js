import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ServicePriceList.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  onchangegridcol,
  updatePriceList,
  onchangecalculation,
  bulkUpdate,
  serviceTypeHandeler,
  getPriceList,
  Refresh
} from "./ServicePriceListHandaler";
import GlobalVariables from "../../../utils/GlobalVariables";

class SubInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      applicable: null,
      corporate_discount: 0,
      dummy: true
      // pre_approval: null,
      // insurance_service_name: ""
    };
    this.baseState = this.state;
  }

  componentWillMount() {
    let InputOutput = this.props.InsuranceSetup;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.state.insurance_provider_id !== null) {
      getPriceList(this, this);
    } else {
      this.props.initialPriceList({
        redux: {
          type: "PRICE_LIST_GET_DATA",
          mappingName: "pricelist",
          data: []
        }
      });
    }

    if (
      this.props.insservicetype === undefined ||
      this.props.insservicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "insservicetype"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-price-insurance-form">
          <div className="col-12 popLeftDiv">
            {/* Services Details */}

            <div
              style={{ paddingBottom: 15, borderBottom: "1px solid #d3d3d3" }}
            >
              <div className="row">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Insurar Name"
                    }}
                  />
                  <h6>
                    {this.state.insurance_provider_name
                      ? this.state.insurance_provider_name
                      : "Insurar Name"}
                  </h6>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{
                    fieldName: "filter_by"
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
                      data: this.props.insservicetype
                    },
                    onChange: serviceTypeHandeler.bind(this, this)
                  }}
                />

                <div className="col-lg-2">
                  <button
                    className="btn btn-default"
                    style={{ marginTop: 22 }}
                    onClick={Refresh.bind(this, this)}
                  >
                    Refresh List
                  </button>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "corporate_discount"
                      }}
                      textBox={{
                        value: this.state.corporate_discount,
                        className: "txt-fld",
                        name: "corporate_discount",
                        events: {
                          onChange: texthandle.bind(this, this)
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "applicable",
                        isImp: true
                      }}
                      selector={{
                        name: "applicable",
                        className: "select-fld",
                        value: this.state.applicable,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_DISCOUNT
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />

                    <div className="col" style={{ padding: 0 }}>
                      <button
                        className="btn btn-default"
                        style={{ marginTop: 22 }}
                        onClick={bulkUpdate.bind(
                          this,
                          this,
                          "corporate_discount"
                        )}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "pre_approval",
                        isImp: true
                      }}
                      selector={{
                        name: "pre_approval",
                        className: "select-fld",
                        value: this.state.pre_approval,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />{" "}
                    <div className="col" style={{ padding: 0 }}>
                      <button
                        className="btn btn-default"
                        style={{ marginTop: 22 }}
                        onClick={bulkUpdate.bind(this, this, "pre_approval")}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "covered",
                        isImp: true
                      }}
                      selector={{
                        name: "covered",
                        className: "select-fld",
                        value: this.state.covered,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />

                    <div className="col" style={{ padding: 0 }}>
                      <button
                        className="btn btn-default"
                        style={{ marginTop: 22 }}
                        onClick={bulkUpdate.bind(this, this, "covered")}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="service_price_grid"
                  columns={[
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "service_name" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "cpt_code",
                      label: <AlgaehLabel label={{ fieldName: "cpt_code" }} />,
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.cpt_code,
                              className: "txt-fld",
                              name: "cpt_code",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "insurance_service_name",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "insurance_service_name" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.insurance_service_name,
                              className: "txt-fld",
                              name: "insurance_service_name",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "gross_amt",
                      label: <AlgaehLabel label={{ fieldName: "gross_amt" }} />,
                      displayTemplate: row => {
                        return row.gross_amt.toFixed(2);
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              decimal: { allowNegative: false },
                              value: row.gross_amt,
                              className: "txt-fld",
                              name: "gross_amt",
                              events: {
                                onChange: onchangecalculation.bind(
                                  this,
                                  this,
                                  row
                                )
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "corporate_discount_amt",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "corporate_discount_amt" }}
                        />
                      ),
                      displayTemplate: row => {
                        return row.corporate_discount_amt.toFixed(2);
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              decimal: { allowNegative: false },
                              value: row.corporate_discount_amt,
                              className: "txt-fld",
                              name: "corporate_discount_amt",
                              events: {
                                onChange: onchangecalculation.bind(
                                  this,
                                  this,
                                  row
                                )
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "net_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "net_amount" }} />
                      ),
                      displayTemplate: row => {
                        return row.net_amount !== null
                          ? row.net_amount.toFixed(2)
                          : null;
                      },

                      disabled: true
                    },
                    {
                      fieldName: "pre_approval",
                      label: (
                        <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                      ),
                      displayTemplate: row => {
                        return row.pre_approval === "N" ? "No" : "Yes";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "pre_approval",
                              className: "select-fld",
                              value: row.pre_approval,
                              dataSource: {
                                textField: "value",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_YESNO
                              },
                              onChange: onchangegridcol.bind(this, this, row)
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "covered",
                      label: <AlgaehLabel label={{ fieldName: "covered" }} />,
                      displayTemplate: row => {
                        return row.covered === "N" ? "No" : "Yes";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "covered",
                              className: "select-fld",
                              value: row.covered,
                              dataSource: {
                                textField: "value",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_YESNO
                              },
                              onChange: onchangegridcol.bind(this, this, row)
                            }}
                          />
                        );
                      }
                    }
                  ]}
                  keyId="service_name"
                  dataSource={{
                    data:
                      this.props.pricelist === undefined
                        ? []
                        : this.props.pricelist
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  events={{
                    // onDelete: this.deleteVisaType.bind(this),
                    onEdit: row => {},
                    onDone: updatePriceList.bind(this, this)
                  }}
                />
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
    pricelist: state.pricelist,
    insservicetype: state.insservicetype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPriceList: AlgaehActions,
      initialPriceList: AlgaehActions,
      getServiceTypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubInsurance)
);
