import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ItemBatches.scss";
import "./../../../../styles/site.scss";
import {
    AlgaehLabel,
    AlgaehDataGrid,
    AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

export default class ItemBatches extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };

    render() {
        return (
            <React.Fragment>
                <div>
                    <AlgaehModalPopUp
                        events={{
                            onClose: this.onClose.bind(this)
                        }}
                        title="Item Batch"
                        openPopup={this.props.show}
                    >
                        <div className="col-lg-12 popupInner">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <AlgaehDataGrid
                                            id="item_batchs"
                                            columns={[
                                                {
                                                    fieldName: "item_name",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "sales_uom",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "batchno",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "expirydt",
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
                                                            label={{ forceLabel: "Quantity in Hand" }}
                                                        />
                                                    )
                                                },
                                                {
                                                    fieldName: "git_stock",
                                                    label: (
                                                        <AlgaehLabel
                                                            label={{ forceLabel: "GIT Quantity" }}
                                                        />
                                                    )
                                                },
                                                {
                                                    fieldName: "sale_price",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "adjust_qty",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Adjust Quantity" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "git_adjust_qty",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "GIT Adjust Quantity" }} />
                                                    )
                                                }
                                            ]}
                                            keyId="item_id"
                                            dataSource={{
                                                data: this.state.Batch_Items
                                            }}
                                            algaehSearch={true}
                                            // isEditable={true}
                                            paging={{ page: 0, rowsPerPage: 10 }}
                                        // onRowSelect={row => {
                                        //     row.selected = true;
                                        //     this.onClose(row);
                                        // }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AlgaehModalPopUp>
                </div>
            </React.Fragment>
        );
    }
}

