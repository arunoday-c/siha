import moment from "moment";
import React, { useEffect, useState } from "react";
import { AlgaehLabel, AlgaehDataGrid } from "algaeh-react-components";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

function ReferralDataGrid({ patient_id, changed, setState }) {
  const [referralData, setReferralData] = useState([]);
  useEffect(() => {
    getPatientReferralDoc();
  }, []);
  useEffect(() => {
    getPatientReferralDoc();
  }, [changed === true]);
  const getPatientReferralDoc = () => {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientReferralDoc",
      data: { patient_id: patient_id },
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          setReferralData(response.data.records);
          return;
        }
      },
      onFailure: (error) => {
        successfulMessage({
          message: error.message,
          title: "Error",
          icon: "error",
        });
      },
    });
  };
  const printReferral = (row) => {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "doctorReferralReport",
          reportParams: [
            {
              name: "hims_f_patient_referral_id",
              value: row.hims_f_patient_referral_id,
            },
            {
              name: "patient_id",
              value: row.patient_id,
            },
            {
              name: "episode_id",
              value: row.episode_id,
            },
            {
              name: "visit_id",
              value: row.visit_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        // const documentName="Salary Slip"
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Doctor Referral Letter`;
        window.open(origin);
      },
    });
  };
  return (
    <div>
      <AlgaehDataGrid
        columns={[
          {
            fieldName: "actions",
            label: <AlgaehLabel label={{ fieldName: "Action" }} />,
            displayTemplate: (row) => {
              return (
                <>
                  <i
                    className="fas fa-pen"
                    onClick={() => {
                      debugger;
                      setState({
                        sub_department_id: row.sub_department_id,
                        doctor_id: row.doctor_id,
                        hospital_name: row.hospital_name,
                        doctor_department: row.doctor_name,
                        reason: row.reason,
                        hims_f_patient_referral_id:
                          row.hims_f_patient_referral_id,
                        referral_type: row.referral_type,
                        radio: row.referral_type === "I" ? true : false,
                        external_doc_name: row.external_doc_name,
                      });
                    }}
                  ></i>
                  <i
                    className="fas fa-print"
                    onClick={() => printReferral(row)}
                  ></i>
                </>
              );
            },
            others: {
              width: 50,
              style: { textAlign: "center" },
            },
            sortable: false,
          },
          {
            fieldName: "referral_type_text",
            label: <AlgaehLabel label={{ fieldName: "Referral Type" }} />,
            others: {
              width: 50,
              style: { textAlign: "center" },
            },
            sortable: false,
          },
          {
            fieldName: "doctor_name",
            label: <AlgaehLabel label={{ fieldName: "Doctor Name" }} />,
            others: {
              Width: 150,
              style: { textAlign: "center" },
            },
            sortable: false,
          },
          {
            fieldName: "hospital_name",
            label: <AlgaehLabel label={{ fieldName: "Hospital Name" }} />,
            others: {
              width: 50,
              style: { textAlign: "center" },
            },
            sortable: false,
          },
          {
            fieldName: "reason",
            label: <AlgaehLabel label={{ fieldName: "Reason" }} />,
            others: {
              style: { textAlign: "center" },
            },
            sortable: false,
          },
          {
            fieldName: "created_date",
            label: <AlgaehLabel label={{ fieldName: "Referred Date" }} />,
            others: {
              width: 50,
              style: { textAlign: "center" },
            },
            displayTemplate: (row) => {
              return (
                <span>{moment(row.created_date).format("DD-MM-YYYY")}</span>
              );
            },
            sortable: false,
          },
        ]}
        // loading={false}
        data={referralData}
        rowUnique=""
        pagination={true}
        isFilterable={true}
      />
    </div>
  );
}

export default ReferralDataGrid;
