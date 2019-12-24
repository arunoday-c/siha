import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlgaehDateHandler,
    AlagehFormGroup,
    AlgaehLabel,
    AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import {
    datehandle,
    changeTexts,
    customerTexthandle,
    ClearData,
    SaveSalesQuotation,
    getCtrlCode
} from "./SalesQuotationEvents";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./SalesQuotation.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import SalesListItems from "./SalesListItems/SalesListItems";
import SalesListService from "./SalesListService/SalesListService";

import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";
import {
    AlgaehOpenContainer,
    getAmountFormart
} from "../../../utils/GlobalFunctions";

class SalesQuotation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hims_f_sales_quotation_id: null,
            sales_quotation_number: null,
            sales_quotation_date: new Date(),
            sales_quotation_mode: "I",
            reference_number: null,
            customer_id: null,
            quote_validity: null,
            sales_man: null,
            payment_terms: null,
            service_terms: null,
            other_terms: null,
            sub_total: null,
            discount_amount: null,
            net_total: null,
            total_tax: null,
            net_payable: null,
            narration: null,

            tax_percentage: null,

            sales_quotation_items: [],
            sales_quotation_services: [],
            decimal_place: JSON.parse(
                AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
            ).decimal_places,
            saveEnable: true,
            dataExists: false
        };
    }

    componentDidMount() {
        if (
            this.props.opitemlist === undefined ||
            this.props.opitemlist.length === 0
        ) {
            this.props.getItems({
                uri: "/inventory/getItemMaster",
                module: "inventory",
                data: { item_status: "A" },
                method: "GET",
                redux: {
                    type: "ITEM_GET_DATA",
                    mappingName: "opitemlist"
                }
            });
        }

        if (
            this.props.customer_data === undefined ||
            this.props.customer_data.length === 0
        ) {
            this.props.getCustomerMaster({
                uri: "/customer/getCustomerMaster",
                module: "masterSettings",
                data: { customer_status: "A" },
                method: "GET",
                redux: {
                    type: "CUSTOMER_GET_DATA",
                    mappingName: "customer_data"
                }
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <BreadCrumb
                        title={
                            <AlgaehLabel
                                label={{ forceLabel: "Sales Quotation", align: "ltr" }}
                            />
                        }
                        breadStyle={this.props.breadStyle}
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
                                        label={{ forceLabel: "Sales Quotation", align: "ltr" }}
                                    />
                                )
                            }
                        ]}
                        soptlightSearch={{
                            label: (
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Sales Quotation Number",
                                        returnText: true
                                    }}
                                />
                            ),
                            value: this.state.sales_quotation_number,
                            selectValue: "sales_quotation_number",
                            events: {
                                onChange: getCtrlCode.bind(this, this)
                            },
                            jsonFile: {
                                fileName: "spotlightSearch",
                                fieldName: "Sales.SalesQuotation"
                            },
                            searchName: "SalesQuotation"
                        }}
                        userArea={
                            <div className="row">
                                <div className="col">
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Sales Quotation Date"
                                        }}
                                    />
                                    <h6>
                                        {this.state.sales_quotation_date
                                            ? moment(this.state.sales_quotation_date).format(
                                                Options.dateFormat
                                            )
                                            : Options.dateFormat}
                                    </h6>
                                </div>
                            </div>
                        }
                        printArea={
                            this.state.sales_quotation_number !== null
                                ? {
                                    menuitems: [
                                        {
                                            label: "Print Receipt",
                                            events: {
                                                onClick: () => {
                                                    // generateMaterialReqInv(this.state);
                                                }
                                            }
                                        }
                                    ]
                                }
                                : ""
                        }
                        selectedLang={this.state.selectedLang}
                    />
                    <div
                        className="row  inner-top-search"
                        style={{ marginTop: 76, paddingBottom: 10 }}
                    >
                        {/* Patient code */}
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col">
                                    <label>Quotation Mode</label>
                                    <div className="customRadio">
                                        <label className="radio inline">
                                            <input
                                                type="radio"
                                                value="I"
                                                name="sales_quotation_mode"
                                                disabled={this.state.dataExists}
                                                checked={
                                                    this.state.sales_quotation_mode === "I" ? true : false
                                                }
                                                onChange={changeTexts.bind(this, this)}
                                            />
                                            <span>Item</span>
                                        </label>
                                        <label className="radio inline">
                                            <input
                                                type="radio"
                                                value="S"
                                                name="sales_quotation_mode"
                                                disabled={this.state.dataExists}
                                                checked={
                                                    this.state.sales_quotation_mode === "S" ? true : false
                                                }
                                                onChange={changeTexts.bind(this, this)}
                                            />
                                            <span>Service</span>
                                        </label>
                                    </div>
                                </div>

                                <AlagehAutoComplete
                                    div={{ className: "col mandatory" }}
                                    label={{ forceLabel: "Customer", isImp: true }}
                                    selector={{
                                        name: "customer_id",
                                        className: "select-fld",
                                        value: this.state.customer_id,
                                        dataSource: {
                                            textField: "customer_name",
                                            valueField: "hims_d_customer_id",
                                            data: this.props.customer_data
                                        },
                                        onChange: customerTexthandle.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                customer_id: null
                                            });
                                        },
                                        autoComplete: "off",
                                        others: {
                                            disabled: this.state.dataExists
                                        }
                                    }}
                                />
                                <AlagehAutoComplete
                                    div={{ className: "col mandatory" }}
                                    label={{ forceLabel: "Payment Terms", isImp: true }}
                                    selector={{
                                        sort: "off",
                                        name: "payment_terms",
                                        className: "select-fld",
                                        value: this.state.payment_terms,
                                        dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: GlobalVariables.PAYMENT_TERMS
                                        },
                                        others: {
                                            disabled: this.state.dataExists
                                        },
                                        onChange: changeTexts.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                payment_terms: null
                                            });
                                        }
                                    }}
                                />

                                <AlgaehDateHandler
                                    div={{ className: "col mandatory" }}
                                    label={{ forceLabel: "quote validity", isImp: true }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "quote_validity"
                                    }}
                                    minDate={new Date()}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    disabled={this.state.dataExists}
                                    value={this.state.quote_validity}
                                />

                                <AlagehFormGroup
                                    div={{ className: "col" }}
                                    label={{
                                        forceLabel: "Name of Sales Person",
                                        isImp: false
                                    }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "sales_man",
                                        value: this.state.sales_man,
                                        events: {
                                            onChange: changeTexts.bind(this, this)
                                        },
                                        others: {
                                            disabled: this.state.dataExists
                                        }
                                    }}
                                />
                                <AlagehFormGroup
                                    div={{ className: "col" }}
                                    label={{
                                        forceLabel: "Ref No.",
                                        isImp: false
                                    }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "reference_number",
                                        value: this.state.reference_number,
                                        events: {
                                            onChange: changeTexts.bind(this, this)
                                        },
                                        others: {
                                            disabled: this.state.dataExists
                                        }
                                    }}
                                />

                                <AlagehFormGroup
                                    div={{ className: "col" }}
                                    label={{
                                        forceLabel: "Other Terms",
                                        isImp: false
                                    }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "other_terms",
                                        value: this.state.other_terms,
                                        events: {
                                            onChange: changeTexts.bind(this, this)
                                        },
                                        others: {
                                            disabled: this.state.dataExists
                                        }
                                    }}
                                />

                                {this.state.sales_quotation_mode === "S" ? (
                                    <AlagehFormGroup
                                        div={{ className: "col" }}
                                        label={{
                                            forceLabel: "Service Terms",
                                            isImp: false
                                        }}
                                        textBox={{
                                            className: "txt-fld",
                                            name: "service_terms",
                                            value: this.state.service_terms,
                                            events: {
                                                onChange: changeTexts.bind(this, this)
                                            },
                                            others: {
                                                disabled: this.state.dataExists
                                            }
                                        }}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="row">
                            <MyContext.Provider
                                value={{
                                    state: this.state,
                                    updateState: obj => {
                                        this.setState({ ...obj });
                                    }
                                }}
                            >
                                {this.state.sales_quotation_mode === "S" ? (
                                    <SalesListService SALESIOputs={this.state} />
                                ) : (
                                        <SalesListItems SALESIOputs={this.state} />
                                    )}
                            </MyContext.Provider>
                        </div>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-9" style={{ textAlign: "right" }}>
                                <div className="row">
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Sub Total"
                                            }}
                                        />
                                        <h6>{getAmountFormart(this.state.sub_total)}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Discount Amount"
                                            }}
                                        />
                                        <h6>{getAmountFormart(this.state.discount_amount)}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Net Total"
                                            }}
                                        />
                                        <h6>{getAmountFormart(this.state.net_total)}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Total Tax"
                                            }}
                                        />
                                        <h6>{getAmountFormart(this.state.total_tax)}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Net Payable"
                                            }}
                                        />
                                        <h6>{getAmountFormart(this.state.net_payable)}</h6>
                                    </div>{" "}
                                    <AlagehFormGroup
                                        div={{ className: "col-3 textAreaLeft" }}
                                        label={{
                                            forceLabel: "Narration",
                                            isImp: false
                                        }}
                                        textBox={{
                                            className: "txt-fld",
                                            name: "narration",
                                            value: this.state.narration,
                                            events: {
                                                onChange: changeTexts.bind(this, this)
                                            },
                                            others: {
                                                multiline: true,
                                                disabled: this.state.dataExists,
                                                rows: "4"
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="hptl-phase1-footer">
                            <div className="row">
                                <div className="col-lg-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={SaveSalesQuotation.bind(this, this)}
                                        disabled={this.state.saveEnable}
                                    >
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Save & Print",
                                                returnText: true
                                            }}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        onClick={ClearData.bind(this, this)}
                                    >
                                        <AlgaehLabel
                                            label={{ forceLabel: "Clear", returnText: true }}
                                        />
                                    </button>
                                </div>
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
        opitemlist: state.opitemlist,
        customer_data: state.customer_data
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getItems: AlgaehActions,
            getLocation: AlgaehActions,
            getCustomerMaster: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SalesQuotation)
);
