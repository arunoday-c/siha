import React, { memo, useState } from "react";
import { Button, Drawer, Badge, Divider, Skeleton } from "antd";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { /*nationality,*/ getPatientDetails } from "./services";
export default memo(function SideDrawer(props) {
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
  const [loading, setLoading] = useState(false);
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
    } catch (e) {
      console.error(e);
      //   AlgaehMessagePop({ type: "error", display: e });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Drawer
      width={640}
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
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
          type="primary"
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
          <div style={{ marginTop: 10 }}>
            <Divider />
            <br />
            <label>{visit_date}</label>
            <div className="row">
              <AlgaehFormGroup
                div={{ className: "col-12" }}
                label={{
                  forceLabel: "Patient Full Name",
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
            </div>
            <div className="row">
              <AlgaehFormGroup
                div={{ className: "col-6" }}
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
                div={{ className: "col-6" }}
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
            </div>
            <div className="row">
              <AlgaehFormGroup
                div={{ className: "col-6" }}
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
                div={{ className: "col-6" }}
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
            </div>
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-6" }}
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
                div={{ className: "col-6" }}
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
            </div>
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-6" }}
                label={{
                  forceLabel: "Identity Type",
                  isImp: true,
                }}
                selector={{
                  name: "gender",
                  className: "select-fld",
                  onChange: (_, selected) => setGender(selected),
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
              <AlgaehFormGroup
                div={{ className: "col-6" }}
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
            </div>
          </div>
          <br /> <Button type="primary"> Create Visit </Button>
        </Badge.Ribbon>
      )}
    </Drawer>
  );
});
