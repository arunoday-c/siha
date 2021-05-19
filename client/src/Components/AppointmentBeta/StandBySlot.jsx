import React, { useContext, memo } from "react";
import "./appointment.scss";
import moment from "moment";
import Enumerable from "linq";
// import { AppointmentContext } from "./AppointmentContext";
// import { generateReport } from "./AppointmentHelper";
import { MainContext } from "algaeh-react-components";
export default memo(function StandBySlot({
  _patientList,
  state,
  data,
  patient,
  showModal,
  handlePatient,
  generateReport,
  cancelAppt,
}) {
  const { userLanguage } = useContext(MainContext);

  const plotStandByAddIcon = (patient, data) => {
    let date_time_val =
      (moment(data.time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD");

    if (!date_time_val) {
      return (
        <i
          appt-time={data.time}
          to_work_hr={data.to_work_hr}
          from_break_hr1={data.from_break_hr1}
          to_break_hr1={data.to_break_hr1}
          from_break_hr2={data.from_break_hr2}
          to_break_hr2={data.to_work_hr}
          slot={data.slot}
          clinic_id={data.clinic_id}
          provider_id={data.provider_id}
          sch_header_id={data.sch_header_id}
          sch_detail_id={data.sch_detail_id}
          sub_dept_id={data.sub_dept_id}
          isstandby="Y"
          onClick={showModal}
          className="fas fa-plus"
        />
      );
    } else {
      return null;
    }
  };
  const _standByPatients =
    _patientList !== null
      ? Enumerable.from(_patientList)
          .where((w) => w.is_stand_by === "Y" && w.cancelled === "N")
          .toArray()
      : undefined;

  const loadSubStandBy = (patients) => {
    if (patients !== undefined && patients !== null && patients.length > 0) {
      const _otherPatients = patients.slice(1);
      if (_otherPatients !== undefined && _otherPatients.length > 0) {
        return (
          <span className="patientStdbyCount">
            {_otherPatients.length} more..
            <ul>
              {_otherPatients.map((item, index) => {
                return (
                  <li key={index}>
                    <p>
                      {userLanguage === "ar"
                        ? item.arabic_name
                        : item.patient_name}
                    </p>
                    <span>
                      <i
                        className="fas fa-check"
                        onClick={(e) => {
                          handlePatient(
                            item,
                            {
                              hims_d_appointment_status_id: state.checkInId,
                            },
                            e
                          );
                        }}
                      />
                      <i
                        className="fas fa-clock"
                        onClick={(e) =>
                          handlePatient(
                            item,
                            {
                              hims_d_appointment_status_id: state.RescheduleId,
                            },
                            e
                          )
                        }
                      />
                      <i
                        className="fas fa-times"
                        onClick={() => cancelAppt(item)}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </span>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const renderStandByMultiple = (standByPatients) => {
    if (standByPatients !== null && standByPatients !== undefined) {
      const _firstPatient = standByPatients[0];
      const sel_stat_id =
        _firstPatient !== undefined ? _firstPatient.appointment_status_id : 0;

      const sel_stat = Enumerable.from(
        state.appointmentStatus !== undefined ? state.appointmentStatus : []
      )
        .where((w) => w.hims_d_appointment_status_id === sel_stat_id)
        .firstOrDefault();

      let sel_steps = sel_stat !== undefined ? sel_stat.steps : 0;

      let status =
        sel_stat_id !== null
          ? Enumerable.from(
              state.appointmentStatus !== undefined
                ? state.appointmentStatus
                : []
            )
              .where((w) => w.steps > sel_steps)
              .toArray()
          : [];
      let isTodayActive = moment(state.activeDateHeader).isSame(
        moment(),
        "day"
      );
      if (!isTodayActive) {
        status = status.filter(
          (stat) => stat.hims_d_appointment_status_id !== state.checkInId
        );
      }
      if (_firstPatient !== undefined) {
        return (
          <React.Fragment key={data.counter}>
            {_firstPatient.appointment_status_id === state.noShowId ? (
              <div
                className="dynPatient"
                style={{ background: "#f2f2f2" }}
                draggable={false}
              >
                <span>
                  {_firstPatient.patient_name} <br />
                  {_firstPatient.tel_code}
                  &nbsp;
                  {_firstPatient.contact_number}
                </span>
              </div>
            ) : (
              <div
                appt-pat={JSON.stringify(_firstPatient)}
                className="dynPatient"
                style={{ background: "#f2f2f2" }}
              >
                <span>
                  {_firstPatient.patient_name}
                  <br />
                  {_firstPatient.tel_code}
                  &nbsp;
                  {_firstPatient.contact_number}
                </span>

                <i
                  className="fas fa-times"
                  onClick={() => cancelAppt(_firstPatient)}
                />
                <div className="appStatusListCntr">
                  <i className="fas fa-clock" />
                  <ul className="appStatusList">
                    {status !== undefined
                      ? status.map((data, index) => (
                          <li
                            key={index}
                            onClick={(e) => {
                              handlePatient(_firstPatient, data, e);
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: data.color_code,
                              }}
                            >
                              {userLanguage === "ar"
                                ? data.description_ar
                                : data.statusDesc}
                            </span>
                          </li>
                        ))
                      : null}
                    <li
                      onClick={() =>
                        generateReport(
                          _firstPatient,
                          "appointmentSlip",
                          "Appointment Slip"
                        )
                      }
                    >
                      <span>Print App. Slip</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {loadSubStandBy(standByPatients)}
          </React.Fragment>
        );
      } else {
        return null;
      }
    }
  };
  return (
    <>
      <td className="tg-baqh">
        <span className="dynSlot">{data.time}</span>
        {plotStandByAddIcon(patient, data)}
        {renderStandByMultiple(_standByPatients)}
      </td>
    </>
  );
});
