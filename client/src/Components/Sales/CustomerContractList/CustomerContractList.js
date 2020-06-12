import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./CustomerContractList.scss";
import "./../../../styles/site.scss";

import {
    dateFormater,
    getContractList,
    // datehandle,
    ShowOrdersOfContarct,
    closeOrdersOfContarct,
    changeEventHandaler,
    dateFormaterTime
} from "./CustomerContractListEvent";
import ContractSalesOrder from "./ContractSalesOrder"
import {
    AlgaehDataGrid,
    AlgaehLabel,
    // AlagehAutoComplete,
    // AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

class SalesOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_list: {}
        };
        getContractList(this)
    }

    componentDidMount() {
        let month = moment().format("MM");
        let year = moment().format("YYYY");
        //to load the same list when user come back from whatever screen they went.
        // if (this.props.backToAuth) {
        //     const { from_date, to_date, customer_id, status } = this.props.prev;
        //     this.setState(
        //         {
        //             from_date,
        //             to_date,
        //             customer_id,
        //             status
        //         },
        //         () => getContractList(this)
        //     );
        // } else {
        //     this.setState(
        //         {
        //             to_date: new Date(),
        //             from_date: moment("01" + month + year, "DDMMYYYY")._d,
        //             customer_id: null,
        //             order_list: [],
        //             status: "1"
        //         },
        //         () => getContractList(this)
        //     );
        // }


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
        const { order_list, radioYes, authorize1, ...rest } = this.state;
        let sendObj = Object.assign(rest, obj);
        this.props.new_routeComponents(sendObj);
    };

    render() {
        return (
            <React.Fragment>
                <ContractSalesOrder
                    order_list={this.state.order_list}
                    open={this.state.openOrderList}
                    onClose={closeOrdersOfContarct.bind(this, this)}
                    customer_list={this.state.customer_list}
                />
                <div className="hptl-customer-contract-list-form">
                    <div
                        className="row inner-top-search"
                        style={{ paddingBottom: "10px" }}
                    >
                        <div className="col-lg-12">
                            <div className="row">
                                {/* <AlgaehDateHandler
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "From Date" }}
                                    textBox={{ className: "txt-fld", name: "from_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    value={this.state.from_date}
                                />
                                <AlgaehDateHandler
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "To Date" }}
                                    textBox={{ className: "txt-fld", name: "to_date" }}
                                    events={{
                                        onChange: datehandle.bind(this, this)
                                    }}
                                    value={this.state.to_date}
                                /> */}
                                {/* <AlagehAutoComplete
                                    div={{ className: "col-3 mandatory" }}
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
                                            this.setState(
                                                {
                                                    customer_id: null
                                                },
                                                () => getContractList(this)
                                            );
                                        },
                                        autoComplete: "off"
                                    }}
                                /> */}

                                {/* <AlagehAutoComplete
                                    div={{ className: "col-2" }}
                                    label={{ forceLabel: "Status" }}
                                    selector={{
                                        name: "status",
                                        className: "select-fld",
                                        value: this.state.status,
                                        dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: GlobalVariables.SALES_ORDER_STATUS
                                        },
                                        onChange: changeEventHandaler.bind(this, this),
                                        onClear: () => {
                                            this.setState({
                                                status: null
                                            });
                                        },
                                        others: {
                                            disabled: this.state.poSelected
                                        }
                                    }}
                                /> */}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body" id="ContractListCntr">
                                    <AlgaehDataGrid
                                        id="ContractList_grid"
                                        columns={[
                                            {
                                                fieldName: "action",
                                                label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            <i
                                                                // style={{
                                                                //     pointerEvents:
                                                                //         row.cancel === "Y" ? "none" : "",
                                                                //     opacity: row.cancel === "Y" ? "0.1" : ""
                                                                // }}
                                                                className="fas fa-eye"
                                                                onClick={ShowOrdersOfContarct.bind(this, this, row)}
                                                            />
                                                        </span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 60,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "contract_number",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Contract No." }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "customer_name",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Customer No." }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "employee_name",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Incharge Person" }} />
                                                ),
                                                disabled: true,
                                                others: {
                                                    maxWidth: 200,
                                                    resizable: false,
                                                    style: { textAlign: "center" }
                                                }
                                            },
                                            {
                                                fieldName: "contract_date",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Controct Date" }} />
                                                ),
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            {dateFormater(this, row.contract_date)}
                                                        </span>
                                                    );
                                                },

                                                disabled: true,
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "start_date",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "Start Date" }}
                                                    />
                                                ),
                                                disabled: true,
                                                displayTemplate: row => {
                                                    return (
                                                        <span>{dateFormater(this, row.start_date)}</span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
                                                    filterable: false
                                                }
                                            },
                                            {
                                                fieldName: "end_date",
                                                label: (
                                                    <AlgaehLabel
                                                        label={{ forceLabel: "End Date" }}
                                                    />
                                                ),
                                                disabled: true,
                                                displayTemplate: row => {
                                                    return (
                                                        <span>{dateFormater(this, row.end_date)}</span>
                                                    );
                                                },
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    style: { textAlign: "center" },
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
                                                        <span>{dateFormater(this, row.delivery_date)}</span>
                                                    );
                                                },

                                                disabled: true,
                                                others: {
                                                    maxWidth: 150,
                                                    resizable: false,
                                                    filterable: false
                                                }
                                            }
                                        ]}
                                        keyId="contract_number"
                                        filter={true}
                                        dataSource={{
                                            data: this.state.contract_list
                                        }}
                                        noDataText="No data available"
                                        paging={{ page: 0, rowsPerPage: 50 }}
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
    connect(mapStateToProps, mapDispatchToProps)(SalesOrderList)
);
