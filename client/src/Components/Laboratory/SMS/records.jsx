import React, { memo, useContext } from "react";
import { message } from "algaeh-react-components";
import { LabContext } from "../SMS";
import { processSMS } from "./events";
export default memo(function Record(props) {
  const { TOTAL_RECORDS, SELECTED_RECORDS, setLabState } =
    useContext(LabContext);
  function onLickProcessSMS() {
    const sendData = props.data
      .filter((f) => f.selected === true)
      .map((item) => {
        const {
          hims_f_lab_order_id,
          primary_id_no,
          patient_code,
          full_name,
          isPCR,
          contact_no,
          years,
          gender,
          short_url,
        } = item;
        return {
          hims_f_lab_order_id,
          primary_id_no,
          patient_code,
          full_name,
          isPCR,
          contact_no,
          years,
          gender,
          short_url,
        };
      });
    try {
      processSMS({ list: sendData }).then(() => {
        message.success({
          content:
            "Messages are in progress it will notify in sent/error message section.",
        });
        setLabState({ TRIGGER_LOAD: true, SELECTED_RECORDS: 0 });
      });
    } catch (e) {
      console.error("eeee=>", e);
    }
  }
  return (
    <div className="row  margin-bottom-15 topResultCard">
      <div className="col-12">
        <div className="card-group">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{TOTAL_RECORDS}</h5>
              <p className="card-text">
                <span className="badge badge-secondary"> Total records </span>
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{SELECTED_RECORDS}</h5>
              <p className="card-text">
                <span className="badge badge-secondary">Selected records</span>
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <button
                className="btn btn-primary"
                disabled={
                  !SELECTED_RECORDS || SELECTED_RECORDS === 0 ? true : false
                }
                onClick={onLickProcessSMS}
              >
                Proceed to Send SMS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
