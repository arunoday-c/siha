import React, { useState } from "react";
import { AlgaehLabel } from "../../Wrappers";
import Expense from "./Expense";
import Income from "./Income";
import Transfer from "./Transfer";

export default function Transactions(props) {
  const [activeTab, setActiveTab] = useState("Expense");

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
      <div className="col">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"Expense"}
                className={"nav-item tab-button active"}
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
              <li
                algaehtabs={"Income"}
                className={"nav-item tab-button "}
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
                algaehtabs={"Transfer"}
                className={"nav-item tab-button"}
                onClick={openTab}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "Transfer"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="row common-section">
          {activeTab === "Expense" ? (
            <Expense />
          ) : activeTab === "Income" ? (
            <Income />
          ) : activeTab === "Transfer" ? (
            <Transfer />
          ) : null}
        </div>
      </div>
    </div>
  );
}
