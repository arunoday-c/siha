import React, { Component } from "react";
import "./Allergies.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlagehFormGroup,
    AlgaehDataGrid,
    AlagehAutoComplete,
    AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import {
    changeTexts,
    onchangegridcol,
    insertAllergy,
    updateAllergy,
    deleteAllergy
} from "./AllergiesEvent";
import Options from "../../../Options.json";
import moment from "moment";

class LabAnalyte extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hims_d_allergy_id: "",
            allergy_type: "",
            allergy_name: null,
            description_error: false,
            description_error_txt: ""
        };
        this.baseState = this.state;
    }

    componentDidMount() {
        let prevLang = getCookie("Language");

        this.setState({
            selectedLang: prevLang
        });
        if (
            this.props.allallergies === undefined ||
            this.props.allallergies.length === 0
        ) {
            this.props.getAllergyDetails({
                uri: "/doctorsWorkBench/getAllergyDetails",
                method: "GET",
                cancelRequestId: "getAllergyDetails",
                redux: {
                    type: "ALL_ALLERGIES",
                    mappingName: "allallergies"
                }
            });
        }
        if (
            this.props.userdrtails === undefined ||
            this.props.userdrtails.length === 0
        ) {
            this.props.getUserDetails({
                uri: "/algaehappuser/selectAppUsers",
                method: "GET",
                redux: {
                    type: "USER_DETAILS_GET_DATA",
                    mappingName: "userdrtails"
                }
            });
        }
    }

    dateFormater(date) {
        if (date !== null) {
            return moment(date).format(Options.dateFormat);
        }
    }

    ShowModel = row => {
        this.setState({
            isOpen: !this.state.isOpen,
            active: row
        });
    };

    CloseModel(e) {
        this.setState({
            isOpen: !this.state.isOpen,
            active: {}
        });
    }
    render() {
        return (
            <div className="lab_section">
                <div className="row inner-top-search margin-bottom-15">

                    <AlagehAutoComplete
                        div={{ className: "col-2 form-group mandatory" }}
                        label={{
                            forceLabel: "Allergy Type",
                            isImp: true
                        }}
                        selector={{
                            name: "allergy_type",
                            className: "select-fld",
                            value: this.state.allergy_type,
                            dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.ALLERGY_TYPES
                            },
                            onChange: changeTexts.bind(this, this)
                        }}
                    />

                    <AlagehFormGroup
                        div={{ className: "col-3 form-group mandatory" }}
                        label={{
                            forceLabel: "Allergy Name",
                            isImp: true
                        }}
                        textBox={{
                            className: "txt-fld",
                            name: "allergy_name",
                            value: this.state.allergy_name,
                            events: {
                                onChange: changeTexts.bind(this, this)
                            }
                        }}
                    />

                    <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
                        <button
                            onClick={insertAllergy.bind(this, this)}
                            className="btn btn-primary"
                        >
                            Add to List
                        </button>
                    </div>
                </div>

                <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-body">
                        <div className="row" data-validate="analyteDiv">
                            <div className="col" id="labAnalyteGrid_Cntr">
                                <AlgaehDataGrid
                                    datavalidate="data-validate='analyteDiv'"
                                    id="labAnalyteGrid"
                                    columns={[
                                        {
                                            fieldName: "allergy_type",
                                            label: (
                                                <AlgaehLabel label={{ fieldName: "allergy_type" }} />
                                            ),
                                            displayTemplate: row => {
                                                let display = GlobalVariables.ALLERGY_TYPES.filter(
                                                    f => f.value === row.allergy_type
                                                );

                                                return (
                                                    <span>
                                                        {display !== undefined && display.length !== 0
                                                            ? display[0].name
                                                            : ""}
                                                    </span>
                                                );
                                            },
                                            editorTemplate: row => {
                                                return (
                                                    <AlagehAutoComplete
                                                        div={{}}
                                                        selector={{
                                                            name: "allergy_type",
                                                            className: "select-fld",
                                                            value: row.allergy_type,
                                                            dataSource: {
                                                                textField: "name",
                                                                valueField: "value",
                                                                data: GlobalVariables.ALLERGY_TYPES
                                                            },
                                                            onChange: onchangegridcol.bind(this, this, row),
                                                            others: {
                                                                errormessage: "Analyte Type - cannot be blank",
                                                                required: true
                                                            }
                                                        }}
                                                    />
                                                );
                                            }
                                        },
                                        {
                                            fieldName: "allergy_name",
                                            label: (
                                                <AlgaehLabel
                                                    label={{ forceLabel: "Allergy Name" }}
                                                />
                                            ),
                                            editorTemplate: row => {
                                                return (
                                                    <AlagehFormGroup
                                                        textBox={{
                                                            value: row.allergy_name,
                                                            className: "txt-fld",
                                                            name: "allergy_name",
                                                            events: {
                                                                onChange: onchangegridcol.bind(this, this, row)
                                                            },
                                                            others: {
                                                                errormessage: "Allergy Name - cannot be blank",
                                                                required: true
                                                            }
                                                        }}
                                                    />
                                                );
                                            }
                                        },
                                        {
                                            fieldName: "created_by",
                                            label: (
                                                <AlgaehLabel label={{ fieldName: "created_by" }} />
                                            ),
                                            displayTemplate: row => {
                                                let display =
                                                    this.props.userdrtails === undefined
                                                        ? []
                                                        : this.props.userdrtails.filter(
                                                            f => f.algaeh_d_app_user_id === row.created_by
                                                        );

                                                return (
                                                    <span>
                                                        {display !== null && display.length !== 0
                                                            ? display[0].username
                                                            : ""}
                                                    </span>
                                                );
                                            },

                                            editorTemplate: row => {
                                                let display =
                                                    this.props.userdrtails === undefined
                                                        ? []
                                                        : this.props.userdrtails.filter(
                                                            f => f.algaeh_d_app_user_id === row.created_by
                                                        );

                                                return (
                                                    <span>
                                                        {display !== null && display.length !== 0
                                                            ? display[0].username
                                                            : ""}
                                                    </span>
                                                );
                                            },
                                            others: { maxWidth: 150 }
                                            // disabled: true
                                        },
                                        {
                                            fieldName: "created_date",
                                            label: (
                                                <AlgaehLabel label={{ fieldName: "created_date" }} />
                                            ),
                                            displayTemplate: row => {
                                                return (
                                                    <span>{this.dateFormater(row.created_date)}</span>
                                                );
                                            },
                                            editorTemplate: row => {
                                                return (
                                                    <span>{this.dateFormater(row.created_date)}</span>
                                                );
                                            },
                                            others: { maxWidth: 100 }
                                        }
                                    ]}
                                    keyId="hims_d_allergy_id"
                                    dataSource={{
                                        data:
                                            this.props.allallergies === undefined
                                                ? []
                                                : this.props.allallergies
                                    }}
                                    isEditable={true}
                                    filter={true}
                                    paging={{ page: 0, rowsPerPage: 10 }}
                                    events={{
                                        onDelete: deleteAllergy.bind(this, this),
                                        onEdit: row => { },
                                        onDone: updateAllergy.bind(this, this)
                                    }}
                                />
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
        allallergies: state.allallergies,
        userdrtails: state.userdrtails
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getAllergyDetails: AlgaehActions,
            getUserDetails: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(LabAnalyte)
);
