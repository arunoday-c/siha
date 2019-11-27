import React, { useRef } from "react";
// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";
function hasChildren(node) {
  return (
    typeof node === "object" &&
    typeof node.children !== "undefined" &&
    node.children.length > 0
  );
}

function PlotUI(node, style, indexIds) {
  if (!hasChildren(node)) {
    return (
      <li
        className="childNodeLi"
        key={indexIds.join("-")}
        followupid={
          node.leafnode === "N" ? node.finance_account_head_id : node.head_id
        }
        parentid={node.leafnode === "Y" ? node.head_id : node.parent_acc_id}
      >
        <span>{node["label"]}</span>
        <span>{node["subtitle"]}</span>
      </li>
    );
  } else {
    return (
      <li
        key={indexIds.join("-")}
        className="parentNodeLi"
        parentid={node.leafnode === "Y" ? node.head_id : node.parent_acc_id}
      >
        <div
          onClick={e => {
            let currentElement = e.currentTarget;
            let ul = currentElement.nextElementSibling;
            if (
              ul.getAttribute("isexpand") === null ||
              ul.getAttribute("isexpand") === "true"
            ) {
              ul.classList.remove("hide");
              ul.classList.add("show");
              ul.setAttribute("isexpand", "false");
            } else {
              ul.classList.remove("show");
              ul.classList.add("hide");
              ul.setAttribute("isexpand", "true");
            }
          }}
          followupid={
            node.leafnode === "N" ? node.finance_account_head_id : node.head_id
          }
        >
          <span>&#x27A5;</span>
          <span>{node["label"]}</span>
          <span>
            <b>{node["subtitle"]}</b>
          </span>
        </div>
        <ul className={node.account_level === "0" ? "show" : "hide"}>
          {node.children.map((innerNode, index) => {
            let newIndex = Array.isArray(indexIds) ? indexIds : [];
            newIndex.push(index);
            return PlotUI(innerNode, style, newIndex);
          })}
        </ul>
      </li>
    );
  }
}

export default function BalanceSheet(props) {
  const { style, data, result } = props;
  const createPrintObject = useRef(undefined);
  if (Object.keys(data).length === 0) {
    return null;
  } else {
    return (
      <>
        <ReactToPrint
          trigger={() => <i className="fas fa-print" />}
          content={() => createPrintObject.current}
          removeAfterPrint={true}
          bodyClass="reportPreviewSecLeft"
          pageStyle="printing"
        />
        <div ref={createPrintObject}>
          <div className="financeReportHeader">
            <div>Company logo</div>

            <div>Address</div>
            <h3>Report Name</h3>
            {/* <p>
              Applied Filters -{" "}
              <span>
                Date: <b>11-04-2019</b>
              </span>
              <span>
                Date: <b>11-04-2019</b>
              </span>
              <span>
                Date: <b>11-04-2019</b>
              </span>
            </p> */}
          </div>
          <div className="reportTableStyle">
            <ul className="treeListUL">
              {PlotUI(data[result[0]], style, [0])}
            </ul>
          </div>
          <div className="reportTableStyle">
            <ul className="treeListUL">
              {PlotUI(data[result[1]], style, [0])}
            </ul>{" "}
          </div>
          <div> Toatal Balance : {data.balance}</div>
        </div>
      </>
    );
  }
}
