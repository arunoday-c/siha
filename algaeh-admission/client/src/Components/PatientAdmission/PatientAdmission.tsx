import { useState, useEffect, useRef, useContext } from "react";
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

// import BedManagement from "../BedManagement";
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

export default function PatientAdmission(props: any) {
  const [insurance_list, setInsuranceList] = useState<Array<any>>([]);
  const [patient_details, setPatientDetails] = useState<any>({});
  const [doctor_data, setDoctorData] = useState<Array<any>>([]);

  //   const [sub_department_id, setSubDepartment] = useState<any>(undefined);
  //   const [doctor_id, setDoctor] = useState<any>(undefined);
  const [isInsurance, setIsInsurance] = useState(false);
  const insuranceImgFront = useRef(null);
  const insuranceImgBack = useRef(null);
  const {
    selectedBedData,
    insuranceInfo,
    setServiceInfo,
    sub_department_id,
    doctor_id,
  } = useContext(PatAdmissionContext);

  //   const [global_state, setGlobalState] = useState<any>({});
  //   const [patient_code, setPatientCode] = useState<any>(undefined);

  const {
    control,
    errors,
    trigger,
    setValue,
    clearErrors,
    // reset,
    // handleSubmit,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
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
        setPatientDetails(row);
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

  const AdmitPatient = async () => {
    debugger;
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
        patient_id: patient_details.hims_d_patient_id,
        ward_id: selectedBedData.hims_adm_ward_header_id,
        bed_id: selectedBedData.bed_no,
        sub_department_id: sub_department_id,
        provider_id: doctor_id,
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
        AlgaehMessagePop({
          display: "Admitted Succesfully...",
          type: "success",
        });
      });
    });
  };

  useEffect(() => {
    getClinicalDoctors();
    //
    // const c = props.appContext();
    // console.log("mainCtx====>", c);
  }, []);

  return (
    <div className="PatientAdmissionScreen">
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
          searchName: "patients",
          placeHolder: "Patient Code",
          label: <AlgaehLabel label={{ forceLabel: "Admission Number" }} />,
          columns: [
            { fieldName: "patient_code", label: "Patient Code" },
            { fieldName: "full_name", label: "Patient Name" },
            { fieldName: "arabic_name", label: "Arabic Name" },
            { fieldName: "contact_number", label: "Contact Number" },
          ],
          events: {
            onClick: (cb: Function) => {
              //If any logic need to call before open
              cb();
            },
            onRowSelect: (row: any) => {
              //Use the selected data
              alert(JSON.stringify(row));
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
              <h6>02-03-2025</h6>
            </div>
          </div>
        }
      />
      {/* <BreadCrumb
        title={
          <AlgaehLabel
            label={{ forceLabel: "Patient Admission", align: "ltr" }}
          />
        }
       
        soptlightSearch={{
          label: <AlgaehLabel label={{ forceLabel: "Admission Number" }} />,
          value: "",
          selectValue: "pos_number",
          events: {
         
          },
          jsonFile: {
            fileName: "spotlightSearch",
            fieldName: "pointofsaleEntry.POSEntry",
          },
          searchName: "POSEntry",
        }}
        userArea={
          <div className="row">
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Admission Date",
                }}
              />
              <h6>02-03-2025</h6>
            </div>
          </div>
        }
        printArea={{
          menuitems: [
            {
              label: "Print Report",
              events: {
                onClick: () => {
               
                },
              },
            },
          ],
        }}
      
      /> */}

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
            // pointerEvents:
            //   this.state.Billexists === true
            //     ? "none"
            //     : this.state.patient_code
            //     ? "none"
            //     : "",
          }}
        >
          <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
          <h6 onClick={PatientSearch}>
            {patient_details ? (
              patient_details.patient_code
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
              <h6>
                {patient_details ? patient_details.full_name : "--------"}
              </h6>
            </div>

            {/* <div className="col-2">
              <AlgaehLabel
                label={{
                  fieldName: "patient_type",
                }}
              />
              <h6>
                {patient_details ? patient_details.patient_type : "--------"}
              </h6>
            </div> */}
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
                    value,
                    name: "doctor",
                    data: doctor_data,
                    textField: "label",
                    valueField: (node: any) => {
                      if (node?.sub_department_id) {
                        return `${node?.sub_department_id}-${node?.services_id}-${node?.value}-${node?.department_type}-${node?.department_id}-${node?.service_type_id}`;
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
        isInsurance={isInsurance}
        setIsInsurance={setIsInsurance}
        control={control}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        setValue={setValue}
        insuranceImgFront={insuranceImgFront}
        insuranceImgBack={insuranceImgBack}
      />
      <BedDetails useState={useState} />

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={AdmitPatient}
            >
              <AlgaehLabel label={{ forceLabel: "Admit Patient" }} />
            </button>
            {/* <button
              type="button"
              className="btn btn-default"
              onClick={() => onClear(false)}
              disabled={
                !disabled &&
                !appointment_id &&
                !patient_code &&
                !formState.isDirty
              }
            >
              <AlgaehLabel
                label={{ fieldName: "btn_clear", returnText: true }}
              />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
