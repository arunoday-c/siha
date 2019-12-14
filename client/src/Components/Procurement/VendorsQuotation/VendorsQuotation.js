import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./VendorsQuotation.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
    AlgaehLabel,
    AlagehFormGroup,
    AlagehAutoComplete,
    AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import ItemList from "./ItemList/ItemList";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
    vendortexthandle,
    QuotationSearch,
    ClearData,
    SaveVendorQuotationEnrty,
    getCtrlCode,
    generateVendorQuotation,
    getVendorMaster
} from "./VendorsQuotationEvents";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

class VendorsQuotation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hims_f_procurement_vendor_quotation_header_id: null,
            vendor_quotation_number: null,

            vendor_id: null,
            quotation_number: null,
            req_quotation_header_id: null,


            vendor_quotation_date: new Date(),
            quotation_for: null,

            expected_date: new Date(),
            quotation_detail: [],
            dataExitst: false,
            ReqData: true,
            saveEnable: true,
            decimal_places: JSON.parse(
                AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
            ).decimal_places,
        };
        this.baseState = this.state
        getVendorMaster(this, this);
    }

    render() {
        const class_finder = this.state.dataExitst === true
            ? " disableFinder"
            : this.state.ReqData === true
                ? " disableFinder"
                : ""
        return (
            <div>
                <BreadCrumb
                    title={
                        <AlgaehLabel
                            label={{ forceLabel: "Vendor Quotation", align: "ltr" }}
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
                                    label={{ forceLabel: "Vendor Quotation", align: "ltr" }}
                                />
                            )
                        }
                    ]}
                    soptlightSearch={{
                        label: (
                            <AlgaehLabel
                                label={{ forceLabel: "Vendor Quotation Number", returnText: true }}
                            />
                        ),
                        value: this.state.vendor_quotation_number,
                        selectValue: "vendor_quotation_number",
                        events: {
                            onChange: getCtrlCode.bind(this, this)
                        },
                        jsonFile: {
                            fileName: "spotlightSearch",
                            fieldName: "Purchase.VendorQuotation"
                        },
                        searchName: "VendorQuotation"
                    }}
                    userArea={
                        <div className="row">
                            <div className="col">
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Transaction Date"
                                    }}
                                />
                                <h6>
                                    {this.state.vendor_quotation_date
                                        ? moment(this.state.vendor_quotation_date).format(Options.dateFormat)
                                        : Options.dateFormat}
                                </h6>
                            </div>
                        </div>
                    }
                    printArea={
                        this.state.hims_f_procurement_vendor_quotation_header_id !== null
                            ? {
                                menuitems: [
                                    {
                                        label: "Print Vendor Quotation",
                                        events: {
                                            onClick: () => {
                                                generateVendorQuotation(this.state);
                                            }
                                        }
                                    }
                                ]
                            }
                            : ""
                    }
                    selectedLang={this.state.selectedLang}
                />
                <div className="hims-request-for-quotation">
                    <div
                        className="row inner-top-search"
                        style={{ marginTop: "75px", paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">
                                <AlagehAutoComplete
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "Vendor No." }}
                                    selector={{
                                        name: "vendor_id",
                                        className: "select-fld",
                                        value: this.state.vendor_id,
                                        dataSource: {
                                            textField: "vendor_name",
                                            valueField: "hims_d_vendor_id",
                                            data: this.props.povendors
                                        },
                                        others: {
                                            disabled: this.state.quotation_detail.length > 0 ? true : false
                                        },
                                        onChange: vendortexthandle.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                vendor_id: null
                                            });
                                        }
                                    }}
                                />

                                <div className={"col-3 globalSearchCntr" + class_finder}>
                                    <AlgaehLabel label={{ forceLabel: "Search Quotation No." }} />
                                    <h6 onClick={QuotationSearch.bind(this, this)}>
                                        {this.state.quotation_number
                                            ? this.state.quotation_number
                                            : "Quotation No."}
                                        <i className="fas fa-search fa-lg"></i>
                                    </h6>
                                </div>

                                {/* <AlagehFormGroup
                                    div={{ className: "col-2" }}
                                    label={{
                                        forceLabel: "Quotation No."
                                    }}
                                    textBox={{
                                        value: this.state.quotation_number,
                                        className: "txt-fld",
                                        name: "quotation_number",
                                        events: {
                                            onChange: null
                                        },
                                        others: {
                                            disabled: true
                                        }
                                    }}
                                />
                                <div
                                    className="col"
                                    style={{
                                        paddingLeft: 0,
                                        paddingRight: 0
                                    }}
                                >
                                    <span
                                        className="fas fa-search fa-2x"
                                        style={{
                                            fontSize: " 1.2rem",
                                            marginTop: 26,
                                            paddingBottom: 0,
                                            pointerEvents:
                                                this.state.dataExitst === true
                                                    ? "none"
                                                    : this.state.ReqData === true
                                                        ? "none"
                                                        : ""
                                        }}
                                        onClick={QuotationSearch.bind(this, this)}
                                    />
                                </div> */}



                                <AlagehAutoComplete
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "Quotation For" }}
                                    selector={{
                                        name: "quotation_for",
                                        className: "select-fld",
                                        value: this.state.quotation_for,
                                        dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: GlobalVariables.PO_FROM
                                        },
                                        others: {
                                            disabled: true
                                        },
                                        onChange: null
                                    }}
                                />

                                <div className="col-lg-3"> &nbsp;</div>

                                <AlgaehDateHandler
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "Expected Arrival" }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "expected_date"
                                    }}
                                    minDate={new Date()}
                                    events={{
                                        onChange: null
                                    }}
                                    disabled={true}
                                    value={this.state.expected_date}
                                />
                            </div>
                        </div>
                    </div>

                    <MyContext.Provider
                        value={{
                            state: this.state,
                            updateState: obj => {
                                this.setState({ ...obj });
                            }
                        }}
                    >
                        <ItemList RequestQuotation={this.state} />
                    </MyContext.Provider>
                </div>

                <div className="hptl-phase1-footer">
                    <div className="row">
                        <div className="col-lg-12">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={SaveVendorQuotationEnrty.bind(this, this)}
                                disabled={this.state.saveEnable}
                            >
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Save",
                                        returnText: true
                                    }}
                                />
                            </button>

                            <button
                                type="button"
                                className="btn btn-default"
                                disabled={this.state.ClearDisable}
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
        );
    }
}

function mapStateToProps(state) {
    return {
        poitemlist: state.poitemlist,
        poitemcategory: state.poitemcategory,
        poitemgroup: state.poitemgroup,
        poitemuom: state.poitemuom,
        povendors: state.povendors,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getItems: AlgaehActions,
            getItemCategory: AlgaehActions,
            getItemGroup: AlgaehActions,
            getItemUOM: AlgaehActions,
            getVendorMaster: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(VendorsQuotation)
);
