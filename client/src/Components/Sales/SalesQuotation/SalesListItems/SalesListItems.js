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
    UomchangeTexts,
    AddItems,
    deleteSalesDetail,
    onchangegridcol,
    qtyonchangegridcol,
} from "./SalesListItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

class SalesListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {

            addItemButton: true,
            item_description: "",
            addedItem: true,

            item_id: null,
            quantity: 0,
            uom_id: null,
            uom_description: null,
            discount_percentage: 0,
            unit_cost: 0,
            tax_percent: 0
        };
    }

    UNSAFE_componentWillMount() {
        let InputOutput = this.props.SALESIOputs;
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


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(nextProps.SALESIOputs);
    }

    render() {
        return (
            <React.Fragment>
                <MyContext.Consumer>
                    {context => (
                        <>
                            <div className="col-3">
                                <div className="portlet portlet-bordered margin-bottom-15">
                                    <div className="row">
                                        <AlgaehAutoSearch
                                            div={{ className: "col-12 form-group mandatory" }}
                                            label={{ forceLabel: "Item Name" }}
                                            title="Search Items"
                                            id="item_id_search"
                                            template={result => {
                                                return (
                                                    <section className="resultSecStyles">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h4 className="title">
                                                                    {result.item_description}
                                                                </h4>
                                                                <small>{result.uom_description}</small>
                                                            </div>
                                                        </div>
                                                    </section>
                                                );
                                            }}
                                            name="item_id"
                                            columns={spotlightSearch.Items.Invitemmaster}
                                            displayField="item_description"
                                            value={this.state.item_description}
                                            searchName="salesitemmaster"
                                            onClick={itemchangeText.bind(this, this)}
                                            ref={attReg => {
                                                this.attReg = attReg;
                                            }}
                                            others={{
                                                disabled: this.state.dataExists
                                            }}
                                        />

                                        <AlagehAutoComplete
                                            div={{ className: "col-6 form-group mandatory" }}
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
                                                    this
                                                ),
                                                onClear: () => {
                                                    this.setState({
                                                        uom_id: null
                                                    });
                                                },
                                                others: {
                                                    disabled: this.state.dataExitst,
                                                    tabIndex: "2"
                                                }
                                            }}
                                        /> <AlagehFormGroup
                                            div={{ className: "col-6 form-group mandatory" }}
                                            label={{
                                                forceLabel: "Unit Cost",
                                                isImp: false
                                            }}
                                            textBox={{
                                                decimal: { allowNegative: false },
                                                className: "txt-fld",
                                                name: "unit_cost",
                                                value: this.state.unit_cost,
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
                                        <AlagehFormGroup
                                            div={{ className: "col-6 form-group mandatory" }}
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
                                            div={{ className: "col-6 form-group" }}
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


                                       
                                        <div className="col-6 form-group mandatory">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Tax %"
                                                }}
                                            />
                                            <h6>
                                                {this.state.tax_percentage
                                                    ? this.state.tax_percentage
                                                    : "-----------"}
                                            </h6>
                                        </div>
                                        <div className="col-6 subFooter-btn">
                                            <button
                                                className="btn btn-primary"
                                                onClick={AddItems.bind(this, this, context)}
                                                disabled={this.state.addItemButton}
                                                tabIndex="5"
                                                style={{ marginTop: 19 }}
                                            >
                                                Add Item
                                            </button>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="col-9">
                                <div className="portlet portlet-bordered margin-bottom-15">
                                    <div className="row">
                                        <div className="col-12" id="SaleQuotationGrid_Cntr">
                                            <AlgaehDataGrid
                                                id="SaleQuotationGrid"
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
                                                                    <i
                                                                        style={{
                                                                            pointerEvents:
                                                                                this.state.dataExists ? "none" : "",
                                                                            opacity:
                                                                                this.state.dataExists ? "0.1" : ""
                                                                        }}
                                                                        className="fas fa-trash-alt" />
                                                                </span>
                                                            );
                                                        }
                                                    },
                                                    {
                                                        fieldName: "item_description",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Item Name" }}
                                                            />
                                                        ),
                                                        disabled: true,
                                                        others: {
                                                            minWidth: 200
                                                        }
                                                    },
                                                    {
                                                        fieldName: "quantity",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Quantity" }}
                                                            />
                                                        ),
                                                        displayTemplate: row => {
                                                            return this.state.dataExists === true ? parseFloat(row.quantity) : (
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
                                                        fieldName: "uom_description",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "UOM" }}
                                                            />
                                                        ),
                                                        disabled: true,
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
                                                            return this.state.dataExists === true ? row.discount_percentage : (
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
                                                                                e.target.value =
                                                                                    e.target.value === undefined ? 0 : e.target.value;
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
                                                        fieldName: "tax_percentage",
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
                                                    data: this.state.sales_quotation_items
                                                }}
                                                paging={{ page: 0, rowsPerPage: 10 }}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </MyContext.Consumer>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        opitemlist: state.opitemlist,
        inventoryitemuom: state.inventoryitemuom
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
