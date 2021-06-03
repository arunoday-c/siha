import React, { memo, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import {
  MainContext,
  AlgaehAutoComplete,
  // AlgaehLabel,
} from "algaeh-react-components";
import moment from "moment";
import { AppointmentContext } from "../AppointmentContext";
import { getDoctorSchedule } from "./events";
export default memo(function Filter(props) {
  const { userLanguage } = useContext(MainContext);
  const {
    sub_department_id,
    provider_id,
    setDepartment,
    setDoctor,
    appointmentDate,
    setDoctorSchedules,
  } = useContext(AppointmentContext);
  const [doctors, setDoctorsList] = useState([]);
  const history = useHistory();
  const pathName = history.location.pathname;
  useQuery(
    [
      "doctor-schedule",
      {
        sub_dept_id: sub_department_id,
        provider_id,
        schedule_date: appointmentDate
          ? moment(appointmentDate).format("YYYY-MM-DD")
          : null,
      },
    ],
    getDoctorSchedule,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,

      onSuccess: (data) => {
        setDoctorSchedules(data);
      },
    }
  );

  function onChangeDepartment(selected) {
    setDepartment(selected.value);

    if (Array.isArray(selected?.children)) {
      setDoctorsList(selected?.children);
    }

    history.push(
      pathName +
        `?appointmentDate=${moment(appointmentDate).format(
          "YYYY-MM-DD"
        )}&sub_department_id=${selected.value}`
    );
  }
  function onChangeDoctor(select) {
    setDoctor(select?.value);
    history.push(
      pathName +
        `?appointmentDate=${moment(appointmentDate).format(
          "YYYY-MM-DD"
        )}&sub_department_id=${sub_department_id}&provider_id=${select?.value}`
    );
  }
  function onClearDepartment() {
    setDepartment("");
    setDoctorsList([]);
    setDoctor("");
    history.push(
      pathName +
        `?appointmentDate=${moment(appointmentDate).format("YYYY-MM-DD")}`
    );
  }

  return (
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
          value: sub_department_id,
          dataSource: {
            textField: userLanguage === "ar" ? "arlabel" : "label",
            valueField: "value",
            data: props.data,
          },
          onChange: onChangeDepartment,
          onClear: () => onClearDepartment,
          autoComplete: "off",
          others: {
            loading: props.isLoading,
          },
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
          value: provider_id,
          dataSource: {
            textField: userLanguage === "ar" ? "arlabel" : "label", //"full_name",
            valueField: "value", //"provider_id",
            data: doctors,
          },
          onChange: onChangeDoctor,
          onClear: () => {
            setDoctor("");
            history.push(
              pathName +
                `?appointmentDate=${moment(appointmentDate).format(
                  "YYYY-MM-DD"
                )}`
            );
          },
          autoComplete: "off",
        }}
      />
      {/* <div className="col-lg-1 form-group" style={{ marginTop: 20 }}>
        <button
          id="load-appt-sch"
          type="submit"
          onClick={onClickLoadButton}
          className="btn btn-primary"
        >
          <AlgaehLabel
            label={{
              fieldName: "loadData",
            }}
          />
        </button>
      </div> */}
    </div>
  );
});
