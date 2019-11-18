import React, { Component } from "react";

import "./Equipment.scss";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    AlagehFormGroup,
    AlgaehDataGrid,
    AlagehAutoComplete,
    AlgaehLabel,
    AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { analyteEvent, changeTexts, addToList, deleteAnalyteMap, saveMachineAnalyte } from "./EquipmentEvent";

class EquipmentPop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hims_m_machine_analytes_header_id: null,
            machine_id: null,
            machine_analyte_code: null,
            machine_analyte_name: null,
            analyte_id: null,
            analytes_data: [],
            analyte_name: null,
            saveEnable: true,
            insert_analytes_data: [],
            delete_analytes_data: []
        };

    }

    onClose = e => {
        this.setState({
            hims_m_machine_analytes_header_id: null,
            machine_id: null,
            machine_analyte_code: null,
            machine_analyte_name: null,
            analyte_id: null,
            analytes_data: [],
            analyte_name: null,
            saveEnable: true
        }, () => {
            this.props.onClose && this.props.onClose(false);
        })

    };

    componentWillReceiveProps(newProps) {
        debugger
        if (Object.keys(newProps.selected_Machine_analyte).length > 0) {
            debugger
            newProps.selected_Machine_analyte.saveEnable = false
            this.setState(newProps.selected_Machine_analyte);
        }
    }

    render() {
        return (
            <div className="lab_section">
                <AlgaehModalPopUp
                    open={this.props.open}
                    events={{
                        onClose: this.onClose.bind(this)
                    }}
                    title="Machine Analyte Mapping"
                    openPopup={this.props.open}
                >
                    <div className="popupInner" data-validate="ItemMaster">

                        <div
                            className="row"
                            style={{
                                paddingTop: 20,
                                marginLeft: "auto",
                                marginRight: "auto"
                            }}
                        >

                            <AlagehAutoComplete
                                div={{ className: "col-lg-4 mandatory" }}
                                label={{
                                    forceLabel: "Select Machine",
                                    isImp: true
                                }}
                                selector={{
                                    name: "machine_id",
                                    className: "select-fld",
                                    value: this.state.machine_id,
                                    dataSource: {
                                        textField: "machine_name",
                                        valueField: "hims_d_lis_configuration_id",
                                        data: this.props.machinedata
                                    },
                                    onChange: changeTexts.bind(this, this),
                                    onClear: () => {
                                        this.setState({
                                            machine_id: null
                                        })
                                    },
                                    others: {
                                        disabled: this.state.hims_m_machine_analytes_header_id === null ? false : true
                                    }
                                }}
                            />

                        </div>
                        <div
                            className="row"
                            style={{
                                paddingTop: 20,
                                marginLeft: "auto",
                                marginRight: "auto"
                            }}
                            data-validate="MachineAnalyteDetails"
                        >
                            <AlagehFormGroup
                                div={{ className: "col mandatory" }}
                                label={{
                                    forceLabel: "Machine Analyte Code",
                                    isImp: true
                                }}
                                textBox={{
                                    className: "txt-fld",
                                    name: "machine_analyte_code",
                                    value: this.state.machine_analyte_code,
                                    events: {
                                        onChange: changeTexts.bind(this, this)
                                    }
                                }}
                            />

                            <AlagehFormGroup
                                div={{ className: "col mandatory" }}
                                label={{
                                    forceLabel: "Machine Analyte Name",
                                    isImp: true
                                }}
                                textBox={{
                                    className: "txt-fld",
                                    name: "machine_analyte_name",
                                    value: this.state.machine_analyte_name,
                                    events: {
                                        onChange: changeTexts.bind(this, this)
                                    }
                                }}
                            />

                            <AlagehAutoComplete
                                div={{ className: "col mandatory" }}
                                label={{
                                    forceLabel: "Select Analyte",
                                    isImp: true
                                }}
                                selector={{
                                    name: "analyte_id",
                                    className: "select-fld",
                                    value: this.state.analyte_id,
                                    dataSource: {
                                        textField: "description",
                                        valueField: "hims_d_lab_analytes_id",
                                        data: this.props.labanalytes
                                    },
                                    onChange: analyteEvent.bind(this, this),
                                    onClear: () => {
                                        this.setState({
                                            analyte_id: null
                                        })
                                    }
                                }}
                            />
                            <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
                                <button
                                    onClick={addToList.bind(this, this)}
                                    className="btn btn-primary"
                                >
                                    Add to List
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12" id="analyte_machine_grid_cntr">
                                <AlgaehDataGrid
                                    id="machine_analytes"
                                    columns={[
                                        {
                                            fieldName: "machine_analyte_code",
                                            label: <AlgaehLabel label={{ forceLabel: "Machine Analyte Code" }} />
                                        },
                                        {
                                            fieldName: "machine_analyte_name",
                                            label: <AlgaehLabel label={{ forceLabel: "Machine Analyte Name" }} />
                                        },
                                        {
                                            fieldName: "analyte_name",
                                            label: <AlgaehLabel label={{ forceLabel: "Analyte Name" }} />
                                        }

                                    ]}
                                    keyId="hims_d_lab_section_id"
                                    dataSource={{
                                        data:
                                            this.state.analytes_data
                                    }}
                                    actions={{
                                        allowEdit: false
                                    }}
                                    filter={true}
                                    isEditable={true}
                                    paging={{ page: 0, rowsPerPage: 5 }}
                                    events={{
                                        onDelete: deleteAnalyteMap.bind(this, this),
                                        onEdit: row => { }
                                        // onDone: row => {
                                        //   alert(JSON.stringify(row));
                                        // }
                                        // onDone: this.updateLabSection.bind(this)
                                    }}
                                />
                            </div>
                        </div>

                        {/* <div className="row">
                            <div className="col-lg-12">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                // onClick={this.SavePatientDetails.bind(this)}
                                >
                                    Save
                                </button>
                            </div>
                        </div> */}
                    </div>
                    <div className="popupFooter">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-4"> &nbsp;</div>

                                <div className="col-lg-8">

                                    <button
                                        onClick={saveMachineAnalyte.bind(this, this)}
                                        className="btn btn-primary"
                                        disabled={this.state.saveEnable}
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={e => {
                                            this.onClose(e);
                                        }}
                                        className="btn btn-default"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AlgaehModalPopUp>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        labanalytes: state.labanalytes,
        machinedata: state.machinedata
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getLabAnalytes: AlgaehActions,
            getLisMachineConfiguration: AlgaehActions
        },
        dispatch
    );
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(EquipmentPop)
);
