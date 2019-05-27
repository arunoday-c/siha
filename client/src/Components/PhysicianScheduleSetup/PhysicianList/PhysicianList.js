import React, { Component } from "react";
import "./physician_list.css";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Enumerable from "linq";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import MyContext from "../../../utils/MyContext.js";
const provider_array = [];

class PhysicianList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      departments: [],
      doctors: [],
      scheduleList: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_department_id: null,
      department_error: false,
      department_error_text: "",
      description: ""
    };
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  checkHandle(e) {
    let myRow = e.currentTarget.getAttribute("row");

    if (provider_array.includes(myRow)) {
      provider_array.pop(myRow);
    } else {
      provider_array.push(myRow);
    }
  }
  handleClose() {
    this.setState({ openModal: false });
  }

  deptDropDownHandler(context, value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_department_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors });

      if (context !== null) {
        context.updateState({ doctors: dept.doctors });
      }
    });
  }

  textHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets,
            doctors: response.data.records.doctors
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.messag,
          type: "error"
        });
      }
    });
  }

  getApptSchedule(e) {
    e.preventDefault();
    if (this.state.sub_department_id === null) {
      this.setState({
        department_error: true,
        department_error_text: "Please Select a department"
      });
    } else {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/appointment/getAppointmentSchedule",
        method: "GET",
        data: {
          sub_dept_id: this.state.sub_department_id,
          month: this.state.month,
          year: this.state.year
        },
        onSuccess: response => {
          if (response.data.success) {
            AlgaehLoader({ show: false });

            this.setState({
              scheduleList: response.data.records,

              department_error_text: "",
              department_error: false
            });
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  render() {
    return (
      <div className="physician_list">
        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this)
          }}
          title="Cancel Working Hours"
          openPopup={this.state.openModal}
        >
          <div className="popupInner">
            <div className="col-lg-12 margin-top-15">
              <div className="col-lg-12 card">
                <div className="row ">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Selected Doctor",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_time",
                      value: this.state.from_time,
                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Selected From Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date"
                    }}
                    events={{
                      onChange: selectedDate => {
                        this.setState({ from_date: selectedDate });
                      }
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Selected To Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date"
                    }}
                    events={{
                      onChange: selectedDate => {
                        this.setState({ to_date: selectedDate });
                      }
                    }}
                    value={this.state.to_date}
                  />
                  <div className="col-lg-1 form-group margin-top-15">
                    <span className="fas fa-search fa-2x" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Appointment Date</h3>
              </div>
            </div>

            <div className="portlet-body">
              <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th scope="col" />
                    <th scope="col">Appointment Date</th>
                    <th scope="col">From Work Hour</th>
                    <th scope="col">To Work Hour</th>
                    <th scope="col">Working Break 1</th>
                    <th scope="col">Working Break 2</th>
                    <th scope="col">Working Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <input type="checkbox" />
                    </th>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="popupFooter">
            <button
              type="button"
              className="btn btn-primary"
              //onClick={this.handleClose}
            >
              Amend Timeslot
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={this.handleClose.bind(this)}
            >
              Close
            </button>
          </div>
        </AlgaehModalPopUp>
        {/* End of Modal */}

        <div className="col-lg-12">
          <MyContext.Consumer>
            {context => (
              <div className="row">
                <div className="col portlet portlet-bordered">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Physician List</h3>
                    </div>
                    <div className="actions">
                      <a
                        className="btn btn-primary btn-circle active"
                        //onClick={this.addAllergies}
                      >
                        <i className="fas fa-trash" />
                      </a>
                      <a
                        className="btn btn-primary btn-circle active"
                        onClick={() => {
                          this.setState({ openModal: true });
                        }}
                      >
                        <i className="fas fa-edit" />
                      </a>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="col-lg-12 card">
                      <div className="row ">
                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "department_name"
                          }}
                          selector={{
                            name: "sub_department_id",
                            className: "select-fld",
                            value: this.state.sub_department_id,
                            dataSource: {
                              textField: "sub_department_name",
                              valueField: "sub_department_id",
                              data: this.state.departments
                            },
                            onChange: this.deptDropDownHandler.bind(
                              this,
                              context
                            )
                          }}
                          error={this.state.department_error}
                          helperText={this.state.department_error_text}
                        />
                        {/* <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Selected From Date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_date"
                      }}
                      events={{
                        onChange: selectedDate => {
                          this.setState({ from_date: selectedDate });
                        }
                      }}
                      value={this.state.from_date}
                    />

                      <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Selected To Date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_date"
                      }}
                      events={{
                        onChange: selectedDate => {
                          this.setState({ to_date: selectedDate });
                        }
                      }}
                      value={this.state.to_date}
                    />
                  */}

                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Select Month"
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
                            onChange: this.dropDownHandler.bind(this)
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Year",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "year",
                            value: this.state.year,
                            events: {
                              onChange: this.textHandler.bind(this)
                            },
                            others: {
                              type: "number"
                            }
                          }}
                        />

                        <div className="col-lg-1 form-group margin-top-15">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={this.getApptSchedule.bind(this)}
                            className="fas fa-search fa-2x"
                          />
                        </div>
                      </div>
                    </div>

                    <table className="table table-striped table-bordered table-hover table-sm">
                      <thead>
                        <tr>
                          <th scope="col" />
                          <th scope="col">Physician Name</th>
                          <th scope="col">Selected Dates</th>
                          <th scope="col">Work Hours</th>
                          <th scope="col">Working Break 1</th>
                          <th scope="col">Working Break 2</th>
                          <th scope="col">Working Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.scheduleList.map((row, index) => (
                          <tr key={index}>
                            <th scope="row">
                              <input
                                type="checkbox"
                                id={row.provider_id}
                                row={JSON.stringify(row)}
                                onChange={this.checkHandle.bind(this)}
                              />
                            </th>
                            <td>{row.first_name + " " + row.last_name}</td>
                            <td>
                              {moment(row.from_date).format("DD-MM-YYYY") +
                                " to " +
                                moment(row.to_date).format("DD-MM-YYYY")}{" "}
                            </td>
                            <td>
                              {moment(row.from_work_hr, "HH:mm:ss").format(
                                "HH:mm a"
                              ) +
                                " to " +
                                moment(row.to_break_hr1, "HH:mm:ss").format(
                                  "HH:mm a"
                                )}{" "}
                            </td>
                            <td>
                              {row.from_break_hr2 !== null
                                ? row.from_break_hr2
                                : "---" + " to " + row.to_break_hr2 !== null
                                ? row.to_break_hr2
                                : "---"}
                            </td>
                            <td />
                            <td />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </MyContext.Consumer>
        </div>
      </div>
    );
  }
}

export default PhysicianList;
