import React, { useLayoutEffect, useContext, useEffect } from "react";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehModalPopUp,
} from "../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../Wrapper/autoSearch";
import { getLabelFromLanguage } from "../../utils/GlobalFunctions";
import GlobalVariables from "../../utils/GlobalVariables";
import "./appointment.scss";
import spotlightSearch from "../../Search/spotlightSearch.json";
import {
  AlgaehAutoComplete,
  MainContext,
  AlgaehLabel as NewAlgaehLabel,
  // AlgaehAutoComplete,
  // AlgaehDateHandler,
  Input,
  Select,
} from "algaeh-react-components";
import { useLocation } from "react-router-dom";

function AppointmentComponent(props) {
  const { countries = [], userLanguage } = useContext(MainContext);
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      const {
        sub_department_id,
        date_of_birth,
        patient_code,
        hims_d_patient_id,
        pat_name,
        arabic_name,
        gender,
        tel_code,
        title_id,
        contact_number,
        email,
      } = location.state.data;
      const yrsAge = moment().diff(
        moment(date_of_birth, "YYYY-MM-DD"),
        "years"
      );
      props.setState({ patient_code: patient_code });
      props.setstates("patient_code", patient_code);
      props.setstates("patient_id", hims_d_patient_id);
      props.setstates("patient_name", pat_name);
      props.setstates("arabic_name", arabic_name);
      props.setstates("gender", gender);
      props.setstates("age", yrsAge);
      props.setstates("date_of_birth", date_of_birth);
      props.setstates("sub_department_id", sub_department_id);
      props.setstates("contact_number", contact_number);
      props.setstates("tel_code", tel_code);
      props.setstates("title_id", title_id);
      props.setstates("email", email);
      props.setstates("fromSearch", true);

      // props.setstates("provider_id", doctor_id);
    } else {
      return;
    }
  }, [location.state]);

  useLayoutEffect(() => {
    const getAllTables = document.getElementsByTagName("table");
    for (let i = 0; i < getAllTables.length; i++) {
      const table = getAllTables[i];
      const td = table.querySelector("td[activetime='true']");
      if (td === null) {
        break;
      }
      const offBody = table.offsetTop;
      const offElement = td.parentNode.offsetTop;
      const topOffSet = offElement - offBody; //td.offsetTop;
      td.firstChild.setAttribute(
        "style",
        `top:${td.offsetTop}px;display:block;`
      );
      table.lastElementChild.scroll(0, topOffSet);
    }
  }, [props.state.appointmentSchedule]);
  return (
    <div>
      <div className="appointment">
        {props.state.hasError ? (
          "OOPS Something went wrong , please refresh the page"
        ) : (
          <div id="appointment-module">
            {/* Edit Pop up Start */}
            <AlgaehModalPopUp
              class="reScPopupWidth"
              // title={getLabelFromLanguage({
              //   fieldName: "editAppo"
              // })}
              title="Reschedule Patient"
              events={{
                onClose: props.handleClose,
              }}
              openPopup={props.state.openPatEdit}
            >
              <div className="col-lg-12" data-validate="editApptDiv">
                <div className="row">
                  <div className="col-lg-12 popRightDiv">
                    <div className="row margin-top-15">
                      <AlagehFormGroup
                        div={{
                          className: "col-6  form-group mandatory",
                        }}
                        label={{
                          fieldName: "full_name",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "patient_name",
                          value: props.state.edit_patient_name,
                          disabled: true,
                          events: {
                            onChange: props.texthandle,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{
                          className: "col-6 form-group mandatory",
                        }}
                        label={{
                          fieldName: "contact_number",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "contact_number",
                          others: {
                            type: "number",
                            disabled: true,
                          },
                          value: props.state.edit_contact_number,
                          events: {
                            onChange: props.texthandle,
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          forceLabel: "Choose Doctor",
                        }}
                        selector={{
                          name: "edit_provider_id",
                          className: "select-fld",
                          value: props.state.edit_provider_id,
                          dataSource: {
                            textField: "full_name",
                            valueField: "provider_id",
                            data: props.state.doctors,
                          },
                          onChange: props.dropDownHandle,
                          onClear: () => props.nullifyState("provider_id"),
                          autoComplete: "off",
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "appoDate",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "edit_appt_date",
                          others: {
                            disabled: false,
                          },
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: props.editDateHandler,
                          onBlur: props.editDateValidate,
                        }}
                        value={props.state.edit_appt_date}
                      />
                    </div>
                    <div className="row margin-vertical-15">
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "appoTime",
                          isImp: true,
                        }}
                        selector={{
                          name: "edit_appt_time",
                          className: "select-fld",
                          value: props.state.edit_appt_time,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: props.state.timeSlots,
                          },
                          others: {
                            disabled: !props.state.schAvailable,
                          },
                          onChange: props.dropDownHandle,
                          sort: "off",
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group mandatory " }}
                        label={{
                          fieldName: "selectSlot",
                          isImp: true,
                        }}
                        selector={{
                          name: "edit_no_of_slots",
                          className: "select-fld",
                          value: props.state.edit_no_of_slots,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NO_OF_SLOTS,
                          },
                          others: {
                            checkvalidation: "$value >" + props.state.maxSlots,
                            errormessage:
                              "Maximum " +
                              props.state.maxSlots +
                              " slot(s) avilable ",
                          },
                          onChange: props.dropDownHandle,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row popupFooter">
                  <div className="col-lg-12">
                    <button
                      onClick={() => props.updatePatientAppointment(null)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {getLabelFromLanguage({
                        fieldName: "btn_update",
                      })}
                    </button>
                    <button
                      onClick={props.handleClose}
                      type="button"
                      className="btn btn-other"
                    >
                      {getLabelFromLanguage({
                        fieldName: "btn_close",
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
              title={<NewAlgaehLabel label={{ fieldName: "bookAppo" }} />}
              // {getLabelFromLanguage({
              //   fieldName: "bookAppo",
              // })}
              events={{
                onClose: props.handleClose,
              }}
              openPopup={props.state.showApt}
            >
              <div className="popupInner" data-validate="addApptDiv">
                <div className="col-12 popRightDiv">
                  <div className="row">
                    <div className="col-2 form-group">
                      <AlgaehLabel
                        label={{
                          fieldName: "appoDate",
                        }}
                      />
                      <h6>
                        {userLanguage === "ar"
                          ? new Date(
                              props.state.activeDateHeader
                            ).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : moment(props.state.activeDateHeader).format(
                              "DD-MM-YYYY"
                            )}
                      </h6>
                    </div>

                    <div className="col-2 form-group">
                      <AlgaehLabel
                        label={{
                          fieldName: "appoTime",
                        }}
                      />
                      <h6>
                        {userLanguage === "ar"
                          ? new Date(
                              moment(props.state.apptFromTime, "HH:mm tt")._d
                            )
                              .toLocaleDateString("ar-EG", {
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .split(",")[1]
                          : props.state.apptFromTime}
                      </h6>
                    </div>

                    <AlagehAutoComplete
                      div={{
                        className: "col-2  form-group mandatory",
                      }}
                      label={{
                        fieldName: "selectSlot",
                        isImp: true,
                      }}
                      selector={{
                        name: "no_of_slots",
                        className: "select-fld",
                        value: props.state.no_of_slots,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.NO_OF_SLOTS,
                        },
                        onChange: props.dropDownHandle,
                      }}
                    />

                    <div className="col globalSearchCntr">
                      <AlgaehLabel label={{ fieldName: "patient_search" }} />
                      <h6 onClick={props.patientSearch}>
                        {props.state.patient_code
                          ? props.state.patient_code
                          : "Search Patient"}
                        <i className="fas fa-search fa-lg"></i>
                      </h6>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{
                        className: "col-2  form-group mandatory",
                      }}
                      label={{
                        fieldName: "title_id",
                        isImp: true,
                      }}
                      selector={{
                        name: "title_id",
                        className: "select-fld",
                        value: props.state.title_id,
                        dataSource: {
                          textField:
                            userLanguage === "ar" ? "arabic_title" : "title",
                          valueField: "his_d_title_id",
                          data: props.state.titles,
                        },
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        onChange: props.dropDownHandle,
                        onClear: props.dropDownHandle,
                      }}
                    />

                    <AlagehFormGroup
                      div={{
                        className: "col-5  form-group mandatory",
                      }}
                      label={{
                        fieldName: "full_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "patient_name",
                        value: props.state.patient_name,
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        events: {
                          onChange: props.texthandle,
                        },
                      }}
                    />
                    <AlagehFormGroup
                      div={{
                        className: "col-5  form-group mandatory arabic-txt-fld",
                      }}
                      label={{
                        fieldName: "arabic_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_name",
                        value: props.state.arabic_name,
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        events: {
                          onChange: props.texthandle,
                        },
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlgaehDateHandler
                      div={{
                        className: "col-3   form-group mandatory",
                      }}
                      label={{
                        fieldName: "date_of_birth",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_birth",
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: props.ageHandler,
                        onBlur: props.validateAge,
                      }}
                      value={props.state.date_of_birth}
                    />

                    <AlagehFormGroup
                      div={{
                        className: "col-2  form-group mandatory",
                      }}
                      label={{
                        fieldName: "age",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "age",
                        number: {
                          allowNegative: false,
                        },
                        others: {
                          type: "number",
                          onBlur: props.validateAge,
                          disabled: props.state.fromSearch || false,
                        },
                        value: props.state.age,
                        events: {
                          onChange: props.dobHandler,
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{
                        className: "col-2  form-group mandatory",
                      }}
                      label={{
                        fieldName: "gender",
                        isImp: true,
                      }}
                      selector={{
                        name: "gender",
                        className: "select-fld",
                        value: props.state.gender,
                        dataSource: {
                          textField:
                            userLanguage === "ar" ? "arabic_name" : "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_GENDER,
                        },
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        onChange: props.dropDownHandle,
                      }}
                    />

                    <AlagehAutoComplete
                      div={{
                        className: "col form-group mandatory AutoCompleteRight",
                      }}
                      label={{
                        fieldName: "selectStatus",
                        isImp: true,
                      }}
                      selector={{
                        name: "appointment_status_id",
                        className: "select-fld",
                        value: props.state.appointment_status_id,
                        dataSource: {
                          textField:
                            userLanguage === "ar"
                              ? "description_ar"
                              : "statusDesc",
                          valueField: "hims_d_appointment_status_id",
                          data: props.state.appointmentStatus,
                        },
                      }}
                    />
                  </div>

                  <div className="row">
                    {/* <AlagehFormGroup
                      div={{
                        className: "col-6 form-group mandatory",
                      }}
                      label={{
                        fieldName: "contact_number",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "contact_number",
                        others: {
                          type: "number",
                          disabled: props.state.fromSearch || false,
                        },
                        value: props.state.contact_number,
                        events: {
                          onChange: props.texthandle,
                        },
                      }}
                    /> */}
                    {!!countries?.length && (
                      <div className="col-lg-4 algaehInputGroup">
                        <AlgaehLabel
                          label={{
                            fieldName: "contact_number",
                            isImp: true,
                          }}
                        />
                        <Input.Group compact>
                          <>
                            <Select
                              value={props.state.tel_code}
                              onChange={props.dropDownCountry}
                              virtual={true}
                              // disabled={disabled}
                              // disabled={props.state.fromSearch || false}
                              showSearch
                              filterOption={(input, option) => {
                                return (
                                  option.value
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              options={countries
                                ?.map((item) => item.tel_code)
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .map((item) => ({
                                  label: item,
                                  value: item,
                                }))}
                            >
                              {/* {countries?.map((item) => (
                                      <Option
                                        value={item.tel_code}
                                        key={item.tel_code}
                                      >
                                        {item.tel_code}
                                      </Option>
                                    ))} */}
                            </Select>
                          </>
                          <AlagehFormGroup
                            // div={{
                            //   className: "col-6 form-group mandatory",
                            // }}
                            // label={{
                            //   fieldName: "contact_number",
                            //   isImp: true,
                            // }}
                            textBox={{
                              className: "txt-fld",
                              name: "contact_number",
                              others: {
                                type: "number",
                                disabled: props.state.fromSearch || false,
                              },
                              value: props.state.contact_number,
                              events: {
                                onChange: props.texthandle,
                              },
                            }}
                          />
                          {/* <Controller
                            control={control}
                            name="contact_number"
                            rules={{
                              required: "Please Enter Contact Number",
                              minLength: {
                                message: "Please Enter Valid Number",
                                value: 6,
                              },
                            }}
                            render={(props) => (
                              <>
                                <Input {...props} disabled={disabled} />
                              </>
                            )}
                          /> */}
                        </Input.Group>
                      </div>
                    )}

                    <AlagehFormGroup
                      div={{
                        className: "col-6 form-group",
                      }}
                      label={{
                        fieldName: "email",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "email",
                        value: props.state.email,
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        events: {
                          onChange: props.texthandle,
                        },
                      }}
                    />
                  </div>

                  <div className="row">
                    <AlagehFormGroup
                      div={{
                        className: "col-12 form-group margin-bottom-15",
                      }}
                      label={{
                        fieldName: "remarks",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "appointment_remarks",
                        value: props.state.appointment_remarks,
                        others: {
                          disabled: props.state.fromSearch || false,
                        },
                        events: {
                          onChange: props.texthandle,
                        },
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
                      fieldName: "btn_save",
                    })}
                  </button>
                  <button
                    onClick={props.handleClose}
                    type="button"
                    className="btn btn-other"
                  >
                    {getLabelFromLanguage({
                      fieldName: "btn_close",
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
              <AlgaehAutoComplete
                div={{ className: "col-3  mandatory" }}
                label={{
                  fieldName: "department_name",
                  isImp: true,
                }}
                selector={{
                  name: "sub_department_id",
                  className: "select-fld",
                  value: props.state.sub_department_id,
                  dataSource: {
                    textField: userLanguage === "ar" ? "arlabel" : "label", //"sub_department_name",
                    valueField: "value", //"sub_dept_id",
                    data: props.state.departments,
                  },
                  onChange: props.deptDropDownHandler,
                  onClear: () => props.nullifyState("sub_department_id"),
                  autoComplete: "off",
                }}
              />

              <AlgaehAutoComplete
                div={{ className: "col-3 " }}
                label={{
                  fieldName: "filterbyDoctor",
                }}
                selector={{
                  name: "provider_id",
                  className: "select-fld",
                  value: props.state.provider_id,
                  dataSource: {
                    textField: userLanguage === "ar" ? "arlabel" : "label", //"full_name",
                    valueField: "value", //"provider_id",
                    data: props.state.doctors,
                  },
                  onChange: props.dropdownDoctorHandler,
                  onClear: () => props.nullifyState("provider_id"),
                  autoComplete: "off",
                }}
              />

              <div className="col-lg-1 form-group" style={{ marginTop: 20 }}>
                <button
                  id="load-appt-sch"
                  type="submit"
                  onClick={props.getAppointmentSchedule}
                  className="btn btn-primary"
                >
                  <NewAlgaehLabel
                    label={{
                      fieldName: "loadData",
                    }}
                  />
                </button>
              </div>

              <AlgaehAutoSearch
                div={{ className: "col-3 AlgaehAutoSearch" }}
                label={{ fieldName: "patient_search" }}
                title="Search Patient"
                id="patient_id_search"
                template={(result) => {
                  return (
                    <section className="resultSecStyles patient">
                      <div className="row">
                        <div className="col-12">
                          <h4 className="title">{result.patient_name}</h4>

                          <div className="row">
                            {props.requied_emp_id === "Y" ? (
                              <div className="col-6">
                                <small>Emp Code</small>
                                {result.employee_id}
                              </div>
                            ) : null}
                            <div className="col-6">
                              <small>Pat Code:</small>
                              {result.patient_code}
                            </div>
                            <div className="col-6">
                              {" "}
                              <small>Mob:</small>
                              {result.contact_number}
                            </div>
                            <div className="col-6">
                              {" "}
                              <small>Doctor:</small> {result.provider_name}
                            </div>
                            <div className="col-6">
                              {" "}
                              <small>Dept:</small>
                              {result.sub_department_name}
                            </div>
                            <div className="col-6">
                              <small>Appo Time:</small>
                              {result.appointment_from_time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }}
                name="patient_name"
                columns={spotlightSearch.frontDesk.patientappoinment}
                displayField="patient_name"
                value={props.state.patient_name}
                searchName="patientappoinment"
                onClick={props.AppointmentSearch}
                extraParameters={{
                  appointment_date: moment(props.state.activeDateHeader).format(
                    "YYYY-MM-DD"
                  ),
                }}
              />
            </div>

            {/* Filter Bar End */}

            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{
                padding: 0,
                background: "none",
                boxShadow: "none",
                border: "none",
              }}
            >
              {/* Portlet Top Bar Start */}
              <div
                className="portlet-title"
                style={{ margin: "-10px -15px 0" }}
              >
                <div className="caption">
                  <h3 className="caption-subject">
                    <NewAlgaehLabel
                      label={{
                        fieldName: "doctorsAvailability",
                      }}
                    />
                    {/* {getLabelFromLanguage({
                      fieldName: "doctorsAvailability",
                    })} */}
                  </h3>
                </div>
                <div className="actions">
                  <ul className="ul-legend">
                    {props.state.appointmentStatus !== undefined
                      ? props.state.appointmentStatus.map((data, index) => (
                          <li key={index}>
                            <span
                              style={{
                                backgroundColor: data.color_code,
                              }}
                            />
                            {userLanguage === "ar"
                              ? data.description_ar
                              : data.statusDesc}
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
                      <>
                        {props.state.appointmentSchedule.map((data, index) => (
                          <table key={index} className="tg">
                            <thead>
                              <tr>
                                <th className="tg-amwm" colSpan="2">
                                  <h6>
                                    {userLanguage === "ar"
                                      ? data.doctor_name_ar
                                      : data.doctor_name}
                                  </h6>
                                  <p>
                                    <span>
                                      <NewAlgaehLabel
                                        label={{
                                          fieldName: "roomNo",
                                        }}
                                      />
                                      {/* {getLabelFromLanguage({
                                        fieldName: "roomNo",
                                      })} */}
                                      :{" "}
                                      {userLanguage === "ar"
                                        ? data.room_name_ar
                                        : data.room_name}
                                    </span>
                                  </p>
                                </th>
                              </tr>
                              <tr>
                                <th className="tbl-subHdg">
                                  <NewAlgaehLabel
                                    label={{
                                      fieldName: "booked",
                                    }}
                                  />
                                  {/* {getLabelFromLanguage({
                                    fieldName: "booked",
                                  })} */}
                                </th>
                                <th className="tbl-subHdg">
                                  <NewAlgaehLabel
                                    label={{
                                      fieldName: "standBy",
                                    }}
                                  />
                                  {/* {getLabelFromLanguage({
                                    fieldName: "standBy",
                                  })} */}
                                </th>
                              </tr>
                            </thead>
                            {data.modified === "L" ? (
                              <tbody>
                                <tr>
                                  <td>
                                    <span className="doctorLeaveCntr">
                                      <NewAlgaehLabel
                                        label={{
                                          fieldName: "doctorLeave",
                                        }}
                                      />
                                      {/* {getLabelFromLanguage({
                                        fieldName: "doctorLeave",
                                      })} */}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody>{props.generateTimeslots(data)}</tbody>
                            )}
                          </table>
                        ))}
                      </>
                    ) : (
                      <span className="noDoctor">
                        <NewAlgaehLabel
                          label={{
                            fieldName: "noDoctorAvail",
                          }}
                        />
                        {/* {getLabelFromLanguage({ fieldName: "noDoctorAvail" })} */}
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
