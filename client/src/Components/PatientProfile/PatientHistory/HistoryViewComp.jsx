import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks/";
// import { AlgaehMessagePop } from "algaeh-react-components";
import { swalMessage } from "../../../utils/algaehApiCall";

export default function HistoryViewComp({ data, remarks }) {
  const [editable, setEditable] = useState(true);
  // const [historyData, setHistoryData] = useState([]);
  const { register, errors, handleSubmit } = useForm({
    defaultValues: { historyRemarks: remarks },
  });

  const updateHistory = (e) => {
    newAlgaehApi({
      uri: "/doctorsWorkBench/updatePatientHistory",
      method: "PUT",

      data: {
        remarks: e.historyRemarks,
        hims_f_patient_history_id: data.hims_f_patient_history_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          swalMessage({
            title: "Successfully Updated.....",
            type: "success",
          });
          setEditable((pre) => !pre);
        }
      })
      .catch((e) => {
        swalMessage({
          type: "error",
          title: e.message,
        });
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(updateHistory)}>
        {editable ? (
          <i
            // key={index}

            className="fas fa-pen"
            onClick={() => {
              setEditable(false);
              // setHistoryData(data);
            }}
          ></i>
        ) : (
          <button
            type="submit"
            className="fas fa-save"
            style={{ marginTop: 18 }}
          />
        )}
        <textarea
          name="historyRemarks"
          ref={register({ required: true })}
          // value={data.remarks}
          // onChange={(e) => setSms(e.target.value)}
          // name="sms_template"
          disabled={editable}
          maxLength={160}
        />
        {errors.historyRemarks && <p> Required Field</p>}
      </form>
    </div>
  );
}
