import React, { Component } from "react";
import "./holiday_master.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import swal from "sweetalert2";
import { MainContext } from "algaeh-react-components/context";

export default class HolidayMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holiday_type: false,
      holidays: [],
      weekoffs: [],
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      disableButton: false,
      year: moment().format("YYYY"),
      hospital_id: null
    };
  }
  static contextType = MainContext;

  componentDidMount() {
    const { userToken } = this.context;
    this.getReligionsMaster();
    this.getHospitals();
    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id
      },
      () => {
        this.getHolidayMaster(this.state.hospital_id);
      }
    );
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records
          });
        }
      }
    });
  }
  getReligionsMaster() {
    algaehApiCall({
      uri: "/masters/get/relegion",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            religions: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  hospitalHandler(value) {
    this.setState(
      {
        [value.name]: value.value
      },
      () => this.getHolidayMaster(value.value)
    );
  }

  clearWeekoffState(cb) {
    this.setState(
      {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      cb
    );
  }

  clearHolidayState() {
    this.setState({
      date: null,
      holiday_type: false,
      religion_id: null,
      holiday_description: null
    });
  }

  deleteHoliday(data) {
    swal({
      title:
        "Are you sure you want to delete holiday for" +
        data.holiday_date +
        " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          // uri: "/holiday/deleteHoliday",
          uri: "/payrollsettings/deleteHoliday",
          module: "hrManagement",
          method: "DELETE",
          data: {
            hims_d_holiday_id: data.hims_d_holiday_id
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Deleted Successfully",
                type: "success"
              });
              this.getHolidayMaster(this.state.hospital_id);
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

  getHolidayMaster(id) {
    algaehApiCall({
      uri: "/payrollsettings/getAllHolidays",
      module: "hrManagement",
      method: "GET",
      data: {
        hospital_id: id,
        year: this.state.year
      },
      onSuccess: res => {
        if (res.data.success) {
          const { weekoffs, days } = res.data.records;
          const holidays = weekoffs.filter(day => day.weekoff === "N");
          const weekoffList = weekoffs.filter(day => day.weekoff === "Y");
          const reqdays = days.map(item => item.day.toLowerCase());
          this.setState(
            {
              holidays,
              weekoffs: weekoffList,
              hospital_id: weekoffs.length !== 0 ? weekoffs[0].hospital_id : id
            },
            () => {
              if (reqdays.length) {
                this.clearWeekoffState(() => {
                  reqdays.forEach(day =>
                    this.setState({
                      [day]: true,
                      disableButton: true
                    })
                  );
                });
              } else {
                this.setState(
                  {
                    disableButton: false
                  },
                  () => this.clearWeekoffState()
                );
              }
            }
          );
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

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeYear(e) {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value < moment().year() ? moment().format("YYYY") : value
      },
      () => this.getHolidayMaster(this.state.hospital_id)
    );
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addHoliday() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='holDiv'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/payrollsettings/addHoliday",
          module: "hrManagement",
          method: "POST",
          data: {
            hospital_id: this.state.hospital_id,
            holiday_date: this.state.date,
            holiday_type: this.state.holiday_type ? "RS" : "RE",
            religion_id: this.state.religion_id,
            holiday_description: this.state.holiday_description
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearHolidayState();
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.getHolidayMaster(this.state.hospital_id);
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.result.message,
                type: "warning"
              });
            }
          },
          onFailure: err => {}
        });
      }
    });
  }

  addWeekoffs() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='weekoff-div'",
      onSuccess: () => {
        algaehApiCall({
          // uri: "/holiday/addWeekOffs",
          uri: "/payrollsettings/addWeekOffs",
          module: "hrManagement",
          method: "POST",
          data: {
            year: this.state.year,
            hospital_id: this.state.hospital_id,
            sunday: this.state.sunday ? "Y" : "N",
            monday: this.state.monday ? "Y" : "N",
            tuesday: this.state.tuesday ? "Y" : "N",
            wednesday: this.state.wednesday ? "Y" : "N",
            thursday: this.state.thursday ? "Y" : "N",
            friday: this.state.friday ? "Y" : "N",
            saturday: this.state.saturday ? "Y" : "N"
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearWeekoffState();
              swalMessage({
                title: "Records added successfully",
                type: "success"
              });
              this.getHolidayMaster(this.state.hospital_id);
            } else if (!res.data.success) {
              swalMessage({
                title: res.data.result.message,
                type: "warning"
              });
            }
          },
          onFailure: err => {}
        });
      }
    });
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
                    <div data-validate="weekoff-div">
                      <div className=" slctYearBranchSec">
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col mandatory" }}
                            label={{
                              forceLabel: "Year",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "year",
                              value: this.state.year,
                              events: {
                                onChange: this.changeYear.bind(this)
                              },
                              others: {
                                type: "number",
                                min: moment().year()
                              }
                            }}
                          />

                          <AlagehAutoComplete
                            div={{ className: "col mandatory" }}
                            label={{
                              forceLabel: "Filter by Branch",
                              isImp: true
                            }}
                            selector={{
                              name: "hospital_id",
                              className: "select-fld",
                              value: this.state.hospital_id,
                              dataSource: {
                                textField: "hospital_name",
                                valueField: "hims_d_hospital_id",
                                data: this.state.hospitals
                              },
                              onChange: this.hospitalHandler.bind(this),
                              onClear: () =>
                                this.setState({
                                  hospital_id: null,
                                  disableButton: true
                                })
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
                            <div className="customCheckbox">
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="sunday"
                                  checked={this.state.sunday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Sunday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="monday"
                                  checked={this.state.monday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Monday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="tuesday"
                                  checked={this.state.tuesday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Tuesday</span>
                              </label>

                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="wednesday"
                                  checked={this.state.wednesday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Wednesday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="thursday"
                                  checked={this.state.thursday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Thursday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="friday"
                                  checked={this.state.friday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Friday</span>
                              </label>
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  disabled={this.state.disableButton}
                                  name="saturday"
                                  checked={this.state.saturday}
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Saturday</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <button
                              onClick={this.addWeekoffs.bind(this)}
                              className="btn btn-primary"
                              disabled={this.state.disableButton}
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
                    </div>

                    <div className="holDiv">
                      <div
                        className="col-12 algaehLabelFormGroup"
                        style={{ marginBottom: 0, paddingBottom: 10 }}
                      >
                        <label className="algaehLabelGroup">
                          Other Holidays
                        </label>
                        <div className="row">
                          <AlgaehDateHandler
                            div={{ className: "col-12" }}
                            label={{
                              forceLabel: "Select a Date",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "date"
                            }}
                            events={{
                              onChange: selectedDate => {
                                this.setState({
                                  date: selectedDate
                                });
                              }
                            }}
                            value={this.state.date}
                          />

                          <div className="col-6 restrictedCntr margin-top-15 margin-bottom-15">
                            <label>Restricted Holiday</label>
                            <div className="customCheckbox">
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  checked={this.state.holiday_type}
                                  name="holiday_type"
                                  onChange={this.changeChecks.bind(this)}
                                />
                                <span>Yes</span>
                              </label>
                            </div>
                          </div>
                          <AlagehAutoComplete
                            div={{
                              className:
                                "col-6 ApplicableSelect  margin-top-15 margin-bottom-15"
                            }}
                            label={{
                              forceLabel: "Applicable for",
                              isImp: this.state.holiday_type
                            }}
                            selector={{
                              name: "religion_id",
                              className: "select-fld",
                              value: this.state.religion_id,
                              dataSource: {
                                textField: "religion_name",
                                valueField: "hims_d_religion_id",
                                data: this.state.religions
                              },
                              onChange: this.dropDownHandler.bind(this),
                              others: {
                                disabled: !this.state.holiday_type
                              }
                            }}
                          />
                          <AlagehFormGroup
                            div={{ className: "col-12" }}
                            label={{
                              forceLabel: "Holiday Description",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "holiday_description",
                              value: this.state.holiday_description,
                              events: {
                                onChange: this.changeTexts.bind(this)
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
                              onClick={this.addHoliday.bind(this)}
                              className="btn btn-primary"
                            >
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
          </div>

          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Holiday List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="HolidayListGrid" id="HolidayListGrid_Cntr">
                  <AlgaehDataGrid
                    id="HolidayListGrid"
                    data-validate="HolidayListGrid"
                    columns={[
                      // {
                      //   fieldName: "actions",
                      //   label: (
                      //     <AlgaehLabel label={{ forceLabel: "Actions" }} />
                      //   ),
                      //   displayTemplate: row => {
                      //     return (
                      //       <i
                      //         onClick={this.deleteHoliday.bind(this, row)}
                      //         className="fas fa-trash-alt"
                      //       />
                      //     );
                      //   },
                      //   others: {
                      //     maxWidth: 65,
                      //     resizable: false,
                      //     filterable: false,
                      //     style: { textAlign: "center" }
                      //   }
                      // },
                      {
                        fieldName: "holiday_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.holiday_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "holiday_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Holyday Description" }}
                          />
                        )
                      },
                      // {
                      //   fieldName: "holiday",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Holiday / Week Off" }}
                      //     />
                      //   ),
                      //   displayTemplate: row => {
                      //     return (
                      //       <span>
                      //         {row.holiday === "Y"
                      //           ? "Holiday"
                      //           : row.weekoff === "Y"
                      //           ? "Week Off"
                      //           : "------"}
                      //       </span>
                      //     );
                      //   }
                      // },
                      {
                        fieldName: "holiday_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Type" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.holiday_type === "RE"
                                ? "Regular"
                                : row.holiday_type === "RS"
                                ? "Restricted"
                                : "------"}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "religion_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Applicable For" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.religion_name !== null
                                ? row.religion_name
                                : "ALL"}
                            </span>
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_holiday_id"
                    dataSource={{
                      data: this.state.holidays
                    }}
                    isEditable={false}
                    filter={true}
                    filterable
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="HolidayListGrid" id="HolidayListGrid_Cntr">
                  <AlgaehDataGrid
                    id="HolidayListGrid"
                    data-validate="HolidayListGrid"
                    columns={[
                      {
                        fieldName: "holiday_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.holiday_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "holiday_description",
                        label: <AlgaehLabel label={{ forceLabel: "Day" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.holiday_date).format("dddd")}
                            </span>
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_holiday_id"
                    dataSource={{
                      data: this.state.weekoffs
                    }}
                    isEditable={false}
                    filter={true}
                    filterable
                    paging={{ page: 0, rowsPerPage: 10 }}
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
