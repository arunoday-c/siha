import React, { Component } from "react";
import "./EndServiceOption.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { GRATUITY_PROVISION } from "../../../../utils/GlobalVariables";
import swal from "sweetalert2";

export default class EndServiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earnings: [],
      deductions: [],
      deduction_ids: [],
      componentArray: [],
      earning_comp: [],
      t_earning_comp: [],
      service_days: [],
      comps: {},
      service_range: 0
    };
    this.getEosOptions();
    this.getEarningDeducts();
  }

  addServiceRange() {
    AlgaehValidation({
      querySelector: "data-validate='addServRng'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let arr = this.state.service_days;

        arr.push({
          service_range: this.state.service_range,
          from_service_range: this.state.from_service_range,
          eligible_days: this.state.eligible_days
        });

        this.setState({
          service_days: arr,
          service_range: this.state.from_service_range,
          from_service_range: null,
          eligible_days: null
        });
      }
    });
  }

  deleteResignComponents(row) {
    swal({
      title: "Delete Components",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.earning_comp.pop(row);
        this.setState({
          earning_comp: this.state.earning_comp
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  deleteServiceDays(row) {
    swal({
      title: "Delete Service Days",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        this.state.service_days.pop(row);
        //service_range : this.state.service_days
        this.setState(
          {
            service_days: this.state.service_days
          },
          () => {
            this.setState({
              service_range:
                Enumerable.from(this.state.service_days).lastOrDefault() !==
                undefined
                  ? Enumerable.from(this.state.service_days).lastOrDefault()
                      .from_service_range
                  : 0
            });
          }
        );
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  addEarningComponent() {
    let $this = this;
    AlgaehValidation({
      querySelector: "data-validate='addErndv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        if ($this.state.earning_comp.length > 4) {
          swalMessage({
            title: "Cannot Add More than 4 Components",
            type: "success"
          });
        } else {
          let x = Enumerable.from($this.state.earning_comp)
            .where(
              w =>
                w.hims_d_earning_deduction_id ===
                $this.state.comps.hims_d_earning_deduction_id
            )
            .firstOrDefault();

          if (x === undefined) {
            let earn_cmp = $this.state.earning_comp;
            earn_cmp.push($this.state.comps);

            $this.setState({
              earning_id: null,
              earning_comp: earn_cmp
            });
          } else {
            swalMessage({
              title: "Already Exist in the list",
              type: "warning"
            });
          }
        }
      }
    });
  }

  addTerminationComps() {
    AlgaehValidation({
      querySelector: "data-validate='addTermndv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (this.state.t_earning_comp.length > 4) {
          swalMessage({
            title: "Cannot Add More than 4 Components",
            type: "success"
          });
        } else {
          let x = Enumerable.from(this.state.t_earning_comp)
            .where(
              w =>
                w.hims_d_earning_deduction_id ===
                this.state.Tcomps.hims_d_earning_deduction_id
            )
            .firstOrDefault();

          if (x === undefined) {
            let earn_cmp = this.state.t_earning_comp;
            earn_cmp.push(this.state.comps);

            this.setState({
              deduction_id: null,
              t_earning_comp: earn_cmp
            });
          } else {
            swalMessage({
              title: "Already Exist in the list",
              type: "warning"
            });
          }
        }
      }
    });
  }

  updateEosOptions() {
    // console.log("Comps", JSON.stringify(this.state.earning_comp));
    // console.log("Serv Days", JSON.stringify(this.state.service_days));

    algaehApiCall({
      uri: "/payrollOptions/updateEosOptions",
      method: "PUT",
      module: "hrManagement",
      data: {
        end_of_service_calculation: this.state.end_of_service_calculation,
        terminate_salary: this.state.terminate_salary,
        end_of_service_payment: this.state.end_of_service_payment,
        end_of_service_type: this.state.end_of_service_type,
        end_of_service_years: this.state.end_of_service_years,
        limited_years: this.state.limited_years,
        gratuity_in_final_settle: this.state.gratuity_in_final_settle,
        pending_salary_with_final: this.state.pending_salary_with_final,
        round_off_nearest_year: this.state.round_off_nearest_year,
        earning_comp: this.state.earning_comp,
        service_days: this.state.service_days,
        gratuity_provision: this.state.gratuity_provision
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Updated Successfully",
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

  getEarningDeducts() {
    algaehApiCall({
      uri: "/payrollSettings/getMiscEarningDeductions",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            earnings: Enumerable.from(res.data.records)
              .where(w => w.component_category === "E")
              .toArray(),
            deductions: Enumerable.from(res.data.records)
              .where(w => w.component_category === "D")
              .toArray()
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

  getEosOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getEosOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          if (res.data.result.invalid_input !== true) {
            this.setState({
              ...res.data.result,
              earning_comp: res.data.result.earning_comp
            });
          }
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

  textHandler(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({
      [name]: value
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "earning_id":
        this.setState({
          comps: value.selected,
          [value.name]: value.value
        });
        break;

      case "dedution_id":
        this.setState({
          Tcomps: value.selected,
          [value.name]: value.value
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="endServiceOption">
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-2">
                    <label>EOS Calculation Method</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="AN"
                          name="end_of_service_calculation"
                          checked={
                            this.state.end_of_service_calculation === "AN"
                          }
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Annual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FI"
                          name="end_of_service_calculation"
                          checked={
                            this.state.end_of_service_calculation === "FI"
                          }
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Fixed</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <label>Terminate Salary</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="ACT"
                          name="terminate_salary"
                          checked={this.state.terminate_salary === "ACT"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Actual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="FUL"
                          name="terminate_salary"
                          checked={this.state.terminate_salary === "FUL"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Full</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <label>End of Service Payment</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="EOS"
                          name="end_of_service_payment"
                          checked={this.state.end_of_service_payment === "EOS"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>End of Service</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="YEA"
                          name="end_of_service_payment"
                          checked={this.state.end_of_service_payment === "YEA"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Yearly</span>
                      </label>
                    </div>
                  </div>

                  <div className="col-2">
                    <label>End of Service Type</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="S"
                          name="end_of_service_type"
                          checked={this.state.end_of_service_type === "S"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Slab</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="H"
                          name="end_of_service_type"
                          checked={this.state.end_of_service_type === "H"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Hierarchical</span>
                      </label>
                    </div>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Earnings", isImp: true }}
                    selector={{
                      name: "gratuity_provision",
                      value: this.state.gratuity_provision,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GRATUITY_PROVISION
                      },
                      onChange: this.textHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          gratuity_provision: null
                        });
                      }
                    }}
                  />
                </div>
                <div className="row margin-top-15">
                  <div className="col-2">
                    <label>End of Service Years</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="ACT"
                          name="end_of_service_years"
                          checked={this.state.end_of_service_years === "ACT"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Actual</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="LIM"
                          name="end_of_service_years"
                          checked={this.state.end_of_service_years === "LIM"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Limit</span>
                      </label>
                    </div>
                  </div>
                  {this.state.end_of_service_years === "LIM" ? (
                    <AlagehFormGroup
                      div={{ className: "col-2 form-group" }}
                      label={{
                        forceLabel: "Maximum Limit Years",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "limited_years",
                        value: this.state.limited_years,
                        events: {
                          onChange: this.textHandler.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />
                  ) : null}
                  <div className="col-2">
                    <label>Gratuity in Final Settlement</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "Y"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "N"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <label>Pay pending salaries with final</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="pending_salary_with_final"
                          checked={this.state.pending_salary_with_final === "Y"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="pending_salary_with_final"
                          checked={this.state.pending_salary_with_final === "N"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-2">
                    <label>Round off nearest year</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="round_off_nearest_year"
                          checked={this.state.round_off_nearest_year === "Y"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="round_off_nearest_year"
                          checked={this.state.round_off_nearest_year === "N"}
                          onChange={this.textHandler.bind(this)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Resignation Information</h3>
                </div>
                <div className="actions">
                  {/* <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a> */}
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <div className="row" data-validate="addServRng">
                          <AlagehFormGroup
                            div={{ className: "col-3 form-group mandatory" }}
                            label={{
                              forceLabel: "From Range",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "service_range",
                              value: this.state.service_range,
                              events: {
                                // onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number",
                                disabled: true
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "To Range",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_service_range",
                              value: this.state.from_service_range,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "Eligible Days",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "eligible_days",
                              value: this.state.eligible_days,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <div
                            className="col-3 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              onClick={this.addServiceRange.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationEligibility_Cntr">
                        <AlgaehDataGrid
                          id="ResignationEligibility"
                          datavalidate="ResignationEligibility"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Acion" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <i
                                    className="fas fa-trash-alt"
                                    onClick={this.deleteServiceDays.bind(
                                      this,
                                      row
                                    )}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "service_range",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "from_service_range",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "eligible_days",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Eligible Days" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: this.state.service_days }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <div className="row" data-validate="addErndv">
                          <AlagehAutoComplete
                            div={{ className: "col form-group" }}
                            label={{ forceLabel: "Earnings", isImp: true }}
                            selector={{
                              name: "earning_id",
                              value: this.state.earning_id,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: this.state.earnings
                              },
                              onChange: this.dropDownHandler.bind(this),
                              onClear: () => {
                                this.setState({
                                  earning_id: null
                                });
                              }
                            }}
                          />
                          <div
                            className="col-2 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              onClick={this.addEarningComponent.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="ResignationMinYear"
                          datavalidate="ResignationMinYear"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Acion" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <i
                                    className="fas fa-trash-alt"
                                    onClick={this.deleteResignComponents.bind(
                                      this,
                                      row
                                    )}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "earning_deduction_code",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings Code" }}
                                />
                              )
                            },
                            {
                              fieldName: "earning_deduction_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Earnings" }}
                                />
                              )
                            }
                          ]}
                          keyId="hims_d_earning_deduction_id"
                          dataSource={{ data: this.state.earning_comp }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12" style={{ marginBottom: 50 }}>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Termination Information</h3>
                </div>
                <div className="actions">
                  {/* <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a> */}
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <div className="row" data-validate="addTermndv">
                          <AlagehFormGroup
                            div={{ className: "col-3 form-group mandatory" }}
                            label={{
                              forceLabel: "From Range",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "service_range_t",
                              value: this.state.service_range_t,
                              events: {
                                // onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number",
                                disabled: true
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "To Range",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "from_service_range_t",
                              value: this.state.from_service_range_t,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-3 form-group" }}
                            label={{
                              forceLabel: "Eligible Days",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "eligible_days_t",
                              value: this.state.eligible_days_t,
                              events: {
                                onChange: this.textHandler.bind(this)
                              },
                              others: {
                                type: "number"
                              }
                            }}
                          />

                          <div
                            className="col-3 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              onClick={this.addTerminationComps.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationEligibility_Cntr">
                        <AlgaehDataGrid
                          id="ResignationEligibility"
                          datavalidate="ResignationEligibility"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Range" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Eligible Days" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <div className="row" data-validate="addErndv">
                          <AlagehAutoComplete
                            div={{ className: "col form-group" }}
                            label={{ forceLabel: "Deductions", isImp: true }}
                            selector={{
                              name: "deduction_id",
                              value: this.state.deduction_id,
                              multiselect: true,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: this.state.deductions
                              },
                              onChange: this.dropDownHandler.bind(this),
                              onClear: () => {
                                this.setState({
                                  earning_id: null
                                });
                              }
                            }}
                          />
                          <div
                            className="col-2 align-middle"
                            style={{ paddingTop: 21 }}
                          >
                            <button
                              onClick={this.addEarningComponent.bind(this)}
                              className="btn btn-primary"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" id="TerminationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="TerminationMinYear"
                          datavalidate="TerminationMinYear"
                          columns={[
                            {
                              fieldName: "earning_deduction_code",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Code" }} />
                              )
                            },
                            {
                              fieldName: "earning_deduction_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Description" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: this.state.t_earning_comp }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
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
                  onClick={this.updateEosOptions.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Update", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
