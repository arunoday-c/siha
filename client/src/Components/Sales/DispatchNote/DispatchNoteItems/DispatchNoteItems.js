import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";

import "./../../../../styles/site.scss";
import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import {
    onchangegridcol,
    dateFormater,
    getItemLocationStock,
    AddSelectedBatches
} from "./DispatchNoteItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import _ from "lodash";

class DispatchNoteItems extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillMount() {
        let InputOutput = this.props.DELNOTEIOputs;
        this.setState({ ...this.state, ...InputOutput });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(nextProps.DELNOTEIOputs);
    }

    CloseOrent(context) {
        this.setState({
            dispatched_quantity: 0,
            item_details: null,
            batch_detail_view: false
        });

        if (context !== undefined) {
            context.updateState({
                dispatched_quantity: 0,
                item_details: null,
                batch_detail_view: false
            });
        }
    }

    ChangesOrent(context, item) {
        let dispatched_quantity = _.sumBy(item.batches, s =>
            parseFloat(s.select_quantity)
        );

        let stock_enable = item.batches.length > 0 ? false : true;
        this.setState({
            dispatched_quantity: dispatched_quantity,
            item_details: item,
            batch_detail_view: true,
            stock_enable: stock_enable
        });

        if (context !== undefined) {
            context.updateState({
                dispatched_quantity: dispatched_quantity,
                item_details: item,
                batch_detail_view: true,
                stock_enable: stock_enable
            });
        }
    }
    render() {
        let item_name =
            this.state.item_details === null
                ? null
                : this.state.item_details.item_description;
        let qty_auth =
            this.state.item_details === null
                ? null
                : this.state.item_details.quantity;
        return (
            <React.Fragment>
                <MyContext.Consumer>
                    {context => (
                        <>
                            <div className="col-4">
                                <div className="portlet portlet-bordered margin-bottom-15">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <h3 className="caption-subject">Dispatch Items</h3>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <ul className="reqDispatchList">
                                            {this.state.stock_detail.map((item, index) => {
                                                return (
                                                    <li>
                                                        <div className="itemReq">
                                                            <h6>{item.item_description}</h6>
                                                            <span>
                                                                UOM: <span>{item.uom_description}</span>
                                                            </span>
                                                            <span>
                                                                Ordered Qty:
                                                                <span>{item.ordered_quantity}</span>
                                                            </span>

                                                            <span>
                                                                Seleted Qty:
                                                                <span>{item.dispatched_quantity}</span>
                                                            </span>
                                                            <span>
                                                                Out Std. Qty:
                                                                <span>{item.quantity_outstanding}</span>
                                                            </span>

                                                            <span>
                                                                Delivered Till Date:
                                                                <span>{item.delivered_to_date}</span>
                                                            </span>
                                                        </div>
                                                        <div className="itemAction">
                                                            <span>
                                                                <i
                                                                    className="fas fa-pen"
                                                                    style={{
                                                                        pointerEvents:
                                                                            this.state.cannotEdit === true
                                                                                ? "none"
                                                                                : "",
                                                                        opacity:
                                                                            this.state.cannotEdit === true
                                                                                ? "0.1"
                                                                                : ""
                                                                    }}
                                                                    onClick={this.ChangesOrent.bind(
                                                                        this,
                                                                        context,
                                                                        item
                                                                    )}
                                                                />
                                                            </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {this.state.batch_detail_view === false ? (
                                <div className="col-8" style={{ paddingLeft: 0 }}>
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3 className="caption-subject">
                                                    Enter Qty for selected items
                                                </h3>
                                            </div>
                                        </div>
                                        <div
                                            className="portlet-body"
                                            id="REQ_dispatchDetailsGrid_Cntr"
                                        >
                                            <AlgaehDataGrid
                                                id="REQ_dispatchDetailsGrid"
                                                columns={[
                                                    {
                                                        fieldName: "item_description",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Item Name" }}
                                                            />
                                                        ),
                                                        others: {
                                                            minWidth: 150
                                                        }
                                                    },

                                                    {
                                                        fieldName: "item_category_id",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Item Category" }}
                                                            />
                                                        ),
                                                        displayTemplate: row => {
                                                            let display =
                                                                this.props.inventoryitemcategory === undefined
                                                                    ? []
                                                                    : this.props.inventoryitemcategory.filter(
                                                                        f =>
                                                                            f.hims_d_inventory_tem_category_id ===
                                                                            row.item_category_id
                                                                    );

                                                            return (
                                                                <span>
                                                                    {display !== null && display.length !== 0
                                                                        ? display[0].category_desc
                                                                        : ""}
                                                                </span>
                                                            );
                                                        },
                                                        others: {
                                                            minWidth: 250
                                                        }
                                                    },

                                                    {
                                                        fieldName: "item_group_id",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Item Group" }}
                                                            />
                                                        ),
                                                        displayTemplate: row => {
                                                            let display =
                                                                this.props.inventoryitemgroup === undefined
                                                                    ? []
                                                                    : this.props.inventoryitemgroup.filter(
                                                                        f =>
                                                                            f.hims_d_inventory_item_group_id ===
                                                                            row.item_group_id
                                                                    );

                                                            return (
                                                                <span>
                                                                    {display !== null && display.length !== 0
                                                                        ? display[0].group_description
                                                                        : ""}
                                                                </span>
                                                            );
                                                        },
                                                        others: {
                                                            minWidth: 150
                                                        }
                                                    },
                                                    {
                                                        fieldName: "expiry_date",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Expiry Date" }}
                                                            />
                                                        ),
                                                        displayTemplate: row => {
                                                            return (
                                                                <span>
                                                                    {row.expiry_date !== null
                                                                        ? dateFormater(this, row.expiry_date)
                                                                        : null}
                                                                </span>
                                                            );
                                                        }
                                                    },
                                                    {
                                                        fieldName: "batchno",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Batch No." }}
                                                            />
                                                        ),
                                                        others: {
                                                            minWidth: 150
                                                        }
                                                    },
                                                    {
                                                        fieldName: "uom_description",
                                                        label: <AlgaehLabel label={{ forceLabel: "UOM" }} />
                                                    },
                                                    {
                                                        fieldName: "dispatch_quantity",
                                                        label: (
                                                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                                                        ),
                                                        disabled: true,
                                                        others: {
                                                            minWidth: 130
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
                                                        )
                                                    },
                                                    {
                                                        fieldName: "discount_amount",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{
                                                                    forceLabel: "discount Amt."
                                                                }}
                                                            />
                                                        )
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
                                                    data: this.state.inventory_stock_detail
                                                }}
                                                isEditable={false}
                                                byForceEvents={true}
                                                datavalidate="id='TRANS_details'"
                                                paging={{ page: 0, rowsPerPage: 10 }}
                                                onRowSelect={row => {
                                                    getItemLocationStock(this, row);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    <div className="col-8" style={{ paddingLeft: 0 }}>
                                        <div className="portlet portlet-bordered margin-bottom-15">
                                            <div className="row">
                                                <div className="col">
                                                    <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                                                    <h6>{item_name ? item_name : "----------"}</h6>
                                                </div>

                                                <div className="col">
                                                    <AlgaehLabel label={{ forceLabel: "Required Qty" }} />
                                                    <h6>{qty_auth ? qty_auth : "----------"}</h6>
                                                </div>

                                                {this.state.stock_enable === true ? (
                                                    <div className="col">
                                                        <AlgaehLabel
                                                            label={{ forceLabel: "Stock Not Available" }}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                            {qty_auth < this.state.dispatched_quantity
                                                ? "Greater than required qty"
                                                : null}
                                            <div className="portlet-body">
                                                <div className="row">
                                                    <div
                                                        className="col-12"
                                                        id="dispatchItemGridDetail_Cntr"
                                                    >
                                                        <AlgaehDataGrid
                                                            id="dispatchItemGridDetail"
                                                            datavalidate="dispatchItemGridDetail"
                                                            columns={[
                                                                {
                                                                    fieldName: "batchno",
                                                                    label: (
                                                                        <AlgaehLabel
                                                                            label={{ forceLabel: "Batch No" }}
                                                                        />
                                                                    )
                                                                },
                                                                {
                                                                    fieldName: "qtyhand",
                                                                    label: (
                                                                        <AlgaehLabel
                                                                            label={{
                                                                                forceLabel: "Qty in Hand"
                                                                            }}
                                                                        />
                                                                    )
                                                                },
                                                                {
                                                                    fieldName: "expiry_date",
                                                                    label: (
                                                                        <AlgaehLabel
                                                                            label={{ forceLabel: "Expiry Date" }}
                                                                        />
                                                                    ),
                                                                    displayTemplate: row => {
                                                                        return (
                                                                            <span>
                                                                                {dateFormater(this, row.expiry_date)}
                                                                            </span>
                                                                        );
                                                                    }
                                                                },
                                                                {
                                                                    fieldName: "dispatch_quantity",
                                                                    label: (
                                                                        <AlgaehLabel
                                                                            label={{
                                                                                forceLabel: "Selected Quantity"
                                                                            }}
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
                                                                                    dontAllowKeys: ["-", "e", "."],
                                                                                    value: row.dispatch_quantity,
                                                                                    className: "txt-fld",
                                                                                    name: "dispatch_quantity",
                                                                                    events: {
                                                                                        onChange: onchangegridcol.bind(
                                                                                            this,
                                                                                            this,
                                                                                            context,
                                                                                            row
                                                                                        )
                                                                                    },
                                                                                    others: {
                                                                                        algaeh_required: "true",
                                                                                        errormessage:
                                                                                            "Please enter Transferred Quantity ..",
                                                                                        checkvalidation:
                                                                                            "value ==='' || value ==='0'"
                                                                                    }
                                                                                }}
                                                                            />
                                                                        );
                                                                    }
                                                                }
                                                            ]}
                                                            keyId=""
                                                            dataSource={{
                                                                data:
                                                                    this.state.item_details == null
                                                                        ? []
                                                                        : this.state.item_details.batches
                                                            }}
                                                            isEditable={false}
                                                            paging={{ page: 0, rowsPerPage: 10 }}
                                                            events={{}}
                                                            others={{}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <AlgaehLabel label={{ forceLabel: "Selected Qty" }} />
                                                    <h6>
                                                        {this.state.dispatched_quantity
                                                            ? this.state.dispatched_quantity
                                                            : "----------"}
                                                    </h6>
                                                </div>

                                                <div className="col">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={AddSelectedBatches.bind(this, this, context)}
                                                        style={{
                                                            marginTop: 8,
                                                            float: "right",
                                                            marginLeft: 10
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-default"
                                                        onClick={this.CloseOrent.bind(this, context)}
                                                        style={{ marginTop: 8, float: "right" }}
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </>
                    )}
                </MyContext.Consumer>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        itemlist: state.itemlist,
        inventoryitemcategory: state.inventoryitemcategory,
        inventoryitemuom: state.inventoryitemuom,
        inventoryitemgroup: state.inventoryitemgroup,
        itemBatch: state.itemBatch
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getSelectedItemDetais: AlgaehActions,
            getItemCategory: AlgaehActions,
            getItemGroup: AlgaehActions,
            getItemUOM: AlgaehActions,
            getTransferData: AlgaehActions,
            getItemLocationStock: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DispatchNoteItems)
);
