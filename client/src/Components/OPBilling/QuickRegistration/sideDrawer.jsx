import React, { memo, useState, useContext, useEffect } from "react";
import { Button, Drawer, Badge, Skeleton } from "antd";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  MainContext,
  AlgaehLabel,
} from "algaeh-react-components";
import "../OPBilling.scss";
import {
  /*nationality,*/ getPatientDetails,
  getDefaults,
  updatePatient,
  addPatient,
} from "./services";
export default memo(function SideDrawer(props) {
  const { titles, nationalities } = useContext(MainContext);
  const [reference_no, setReferenceNo] = useState("");
  const [patient_code, setPatientCode] = useState("");
  const [date_of_birth, setDOB] = useState("");
  const [patient_full_name, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [identity_type, setIdentityType] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [nationality_id, setNationality] = useState("");
  const [patient_id, setPatientID] = useState("");
  const [patient_identity, setPatientIdentity] = useState("");
  const [patient_passport_no, setPatientPassportNo] = useState("");
  const [email_id, setEmailID] = useState("");
  const [visit_date, setVisitDate] = useState("");
  const [nationality_name, setNationalityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultsData, setDefaultData] = useState({});
  const [loadingProceed, setLoadingProceed] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const dtls = await getDefaults();
        setDefaultData(dtls);
      } catch (e) {
        console.error("Error====>", e);
      }
    })();
  }, []);
  async function findDetails() {
    try {
      setLoading(true);
      const details = await getPatientDetails({ reference_no }).catch((err) => {
        throw err;
      });
      const { patient, patient_visit_date } = details;
      setPatientCode(patient.patient_code);
      setDOB(patient.date_of_birth);
      setFullName(
        `${patient.first_name} ${patient.middle_name ?? ""} ${
          patient.last_name ?? ""
        }`
      );
      setGender(patient.gender);
      setIdentityType(patient.identity_type);
      setMobileNo(patient.mobile_no);
      setNationality(patient.nationality_id);
      setPatientID(patient.patient_id);
      setPatientIdentity(patient.patient_identity);
      setPatientPassportNo(patient.patient_passport_no);
      setVisitDate(patient_visit_date);
      setEmailID(patient.email_id);
      setNationalityName(
        nationalities.find(
          (f) => f.hims_d_nationality_id === patient.nationality_id
        )?.nationality
      );
    } catch (e) {
      console.error(e);
      //   AlgaehMessagePop({ type: "error", display: e });
    } finally {
      setLoading(false);
    }
  }
  async function onClickProceed() {
    try {
      setLoadingProceed(true);
      if (!reference_no || reference_no === "") {
      }

      const tel_code = "+" + mobile_no.substring(0, 3);
      const contact_number = mobile_no.substring(3, 12);
      const commonData = {
        visit_type: defaultsData?.hims_d_visit_type_id,
        data_of_birth: date_of_birth,
        date_of_birth,
        insured: "N",
        from_package: false,
        service_name: "service_name",
        department_id: defaultsData?.department_id,
        sub_department_id: defaultsData?.hims_d_sub_department_id,
        doctor_id: defaultsData?.hims_d_employee_id,
        consultation: "N",
        maternity_patient: "N",
        is_mlc: "N",
        existing_plan: "N",
        incharge_or_provider: defaultsData?.hims_d_employee_id,
        ScreenCode: "BL0001",
        tel_code,
        contact_number,
        receiptdetails: [
          {
            amount: 0,
            card_check_number: null,
            card_type: null,
            expiry_date: null,
            hims_f_receipt_header_id: null,
            pay_type: "CA",
            updated_date: null,
          },
        ],
      };
      let pat_code = "";
      if (patient_id && patient_id !== "") {
        const result = await updatePatient({
          patient_code,
          hims_d_patient_id: patient_id,
          hims_f_patient_id: patient_id,
          patient_id,
          patient_type: defaultsData?.default_patient_type,
          country_id: defaultsData?.default_country,
          nationality_id: nationality_id,
          primary_identity_id: identity_type,
          primary_id_no: patient_identity,
          secondary_identity_id: defaultsData?.default_secondary_id_quick_req,
          secondary_id_no: patient_passport_no,
          ...commonData,
        }).catch((e) => {
          throw e;
        });
        pat_code = result.patient_code;
      } else {
        const title_id =
          gender.toLowerCase() === "male"
            ? titles.find((f) => f.title.toLowerCase() === "mr")?.his_d_title_id
            : titles.find((f) => f.title.toLowerCase() === "ms")
                ?.his_d_title_id;
        const result = await addPatient({
          full_name: patient_full_name,
          arabic_name: patient_full_name,
          gender,
          title_id,
          primary_identity_id: identity_type,
          primary_id_no: patient_identity,
          secondary_identity_id: defaultsData?.default_secondary_id_quick_req,
          secondary_id_no: patient_passport_no,
          ...commonData,
        }).catch((e) => {
          throw e;
        });
        pat_code = result.patient_code;
      }

      if (typeof props.onComplete === "function") {
        props.onComplete({
          patient_code: pat_code,
        });
      }
      onClearState();
    } catch (e) {
      console.error("Error====>", e);
    } finally {
      setLoadingProceed(false);
    }
  }
  function onClearState() {
    setReferenceNo("");
    setPatientCode("");
    setDOB("");
    setFullName("");
    setGender("");
    setIdentityType("");
    setMobileNo("");
    setNationality("");
    setPatientID("");
    setPatientIdentity("");
    setPatientPassportNo("");
    setEmailID("");
    setVisitDate("");
    setNationalityName("");
  }
  return (
    <Drawer
      width={640}
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
      className="quickRegDrawer"
    >
      <div className="row">
        <AlgaehFormGroup
          div={{ className: "col-6" }}
          label={{
            forceLabel: "Reference File Number",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "reference_no",
            value: reference_no,
            onChange: (e) => {
              setReferenceNo(e.target.value);
            },
          }}
        />
        <Button
          className="btn btn-default btn-small"
          style={{ marginTop: 21 }}
          type="button"
          size="middle"
          onClick={findDetails}
          loading={loading}
        >
          Search
        </Button>
      </div>
      {loading === true ? (
        <Skeleton />
      ) : (
        <Badge.Ribbon
          text={
            patient_id && patient_id !== "" ? "Existing Patient" : "New Patient"
          }
          placement="start"
          color={patient_id && patient_id !== "" ? "teal" : "orange"}
        >
          <div className="quickRegFormCntr">
            <div className="row ">
              <div className="col-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Registerd Date",
                  }}
                />
                <h6>{visit_date ? visit_date : "------"}</h6>
              </div>
              <div className="col-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Nationality",
                  }}
                />
                <h6>{nationality_name ? nationality_name : "------"}</h6>
              </div>
              {/* <div className="col-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Nationality",
                  }}
                />
                <h6>{nationality_name ? nationality_name : "------"}</h6>
              </div> */}

              <AlgaehFormGroup
                div={{ className: "col-4 form-group mandatory" }}
                label={{
                  forceLabel: "Patient Code",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_code",
                  value: patient_code,
                  disabled: true,
                  "data-patId": patient_id,
                  "data-identity_type": identity_type,
                  "data-nationality_id": nationality_id,
                }}
              />

              <AlgaehFormGroup
                div={{ className: "col-12 form-group mandatory" }}
                label={{
                  forceLabel: "Full Name",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_full_name",
                  value: patient_full_name,
                  onChange: (e) => {
                    setFullName(e.target.value);
                  },
                }}
              />

              <AlgaehAutoComplete
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Gender",
                  isImp: true,
                }}
                selector={{
                  name: "gender",
                  className: "select-fld",
                  onChange: (_, selected) => {
                    setGender(selected);
                  },
                  value: gender,
                  onClear: () => setGender(""),
                  dataSource: {
                    textField: "text",
                    valueField: "value",
                    data: [
                      { text: "Male", value: "Male" },
                      { text: "Female", value: "Female" },
                      { text: "Trans", value: "Trans" },
                    ],
                  },
                }}
              />
              <AlgaehDateHandler
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Date Of Birth",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "date_of_birth",
                  value: date_of_birth,
                }}
                maxDate={new Date()}
                events={{
                  onChange: (mDate) => {
                    setDOB(mDate);
                  },
                  onClear: () => {
                    setDOB("");
                  },
                }}
              />
              <hr />

              <AlgaehFormGroup
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Primary Identity",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_identity",
                  value: patient_identity,
                  onChange: (e) => {
                    setPatientIdentity(e.target.value);
                  },
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Passport",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_passport_no",
                  value: patient_passport_no,
                  onChange: (e) => {
                    setPatientPassportNo(e.target.value);
                  },
                }}
              />

              <AlgaehFormGroup
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Mobile Number",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "mobile_no",
                  disabled: true,
                  value: mobile_no,
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Email ID",
                }}
                textBox={{
                  className: "txt-fld",
                  name: "email_id",
                  value: email_id,
                  onChange: (e) => {
                    setEmailID(e.target.value);
                  },
                }}
              />
              <div className="col-12">
                <div className="alert alert-warning" role="alert">
                  Note:- Please Validate all data before continue{" "}
                  <b>Create visit</b>. As this data will come in Lab Reports
                </div>
              </div>

              {/* <AlgaehLabel
                label={{
                  forceLabel: `Nationality : ${nationality_name}`,
                  className: "col-6",
                }}
              /> */}
            </div>
          </div>
          <div className="row">
            <div
              className="col-12"
              style={{ textAlign: "right", paddingTop: 15 }}
            >
              <Button
                style={{ marginRight: 8 }}
                className="btn btn-default btn-xl"
                type="button"
                // onClick={onClickProceed}
                // loading={loadingProceed}
              >
                Close
              </Button>
              <Button
                className="btn btn-primary btn-xl"
                type="button"
                onClick={onClickProceed}
                loading={loadingProceed}
              >
                Create Visit
              </Button>
            </div>
          </div>
        </Badge.Ribbon>
      )}
    </Drawer>
  );
});
