import React, { useEffect, useState } from "react";
import { AlgaehMessagePop } from "algaeh-react-components";
import "./costcenter.scss";
import CenterComponent from "./CenterComponent";
import CostCenterComponent from "../costCenterComponent";
import { newAlgaehApi } from "../../hooks";

function CostCenterPage() {
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
        setData(res.data.result);
      })
      .catch(e => AlgaehMessagePop({ type: "error", display: e.message }));
  }, []);

  function handleResult(values) {
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
          AlgaehMessagePop({
            type: "info",
            display: "Successfully added"
          });
        }
      })
      .catch(e => {
        AlgaehMessagePop({
          type: "error",
          display: e.message
        });
      });
  }

  return (
    <div className="row costCenterScreen">
      <div className="col-12 topBarCostCenter">
        {" "}
        <div className="row">
          <CostCenterComponent
            orgUrl="/organization/getOrganization"
            render={result => (
              <div className="col" style={{ paddingTop: 16 }}>
                <button
                  className="btn btn-default"
                  onClick={result.clearValues}
                >
                  Clear
                </button>
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
        </div>
      </div>
      <CenterComponent data={data} />
    </div>
  );
}

export default CostCenterPage;
