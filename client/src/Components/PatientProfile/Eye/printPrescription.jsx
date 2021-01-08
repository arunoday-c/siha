import React, { useState } from "react";
import { AlgaehButton } from "algaeh-react-components";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function PrintGlassPrescription({
  patient_id,
  visit_id,
  provider_id,
}) {
  const [loading, setLoading] = useState(false);
  function onClickHandler() {
    setLoading(true);
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
          reportName: "glassPrescription",
          reportParams: [
            {
              name: "patient_id",
              value: Window.global["current_patient"],
            },
            {
              name: "visit_id",
              value: Window.global["visit_id"],
            },
            {
              name: "provider_id",
              value: Window.global["provider_id"],
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        setLoading(false);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Prescription`;
        window.open(origin);
        // window.document.title = "";
      },
      onCatch: (e) => {
        setLoading(false);
        console.error(e);
      },
    });
  }
  return (
    <AlgaehButton loading={loading} onClick={onClickHandler}>
      Print
    </AlgaehButton>
  );
}
