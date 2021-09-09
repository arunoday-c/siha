import React, { useState, useEffect, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import "./PatientAdmission.scss";
// import BreadCrumb from "../BreadCrumb/BreadCrumb.js";
import {
  AlgaehLabel,
  algaehAxios,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  AlgaehSearch,
} from "algaeh-react-components";
import BreadCrumb from "Components/BreadCrumb";
import InsuranceDetails from "./insuranceDetails";
import BedDetails from "./bedDetails";
import { PatAdmissionContext } from "./PatientAdmissionContext";
import moment from "moment";

const getPatientInsurance = async (inputdata: any) => {
  const { error, response } = await algaehAxios(
    "/patientRegistration/getPatientInsurance",
    {
      module: "frontDesk",
      data: inputdata,
      method: "GET",
    }
  );
  if (error) {
    if (error.show === true) {
      let extendedError: Error | any = error;
      AlgaehMessagePop({
        display: extendedError.response.data.message,
        type: "error",
      });
      throw error;
    }
  }

  if (response.data.success === true) {
    return response.data.records;
  }
};
const getInsuranceProviders = async () => {
  const { error, response } = await algaehAxios(
    "/insurance/getInsuranceProviders",
    {
      module: "insurance",
      method: "GET",
    }
  );
  if (error) {
    if (error.show === true) {
      let extendedError: Error | any = error;
      AlgaehMessagePop({
        display: extendedError.response.data.message,
        type: "error",
      });
      throw error;
    }
  }

  if (response.data.success === true) {
    return response.data.records;
  }
};

const getAdmissionDetails = async (inputdata: any) => {
  debugger;
  const { error, response } = await algaehAxios(
    "/patAdmission/getAdmissionDetails",
    {
      module: "admission",
      method: "GET",
      data: { admission_number: inputdata.admission_number },
    }
  );
  if (error) {
    if (error.show === true) {
      let extendedError: Error | any = error;
      AlgaehMessagePop({
        display: extendedError.response.data.message,
        type: "error",
      });
      throw error;
    }
  }

  if (response.data.success === true) {
    return response.data.records;
  }
};

export default function PatientAdmission(props: any) {
  const [insurance_list, setInsuranceList] = useState<Array<any>>([]);
  // const [patient_details, setPatientDetails] = useState<any>({});
  const [admission_number, setAdmissionNumber] = useState<any>(undefined);
  const [doctor_data, setDoctorData] = useState<Array<any>>([]);

  //   const [sub_department_id, setSubDepartment] = useState<any>(undefined);
  //   const [doctor_id, setDoctor] = useState<any>(undefined);
  const [isInsurance, setIsInsurance] = useState(false);
  const [disable_data, setDisableData] = useState(false);
  const {
    selectedBedData,
    insuranceInfo,
    setServiceInfo,
    sub_department_id,
    doctor_id,
    setInsuranceInfo,
    setSelectedBedData,
    setSavedPatient,
    savedPatient,
    clearState,
    setDisableAfterAdmission,
    disableAfterAdmission,
  } = useContext(PatAdmissionContext);

  //   const [global_state, setGlobalState] = useState<any>({});
  //   const [patient_code, setPatientCode] = useState<any>(undefined);

  const {
    control,
    errors,
    trigger,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
    // setError,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      doctor: null,
      doctor_id: null,
      ward_desc: "",
      ward_short_name: "",
      ward_type: null,
    },
  });

  const getClinicalDoctors = async () => {
    const { response, error } = await algaehAxios(
      "/frontDesk/getDoctorAndDepartment",
      {
        module: "frontDesk",
        method: "GET",
      }
    );

    debugger;
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      setDoctorData(response.data.records);
    }
  };

  const PatientSearch = () => {
    AlgaehSearch({
      //@ts-ignore
      searchName: "patients",
      columns: props.props.getsportlightSearch("frontDesk")?.patients ?? [],
      placeHolder: "Patient Code",
      onRowSelect: (row: any) => {
        setSavedPatient(row);
        getPatientInsurance({
          patient_id: row.hims_d_patient_id,
          // entry_type: entry_type,
        })
          .then((result) => {
            setInsuranceList(result);
          })
          .catch((e) => {
            AlgaehMessagePop({
              display: e,
              type: "error",
            });
          });
      },
    });
  };

  const NewPatientAdmission = async (data: any) => {
    debugger;
    const { error, response } = await algaehAxios(
      "/patAdmission/addPatienAdmission",
      {
        module: "admission",
        method: "POST",
        data: { ...data },
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }

    if (response.data.success) {
      return response.data.records;
    }
  };

  const getBillDetails = async (serviceInput: any) => {
    debugger;
    const { error, response } = await algaehAxios("/billing/getBillDetails", {
      module: "billing",
      method: "POST",
      data: serviceInput,
    });
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }

    if (response.data.success) {
      return response.data.records;
    }
  };

  const AdmitPatient = async (data: any) => {
    debugger;
    if (!savedPatient?.full_name || !savedPatient?.patient_code) {
      AlgaehMessagePop({
        display: "Select Patient  first",
        type: "error",
      });
      return;
    }
    if (
      !selectedBedData?.hims_adm_ward_header_id ||
      !selectedBedData?.bed_id ||
      !selectedBedData?.bed_no
    ) {
      AlgaehMessagePop({
        display: "Select  Bed first",
        type: "error",
      });
      return;
    }
    let serviceInput = [
      {
        insured: isInsurance === true ? "Y" : "N",
        vat_applicable: "Y",
        hims_d_services_id: selectedBedData.services_id,
        primary_insurance_provider_id: insuranceInfo
          ? insuranceInfo?.primary_insurance_provider_id
          : null,
        primary_network_office_id: insuranceInfo
          ? insuranceInfo?.primary_network_office_id
          : null,
        primary_network_id: insuranceInfo
          ? insuranceInfo?.primary_network_id
          : null,
      },
    ];
    getBillDetails(serviceInput).then((result) => {
      let data = {
        admission_type: "D",
        patient_id: savedPatient.hims_d_patient_id,
        date_of_birth: savedPatient.date_of_birth,
        ward_id: selectedBedData.hims_adm_ward_header_id,
        bed_id: selectedBedData.bed_id,
        bed_no: selectedBedData.bed_no,
        sub_department_id: sub_department_id,
        provider_id: doctor_id,
        hims_adm_ward_detail_id: selectedBedData.hims_adm_ward_detail_id,
        insurance_provider_id: insuranceInfo
          ? insuranceInfo.primary_insurance_provider_id
          : null,
        insurance_sub_id: insuranceInfo ? insuranceInfo.primary_sub_id : null,
        network_id: insuranceInfo ? insuranceInfo.primary_network_id : null,
        insurance_network_office_id: insuranceInfo
          ? insuranceInfo.primary_network_office_id
          : null,
        policy_number: insuranceInfo ? insuranceInfo.primary_policy_num : null,
        insurance_yesno: isInsurance === true ? "Y" : "N",
        bed_details: result.billdetails[0],
      };
      NewPatientAdmission(data).then((result) => {
        debugger;
        setAdmissionNumber(result?.admission_number);
        setDisableAfterAdmission(true);
        AlgaehMessagePop({
          display: "Admitted Succesfully...",
          type: "success",
        });
      });
    });
  };

  useEffect(() => {
    getClinicalDoctors();
    // const c = props.appContext();
    // console.log("mainCtx====>", c);
  }, []);

  return (
    <div className="PatientAdmissionScreen">
      <form>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{
                forceLabel: "Patient Admission",
                align: "ltr",
              }}
            />
          }
          spotlightSearch={{
            searchName: "admission",
            placeHolder: "Admission Number",
            label: <AlgaehLabel label={{ forceLabel: "Admission Number" }} />,
            columns:
              props.props.getsportlightSearch("patientAdmission")?.admission ??
              [],
            value: admission_number,
            events: {
              onClick: (cb: Function) => {
                //If any logic need to call before open
                cb();
              },
              onRowSelect: (row: any) => {
                //Use the selected data

                getAdmissionDetails(row).then((result) => {
                  const doctor = `${result?.sub_department_id}-${result?.provider_id}`;
                  setAdmissionNumber(result?.admission_number);
                  setSavedPatient({
                    patient_code: result?.["PAT.patient_code"],
                    full_name: result?.["PAT.full_name"],
                  });

                  setSelectedBedData({
                    bed_desc: result?.["BED.bed_desc"],
                    ward_desc: result?.["WARD.ward_desc"],
                    bed_no: result?.bed_no,
                  });

                  setInsuranceInfo({
                    primary_insurance_provider_id:
                      result?.insurance_provider_id,
                    primary_sub_id: result?.insurance_sub_id,
                    primary_network_id: result?.network_id,
                    primary_policy_num: result?.policy_number,
                    primary_network_office_id:
                      result?.insurance_network_office_id,
                  });
                  setServiceInfo(doctor);
                  setValue("doctor", doctor);
                  setDisableData(true);
                  debugger;
                  if (result?.insurance_yesno === "Y") {
                    getInsuranceProviders()
                      .then((result) => {
                        setInsuranceList(result);
                        // const [insurance_data] = result?.filter(
                        //   (item: any) =>
                        //     item.insurance_provider_id ===
                        //     result?.insurance_provider_id
                        // );

                        setIsInsurance(true);
                      })
                      .catch((e) => {
                        AlgaehMessagePop({
                          display: e,
                          type: "error",
                        });
                      });
                  } else {
                    setInsuranceList([]);
                    setIsInsurance(false);
                  }

                  AlgaehMessagePop({
                    display: "Admitted Succesfully...",
                    type: "success",
                  });
                });
                // alert(JSON.stringify(row));
              },
            },
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Admission Date",
                  }}
                />
                <h6>{moment(new Date()).format("DD-MM-YYYY")}</h6>
              </div>
            </div>
          }
        />

        <div
          className="row inner-top-search"
          style={{ marginTop: 77, paddingBottom: 10 }}
        >
          {/* Patient code */}

          {/* <div className="col-5">
          <label>Load By</label>
          <div className="customRadio">
            <label className="radio inline">
              <input
                type="radio"
                value="C"
                name="rcmMode"
                checked={admission_type === "C" ? true : false}
                onChange={() => {
                  setAdmissionType("D");
                }}
              />
              <span>Day Care</span>
            </label>

            <label className="radio inline">
              <input
                type="radio"
                value="S"
                name="rcmMode"
                checked={admission_type === "I" ? true : false}
                onChange={() => {
                  setAdmissionType("I");
                }}
              />
              <span>IP</span>
            </label>            
          </div>
        </div> */}
          <div
            className="col-2 globalSearchCntr"
            style={{
              cursor: "pointer",
              // pointerEvents: disable_data === true ? "none" : "",
            }}
          >
            <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
            <h6 onClick={PatientSearch}>
              {savedPatient ? (
                savedPatient.patient_code
              ) : (
                <AlgaehLabel label={{ fieldName: "patient_code" }} />
              )}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>

          <div className="col-10">
            <div className="row">
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    fieldName: "full_name",
                  }}
                />
                <h6>{savedPatient ? savedPatient.full_name : "--------"}</h6>
              </div>

              {/* onClick={} */}

              <Controller
                control={control}
                name="doctor"
                rules={{ required: "Please Select a doctor" }}
                render={({ onChange, value }) => (
                  <AlgaehTreeSearch
                    div={{ className: "col mandatory" }}
                    label={{
                      fieldName: "doctor_id",
                      isImp: true,
                      align: "ltr",
                    }}
                    error={errors}
                    tree={{
                      disableHeader: true,
                      treeDefaultExpandAll: true,
                      onChange: (selected: any) => {
                        if (selected) {
                          setServiceInfo(selected);
                        } else {
                          setServiceInfo(null);
                        }
                        onChange(selected);
                      },
                      disabled: disable_data,
                      value,
                      name: "doctor",
                      data: doctor_data,
                      textField: "label",
                      valueField: (node: any) => {
                        if (node?.sub_department_id) {
                          return `${node?.sub_department_id}-${node?.value}`;
                        } else {
                          return node?.value;
                        }
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <InsuranceDetails
          props={props.props}
          Insurance_field={
            props.props.getsportlightSearch("Insurance")?.Insurance_field
          }
          insurance_list={insurance_list}
          setInsuranceList={setInsuranceList}
          isInsurance={isInsurance}
          setIsInsurance={setIsInsurance}
          control={control}
          trigger={trigger}
          errors={errors}
          clearErrors={clearErrors}
          setValue={setValue}
          disable_data={disable_data}
        />
        <BedDetails useState={useState} />

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col">
              {/* <button
                type="submit"
                className="btn btn-primary"
                disabled={disable_data}
              >
                <AlgaehLabel label={{ forceLabel: "Admit Patient" }} />
              </button> */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.persist();
                  e.preventDefault();
                  trigger().then(() => {
                    if (Object.keys(errors).length) {
                      AlgaehMessagePop({
                        type: "Warning",
                        display: "Please fill all the mandatory field.",
                      });
                      return null;
                    }
                    handleSubmit(AdmitPatient)(e);
                  });
                }}
                disabled={disable_data || disableAfterAdmission}
              >
                <AlgaehLabel label={{ forceLabel: "Admit Patient" }} />
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => {
                  clearState();
                  setAdmissionNumber(null);
                  // setSavedPatient({});
                  // setInsuranceInfo({});
                  // setSelectedBedData({});
                  setInsuranceList([]);
                  setIsInsurance(false);
                  setServiceInfo(null);
                  setDisableData(false);
                  reset({});
                }}
              >
                <AlgaehLabel label={{ fieldName: "btn_clear" }} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
