import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./procedures.scss";
import "./../../../styles/site.scss";
import {
    AlgaehLabel,
    AlagehFormGroup,
    AlgaehDataGrid,
    AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import ProceduresEvent from "./ProceduresEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { MainContext } from "algaeh-react-components";

class Procedures extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item_description: null,
            all_procedures: [],
            applyBtn: true,
            qty: 1,
            item_id: null,
            service_id: null
        };
    }

    // static contextType = MainContext;
    // componentDidMount() {
    //     const userToken = this.context.userToken;
    //     this.setState({
    //         hsopital_id: userToken.hims_d_hospital_id,
    //     });

    //     const FIN_Active =
    //         userToken.product_type === "HIMS_ERP" ||
    //             userToken.product_type === "FINANCE_ERP" ||
    //             userToken.product_type === "HRMS_ERP"
    //             ? true
    //             : false;

    //     if (FIN_Active === true) {
    //         this.getFinanceAccountsMaping();
    //     }

    //     if (
    //         this.props.displayservices === undefined ||
    //         this.props.displayservices.length === 0
    //     ) {
    //         this.props.getServices({
    //             uri: "/serviceType/getService",
    //             module: "masterSettings",
    //             method: "GET",
    //             data: { service_type_id: "4" },
    //             redux: {
    //                 type: "SERVICES_GET_DATA",
    //                 mappingName: "displayservices",
    //             },
    //         });
    //     }

    //     if (
    //         this.props.inventoryitemlist === undefined ||
    //         this.props.inventoryitemlist.length === 0
    //     ) {
    //         this.props.getItems({
    //             uri: "/inventory/getItemMaster",
    //             data: { item_status: "A" },
    //             module: "inventory",
    //             method: "GET",
    //             redux: {
    //                 type: "ITEM_GET_DATA",
    //                 mappingName: "inventoryitemlist",
    //             },
    //         });
    //     }
    // }

    UNSAFE_componentWillReceiveProps(newProps) {
        debugger
        if (newProps.all_procedures.length > 0) {
            // let IOputs = newProps.all_procedures;
            this.setState({ all_procedures: newProps.all_procedures });
        }
    }

    onClose = (e) => {
        this.setState(
            {
                item_description: null,
                all_procedures: [],
                applyBtn: true,
                qty: 1,
                item_id: null,
                service_id: null
            },
            () => {
                this.props.onClose && this.props.onClose(false);
            }
        );
    };

    itemSearch(e) {
        ProceduresEvent().itemSearch(this, e);
    }

    eventHandaler(e) {
        ProceduresEvent().texthandle(this, e);
    }
    selectToPay(row, e) {
        debugger
        ProceduresEvent().selectToPay(this, row, e)
    }
    ApplyProcedures(e) {
        ProceduresEvent().ApplyProcedures(this, e);
    }

    render() {
        return (
            <React.Fragment>
                <div className="hptl-phase1-add-investigation-form">
                    <AlgaehModalPopUp
                        class="ProcedureMastrModal"
                        events={{
                            onClose: this.onClose.bind(this),
                        }}
                        title={this.props.HeaderCaption}
                        openPopup={this.props.show}
                    >
                        <div className="col-lg-12 popupInner">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col globalSearchCntr form-group">
                                            <AlgaehLabel label={{ forceLabel: "Search Items" }} />
                                            <h6 onClick={this.itemSearch.bind(this, this)}>
                                                {this.state.item_description
                                                    ? this.state.item_description
                                                    : "Search Items"}
                                                <i className="fas fa-search fa-lg"></i>
                                            </h6>
                                        </div>

                                        <AlagehFormGroup
                                            div={{ className: "col-3" }}
                                            label={{
                                                forceLabel: "Quantity",
                                                isImp: true,
                                            }}
                                            textBox={{
                                                number: {
                                                    allowNegative: false,
                                                    thousandSeparator: ",",
                                                },
                                                className: "txt-fld",
                                                name: "qty",
                                                value: this.state.qty,
                                                events: {
                                                    onChange: this.eventHandaler.bind(this),
                                                },
                                                others: {
                                                    step: "1",
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="portlet-body">
                                        <div className="row">
                                            <div className="col-lg-12" id="procedureGrid_Cntr">
                                                <AlgaehDataGrid
                                                    id="packages_detail_grid"
                                                    columns={[
                                                        {
                                                            fieldName: "SalaryPayment_checkBox",

                                                            label: (
                                                                <AlgaehLabel
                                                                    label={{
                                                                        forceLabel: "Select To Pay",
                                                                    }}
                                                                />
                                                            ),
                                                            //disabled: true
                                                            displayTemplate: (row) => {
                                                                return (
                                                                    <span>
                                                                        <input
                                                                            type="checkbox"
                                                                            value="Front Desk"
                                                                            onChange={this.selectToPay.bind(
                                                                                this,
                                                                                row
                                                                            )}
                                                                            checked={
                                                                                row.select_to_pay === "Y"
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            disabled={
                                                                                row.salary_paid === "Y" ? true : false
                                                                            }
                                                                        />
                                                                    </span>
                                                                );
                                                            },
                                                            others: {
                                                                maxWidth: 100,
                                                                filterable: false,
                                                            },
                                                        },
                                                        {
                                                            fieldName: "procedure_code",
                                                            label: (
                                                                <AlgaehLabel label={{ forceLabel: "Procedure Code" }} />
                                                            ),
                                                            others: {
                                                                maxWidth: 120,
                                                            },
                                                        },
                                                        {
                                                            fieldName: "procedure_desc",
                                                            label: (
                                                                <AlgaehLabel label={{ forceLabel: "Procedure Desc" }} />
                                                            ),
                                                            others: { style: { textAlign: "left" } },
                                                        }
                                                    ]}
                                                    keyId="packages_detail_grid"
                                                    dataSource={{
                                                        data: this.state.all_procedures,
                                                    }}
                                                    // isEditable={true}
                                                    filter={true}
                                                    paging={{ page: 0, rowsPerPage: 10 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="popupFooter">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-4"> &nbsp;</div>

                                    <div className="col-lg-8">
                                        <button
                                            onClick={this.ApplyProcedures.bind(this)}
                                            type="button"
                                            className="btn btn-primary"
                                            disabled={this.state.applyBtn}
                                        >
                                            <AlgaehLabel label={{ forceLabel: "Apply" }} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                this.onClose(e);
                                            }}
                                            type="button"
                                            className="btn btn-default"
                                        >
                                            Cancel
                                        </button>
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

function mapStateToProps(state) {
    return {
        displayservices: state.displayservices,
        inventoryitemlist: state.inventoryitemlist,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getServiceTypes: AlgaehActions,
            getServices: AlgaehActions,
            getItems: AlgaehActions,
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Procedures)
);
