import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";

import "./ServicePriceList.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  Tooltip
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  texthandle,
  onchangegridcol,
  updatePriceList,
  onchangecalculation,
  bulkUpdate
} from "./ServicePriceListHandaler";
import GlobalVariables from "../../../utils/GlobalVariables";
import Paper from "@material-ui/core/Paper";

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
    debugger;
    if (this.state.insurance_provider_id !== null) {
      this.props.getPriceList({
        uri: "/insurance/getPriceList",
        method: "GET",
        printInput: true,
        data: {
          insurance_id: this.state.insurance_provider_id
        },
        redux: {
          type: "PRICE_LIST_GET_DATA",
          mappingName: "pricelist"
        }
      });
    } else {
      this.props.initialPriceList({
        redux: {
          type: "PRICE_LIST_GET_DATA",
          mappingName: "pricelist",
          data: []
        }
      });
    }
  }

  render() {
    console.log("Name", this.state.insurance_provider_name);
    return (
      <React.Fragment>
        <div className="hptl-phase1-price-insurance-form">
          <div className="container-fluid">
            {/* Services Details */}
            <div style={{ paddingTop: "10px" }}>
              <Paper style={{ padding: "15px", border: "1px solid #5f5f5f" }}>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
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
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "applicable",
                      isImp: true
                    }}
                    selector={{
                      name: "applicable",
                      className: "select-fld",
                      value: this.state.applicable,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_DISCOUNT
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <div className="col-lg-1">
                    <Tooltip id="tooltip-icon" title="Apply">
                      <IconButton className="go-button" color="primary">
                        <PlayCircleFilled
                          onClick={bulkUpdate.bind(
                            this,
                            this,
                            "corporate_discount"
                          )}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "pre_approval",
                      isImp: true
                    }}
                    selector={{
                      name: "pre_approval",
                      className: "select-fld",
                      value: this.state.pre_approval,
                      dataSource: {
                        textField: "value",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <div className="col-lg-1">
                    <Tooltip id="tooltip-icon" title="Apply">
                      <IconButton className="go-button" color="primary">
                        <PlayCircleFilled
                          onClick={bulkUpdate.bind(this, this, "pre_approval")}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "covered",
                      isImp: true
                    }}
                    selector={{
                      name: "covered",
                      className: "select-fld",
                      value: this.state.covered,
                      dataSource: {
                        textField: "value",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <div className="col-lg-1">
                    <Tooltip id="tooltip-icon" title="Apply">
                      <IconButton className="go-button" color="primary">
                        <PlayCircleFilled
                          onClick={bulkUpdate.bind(this, this, "covered")}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Paper>
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
    pricelist: state.pricelist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPriceList: AlgaehActions,
      initialPriceList: AlgaehActions
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
