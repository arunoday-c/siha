import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./QuotationCompare.scss";
import {
    AlgaehDataGrid,
    AlgaehLabel,
    AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
    texthandle,
    QuotationSearch,
    generateVendorQuotation,
    getVendorMaster
} from "./QuotationCompareEvents";

class QuotationCompare extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vendor_body: [],
            vendor_headers: [],
            vendor_id: null,
            quotation_number: null,
        };
        getVendorMaster(this, this);
    }

    render() {

        return (
            <div>

                <div className="hims-request-for-quotation">
                    <div
                        className="row inner-top-search"
                        style={{ paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">


                                <div className={"col-3 globalSearchCntr"}>
                                    <AlgaehLabel label={{ forceLabel: "Search Quotation No." }} />
                                    <h6 onClick={QuotationSearch.bind(this, this)}>
                                        {this.state.quotation_number
                                            ? this.state.quotation_number
                                            : "Quotation No."}
                                        <i className="fas fa-search fa-lg"></i>
                                    </h6>
                                </div>

                                {/* <AlagehAutoComplete
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "Vendor No." }}
                                    selector={{
                                        name: "vendor_id",
                                        className: "select-fld",
                                        value: this.state.vendor_id,
                                        dataSource: {
                                            textField: "vendor_name",
                                            valueField: "hims_d_vendor_id",
                                            data: this.props.povendors
                                        },
                                        onChange: texthandle.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                vendor_id: null
                                            });
                                        }
                                    }}
                                /> */}
                            </div>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="row">

                            <div className="col-12">

                                <table>
                                    <thead>
                                        <tr>
                                            <th> Item Description </th>
                                            <th> UOM </th>
                                            <th> Req. Quantity </th>
                                            {this.state.vendor_headers.map((data, index) => (<th key={index}>{data}</th>))}
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.state.vendor_body.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.item_description}</td>
                                                <td>{data.uom_description}</td>
                                                <td>{data.quantity}</td>
                                                {Object.keys(data).map((elemnt, idx) => {
                                                    const exist = elemnt.includes("unit_price");
                                                    if (exist) {
                                                        return (<td key={idx}>{data[elemnt]}</td>);
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </tr>
                                        ))}


                                        {/* map statement has to come here */}
                                    </tbody>
                                </table>
                                {/* <AlgaehDataGrid
                                    id="vendor_quotation"
                                    columns={this.state.vendor_data}
                                    keyId="vendor_quotation_compare"
                                    dataSource={{
                                        data: this.state.item_details
                                    }}
                                    isEditable={false}
                                    filter={false}
                                    paging={{ page: 0, rowsPerPage: 20 }}
                                    // forceRender={true}
                                    events={{
                                        onEdit: () => { },
                                        onDone: () => { }
                                    }}
                                    actions={{
                                        allowDelete: false
                                    }}
                                /> */}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        povendors: state.povendors
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getVendorMaster: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QuotationCompare)
);
