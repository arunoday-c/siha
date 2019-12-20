import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlagehFormGroup,
    AlgaehLabel,
    AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import {
    changeTexts,
    customerTexthandle,
    ClearData,
    SavePosEnrty
} from "./SalesQuotationEvents";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./SalesQuotation.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReactDOM from "react-dom";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import SalesListItems from "./SalesListItems/SalesListItems";
import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";
import {
    algaehApiCall,
    swalMessage,
    getCookie
} from "../../../utils/algaehApiCall";
import { AlgaehOpenContainer, getAmountFormart } from "../../../utils/GlobalFunctions";


class SalesQuotation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sales_quotation_date: new Date(),
            sales_quotation_detail: [],
            decimal_place: JSON.parse(
                AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
            ).decimal_places,
        };
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    UNSAFE_componentWillMount() {
        // let IOputs = INVPOSIOputs.inputParam();
        // this.setState(IOputs);
    }

    componentDidMount() {
        document.addEventListener("keypress", this.onKeyPress, false);

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

        if (
            this.props.oplocations === undefined ||
            this.props.oplocations.length === 0
        ) {
            this.props.getLocation({
                uri: "/inventoryGlobal/getUserLocationPermission",
                module: "inventory",
                method: "GET",
                redux: {
                    type: "LOCATIOS_GET_DATA",
                    mappingName: "oplocations"
                }
            });
        }

        let IOputs = {};
        let _screenName = getCookie("ScreenName").replace("/", "");

        algaehApiCall({
            uri: "/userPreferences/get",
            data: {
                screenName: _screenName,
                identifier: "InventoryLocation"
            },
            method: "GET",
            onSuccess: response => {
                if (response.data.records.selectedValue !== undefined) {
                    IOputs.location_id = response.data.records.selectedValue;
                }
                algaehApiCall({
                    uri: "/userPreferences/get",
                    data: {
                        screenName: _screenName,
                        identifier: "LocationType"
                    },
                    method: "GET",
                    onSuccess: response => {
                        if (response.data.records.selectedValue !== undefined) {
                            IOputs.location_type = response.data.records.selectedValue;
                        }
                        this.setState(IOputs);
                    },
                    onFailure: error => {
                        swalMessage({
                            title: error.message,
                            type: "error"
                        });
                    }
                });
            },
            onFailure: error => {
                swalMessage({
                    title: error.message,
                    type: "error"
                });
            }
        });
    }

    onKeyPress(e) {
        if (e.ctrlKey && e.keyCode === 9) {
            const element = ReactDOM.findDOMNode(
                document.getElementById("root")
            ).querySelector("input[name='item_id']");
            element.focus();
        }

        if (e.ctrlKey && e.keyCode === 14) {
            ClearData(this);
            const element = ReactDOM.findDOMNode(
                document.getElementById("root")
            ).querySelector("input[name='item_id']");
            element.focus();
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.onKeyPress, false);
    }

    render() {

        return (
            <React.Fragment>
                <div onKeyPress={this.onKeyPress}>
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
                                    label={{ forceLabel: "Sales Quotation Number", returnText: true }}
                                />
                            ),
                            value: this.state.sales_quotation_number,
                            selectValue: "sales_quotation_number",
                            events: {
                                // onChange: getCtrlCode.bind(this, this)
                            },
                            jsonFile: {
                                fileName: "spotlightSearch",
                                fieldName: "RequisitionEntry.ReqEntry"
                            },
                            searchName: "InvREQEntry"
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
                    <div className="row  inner-top-search" style={{ marginTop: 76, paddingBottom: 10 }}>
                        {/* Patient code */}
                        <div className="col-lg-12">
                            <div className="row">
                                <AlagehAutoComplete
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "Customer" }}
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
                                            disabled: this.state.sales_quotation_detail.length > 0 ? true : false
                                        }
                                    }}
                                />
                                <AlagehAutoComplete
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "Payment Terms" }}
                                    selector={{
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

                            </div>
                        </div>
                    </div>

                    <div className="hptl-phase1-pos-form">
                        <div className="row">
                            <MyContext.Provider
                                value={{
                                    state: this.state,
                                    updateState: obj => {
                                        this.setState({ ...obj });
                                    }
                                }}
                            >
                                <SalesListItems POSIOputs={this.state} />
                            </MyContext.Provider>
                        </div>
                        <div className="col-lg-12" style={{ textAlign: "right" }}>
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
                                    <h6>
                                        {getAmountFormart(this.state.discount_amount)}
                                    </h6>
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hptl-phase1-footer">
                        <div className="row">
                            <div className="col-lg-12">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={SavePosEnrty.bind(this, this)}
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

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        opitemlist: state.opitemlist,
        oplocations: state.oplocations,
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
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SalesQuotation)
);