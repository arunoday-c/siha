import React, { Component } from "react";
import "./user_shift_mapping.css";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";

class UserShiftMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      year: moment(new Date()).format("YYYY"),
      month: moment(new Date()).format("M")
    };
    this.getShifts();
    this.getCashiers();
    this.getMappedUsers();
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  resetSaveState() {
    this.setState({
      hims_d_shift_id: "",
      cashier_id: ""
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      method: "GET",
      data: { shift_status: "A" },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            shifts: response.data.records
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

  getCashiers() {
    algaehApiCall({
      uri: "/shiftAndCounter/getCashiers",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            cashiers: response.data.records
          });
          //console.log("Cashiers:", response.data.records);
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

  getMappedUsers() {
    algaehApiCall({
      uri: "/shiftAndCounter/getCashiersAndShiftMAP",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            cashiers_list: response.data.records
          });
          //console.log("Cashiers:", response.data.records);
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

  mapUserShift() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/shiftAndCounter/addCashierToShift",
          method: "POST",
          data: {
            cashier_id: this.state.cashier_id,
            shift_id: this.state.hims_d_shift_id,
            year: this.state.year,
            month: this.state.month
          },
          onSuccess: response => {
            if (response.data.records) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getMappedUsers();
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

  updateCashiersAndShiftMAP(data) {
    algaehApiCall({
      uri: "/shiftAndCounter/updateCashiersAndShiftMAP",
      method: "PUT",
      data: {
        hims_m_cashier_shift_id: data.hims_m_cashier_shift_id,
        shift_id: data.shift_id
      },
      onSuccess: response => {
        if (response.data.records) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getMappedUsers();
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

  deleteCashiersAndShiftMAP(data) {
    swal({
      title: "Are you sure you want to delete this Shift?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shiftAndCounter/deleteCashiersAndShiftMAP",
          data: {
            hims_m_cashier_shift_id: data.hims_m_cashier_shift_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getMappedUsers();
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

  render() {
    return (
      <div className="user_shift_mapping">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Shift Type",
                isImp: true
              }}
              selector={{
                name: "hims_d_shift_id",
                className: "select-fld",
                value: this.state.hims_d_shift_id,
                dataSource: {
                  textField: "shift_description",
                  valueField: "hims_d_shift_id",
                  data: this.state.shifts
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select Cashier",
                isImp: true
              }}
              selector={{
                name: "cashier_id",
                className: "select-fld",
                value: this.state.cashier_id,
                dataSource: {
                  textField: "cashier_name",
                  valueField: "cashier_id",
                  data: this.state.cashiers
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select Month"
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number",
                  min: moment().year()
                }
              }}
            />

            <div className="col">
              <button
                onClick={this.mapUserShift.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div data-validate="usmDiv" id="usmDivCntr">
            <AlgaehDataGrid
              datavalidate="data-validate='usmDiv'"
              id="usm-grid"
              columns={[
                {
                  fieldName: "shift_description",
                  label: "Shift Type",
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "shift_id",
                          className: "select-fld",
                          value: row.shift_id,
                          dataSource: {
                            textField: "shift_description",
                            valueField: "hims_d_shift_id",
                            data: this.state.shifts
                          },
                          others: {
                            errormessage: "Shift - cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "cashier_name",
                  label: "Cashier",
                  editorTemplate: row => {
                    return <span>{row.cashier_name}</span>;
                  }
                },
                {
                  fieldName: "month",
                  label: "Month",
                  displayTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "month",
                          className: "select-fld",
                          value: row.month,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.MONTHS
                          },
                          others: {
                            disabled: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "month",
                          className: "select-fld",
                          value: row.month,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.MONTHS
                          },
                          others: {
                            errormessage: "Month - cannot be blank",
                            required: true,
                            disabled: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "year",
                  label: "Year",
                  editorTemplate: row => {
                    return <span>{row.year}</span>;
                  }
                }
              ]}
              keyId="hims_m_cashier_shift_id"
              dataSource={{
                data: this.state.cashiers_list
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteCashiersAndShiftMAP.bind(this),
                onDone: this.updateCashiersAndShiftMAP.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserShiftMapping;
