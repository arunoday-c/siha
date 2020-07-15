import React, { createContext, useEffect, useState, useReducer } from "react";
import "./PrePayment.scss";
import { PrepaymentMaster } from "./PrepaymentMaster";
import { PrepaymentRequest } from "./PrepaymentRequest";
import { PrepaymentList } from "./PrepaymentList";
import { PrepaymentProcess } from "./PrepaymentProcess";
import { newAlgaehApi } from "../../hooks";
import {
  AlgaehTabs,
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";

export const PrePaymentContext = createContext({
  branch: [],
  costCenter: [],
  prePaymentTypes: [],
  employees: [],
});

function reducer(state, action) {
  switch (action.type) {
    case "SET_BRANCH":
      return { ...state, branch: action.payload };

    case "SET_COSTCENTER":
      return { ...state, costCenter: action.payload };

    case "SET_PREPAYMENTTYPES":
      return { ...state, prePaymentTypes: action.payload };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };

    default:
      break;
  }
}

export default function PrePayment() {
  const [state, dispatch] = useReducer(reducer, { branch: [], costCenter: [] });

  const dispatches = {
    setBranch(data) {
      dispatch({ type: "SET_BRANCH", payload: data });
    },
    setCostCenter(data) {
      dispatch({ type: "SET_COSTCENTER", payload: data });
    },
    setPrepaymentTypes(data) {
      dispatch({ type: "SET_PREPAYMENTTYPES", payload: data });
    },
    setEmployees(data) {
      dispatch({ type: "SET_EMPLOYEES", payload: data });
    },
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      try {
        const results = await Promise.all([
          newAlgaehApi({
            uri: `/organization/getOrganizationByUser`,
            method: "GET",
          }),
          newAlgaehApi({
            uri: "/finance_masters/getCostCenters",
            method: "GET",
            module: "finance",
          }),
          newAlgaehApi({
            uri: "/employee/get",
            module: "hrManagement",
            method: "GET",
          }),
        ]);
        const [branch, costCenters, employees] = results;
        dispatches.setBranch(branch.data.records);
        dispatches.setCostCenter(costCenters.data.result);
        dispatches.setEmployees(employees.data.records);
      } catch (e) {
        AlgaehMessagePop({
          display: "error",
          type: e.message,
        });
      }
    }
    getData().then(() => setLoading(false));
  }, []);

  return (
    <PrePaymentContext.Provider value={{ ...state, ...dispatches }}>
      <Spin spinning={loading}>
        <div className="PrepaymentModule">
          <AlgaehTabs
            removeCommonSection={true}
            content={[
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Prepayment Master",
                    }}
                  />
                ),
                children: <PrepaymentMaster />,
                componentCode: "PRE_PAY_MST",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Prepayment Request",
                    }}
                  />
                ),
                children: <PrepaymentRequest />,
                componentCode: "PRE_PAY_REQ",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Prepayment Auth List",
                    }}
                  />
                ),
                children: <PrepaymentList />,
                componentCode: "PRE_PAY_LST",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Prepayment Process",
                    }}
                  />
                ),
                children: <PrepaymentProcess />,
                componentCode: "PRE_PAY_PRS",
              },
            ]}
            renderClass="PrepaymentCntr"
          />
        </div>
      </Spin>
    </PrePaymentContext.Provider>
  );
}
