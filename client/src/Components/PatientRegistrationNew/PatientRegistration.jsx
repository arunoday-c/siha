import React, { useContext } from "react";
// import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { MainContext, AlgaehLabel } from "algaeh-react-components";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { useQueryParams } from "../../hooks";
import { Demographics } from "./Demographics";
import { InsuranceDetails } from "./InsuranceDetails";
import { VisitDetails } from "./VisitDetail";
import { BillDetails } from "./BillDetails";

export function PatientRegistration() {
  const location = useLocation();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    clearErrors,
  } = useForm({
    reValidateMode: "onChange",
    shouldFocusError: true,
    criteriaMode: "",
  });
  const { userLanguage, userToken } = useContext(MainContext);
  const isEmpIdRequired = userToken?.requied_emp_id === "Y";
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");

  const onSubmit = (input) => console.log(input, "input");
  console.log(errors, "errors");

  return (
    <div id="attach">
      <BreadCrumb
        title={
          <AlgaehLabel
            label={{ fieldName: "form_patregister", align: "ltr" }}
          />
        }
        // pageNavPath={[
        //   {
        //     pageName: (
        //       <AlgaehLabel
        //         label={{
        //           fieldName: "form_home",
        //           align: "ltr",
        //         }}
        //       />
        //     ),
        //   },
        //   {
        //     pageName: (
        //       <AlgaehLabel
        //         label={{ fieldName: "form_patregister", align: "ltr" }}
        //       />
        //     ),
        //   },
        // ]}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
              <Demographics
                control={control}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
              />
              <InsuranceDetails control={control} trigger={trigger} />
              <VisitDetails control={control} trigger={trigger} />
            </div>
            <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
              <BillDetails control={control} trigger={trigger} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
