import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SalesQuotationList.scss";
import "./../../../styles/site.scss";

import {
    dateFormater,
    getSalesQuotationList,
    datehandle,
    changeEventHandaler
} from "./SalesQuotationListEvent";

import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlagehAutoComplete,
    AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";

class SalesQuotationList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let month = moment().format("MM");
        let year = moment().format("YYYY");
        //to load the same list when user come back from whatever screen they went.
        if (this.props.backToAuth) {
            const {
                from_date,
                to_date,
                customer_id
            } = this.props.prev;
            this.setState(
                {
                    from_date,
                    to_date,
                    customer_id
                },
                () => getSalesQuotationList(this)
            );
        } else {
            this.setState(
                {
                    to_date: new Date(),
                    from_date: moment("01" + month + year, "DDMMYYYY")._d,
                    customer_id: null,
                    quotation_list: [],

                },
                () => getSalesQuotationList(this)
            );
        }

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

    ourOwnMiniNavigator = obj => {
        const { requisition_list, radioYes, authorize1, ...rest } = this.state;
        let sendObj = Object.assign(rest, obj);
        this.props.new_routeComponents(sendObj);
    };

    render() {
        return (
            <React.Fragment>
                <div className="hptl-sales-quotation-list-form">
                    <div
                        className="row inner-top-search"
                        style={{ paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">
                                <AlgaehDateHandler
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "From Date" }}
                                    textBox={{ className: "txt-fld", name: "from_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    value={this.state.from_date}
                                />
                                <AlgaehDateHandler
                                    div={{ className: "col" }}
                                    label={{ forceLabel: "To Date" }}
                                    textBox={{ className: "txt-fld", name: "to_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    value={this.state.to_date}
                                />
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
                                        onChange: changeEventHandaler.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                customer_id: null
                                            }, () => getSalesQuotationList(this));
                                        },
                                        autoComplete: "off"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body" id="SalesQuotationListCntr">
                                    <AlgaehDataGrid
                                        id="SalesQuotationList_grid"
                                        columns={[
                                            {
                                                fieldName: "action",
                                                label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            <i
                                                                style={{
                                                                    pointerEvents:
                                                                        row.cancel === "Y" ? "none" : "",
                                                                    opacity: row.cancel === "Y" ? "0.1" : ""
                                                                }}
                                                                className="fas fa-check"
                                                                onClick={() => {
                                                                    this.ourOwnMiniNavigator({
                                                                        RQ_Screen: "SalesQuotation",
                                                                        sales_quotation_number: row.sales_quotation_number
                                                                    });
                                                                }}
                                                            />
                                                            {row.trans_pending === true ? (
                                                                <i
                                                                    className="fa fa-exchange-alt"
                                                                    onClick={() => {
                                                                        this.ourOwnMiniNavigator({
                                                                            RQ_Screen: "TransferEntry",
                                                                            hims_f_pharamcy_material_header_id:
                                                                                row.hims_f_pharamcy_material_header_id,
                                                                            from_location: row.to_location_id
                                                                        });
                                                                    }}
                                                                />
                                                            ) : null}
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 100,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "sales_quotation_number",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Sales Quotation Number" }}
                                                    />
                                                ),
                                                disabled: true,
                                                others: {
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "sales_quotation_date",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Sales Quotation Date" }}
                                                    />
                                                ),
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            {dateFormater(this, row.sales_quotation_date)}
                                                        </span>
                                                    );
                                                },

                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "left" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "customer_name",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Customer Name" }}
                                                    />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "quote_validity",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Validity Date" }}
                                                    />
                                                ),
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            {dateFormater(this, row.quote_validity)}
                                                        </span>
                                                    );
                                                },

                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "left" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "delivery_date",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Delivery Date" }}
                                                    />
                                                ),
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            {dateFormater(this, row.delivery_date)}
                                                        </span>
                                                    );
                                                },

                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "left" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "comments",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Comments" }}
                                                    />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "left" },
                                                    filterable: false
                                                }
                                            },

                                        ]}
                                        keyId="sales_quotation_number"
                                        filter={true}
                                        dataSource={{
                                            data: this.state.quotation_list
                                        }}
                                        noDataText="No data available"
                                        paging={{ page: 0, rowsPerPage: 10 }}
                                    />
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
        customer_data: state.customer_data
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getCustomerMaster: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SalesQuotationList)
);
