import React from "react";
import { useHistory } from "react-router-dom";

const Column = ({ data }) => {
  const history = useHistory();
  return (
    <div className="card">
      <h2>{data.date}</h2>

      <div className="slotsDiv">
        {data.patients.map((item) => (
          <div className="eachSlot" style={{ background: item.color_code }}>
            <small>{item.patient_code}</small>
            <h3>{item.pat_name}</h3>

            <small>{item.contact_number}</small>

            <br />

            <span className="badge " style={{ background: "#000000" }}>
              <small style={{ color: "#FFFFFF" }}>
                {item.description ? item.description : "Not Booked"}
              </small>
            </span>

            <br />

            <hr />
            <small>
              <b>{item.doc_name}</b>
            </small>
            <br />
            <small>{item.sub_department_desc}</small>
            {item.default_status !== "Y" && item.default_status ? null : (
              <button
                className="btn btn-default btn-block btn-sm btn-book"
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
                Book Appointment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Column;
