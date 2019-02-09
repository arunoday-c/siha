import React, { Component } from 'react'
import "./WPS.css";
import {
    AlgaehDataGrid,
    AlgaehDateHandler,
    AlagehAutoComplete,
    AlagehFormGroup,
    AlgaehLabel
} from '../../Wrapper/algaehWrapper';
export default class WPS extends Component {
    render() {
        return (
            <div className="wps_Screen">
                <div className="row  inner-top-search">
                    <AlagehAutoComplete
                        div={{ className: 'col form-group' }}
                        label={{
                            forceLabel: 'Year',
                            isImp: false
                        }}
                        selector={{
                            name: '',
                            className: 'select-fld',
                            dataSource: {},
                            others: {}
                        }}
                    />
                    <AlagehAutoComplete
                        div={{ className: 'col form-group' }}
                        label={{
                            forceLabel: 'Month',
                            isImp: false
                        }}
                        selector={{
                            name: '',
                            className: 'select-fld',
                            dataSource: {},
                            others: {}
                        }}
                    />
                    <AlagehAutoComplete
                        div={{ className: 'col form-group' }}
                        label={{
                            forceLabel: 'Select Bank',
                            isImp: false
                        }}
                        selector={{
                            name: '',
                            className: 'select-fld',
                            dataSource: {},
                            others: {}
                        }}
                    />
                    <div className="col form-group">
                        <button style={{ marginTop: 21 }} className="btn btn-primary">
                            Load
						</button>
                        <button
                            //  onClick={this.clearState.bind(this)}
                            style={{ marginTop: 21, marginLeft: 5 }}
                            className="btn btn-default"
                        >
                            Clear
						</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="portlet portlet-bordered margin-bottom-15">
                            <div className="portlet-title">
                                <div className="caption">
                                    <h3 className="caption-subject">WPS Statement</h3>
                                </div>
                                {/* <div className="actions">
                                    <a className="btn btn-primary btn-circle active">
                                        <i className="fas fa-pen" />
                                    </a>
                                </div> */}
                            </div>
                            <div className="portlet-body">
                                <div className="row">
                                    <div className="col-12" id="WPSGrid_Cntr">
                                        <AlgaehDataGrid
                                            id="WPSGrid"
                                            datavalidate="WPSGrid"
                                            columns={[
                                                {
                                                    fieldName: "recordID",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Record ID" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "employeeQID",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Employee QID" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "employeeVisaID",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Employee Visa ID" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "empName",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "employeeBankName",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Employee Bank Name" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "employeeBankAccNo",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Employee Account No." }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "salaryFreq",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Salary Frequency" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "workingDays",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "No. of Working Days" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "netSalary",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "basicSalary",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Basic Salary" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "extraHours",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Extra Hours" }} />
                                                    )
                                                },
                                                {
                                                    fieldName: "extraIncome",
                                                    label: (
                                                        <AlgaehLabel label={{ forceLabel: "Extra Income" }} />
                                                    )
                                                }
                                            ]}
                                            keyId=""
                                            dataSource={{ data: [] }}
                                            isEditable={false}
                                            paging={{ page: 0, rowsPerPage: 50 }}
                                            events={{}}
                                            others={{}}
                                        />
                                    </div>
                                </div>
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
                            >
                                Generate SIF
                        </button>
                            <button
                                type="button"
                                className="btn btn-default"
                            >Export Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
