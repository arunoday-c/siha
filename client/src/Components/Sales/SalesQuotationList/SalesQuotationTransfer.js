import React, { PureComponent } from "react";
import "./../../../styles/site.scss";
import {
    AlgaehLabel,
    AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehSearch from "../../Wrapper/globalSearch";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import Options from "../../../Options.json";
import moment from "moment";

export default class SalesQuotationTransfer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            employee_name: null,
            new_sales_person_id: null
        };
    }

    employeeSearch() {
        AlgaehSearch({
            searchGrid: {
                columns: spotlightSearch.Employee_details.employee
            },
            searchName: "employee_branch_wise",
            uri: "/gloabelSearch/get",
            inputs: "hospital_id = " + this.props.hospital_id,
            onContainsChange: (text, serchBy, callBack) => {
                callBack(text);
            },
            onRowSelect: row => {
                this.setState({
                    employee_name: row.full_name,
                    new_sales_person_id: row.hims_d_employee_id
                });
            }
        });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (
            newProps.quot_detail !== undefined
        ) {
            let IOputs = newProps.quot_detail;
            this.setState({ ...this.state, ...IOputs });
        }
    }

    transferPerson() {
        debugger
        if (this.state.new_sales_person_id === null) {
            swalMessage({
                title: "Please select Transfer Person",
                type: "error"
            });
            return
        }
        algaehApiCall({
            uri: "/SalesQuotation/transferSalesQuotation",
            module: "sales",
            method: "PUT",
            data: {
                sales_person_id: this.state.new_sales_person_id,
                hims_f_sales_quotation_id: this.state.hims_f_sales_quotation_id
            },

            onSuccess: response => {
                swalMessage({
                    title: "Transfered Succesfully...",
                    type: "success"
                });
                this.setState(
                    {
                        employee_name: null,
                        sales_person_id: null
                    },
                    () => {
                        this.props.onClose && this.props.onClose(false);
                    }
                );
            }
        });
    }

    onClose = e => {
        this.setState(
            {
                employee_name: null,
                sales_person_id: null
            },
            () => {
                this.props.onClose && this.props.onClose(false);
            }
        );
    };


    render() {
        return (
            <React.Fragment>
                <div className="hptl-phase1-add-investigation-form">
                    <AlgaehModalPopUp
                        class="addServerFav"
                        events={{
                            onClose: this.onClose.bind(this)
                        }}
                        title={this.props.HeaderCaption}
                        openPopup={this.props.open}
                    >
                        <div className="popupInner">
                            <div className="popRightDiv" style={{ maxHeight: "76vh" }}>

                                <div className="row margin-top-15">
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Quotation No."
                                            }}
                                        />
                                        <h6>{this.state.sales_quotation_number}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Quotation Date"
                                            }}
                                        />
                                        <h6>{moment(this.state.sales_quotation_date).format(Options.dateFormat)}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Customer Name"
                                            }}
                                        />
                                        <h6>{this.state.customer_name}</h6>
                                    </div>
                                    <div className="col">
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Incharge Person"
                                            }}
                                        />
                                        <h6>{this.state.full_name}</h6>
                                    </div>
                                    {this.props.HRMNGMT_Active ? (
                                        <div className={"col globalSearchCntr"}>
                                            <AlgaehLabel
                                                label={{ forceLabel: "Tranfer Sales Person", isImp: true }}
                                            />
                                            <h6
                                                className="mandatory"
                                                onClick={this.employeeSearch.bind(this)}
                                            >
                                                {this.state.employee_name
                                                    ? this.state.employee_name
                                                    : "Search Employee"}
                                                <i className="fas fa-search fa-lg" />
                                            </h6>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="popupFooter">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-4"> &nbsp;</div>

                                    <div className="col-lg-8">
                                        <button
                                            onClick={this.transferPerson.bind(this)}
                                            type="button"
                                            className="btn btn-primary"
                                        >
                                            Transfer
                                        </button>
                                        <button
                                            onClick={e => {
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
