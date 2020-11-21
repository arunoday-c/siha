import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./day_end_prc.scss";

import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";

import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { MainContext } from "algaeh-react-components";


class TransationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_entries: [],
            openPopup: false,
            finance_day_end_header_id: null
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

            this.setState({
                data_entries: InputOutput.popUpRecords.entries,
                openPopup: InputOutput.openPopup,
                finance_day_end_header_id: InputOutput.finance_day_end_header_id
            });
        }
    }

    postDayEndProcess() {
        debugger
        try {
            algaehApiCall({
                uri: "/finance/postDayEndData",
                data: { finance_day_end_header_id: this.state.finance_day_end_header_id },
                method: "POST",
                module: "finance",
                onSuccess: (response) => {
                    this.setState({
                        data_entries: [],
                        openPopup: false,
                        finance_day_end_header_id: null
                    }, () => {
                        this.props.onClose && this.props.onClose();
                    });
                    swalMessage({ type: "success", title: "Successfully Posted" })
                },
                onCatch: (error) => {
                    swalMessage({ title: error, type: "error" });
                },
            });
        } catch (e) {
            console.error(e);
        }
    }

    onClose = (e) => {
        this.setState({
            data_entries: [],
            openPopup: false,
            finance_day_end_header_id: null
        }, () => {
            this.props.onClose && this.props.onClose(e);
        });
    };

    render() {
        return (
            <div className="day_end_prc">
                <AlgaehModalPopUp
                    title="Accounting Entries"
                    openPopup={this.state.openPopup}
                    events={{
                        onClose: this.onClose.bind(this),
                    }}
                >
                    <div className="col-lg-12 popupInner">
                        <div className="row" style={{ paddingTop: 15 }}>
                            {/* <div className="col-2">
                <AlgaehLabel
                  label={{
                forceLabel: "Cash"
                  }}
                />
                <h6>{this.state.popUpRecords.cash}</h6>
                </div>
                <div className="col-2">
                <AlgaehLabel
                  label={{
                forceLabel: "Card"
                  }}
                />
                <h6>{this.state.popUpRecords.card}</h6>
                </div>
                <div className="col-2">
                <AlgaehLabel
                  label={{
                forceLabel: "Cheque"
                  }}
                />
                <h6>{this.state.popUpRecords.cheque}</h6>
              </div> */}
                            <div className="col-12" id="dayEndProcessDetailsGrid_Cntr">
                                <AlgaehDataGrid
                                    id="dayEndProcessDetailsGrid"
                                    columns={[
                                        {
                                            fieldName: "to_account",
                                            label: (
                                                <AlgaehLabel label={{ forceLabel: "To Account" }} />
                                            ),
                                        },

                                        {
                                            fieldName: "payment_type",
                                            label: (
                                                <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                                            ),
                                        },
                                        {
                                            fieldName: "payment_date",
                                            label: (
                                                <AlgaehLabel label={{ forceLabel: "Payment Date" }} />
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
                                    dataSource={{
                                        data: this.state.data_entries,
                                    }}
                                    isEditable={false}
                                    paging={{ page: 0, rowsPerPage: 10 }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="popupFooter">
                        <div className="col-lg-12">
                            <div className="row" style={{ textAlign: "right" }}>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={(e) => {
                                        this.onClose(e);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.postDayEndProcess.bind(this)}
                                    disabled={this.state.posted === "Y" ? true : false}
                                >
                                    Post to Finance
                            </button>
                            </div>
                        </div>
                    </div>
                </AlgaehModalPopUp>
            </div>
        );
    }
}

export default withRouter(TransationDetails);
