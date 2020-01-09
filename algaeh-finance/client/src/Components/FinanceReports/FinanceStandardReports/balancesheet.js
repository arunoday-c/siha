import React, { useRef } from "react";
import { Row, Col } from "antd";

// import { Button } from "algaeh-react-components";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
// function hasChildren(node) {
//   return (
//     typeof node === "object" &&
//     typeof node.children !== "undefined" &&
//     node.children.length > 0
//   );
// }

// function PlotUI(node, style, indexIds) {
//   if (!hasChildren(node)) {
//     return (
//       <li
//         className="childNodeLi"
//         key={indexIds.join("-")}
//         followupid={
//           node !== undefined && node.leafnode === "N"
//             ? node.finance_account_head_id
//             : node !== undefined
//             ? node.head_id
//             : null
//         }
//         parentid={
//           node !== undefined && node.leafnode === "Y"
//             ? node.head_id
//             : node !== undefined
//             ? node.parent_acc_id
//             : null
//         }
//       >
//         <span>{node !== undefined ? node["label"] : null}</span>
//         <span>{node !== undefined ? node["subtitle"] : null}</span>
//       </li>
//     );
//   } else {
//     return (
//       <li
//         key={indexIds.join("-")}
//         className="parentNodeLi"
//         parentid={
//           node !== undefined && node.leafnode === "Y"
//             ? node.head_id
//             : node.parent_acc_id
//         }
//       >
//         <div
//           onClick={e => {
//             let currentElement = e.currentTarget;
//             let ul = currentElement.nextElementSibling;
//             if (
//               ul.getAttribute("isexpand") === null ||
//               ul.getAttribute("isexpand") === "true"
//             ) {
//               ul.classList.remove("hide");
//               ul.classList.add("show");
//               ul.setAttribute("isexpand", "false");
//             } else {
//               ul.classList.remove("show");
//               ul.classList.add("hide");
//               ul.setAttribute("isexpand", "true");
//             }
//           }}
//           followupid={
//             node !== undefined && node.leafnode === "N"
//               ? node.finance_account_head_id
//               : node !== undefined
//               ? node.head_id
//               : null
//           }
//         >
//           <span>&#x27A5;</span>
//           <span>{node !== undefined ? node["label"] : null}</span>
//           <span>
//             <b>{node !== undefined ? node["subtitle"] : null}</b>
//           </span>
//         </div>
//         <ul className={node.account_level === "0" ? "show" : "hide"}>
//           {node.children.map((innerNode, index) => {
//             let newIndex = Array.isArray(indexIds) ? indexIds : [];
//             newIndex.push(index);
//             return PlotUI(innerNode, style, newIndex);
//           })}
//         </ul>
//       </li>
//     );
//   }
// }

export default function BalanceSheet(props) {
  const { style, data, result, footer } = props;
  const createPrintObject = useRef(undefined);
  if (result.length === 0) return null;
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
            <div>Client Name Here</div>
            <div>Client Address Here</div>
            <hr></hr>
            <h3>Balance Sheet</h3>
            <p>
              As on: <b>Date Here</b>
            </p>
          </div>
          <div className="reportBodyArea">
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data[result[0]], style, [0])}
                  </ul>
                </div>
              </Col>
              <Col span={24}>
                <div className="reportTableStyle">
                  <ul className="treeListUL">
                    {PlotUI(data[result[1]], style, [0])}
                  </ul>{" "}
                </div>
              </Col>
            </Row>
          </div>
          <div className="reportTotalArea">
            <table style={{ width: "100%" }}>
              <tbody>
                <tr className="footerTotalArea">
                  <td style={{ width: "100%" }} valign="top">
                    <b> {typeof footer === "function" ? footer(data) : null}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
