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
          visit_id,
          patient_id,
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
          visit_id,
          patient_id,
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
    <>
      <div className="portlet portlet-bordered">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12" style={{ textAlign: "right" }}>
              <div className="row">
                {" "}
                <div className="col-7"></div>
                <div className="col-3">
                  <label className="style_Label ">Total Records</label>
                  <h6>{TOTAL_RECORDS}</h6>
                </div>
                <div className="col-2">
                  <label className="style_Label ">Selected records</label>
                  <h6>{SELECTED_RECORDS}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              className="btn btn-primary"
              disabled={
                !SELECTED_RECORDS || SELECTED_RECORDS === 0 ? true : false
              }
              onClick={onLickProcessSMS}
            >
              Send SMS with Selected
            </button>
          </div>
        </div>
      </div>
    </>
  );
});
