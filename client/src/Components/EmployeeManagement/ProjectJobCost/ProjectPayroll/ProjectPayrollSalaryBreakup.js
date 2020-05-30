import React, { PureComponent } from "react";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import "./ProjectPayroll.scss";
// import "./../../styles/site.scss";
import {
    AlgaehLabel,
    AlgaehDataGrid,
    AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

export default class ProjectPayrollSalaryBreakup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.selectedEmployee !== undefined) {
            this.setState({ ...this.state, ...newProps.selectedEmployee });
        }
    }

    render() {
        return (
            <div>
                <AlgaehModalPopUp
                    events={{
                        onClose: this.onClose.bind(this)
                    }}
                    title="Salary Details"
                    openPopup={this.props.open}
                >
                    <div className="popupInner">
                        <div className="col-12 margin-top-15"></div>
                        <div className="col-12 margin-bottom-15">
                            <div className="portlet portlet-bordered">
                                <div className="portlet-body">
                                    <div className="row">
                                        <div className="col-4">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Employee Code"
                                                }}
                                            />
                                            <h6>
                                                {this.state.employee_code === null
                                                    ? 0
                                                    : this.state.employee_code}
                                            </h6>
                                        </div>
                                        <div className="col-4">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Employee Name"
                                                }}
                                            />
                                            <h6>
                                                {this.state.full_name === null
                                                    ? 0
                                                    : this.state.full_name}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Project Name"
                                                }}
                                            />
                                            <h6>
                                                {this.state.project_desc === null
                                                    ? 0
                                                    : this.state.project_desc}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Worked Hrs."
                                                }}
                                            />
                                            <h6>
                                                {this.state.total_working_hours === null
                                                    ? 0
                                                    : this.state.total_working_hours}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "OT Hrs."
                                                }}
                                            />
                                            <h6>
                                                {this.state.ot_work === null
                                                    ? 0
                                                    : this.state.ot_work}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Total Cost"
                                                }}
                                            />
                                            <h6>
                                                {this.state.project_cost === null
                                                    ? 0
                                                    : this.state.project_cost}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3 className="caption-subject">Earnings</h3>
                                            </div>
                                            <div className="actions">
                                            </div>
                                        </div>

                                        <div className="portlet-body">
                                            <div className="row">
                                                <div className="col-lg-12" id="Salary_Earning_Cntr">
                                                    <AlgaehDataGrid
                                                        id="Salary_Earning_Cntr_grid"
                                                        columns={[
                                                            {
                                                                fieldName: "earning_deduction_description",

                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Description"
                                                                        }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "amount",

                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Amount"
                                                                        }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    return (
                                                                        <span>{GetAmountFormart(row.amount)}</span>
                                                                    );
                                                                },

                                                                others: {
                                                                    maxWidth: 100
                                                                }
                                                            }
                                                        ]}
                                                        keyId="algaeh_d_module_id"
                                                        dataSource={{
                                                            data: this.state.earning_details
                                                        }}
                                                        isEditable={false}
                                                        paging={{ page: 0, rowsPerPage: 10 }}
                                                        events={{
                                                            onEdit: () => { },
                                                            onDelete: () => { },
                                                            onDone: () => { }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-4">
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3 className="caption-subject">Employee Deduction</h3>
                                            </div>
                                            <div className="actions">
                                              
                                            </div>
                                        </div>

                                        <div className="portlet-body">
                                            <div className="row">
                                                <div
                                                    className="col-lg-12"
                                                    id="Employee_Deductions_Cntr"
                                                >
                                                    <AlgaehDataGrid
                                                        id="Employee_Deductions_Cntr_grid"
                                                        columns={[
                                                            {
                                                                fieldName: "earning_deduction_description",

                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Description"
                                                                        }}
                                                                    />
                                                                )
                                                                //disabled: true
                                                            },
                                                            {
                                                                fieldName: "amount",

                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Amount"
                                                                        }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    return (
                                                                        <span>{GetAmountFormart(row.amount)}</span>
                                                                    );
                                                                },

                                                                others: {
                                                                    maxWidth: 100
                                                                }
                                                            }
                                                        ]}
                                                        keyId="algaeh_d_module_id"
                                                        dataSource={{
                                                            data: this.state.salaryprocess_Deduction
                                                        }}
                                                        isEditable={false}
                                                        paging={{ page: 0, rowsPerPage: 10 }}
                                                        events={{
                                                            onEdit: () => { },
                                                            onDelete: () => { },
                                                            onDone: () => { }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="col-4">
                                    <div className="portlet portlet-bordered margin-bottom-15">
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <h3 className="caption-subject">
                                                    Employer Contribution
                        </h3>
                                            </div>
                                            <div className="actions">
                                                
                                            </div>
                                        </div>

                                        <div className="portlet-body">
                                            <div className="row">
                                                <div
                                                    className="col-lg-12"
                                                    id="Employer_Contribution_Cntr"
                                                >
                                                    <AlgaehDataGrid
                                                        id="Employer_Contribution_Cntr_grid"
                                                        columns={[
                                                            {
                                                                fieldName: "earning_deduction_description",

                                                                //disabled: true
                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Description"
                                                                        }}
                                                                    />
                                                                )
                                                            },
                                                            {
                                                                fieldName: "amount",

                                                                label: (
                                                                    <AlgaehLabel
                                                                        label={{
                                                                            forceLabel: "Amount"
                                                                        }}
                                                                    />
                                                                ),
                                                                displayTemplate: row => {
                                                                    return (
                                                                        <span>{GetAmountFormart(row.amount)}</span>
                                                                    );
                                                                },

                                                                others: {
                                                                    maxWidth: 100
                                                                }
                                                            }
                                                        ]}
                                                        keyId="algaeh_d_module_id"
                                                        dataSource={{
                                                            data: this.state.salaryprocess_Contribute
                                                        }}
                                                        isEditable={false}
                                                        paging={{ page: 0, rowsPerPage: 10 }}
                                                        events={{
                                                            onEdit: () => { },
                                                            onDelete: () => { },
                                                            onDone: () => { }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        {/* <div className="col-12">
                            <div className="portlet portlet-bordered margin-bottom-15">
                                <div className="portlet-body">
                                    <div className="row">
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Gross Earnings"
                                                }}
                                            />
                                            <h6>
                                                {this.state.total_earnings === null
                                                    ? 0
                                                    : GetAmountFormart(this.state.total_earnings)}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Total Deductions"
                                                }}
                                            />
                                            <h6>
                                                {this.state.total_deductions === null
                                                    ? 0
                                                    : GetAmountFormart(this.state.total_deductions)}
                                            </h6>
                                        </div>

                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Loan Payable"
                                                }}
                                            />
                                            <h6>
                                                {this.state.loan_payable_amount === null
                                                    ? 0
                                                    : GetAmountFormart(this.state.loan_payable_amount)}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Due Loan"
                                                }}
                                            />
                                            <h6>
                                                {this.state.loan_due_amount === null
                                                    ? 0
                                                    : GetAmountFormart(this.state.loan_due_amount)}
                                            </h6>
                                        </div>
                                        <div className="col-2">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Net Salary"
                                                }}
                                            />
                                            <h6>
                                                {this.state.net_salary === null
                                                    ? 0
                                                    : GetAmountFormart(this.state.net_salary)}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    <div className="popupFooter">
                        <div className="col-lg-12">
                            <button
                                type="button"
                                className="btn btn-default"
                                onClick={e => {
                                    this.onClose(e);
                                }}
                            >
                                Cancel
              </button>
                        </div>
                    </div>
                </AlgaehModalPopUp>
            </div>
        );
    }
}
