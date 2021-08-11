import React from "react";
import { useHistory } from "react-router-dom";
import "./PatientRecall.scss";

const Column = ({ data }) => {
  const history = useHistory();
  return (
    <div className="card">
      <h2>{data.date}</h2>

      <div className="slotsDiv">
        {data.patients.map((item) => (
          <div
            className="eachSlot"
            style={{ backgroundColor: item.color_code }}
          >
            <h3>{item.pat_name}</h3>
            <small>{item.patient_code}</small>/
            <small>{item.contact_number}</small>
            <br />
            {/* <span className="badge " style={{ background: "#000000" }}>
              <small style={{ color: "#FFFFFF" }}>
                {item.description ? item.description : "Not Booked"}
              </small>
            </span> */}
            <hr />
            <small>
              <b className="docNametext">{item.doc_name}</b>
            </small>
            {/* <small>{item.sub_department_desc}</small> */}
            {item.default_status !== "Y" && item.default_status ? null : (
              <button
                style={{ backgroundColor: item.color_code }}
                className="btn btn-block btn-sm btn-book"
                onClick={() => {
                  history.push("/Appointment", {
                    data: {
                      ...item,
                      from_recall: true,
                      pat_recall_id: item.him_f_patient_followup_id,
                    },
                  });
                }}
                // disabled={item.default_status !== "Y" && item.default_status}
              >
                {item.description ? item.description : "Book Appointment"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Column;
