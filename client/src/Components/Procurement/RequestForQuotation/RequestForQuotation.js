import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./RequestForQuotation.scss";
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
import RequestItemList from "./RequestItemList/RequestItemList";
import { AlgaehActions } from "../../../actions/algaehActions";
import RequestQuotation from "../../../Models/RequestQuotation";
import {
    poforhandle,
    RequisitionSearch,
    ClearData,
    SaveQuotationEnrty,
    getCtrlCode,
    generateRequestQuotation,
    datehandle,
    clearItemDetails
} from "./RequestForQuotationEvents";


class RequestForQuotation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillMount() {
        let IOputs = RequestQuotation.inputParam();
        this.setState(IOputs);
    }

    // componentDidMount() {
    //     if (
    //         this.props.quotation_number !== undefined &&
    //         this.props.quotation_number.length !== 0
    //     ) {
    //         getCtrlCode(this, this.props.quotation_number);
    //     }
    // }

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
                            label={{ forceLabel: "Request For Quotation", align: "ltr" }}
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
                                    label={{ forceLabel: "Request For Quotation", align: "ltr" }}
                                />
                            )
                        }
                    ]}
                    soptlightSearch={{
                        label: (
                            <AlgaehLabel
                                label={{ forceLabel: "Quotation Number", returnText: true }}
                            />
                        ),
                        value: this.state.quotation_number,
                        selectValue: "quotation_number",
                        events: {
                            onChange: getCtrlCode.bind(this, this)
                        },
                        jsonFile: {
                            fileName: "spotlightSearch",
                            fieldName: "Purchase.RequestQuotation"
                        },
                        searchName: "RequestQuotation"
                    }}
                    userArea={
                        <div className="row">
                            <div className="col">
                                <AlgaehLabel
                                    label={{
                                        forceLabel: "Quotation Date"
                                    }}
                                />
                                <h6>
                                    {this.state.quotation_date
                                        ? moment(this.state.quotation_date).format(Options.dateFormat)
                                        : Options.dateFormat}
                                </h6>
                            </div>
                        </div>
                    }
                    printArea={
                        this.state.hims_f_procurement_req_quotation_header_id !== null
                            ? {
                                menuitems: [
                                    {
                                        label: "Print Quotation",
                                        events: {
                                            onClick: () => {
                                                generateRequestQuotation(this.state);
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
                                            disabled: this.state.quotation_detail.length > 0 ? true : false
                                        },
                                        onChange: poforhandle.bind(this, this),
                                        onClear: () => {
                                            clearItemDetails(this, this)
                                            this.setState({
                                                quotation_for: null
                                            });
                                        }
                                    }}
                                />

                                <div className={"col-3 globalSearchCntr" + class_finder}>
                                    <AlgaehLabel label={{ forceLabel: "Search Requisition No." }} />
                                    <h6 onClick={RequisitionSearch.bind(this, this)}>
                                        {this.state.material_requisition_number
                                            ? this.state.material_requisition_number
                                            : "Requisition No."}
                                        <i className="fas fa-search fa-lg"></i>
                                    </h6>
                                </div>

                                <div className="col-lg-5"> &nbsp;</div>

                                <AlgaehDateHandler
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "Expected Arrival" }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "expected_date"
                                    }}
                                    minDate={new Date()}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    disabled={this.state.dataExitst}
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
                        <RequestItemList RequestQuotation={this.state} />
                    </MyContext.Provider>
                </div>

                <div className="hptl-phase1-footer">
                    <div className="row">
                        <div className="col-lg-12">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={SaveQuotationEnrty.bind(this, this)}
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
        poitemuom: state.poitemuom
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
    connect(mapStateToProps, mapDispatchToProps)(RequestForQuotation)
);
