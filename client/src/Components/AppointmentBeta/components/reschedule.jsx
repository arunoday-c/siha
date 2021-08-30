import React, { memo, useState, useContext, useEffect } from "react";
import {
  AlgaehModal,
  // AlgaehLabel,
  AlgaehFormGroup,
  MainContext,
  // AlgaehDataGrid,
  AlgaehDateHandler,
  AlgaehAutoComplete,
} from "algaeh-react-components";
// import { getDoctorSchedule, confirmAppointmentSMS } from "./events";
import swal from "sweetalert2";
import { AppointmentContext } from "../AppointmentContext";
// import { newAlgaehApi } from "../../../hooks";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
// import { useQuery, useMutation } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { generateTimeslotsForDoctor } from "../AppointmentHelper";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { rescheduleAppointmentSMS } from "./events";
// import Enumerable from "linq";

export default memo(function ReschedulePopup({
  patient,
  maxSlots,
  showReschedulePopup,
  setShowReschedulePopup,
}) {
  const { userLanguage } = useContext(MainContext);
  // const [maxSlots, setMaxSlots] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [schAvailable, setSchAvailable] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [timeDifference, setTimeDifference] = useState(null);
  const {
    setDoctorSchedules,
    sub_department_id,
    provider_id,
    app_status,
    appointmentDate,
    departmentData,
  } = useContext(AppointmentContext);
  const { control, errors, handleSubmit, setValue, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: {
      edit_appt_date: appointmentDate,
      edit_provider_id: provider_id,
    },
  });
  useEffect(() => {
    const filterDoctors = departmentData.filter((f) => {
      return f.value === parseInt(sub_department_id);
    });

    setDoctors(filterDoctors[0].children);
    console.log("patient", patient, schAvailable);
    // let time = patient.appointment_from_time;
    setValue("edit_provider_id", patient.provider_id);
    // time = time
    //   .toString()
    //   .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    // if (time.length > 1) {
    //   // If time format correct
    //   time = time.slice(1); // Remove full string match value
    //   time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    //   time[0] = +time[0] % 12 || 12; // Adjust hours
    // }
    // time.join("");
    // setValue("edit_appt_time", time);
    getTimeSlotsForDropDown(provider_id);
  }, []);
  function isInactiveTimeSlot(time, date) {
    let activeDate = date ? date : appointmentDate;
    if (moment(activeDate).isBefore(moment(), "day")) {
      return true;
    } else if (moment(activeDate).isSame(moment(), "day")) {
      return (
        moment(time, "HH:mm a").format("HHmm") > moment(moment()).format("HHmm")
      );
    } else {
      return moment(time, "HH:mm a").format("HHmm");
    }
  }

  const plotPatients = (data) => {
    const newEndTime = new moment(data.time, "hh:mm a").add(
      data.slot,
      "minutes"
    );
    let patients = [];
    if (data.patients !== undefined) {
      patients = data.patients;
    }
    const patient = patients.filter(
      (w) =>
        (moment(w.appointment_to_time, "hh:mm:ss") >
          moment(data.time, "hh:mm a") &&
          moment(w.appointment_to_time, "hh:mm:ss") <=
            moment(data.time, "hh:mm a")) ||
        (moment(w.appointment_from_time, "hh:mm:ss") <=
          moment(data.time, "hh:mm a") &&
          moment(w.appointment_to_time, "hh:mm:ss") >= newEndTime)
    );

    if (patient.length > 0) {
      return patient;
    } else {
      return null;
    }
  };
  const getTimeSlotsForDropDown = (id) => {
    let schedule;
    // let data;
    let apptDate = getValues().edit_appt_date;

    let send_data = {
      sub_dept_id: sub_department_id,
      schedule_date: moment(apptDate).format("YYYY-MM-DD"),
      provider_id: id,
    };
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: send_data,
      onSuccess: (response) => {
        if (response.data.success && response.data.records.length > 0) {
          schedule = response.data.records;
          // data = schedule.filter((doc) => doc.provider_id === provider_id);

          const options = { hour12: true, hour: "2-digit", minute: "2-digit" };
          const result = generateTimeslotsForDoctor(schedule[0]);
          let timeSlots = [];
          debugger;
          const differenceTime = getDifferenceInMinutes(result[0], result[1]);
          setTimeDifference(differenceTime);
          result.forEach((time) => {
            if (time !== "break") {
              if (
                isInactiveTimeSlot(time, apptDate) &&
                isEmpty(
                  plotPatients({
                    time,
                    slot: schedule[0].slot,
                    patients: schedule[0].patientList,
                  })
                )
              ) {
                const time_ar = new Date(moment(time, "HH:mm:ss")._d);
                timeSlots.push({
                  name: moment(time, "HH:mm:ss").format("hh:mm a"),
                  value: time,
                  name_ar: time_ar.toLocaleDateString("ar-EG", options),
                });
              }
            }
          });

          setTimeSlots(timeSlots);
          setSchAvailable(true);
        } else {
          swalMessage({
            title: "There is no schedule Available for the doctor",
            type: "error",
          });
          setTimeSlots([]);
          setSchAvailable(false);
        }
      },
      onFailure: (response) => {
        swalMessage({
          title: "There is no schedule Available for the doctor",
          type: "error",
        });
        setTimeSlots([]);
        setSchAvailable(false);
      },
    });
  };
  function getDifferenceInMinutes(start, end) {
    start = start.split(":");
    end = end.split(":");
    let startDate = new Date(0, 0, 0, start[0], start[1], 0);
    let endDate = new Date(0, 0, 0, end[0], end[1], 0);
    let diff = endDate.getTime() - startDate.getTime();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);

    return minutes;
  }
  const addOrUpdate = (data) => {
    const _data = patient;

    const duration = timeDifference * parseInt(data.edit_no_of_slots);

    const app_end_time = moment(data.edit_appt_time, "hh:mm a")
      .add("minutes", duration)
      .format("HH:mm:ss");
    swal({
      title: "Are you sure you want to Re-Schedule the appointment?",
      text: `"${
        userLanguage === "en" ? _data.patient_name : _data.arabic_name
      }" rescheduling from "${_data.appointment_from_time}" to "${
        data.edit_appt_time
      }" `,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willUpdate) => {
      if (willUpdate.value) {
        const appStatus = app_status.find(
          (f) => f.default_status === "RS"
        )?.hims_d_appointment_status_id;
        const sendingData = {
          ..._data,
          appointment_status_id: appStatus,
          appointment_to_time: app_end_time,
          appointment_from_time: moment(data.edit_appt_time, "hh:mm a").format(
            "HH:mm:ss"
          ),
          appointment_date: moment(getValues().edit_appt_date).format(
            "YYYY-MM-DD"
          ),
          is_stand_by: "N",
          cancelled: "N",
          record_status: "A",
        };

        rescheduleAppointmentSMS(
          sendingData,
          sub_department_id,
          provider_id,
          appointmentDate
        ).then((response) => {
          setDoctorSchedules(response);
        });
      }
    });
  };
  return (
    <div>
      <AlgaehModal
        title="Reschedule Patient"
        visible={showReschedulePopup}
        mask={true}
        footer={[]}
        maskClosable={true}
        onCancel={setShowReschedulePopup}
      >
        <div className="col-lg-12" data-validate="editApptDiv">
          <form onSubmit={handleSubmit(addOrUpdate)}>
            <div className="row">
              <div className="col-lg-12 popRightDiv">
                <div className="row margin-top-15">
                  <AlgaehFormGroup
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
                      value: patient.patient_name,
                      disabled: true,
                    }}
                  />
                  <AlgaehFormGroup
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
                      value: patient.contact_number,
                    }}
                  />
                  <Controller
                    name="edit_provider_id"
                    control={control}
                    rules={{ required: "Select Doctor" }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          forceLabel: "Choose Doctor",
                        }}
                        error={errors}
                        selector={{
                          name: "edit_provider_id",
                          className: "select-fld",
                          value,
                          dataSource: {
                            textField:
                              userLanguage === "ar" ? "arlabel" : "label", //"full_name",
                            valueField: "value", //"provider_id",
                            data: doctors,
                          },
                          onChange: (_, selected) => {
                            getTimeSlotsForDropDown(selected);
                            onChange(selected);
                          },

                          // others: {
                          //   disabled:
                          //     current.request_status === "APR" &&
                          //     current.work_status === "COM",
                          //   tabIndex: "4",
                          // },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="edit_appt_date"
                    control={control}
                    render={({ value, onChange }) => (
                      <AlgaehDateHandler
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "appoDate",
                          isImp: true,
                        }}
                        name="edit_appt_date"
                        textBox={{
                          className: "form-control",
                          value,
                        }}
                        others={
                          {
                            // disabled: disabled || current.request_status === "APR",
                            // tabIndex: "6",
                          }
                        }
                        minDate={new Date()}
                        events={{
                          onChange: (reqDate) => {
                            setValue("edit_appt_date", moment(reqDate));
                            getTimeSlotsForDropDown(
                              getValues().edit_provider_id
                            );
                          },
                          onClear: () => {
                            onChange(undefined);
                          },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="row margin-vertical-15">
                  <Controller
                    name="edit_appt_time"
                    control={control}
                    rules={{ required: "Select date" }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-6 form-group mandatory" }}
                        label={{
                          fieldName: "appoTime",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          className: "form-control",
                          name: "edit_appt_time",
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);

                            // setValue("service_amount", _.standard_fee);
                          },
                          others: {
                            // disabled: !schAvailable,
                          },
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: timeSlots,
                          },
                          // others: {
                          //   disabled:
                          //     current.request_status === "APR" &&
                          //     current.work_status === "COM",
                          //   tabIndex: "4",
                          // },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="edit_no_of_slots"
                    control={control}
                    rules={{ required: "Select Slot" }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-6 form-group mandatory " }}
                        label={{
                          fieldName: "selectSlot",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          className: "form-control",
                          name: "edit_no_of_slots",
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },

                          others: {
                            checkvalidation: "$value >" + maxSlots,
                            errormessage:
                              "Maximum " + maxSlots + " slot(s) avilable ",
                          },

                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NO_OF_SLOTS,
                          },
                          // others: {
                          //   disabled:
                          //     current.request_status === "APR" &&
                          //     current.work_status === "COM",
                          //   tabIndex: "4",
                          // },
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-12">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  onClick={setShowReschedulePopup}
                  type="button"
                  className="btn btn-other"
                >
                  close
                </button>
              </div>
            </div>
          </form>
        </div>
      </AlgaehModal>
    </div>
  );
});
