import React, { Component } from "react";
import "./HolidayMgmntClndr.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import GlobalVariables from "../../../../utils/GlobalVariables.json";
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
      uri: "/payrollsettings/updateEarningDeduction",
      module: "hrManagement",
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
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/payrollsettings/deleteEarningDeduction",
          module: "hrManagement",
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
          uri: "/payrollsettings/addEarningDeduction",
          module: "hrManagement",
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
      uri: "/payrollsettings/getEarningDeduction",
      module: "hrManagement",
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
      <div className="HolidayMgmntClndr">
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Holiday</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12">
                  <div className="row">
                    <div className="col slctYearBranchSec">
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col mandatory" }}
                          label={{
                            forceLabel: "Select a Year",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "date_of_recall",
                            other: {
                              type: "year"
                            }
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
                          div={{ className: "col mandatory" }}
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
                      </div>
                    </div>
                    <hr />
                    <div
                      className="col-12 algaehLabelFormGroup"
                      style={{ marginBottom: 25 }}
                    >
                      <label className="algaehLabelGroup">Week off</label>
                      <div className="row">
                        <div className="col-12">
                          {/* <label>Calculation Method</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="fixed"
                                name="weekOffDays"
                                checked
                              />
                              <span>Sunday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Monday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Tuesday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Wednesday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Thursday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Friday</span>
                            </label>
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="formula"
                                name="weekOffDays"
                              />
                              <span>Saturday</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            // onClick={this.loadPatients.bind(this)}
                            className="btn btn-primary"
                            style={{
                              float: "right",
                              marginTop: 10,
                              marginBottom: 10
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12 algaehLabelFormGroup"
                      style={{ marginBottom: 0, paddingBottom: 10 }}
                    >
                      <label className="algaehLabelGroup">Other Holidays</label>
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col-12" }}
                          label={{
                            forceLabel: "Select a Date",
                            isImp: false
                          }}
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

                        <div className="col-6 restrictedCntr">
                          <label>Restricted Holiday</label>
                          <div className="customCheckbox">
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                value="Restricted"
                                name="restricted"
                              />
                              <span>Yes</span>
                            </label>
                          </div>{" "}
                        </div>
                        <AlagehAutoComplete
                          div={{ className: "col-6 ApplicableSelect" }}
                          label={{
                            forceLabel: "Applicable for",
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
                        <AlagehFormGroup
                          div={{ className: "col-12" }}
                          label={{
                            forceLabel: "Enter Reason",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                        <div className="col-12">
                          <button
                            style={{
                              float: "right",
                              marginTop: 10,
                              marginBottom: 10
                            }}
                            // onClick={this.loadPatients.bind(this)}
                            className="btn btn-primary"
                          >
                            {" "}
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col form-group">
            <button
              // onClick={this.loadPatients.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div> */}
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Holiday List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="erngsDdctnsGrid" id="HolidayListGrid_Cntr">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "HolidayDate",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Date" }} />
                        )
                        // others: {
                        //   filterable: true
                        // }
                      },
                      {
                        fieldName: "holiday_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Holyday Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "short_desc",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                        )
                      },
                      {
                        fieldName: "holiday_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Type" }} />
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
          </div>
        </div>
      </div>
    );
  }
}

export default EarningsDeductions;
