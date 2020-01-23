import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import extend from "extend";

const onEditHandler = ($this, row) => {
    let edit_data = extend({}, row);
    edit_data.on_edit = true;
    edit_data.specific_nationality =
        row.specific_nationality === "Y" ? true : false;
    edit_data.allow_round_off = row.allow_round_off === "Y" ? true : false;
    edit_data.overtime_applicable =
        row.overtime_applicable === "Y" ? true : false;
    edit_data.shortage_deduction_applicable =
        row.shortage_deduction_applicable === "Y" ? true : false;
    edit_data.limit_applicable = row.limit_applicable === "Y" ? true : false;
    edit_data.process_limit_required =
        row.process_limit_required === "Y" ? true : false;
    edit_data.miscellaneous_component =
        row.miscellaneous_component === "Y" ? true : false;
    edit_data.annual_salary_comp =
        row.annual_salary_comp === "Y" ? true : false;


    edit_data.selected_account = row.child_id !== null ? row.head_id + "-" + row.child_id : null;
    edit_data.selected_li_account = row.li_child_id !== null ? row.li_head_id + "-" + row.li_child_id : null;
    $this.setState({
        ...$this.state,
        ...edit_data
    });
}

const dropDownHandler = ($this, value) => {
    $this.setState({
        [value.name]: value.value
    });
}

const changeTexts = ($this, e) => {
    $this.setState({
        [e.target.name]: e.target.value
    });
}

const SpecificChecks = ($this, e) => {
    $this.setState({
        specific_nationality: !$this.state.specific_nationality
    });
}



const changeChecks = ($this, e) => {
    switch (e.target.name) {
        case "shortage_deduction_applicable":
            $this.setState({
                shortage_deduction_applicable: !$this.state
                    .shortage_deduction_applicable
            });
            break;
        case "miscellaneous_component":
            $this.setState({
                miscellaneous_component: !$this.state.miscellaneous_component
            });
            break;

        case "limit_applicable":
            $this.setState({
                limit_applicable: !$this.state.limit_applicable
            });
            break;

        case "process_limit_required":
            $this.setState({
                process_limit_required: !$this.state.process_limit_required
            });
            break;

        case "calculation_type":
            $this.setState({
                calculation_type: e.target.value
            });
            break;

        case "calculation_method":
            $this.setState({
                calculation_method: e.target.value
            });
            break;

        case "overtime_applicable":
            $this.setState({
                overtime_applicable: !$this.state.overtime_applicable
            });
            break;

        case "allow_round_off":
            $this.setState(
                {
                    allow_round_off: !$this.state.allow_round_off
                },
                () => {
                    $this.setState({
                        round_off_type: $this.state.allow_round_off
                            ? $this.state.round_off_type
                            : null,
                        round_off_amount: $this.state.allow_round_off
                            ? $this.state.round_off_amount
                            : null
                    });
                }
            );
            break;
        case "print_report":
            $this.setState({
                print_report: e.target.value
            });
            break;
        case "annual_salary_comp":
            $this.setState({
                annual_salary_comp: !$this.state.annual_salary_comp
            });
            break;
        default:
            break;
    }
}

const changeGridEditors = ($this, row, e) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
}

const OpenCalculator = ($this, e) => {
    $this.setState({
        selectCalculate: "d-block"
    });
}

const CLoseCalculator = ($this, e) => {
    $this.setState({
        selectCalculate: "d-none"
    });
}
const onChangeCalculatorInput = ($this, e) => {
    $this.selected_collections.push(e.target.value);
    $this.setState({
        calculator_values: $this.state.calculator_values + "" + e.target.value
    });
}
const onClearCalculatorHandler = ($this, e) => {
    $this.setState({
        calculator_values: ""
    });
}
const onBackspaceHandler = ($this, e) => {
    let calLength = $this.selected_collections.length;
    if (calLength === 0) {
        return;
    }
    let lastCharacter = $this.selected_collections[calLength - 1];
    $this.selected_collections.pop();
    let calValues = $this.state.calculator_values.replace(lastCharacter, "");
    $this.setState({
        calculator_values: calValues
    });
}

const onApplayFormulaHandler = ($this, e) => {
    $this.setState({
        formula: $this.state.calculator_values,
        selectCalculate: "d-none"
    });
}

const clearState = ($this) => {
    $this.setState({
        miscellaneous_component: false,
        earning_deduction_code: null,
        earning_deduction_description: null,
        short_desc: null,
        component_category: null,
        calculation_method: "FI",
        component_frequency: null,
        calculation_type: "F",
        component_type: null,
        shortage_deduction_applicable: false,
        overtime_applicable: false,
        limit_applicable: false,
        limit_amount: null,
        process_limit_required: false,
        process_limit_days: null,
        general_ledger: null,
        allow_round_off: false,
        round_off_type: null,
        round_off_amount: null,
        formula: null,
        specific_nationality: false,
        nationality_id: null,
        hims_d_earning_deduction_id: null,
        annual_salary_comp: false,
        on_edit: false,
        child_id: null,
        head_id: null,
        li_child_id: null,
        li_head_id: null,
        selected_account: null,
        selected_li_account: null
    });
}


