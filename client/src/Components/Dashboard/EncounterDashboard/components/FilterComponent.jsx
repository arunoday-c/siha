import React, { memo, useContext, useState, useEffect } from "react";
// import {useQuery} from "react-query";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import {
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehTreeSearch,
} from "algaeh-react-components";
import { useHistory } from "react-router-dom";
import { loadEncounterData } from "./events";
import { EncounterDashboardContext } from "../EncounterDashboardContext";

export default memo(function FilterComponent(props) {
  const [doctors, setDoctors] = useState([]);
  const { control, errors, handleSubmit, getValues, setValue } = useForm({
    shouldFocusError: true,
    defaultValues: {
      from_date: new Date(),
      hospital_id: -1,
    },
  });
  const history = useHistory();
  // const location = useLocation();
  const pathName = history.location.pathname;
  const {
    // setSubDepartmentData,
    // setDoctorData,
    subDepartmentData,
    doctorData,
    hospitalData,
    setFollowUpPatientCount,
    setNewPatientCount,
    setTotalPatientsLength,
    setEncounterData,
  } = useContext(EncounterDashboardContext);

  const encounterData = (data) => {
    loadEncounterData(data).then((result) => {
      setFollowUpPatientCount(result.total_followUp);
      setNewPatientCount(result.total_new_visit);
      setTotalPatientsLength(result.totalPatient);
      const sortedData = result.arrangedData.sort((a, b) =>
        a.totalLength < b.totalLength ? 1 : -1
      );

      setEncounterData(sortedData);
    });
  };
  useEffect(() => {
    if (doctorData?.length > 0) {
      setDoctors(doctorData);
    }
  }, [doctorData]);
  useEffect(() => {
    history.push(
      pathName +
        `?from_date=${moment(
          getValues().from_date ? getValues().from_date : new Date()
        ).format("YYYY-MM-DD")}`
    );
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit(encounterData)}>
        <div
          className="row inner-top-search margin-bottom-15"
          style={{ background: "none" }}
        >
          <Controller
            name="hospital_id"
            control={control}
            rules={{ required: "Select bed" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Select Branch",
                  isImp: true,
                }}
                error={errors}
                selector={{
                  className: "form-control",
                  name: "hospital_id",
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);
                  },
                  onClear: () => {
                    onChange(undefined);
                  },

                  dataSource: {
                    textField: "hospital_name",
                    valueField: "hims_d_hospital_id",
                    data: hospitalData,
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
            name="from_date"
            control={control}
            rules={{ required: "Please select date" }}
            render={({ value, onChange }) => (
              // <div className="col-2 algaeh-date-fld">
              <AlgaehDateHandler
                div={{
                  className: "col algaeh-date-fld",
                }}
                label={{ forceLabel: "Date", isImp: true }}
                error={errors}
                maxDate={new Date()}
                textBox={{
                  className: "txt-fld",
                  name: "from_date",
                  value: value || undefined,
                }}
                // maxDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          <Controller
            name="hims_d_sub_department_id"
            control={control}
            // rules={{ required: "Please select a department" }}
            render={({ value, onBlur, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col form-group " }}
                label={{
                  forceLabel: "Sub Department",
                  // isImp: true,
                }}
                // error={errors}
                selector={{
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);
                    setValue("doctor_id", undefined);
                    let doctors = doctorData;

                    setDoctors(
                      doctors.filter((f) => {
                        return f.value == selected;
                      })
                    );
                  },
                  onClear: () => {
                    onChange(undefined);
                    setDoctors(doctorData);
                  },
                  onBlur: (_, selected) => {
                    onBlur(selected);
                  },
                  name: "hims_d_sub_department_id",
                  dataSource: {
                    data: subDepartmentData,
                    textField: "sub_department_name",
                    valueField: "hims_d_sub_department_id",
                  },
                  others: {
                    // disabled: disabled || current.request_status === "APR",
                    tabIndex: "23",
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="doctor_id"
            // rules={{ required: "Please Select a doctor" }}
            render={({ onChange, value }) => (
              <AlgaehTreeSearch
                div={{ className: "col " }}
                label={{
                  fieldName: "doctor_id",
                  // isImp: true,
                  align: "ltr",
                }}
                // error={errors}
                tree={{
                  disableHeader: true,
                  treeDefaultExpandAll: true,
                  onChange: (selected) => {
                    onChange(selected);
                  },

                  // disabled: disabled,

                  value,
                  name: "doctor_id",
                  data: doctors ?? [],
                  textField: "label",
                  valueField: (node) => {
                    return node?.value;
                  },
                }}
              />
            )}
          />{" "}
          <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
            <button type="submit" className="btn btn-primary">
              Load
            </button>
          </div>{" "}
        </div>
      </form>
    </div>
  );
});
