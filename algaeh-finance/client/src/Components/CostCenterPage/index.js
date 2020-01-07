import React, { useEffect, useState } from "react";
import "./costcenter.scss";
import CenterComponent from "./CenterComponent";
import CostCenterComponent from "../costCenterComponent";
import { newAlgaehApi } from "../../hooks";

function CostCenterPage(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    newAlgaehApi({
      uri: "/finance_masters/getCostCenters",
      data: {
        fromMaster: "Y"
      },
      method: "GET",
      module: "finance"
    })
      .then(res => {
        console.log(res, "res effect");
        setData(res.data.result);
      })
      .catch(e => console.log(e));
  }, []);

  function handleResult(values) {
    console.log(values);
    newAlgaehApi({
      uri: "/finance_masters/addCostCenter",
      method: "POST",
      module: "finance",
      data: {
        hospital_id: values.hims_d_hospital_id,
        cost_center_id: values.costCenter
      }
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data, "after math");
        }
      })
      .catch(e => console.log(e));
  }

  return (
    <>
      <CostCenterComponent
        orgUrl="/organization/getOrganization"
        render={result => (
          <div className="col" style={{ paddingTop: 16 }}>
            <button className="btn btn-default">Clear</button>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 10 }}
              onClick={() => handleResult(result)}
            >
              Add to List
            </button>
          </div>
        )}
      />
      <CenterComponent data={data} />
    </>
  );
}

export default CostCenterPage;
