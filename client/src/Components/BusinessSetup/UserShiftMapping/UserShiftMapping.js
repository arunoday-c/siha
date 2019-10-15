import React, { Component } from "react";
import "./user_shift_mapping.scss";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import Options from "../../../Options.json";

class UserShiftMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      cashiers_list: [],
      cashiers: [],
      year: moment(new Date()).format("YYYY"),
      month: moment(new Date()).format("M"),
      from_date: null,
      to_date: null
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
      module: "masterSettings",
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

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  getCashiers() {
    algaehApiCall({
      uri: "/shiftAndCounter/getCashiers",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            cashiers: response.data.records
          });
          // console.log("Cashiers:", response.data.records);
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
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            cashiers_list: response.data.records
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

  mapUserShift() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (this.state.from_date === null) {
          swalMessage({
            title: "From Date, is Mandatory",
            type: "warning"
          });
          return;
        } else if (this.state.to_date === null) {
          swalMessage({
            title: "To Date, is Mandatory",
            type: "warning"
          });
          return;
        }
        algaehApiCall({
          uri: "/shiftAndCounter/addCashierToShift",
          module: "masterSettings",
          method: "POST",
          data: {
            cashier_id: this.state.cashier_id,
            shift_id: this.state.hims_d_shift_id,
            from_date: this.state.from_date,
            to_date: this.state.to_date
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getMappedUsers();
            } else {
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
      }
    });
  }

  updateCashiersAndShiftMAP(data) {
    algaehApiCall({
      uri: "/shiftAndCounter/updateCashiersAndShiftMAP",
      module: "masterSettings",
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

  datehandle(ctrl, e) {
    this.setState({
      [e]: moment(ctrl)._d
    });
  }

  dateValidate(value, e) {
    let inRange = false;
    if (e.target.name === "from_date") {
      inRange = moment(value).isAfter(
        moment(this.state.to_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "From Date cannot be grater than To Date.",
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null
        });
      }

      inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
      if (inRange) {
        swalMessage({
          title: "From Date cannot be Past Date.",
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null
        });
      }
    } else if (e.target.name === "to_date") {
      inRange = moment(value).isBefore(
        moment(this.state.from_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null
        });
      }
      inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
      if (inRange) {
        swalMessage({
          title: "To Date cannot be Past Date.",
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null
        });
      }
    }
  }

  deleteCashiersAndShiftMAP(data) {
    swal({
      title: "Are you sure you want to delete this Shift?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shiftAndCounter/deleteCashiersAndShiftMAP",
          module: "masterSettings",
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
            } else {
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
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "shift_type",
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
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "select_cashier",
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

          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ forceLabel: "From Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "from_date" }}
            events={{
              onChange: this.datehandle.bind(this),
              onBlur: this.dateValidate.bind(this)
            }}
            value={this.state.from_date}
          />
          <AlgaehDateHandler
            div={{ className: "col-2 form-group mandatory" }}
            label={{ forceLabel: "To Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "to_date" }}
            events={{
              onChange: this.datehandle.bind(this),
              onBlur: this.dateValidate.bind(this)
            }}
            value={this.state.to_date}
          />

          {/*<AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "select_month"
              }}
              selector={{
                sort: "off",
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
                fieldName: "year",
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
            />*/}

          <div className="col">
            <button
              onClick={this.mapUserShift.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div data-validate="usmDiv" id="usmDivCntr">
                  <AlgaehDataGrid
                    datavalidate="data-validate='usmDiv'"
                    id="usm-grid"
                    columns={[
                      {
                        fieldName: "shift_description",

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Shift Type" }} />
                        ),
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

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Cashier" }} />
                        ),
                        editorTemplate: row => {
                          return <span>{row.cashier_name}</span>;
                        }
                      },
                      {
                        fieldName: "from_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "From Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{this.dateFormater(row.from_date)}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>{this.dateFormater(row.from_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "to_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Date" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{this.dateFormater(row.to_date)}</span>;
                        },
                        editorTemplate: row => {
                          return <span>{this.dateFormater(row.to_date)}</span>;
                        }
                      }
                    ]}
                    keyId="hims_m_cashier_shift_id"
                    dataSource={{
                      data: this.state.cashiers_list
                    }}
                    filter={true}
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
          </div>
        </div>
      </div>
    );
  }
}

export default UserShiftMapping;
