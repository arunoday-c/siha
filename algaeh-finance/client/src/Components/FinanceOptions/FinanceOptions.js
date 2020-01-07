import React, { useState, useEffect } from "react";
import OptionsComponent from "./OptionsComponent";
import { newAlgaehApi } from "../../hooks";

export default function FinanceOptions(props) {
  const [finOptions, setFinOptions] = useState(null);
  const [organization, setOrganization] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance"
          }),
          newAlgaehApi({ uri: "/organization/getOrganization" }),
          newAlgaehApi({
            uri: "/finance_masters/getCostCenters",
            module: "finance"
          })
        ]);
        setFinOptions(results[0].data.result[0]);
        setOrganization(results[1].data.records);
        setCostCenters(results[2].data.result);
      } catch (e) {
        console.log(e);
      }
    }
    initData();
  }, []);

  function handleDropDown(valueObj, value, name) {
    setFinOptions(state => {
      return { ...state, [name]: value };
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "auth1_limit" && value === "N") {
      setFinOptions(state => {
        return { ...state, [name]: value, auth1_limit_amount: 0 };
      });
    } else {
      setFinOptions(state => {
        return { ...state, [name]: value };
      });
    }
  }

  function handleSubmit() {
    newAlgaehApi({
      uri: "/finance_masters/updateFinanceOption",
      module: "finance",
      method: "PUT",
      data: finOptions
    })
      .then(res => {
        if (res.data.success) {
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance"
          })
            .then(res => {
              if (res.data.success) {
                setFinOptions(res.data.result[0]);
              }
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  if (finOptions) {
    return (
      <OptionsComponent
        options={finOptions}
        handleChange={handleChange}
        organization={organization}
        costCenters={costCenters}
        handleDropDown={handleDropDown}
        handleSubmit={handleSubmit}
      />
    );
  }
  return null;
}
