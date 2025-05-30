import React from "react";
import ParentIcon from "./parentIcon";
import ChildIcon from "./childIcon";
import ParentIconOpen from "./parentIconOpen";
function hasChildren(node) {
  return (
    typeof node === "object" &&
    typeof node.children !== "undefined" &&
    node.children.length > 0
  );
}

export function PlotUI(node, style, indexIds, nonZero, expand) {
  function PlotUIInner(node, style, indexIds, nonZero) {
    if (!hasChildren(node)) {
      if (node !== undefined && nonZero === false) {
        if (
          parseFloat(node["tr_credit_amount"]) === 0 &&
          parseFloat(node["tr_debit_amount"]) === 0
        ) {
          return null;
        }
      }
      return (
        <li
          className="childNodeLi"
          key={indexIds.join("-")}
          followupid={
            node !== undefined && node.leafnode === "N"
              ? node.finance_account_head_id
              : node !== undefined
              ? node.head_id
              : null
          }
          parentid={
            node !== undefined && node.leafnode === "Y"
              ? node.head_id
              : node !== undefined
              ? node.parent_acc_id
              : null
          }
        >
          <div>
            <span>
              <img src={ChildIcon} alt="" />
            </span>
            <span>{node !== undefined ? node["label"] : null}</span>
            <span>
              {node !== undefined ? (
                parseFloat(node["tr_credit_amount"]) === 0 ? (
                  <b></b>
                ) : (
                  node["tr_credit_amount"]
                )
              ) : null}
            </span>
            <span>
              {node !== undefined ? (
                parseFloat(node["tr_debit_amount"]) === 0 ? (
                  <b></b>
                ) : (
                  node["tr_debit_amount"]
                )
              ) : null}
            </span>
          </div>
        </li>
      );
    } else {
      if (node !== undefined && nonZero === false) {
        if (
          parseFloat(node["tr_credit_amount"]) === 0 &&
          parseFloat(node["tr_debit_amount"]) === 0
        ) {
          return null;
        }
      }

      return (
        <li
          key={indexIds.join("-")}
          className="parentNodeLi"
          parentid={
            node !== undefined && node.leafnode === "Y"
              ? node.head_id
              : node.parent_acc_id
          }
        >
          <div
            onClick={e => {
              let currentElement = e.currentTarget;
              let ul = currentElement.nextElementSibling;
              if (
                ul.getAttribute("isexpand") === null ||
                ul.getAttribute("isexpand") === "true"
              ) {
                currentElement.classList.remove("collapsed");
                currentElement.classList.add("expand");
                ul.classList.remove("hide");
                ul.classList.add("show");
                ul.setAttribute("isexpand", "false");
              } else {
                currentElement.classList.remove("expand");
                currentElement.classList.add("collapsed");
                ul.classList.remove("show");
                ul.classList.add("hide");
                ul.setAttribute("isexpand", "true");
              }
            }}
            followupid={
              node !== undefined && node.leafnode === "N"
                ? node.finance_account_head_id
                : node !== undefined
                ? node.head_id
                : null
            }
            className={expand ? "expand" : "collapsed"}
          >
            <span>
              <img className="closedIcon" src={ParentIcon} alt="" />
              <img className="opendIcon" src={ParentIconOpen} alt="" />
            </span>
            <span>{node !== undefined ? node["label"] : null}</span>
            <span>
              <b>
                {node !== undefined
                  ? parseFloat(node["tr_credit_amount"]) === 0
                    ? ""
                    : node["tr_credit_amount"]
                  : null}
              </b>
            </span>
            <span>
              <b>
                {node !== undefined
                  ? parseFloat(node["tr_debit_amount"]) === 0
                    ? ""
                    : node["tr_debit_amount"]
                  : null}
              </b>
            </span>
          </div>
          <ul
            className={node.account_level === "0" || expand ? "show" : "hide"}
          >
            {node.children.map((innerNode, index) => {
              let newIndex = Array.isArray(indexIds) ? indexIds : [];
              newIndex.push(index);
              return PlotUI(innerNode, style, newIndex, nonZero, expand);
            })}
          </ul>
        </li>
      );
    }
  }
  return PlotUIInner(node, style, indexIds, nonZero);
}
