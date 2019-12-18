import React, { useEffect, useState } from "react";
import "./costcenter.scss";
import { AlgaehAutoComplete } from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
export default function CostCenter(props) {
  const { div } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [costCenter, setCostCenter] = useState(undefined);
  useEffect(() => {
    setLoading(true);
    algaehApiCall({
      uri: `/voucher/getCostCenters`,
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
  }, []);

  return (
    <div className="col-12 costCenterFilter">
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
          },
          others: {
            loading: loading
          }
        }}
      />
    </div>
  );
}
