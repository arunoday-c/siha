import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./day_end_prc.scss";

import {
  AlgaehLabel,
  AlgaehModalPopUp,
  AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";

import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

import { MainContext, AlgaehDataGrid } from "algaeh-react-components";

class TransationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_entries: [],
      openPopup: false,
      finance_day_end_header_id: null,
      posted: "N",
      narration: null,
      revert_entries: [],
    };
    this.selectedDayEndIds = "";
  }

  static contextType = MainContext;
  componentDidMount() {
    // const userToken = this.context.userToken;
    // const { decimal_places, symbol_position, currency_symbol } = userToken;
    // const currency = {
    //     decimal_places,
    //     addSymbol: false,
    //     symbol_position,
    //     currency_symbol,
    // };
    // const params = new URLSearchParams(this.props.location?.search);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let InputOutput = nextProps;
    if (InputOutput.openPopup === true) {
      const revert_entries = InputOutput.popUpRecords.entries.filter(
        (f) => f.reverted === "Y"
      );
      const data_entries = InputOutput.popUpRecords.entries.filter(
        (f) => f.reverted === "N"
      );
      this.setState({
        data_entries: data_entries,
        openPopup: InputOutput.openPopup,
        finance_day_end_header_id: InputOutput.finance_day_end_header_id,
        posted: InputOutput.posted,
        narration: InputOutput.narration,
        revert_entries: revert_entries,
      });
    }
  }

  postDayEndProcess() {
    try {
      algaehApiCall({
        uri: "/finance/postDayEndData",
        data: {
          finance_day_end_header_id: this.state.finance_day_end_header_id,
        },
        method: "POST",
        module: "finance",
        onSuccess: (response) => {
          this.setState(
            {
              data_entries: [],
              openPopup: false,
              finance_day_end_header_id: null,
              narration: null,
            },
            () => {
              this.props.onClose && this.props.onClose();
            }
          );
          swalMessage({ type: "success", title: "Successfully Posted" });
        },
        onCatch: (error) => {
          swalMessage({ title: error, type: "error" });
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  SaveNarration() {
    try {
      algaehApiCall({
        uri: "/finance/SaveNarration",
        data: {
          finance_day_end_header_id: this.state.finance_day_end_header_id,
          narration: this.state.narration,
        },
        method: "POST",
        module: "finance",
        onSuccess: (response) => {
          swalMessage({ type: "success", title: "Saved Successfully..." });
        },
        onCatch: (error) => {
          swalMessage({ title: error, type: "error" });
        },
      });
    } catch (e) {
      swalMessage({ title: e, type: "error" });
    }
  }

  onClose = (e) => {
    this.setState(
      {
        data_entries: [],
        openPopup: false,
        finance_day_end_header_id: null,
        posted: "N",
        narration: null,
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  render() {
    return (
      <div className="day_end_prc">
        {/* narration */}
        <AlgaehModalPopUp
          title="Accounting Entries"
          openPopup={this.state.openPopup}
          events={{
            onClose: this.onClose.bind(this),
          }}
        >
          <div className="col-lg-12 popupInner">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Narration",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "narration",
                  value: this.state.narration,
                  events: {
                    onChange: (e) => {
                      this.setState({ narration: e.target.value });
                    },
                  },
                }}
              />
              <div className="col">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.SaveNarration.bind(this)}
                  style={{ marginTop: 21 }}
                >
                  Save Narration
                </button>
              </div>
            </div>

            <div className="row" style={{ paddingTop: 15 }}>
              <div className="col-12" id="dayEndProcessDetailsGrid_Cntr">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "to_account",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Account" }} />
                      ),
                    },
                    {
                      fieldName: "payment_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Date" }} />
                      ),
                    },
                    {
                      fieldName: "payment_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                      ),
                    },

                    {
                      fieldName: "debit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Debit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.debit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "credit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Credit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.credit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },

                    // {
                    //   fieldName: "narration",
                    //   label: <AlgaehLabel label={{ forceLabel: "Narration" }} />
                    // }
                  ]}
                  keyId="service_code"
                  data={
                    this.state.data_entries === undefined
                      ? []
                      : this.state.data_entries
                  }
                  pagination={true}
                  pageOptions={{ rows: 20, page: 1 }}
                  isFilterable={true}
                />
              </div>
            </div>

            <p>Reverted Bill Data</p>
            <div className="row" style={{ paddingTop: 15 }}>
              <div className="col-12" id="dayEndProcessDetailsGrid_Cntr">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "to_account",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Account" }} />
                      ),
                    },
                    {
                      fieldName: "payment_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Date" }} />
                      ),
                    },
                    {
                      fieldName: "payment_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                      ),
                    },

                    {
                      fieldName: "debit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Debit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.debit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "credit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Credit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.credit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },

                    // {
                    //   fieldName: "narration",
                    //   label: <AlgaehLabel label={{ forceLabel: "Narration" }} />
                    // }
                  ]}
                  keyId="service_code"
                  data={
                    this.state.revert_entries === undefined
                      ? []
                      : this.state.revert_entries
                  }
                  pagination={true}
                  pageOptions={{ rows: 20, page: 1 }}
                  isFilterable={true}
                />
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              {this.state.posted === "N" ? (
                <button
                  className="btn btn-primary"
                  onClick={this.postDayEndProcess.bind(this)}
                  disabled={this.state.posted === "Y" ? true : false}
                  style={{ marginRight: 0 }}
                >
                  Post to Finance
                </button>
              ) : null}{" "}
              <button
                type="button"
                className="btn btn-default"
                onClick={(e) => {
                  this.onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

export default withRouter(TransationDetails);
