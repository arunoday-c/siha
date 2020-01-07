import React, { useEffect, useState, forwardRef } from "react";
import "./costcenter.scss";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
export default forwardRef(function CostCenter(
  { div, result, noborder, render, orgUrl },
  ref
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadBranch, setLoadBranch] = useState(false);
  const [costCenter, setCostCenter] = useState(undefined);
  const [hims_d_hospital_id, setHims_d_hospital_id] = useState(undefined);
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    setLoadBranch(true);
    algaehApiCall({
      uri: orgUrl || `/organization/getOrganizationByUser`,
      method: "GET",
      onSuccess: response => {
        setLoadBranch(false);
        if (response.data.success === true) {
          setBranch(response.data.records);
        }
      },
      onCatch: error => {
        setLoadBranch(false);
        console.log("error", error);
      }
    });
  }, []);

  function onChangeHospitalId(hospitalID) {
    setLoading(true);
    algaehApiCall({
      uri: "/finance_masters/getCostCenters",
      data: { hospital_id: hospitalID },
      method: "GET",
      module: "finance",
      onSuccess: response => {
        setLoading(false);
        if (response.data.success === true) {
          setData(response.data.result);
        }
      },
      onCatch: error => {
        setLoading(false);
        console.log("error", error);
      }
    });
  }

  function HandleHospital(details, value) {
    setHims_d_hospital_id(value);
    if (result) {
      result["hospital_id_label"] = details["hospital_name"];
      result["hospital_id"] = value;
    }
    onChangeHospitalId(value);
  }

  function HandleCostCenter(details, value) {
    setCostCenter(value);
    if (result) {
      result["cost_center_id_label"] = details["cost_center"];
      result["cost_center_id"] = value;
    }
  }

  return (
    <div
      ref={ref}
      className={noborder === undefined ? "col-12 costCenterFilter" : "col-12"}
    >
      <div className="row">
        <div className="col">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Select a Branch" }}
            selector={{
              dataSource: {
                data: branch,
                valueField: "hims_d_hospital_id",
                textField: "hospital_name"
              },
              value: hims_d_hospital_id,
              onChange: HandleHospital,
              others: {
                loading: loadBranch
              }
            }}
          />
        </div>
        <div className="col">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Select a Cost Center" }}
            selector={{
              dataSource: {
                data: data,
                valueField: "cost_center_id",
                textField: "cost_center"
              },
              value: costCenter,
              onChange: HandleCostCenter,
              others: {
                loading: loading
              }
            }}
          />
        </div>
        {render ? render({ costCenter, hims_d_hospital_id }) : null}
      </div>
    </div>
  );
});
