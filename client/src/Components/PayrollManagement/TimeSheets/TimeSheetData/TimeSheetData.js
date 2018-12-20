import React, { Component } from "react";
import "./TimeSheetData.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";

class EarningsDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earning_deductions: []
    };

    this.getEarningDeductions();
  }

  clearState() {
    this.setState({
      earning_deduction_code: "",
      earning_deduction_description: "",
      short_desc: this.state.short_desc,
      component_category: "",
      calculation_method: "",
      component_frequency: "",
      calculation_type: "",
      component_type: "",
      shortage_deduction_applicable: "",
      overtime_applicable: "",
      limit_applicable: "",
      limit_amount: "",
      process_limit_required: "",
      process_limit_days: "",
      general_ledger: "",
      allow_round_off: "",
      round_off_type: "",
      round_off_amount: ""
    });
  }

  updateEarningsDeductions(data) {
    algaehApiCall({
      uri: "/employee/updateEarningDeduction",
      method: "PUT",
      data: {
        hims_d_earning_deduction_id: data.hims_d_earning_deduction_id,
        earning_deduction_code: data.earning_deduction_code,
        earning_deduction_description: data.earning_deduction_description,
        short_desc: data.short_desc,
        component_category: data.component_category,
        calculation_method: data.calculation_method,
        component_frequency: data.component_frequency,
        calculation_type: data.calculation_type,
        component_type: data.component_type,
        shortage_deduction_applicable: data.shortage_deduction_applicable,
        overtime_applicable: data.overtime_applicable,
        limit_applicable: data.limit_applicable,
        limit_amount: data.limit_amount,
        process_limit_required: data.process_limit_required,
        process_limit_days: data.process_limit_days,
        general_ledger: data.general_ledger,
        allow_round_off: data.allow_round_off,
        round_off_type: data.round_off_type,
        round_off_amount: data.round_off_amount
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getEarningDeductions();
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

  deleteEarningsDeductions(data) {
    swal({
      title: "Are you sure you want to delete " + data.short_desc + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/employee/deleteEarningDeduction",
          data: {
            hims_d_earning_deduction_id: data.hims_d_earning_deduction_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getEarningDeductions();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
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
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  addEarningsDeductions() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEarningDeduction",
          method: "POST",
          data: {
            earning_deduction_code: this.state.earning_deduction_code,
            earning_deduction_description: this.state
              .earning_deduction_description,
            short_desc: this.state.short_desc,
            component_category: this.state.component_category,
            calculation_method: this.state.calculation_method,
            component_frequency: this.state.component_frequency,
            calculation_type: this.state.calculation_type,
            component_type: this.state.component_type,
            shortage_deduction_applicable: this.state
              .shortage_deduction_applicable,
            overtime_applicable: this.state.overtime_applicable,
            limit_applicable: this.state.limit_applicable,
            limit_amount: this.state.limit_amount,
            process_limit_required: this.state.process_limit_required,
            process_limit_days: this.state.process_limit_days,
            general_ledger: this.state.general_ledger,
            allow_round_off: this.state.allow_round_off,
            round_off_type: this.state.round_off_type,
            round_off_amount: this.state.round_off_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  getEarningDeductions() {
    algaehApiCall({
      uri: "/employee/getEarningDeduction",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earning_deductions: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
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
      <div className="TimeSheetData">
        <div className="row inner-top-search">
          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "Select Month & Year", isImp: true }}
            textBox={{
              className: "txt-fld",
              name: "date_of_recall"
            }}
            minDate={new Date()}
            events={
              {
                // onChange: selectedDate => {
                //   this.setState({
                //     date_of_recall: selectedDate
                //   });
                // }
              }
            }
            value={this.state.date_of_recall}
          />
          <AlagehAutoComplete
            div={{ className: "col " }}
            label={{
              forceLabel: "Filter by Dept.",
              isImp: false
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.sub_department_id,
              dataSource: {
                textField: "sub_department_name",
                valueField: "sub_department_id",
                data: this.state.departments
              }
              // onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Filter by Branch",
              isImp: false
            }}
            selector={{
              name: "provider_id",
              className: "select-fld",
              value: this.state.provider_id,
              dataSource: {
                textField: "full_name",
                valueField: "employee_id",
                data: this.state.doctors
              }
              //onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Filter by Employee",
              isImp: false
            }}
            selector={{
              name: "provider_id",
              className: "select-fld",
              value: this.state.provider_id,
              dataSource: {
                textField: "full_name",
                valueField: "employee_id",
                data: this.state.doctors
              }
              //onChange: this.dropDownHandle.bind(this)
            }}
          />

          <div className="col form-group">
            <button
              // onClick={this.loadPatients.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Employee Time Sheet:{" "}
                <b style={{ color: "#33b8bc" }}>Dec 01 2018 - Dec 31 2018</b>
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div data-validate="erngsDdctnsGrid" id="TimeSheetGrid_Cntr">
              <AlgaehDataGrid
                id="erngs-ddctns-grid"
                datavalidate="data-validate='erngsDdctnsGrid'"
                columns={[
                  {
                    fieldName: "earning_deduction_code",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                    )
                    // others: {
                    //   filterable: true
                    // }
                  },
                  {
                    fieldName: "earning_deduction_description",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                    )
                  },
                  {
                    fieldName: "short_desc",
                    label: <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                  },
                  {
                    fieldName: "component_category",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "calculation_method",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "component_frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "calculation_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "component_type",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    )
                  }
                ]}
                keyId="hims_d_employee_group_id"
                dataSource={{
                  data: this.state.earning_deductions
                }}
                isEditable={false}
                filterable
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onEdit: () => {},
                  onDelete: this.deleteEarningsDeductions.bind(this),
                  onDone: this.updateEarningsDeductions.bind(this)
                }}
              />
            </div>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Selected Employee Leave Balance
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div data-validate="erngsDdctnsGrid" id="EmployeeLeaveBalance_Cntr">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "earning_deduction_code",
                    label: <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                  },
                  {
                    fieldName: "earning_deduction_description",
                    label: <AlgaehLabel label={{ forceLabel: "Description" }} />
                  },
                  {
                    fieldName: "short_desc",
                    label: <AlgaehLabel label={{ forceLabel: "Available" }} />
                  },
                  {
                    fieldName: "component_category",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "calculation_method",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "component_frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "calculation_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "component_type",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    )
                  }
                ]}
                keyId="hims_d_employee_group_id"
                dataSource={{
                  data: this.state.earning_deductions
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onEdit: () => {},
                  onDelete: this.deleteEarningsDeductions.bind(this),
                  onDone: this.updateEarningsDeductions.bind(this)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EarningsDeductions;
