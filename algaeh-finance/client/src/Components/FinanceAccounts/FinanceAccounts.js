import React, { useState } from "react";
import { AlgaehLabel } from "../../Wrappers";
import Assets from "./Assets";
import Liabilities from "./Liabilities";
import Income from "./Income";
import Capital from "./Capital";
import Expense from "./Expense";
import {AlgaehTabs} from "algaeh-react-components";
export default function FinanceAccounts(props) {
  const [activeTab, setActiveTab] = useState("Assets");

  function openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    let i;
    for (i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    const specified = e.currentTarget.getAttribute("algaehtabs");
    setActiveTab(specified);
  }

  return (
    <div className="">
{/*<AlgaehTabs*/}
{/*content={[{*/}
{/*  title:<AlgaehLabel*/}
{/*      label={{*/}
{/*        fieldName: "Assets"*/}
{/*      }}*/}
{/*  />,*/}
{/*  children: <Assets />*/}
{/*},*/}
{/*  {title:<AlgaehLabel*/}
{/*  label={{*/}
{/*    fieldName: "Liabilities"*/}
{/*  }}*/}
{/*  />,*/}
{/*  children: <Liabilities />*/}
{/*},*/}
{/*  {title:<AlgaehLabel*/}
{/*        label={{*/}
{/*          fieldName: "Income"*/}
{/*        }}*/}
{/*    />,*/}
{/*    children: <Income />*/}
{/*  },*/}
{/*  {title:<AlgaehLabel*/}
{/*        label={{*/}
{/*          fieldName: "Capital"*/}
{/*        }}*/}
{/*    />,*/}
{/*    children: <Capital />*/}
{/*  },*/}
{/*  {title:<AlgaehLabel*/}
{/*        label={{*/}
{/*          fieldName: "Expense"*/}
{/*        }}*/}
{/*    />,*/}
{/*    children: <Expense />*/}
{/*  }*/}
{/*]}*/}
{/*/>*/}
      <div className="row">
        <div className="tabMaster toggle-section">
          <ul className="nav">
            <li
              algaehtabs={"Assets"}
              className={"nav-item tab-button active"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "Assets"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Liabilities"}
              className={"nav-item tab-button "}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "Liabilities"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Income"}
              className={"nav-item tab-button"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "Income"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Capital"}
              className={"nav-item tab-button"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "Capital"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Expense"}
              className={"nav-item tab-button"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "Expense"
                  }}
                />
              }
            </li>
          </ul>
        </div>
      </div>
      <div className="row common-section">
        {activeTab === "Assets" ? (
          <Assets />
        ) : activeTab === "Liabilities" ? (
          <Liabilities />
        ) : activeTab === "Income" ? (
          <Income />
        ) : activeTab === "Capital" ? (
          <Capital />
        ) : activeTab === "Expense" ? (
          <Expense />
        ) : null}
      </div>
    </div>
  );
}
