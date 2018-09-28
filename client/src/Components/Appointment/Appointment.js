import React, { Component } from "react";
import "./appointment.css";
import moment from "moment";
import { AlagehAutoComplete, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import Modal from "@material-ui/core/Modal";
import { algaehApiCall } from "../../utils/algaehApiCall";
import swal from "sweetalert";
import Enumerable from "linq";

class Appointment extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: new Date(),
      toDate: new Date(),
      showApt: false,
      departments: [],
      doctors: []
    };
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
          });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  onSelectedDateHandler(e) {
    this.setState({
      activeDateHeader: e.target.getAttribute("date"),
      fromDate: e.target.getAttribute("date"),
      toDate: e.target.getAttribute("date")
    });
  }
  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors }, () => {
        console.log("Docs", this.state.doctors);
      });
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  handleClose() {
    this.setState({
      showApt: false
    });
  }

  liGenerate() {
    let momDate = moment(this.state.selectedHDate);
    let initialDate = momDate._d;
    var date = initialDate,
      y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    let endDate = moment(lastDay)._d;

    let generatedLi = new Array();

    while (initialDate <= endDate) {
      let dt = moment(initialDate);
      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd")
      });
      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }

  generateHorizontalDateBlocks() {
    let classesCurrentDate = moment().format("YYYYMMDD");

    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    moment(row.currentdate).format("YYYYMMDD") ===
                    moment(this.state.activeDateHeader).format("YYYYMMDD")
                      ? moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
                        ? "col CurrentDate"
                        : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span>{row.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  showModal() {
    this.setState({
      showApt: true
    });
  }

  render() {
    return (
      <div className="appointment">
        {/* Pop up start */}
        <Modal open={this.state.showApt}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Book an Appointment</h4>
            </div>
            <div className="popupInner">
              <AlagehFormGroup
                div={{ className: "col-lg-12 margin-top-15" }}
                label={{
                  forceLabel: "Full Name",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "full_name",

                  //value: this.state.allergy_comment,
                  events: {
                    // onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-12 margin-top-15" }}
                label={{
                  forceLabel: "Mobile No.",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "mob_no",

                  // value: this.state.allergy_comment,
                  events: {
                    // onChange: this.texthandle.bind(this)
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-12 margin-top-15" }}
                label={{
                  forceLabel: "Visit Type"
                }}
                selector={{
                  name: "visit_type",
                  className: "select-fld",
                  //value: this.state.allergy_severity,
                  dataSource: {
                    textField: "name",
                    valueField: "value"
                    //data: GlobalVariables.PAIN_SEVERITY
                  }
                  //onChange: this.dropDownHandle.bind(this)
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-12 margin-top-15" }}
                label={{
                  forceLabel: "Visit Purpose.",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "allergy_comment",
                  others: {
                    multiline: true,
                    rows: "4"
                  },
                  value: this.state.allergy_comment,
                  events: {
                    // onChange: this.texthandle.bind(this)
                  }
                }}
              />
            </div>
            <div className="row popupFooter">
              <div className="col">
                <button
                  //onClick={this.addAllergyToPatient.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={this.handleClose.bind(this)}
                  type="button"
                  className="btn btn-other"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
        {/* Pop up end */}

        {/* Calendar Component Starts */}
        <div className="row">
          <div className="my-calendar col-lg-12">
            <div style={{ height: "34px" }}>
              <div className="myDay_date">
                <input
                  className="calender-date"
                  type="month"
                  onChange={this.monthChangeHandler.bind(this)}
                  value={moment(this.state.selectedHDate).format("YYYY-MM")}
                />
              </div>
            </div>
            {this.generateHorizontalDateBlocks()}
          </div>
        </div>
        {/* Calendar Component Ends */}

        <div className="col-lg-12 card box-shadow-normal margin-top-15">
          {/* Filter Bar Start */}
          <div className="row" style={{ padding: "10px" }}>
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
                  valueField: "sub_dept_id",
                  data: this.state.departments
                },
                onChange: this.deptDropDownHandler.bind(this)
              }}
              error={this.state.department_error}
              helperText={this.state.department_error_text}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Filter by Doctor"
              }}
              selector={{
                name: "provider_id",
                className: "select-fld",
                value: this.state.provider_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "provider_id",
                  data: this.state.doctors
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-1 form-group margin-top-15">
              <span
                style={{ cursor: "pointer" }}
                className="fas fa-search fa-2x"
              />
            </div>
          </div>
          {/* Filter Bar End */}
        </div>
        {/* Table Start */}
        <div className="col-lg-12 card box-shadow-normal">
          <table className="tg">
            <tr>
              <th className="tg-c3ow">Time</th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
              <th className="tg-amwm" colSpan="2">
                Dr. Norman John
              </th>
            </tr>
            <tr>
              <td className="tg-baqh" />
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
              <td className="tg-baqh">BOOKED</td>
              <td className="tg-baqh">STANDBY</td>
            </tr>
            <tr>
              <th className="tg-amwm">09:00 AM</th>
              <td className="tg-baqh">
                <span className="dynSlot">09:00 AM</span>
                <span className="dynPatient">John Doe</span>
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">09:15 AM</th>
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">09:30 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">09:45 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">10:00 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">10:15 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">10:30 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">10:45 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">11:00 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">11:15 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
            </tr>
            <tr>
              <th className="tg-amwm">11:30 AM</th>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
              <td className="tg-baqh">
                {" "}
                <i
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              </td>
              <td className="tg-baqh" />
            </tr>
          </table>
        </div>
        {/* Table End */}
      </div>
    );
  }
}

export default Appointment;
