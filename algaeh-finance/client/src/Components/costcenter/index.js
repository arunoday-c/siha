import React, { useEffect, useState, forwardRef } from "react";
import "./costcenter.scss";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
export default forwardRef(function CostCenter(props, ref) {
  const { div, result, noborder } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadBranch, setLoadBranch] = useState(false);
  const [costCenter, setCostCenter] = useState(undefined);
  const [hims_d_hospital_id, setHims_d_hospital_id] = useState(undefined);
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    setLoadBranch(true);
    algaehApiCall({
      uri: `/organization/getOrganizationByUser`,
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
      uri: `/voucher/getCostCenters`,
      data: { hims_d_hospital_id: hospitalID },
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

  return (
    <div
      ref={ref}
      className={noborder === undefined ? "col-12 costCenterFilter" : "col-12"}
    >
      <div className="row">
        <div className="col-6">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Branch" }}
            selector={{
              dataSource: {
                data: branch,
                valueField: "hims_d_hospital_id",
                textField: "hospital_name"
              },
              value: hims_d_hospital_id,
              onChange: (details, value) => {
                setHims_d_hospital_id(value);
                result["hospital_id_label"] = details["hospital_name"];
                result["hospital_id"] = value;
                onChangeHospitalId(value);
              },
              others: {
                loading: loadBranch
              }
            }}
          />
        </div>
        <div className="col-6">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Cost Center" }}
            selector={{
              dataSource: {
                data: data,
                valueField: "cost_center_id",
                textField: "cost_center"
              },
              value: costCenter,
              onChange: (details, value) => {
                setCostCenter(value);
                result["cost_center_id_label"] = details["cost_center"];
                result["cost_center_id"] = value;
              },
              others: {
                loading: loading
              }
            }}
          />
        </div>
      </div>
    </div>
  );
});
