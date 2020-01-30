import React, { useEffect, useState, memo } from "react";
import "./costcenter.scss";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";

function CostCenter({
  div,
  result,
  noborder,
  render,
  orgUrl,
  propBranchID,
  propCenterID
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadBranch, setLoadBranch] = useState(false);
  const [costCenter, setCostCenter] = useState(propCenterID);
  const [hims_d_hospital_id, setHims_d_hospital_id] = useState(propBranchID);
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
  }, [orgUrl]);

  useEffect(() => {
    function onChangeHospitalId() {
      if (hims_d_hospital_id) {
        setLoading(true);
        algaehApiCall({
          uri: "/finance_masters/getCostCenters",
          data: { hospital_id: hims_d_hospital_id },
          method: "GET",
          module: "finance",
          onSuccess: response => {
            setLoading(false);
            if (response.data.success === true) {
              setData(response.data.result);
              // if (propBranchID === hims_d_hospital_id) {
              //   setCostCenter(propCenterID);
              // }
            }
          },
          onCatch: error => {
            setLoading(false);
            console.log("error", error);
          }
        });
      }
    }
    onChangeHospitalId();
  }, [hims_d_hospital_id]);

  function HandleHospital(details, value) {
    setHims_d_hospital_id(value);
    if (result) {
      result["hospital_id_label"] = details["hospital_name"];
      result["hospital_id"] = value;
    }
    setCostCenter(null);
  }

  function HandleCostCenter(details, value) {
    setCostCenter(value);
    if (result) {
      result["cost_center_id_label"] = details["cost_center"];
      result["cost_center_id"] = value;
    }
  }

  function clearValues() {
    setCostCenter(null);
    setHims_d_hospital_id(null);
  }

  /* {noborder === undefined ? "col-12 costCenterFilter" : "col-12"} */

  return (
    <>
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
      {render ? render({ costCenter, hims_d_hospital_id, clearValues }) : null}
    </>
  );
}

export default memo(CostCenter);
