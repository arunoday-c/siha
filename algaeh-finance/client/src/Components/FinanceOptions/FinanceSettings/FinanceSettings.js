import React, { useState, useEffect } from "react";
import moment from "moment";
import OptionsComponent from "./OptionsComponent";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";

export default function FinanceSettings(props) {
  const [finOptions, setFinOptions] = useState({ default_branch_id: "" });
  const [organization, setOrganization] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  useEffect(() => {
    async function initData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: "/finance_masters/getCostCentersForVoucher",
            module: "finance",
          }),
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance",
          }),
        ]);
        setOrganization(results[0].data.result);
        setFinOptions(results[1].data.result[0]);
      } catch (e) {
        AlgaehMessagePop({
          info: "error",
          display: e.message || e.response.data.message,
        });
      }
    }
    initData();
  }, []);

  useEffect(() => {
    if (finOptions.default_branch_id) {
      const [required] = organization.filter(
        (el) =>
          el.hims_d_hospital_id === parseInt(finOptions.default_branch_id, 10)
      );
      setCostCenters(required.cost_centers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finOptions]);

  function handleDropDown(_, value, name) {
    let extra = {};
    if (name === "start_month") {
      const endPhyYr = moment(
        `01-${value.length === 1 ? `0${value}` : value}-1990`,
        "DD-MM-YYYY"
      )
        .add("months", 11)
        .format("MM");
      extra = {
        end_month: parseInt(endPhyYr),
      };
    }
    setFinOptions((state) => {
      if (name === "default_branch_id") {
        state.default_cost_center_id = null;
      }
      return { ...state, ...extra, [name]: value };
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "auth1_limit" && value === "N") {
      setFinOptions((state) => {
        return { ...state, [name]: value, auth1_limit_amount: 0 };
      });
    } else {
      setFinOptions((state) => {
        return { ...state, [name]: value };
      });
    }
  }

  function handleSubmit() {
    newAlgaehApi({
      uri: "/finance_masters/updateFinanceOption",
      module: "finance",
      method: "PUT",
      data: finOptions,
    })
      .then((res) => {
        if (res.data.success) {
          newAlgaehApi({
            uri: "/finance_masters/getFinanceOption",
            module: "finance",
          })
            .then((res) => {
              if (res.data.success) {
                setFinOptions(res.data.result[0]);
                AlgaehMessagePop({
                  type: "success",
                  display: "Save Successfully",
                });
              }
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
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
