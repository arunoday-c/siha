import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlagehFormGroup,
    AlgaehLabel,
    AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
    texthandle,
    getCtrlCode,
    ClearData,
    SavePosEnrty,
    LocationchangeTexts,
    // DocumentSearch,    
    // generateReport,
} from "./StockAdjustmentEvents";
// getCtrlCode,
import "./StockAdjustment.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
    algaehApiCall,
    swalMessage,
    getCookie
} from "../../../utils/algaehApiCall";

// import GlobalVariables from "../../../utils/GlobalVariables.json";
// import PosListItems from "./PosListItems/PosListItems";
// import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";

class StockAdjustment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location_type: null,
            location_id: null,
            adjustment_number: null,
            adjustment_date: new Date(),
            selectEnable: true
        };
    }
    componentDidMount() {

        this.props.getItems({
            uri: "/pharmacy/getItemMaster",
            data: { item_status: "A" },
            module: "pharmacy",
            method: "GET",
            redux: {
                type: "ITEM_GET_DATA",
                mappingName: "positemlist"
            }
        });

        this.props.getLocation({
            uri: "/pharmacyGlobal/getUserLocationPermission",
            module: "pharmacy",
            method: "GET",
            data: { allow_pos: "Y" },
            redux: {
                type: "LOCATIOS_GET_DATA",
                mappingName: "poslocations"
            }
        });


        let IOputs = {};
        let _screenName = getCookie("ScreenName").replace("/", "");

        algaehApiCall({
            uri: "/userPreferences/get",
            data: {
                screenName: _screenName,
                identifier: "PharmacyLocation"
            },
            method: "GET",
            onSuccess: response => {
                if (response.data.records.selectedValue !== undefined) {
                    IOputs.location_id = response.data.records.selectedValue;
                }
                algaehApiCall({
                    uri: "/userPreferences/get",
                    data: {
                        screenName: _screenName,
                        identifier: "LocationType"
                    },
                    method: "GET",
                    onSuccess: response => {
                        if (response.data.records.selectedValue !== undefined) {
                            IOputs.location_type = response.data.records.selectedValue;
                        }
                        this.setState(IOputs);
                    },
                    onFailure: error => {
                        swalMessage({
                            title: error.message,
                            type: "error"
                        });
                    }
                });
            },
            onFailure: error => {
                swalMessage({
                    title: error.message,
                    type: "error"
                });
            }
        });
    }

    render() {
        const _posLocation =
            this.props.poslocations === undefined ? [] : this.props.poslocations;
        return (
            <React.Fragment>
                <div>
                    <BreadCrumb
                        title={
                            <AlgaehLabel
                                label={{ forceLabel: "Stock Adjustment", align: "ltr" }}
                            />
                        }
                        breadStyle={this.props.breadStyle}
                        pageNavPath={[
                            {
                                pageName: (
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Home",
                                            align: "ltr"
                                        }}
                                    />
                                )
                            },
                            {
                                pageName: (
                                    <AlgaehLabel
                                        label={{ forceLabel: "Stock Adjustment", align: "ltr" }}
                                    />
                                )
                            }
                        ]}
                        soptlightSearch={{
                            label: (
                                <AlgaehLabel
                                    label={{ forceLabel: "Adjustment Number", returnText: true }}
                                />
                            ),
                            value: this.state.adjustment_number,
                            selectValue: "adjustment_number",
                            events: {
                                onChange: getCtrlCode.bind(this, this)
                            },
                            jsonFile: {
                                fileName: "spotlightSearch",
                                fieldName: "RequisitionEntry.ReqEntry"
                            },
                            searchName: "REQEntry"
                        }}
                        userArea={
                            <div className="row">
                                <div className="col">
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Adjustment Date"
                                        }}
                                    />
                                    <h6>
                                        {this.state.adjustment_date
                                            ? moment(this.state.adjustment_date).format(
                                                Options.dateFormat
                                            )
                                            : Options.dateFormat}
                                    </h6>
                                </div>
                            </div>
                        }
                        // printArea={
                        //     this.state.adjustment_number !== null
                        //         ? {
                        //             menuitems: [
                        //                 {
                        //                     label: "Print Receipt",
                        //                     events: {
                        //                         onClick: () => {
                        //                             generateMaterialReqPhar(this.state);
                        //                         }
                        //                     }
                        //                 }
                        //             ]
                        //         }
                        //         : ""
                        // }
                        selectedLang={this.state.selectedLang}
                    />
                    <div className="row  inner-top-search" style={{ marginTop: 76, paddingBottom: 10 }}>
                        {/* Patient code */}
                        <div className="col">
                            <div className="row">
                                <AlagehAutoComplete
                                    div={{ className: "col mandatory" }}
                                    label={{ forceLabel: "Location", isImp: true }}
                                    selector={{
                                        name: "location_id",
                                        className: "select-fld",
                                        value: this.state.location_id,
                                        dataSource: {
                                            textField: "location_description",
                                            valueField: "hims_d_pharmacy_location_id",
                                            data: _posLocation
                                        },
                                        onChange: LocationchangeTexts.bind(this, this),
                                        autoComplete: "off",
                                        others: {
                                            disabled: this.state.dataExitst
                                        },
                                        onClear: () => {
                                            this.setState({
                                                location_id: null,
                                                selectEnable: true
                                            });
                                        },
                                    }}
                                />
                                <div className="col">
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Location Type"
                                        }}
                                    />
                                    <h6>
                                        {this.state.location_type
                                            ? this.state.ocation_type === "WH"
                                                ? "Warehouse"
                                                : this.state.ocation_type === "MS"
                                                    ? "Main Store"
                                                    : "Sub Store"
                                            : "----------"}
                                    </h6>
                                </div>
                                <AlagehFormGroup
                                    div={{ className: "col mandatory" }}
                                    label={{
                                        forceLabel: "Comments",
                                        isImp: true
                                    }}
                                    textBox={{
                                        className: "txt-fld",
                                        name: "comments",
                                        value: this.state.comments,
                                        events: {
                                            onChange: texthandle.bind(this, this)
                                        },
                                        others: {
                                            disabled: this.state.existingPatient,
                                            placeholder: "Enter Comments"
                                        }
                                    }}
                                />
                                <div className="col">
                                    <button
                                        className="btn btn-primary"
                                        onClick={SavePosEnrty.bind(this, this)}
                                        disabled={this.state.selectEnable}
                                        style={{ marginTop: 18 }}
                                    >
                                        <AlgaehLabel
                                            label={{
                                                forceLabel: "Select Items",
                                                returnText: true
                                            }}
                                        />
                                    </button>
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
                                    onClick={SavePosEnrty.bind(this, this)}
                                    disabled={this.state.postEnable}
                                >
                                    <AlgaehLabel
                                        label={{
                                            forceLabel: "Save",
                                            returnText: true
                                        }}
                                    />
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={ClearData.bind(this, this)}
                                >
                                    <AlgaehLabel
                                        label={{ forceLabel: "Clear", returnText: true }}
                                    />
                                </button>

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
        positemlist: state.positemlist,
        poslocations: state.poslocations,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getItems: AlgaehActions,
            getLocation: AlgaehActions,
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StockAdjustment)
);
