import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlagehFormGroup,
    AlgaehLabel,
    AlagehAutoComplete,
    AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
    texthandle,
    getCtrlCode,
    ClearData,
    SaveAdjustment,
    LocationchangeTexts,
    itemchangeText,
    batchEventHandaler,
    adjustQtyHandaler,
    AddItemtoList,
    adjustAmtHandaler
    // generateReport,
} from "./StockAdjustmentEvents";

import "./StockAdjustment.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Options from "../../../Options.json";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

class StockAdjustment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location_type: null,
            location_id: null,
            adjustment_number: null,
            adjustment_date: new Date(),
            addItemButton: true,
            Batch_Items: [],
            adjust_qty: 0,
            adjust_amount: 0,

            uom_description: null,
            pharmacy_stock_detail: [],
            location_selected: false,
            saveEnable: true,
            location_name: null,
            dataExists: false
        };
    }
    componentDidMount() {
        this.props.getLocation({
            uri: "/pharmacyGlobal/getUserLocationPermission",
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "LOCATIOS_GET_DATA",
                mappingName: "poslocations"
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <BreadCrumb
                        title={
                            <AlgaehLabel
                                label={{ forceLabel: "Stock Adjustment", align: "ltr" }}
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
                                        label={{ forceLabel: "Stock Adjustment", align: "ltr" }}
                                    />
                                )
                            }
                        ]}
                        soptlightSearch={{
                            label: (
                                <AlgaehLabel
                                    label={{ forceLabel: "Adjustment Number", returnText: true }}
                                />
                            ),
                            value: this.state.adjustment_number,
                            selectValue: "adjustment_number",
                            events: {
                                onChange: getCtrlCode.bind(this, this)
                            },
                            jsonFile: {
                                fileName: "spotlightSearch",
                                fieldName: "AdjustmentEntry.AdjEntry"
                            },
                            searchName: "ADJEntry"
                        }}
                        userArea={
                            <div className="row">
                                <div className="col">
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Adjustment Date"
                                        }}
                                    />
                                    <h6>
                                        {this.state.adjustment_date
                                            ? moment(this.state.adjustment_date).format(
                                                Options.dateFormat
                                            )
                                            : Options.dateFormat}
                                    </h6>
                                </div>
                            </div>
                        }
                        // printArea={
                        //     this.state.adjustment_number !== null
                        //         ? {
                        //             menuitems: [
                        //                 {
                        //                     label: "Print Receipt",
                        //                     events: {
                        //                         onClick: () => {
                        //                             generateMaterialReqPhar(this.state);
                        //                         }
                        //                     }
                        //                 }
                        //             ]
                        //         }
                        //         : ""
                        // }
                        selectedLang={this.state.selectedLang}
                    />

                    <div className="row" style={{ marginTop: 90 }}>
                        <div className="col-4" data-validate="ItemDetails">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body">
                                    <div className="row">
                                        <AlagehAutoComplete
                                            div={{ className: "col-6 form-group mandatory" }}
                                            label={{ forceLabel: "Location", isImp: true }}
                                            selector={{
                                                name: "location_id",
                                                className: "select-fld",
                                                value: this.state.location_id,
                                                dataSource: {
                                                    textField: "location_description",
                                                    valueField: "hims_d_pharmacy_location_id",
                                                    data: this.props.poslocations
                                                },
                                                onChange: LocationchangeTexts.bind(this, this),
                                                autoComplete: "off",
                                                others: {
                                                    disabled: this.state.dataExists === true ? true : this.state.location_selected
                                                }
                                            }}
                                        />
                                        <div className="col-6">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Location Type"
                                                }}
                                            />
                                            <h6>
                                                {this.state.location_type
                                                    ? this.state.location_type === "WH"
                                                        ? "Warehouse"
                                                        : this.state.location_type === "MS"
                                                            ? "Main Store"
                                                            : "Sub Store"
                                                    : "----------"}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <AlgaehAutoSearch
                                            div={{ className: "col-6 mandatory" }}
                                            label={{ forceLabel: "Select Item", isImp: true }}
                                            title="Search Items"
                                            id="item_id_search"
                                            template={result => {
                                                return (
                                                    <section className="resultSecStyles">
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <h4 className="title">
                                                                    {result.item_description}
                                                                </h4>
                                                                <small>{result.generic_name}</small>
                                                                <small>{result.uom_description}</small>
                                                            </div>
                                                        </div>
                                                    </section>
                                                );
                                            }}
                                            name="item_id"
                                            columns={spotlightSearch.pharmacy.itemmaster}
                                            displayField="item_description"
                                            value={this.state.item_description}
                                            searchName="itemmaster"
                                            extraParameters={{
                                                pharmacy_location_id: this.state.location_id
                                            }}
                                            onClick={itemchangeText.bind(this, this)}
                                            others={{
                                                disabled: this.state.dataExists
                                            }}
                                            onClear={() => {
                                                this.setState({
                                                    item_id: null,
                                                    item_category_id: null,
                                                    uom_id: null,
                                                    item_group_id: null,
                                                    addItemButton: true,
                                                    Batch_Items: [],
                                                    adjust_qty: 0,
                                                    adjust_amount: 0,
                                                    batchno: null,
                                                    uom_description: null,
                                                    item_description: "",
                                                    adjustment_type: null,
                                                    reason: null,
                                                    uom_id: null,
                                                    sales_uom: null,
                                                    qtyhand: 0,
                                                    sales_price: 0
                                                });
                                            }}
                                            ref={attReg => {
                                                this.attReg = attReg;
                                            }}
                                        />
                                        <AlagehAutoComplete
                                            div={{ className: "col-6 form-group mandatory" }}
                                            label={{ forceLabel: "Select Batch", isImp: true }}
                                            selector={{
                                                name: "batchno",
                                                className: "select-fld",
                                                value: this.state.batchno,
                                                dataSource: {
                                                    textField: "batchno",
                                                    valueField: "batchno",
                                                    data: this.state.Batch_Items
                                                },
                                                onChange: batchEventHandaler.bind(this, this),
                                                autoComplete: "off",
                                                others: {
                                                    disabled: this.state.dataExists
                                                },
                                                onClear: () => {
                                                    this.setState({
                                                        batchno: null,
                                                        adjust_qty: 0,
                                                        adjust_amount: 0,
                                                        qtyhand: null,
                                                        sales_price: null
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "UOM"
                                                }}
                                            />
                                            <h6>
                                                {this.state.uom_description
                                                    ? this.state.uom_description
                                                    : "----------"}
                                            </h6>
                                        </div>
                                        <div className="col-4">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Item Qty"
                                                }}
                                            />
                                            <h6>
                                                {this.state.qtyhand
                                                    ? parseFloat(this.state.qtyhand)
                                                    : "----------"}
                                            </h6>
                                        </div>
                                        <div className="col-4">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Item Amt"
                                                }}
                                            />
                                            <h6>
                                                {this.state.sales_price
                                                    ? getAmountFormart(this.state.sales_price)
                                                    : "----------"}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <AlagehAutoComplete
                                            div={{ className: "col-12 form-group mandatory" }}
                                            label={{ forceLabel: "Adjustment Type", isImp: true }}
                                            selector={{
                                                name: "adjustment_type",
                                                className: "select-fld",
                                                value: this.state.adjustment_type,
                                                dataSource: {
                                                    textField: "name",
                                                    valueField: "value",
                                                    data: GlobalVariables.ADJUSTMENT_TYPE
                                                },
                                                onChange: texthandle.bind(this, this),
                                                autoComplete: "off",
                                                others: {
                                                    disabled: this.state.dataExists
                                                },
                                                onClear: () => {
                                                    this.setState({
                                                        adjustment_type: null,
                                                        adjust_qty: 0,
                                                        adjust_amount: 0
                                                    });
                                                }
                                            }}
                                        />
                                        {this.state.adjustment_type === "IQ" ||
                                            this.state.adjustment_type === "DQ" ||
                                            this.state.adjustment_type === "BI" ||
                                            this.state.adjustment_type === "BD" ?

                                            <AlagehFormGroup
                                                div={{ className: "col-6 form-group mandatory" }}
                                                label={{
                                                    forceLabel: "Adjust Qty", isImp: this.state.adjustment_type === "IQ" ||
                                                        this.state.adjustment_type === "DQ" ||
                                                        this.state.adjustment_type === "BI" ||
                                                        this.state.adjustment_type === "BD" ? true : false
                                                }}
                                                textBox={{
                                                    number: {
                                                        allowNegative: false,
                                                        thousandSeparator: ","
                                                    },
                                                    className: "txt-fld",
                                                    name: "adjust_qty",
                                                    value: this.state.adjust_qty,
                                                    dontAllowKeys: ["-", "e"],
                                                    events: {
                                                        onChange: adjustQtyHandaler.bind(this, this)
                                                    },
                                                    others: {
                                                        disabled: this.state.dataExists
                                                    }
                                                }}
                                            />
                                            : null}

                                        {this.state.adjustment_type === "IA" ||
                                            this.state.adjustment_type === "DA" ||
                                            this.state.adjustment_type === "BI" ||
                                            this.state.adjustment_type === "BD" ?
                                            <AlagehFormGroup
                                                div={{ className: "col-6 form-group mandatory" }}
                                                label={{
                                                    forceLabel: "Adjust Amt.", isImp: this.state.adjustment_type === "IA" ||
                                                        this.state.adjustment_type === "DA" ||
                                                        this.state.adjustment_type === "BI" ||
                                                        this.state.adjustment_type === "BD" ? true : false
                                                }}
                                                textBox={{
                                                    decimal: { allowNegative: false },
                                                    className: "txt-fld",
                                                    name: "adjust_amount",
                                                    value: this.state.adjust_amount,
                                                    events: {
                                                        onChange: texthandle.bind(this, this)
                                                    },
                                                    others: {
                                                        disabled: this.state.dataExists,
                                                        onBlur: adjustAmtHandaler.bind(this, this)
                                                    }
                                                }}
                                            /> : null}




                                        <AlagehFormGroup
                                            div={{ className: "col-12 form-group mandatory" }}
                                            label={{ forceLabel: "Reson for Adjust", isImp: true }}
                                            textBox={{
                                                className: "txt-fld",
                                                name: "reason",
                                                value: this.state.reason,
                                                events: {
                                                    onChange: texthandle.bind(this, this)
                                                },
                                                others: {
                                                    disabled: this.state.dataExists,
                                                    placeholder: "Enter Reason"
                                                }
                                            }}
                                        />
                                        <div className="col-12" style={{ textAlign: "right" }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={AddItemtoList.bind(this, this)}
                                                disabled={this.state.addItemButton}
                                            >
                                                <AlgaehLabel
                                                    label={{
                                                        forceLabel: "Add to List",
                                                        returnText: true
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-12">
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3 className="caption-subject">Stock Adjust List</h3>
                                            </div>
                                            <div className="actions"></div>
                                        </div>
                                        <div className="portlet-body">
                                            <div className="row">
                                                <div className="col-12" id="stockAdjustGrid_Cntr">
                                                    <AlgaehDataGrid
                                                        id="stockAdjustGrid"
                                                        columns={[
                                                            {
                                                                fieldName: "adjustment_type",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Adjustment Type" }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    let display = GlobalVariables.ADJUSTMENT_TYPE.filter(
                                                                        f => f.value === row.adjustment_type
                                                                    );

                                                                    return (
                                                                        <span>
                                                                            {display !== undefined && display.length !== 0
                                                                                ? display[0].name
                                                                                : ""}
                                                                        </span>
                                                                    );
                                                                }
                                                            },
                                                            {
                                                                fieldName: "item_description",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Item Description" }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "uom_description",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "UOM" }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "batchno",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Batch No." }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "expirydate",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Expiry Date" }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "qtyhand",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Current Stock" }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    return parseFloat(row.qtyhand);
                                                                },
                                                            },
                                                            {
                                                                fieldName: "quantity",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Adjust Qty" }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    return parseFloat(row.quantity);
                                                                },
                                                            },
                                                            {
                                                                fieldName: "sales_price",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Adjust Amount" }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "reason",
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{ forceLabel: "Reason" }}
                                                                    />
                                                                )
                                                            }
                                                        ]}
                                                        keyId="stockAdjustGrid"
                                                        dataSource={{ data: this.state.pharmacy_stock_detail }}
                                                        isEditable={false}
                                                        paging={{ page: 0, rowsPerPage: 10 }}
                                                        events={{
                                                            onDelete: rows => { }, //deleteDeptUser.bind(this, this),
                                                            onEdit: row => { },
                                                            onDone: rows => { } //updateDeptUser.bind(this, this)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-body">
                                            <div className="row">
                                                <AlagehFormGroup
                                                    div={{ className: "col" }}
                                                    label={{
                                                        forceLabel: "Comments"
                                                    }}
                                                    textBox={{
                                                        className: "txt-fld",
                                                        name: "comments",
                                                        value: this.state.comments,
                                                        events: {
                                                            onChange: texthandle.bind(this, this)
                                                        },
                                                        others: {
                                                            disabled: this.state.dataExists,
                                                            placeholder: "Enter Comments"
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
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
                                        onClick={SaveAdjustment.bind(this, this)}
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
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    return {
        poslocations: state.poslocations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getLocation: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StockAdjustment)
);
