import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
// import "./SalesListItems.scss";
import "./../../../../styles/site.scss";
import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlagehFormGroup,
    AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";

import {
    itemchangeText,
    numberchangeTexts,
    AddItems,
    deleteSalesDetail,
    UomchangeTexts,
    dateFormater,
    onchangegridcol,
    qtyonchangegridcol,
} from "./SalesListItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Options from "../../../../Options.json";
import moment from "moment"

class SalesListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectBatch: false,
            selectBatchButton: true,

            addItemButton: true,
            item_description: "",
            addedItem: true,
            item_category_id: null,
            item_group_id: null,
            item_id: null,
            quantity: 0,
            uom_id: null,
            uom_description: null,
            discount_percentage: 0,
            barcode: null,
            ItemUOM: [],
            Batch_Items: [],
            unit_cost: 0,
            Real_unit_cost: 0,
            tax_percent: 0
        };
    }

    UNSAFE_componentWillMount() {
        let InputOutput = this.props.POSIOputs;
        this.setState({ ...this.state, ...InputOutput });
    }

    componentDidMount() {
        if (
            this.props.inventoryitemcategory === undefined ||
            this.props.inventoryitemcategory.length === 0
        ) {
            this.props.getItemCategory({
                uri: "/inventory/getItemCategory",
                module: "inventory",
                method: "GET",
                redux: {
                    type: "ITEM_CATEGORY_GET_DATA",
                    mappingName: "inventoryitemcategory"
                }
            });
        }

        if (
            this.props.inventoryitemgroup === undefined ||
            this.props.inventoryitemgroup.length === 0
        ) {
            this.props.getItemGroup({
                uri: "/inventory/getItemGroup",
                module: "inventory",
                method: "GET",
                redux: {
                    type: "ITEM_GROUOP_GET_DATA",
                    mappingName: "inventoryitemgroup"
                }
            });
        }

        if (
            this.props.inventoryitemuom === undefined ||
            this.props.inventoryitemuom.length === 0
        ) {
            this.props.getItemUOM({
                uri: "/inventory/getInventoryUom",
                module: "inventory",
                method: "GET",
                redux: {
                    type: "ITEM_UOM_GET_DATA",
                    mappingName: "inventoryitemuom"
                }
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.onKeyPress, false);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(nextProps.POSIOputs);
    }

    render() {
        return (
            <React.Fragment>
                <MyContext.Consumer>
                    {context => (
                        <div className="hptl-phase1-op-add-billing-form">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="portlet portlet-bordered margin-bottom-15">
                                                    <div className="row">
                                                        <AlgaehAutoSearch
                                                            div={{ className: "col-3" }}
                                                            label={{ forceLabel: "Item Name (Ctrl + i)" }}
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
                                                                                <small>{result.uom_description}</small>
                                                                            </div>
                                                                            {/* <div className="col-4">
                                                                                <h6 className="price">
                                                                                    {getAmountFormart(
                                                                                        result.sale_price
                                                                                    )}
                                                                                </h6>
                                                                            </div> */}
                                                                        </div>
                                                                    </section>
                                                                );
                                                            }}
                                                            name="item_id"
                                                            columns={spotlightSearch.Items.Invitemmaster}
                                                            displayField="item_description"
                                                            value={this.state.item_description}
                                                            searchName="salesitemmaster"
                                                            extraParameters={{
                                                                inventory_location_id: this.state.location_id
                                                            }}
                                                            onClick={itemchangeText.bind(this, this)}
                                                            ref={attReg => {
                                                                this.attReg = attReg;
                                                            }}
                                                        />

                                                        <AlagehAutoComplete
                                                            div={{ className: "col" }}
                                                            label={{ forceLabel: "UOM", isImp: true }}
                                                            selector={{
                                                                name: "uom_id",
                                                                className: "select-fld",
                                                                value: this.state.uom_id,
                                                                dataSource: {
                                                                    textField: "uom_description",
                                                                    valueField: "uom_id",
                                                                    data: this.state.ItemUOM
                                                                },
                                                                onChange: UomchangeTexts.bind(
                                                                    this,
                                                                    this,
                                                                    context
                                                                ),
                                                                others: {
                                                                    disabled: true,
                                                                    tabIndex: "2"
                                                                }
                                                            }}
                                                        />
                                                        <AlagehFormGroup
                                                            div={{ className: "col" }}
                                                            label={{
                                                                forceLabel: "Quantity"
                                                            }}
                                                            textBox={{
                                                                number: {
                                                                    allowNegative: false,
                                                                    thousandSeparator: ","
                                                                },
                                                                className: "txt-fld",
                                                                name: "quantity",
                                                                value: this.state.quantity,
                                                                dontAllowKeys: ["-", "e", "."],
                                                                events: {
                                                                    onChange: numberchangeTexts.bind(
                                                                        this,
                                                                        this,
                                                                        context
                                                                    )
                                                                },
                                                                others: {
                                                                    disabled: this.state.dataExitst,
                                                                    tabIndex: "3"
                                                                }
                                                            }}
                                                        />

                                                        <AlagehFormGroup
                                                            div={{ className: "col" }}
                                                            label={{
                                                                forceLabel: "Discount (%)",
                                                                isImp: false
                                                            }}
                                                            textBox={{
                                                                decimal: { allowNegative: false },
                                                                className: "txt-fld",
                                                                name: "discount_percentage",
                                                                value: this.state.discount_percentage,
                                                                events: {
                                                                    onChange: numberchangeTexts.bind(
                                                                        this,
                                                                        this,
                                                                        context
                                                                    )
                                                                },
                                                                others: {
                                                                    tabIndex: "4"
                                                                }
                                                            }}
                                                        />

                                                        <div className="col">
                                                            <AlgaehLabel
                                                                label={{
                                                                    forceLabel: "Tax %"
                                                                }}
                                                            />
                                                            <h6>
                                                                {this.state.tax_percent
                                                                    ? this.state.tax_percent
                                                                    : "-----------"}
                                                            </h6>
                                                        </div>
                                                        <div className="col">
                                                            <AlgaehLabel
                                                                label={{
                                                                    forceLabel: "Unit Cost"
                                                                }}
                                                            />
                                                            <h6>
                                                                {this.state.unit_cost
                                                                    ? getAmountFormart(this.state.unit_cost)
                                                                    : "-----------"}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 subFooter-btn">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={AddItems.bind(this, this, context)}
                                                            disabled={this.state.addItemButton}
                                                            tabIndex="5"
                                                        >
                                                            Add Item
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <div className="portlet portlet-bordered margin-bottom-15">
                                                    <div className="row">
                                                        <div className="col-lg-12" id="PointSaleGrid">
                                                            <AlgaehDataGrid
                                                                id="POS_details"
                                                                columns={[
                                                                    {
                                                                        fieldName: "actions",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "Action" }}
                                                                            />
                                                                        ),
                                                                        displayTemplate: row => {
                                                                            return (
                                                                                <span
                                                                                    onClick={deleteSalesDetail.bind(
                                                                                        this,
                                                                                        this,
                                                                                        context,
                                                                                        row
                                                                                    )}
                                                                                >
                                                                                    <i className="fas fa-trash-alt" />
                                                                                </span>
                                                                            );
                                                                        }
                                                                    },
                                                                    {
                                                                        fieldName: "item_id",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "Item Name" }}
                                                                            />
                                                                        ),
                                                                        displayTemplate: row => {
                                                                            let display =
                                                                                this.props.opitemlist === undefined
                                                                                    ? []
                                                                                    : this.props.opitemlist.filter(
                                                                                        f =>
                                                                                            f.hims_d_inventory_item_master_id ===
                                                                                            row.item_id
                                                                                    );

                                                                            return (
                                                                                <span>
                                                                                    {display !== undefined &&
                                                                                        display.length !== 0
                                                                                        ? display[0].item_description
                                                                                        : ""}
                                                                                </span>
                                                                            );
                                                                        },
                                                                        editorTemplate: row => {
                                                                            let display =
                                                                                this.props.opitemlist === undefined
                                                                                    ? []
                                                                                    : this.props.opitemlist.filter(
                                                                                        f =>
                                                                                            f.hims_d_inventory_item_master_id ===
                                                                                            row.item_id
                                                                                    );

                                                                            return (
                                                                                <span>
                                                                                    {display !== undefined &&
                                                                                        display.length !== 0
                                                                                        ? display[0].item_description
                                                                                        : ""}
                                                                                </span>
                                                                            );
                                                                        },
                                                                        others: {
                                                                            minWidth: 200
                                                                        }
                                                                    },
                                                                    {
                                                                        fieldName: "quantity",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "Qty Req." }}
                                                                            />
                                                                        ),
                                                                        displayTemplate: row => {
                                                                            return (
                                                                                <AlagehFormGroup
                                                                                    div={{}}
                                                                                    textBox={{
                                                                                        number: {
                                                                                            allowNegative: false,
                                                                                            thousandSeparator: ","
                                                                                        },
                                                                                        value: row.quantity,
                                                                                        className: "txt-fld",
                                                                                        name: "quantity",
                                                                                        events: {
                                                                                            onChange: qtyonchangegridcol.bind(
                                                                                                this,
                                                                                                this,
                                                                                                context,
                                                                                                row
                                                                                            )
                                                                                        },
                                                                                        others: {
                                                                                            onFocus: e => {
                                                                                                e.target.oldvalue =
                                                                                                    e.target.value;
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            );
                                                                        },
                                                                        others: {
                                                                            minWidth: 90
                                                                        }
                                                                    },
                                                                    {
                                                                        fieldName: "uom_id",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "UOM" }}
                                                                            />
                                                                        ),
                                                                        displayTemplate: row => {
                                                                            let display =
                                                                                this.props.inventoryitemuom ===
                                                                                    undefined
                                                                                    ? []
                                                                                    : this.props.inventoryitemuom.filter(
                                                                                        f =>
                                                                                            f.hims_d_inventory_uom_id ===
                                                                                            row.uom_id
                                                                                    );

                                                                            return (
                                                                                <span>
                                                                                    {display !== null &&
                                                                                        display.length !== 0
                                                                                        ? display[0].uom_description
                                                                                        : ""}
                                                                                </span>
                                                                            );
                                                                        },
                                                                        editorTemplate: row => {
                                                                            let display =
                                                                                this.props.inventoryitemuom ===
                                                                                    undefined
                                                                                    ? []
                                                                                    : this.props.inventoryitemuom.filter(
                                                                                        f =>
                                                                                            f.hims_d_inventory_uom_id ===
                                                                                            row.uom_id
                                                                                    );

                                                                            return (
                                                                                <span>
                                                                                    {display !== null &&
                                                                                        display.length !== 0
                                                                                        ? display[0].uom_description
                                                                                        : ""}
                                                                                </span>
                                                                            );
                                                                        },
                                                                        others: {
                                                                            minWidth: 90
                                                                        }
                                                                    },
                                                                    {
                                                                        fieldName: "unit_cost",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "Unit Cost" }}
                                                                            />
                                                                        ),
                                                                        disabled: true,
                                                                        others: {
                                                                            minWidth: 90
                                                                        }
                                                                    },

                                                                    {
                                                                        fieldName: "extended_cost",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{ forceLabel: "Ext. Cost" }}
                                                                            />
                                                                        ),
                                                                        disabled: true
                                                                    },
                                                                    {
                                                                        fieldName: "discount_percentage",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "discount %"
                                                                                }}
                                                                            />
                                                                        ),
                                                                        displayTemplate: row => {
                                                                            return (
                                                                                <AlagehFormGroup
                                                                                    div={{}}
                                                                                    textBox={{
                                                                                        decimal: { allowNegative: false },
                                                                                        value: row.discount_percentage,
                                                                                        className: "txt-fld",
                                                                                        name: "discount_percentage",
                                                                                        events: {
                                                                                            onChange: onchangegridcol.bind(
                                                                                                this,
                                                                                                this,
                                                                                                context,
                                                                                                row
                                                                                            )
                                                                                        },
                                                                                        others: {
                                                                                            onFocus: e => {
                                                                                                e.target.oldvalue =
                                                                                                    e.target.value;
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            );
                                                                        }
                                                                    },
                                                                    {
                                                                        fieldName: "discount_amount",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "discount Amt."
                                                                                }}
                                                                            />
                                                                        ),
                                                                        // displayTemplate: row => {
                                                                        //     return (
                                                                        //         <AlagehFormGroup
                                                                        //             div={{}}
                                                                        //             textBox={{
                                                                        //                 decimal: { allowNegative: false },
                                                                        //                 value: row.discount_amount,
                                                                        //                 className: "txt-fld",
                                                                        //                 name: "discount_amount",
                                                                        //                 events: {
                                                                        //                     onChange: onchangegridcol.bind(
                                                                        //                         this,
                                                                        //                         this,
                                                                        //                         context,
                                                                        //                         row
                                                                        //                     )
                                                                        //                 },
                                                                        //                 others: {
                                                                        //                     onFocus: e => {
                                                                        //                         e.target.oldvalue =
                                                                        //                             e.target.value;
                                                                        //                     }
                                                                        //                 }
                                                                        //             }}
                                                                        //         />
                                                                        //     );
                                                                        // }
                                                                    },

                                                                    {
                                                                        fieldName: "net_extended_cost",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "Net Ext. Cost"
                                                                                }}
                                                                            />
                                                                        ),
                                                                        disabled: true
                                                                    },
                                                                    {
                                                                        fieldName: "tax_percent",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "Tax %"
                                                                                }}
                                                                            />
                                                                        ),
                                                                        disabled: true
                                                                    },
                                                                    {
                                                                        fieldName: "tax_amount",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "Tax Amount"
                                                                                }}
                                                                            />
                                                                        ),
                                                                        disabled: true
                                                                    },
                                                                    {
                                                                        fieldName: "total_amount",
                                                                        label: (
                                                                            <AlgaehLabel
                                                                                label={{
                                                                                    forceLabel: "Total Amount"
                                                                                }}
                                                                            />
                                                                        ),
                                                                        disabled: true
                                                                    }
                                                                ]}
                                                                keyId="service_type_id"
                                                                dataSource={{
                                                                    data: this.state.sales_quotation_detail
                                                                }}
                                                                paging={{ page: 0, rowsPerPage: 10 }}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </MyContext.Consumer>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        opitemlist: state.opitemlist,
        inventoryitemcategory: state.inventoryitemcategory,
        inventoryitemuom: state.inventoryitemuom,
        inventoryitemgroup: state.inventoryitemgroup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {

            getItemCategory: AlgaehActions,
            getItemUOM: AlgaehActions,
            getItemGroup: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SalesListItems)
);
