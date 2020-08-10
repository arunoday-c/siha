import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { FProvider } from "./FrontdeskContext";
import {
  MainContext,
  AlgaehLabel,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { useQueryParams, newAlgaehApi } from "../../hooks";
import { Demographics } from "./Demographics";
import { InsuranceDetails } from "./InsuranceDetails";
import { VisitDetails } from "./VisitDetail";
import { BillDetails } from "./BillDetails";

const getPatient = async (key, { patient_code }) => {
  const result = await newAlgaehApi({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    data: { patient_code },
  });
  return result?.data?.records;
};

export function PatientRegistration() {
  const location = useLocation();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    reset,
    formState,
    clearErrors,
  } = useForm({
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });
  const { userLanguage, userToken } = useContext(MainContext);
  const isEmpIdRequired = userToken?.requied_emp_id === "Y";
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");
  console.log(formState, "form");
  // const appointment_id = queryParams.get("appointment_id");

  const { isLoading, data: patientData } = useQuery(
    ["patient", { patient_code }],
    getPatient,
    {
      enabled: !!patient_code,
      refetchOnWindowFocus: false,
      initialData: {
        bill_criedt: [],
        patientRegistration: null,
        identities: [],
      },
      retry: 0,
      initialStale: true,
      onSuccess: (data) => {
        if (data?.patientRegistration) {
          reset(data?.patientRegistration);
        }
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
        history.push(location.pathname);
      },
    }
  );

  const savePatient = (e) => {
    console.log(e);
  };
  const onSubmit = (input) => savePatient(input);

  return (
    <Spin spinning={isLoading}>
      <FProvider>
        <div id="attach">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ fieldName: "form_patregister", align: "ltr" }}
              />
            }
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ fieldName: "patient_code", returnText: true }}
                />
              ),
              value: patient_code,
              selectValue: "patient_code",
              events: {
                onChange: (code) =>
                  history.push(`${location.pathname}?patient_code=${code}`),
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: isEmpIdRequired
                  ? "frontDesk.emp_id_patients"
                  : "frontDesk.patients",
              },
              searchName: "patients",
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "registered_date",
                    }}
                  />
                  <h6>{moment().format("DD-MM-YYYY")}</h6>
                </div>
              </div>
            }
            editData={{
              events: {
                onClick: () => {},
              },
            }}
            printArea={
              patient_code
                ? {
                    menuitems: [
                      {
                        label: "ID Card",
                        events: {
                          onClick: () => {},
                        },
                      },
                      {
                        label: "Advance/Refund Receipt",
                        events: {
                          onClick: () => {},
                        },
                      },
                    ],
                  }
                : ""
            }
            selectedLang={userLanguage}
          />
          <div className="spacing-push">
            <form>
              <div className="row">
                <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                  <Demographics
                    control={control}
                    setValue={setValue}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                  <InsuranceDetails
                    control={control}
                    trigger={trigger}
                    errors={errors}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                  <VisitDetails
                    control={control}
                    trigger={trigger}
                    setValue={setValue}
                    visits={patientData?.visitDetails}
                  />
                </div>
                <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                  <BillDetails
                    control={control}
                    trigger={trigger}
                    setValue={setValue}
                    patient={patientData?.patientRegistration}
                  />
                </div>
              </div>
              <div className="hptl-phase1-footer">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit(onSubmit)}
                      // onClick={() => trigger()}
                      // disabled={!formState?.isValid}
                    >
                      <AlgaehLabel
                        label={{ fieldName: "btn_save", returnText: true }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </FProvider>
    </Spin>
  );
}
