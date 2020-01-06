import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./SalesReturnEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import {
    InvoiceSearch,
    ClearData,
    SaveSalesReutrnEnrty,
    getCtrlCode,
    PostSalesReturnEntry,
    generatePOReceipt,
    generatePOReceiptNoPrice
} from "./SalesReturnEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReturnItemList from "./ReturnItemList/ReturnItemList";

class SalesReturnEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hims_f_sales_return_header_id: null,
            return_date: new Date(),
            sales_return_number: null,
            invoice_number: null,
            sales_invoice_header_id: null,
            customer_name: null,
            hospital_name: null,
            project_name: null,
            sales_return_detail: [],
            dataFinder: false,
            dataExitst: false,

            sub_total: null,
            receipt_net_total: null,
            receipt_net_payable: null,
            net_total: null,
            return_total: null,
            inv_is_posted: "N",
            tax_amount: null,
            discount_amount: null,
            comment: null,

            location_description: null,
            location_type: null,
            location_id: null,

            saveEnable: true,
            postEnable: true
        };
    }

    // UNSAFE_componentWillMount() {
    //     let IOputs = POReturnEntry.inputParam();
    //     this.setState(IOputs);
    // }

    // componentDidMount() {
    //     if (
    //         this.props.purchase_return_number !== undefined &&
    //         this.props.purchase_return_number.length !== 0
    //     ) {
    //         getCtrlCode(this, this.props.purchase_return_number);
    //     }
    // }

    render() {
        const class_finder = this.state.dataFinder === true
            ? " disableFinder"
            : this.state.dataExitst === false
                ? ""
                : " disableFinder"

        return (
            <div>
                <BreadCrumb
                    title={
                        <AlgaehLabel
                            label={{ forceLabel: "Sales Return Entry", align: "ltr" }}
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
                                    label={{ forceLabel: "Sales Return Entry", align: "ltr" }}
                                />
                            )
                        }
                    ]}
                    soptlightSearch={{
                        label: (
                            <AlgaehLabel
                                label={{ forceLabel: "Return Number", returnText: true }}
                            />
                        ),
                        value: this.state.sales_return_number,
                        selectValue: "sales_return_number",
                        events: {
                            onChange: getCtrlCode.bind(this, this)
                        },
                        jsonFile: {
                            fileName: "spotlightSearch",
                            fieldName: "Sales.InvSalesReturn"
                        },
                        searchName: "InvSalesReturn"
                    }}
                    userArea={
                        <div className="row">
                            <div className="col">
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Return Date"
                                    }}
                                />
                                <h6>
                                    {this.state.return_date
                                        ? moment(this.state.return_date).format(Options.dateFormat)
                                        : Options.dateFormat}
                                </h6>
                            </div>
                        </div>
                    }
                    printArea={
                        this.state.hims_f_procurement_po_header_id !== null
                            ? {
                                menuitems: [
                                    {
                                        label: "Receipt for Internal",
                                        events: {
                                            onClick: () => {
                                                generatePOReceipt(this.state);
                                            }
                                        }
                                    },
                                    {
                                        label: "Receipt for Vendor",
                                        events: {
                                            onClick: () => {
                                                generatePOReceiptNoPrice(this.state);
                                            }
                                        }
                                    }
                                ]
                            }
                            : ""
                    }
                    selectedLang={this.state.selectedLang}
                />
                <div className="hims-purchase-order-entry">
                    <div
                        className="row inner-top-search"
                        style={{ marginTop: "75px", paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">
                                <div className={"col-2 globalSearchCntr" + class_finder} >
                                    <AlgaehLabel label={{ forceLabel: "Search Invoice No." }} />
                                    <h6 onClick={InvoiceSearch.bind(this, this)}>
                                        {this.state.invoice_number
                                            ? this.state.invoice_number
                                            : "Invoice No."}
                                        <i className="fas fa-search fa-lg"></i>
                                    </h6>
                                </div>
                                <div className="col">
                                    <AlgaehLabel label={{ forceLabel: "Location" }} />
                                    <h6>
                                        {this.state.location_description
                                            ? this.state.location_description
                                            : "------"}
                                    </h6>
                                </div>
                                <div className="col">
                                    <AlgaehLabel label={{ forceLabel: "Location Type" }} />
                                    <h6>
                                        {this.state.location_type
                                            ? this.state.location_type
                                            : "------"}
                                    </h6>
                                </div>
                                <div className="col">
                                    <AlgaehLabel label={{ forceLabel: "Customer" }} />
                                    <h6>
                                        {this.state.customer_name
                                            ? this.state.customer_name
                                            : "------"}
                                    </h6>
                                </div>

                                <div className="col">
                                    <AlgaehLabel label={{ forceLabel: "Branch" }} />
                                    <h6>
                                        {this.state.hospital_name
                                            ? this.state.hospital_name
                                            : "------"}
                                    </h6>
                                </div>

                                <div className="col">
                                    <AlgaehLabel label={{ forceLabel: "Project" }} />
                                    <h6>
                                        {this.state.project_name
                                            ? this.state.project_name
                                            : "------"}
                                    </h6>
                                </div>
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
                        <ReturnItemList POReturnEntry={this.state} />
                    </MyContext.Provider>
                </div>

                <div className="hptl-phase1-footer">
                    <div className="row">
                        <div className="col-lg-12">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={SaveSalesReutrnEnrty.bind(this, this)}
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


                            <button
                                type="button"
                                className="btn btn-other"
                                onClick={PostSalesReturnEntry.bind(this, this)}
                                disabled={this.state.postEnable}
                            >
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Post",
                                        returnText: true
                                    }}
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
        polocations: state.polocations,
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
            getLocation: AlgaehActions,
            getItemCategory: AlgaehActions,
            getItemGroup: AlgaehActions,
            getItemUOM: AlgaehActions,
            getVendorMaster: AlgaehActions,
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SalesReturnEntry)
);
