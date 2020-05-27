import React, { Component } from "react";
import "./AgencyMaster.scss";
import {
    AlgaehDataGrid,
    AlagehFormGroup,
    AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import moment from "moment";

class AgencyMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agency: []
        };
        this.getAgency();
    }

    getAgency() {
        algaehApiCall({
            uri: "/hrsettings/getAgency",
            module: "hrManagement",
            method: "GET",
            onSuccess: res => {
                if (res.data.success) {
                    this.setState({
                        agency: res.data.records
                    });
                }
            },

            onFailure: err => { }
        });
    }

    deleteAgency(data) {
        swal({
            title: "Are you sure you want to delete " + data.agency_name + " ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#44b8bd",
            cancelButtonColor: "#d33",
            cancelButtonText: "No"
        }).then(willDelete => {
            if (willDelete.value) {
                algaehApiCall({
                    uri: "/hrsettings/updateAgency",
                    module: "hrManagement",
                    data: {
                        hims_d_agency_id: data.hims_d_agency_id,
                        agency_name: data.agency_name,
                        record_status: "I"
                    },
                    method: "PUT",
                    onSuccess: response => {
                        if (response.data.success) {
                            swalMessage({
                                title: "Record deleted successfully . .",
                                type: "success"
                            });

                            this.getAgency();
                        } else if (!response.data.success) {
                            swalMessage({
                                title: response.data.message,
                                type: "error"
                            });
                        }
                    },
                    onFailure: error => {
                        swalMessage({
                            title: error.message,
                            type: "error"
                        });
                    }
                });
            }
        });
    }

    updateAgency(data) {
        algaehApiCall({
            uri: "/hrsettings/updateAgency",
            module: "hrManagement",
            method: "PUT",
            data: {
                hims_d_agency_id: data.hims_d_agency_id,
                agency_name: data.agency_name,
                record_status: "A"
            },
            onSuccess: response => {
                if (response.data.success) {
                    swalMessage({
                        title: "Record updated successfully",
                        type: "success"
                    });

                    this.getAgency();
                }
            },
            onFailure: error => {
                swalMessage({
                    title: error.message,
                    type: "error"
                });
            }
        });
    }

    addAgency() {
        AlgaehValidation({
            alertTypeIcon: "warning",
            onSuccess: () => {
                algaehApiCall({
                    uri: "/hrsettings/addAgency",
                    module: "hrManagement",
                    method: "POST",
                    data: {
                        agency_name: this.state.agency_name
                    },
                    onSuccess: res => {
                        if (res.data.success) {
                            this.clearState();
                            this.getAgency();
                            swalMessage({
                                title: "Record Added Successfully",
                                type: "success"
                            });
                        }
                    },
                    onFailure: err => {
                        swalMessage({
                            title: err.message,
                            type: "error"
                        });
                    }
                });
            }
        });
    }

    changeTexts(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    clearState() {
        this.setState({
            agency_name: ""
        });
    }

    changeGridEditors(row, e) {
        let name = e.name || e.target.name;
        let value = e.value || e.target.value;
        row[name] = value;
        row.update();
    }

    render() {
        return (
            <div className="emp_dsgntn">
                <div className="row inner-top-search">
                    <AlagehFormGroup
                        div={{ className: "col-3 mandatory form-group" }}
                        label={{
                            forceLabel: "Agency Name",
                            isImp: true
                        }}
                        textBox={{
                            className: "txt-fld",
                            //decimal: { allowNegative: false },
                            name: "agency_name",
                            value: this.state.agency_name,
                            events: {
                                onChange: this.changeTexts.bind(this)
                            }
                        }}
                    />

                    <div className="col form-group">
                        <button
                            style={{ marginTop: 19 }}
                            className="btn btn-primary"
                            id="srch-sch"
                            onClick={this.addAgency.bind(this)}
                        >
                            Add to List
            </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="portlet portlet-bordered margin-bottom-15">
                            <div className="portlet-title">
                                <div className="caption">
                                    <h3 className="caption-subject">Agency Master List</h3>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <div id="agenDsgnDivGrid_Cntr">
                                    <AlgaehDataGrid
                                        id="empDsgnDivGrid"
                                        data-validate="empDsgnDivGrid"
                                        columns={[

                                            {
                                                fieldName: "agency_name",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Agency Name" }} />
                                                ),
                                                editorTemplate: row => {
                                                    return (
                                                        <AlagehFormGroup
                                                            div={{ className: "col" }}
                                                            textBox={{
                                                                className: "txt-fld",
                                                                name: "agency_name",
                                                                value: row.agency_name,
                                                                events: {
                                                                    onChange: this.changeGridEditors.bind(
                                                                        this,
                                                                        row
                                                                    )
                                                                },
                                                                others: {
                                                                    errormessage: "Agency Name cannot be blank",
                                                                    required: true
                                                                }
                                                            }}
                                                        />
                                                    );
                                                }
                                            },
                                            {
                                                fieldName: "created_date",
                                                label: (
                                                    <AlgaehLabel label={{ forceLabel: "Created Date" }} />
                                                ),
                                                displayTemplate: row => {
                                                    return (
                                                        <span>
                                                            {moment(row.created_date).format("DD-MM-YYYY")}
                                                        </span>
                                                    );
                                                },
                                                disabled: true
                                            }
                                        ]}
                                        keyId="hims_d_agency_id"
                                        dataSource={{
                                            data: this.state.agency
                                        }}
                                        isEditable={true}
                                        filter={true}
                                        paging={{ page: 0, rowsPerPage: 20 }}
                                        events={{
                                            onEdit: () => { },
                                            onDelete: this.deleteAgency.bind(this),
                                            onDone: this.updateAgency.bind(this)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgencyMaster;
