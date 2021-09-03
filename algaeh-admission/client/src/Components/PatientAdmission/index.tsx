import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import "./PatientAdmission.scss";
// import BreadCrumb from "../BreadCrumb/BreadCrumb.js";
import {
  AlgaehLabel,
  algaehAxios,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  // MainContext,
} from "algaeh-react-components";
import BreadCrumb from "Components/BreadCrumb";
import InsuranceDetails from "./insuranceDetails";
import BedDetails from "./bedDetails";
// import BedManagement from "../BedManagement";

export default function PatientAdmission(props: any) {
  const [admission_type, setAdmissionType] = useState<any>("D");
  const [patient_details, setPatientDetails] = useState<any>({});
  const [doctor_data, setDoctorData] = useState<Array<any>>([]);

  const [sub_department_id, setSubDepartment] = useState<any>(undefined);
  const [doctor_id, setDoctor] = useState<any>(undefined);
  const [service_info, setServiceInfo] = useState<any>(undefined);
  const [isInsurance, setIsInsurance] = useState(false);
  const insuranceImgFront = useRef(null);
  const insuranceImgBack = useRef(null);

  const {
    control,
    errors,
    trigger,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
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

  useEffect(() => {
    getClinicalDoctors();
    // debugger;
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
          <h6>
            {/* onClick={PatientSearch.bind(this, this, context)} */}
            {/* {this.state.patient_code ? (
                      this.state.patient_code
                    ) : ( */}
            <AlgaehLabel label={{ fieldName: "patient_code" }} />
            {/* )} */}
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
                {patient_details ? patient_details.patient_name : "--------"}
              </h6>
            </div>

            <div className="col-2">
              <AlgaehLabel
                label={{
                  fieldName: "patient_type",
                }}
              />
              <h6>
                {patient_details ? patient_details.patient_type : "--------"}
              </h6>
            </div>
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
    </div>
  );
}
