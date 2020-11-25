import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./SalesInvoiceList.scss";
import "./../../../styles/site.scss";

import {
    getSalesInvoiceList,
    datehandle,
    // changeEventHandaler,
    // dateFormaterTime
} from "./SalesInvoiceListEvent";
import Options from "../../../Options.json";
import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { Tooltip } from "antd";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

class SalesInvoiceList extends Component {
    constructor(props) {
        super(props);
        const month = moment().format("MM");
        const year = moment().format("YYYY");
        this.state = {
            to_date: new Date(),
            from_date: moment("01" + month + year, "DDMMYYYY")._d,
            invoice_list: [],
        };

        // getSalesInvoiceList(this)
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location?.search);
        if (params?.get("from_date")) {
            this.setState({
                // from_date: params?.get("from_date"),
                from_date: moment(params?.get("from_date"))._d,
            });
        }
        if (params?.get("to_date")) {
            this.setState(
                {
                    to_date: moment(params?.get("to_date"))._d,
                },
                () => getSalesInvoiceList(this)
            );
        } else {
            getSalesInvoiceList(this);
        }
    }

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
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "From Date" }}
                                    textBox={{ className: "txt-fld", name: "from_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this),
                                    }}
                                    value={this.state.from_date}
                                />
                                <AlgaehDateHandler
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "To Date" }}
                                    textBox={{ className: "txt-fld", name: "to_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this),
                                    }}
                                    value={this.state.to_date}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body" id="SalesInvoiceListCntr">
                                    <AlgaehDataGrid
                                        id="SalesInvoiceList_grid"
                                        columns={[
                                            {
                                                fieldName: "action",
                                                label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                                                displayTemplate: (row) => {
                                                    return (
                                                        <span>
                                                            <Tooltip title="View Invoce" placement="top">
                                                                <i
                                                                    className="fas fa-file-alt"
                                                                    onClick={() => {
                                                                        this.props.history.push(
                                                                            `/SalesInvoice?invoice_number=${row.invoice_number}`
                                                                        );
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="View Order" placement="right">
                                                                <i
                                                                    className="fas fa-eye"
                                                                    onClick={() => {
                                                                        this.props.history.push(
                                                                            `/SalesOrder?sales_order_number=${row.sales_order_number}`
                                                                        );
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 100,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: false,
                                                },
                                            },
                                            {
                                                fieldName: "is_posted",
                                                label: <AlgaehLabel label={{ forceLabel: "Posted" }} />,
                                                displayTemplate: (row) => {
                                                    return row.is_posted === "Y" ? (
                                                        <span className="badge badge-success">Yes</span>
                                                    ) : (
                                                            <span className="badge badge-danger">No</span>
                                                        );
                                                },
                                                others: {
                                                    maxWidth: 60,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: true,
                                                },
                                            },
                                            {
                                                fieldName: "is_revert",
                                                label: <AlgaehLabel label={{ forceLabel: "Revert" }} />,
                                                displayTemplate: (row) => {
                                                    return row.is_revert === "Y" ? (
                                                        <span className="badge badge-success">Yes</span>
                                                    ) : (
                                                            <span className="badge badge-danger">No</span>
                                                        );
                                                },
                                                others: {
                                                    maxWidth: 60,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: true,
                                                },
                                            },
                                            {
                                                fieldName: "correction",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Correction" }} />
                                                ),
                                                displayTemplate: (row) => {
                                                    return row.reverted_by > 0 &&
                                                        row.is_revert === "N" ? (
                                                            <span className="badge badge-success">Yes</span>
                                                        ) : (
                                                            <span className="badge badge-danger">No</span>
                                                        );
                                                },
                                                others: {
                                                    maxWidth: 100,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: true,
                                                },
                                            },
                                            {
                                                fieldName: "invoice_number",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                },
                                            },
                                            {
                                                fieldName: "invoice_date",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Invoice Date" }} />
                                                ),
                                                displayTemplate: (row) => {
                                                    return (
                                                        <span>
                                                            {moment(row.invoice_date).format(
                                                                Options.dateFormat
                                                            )}
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    filterable: false,
                                                },
                                            },
                                            {
                                                fieldName: "sales_order_number",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Order No." }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                },
                                            },
                                            {
                                                fieldName: "sales_order_date",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Order Date" }} />
                                                ),
                                                displayTemplate: (row) => {
                                                    return (
                                                        <span>
                                                            {moment(row.sales_order_date).format(
                                                                Options.dateFormat
                                                            )}
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    filterable: false,
                                                },
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
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                },
                                            },
                                            {
                                                fieldName: "customer_po_no",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Customer PO No." }}
                                                    />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                },
                                            },
                                        ]}
                                        keyId="invoice_number"
                                        filter={true}
                                        dataSource={{
                                            data: this.state.invoice_list,
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

export default withRouter(SalesInvoiceList);