const getEarningDeductions = ($this) => {
    algaehApiCall({
        uri: "/payrollsettings/getEarningDeduction",
        module: "hrManagement",
        method: "GET",
        onSuccess: res => {
            if (res.data.success) {
                $this.setState({
                    earning_deductions: res.data.records
                });
            }
        }
    });
}

const getFinanceHeaders = ($this) => {
    algaehApiCall({
        uri: "/finance/getAccountHeadsForDropdown",
        data: { finance_account_head_id: 5 },
        method: "GET",
        module: "finance",
        onSuccess: response => {
            if (response.data.success === true) {
                $this.setState({
                    finance_account: response.data.result
                });
            }
        }
    });

    algaehApiCall({
        uri: "/finance/getAccountHeadsForDropdown",
        data: { finance_account_head_id: 2 },
        method: "GET",
        module: "finance",
        onSuccess: response => {
            if (response.data.success === true) {
                $this.setState({
                    laibility_finance_account: response.data.result
                });
            }
        }
    });
}


const addEarningsDeductions = ($this) => {
    AlgaehValidation({
        alertTypeIcon: "warning",
        pageState: $this,
        onSuccess: () => {

            if ($this.FIN_Active) {
                if ($this.state.selected_account === null || $this.state.selected_account === undefined) {
                    swalMessage({
                        title: "Please Select G/L Account",
                        type: "warning"
                    });
                    return
                }

                if ($this.state.component_category === "C" &&
                    ($this.state.selected_li_account === null || $this.state.selected_li_account === undefined)) {
                    swalMessage({
                        title: "Please Select G/L Account",
                        type: "warning"
                    });
                    return
                }
            }
            let gl_selected_account = $this.state.selected_account !== null ?
                $this.state.selected_account.split("-") : []

            let li_selected_account = $this.state.selected_li_account !== null ?
                $this.state.selected_li_account.split("-") : []
            let inputObj = {
                miscellaneous_component: $this.state.miscellaneous_component
                    ? "Y"
                    : "N",
                earning_deduction_code: $this.state.earning_deduction_code,
                earning_deduction_description:
                    $this.state.earning_deduction_description,
                short_desc: $this.state.short_desc,
                component_category: $this.state.component_category,
                calculation_method: $this.state.calculation_method,
                component_frequency: $this.state.component_frequency,
                calculation_type: $this.state.calculation_type,
                component_type: $this.state.component_type,
                shortage_deduction_applicable:
                    $this.state.shortage_deduction_applicable === true ? "Y" : "N",
                overtime_applicable:
                    $this.state.overtime_applicable === true ? "Y" : "N",
                limit_applicable:
                    $this.state.limit_applicable === true ? "Y" : "N",
                limit_amount: $this.state.limit_amount,
                process_limit_required:
                    $this.state.process_limit_required === true ? "Y" : "N",
                process_limit_days: $this.state.process_limit_days,
                general_ledger: $this.state.general_ledger,
                allow_round_off: $this.state.allow_round_off === true ? "Y" : "N",
                round_off_type: $this.state.round_off_type,
                round_off_amount: $this.state.round_off_amount,
                formula: $this.state.formula,
                specific_nationality:
                    $this.state.specific_nationality === true ? "Y" : "N",
                nationality_id: $this.state.nationality_id,
                print_report: $this.state.print_report,
                print_order_by: $this.state.print_order_by,
                annual_salary_comp:
                    $this.state.annual_salary_comp === true ? "Y" : "N",
                child_id: gl_selected_account.length > 0 ? gl_selected_account[1] : undefined,
                head_id: gl_selected_account.length > 0 ? gl_selected_account[0] : undefined,
                li_child_id: li_selected_account.length > 0 ? li_selected_account[1] : undefined,
                li_head_id: li_selected_account.length > 0 ? li_selected_account[0] : undefined
            }



            if ($this.state.hims_d_earning_deduction_id === null) {
                algaehApiCall({
                    uri: "/payrollsettings/addEarningDeduction",
                    module: "hrManagement",
                    method: "POST",
                    data: inputObj,
                    onSuccess: res => {
                        if (res.data.success) {
                            clearState($this);
                            getEarningDeductions($this);
                            swalMessage({
                                title: "Record added successfully",
                                type: "success"
                            });
                        }
                    },
                    onFailure: err => { }
                });
            } else {
                inputObj.hims_d_earning_deduction_id = $this.state.hims_d_earning_deduction_id
                inputObj.record_status = "A"

                algaehApiCall({
                    uri: "/payrollsettings/updateEarningDeduction",
                    module: "hrManagement",
                    method: "PUT",
                    data: inputObj,
                    onSuccess: res => {
                        if (res.data.success) {
                            clearState($this);
                            getEarningDeductions($this);
                            swalMessage({
                                title: "Record Updated successfully",
                                type: "success"
                            });
                        }
                    },
                    onFailure: err => { }
                });
            }
        }
    });
}

