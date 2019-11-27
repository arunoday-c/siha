import React, { useRef } from "react";
import { Button } from "algaeh-react-components";
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
            debugger;
            let currentElement = e.currentTarget;
            // let isShow = true;
            let ul = currentElement.nextElementSibling;
            if (
              ul.getAttribute("isexpand") === null ||
              ul.getAttribute("isexpand") === "true"
            ) {
              //  isShow = false;
              ul.classList.remove("hide");
              ul.classList.add("show");
              ul.setAttribute("isexpand", "false");
            } else {
              //   isShow = true;
              ul.classList.remove("show");
              ul.classList.add("hide");
              ul.setAttribute("isexpand", "true");
            }
            // const followupid = currentElement.getAttribute("followupid");
            // currentElement.nextElementSibling.classList.add("hide");
            // if (isShow) {
            //   currentElement.nextElementSibling.classList.add("show");
            // }

            //   querySelectorAll(
            //   "li[parentid='" + followupid + "']"
            // );
            // allsubtree.forEach(element => {
            //   if (isShow) {
            //     element.classList.remove("hide");
            //     element.classList.add("show");
            //   } else {
            //     element.classList.remove("show");
            //     element.classList.add("hide");
            //   }
            // });
          }}
          followupid={
            node.leafnode === "N" ? node.finance_account_head_id : node.head_id
          }
        >
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
        <div className="financeReportHeader">
          <div>Company logo</div>
          <i
            className="fas fa-print"
            onClick={() => {
              const report = createPrintObject.current;
              var printWindow = window.open("", "", "height=700,width=900");
              printWindow.document.write(`<html><head>`);
              const details = document
                .getElementsByTagName("head")[0]
                .querySelectorAll("style");
              details.forEach(item => {
                printWindow.document.write(`<style>${item.innerHTML}</style>`);
              });
              printWindow.document.write(`</head><body>`);
              printWindow.document.write(
                `<div class='reportPreviewSecLeft'>${report.innerHTML}</div>`
              );
              printWindow.document.write(`</body></html>`);
              printWindow.document.close();
              printWindow.print();
            }}
          ></i>
          <div>Address</div>
          <h3>Report Name</h3>
          <p>
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
          </p>
        </div>

        <div ref={createPrintObject}>
          <table className="reportTableStyle">
            <tbody>
              <tr>
                <td>
                  <ul className="treeListUL">
                    {PlotUI(data[result[0]], style, [0])}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <table className="reportTableStyle">
            <tbody>
              <tr>
                <td>
                  <ul className="treeListUL">
                    {PlotUI(data[result[1]], style, [0])}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
