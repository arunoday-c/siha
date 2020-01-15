import React, { useState, useEffect } from "react";
import OptionsComponent from "./OptionsComponent";
import { newAlgaehApi } from "../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";

export default function FinanceOptions(props) {
  const [finOptions, setFinOptions] = useState({ default_branch_id: "" });
  const [organization, setOrganization] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({ uri: "/organization/getOrganization" }),
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance"
          })
        ]);
        setOrganization(results[0].data.records);
        setFinOptions(results[1].data.result[0]);
      } catch (e) {
        AlgaehMessagePop({
          info: "error",
          display: e.response.data.message
        });
      }
    }
    initData();
  }, []);

  useEffect(() => {
    newAlgaehApi({
      uri: "/finance_masters/getCostCenters",
      module: "finance",
      data: { hospital_id: finOptions.default_branch_id }
    })
      .then(result => setCostCenters(result.data.result))
      .catch(e =>
        AlgaehMessagePop({
          info: "error",
          display: e.response.data.message
        })
      );
  }, [finOptions.default_branch_id]);

  function handleDropDown(_, value, name) {
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
        costCenters={costCenters}
        organization={organization}
        options={finOptions}
        handleChange={handleChange}
        handleDropDown={handleDropDown}
        handleSubmit={handleSubmit}
      />
    );
  }
  return null;
}