export {
    onEditHandler,
    dropDownHandler,
    changeTexts,
    SpecificChecks,
    changeChecks,
    changeGridEditors,
    OpenCalculator,
    CLoseCalculator,
    onChangeCalculatorInput,
    onBackspaceHandler,
    onClearCalculatorHandler,
    onApplayFormulaHandler,
    clearState,
    getEarningDeductions,
    getFinanceHeaders,
    addEarningsDeductions
};


// updateEarningsDeductions(data) {
//     algaehApiCall({
//       // uri: "/employee/updateEarningDeduction",
//       uri: "/payrollsettings/updateEarningDeduction",
//       module: "hrManagement",
//       method: "PUT",
//       data: {
//         hims_d_earning_deduction_id: data.hims_d_earning_deduction_id,
//         earning_deduction_code: data.earning_deduction_code,
//         earning_deduction_description: data.earning_deduction_description,
//         short_desc: data.short_desc,
//         component_category: data.component_category,
//         calculation_method: data.calculation_method,
//         component_frequency: data.component_frequency,
//         calculation_type: data.calculation_type,
//         component_type: data.component_type,
//         shortage_deduction_applicable: data.shortage_deduction_applicable,
//         overtime_applicable: data.overtime_applicable,
//         limit_applicable: data.limit_applicable,
//         limit_amount: data.limit_amount,
//         process_limit_required: data.process_limit_required,
//         process_limit_days: data.process_limit_days,
//         general_ledger: data.general_ledger,
//         allow_round_off: data.allow_round_off,
//         round_off_type: data.round_off_type,
//         round_off_amount: data.round_off_amount,
//         specific_nationality: data.specific_nationality,
//         nationality_id: data.nationality_id,
//         print_report: data.print_report,
//         print_order_by: data.print_order_by,
//         record_status: "A"
//       },
//       onSuccess: response => {
//         if (response.data.success) {
//           swalMessage({
//             title: "Record updated successfully",
//             type: "success"
//           });
//           this.getEarningDeductions();
//         }
//       },
//       onFailure: error => {
//         swalMessage({
//           title: error.message,
//           type: "error"
//         });
//       }
//     });
//   }

//   deleteEarningsDeductions(data) {
//     swal({
//       title: "Are you sure you want to delete " + data.short_desc + " ?",
//       type: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       confirmButtonColor: "#44b8bd",
//       cancelButtonColor: "#d33",
//       cancelButtonText: "No"
//     }).then(willDelete => {
//       if (willDelete.value) {
//         algaehApiCall({
//           uri: "/payrollsettings/updateEarningDeduction",
//           module: "hrManagement",
//           method: "PUT",
//           data: {
//             hims_d_earning_deduction_id: data.hims_d_earning_deduction_id,
//             earning_deduction_code: data.earning_deduction_code,
//             earning_deduction_description: data.earning_deduction_description,
//             short_desc: data.short_desc,
//             component_category: data.component_category,
//             calculation_method: data.calculation_method,
//             component_frequency: data.component_frequency,
//             calculation_type: data.calculation_type,
//             component_type: data.component_type,
//             shortage_deduction_applicable: data.shortage_deduction_applicable,
//             overtime_applicable: data.overtime_applicable,
//             limit_applicable: data.limit_applicable,
//             limit_amount: data.limit_amount,
//             process_limit_required: data.process_limit_required,
//             process_limit_days: data.process_limit_days,
//             general_ledger: data.general_ledger,
//             allow_round_off: data.allow_round_off,
//             round_off_type: data.round_off_type,
//             round_off_amount: data.round_off_amount,
//             record_status: "I"
//           },
//           method: "PUT",
//           onSuccess: response => {
//             if (response.data.success) {
//               swalMessage({
//                 title: "Record deleted successfully . .",
//                 type: "success"
//               });

//               this.getEarningDeductions();
//             } else if (!response.data.success) {
//               swalMessage({
//                 title: response.data.message,
//                 type: "error"
//               });
//             }
//           },
//           onFailure: error => {
//             swalMessage({
//               title: error.message,
//               type: "error"
//             });
//           }
//         });
//       }
//     });
//   }