import React from "react";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import { getLabelFromLanguage } from "../../utils/GlobalFunctions";
import GlobalVariables from "../../utils/GlobalVariables";
import "./appointment.css";

function AppointmentComponent(props) {
  return (
    <div>
      <div className="appointment">
        {props.state.hasError ? (
          "OOPS Something went wrong , please refresh the page"
        ) : (
          <div id="appointment-module">
            {/* Edit Pop up Start */}
            <AlgaehModalPopUp
              class="appoPopupWidth"
              title={getLabelFromLanguage({
                fieldName: "editAppo"
              })}
              events={{
                onClose: props.handleClose
              }}
              openPopup={props.state.openPatEdit}
            >
              <div
                className="col-lg-12"
                //   style={{ width: "55vw" }}
                data-validate="editApptDiv"
              >
                {/* <div className="popupHeader">
                    <div className="row">
                      <div className="col-lg-8">
                        <h4>
                          {getLabelFromLanguage({
                            fieldName: "editAppo"
                          })}
                        </h4>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className=""
                          onClick={props.handleClose}
                        >
                          <i className="fas fa-times-circle" />
                        </button>
                      </div>
                    </div>
                  </div> */}
                {/* <div className="popupInner">
                    <div className="col-lg-12"> */}
                <div className="row">
                  <div className="col-lg-12 popRightDiv">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-4 form-group mandatory" }}
                        label={{
                          fieldName: "selectStatus",
                          isImp: true
                        }}
                        selector={{
                          name: "edit_appointment_status_id",
                          className: "select-fld",
                          value: props.state.edit_appointment_status_id,
                          dataSource: {
                            textField: "statusDesc",
                            valueField: "hims_d_appointment_status_id",
                            data: props.state.appointmentStatus
                          },
                          onChange: props.dropDownHandle
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-3 form-group mandatory" }}
                        label={{
                          fieldName: "appoDate",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_appt_date",
                          others: {
                            disabled: false
                          }
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: props.dateHandler
                        }}
                        value={props.state.edit_appt_date}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-3 form-group mandatory" }}
                        label={{
                          fieldName: "appoTime"
                          // isImp: true
                        }}
                        selector={{
                          name: "edit_appt_time",
                          className: "select-fld",
                          value: props.state.edit_appt_time,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: props.state.timeSlots
                          },
                          onChange: props.dropDownHandle,
                          sort: false
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2 form-group mandatory " }}
                        label={{
                          fieldName: "selectSlot",
                          isImp: true
                        }}
                        selector={{
                          name: "edit_no_of_slots",
                          className: "select-fld",
                          value: props.state.edit_no_of_slots,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NO_OF_SLOTS
                          },
                          others: {
                            checkvalidation: "$value >" + props.state.maxSlots,
                            errormessage:
                              "Maximum " +
                              props.state.maxSlots +
                              " slot(s) avilable "
                          },
                          onChange: props.dropDownHandle
                        }}
                      />
                    </div>

                    <div className="row">
                      <AlagehAutoComplete
                        div={{
                          className: "col-2 form-group"
                        }}
                        label={{
                          fieldName: "title_id",
                          isImp: true
                        }}
                        selector={{
                          name: "edit_title_id",
                          className: "select-fld",
                          value: props.state.edit_title_id,
                          dataSource: {
                            textField: "title",
                            valueField: "his_d_title_id",
                            data: props.state.titles
                          },
                          onChange: props.dropDownHandle,
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col-5 form-group"
                        }}
                        label={{
                          fieldName: "full_name",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_patient_name",
                          value: props.state.edit_patient_name,
                          events: {
                            onChange: props.texthandle
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{
                          className: "col-5 form-group arabic-txt-fld"
                        }}
                        label={{
                          fieldName: "arabic_name",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_arabic_name",
                          value: props.state.edit_arabic_name,
                          events: {
                            onChange: props.texthandle
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>

                    <div className="row">
                      <AlgaehDateHandler
                        div={{
                          className: "col-3 form-group"
                        }}
                        label={{
                          fieldName: "date_of_birth",
                          isImp: true
                        }}
                        maxDate={new Date()}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_date_of_birth",
                          others: {
                            disabled: true,
                            maxDate: new Date()
                          }
                        }}
                        events={{
                          onChange: props.ageHandler,
                          onBlur: props.validateAge
                        }}
                        value={props.state.edit_date_of_birth}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col-2 form-group"
                        }}
                        label={{
                          fieldName: "age",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_age",
                          others: {
                            type: "number",
                            disabled: true
                          },
                          value: props.state.edit_age,
                          events: {
                            onChange: props.texthandle
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{
                          className: "col-3 form-group"
                        }}
                        label={{
                          fieldName: "gender",
                          isImp: true
                        }}
                        selector={{
                          name: "edit_gender",
                          className: "select-fld",
                          value: props.state.edit_gender,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_GENDER
                          },
                          onChange: props.dropDownHandle,
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>

                    <div className="row">
                      <AlagehFormGroup
                        div={{
                          className: "col-6 form-group"
                        }}
                        label={{
                          fieldName: "contact_number",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_contact_number",
                          others: {
                            type: "number",
                            disabled: true
                          },
                          value: props.state.edit_contact_number,
                          events: {
                            onChange: props.texthandle
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col-6 form-group"
                        }}
                        label={{
                          fieldName: "email",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_email",
                          value: props.state.edit_email,
                          events: {
                            onChange: props.texthandle
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>

                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          fieldName: "remarks",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_appointment_remarks",
                          value: props.state.edit_appointment_remarks,
                          events: {
                            onChange: props.texthandle
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* </div>
                  </div>{" "} */}
                <div className="row popupFooter">
                  <div className="col-lg-12">
                    <button
                      onClick={() => props.updatePatientAppointment(null)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {getLabelFromLanguage({
                        fieldName: "btn_update"
                      })}
                    </button>
                    <button
                      onClick={props.handleClose}
                      type="button"
                      className="btn btn-other"
                    >
                      {getLabelFromLanguage({
                        fieldName: "btn_close"
                      })}
                    </button>
                  </div>
                </div>
              </div>
            </AlgaehModalPopUp>
            {/* Edit Pop up End */}

            {/* Add Pop up start */}
            <AlgaehModalPopUp
              class="appoPopupWidth"
              title={getLabelFromLanguage({
                fieldName: "bookAppo"
              })}
              events={{
                onClose: props.handleClose
              }}
              openPopup={props.state.showApt}
            >
              <div className="popupInner" data-validate="addApptDiv">
                <div className="col-12 popRightDiv">
                  <div className="row">
                    <div className="col form-group">
                      <AlgaehLabel
                        label={{
                          fieldName: "appoDate"
                        }}
                      />
                      <h6>
                        {moment(props.state.activeDateHeader).format(
                          "DD-MM-YYYY"
                        )}
                      </h6>
                    </div>

                    <div className="col form-group">
                      <AlgaehLabel
                        label={{
                          fieldName: "appoTime"
                        }}
                      />
                      <h6>{props.state.apptFromTime}</h6>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-4  form-group " }}
                      label={{
                        fieldName: "patient_code",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "patient_code",
                        others: {
                          disabled: true
                        },
                        value: props.state.patient_code,
                        events: {
                          // onChange: props.texthandle
                        }
                      }}
                    />

                    <div className="col-1  print_actions">
                      <span
                        className="fas fa-search globalSearchIconStyle"
                        onClick={props.patientSearch}
                      />
                    </div>

                    <AlagehAutoComplete
                      div={{
                        className: "col-3  form-group mandatory"
                      }}
                      label={{
                        fieldName: "selectSlot",
                        isImp: true
                      }}
                      selector={{
                        name: "no_of_slots",
                        className: "select-fld",
                        value: props.state.no_of_slots,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.NO_OF_SLOTS
                        },
                        onChange: props.dropDownHandle,
                        others: {
                          checkvalidation: "$value >" + props.state.maxSlots,
                          errormessage:
                            "Maximum " +
                            props.state.maxSlots +
                            " slot(s) avilable "
                        }
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlagehAutoComplete
                      div={{
                        className: "col-2  form-group mandatory"
                      }}
                      label={{
                        fieldName: "title_id",
                        isImp: true
                      }}
                      selector={{
                        name: "title_id",
                        className: "select-fld",
                        value: props.state.title_id,
                        dataSource: {
                          textField: "title",
                          valueField: "his_d_title_id",
                          data: props.state.titles
                        },
                        onChange: props.dropDownHandle,
                        onClear: props.dropDownHandle
                      }}
                    />

                    <AlagehFormGroup
                      div={{
                        className: "col-5  form-group mandatory"
                      }}
                      label={{
                        fieldName: "full_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "patient_name",
                        value: props.state.patient_name,
                        events: {
                          onChange: props.texthandle
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{
                        className: "col-5  form-group mandatory arabic-txt-fld"
                      }}
                      label={{
                        fieldName: "arabic_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_name",
                        value: props.state.arabic_name,
                        events: {
                          onChange: props.texthandle
                        }
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlgaehDateHandler
                      div={{
                        className: "col-3   form-group mandatory"
                      }}
                      label={{
                        fieldName: "date_of_birth",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_birth"
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: props.ageHandler,
                        onBlur: props.validateAge
                      }}
                      value={props.state.date_of_birth}
                    />

                    <AlagehFormGroup
                      div={{
                        className: "col-2  form-group mandatory"
                      }}
                      label={{
                        fieldName: "age",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "age",
                        number: {
                          allowNegative: false
                        },
                        others: {
                          type: "number",
                          onBlur: props.validateAge
                        },
                        value: props.state.age,
                        events: {
                          onChange: props.dobHandler
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{
                        className: "col-3  form-group mandatory"
                      }}
                      label={{
                        fieldName: "gender",
                        isImp: true
                      }}
                      selector={{
                        name: "gender",
                        className: "select-fld",
                        value: props.state.gender,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_GENDER
                        }
                        // onChange: props.dropDownHandle
                      }}
                    />

                    <AlagehAutoComplete
                      div={{
                        className:
                          "col-4 form-group mandatory AutoCompleteRight"
                      }}
                      label={{
                        fieldName: "selectStatus",
                        isImp: true
                      }}
                      selector={{
                        name: "appointment_status_id",
                        className: "select-fld",
                        value: props.state.appointment_status_id,
                        dataSource: {
                          textField: "statusDesc",
                          valueField: "hims_d_appointment_status_id",
                          data: props.state.appointmentStatus
                        }
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlagehFormGroup
                      div={{
                        className: "col-6 form-group mandatory"
                      }}
                      label={{
                        fieldName: "contact_number",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "contact_number",
                        others: {
                          type: "number"
                        },
                        value: props.state.contact_number
                        // events: {
                        //   //onChange: props.texthandle
                        // }
                      }}
                    />

                    <AlagehFormGroup
                      div={{
                        className: "col-6 form-group"
                      }}
                      label={{
                        fieldName: "email",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "email",
                        value: props.state.email
                        // events: {
                        //   //onChange: props.texthandle
                        // }
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlagehFormGroup
                      div={{
                        className: "col-12 form-group margin-bottom-15"
                      }}
                      label={{
                        fieldName: "remarks",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "appointment_remarks",
                        value: props.state.appointment_remarks
                        // events: {
                        //   // onChange: props.texthandle
                        // }
                      }}
                    />
                  </div>
                </div>
                {/* </div>
                  </div>{" "} */}
              </div>
              <div className="popupFooter">
                <div className="col-lg-12">
                  <button
                    onClick={props.addPatientAppointment}
                    type="button"
                    className="btn btn-primary"
                  >
                    {getLabelFromLanguage({
                      fieldName: "btn_save"
                    })}
                  </button>
                  <button
                    onClick={props.handleClose}
                    type="button"
                    className="btn btn-other"
                  >
                    {getLabelFromLanguage({
                      fieldName: "btn_close"
                    })}
                  </button>
                </div>
              </div>
            </AlgaehModalPopUp>
            {/* Add Pop up end */}

            {/* Calendar Component Starts */}
            <div className="row">
              <div className="my-calendar col-lg-12">
                <div style={{ height: "34px" }}>
                  <div className="myDay_date">
                    <input
                      type="month"
                      onChange={props.monthChangeHandler}
                      value={moment(props.state.selectedHDate).format(
                        "YYYY-MM"
                      )}
                    />
                    {/* <button
                        onClick={() => {
                          props.setState({
                            activeDateHeader: new Date()
                          });
                        }}
                        className="btn btn-default btn-sm  todayBtn"
                      >
                        {getLabelFromLanguage({
                          fieldName: "today"
                        })}
                      </button> */}
                  </div>
                </div>
                {props.generateHorizontalDateBlocks()}
              </div>
            </div>
            {/* Calendar Component Ends */}

            {/* Filter Bar Start */}
            {/* <form onSubmit={props.getAppointmentSchedule.bind(props)}> */}

            <div className="row inner-top-search">
              <AlagehAutoComplete
                div={{ className: "col-3  mandatory" }}
                label={{
                  fieldName: "department_name",
                  isImp: true
                }}
                selector={{
                  name: "sub_department_id",
                  className: "select-fld",
                  value: props.state.sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_dept_id",
                    data: props.state.departments
                  },
                  onChange: props.deptDropDownHandler,
                  onClear: () => props.nullifyState("sub_department_id"),
                  autoComplete: "off"
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-3 " }}
                label={{
                  fieldName: "filterbyDoctor"
                }}
                selector={{
                  name: "provider_id",
                  className: "select-fld",
                  value: props.state.provider_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "provider_id",
                    data: props.state.doctors
                  },
                  onChange: props.dropDownHandle,
                  onClear: () => props.nullifyState("provider_id"),
                  autoComplete: "off"
                }}
              />

              <div className="col-lg-1 form-group" style={{ marginTop: 19 }}>
                <button
                  id="load-appt-sch"
                  type="submit"
                  onClick={props.getAppointmentSchedule}
                  className="btn btn-primary"
                >
                  {getLabelFromLanguage({ fieldName: "loadData" })}
                </button>
              </div>
            </div>

            {/* Filter Bar End */}

            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{
                padding: 0,
                background: "none",
                boxShadow: "none",
                border: "none"
              }}
            >
              {/* Portlet Top Bar Start */}
              <div
                className="portlet-title"
                style={{ margin: "-10px -15px 0" }}
              >
                <div className="caption">
                  <h3 className="caption-subject">
                    {getLabelFromLanguage({
                      fieldName: "doctorsAvailability"
                    })}
                  </h3>
                </div>
                <div className="actions">
                  <ul className="ul-legend">
                    {props.state.appointmentStatus !== undefined
                      ? props.state.appointmentStatus.map((data, index) => (
                          <li key={index}>
                            <span
                              style={{
                                backgroundColor: data.color_code
                              }}
                            />
                            {data.statusDesc}
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
              {/* Portlet Top Bar End */}

              <div className="portlet-body">
                <div className="appointment-outer-cntr">
                  <div
                    className="appointment-inner-cntr"
                    style={{ width: props.state.width }}
                  >
                    {/* Table Start */}
                    {props.state.appointmentSchedule.length !== 0 ? (
                      props.state.appointmentSchedule.map((data, index) => (
                        <table key={index} className="tg">
                          <thead>
                            <tr>
                              {/* <th className="tg-c3ow">Time</th> */}
                              <th className="tg-amwm" colSpan="2">
                                <h6>{data.doctor_name}</h6>
                                <p>
                                  {/* <span>{data.sub_department_name}</span> */}
                                  {/* <span>{data.clinic_name}</span> */}
                                  <span>
                                    {getLabelFromLanguage({
                                      fieldName: "roomNo"
                                    })}
                                    : {data.room_name}
                                  </span>
                                </p>
                              </th>
                            </tr>
                            <tr>
                              {/* <td className="tg-baqh"><span class="dynSlot">09:00 AM</span><i onClick={props.showModal.bind(props)} className="fas fa-plus"/></td> */}
                              <th className="tbl-subHdg">
                                {getLabelFromLanguage({
                                  fieldName: "booked"
                                })}
                              </th>
                              <th className="tbl-subHdg">
                                {getLabelFromLanguage({
                                  fieldName: "standBy"
                                })}
                              </th>
                            </tr>
                          </thead>
                          {data.modified === "L" ? (
                            <tbody>
                              <tr>
                                <td>
                                  <span className="doctorLeaveCntr">
                                    {getLabelFromLanguage({
                                      fieldName: "doctorLeave"
                                    })}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          ) : (
                            <tbody>{props.generateTimeslots(data)}</tbody>
                          )}
                        </table>
                      ))
                    ) : (
                      <span className="noDoctor">
                        {getLabelFromLanguage({ fieldName: "noDoctorAvail" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentComponent;
