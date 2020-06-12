import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";

import "./PurchaseRequestList.scss";
import "./../../../styles/site.scss";
import {
    texthandle,
    getPurchaseRequestList,
    RequestForQuotation
} from "./PurchaseRequestListEvent";

import {
    AlagehAutoComplete,
    AlgaehDataGrid,
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../Options.json";
import Enumerable from "linq";

class PurchaseRequestList extends Component {
    constructor(props) {
        super(props);
        let month = moment().format("MM");
        let year = moment().format("YYYY");
        this.state = {
            to_date: new Date(),
            from_date: moment("01" + month + year, "DDMMYYYY")._d,
            po_from: null,
            to_location_id: null,
            purchase_list: [],
            category_id: null,
            request_button: true
        };
        getPurchaseRequestList(this)
        this.props.getItemCategory({
            uri: "/inventory/getItemCategory",
            module: "inventory",
            method: "GET",
            redux: {
                type: "ITEM_CATEGORY_GET_DATA",
                mappingName: "poitemcategory"
            }
        });
    }

    onCheckChangeRow(row, e) {

        let _purchase_request_list = this.state.purchase_request_list;
        let request_button = true;

        row.checked = e.target.checked;
        _purchase_request_list[row.rowIdx] = row;


        let listOfinclude = Enumerable.from(_purchase_request_list)
            .where(w => w.checked === true)
            .toArray();
        if (listOfinclude.length > 0) {
            request_button = false;
        }
        this.setState({
            request_button: request_button,
            purchase_request_list: _purchase_request_list
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="hptl-phase1-purchase-list-form">
                    <div
                        className="row inner-top-search"
                        style={{ paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">
                                {/* <AlgaehDateHandler
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
                                /> */}

                                <AlagehAutoComplete
                                    div={{ className: "col-3" }}
                                    label={{ forceLabel: "Select Category" }}
                                    selector={{
                                        name: "category_id",
                                        className: "select-fld",
                                        value: this.state.category_id,
                                        dataSource: {
                                            textField: "category_desc",
                                            valueField: "hims_d_inventory_tem_category_id",
                                            data: this.props.poitemcategory
                                        },
                                        onChange: texthandle.bind(this, this),
                                        onClear: () => {
                                            this.setState({ category_id: null }, () => {
                                                getPurchaseRequestList(this)
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body" id="PurchaseRequestListCntr">
                                    <AlgaehDataGrid
                                        id="PurchaseRequestList_grid"
                                        columns={[
                                            {
                                                fieldName: "action",

                                                label: (
                                                    <AlgaehLabel
                                                        label={{
                                                            forceLabel: "Select"
                                                        }}
                                                    />
                                                ),
                                                //disabled: true
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            <input
                                                                type="checkbox"
                                                                onChange={this.onCheckChangeRow.bind(
                                                                    this,
                                                                    row
                                                                )}
                                                                checked={row.checked}
                                                            />
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 100,
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "item_description",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "requested_date",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Requested Date" }} />
                                                ),
                                                displayTemplate: (row) => {
                                                    return (
                                                        <span>
                                                            {moment(row.start_date).format(
                                                                Options.dateFormat
                                                            )}
                                                        </span>
                                                    );
                                                },
                                                disabled: true,
                                                others: {
                                                    filterable: false,
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "request_qty",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Requested Quantity" }} />
                                                )
                                            },
                                            {
                                                fieldName: "location_description",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Location" }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: false
                                                }
                                            }
                                        ]}
                                        keyId="request_from"
                                        dataSource={{
                                            data: this.state.purchase_request_list
                                        }}
                                        filter={true}
                                        noDataText="No Request"
                                        paging={{ page: 0, rowsPerPage: 50 }}
                                    />
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
                                    onClick={RequestForQuotation.bind(this, this)}
                                    disabled={this.state.request_button}
                                >
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Quotation Request",
                                            returnText: true
                                        }}
                                    />
                                </button>
                                {/* 
                            <button
                                type="button"
                                className="btn btn-default"
                                disabled={this.state.ClearDisable}
                                onClick={ClearData.bind(this, this)}
                            >
                                <AlgaehLabel
                                    label={{ forceLabel: "Clear", returnText: true }}
                                />
                            </button> */}
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
        poitemcategory: state.poitemcategory,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getItemCategory: AlgaehActions,
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PurchaseRequestList)
);
