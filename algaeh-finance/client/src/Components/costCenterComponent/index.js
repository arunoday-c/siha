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
  propCenterID,
  costCenterAssin,
  loadData
}) {
  const [costCenterdata, setCostCenterData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [loadBranch, setLoadBranch] = useState(false);
  const [costCenter, setCostCenter] = useState(propCenterID);
  const [hims_d_hospital_id, setHims_d_hospital_id] = useState(propBranchID);
  const [branch, setBranch] = useState([]);

  useEffect(() => {

    setLoading(true);
    algaehApiCall({
      uri: "/finance_masters/getCostCenters",
      method: "GET",
      module: "finance",

      onSuccess: response => {
        setLoading(false);
        if (response.data.success === true) {
          setCostCenterData(response.data.result);
        }
      },
      onCatch: error => {
        setLoading(false);
        console.log("error", error);
      }
    });
  }, [costCenter]);

  // useEffect(() => {

  //   function onChangeCostCenter() {
  //     debugger
  //     if (costCenter) {
  //       setLoading(true);
  //       algaehApiCall({
  //         uri: "/finance_masters/getCostCenters",
  //         data: { hospital_id: hims_d_hospital_id },
  //         method: "GET",
  //         module: "finance",
  //         onSuccess: response => {
  //           setLoading(false);
  //           if (response.data.success === true) {
  //             setData(response.data.result);
  //             // if (propBranchID === hims_d_hospital_id) {
  //             //   setCostCenter(propCenterID);
  //             // }
  //           }
  //         },
  //         onCatch: error => {
  //           setLoading(false);
  //           console.log("error", error);
  //         }
  //       });
  //     }
  //   }
  //   onChangeCostCenter();
  // }, [costCenter]);

  // useEffect(() => {
  //   setLoadBranch(true);
  //   algaehApiCall({
  //     uri: orgUrl || `/organization/getOrganizationByUser`,
  //     method: "GET",
  //     onSuccess: response => {
  //       setLoadBranch(false);
  //       if (response.data.success === true) {
  //         setBranch(response.data.records);
  //       }
  //     },
  //     onCatch: error => {
  //       setLoadBranch(false);
  //       console.log("error", error);
  //     }
  //   });
  // }, [orgUrl]);

  // useEffect(() => {
  //   function onChangeHospitalId() {
  //     if (hims_d_hospital_id) {
  //       setLoading(true);
  //       algaehApiCall({
  //         uri: "/finance_masters/getCostCenters",
  //         data: { hospital_id: hims_d_hospital_id },
  //         method: "GET",
  //         module: "finance",
  //         onSuccess: response => {
  //           setLoading(false);
  //           if (response.data.success === true) {
  //             setData(response.data.result);
  //             // if (propBranchID === hims_d_hospital_id) {
  //             //   setCostCenter(propCenterID);
  //             // }
  //           }
  //         },
  //         onCatch: error => {
  //           setLoading(false);
  //           console.log("error", error);
  //         }
  //       });
  //     }
  //   }
  //   onChangeHospitalId();
  // }, [hims_d_hospital_id]);

  function HandleHospital(details, value) {
    setHims_d_hospital_id(value);
    if (result) {
      result["hospital_id_label"] = details["hospital_name"];
      result["hospital_id"] = value;
    }
    costCenterAssin({ branchID: value });

  }

  function HandleCostCenter(details, value) {
    setCostCenter(value);
    setBranch(details.branches);
    if (result) {
      result["cost_center_id_label"] = details["cost_center"];
      result["cost_center_id"] = value;
    }
    setHims_d_hospital_id(null);
    costCenterAssin({ projectID: value });

  }

  function clearValues() {
    setCostCenter(null);
    setHims_d_hospital_id(null);
  }

  function handleLoad() {
    algaehApiCall({
      uri: "/financeReports/getProfitAndLoss",
      data: {
        hospital_id: hims_d_hospital_id,
        cost_center_id: costCenter
      },
      method: "GET",
      module: "finance",
      onSuccess: response => {
        if (response.data.success === true) {
          loadData({ profitLoss: response.data.result });
        }
      },
      onCatch: error => {
        console.log("error", error);
      }
    });
  }

  /* {noborder === undefined ? "col-12 costCenterFilter" : "col-12"} */

  return (
    <>

      <div className="col-4">
        <AlgaehAutoComplete
          div={{ ...div }}
          label={{ forceLabel: "Select a Cost Center" }}
          selector={{
            dataSource: {
              data: costCenterdata,
              valueField: "cost_center_id",
              textField: "cost_center"
            },
            value: costCenter,
            onChange: HandleCostCenter,
            others: {
              loading: loading
            },
            onClear: () => {
              setCostCenter(null);
              costCenterAssin({ projectID: null });
            }
          }}
        />
      </div>
      <div className="col-4">
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
            onClear: () => {
              setHims_d_hospital_id(null);
              costCenterAssin({ branchID: null });
            }
          }}
        />
      </div>
      <div className="col">
        <button className="btn btn-primary" onClick={handleLoad}>
          Load
        </button>
      </div>

      {render ? render({ costCenter, hims_d_hospital_id, clearValues }) : null}
    </>
  );
}

export default memo(CostCenter);
