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

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";

import {
    servicechangeText,
    numberchangeTexts,
    AddSerices,
    deleteSalesDetail,
    onchangegridcol,
    qtyonchangegridcol,
} from "./SalesOrdListServiceEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import _ from "lodash";

class SalesOrdListService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectBatch: false,
            selectBatchButton: true,

            addItemButton: true,
            service_name: "",
            addedItem: true,

            services_id: null,
            quantity: 0,
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
                                            label={{ forceLabel: "Service Name" }}
                                            title="Search Items"
                                            id="item_id_search"
                                            template={({ service_name, service_type }) => {
                                                return (

                                                    <section className="resultSecStyles">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h4 className="title">
                                                                    {_.startCase(_.toLower(service_name))}
                                                                </h4>
                                                                <p className="searchMoreDetails">
                                                                    <span>
                                                                        Service Type:
                                                                        <b>{_.startCase(_.toLower(service_type))}</b>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </section>
                                                );
                                            }}
                                            name="services_id"
                                            columns={spotlightSearch.Services.servicemaster}
                                            displayField="service_name"
                                            value={this.state.service_name}
                                            searchName="servicemaster"
                                            onClick={servicechangeText.bind(this, this)}
                                            ref={attReg => {
                                                this.attReg = attReg;
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
                                            div={{ className: "col-6 form-group mandatory" }}
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
                                        <div className="col-6 form-group mandatory">
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
                                        </div> <div className="col-12 subFooter-btn">
                                            <button
                                                className="btn btn-primary"
                                                onClick={AddSerices.bind(this, this, context)}
                                                disabled={this.state.addItemButton}
                                                tabIndex="5"
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
                                                                    <i className="fas fa-trash-alt" />
                                                                </span>
                                                            );
                                                        }
                                                    },
                                                    {
                                                        fieldName: "service_name",
                                                        label: (
                                                            <AlgaehLabel
                                                                label={{ forceLabel: "Service Name" }}
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
                                                    data: this.state.sales_quotation_services
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
    )(SalesOrdListService)
);
