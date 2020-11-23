import React, { memo, useState, useEffect } from "react";
import { AlgaehLabel, Spin } from "algaeh-react-components";
import AlgaehSearch from "../../Wrapper/globalSearch";
import Accordion from "./components/Accordion";
// import {useLocation, useHistory } from "react-router-dom";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { loadPatientRecords } from "./api";
export default memo(function () {
  const [patientCode, setPatientCode] = useState("");
  const [patientId, setPatientId] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [primaryId, setPrimaryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (patientId !== 0) {
      funLoadPatientRecords();
    }
  }, [patientId]);
  function showPatientFinder() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.frontDesk.patients,
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        setPatientId(row.hims_d_patient_id);
        setPatientCode(row.patient_code);
        setPatientName(row.full_name);
        setPrimaryId(row.primary_id_no);
      },
    });
  }
  async function funLoadPatientRecords() {
    setIsLoading(true);
    const records = await loadPatientRecords({ patient_id: patientId });
    setIsLoading(false);
    setData(records);
  }
  console.log("data", data);
  return (
    <div className="hptl-phase1-result-entry-form">
      <div className="row inner-top-search" style={{ paddingBottom: "10px" }}>
        <div className="col-2 globalSearchCntr">
          <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
          <h6 onClick={showPatientFinder}>
            {patientCode === "" ? (
              <AlgaehLabel label={{ fieldName: "patient_code" }} />
            ) : (
              patientCode
            )}
            <i className="fas fa-search fa-lg"></i>
          </h6>
        </div>
        <div className="col" style={{ paddingTop: "21px" }}>
          <button
            className="btn btn-default btn-sm"
            type="button"
            onClick={() => {}}
          >
            Clear
          </button>
          <button
            style={{ marginLeft: "10px" }}
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => {}}
          >
            Load
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            {isLoading ? (
              <div> Please wait loading </div>
            ) : patientId === 0 ? (
              <div> No Patient selected </div>
            ) : (
              <>
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      <b style={{ textTransform: "uppercase" }}>
                        {patientName} / {primaryId}
                      </b>
                    </h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <Spin spinning={isLoading}>
                    {data.map((item, index) => (
                      <Accordion key={index} details={item} />
                    ))}
                  </Spin>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
