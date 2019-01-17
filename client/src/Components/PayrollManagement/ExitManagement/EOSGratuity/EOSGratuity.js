import React, { Component } from "react";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import "./EOSGratuity.css";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

class EOSGratuity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      eos: []
    };
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearState() {
    this.setState({
      employee_name: null,
      hims_d_employee_id: null
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: Employee
      },
      searchName: "exit_employees",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id
          },
          () => {}
        );
      }
    });
  }

  loadEmployeeDetails() {
    if (
      this.state.hims_d_employee_id === null ||
      this.state.hims_d_employee_id === undefined
    ) {
      swalMessage({
        title: "Please Select an Employee",
        type: "warning"
      });
    } else {
      this.setState({
        loading: true
      });

      algaehApiCall({
        uri: "/endofservice",
        method: "GET",
        module: "hrManagement",
        data: {
          hims_d_employee_id: this.state.hims_d_employee_id
        },
        onSuccess: res => {
          if (res.data.success) {
            this.setState({
              loading: false
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
          this.setState({
            loading: false
          });
        }
      });
    }
  }

  render() {
    return (
      <div className="EOSGratuityScreen">
        <div className="row  inner-top-search">
          {/* <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Search by EOS/Gratuity No.", isImp: false }}
            selector={{
              name: "hims_f_end_of_service_id",
              className: "select-fld",
              dataSource: {
                textField: "end_of_service_number",
                valueField: "hims_f_end_of_service_id",
                data: this.state.eos
              },
              onChange: this.dropDownHandler.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "End of Service Type", isImp: true }}
            selector={{
              name: "exit_type",
              value: this.state.exit_type,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.EXIT_TYPE
              },
              onChange: this.dropDownHandler.bind(this)
            }}
          /> */}

          <div className="col-lg-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                <h6>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "------"}
                </h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="col form-group">
            <button
              onClick={this.loadEmployeeDetails.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              {!this.state.loading ? (
                "Load"
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>

            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              CLEAR
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="col-12" style={{ marginTop: 7 }}>
                  <div className="row">
                    <div className="col-lg-8 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Employee Information
                      </label>
                      <div className="row">
                        <div className="col-3">
                          <label className="style_Label ">Employee Code</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Employee Name</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Date of Birth</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Gender</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Grade</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">Department</label>
                          <h6>-------</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Date of Joining
                          </label>
                          <h6>DD/MM/YYYY</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Date of Leaving
                          </label>
                          <h6>DD/MM/YYYY</h6>
                        </div>

                        <div className="col-3">
                          <label className="style_Label ">
                            Year of Service
                          </label>
                          <h6> 4 yrs</h6>
                        </div>
                        <div className="col-3">
                          <label className="style_Label ">Eligiable Days</label>
                          <h6> 4 yrs</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Components Included
                      </label>
                      <div className="row">
                        <div className="col">COMPONENETS INCLUDED</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Opening Gratuity Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "previous_gratuity_amount",
                      value: this.state.previous_gratuity_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Computed Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "calculated_gratutity_amount",
                      value: this.state.calculated_gratutity_amount,
                      events: {},
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Payable Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "payable_amount",
                      value: this.state.payable_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      others: {
                        type: "number"
                      }
                    }}
                  />
                  <div className="col">
                    <div className="customCheckbox" style={{ marginTop: 24 }}>
                      <label className="checkbox inline">
                        <input type="checkbox" value="" name="Forfeiture" />
                        <span>Forfeiture</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      value={this.state.remarks}
                      onChange={this.textHandler.bind(this)}
                      className="textArea"
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
                //   onClick={SaveDoctorCommission.bind(this, this)}
                //disabled={this.state.saveEnable}
              >
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>

              <button
                type="button"
                className="btn btn-default"
                //onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>

              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Delete"
                    //   returnText: true
                  }}
                />
              </button>
              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{
                    forceLabel: "Print"
                    //   returnText: true
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EOSGratuity;
