import React from "react";
function hasChildren(node) {
  return (
    typeof node === "object" &&
    typeof node.children !== "undefined" &&
    node.children.length > 0
  );
}

export function PlotUI(node, style, indexIds) {
  if (!hasChildren(node)) {
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
        <span>{node !== undefined ? node["label"] : null}</span>
        <span>{node !== undefined ? node["subtitle"] : null}</span>
      </li>
    );
  } else {
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
            node !== undefined && node.leafnode === "N"
              ? node.finance_account_head_id
              : node !== undefined
              ? node.head_id
              : null
          }
        >
          <span>&#x27A5;</span>
          <span>{node !== undefined ? node["label"] : null}</span>
          <span>
            <b>{node !== undefined ? node["subtitle"] : null}</b>
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
