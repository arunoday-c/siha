import React, { Component } from "react";
import "./SalesQuotationList.scss";
import SalesQuotationList from "./SalesQuotationList";
import SalesQuotation from "../SalesQuotation/SalesQuotation";
// import SalesOrder from "../SalesOrder/SalesOrder";
import { getCookie } from "../../../utils/algaehApiCall";
import { removeGlobal } from "../../../utils/GlobalFunctions";

class SalesQuotationSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RQ_Screen: getCookie("ScreenName").replace("/", "")
        };
        this.routeComponents = this.routeComponents.bind(this);
        this.new_routeComponents = this.new_routeComponents.bind(this);
        this.goBackToAuth = this.goBackToAuth.bind(this);
    }

    routeComponents() {
        this.setState(
            {
                RQ_Screen: Window.global["RQ-STD"],
                sales_quotation_number: Window.global["sales_quotation_number"]
            },
            () => {
                this.changeDisplays(Window.global["RQ-STD"]);
            }
        );
    }

    new_routeComponents(obj) {
        this.setState(
            {
                ...obj
            },
            () => {
                this.changeDisplays();
            }
        );
    }

    goBackToAuth() {
        this.setState(
            {
                backToAuth: true,
                RQ_Screen: "SalesQuotationList"
            },
            this.changeDisplays
        );
    }

    componentWillUnmount() {
        removeGlobal("RQ-STD");
    }

    componentList() {
        return {
            SalesQuotationList: (
                <SalesQuotationList
                    backToAuth={this.state.backToAuth}
                    new_routeComponents={this.new_routeComponents}
                    prev={this.state}
                />
            ),
            SalesQuotation: (
                <SalesQuotation
                    sales_quotation_number={this.state.sales_quotation_number}
                    requisition_auth={true}
                />
            ),
            // SalesOrder: (
            //     <SalesOrder
            //         hims_f_sales_quotation_id={
            //             this.state.hims_f_sales_quotation_id
            //         }            
            //         requisition_auth={true}
            //     />
            // )
        };
    }

    changeDisplays() {
        return this.componentList()[this.state.RQ_Screen];
    }

    render() {
        return (
            <div className="hptl-sales-quotation-list-form">
                <div>
                    <button
                        className="d-none"
                        id="rq-router"
                        onClick={this.routeComponents}
                    />

                    <button
                        style={{
                            display:
                                this.state.RQ_Screen === "SalesQuotationList" ? "none" : "block"
                        }}
                        className="btn btn-default bk-bn"
                        onClick={this.goBackToAuth}
                    >
                        <i className="fas fa-angle-double-left fa-lg" />
                        Back to List
                    </button>

                    <div>{this.changeDisplays()}</div>
                </div>
            </div>
        );
    }
}

export default SalesQuotationSwitch;
