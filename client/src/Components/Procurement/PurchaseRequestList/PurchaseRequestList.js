import React, { Component } from "react";

import "./PurchaseRequestList.scss";
import "./../../../styles/site.scss";
import {
    getPurchaseRequestList,
    RequestForQuotation
} from "./PurchaseRequestListEvent";

import {
    AlgaehDataGrid,
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../Options.json";
import Enumerable from "linq";

export default class PurchaseRequestList extends Component {
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

            request_button: true
        };
        getPurchaseRequestList(this)
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
                    {/* <div
                        className="row inner-top-search"
                        style={{ marginTop: "75px", paddingBottom: "10px" }}
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
                                    div={{ className: "col-3" }}
                                    label={{ forceLabel: "Request From" }}
                                    selector={{
                                        name: "request_from",
                                        className: "select-fld",
                                        value: this.state.request_from,
                                        dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: GlobalVariables.PO_FROM
                                        },

                                        onChange: poforhandle.bind(this, this),
                                        onClear: poforhandle.bind(this, this)
                                    }}
                                />
                            </div>
                        </div>
                    </div> */}

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

// function mapStateToProps(state) {
//     return {
//         polocations: state.polocations
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators(
//         {
//             getLocation: AlgaehActions
//         },
//         dispatch
//     );
// }

// export default withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(PurchaseRequestList)
// );
