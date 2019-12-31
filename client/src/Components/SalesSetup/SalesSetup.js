import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SalesSetup.scss";
import "../../index.scss";
import TermsConditions from "./TermsConditions/TermsConditions";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import _ from "lodash";

class SalesSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageDisplay: "TermsConditions",
        };
    }

    openTab(e) {
        var element = document.querySelectorAll("[algaehtabs]");
        for (var i = 0; i < element.length; i++) {
            element[i].classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        var specified = e.currentTarget.getAttribute("algaehtabs");
        this.setState({
            pageDisplay: specified
        });
    }

    componentDidMount() {
        this.props.getUserDetails({
            uri: "/algaehappuser/selectAppUsers",
            method: "GET",
            redux: {
                type: "USER_DETAILS_GET_DATA",
                mappingName: "userdrtails"
            }
        });
    }

    render() {
        return (
            <div className="sales_setup">
                <div className="row">
                    <div className="tabMaster toggle-section">
                        <ul className="nav">
                            <li
                                algaehtabs={"TermsConditions"}
                                className={"nav-item tab-button active"}
                                onClick={this.openTab.bind(this)}
                            >
                                {
                                    <AlgaehLabel
                                        label={{
                                            fieldName: "terms_conditions"
                                        }}
                                    />
                                }
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="sales_section">


                    {this.state.pageDisplay === "TermsConditions" ? (
                        <TermsConditions />
                    ) : null}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userdrtails: state.userdrtails
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getUserDetails: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SalesSetup)
);
